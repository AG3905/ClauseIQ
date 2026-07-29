"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, ClipboardPaste, ScanLine, X, CheckCircle, Loader2, AlertTriangle, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { MotionSection, MotionItem } from "@/components/motion";
import { saveUserAnalysisRecord } from "@/lib/supabase";

type UploadMode = "upload" | "paste" | "ocr";

export default function AnalyzePage() {
  const [mode, setMode] = useState<UploadMode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const validateAndSetFile = (f: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "image/png", "image/jpeg"];
    if (!allowed.includes(f.type)) {
      toast.error("Unsupported file format. Please submit PDF, DOCX, TXT, or image files.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File size limit exceeded (Max 10MB).");
      return;
    }
    setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  }, []);

  const handleAnalyze = async () => {
    if (!file && !text.trim()) {
      toast.error("Document content required. Upload a file or paste contract text.");
      return;
    }

    setProcessing(true);
    setStep("Parsing document content...");
    setProgress(15);

    try {
      let contractText = text;

      if (file) {
        setStep("Extracting text and layout schema...");
        setProgress(30);
        const formData = new FormData();
        formData.append("file", file);

        const extractRes = await fetch("/api/extract", { method: "POST", body: formData });
        if (!extractRes.ok) throw new Error("Text extraction failed");
        const extractData = await extractRes.json();
        contractText = extractData.text;
      }

      setStep("Analyzing risk exposure & redlines...");
      setProgress(60);

      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: contractText }),
      });

      if (!analysisRes.ok) throw new Error("Analysis process failed");

      setStep("Formatting redline brief...");
      setProgress(90);

      const analysisData = await analysisRes.json();

      setStep("Saving analysis to workspace register...");
      setProgress(95);

      const docName = file?.name || "Pasted Contract Specimen";
      await saveUserAnalysisRecord({
        document_name: docName,
        document_text: contractText,
        verdict: analysisData.verdict || "review",
        risk_score: analysisData.riskScore || 50,
        result: analysisData
      });

      setStep("Analysis complete.");
      setProgress(100);

      sessionStorage.setItem("analysisResult", JSON.stringify(analysisData));
      sessionStorage.setItem("contractText", contractText);
      sessionStorage.setItem("documentName", docName);

      toast.success("Analysis complete.");

      setTimeout(() => {
        router.push("/dashboard/analysis-result");
      }, 400);
    } catch (error) {
      console.error(error);
      toast.error("Document analysis failed. Please verify configuration and retry.");
      setProcessing(false);
      setProgress(0);
    }
  };

  const fileTypeLabels: Record<string, string> = {
    "application/pdf": "PDF DOCUMENT",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "WORD DOCX",
    "text/plain": "PLAIN TEXT",
    "image/png": "IMAGE PNG",
    "image/jpeg": "IMAGE JPG",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Header */}
      <MotionSection amount={0.2} className="pb-4 border-b border-border space-y-1">
        <MotionItem>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Ingestion & Redline Engine</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Submit Contract for Audit</h1>
          <p className="text-xs text-muted-foreground">
            Upload PDF, DOCX, scanned image or paste clause text for automated risk evaluation and margin redlining.
          </p>
        </MotionItem>
      </MotionSection>

      <MotionSection amount={0.15} className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Upload / Input Workspace */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode Selector Tabs */}
          <MotionItem className="flex gap-2">
            {[
              { mode: "upload" as const, icon: Upload, label: "Upload Document" },
              { mode: "paste" as const, icon: ClipboardPaste, label: "Paste Text" },
              { mode: "ocr" as const, icon: ScanLine, label: "Scanned OCR" },
            ].map((m) => (
              <Button
                key={m.mode}
                variant="outline"
                onClick={() => setMode(m.mode)}
                className={`text-xs font-mono h-9 transition-colors font-semibold btn-zoom ${
                  mode === m.mode
                    ? "bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512] border-[#785628] dark:border-[#B38743] hover:bg-[#6E4E1C]"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
                size="sm"
              >
                <m.icon className="w-3.5 h-3.5 mr-2" />
                {m.label}
              </Button>
            ))}
          </MotionItem>

          {/* Upload / Paste Container */}
          <MotionItem>
            {mode === "paste" ? (
              <Card className="paper-card rounded-lg border-border">
                <CardContent className="p-4">
                  <Textarea
                    aria-label="Paste agreement text"
                    title="Paste agreement text"
                    placeholder="Paste legal agreement text or specific clause provisions here..."
                    className="min-h-[280px] bg-background border-border focus:border-[#8C6721] dark:focus:border-[#C99A52] text-xs font-serif text-foreground leading-relaxed resize-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-2">
                    <span>{text.length} characters • {text.split(/\s+/).filter(Boolean).length} words</span>
                    <span>UTF-8 Document Spec</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={`paper-card paper-card-interactive group cursor-pointer transition-all border-2 border-dashed ${
                  dragging ? "border-[#8C6721] dark:border-[#C99A52] bg-muted/60" : "border-border hover:border-[#8C6721]/60 dark:hover:border-[#C99A52]/60"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInput.current?.click()}
              >
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <input
                    ref={fileInput}
                    type="file"
                    className="hidden"
                    aria-label="Upload contract document file"
                    title="Upload contract document file"
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                  />
                  {file ? (
                    <div className="flex flex-col items-center gap-3 space-y-1">
                      <div className="w-12 h-12 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] icon-box-zoom">
                        <FileText className="w-6 h-6 icon-zoom" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-foreground">{file.name}</p>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          {fileTypeLabels[file.type] || "DOCUMENT FILE"} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-mono text-[#6B1D1D] dark:text-[#E87A7A] hover:bg-[#FCF0F0] dark:hover:bg-[#2C1414] btn-zoom"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Remove File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] mb-3 icon-box-zoom">
                        <Upload className="w-7 h-7 icon-zoom" />
                      </div>
                      <p className="font-serif font-bold text-base text-foreground">Drag & Drop Agreement File</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">or click to browse local filesystem</p>
                      <div className="flex gap-2 font-mono text-[10px]">
                        {["PDF", "DOCX", "TXT", "OCR SCAN"].map((ext) => (
                          <span key={ext} className="px-2.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                            {ext}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </MotionItem>

          {/* Processing Status Block */}
          {processing && (
            <MotionItem>
              <Card className="paper-card rounded-lg border-[#8C6721] dark:border-[#C99A52]">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] animate-spin" />
                    <p className="text-xs font-serif font-semibold text-foreground">{step}</p>
                  </div>
                  <Progress value={progress} className="h-2 bg-muted" />
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>Progress: {progress}%</span>
                    <span>Structured JSON Parsing</span>
                  </div>
                </CardContent>
              </Card>
            </MotionItem>
          )}

          {/* Submit Action Button */}
          {!processing && (
            <MotionItem>
              <Button
                onClick={handleAnalyze}
                className="w-full h-11 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] border border-[#785628] dark:border-[#B38743] shadow-xs text-xs font-semibold btn-zoom"
                disabled={!file && !text.trim()}
              >
                Analyze Document & Generate Redlines
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </MotionItem>
          )}
        </div>

        {/* Right Column: Parameters & Specifications */}
        <MotionItem className="space-y-4">
          <Card className="paper-card paper-card-interactive rounded-lg border-border">
            <CardHeader className="border-b border-border p-4">
              <CardTitle className="text-sm font-serif font-bold text-foreground">Audit Specifications</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 font-sans text-xs">
              {[
                { icon: FileText, title: "Executive Summary", desc: "Produces 2-3 sentence legal overview of commercial terms." },
                { icon: AlertTriangle, title: "Red Flag Exposure", desc: "Flags uncapped liabilities, non-standard indemnities, and termination asymmetry." },
                { icon: CheckCircle, title: "Margin Redlining", desc: "Generates struck-through original text alongside inserted counter-proposal rewrites." },
              ].map((param, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="w-8 h-8 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] flex-shrink-0 icon-box-zoom">
                    <param.icon className="w-4 h-4 icon-zoom" />
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-foreground group-hover:text-[#8C6721] dark:group-hover:text-[#C99A52] transition-colors">{param.title}</p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5">{param.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </MotionItem>
      </MotionSection>
    </div>
  );
}
