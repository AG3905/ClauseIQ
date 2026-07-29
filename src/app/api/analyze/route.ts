import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/ai";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { text, documentName } = await req.json();

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Contract text is too short. Please provide at least 50 characters." },
        { status: 400 }
      );
    }

    const result = await analyzeContract(text);

    let recordId = "aud-" + Math.random().toString(36).substring(2, 9);
    const docName = documentName || "Contract Agreement";

    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.id) {
        const { data: insertedRow, error: dbError } = await supabase
          .from("analyses")
          .insert({
            user_id: user.id,
            document_name: docName,
            document_text: text,
            result: result,
            verdict: result.verdict || "review",
            risk_score: result.riskScore || 50,
            status: "completed"
          })
          .select("id")
          .single();

        if (!dbError && insertedRow?.id) {
          recordId = insertedRow.id;
        }
      }
    } catch (dbErr) {
      console.error("Database persistence error:", dbErr);
    }

    return NextResponse.json({ id: recordId, ...result });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please check your Groq API key." },
      { status: 500 }
    );
  }
}
