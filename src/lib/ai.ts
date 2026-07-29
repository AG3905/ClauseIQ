import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

async function callGroqJsonWithRetry(
  messages: any[],
  model = 'llama-3.3-70b-versatile',
  temperature = 0.3,
  max_tokens = 8000
) {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature,
      max_tokens,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    return JSON.parse(content);
  } catch (err) {
    console.warn("First JSON attempt failed or was invalid, attempting retry with strict JSON instruction...", err);

    const retryMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: 'CRITICAL: Your previous response failed JSON parsing. Return ONLY valid, raw JSON. Do not include markdown code block syntax, introductory sentences, or trailing comments.'
      }
    ];

    const completion = await groq.chat.completions.create({
      messages: retryMessages,
      model,
      temperature: 0.1,
      max_tokens,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI retry');

    return JSON.parse(content);
  }
}

export async function analyzeContract(contractText: string) {
  const CHAR_LIMIT_FOR_SINGLE_CALL = 100000; // ~25k tokens

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
}

Analyze EVERY clause. Be thorough. Identify ALL risks, dates, and parties. Return ONLY valid JSON.`;

  // Chunking for large contract text (>25k tokens)
  if (contractText.length > CHAR_LIMIT_FOR_SINGLE_CALL) {
    const chunkSize = 80000;
    const chunks: string[] = [];
    for (let i = 0; i < contractText.length; i += chunkSize) {
      chunks.push(contractText.slice(i, i + chunkSize));
    }

    const mergedRedFlags: any[] = [];
    const mergedClauses: any[] = [];
    const mergedDates: any[] = [];
    const mergedParties: any[] = [];

    const chunkExtractionPrompt = `You are ClauseIQ. Extract all redFlags, clauses, key dates, and parties from this portion of a large legal contract.
Return valid JSON with structure:
{
  "redFlags": [{"id": "rf-1", "title": "...", "description": "...", "severity": "low|medium|high", "clause": "...", "impact": "..."}],
  "clauses": [{"id": "cl-1", "title": "...", "originalText": "...", "explanation": "...", "riskLevel": "low|medium|high", "legalImpact": "...", "negotiationSuggestion": "...", "rewriteOption": "..."}],
  "dates": [{"id": "dt-1", "label": "...", "date": "...", "type": "effective|deadline|renewal|termination|other", "description": "..."}],
  "parties": [{"id": "pt-1", "name": "...", "role": "...", "responsibilities": ["..."]}]
}`;

    for (let idx = 0; idx < chunks.length; idx++) {
      const chunkData = await callGroqJsonWithRetry([
        { role: 'system', content: chunkExtractionPrompt },
        { role: 'user', content: `Contract Chunk ${idx + 1} of ${chunks.length}:\n\n${chunks[idx]}` }
      ]);

      if (chunkData.redFlags) mergedRedFlags.push(...chunkData.redFlags);
      if (chunkData.clauses) mergedClauses.push(...chunkData.clauses);
      if (chunkData.dates) mergedDates.push(...chunkData.dates);
      if (chunkData.parties) mergedParties.push(...chunkData.parties);
    }

    const synthesisPrompt = `${fullSchemaPrompt}\n\nBelow are pre-extracted legal findings from all chunks of this large contract. Synthesize them into a single final analysis JSON matching the exact required schema above.`;

    const synthesisInput = `Extracted Red Flags:\n${JSON.stringify(mergedRedFlags)}\n\nExtracted Clauses:\n${JSON.stringify(mergedClauses)}\n\nExtracted Dates:\n${JSON.stringify(mergedDates)}\n\nExtracted Parties:\n${JSON.stringify(mergedParties)}`;

    return callGroqJsonWithRetry([
      { role: 'system', content: synthesisPrompt },
      { role: 'user', content: synthesisInput }
    ]);
  }

  // Standard single-call analysis
  return callGroqJsonWithRetry([
    { role: 'system', content: fullSchemaPrompt },
    { role: 'user', content: `Analyze this contract:\n\n${contractText}` }
  ]);
}

export async function chatAboutContract(
  analysisResult: any,
  question: string,
  history: { role: string; content: string }[]
) {
  const summaryText = typeof analysisResult === 'string' ? analysisResult : (analysisResult?.summary || '');
  const clauses = analysisResult?.clauses || [];
  const redFlags = analysisResult?.redFlags || [];
  const dates = analysisResult?.dates || [];
  const parties = analysisResult?.parties || [];

  const systemPrompt = `You are ClauseIQ, an expert AI legal assistant. You are helping the user understand a contract that has been audited.

Below is the structured legal analysis of the contract:
- Executive Summary: ${summaryText}
- Risk Verdict: ${analysisResult?.verdict || 'review'} (Exposure Score: ${analysisResult?.riskScore || 50}/100)
- Red Flags: ${JSON.stringify(redFlags)}
- Clause Breakdown: ${JSON.stringify(clauses)}
- Key Dates & Deadlines: ${JSON.stringify(dates)}
- Contracting Parties: ${JSON.stringify(parties)}

Instructions:
1. Answer the user's question clearly, accurately, and in an authoritative legal tone.
2. Ground your answers strictly in the structured clauses, red flags, dates, and provisions provided above.
3. Explicitly name/cite whichever clause titles or section names you reference in your response.
4. Return valid JSON with this exact structure:
{
  "response": "Detailed, professional answer to the user's question",
  "references": ["Array of clause or section titles cited in your answer"]
}`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user' as const, content: question },
  ];

  return callGroqJsonWithRetry(messages, 'llama-3.3-70b-versatile', 0.3, 2500);
}

export async function compareContracts(original: string, revised: string) {
  const systemPrompt = `You are ClauseIQ, an expert AI legal analyst. Compare the two contract versions and identify all changes, additions, and removals. Return valid JSON:
{
  "changes": [
    {
      "id": "ch-1",
      "type": "<added|removed|modified>",
      "section": "Section name",
      "original": "Original text (if applicable)",
      "revised": "Revised text (if applicable)",
      "riskImpact": "<positive|negative|neutral>",
      "description": "What changed and why it matters"
    }
  ],
  "summary": "Overall summary of changes",
  "riskDelta": <number showing risk change from -100 to +100>
}`;

  return callGroqJsonWithRetry([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `ORIGINAL CONTRACT:\n${original}\n\nREVISED CONTRACT:\n${revised}` }
  ]);
}

export { groq };
