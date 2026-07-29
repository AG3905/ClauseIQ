import { NextRequest, NextResponse } from "next/server";
import { chatAboutContract } from "@/lib/ai";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { analysisId, question, history } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    let analysisResult: any = null;

    if (analysisId && user?.id) {
      try {
        const { data: dbAnalysis } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();

        if (dbAnalysis?.result) {
          analysisResult = dbAnalysis.result;
        }
      } catch {
        // Table or record query fallback
      }
    }

    const chatOutput = await chatAboutContract(
      analysisResult || { summary: "General contract discussion" },
      question,
      history || []
    );

    const responseText = typeof chatOutput === "string" ? chatOutput : chatOutput.response;
    const references = typeof chatOutput === "object" ? (chatOutput.references || []) : [];

    if (user?.id && analysisId) {
      try {
        // Persist user question
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          analysis_id: analysisId,
          role: "user",
          content: question,
        });

        // Persist assistant response
        await supabase.from("chat_messages").insert({
          user_id: user.id,
          analysis_id: analysisId,
          role: "assistant",
          content: JSON.stringify({ text: responseText, references }),
        });
      } catch (dbErr) {
        console.error("Chat persistence error:", dbErr);
      }
    }

    return NextResponse.json({ response: responseText, references });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed to generate response" }, { status: 500 });
  }
}
