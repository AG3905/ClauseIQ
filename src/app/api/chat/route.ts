import { NextRequest, NextResponse } from "next/server";
import { chatAboutContract } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { contractText, question, history } = await req.json();

    if (!contractText || !question) {
      return NextResponse.json({ error: "Missing contract text or question" }, { status: 400 });
    }

    const response = await chatAboutContract(contractText, question, history || []);

    return NextResponse.json({ response });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
