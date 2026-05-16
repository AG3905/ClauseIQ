"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload, FileText, Image, ClipboardPaste, ScanLine,
  File, X, CheckCircle, Loader2, AlertTriangle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  }, []);

  const validateAndSetFile = (f: File) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "image/png", "image/jpeg"];
    if (!allowed.includes(f.type)) {
      toast.error("Unsupported file type. Please upload PDF, DOCX, TXT, or image files.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file && !text.trim()) {
      toast.error("Please upload a file or paste contract text.");
      return;
    }

    setProcessing(true);
    setStep("Uploading document...");
    setProgress(10);

    try {
      let contractText = text;

      if (file) {
        setStep("Extracting text from document...");
        setProgress(25);
        const formData = new FormData();
        formData.append("file", file);

        const extractRes = await fetch("/api/extract", { method: "POST", body: formData });
        if (!extractRes.ok) throw new Error("Text extraction failed");
        const extractData = await extractRes.json();
        contractText = extractData.text;
      }

      setStep("AI is analyzing the contract...");
      setProgress(50);

      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: contractText }),
      });

      if (!analysisRes.ok) throw new Error("Analysis failed");

      setStep("Generating insights...");
      setProgress(85);

      const analysisData = await analysisRes.json();

      setStep("Complete!");
      setProgress(100);

      // Store in sessionStorage for results page
      sessionStorage.setItem("analysisResult", JSON.stringify(analysisData));
      sessionStorage.setItem("contractText", contractText);
      sessionStorage.setItem("documentName", file?.name || "Pasted Contract");

      setTimeout(() => {
        router.push("/dashboard/analysis-result");
      }, 500);
    } catch (error) {
      toast.error("Analysis failed. Please check your API keys and try again.");
      setProcessing(false);
      setProgress(0);
    }
  };

  const fileTypeIcons: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "text/plain": "TXT",
    "image/png": "PNG",
    "image/jpeg": "JPG",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Document Analysis</h1>
        <p className="text-muted-foreground">
          Upload legal contracts, briefs, or case files for AI-driven extraction and risk assessment.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode Tabs */}
          <div className="flex gap-2">
            {[
              { mode: "upload" as const, icon: Upload, label: "Upload File" },
              { mode: "paste" as const, icon: ClipboardPaste, label: "Paste Text" },
              { mode: "ocr" as const, icon: ScanLine, label: "OCR Scan" },
            ].map((m) => (
              <Button
                key={m.mode}
                variant={mode === m.mode ? "default" : "outline"}
                onClick={() => setMode(m.mode)}
                className={mode === m.mode 
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30" 
                  : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"}
                size="sm"
              >
                <m.icon className="w-4 h-4 mr-2" />
                {m.label}
              </Button>
            ))}
          </div>

          {/* Upload / Paste Area */}
          <AnimatePresence mode="wait">
            {mode === "paste" ? (
              <motion.div
                key="paste"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="glass-card border-white/5">
                  <CardContent className="p-4">
                    <Textarea
                      placeholder="Paste your contract text here..."
                      className="min-h-[300px] bg-transparent border-white/10 focus:border-purple-500/30 resize-none"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {text.length} characters • {text.split(/\s+/).filter(Boolean).length} words
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card
                  className={`glass-card cursor-pointer transition-all ${
                    dragging ? "border-purple-500/50 bg-purple-500/5" : "border-white/5"
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
                      accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    />
                    {file ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                          <FileText className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {fileTypeIcons[file.type] || "FILE"} • {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >
                          <X className="w-3 h-3 mr-1" /> Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="font-medium mb-1">Drag & Drop Documents</p>
                        <p className="text-sm text-muted-foreground mb-4">or click to browse from your device</p>
                        <div className="flex gap-2">
                          {["PDF", "DOCX", "TXT"].map((ext) => (
                            <span key={ext} className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {ext}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing State */}
          <AnimatePresence>
            {processing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="glass-card border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      <p className="text-sm font-medium">{step}</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          {!processing && (
            <Button
              onClick={handleAnalyze}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20 text-base"
              disabled={!file && !text.trim()}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze Document
            </Button>
          )}
        </div>

        {/* Right Panel - Analysis Params */}
        <div className="space-y-4">
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="text-base">Analysis Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: FileText, title: "Executive Summary", desc: "Generate a high-level overview of obligations and terms." },
                { icon: AlertTriangle, title: "Risk Assessment", desc: "Identify non-standard clauses, unlimited liabilities, and missing boilerplate.", badges: ["High Risk", "Anomalies"] },
                { icon: CheckCircle, title: "Compliance Check", desc: "Cross-reference with internal playbooks and standard frameworks." },
              ].map((param, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <param.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{param.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{param.desc}</p>
                    {param.badges && (
                      <div className="flex gap-1.5 mt-2">
                        {param.badges.map((b) => (
                          <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">{b}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
