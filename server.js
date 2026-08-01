const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Groq } = require("groq-sdk");
const { createClient } = require("@supabase/supabase-js");

// 1. Load environment variables from .env.local and .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...valParts] = trimmed.split("=");
          const value = valParts.join("=").trim().replace(/^["']|["']$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  }
}
loadEnv();

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

// Enable CORS for frontend on port 3000 or any origin in production
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure file upload storage in memory
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Groq AI SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// Initialize Supabase Client if credentials are present
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && !url.includes("placeholder")) {
    return createClient(url, key);
  }
  return null;
}

// AI Helper with retry logic
async function callGroqJsonWithRetry(messages, model = "llama-3.3-70b-versatile", temperature = 0.3, max_tokens = 8000) {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature,
      max_tokens,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");
    return JSON.parse(content);
  } catch (err) {
    console.warn("Retrying AI call with strict JSON instruction...", err);
    const retryMessages = [
      ...messages,
      {
        role: "user",
        content: "CRITICAL: Return ONLY valid, raw JSON. No markdown syntax.",
      },
    ];

    const completion = await groq.chat.completions.create({
      messages: retryMessages,
      model,
      temperature: 0.1,
      max_tokens,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI retry");
    return JSON.parse(content);
  }
}

// ---------------- API ENDPOINTS ---------------- //

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", server: "ClauseIQ Backend API", port: PORT, timestamp: new Date().toISOString() });
});

// Contract Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { text, documentName } = req.body;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: "Contract text is too short. Please provide at least 50 characters." });
    }

    const fullSchemaPrompt = `You are ClauseIQ, an expert AI legal contract analyst. Analyze the contract text provided and return a detailed structured JSON analysis.

Your response MUST be valid JSON with this exact structure:
{
  "summary": "A concise 2-3 sentence summary of the contract",
  "riskScore": <number 0-100>,
  "verdict": "<safe|review|danger>",
  "verdictLabel": "<Safe to Sign|Needs Review|Do Not Sign Yet>",
  "verdictReason": "Detailed explanation of why this verdict was given",
  "consequences": ["Array of real-world consequences if signed as-is"],
  "topConcerns": ["Array of top concerns about this contract"],
  "recommendedActions": ["Array of recommended actions before signing"],
  "nextSteps": ["Array of suggested next steps"],
  "redFlags": [
    {
      "id": "rf-1",
      "title": "Red flag title",
      "description": "Detailed description",
      "severity": "<low|medium|high>",
      "clause": "The specific clause text",
      "impact": "Real-world impact"
    }
  ],
  "clauses": [
    {
      "id": "cl-1",
      "title": "Clause title",
      "originalText": "Original clause text",
      "explanation": "Simple explanation in plain English",
      "riskLevel": "<low|medium|high>",
      "legalImpact": "Legal impact explanation",
      "negotiationSuggestion": "How to negotiate this clause",
      "rewriteOption": "Suggested rewrite of the clause"
    }
  ],
  "dates": [
    {
      "id": "dt-1",
      "label": "Date label",
      "date": "The date value",
      "type": "<effective|deadline|renewal|termination|other>",
      "description": "Context about this date"
    }
  ],
  "parties": [
    {
      "id": "pt-1",
      "name": "Party name",
      "role": "Their role",
      "responsibilities": ["Array of responsibilities"]
    }
  ],
  "negotiationSuggestions": [
    {
      "id": "ns-1",
      "clauseTitle": "Which clause",
      "currentWording": "Current problematic wording",
      "suggestedWording": "Suggested safer wording",
      "reason": "Why this change is recommended"
    }
  ]
}`;

    const result = await callGroqJsonWithRetry([
      { role: "system", content: fullSchemaPrompt },
      { role: "user", content: `Analyze this contract:\n\n${text}` },
    ]);

    let recordId = "aud-" + Math.random().toString(36).substring(2, 9);
    const docName = documentName || "Contract Agreement";

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: insertedRow, error: dbError } = await supabase
          .from("analyses")
          .insert({
            document_name: docName,
            document_text: text,
            result: result,
            verdict: result.verdict || "review",
            risk_score: result.riskScore || 50,
            status: "completed",
          })
          .select("id")
          .single();

        if (!dbError && insertedRow?.id) {
          recordId = insertedRow.id;
        }
      } catch (dbErr) {
        console.error("Database persistence error:", dbErr);
      }
    }

    return res.json({ id: recordId, ...result });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({ error: "Analysis failed. Please check your Groq API key." });
  }
});

// Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { analysisId, question, history } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing question" });
    }

    let analysisResult = null;
    const supabase = getSupabaseClient();
    if (supabase && analysisId) {
      try {
        const { data: dbAnalysis } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();

        if (dbAnalysis?.result) {
          analysisResult = dbAnalysis.result;
        }
      } catch (e) {
        // Fallback
      }
    }

    const summaryText = typeof analysisResult === "string" ? analysisResult : analysisResult?.summary || "";
    const clauses = analysisResult?.clauses || [];
    const redFlags = analysisResult?.redFlags || [];
    const dates = analysisResult?.dates || [];
    const parties = analysisResult?.parties || [];

    const systemPrompt = `You are ClauseIQ, an expert AI legal assistant.
Executive Summary: ${summaryText}
Risk Verdict: ${analysisResult?.verdict || "review"}
Red Flags: ${JSON.stringify(redFlags)}
Clauses: ${JSON.stringify(clauses)}
Dates: ${JSON.stringify(dates)}
Parties: ${JSON.stringify(parties)}

Answer the user's question clearly and return valid JSON with format:
{
  "response": "Detailed answer",
  "references": ["Cited clause titles"]
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: question },
    ];

    const chatOutput = await callGroqJsonWithRetry(messages, "llama-3.3-70b-versatile", 0.3, 2500);

    const responseText = typeof chatOutput === "string" ? chatOutput : chatOutput.response;
    const references = typeof chatOutput === "object" ? chatOutput.references || [] : [];

    return res.json({ response: responseText, references });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Chat failed to generate response" });
  }
});

// Compare Endpoint
app.post("/api/compare", async (req, res) => {
  try {
    const { original, revised } = req.body;

    if (!original || !revised) {
      return res.status(400).json({ error: "Both original and revised texts are required." });
    }

    const systemPrompt = `You are ClauseIQ, an expert AI legal analyst. Compare the two contract versions and identify all changes. Return valid JSON:
{
  "changes": [
    {
      "id": "ch-1",
      "type": "<added|removed|modified>",
      "section": "Section name",
      "original": "Original text",
      "revised": "Revised text",
      "riskImpact": "<positive|negative|neutral>",
      "description": "What changed and why it matters"
    }
  ],
  "summary": "Overall summary of changes",
  "riskDelta": <number showing risk change from -100 to +100>
}`;

    const result = await callGroqJsonWithRetry([
      { role: "system", content: systemPrompt },
      { role: "user", content: `ORIGINAL CONTRACT:\n${original}\n\nREVISED CONTRACT:\n${revised}` },
    ]);

    return res.json({ id: "cmp-" + Date.now(), ...result });
  } catch (error) {
    console.error("Comparison error:", error);
    return res.status(500).json({ error: "Comparison failed." });
  }
});

// Document Text Extraction Endpoint
app.post("/api/extract", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const fileName = file.originalname.toLowerCase();
    let text = "";

    if (fileName.endsWith(".txt")) {
      text = file.buffer.toString("utf8");
    } else if (fileName.endsWith(".pdf")) {
      const { PDFParse } = require("pdf-parse");
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      text = data.text;
    } else if (fileName.endsWith(".docx")) {
      const JSZip = require("jszip");
      const zip = await JSZip.loadAsync(file.buffer);
      const contentXml = await zip.file("word/document.xml")?.async("string");
      if (contentXml) {
        text = contentXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    } else if (fileName.match(/\.(png|jpg|jpeg)$/)) {
      const { createWorker } = require("tesseract.js");
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file.buffer);
      text = data.text;
      await worker.terminate();
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    if (!text.trim()) {
      return res.status(400).json({ error: "Could not extract text from the file" });
    }

    return res.json({ text, fileName: file.originalname, charCount: text.length });
  } catch (error) {
    console.error("Extraction error:", error);
    return res.status(500).json({ error: "Text extraction failed", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 ClauseIQ Backend API server listening on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available: /api/health, /api/analyze, /api/chat, /api/compare, /api/extract`);
});
