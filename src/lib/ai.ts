import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function analyzeContract(contractText: string) {
  const systemPrompt = `You are ClauseIQ, an expert AI legal contract analyst. Analyze the contract text provided and return a detailed structured JSON analysis.

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

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analyze this contract:\n\n${contractText}` },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 8000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  return JSON.parse(content);
}

export async function chatAboutContract(contractText: string, question: string, history: { role: string; content: string }[]) {
  const systemPrompt = `You are ClauseIQ, an expert AI legal assistant. You are helping the user understand a specific contract they uploaded. Answer their questions clearly, citing specific clauses when relevant. Be helpful, accurate, and concise.

Contract text:
${contractText}`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user' as const, content: question },
  ];

  const completion = await groq.chat.completions.create({
    messages,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content || 'I could not generate a response.';
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

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `ORIGINAL CONTRACT:\n${original}\n\nREVISED CONTRACT:\n${revised}` },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  return JSON.parse(content);
}

export { groq };
