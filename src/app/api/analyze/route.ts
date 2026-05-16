import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Contract text is too short. Please provide at least 50 characters." },
        { status: 400 }
      );
    }

    const result = await analyzeContract(text);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please check your Groq API key." },
      { status: 500 }
    );
  }
}
