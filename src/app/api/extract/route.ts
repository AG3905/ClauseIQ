import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let text = "";

    if (fileName.endsWith(".txt")) {
      text = await file.text();
    } else if (fileName.endsWith(".pdf")) {
      // Basic PDF text extraction using pdf-parse v2+
      const { PDFParse } = require("pdf-parse");
      const buffer = Buffer.from(await file.arrayBuffer());
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      text = data.text;
    } else if (fileName.endsWith(".docx")) {
      // Basic DOCX text extraction
      const buffer = Buffer.from(await file.arrayBuffer());
      // Simple XML extraction from DOCX for basic text
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(buffer);
      const contentXml = await zip.file("word/document.xml")?.async("string");
      if (contentXml) {
        text = contentXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    } else if (fileName.match(/\.(png|jpg|jpeg)$/)) {
      // OCR for images
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data } = await worker.recognize(buffer);
      text = data.text;
      await worker.terminate();
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from the file" }, { status: 400 });
    }

    return NextResponse.json({ text, fileName: file.name, charCount: text.length });
  } catch (error: any) {
    console.error("Extraction error details:", error);
    return NextResponse.json({ 
      error: "Text extraction failed", 
      details: error?.message || String(error) 
    }, { status: 500 });
  }
}
