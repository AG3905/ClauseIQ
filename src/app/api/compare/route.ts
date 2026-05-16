import { NextRequest, NextResponse } from "next/server";
import { compareContracts } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { original, revised } = await req.json();

    if (!original || !revised) {
      return NextResponse.json(
        { error: "Both original and revised contract texts are required." },
        { status: 400 }
      );
    }

    const result = await compareContracts(original, revised);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Contract comparison failed." },
      { status: 500 }
    );
  }
}
