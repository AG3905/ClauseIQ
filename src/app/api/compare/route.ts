import { NextRequest, NextResponse } from "next/server";
import { compareContracts } from "@/lib/ai";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { original, revised, originalAnalysisId, revisedAnalysisId } = await req.json();

    if (!original || !revised) {
      return NextResponse.json(
        { error: "Both original and revised contract texts are required." },
        { status: 400 }
      );
    }

    const result = await compareContracts(original, revised);

    let comparisonId = "cmp-" + Math.random().toString(36).substring(2, 9);

    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.id) {
        const { data: insertedRow, error: dbError } = await supabase
          .from("comparisons")
          .insert({
            user_id: user.id,
            original_analysis_id: originalAnalysisId || null,
            revised_analysis_id: revisedAnalysisId || null,
            result: result,
          })
          .select("id")
          .single();

        if (!dbError && insertedRow?.id) {
          comparisonId = insertedRow.id;
        }
      }
    } catch (dbErr) {
      console.error("Comparison persistence error:", dbErr);
    }

    return NextResponse.json({ id: comparisonId, ...result });
  } catch (error: unknown) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Contract comparison failed." },
      { status: 500 }
    );
  }
}
