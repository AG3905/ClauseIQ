"use client";

import { useState, useEffect } from "react";
import { GitCompare, FileText, ArrowRight, Shield, Plus, Loader2, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MotionSection, MotionItem } from "@/components/motion";
import { fetchUserAnalyses, AnalysisItem, createBrowserSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/api-config";

interface ComparisonRecord {
  id: string;
  created_at: string;
  result: {
    summary: string;
    riskDelta: number;
    changes: Array<{
      id: string;
      type: "added" | "removed" | "modified";
      section: string;
      original?: string;
      revised?: string;
      riskImpact: "positive" | "negative" | "neutral";
      description: string;
    }>;
  };
}

export default function ComparePage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [pastComparisons, setPastComparisons] = useState<ComparisonRecord[]>([]);
  const [activeComparison, setActiveComparison] = useState<ComparisonRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // New comparison form state
  const [openModal, setOpenModal] = useState(false);
  const [originalId, setOriginalId] = useState("");
  const [revisedId, setRevisedId] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [revisedText, setRevisedText] = useState("");
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const items = await fetchUserAnalyses();
        setAnalyses(items);

        if (items.length >= 2) {
          setOriginalId(items[1].id);
          setRevisedId(items[0].id);
        }

        const supabase = createBrowserSupabaseClient();
        const { data: dbComps, error } = await supabase
          .from("comparisons")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && dbComps && dbComps.length > 0) {
          setPastComparisons(dbComps);
          setActiveComparison(dbComps[0]);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();

    let text1 = originalText;
    let text2 = revisedText;

    if (originalId) {
      const found1 = analyses.find(a => a.id === originalId);
      if (found1?.document_text) text1 = found1.document_text;
    }

    if (revisedId) {
      const found2 = analyses.find(a => a.id === revisedId);
      if (found2?.document_text) text2 = found2.document_text;
    }

    if (!text1.trim() || !text2.trim()) {
      toast.error("Both original and revised contract texts are required for comparison.");
      return;
    }

    setComparing(true);

    try {
      const res = await fetch(getApiUrl("/api/compare"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: text1,
          revised: text2,
          originalAnalysisId: originalId || null,
          revisedAnalysisId: revisedId || null,
        }),
      });

      if (!res.ok) throw new Error("Comparison failed");
      const compData = await res.json();

      const newRec: ComparisonRecord = {
        id: compData.id || "cmp-" + Date.now(),
        created_at: new Date().toISOString(),
        result: compData,
      };

      setPastComparisons(prev => [newRec, ...prev]);
      setActiveComparison(newRec);
      setOpenModal(false);
      toast.success("Comparison completed & saved!");
    } catch (err) {
      console.error(err);
      toast.error("Comparison execution failed.");
    } finally {
      setComparing(false);
    }
  };

  const currentDiff = activeComparison?.result;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Header */}
      <MotionSection amount={0.2} className="pb-4 border-b border-border space-y-1">
        <MotionItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Side-by-Side Redline Diff Engine</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Compare Redline Versions</h1>
            <p className="text-xs text-muted-foreground">Audit modifications between original vendor contract and ClauseIQ counter-proposal.</p>
          </div>

          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger className="inline-flex items-center justify-center rounded bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold px-4 h-9 btn-zoom border border-[#785628] dark:border-[#B38743]">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Run New Comparison
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-xl font-serif font-bold text-foreground">Compare Contract Versions</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRunComparison} className="space-y-4 pt-2">
                {analyses.length >= 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground">Original Version (v1)</label>
                      <select
                        value={originalId}
                        onChange={(e) => setOriginalId(e.target.value)}
                        className="w-full h-9 px-3 bg-background border border-border rounded text-xs font-serif text-foreground"
                      >
                        <option value="">Custom Text Input</option>
                        {analyses.map(a => (
                          <option key={a.id} value={a.id}>{a.document_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground">Revised Version (v2)</label>
                      <select
                        value={revisedId}
                        onChange={(e) => setRevisedId(e.target.value)}
                        className="w-full h-9 px-3 bg-background border border-border rounded text-xs font-serif text-foreground"
                      >
                        <option value="">Custom Text Input</option>
                        {analyses.map(a => (
                          <option key={a.id} value={a.id}>{a.document_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {!originalId && (
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground">Original Contract Text</label>
                    <Textarea
                      placeholder="Paste original contract draft..."
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      className="h-28 text-xs font-serif bg-background border-border"
                    />
                  </div>
                )}

                {!revisedId && (
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground">Revised Counter-Proposal Text</label>
                    <Textarea
                      placeholder="Paste revised contract markup..."
                      value={revisedText}
                      onChange={(e) => setRevisedText(e.target.value)}
                      className="h-28 text-xs font-serif bg-background border-border"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={comparing}
                  className="w-full h-10 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] text-white dark:text-[#171512] text-xs font-semibold"
                >
                  {comparing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run AI Version Diff"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </MotionItem>
      </MotionSection>

      {/* Comparisons History List Bar */}
      {pastComparisons.length > 0 && (
        <MotionSection amount={0.2}>
          <MotionItem>
            <div className="paper-card p-4 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span>Select Saved Diff:</span>
                <select
                  value={activeComparison?.id || ""}
                  onChange={(e) => {
                    const found = pastComparisons.find(c => c.id === e.target.value);
                    if (found) setActiveComparison(found);
                  }}
                  className="h-9 px-3 bg-background border border-border rounded text-xs font-serif font-semibold text-foreground focus:border-[#8C6721]"
                >
                  {pastComparisons.map((c, i) => (
                    <option key={c.id} value={c.id}>
                      Comparison #{pastComparisons.length - i} ({new Date(c.created_at).toLocaleDateString()}) - Risk Delta: {c.result?.riskDelta || 0}
                    </option>
                  ))}
                </select>
              </div>

              {currentDiff?.riskDelta !== undefined && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-muted-foreground">Risk Delta:</span>
                  <span className={`px-2.5 py-0.5 rounded font-bold ${
                    currentDiff.riskDelta <= 0 ? "badge-risk-safe" : "badge-risk-danger"
                  }`}>
                    {currentDiff.riskDelta <= 0 ? `${currentDiff.riskDelta} (Reduced Exposure)` : `+${currentDiff.riskDelta} (Increased Risk)`}
                  </span>
                </div>
              )}
            </div>
          </MotionItem>
        </MotionSection>
      )}

      {/* Comparison Summary Banner */}
      {currentDiff?.summary && (
        <MotionSection amount={0.15}>
          <MotionItem>
            <Card className="paper-card rounded-lg border-border">
              <CardContent className="p-5 space-y-1 font-serif text-xs leading-relaxed text-foreground">
                <span className="font-mono text-[10px] text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider block font-bold">
                  AI Redline Analysis Summary
                </span>
                <p className="italic bg-background p-3 rounded border border-border">
                  "{currentDiff.summary}"
                </p>
              </CardContent>
            </Card>
          </MotionItem>
        </MotionSection>
      )}

      {/* Side-by-Side Changes Breakdown */}
      <MotionSection amount={0.15} className="space-y-4">
        {currentDiff?.changes && currentDiff.changes.length > 0 ? (
          currentDiff.changes.map((change) => (
            <MotionItem key={change.id}>
              <Card className="paper-card paper-card-interactive rounded-lg border-border">
                <CardHeader className="border-b border-border p-4 bg-muted/30 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      change.type === "added" ? "badge-risk-safe" : change.type === "removed" ? "badge-risk-danger" : "badge-risk-review"
                    }`}>
                      {change.type}
                    </span>
                    {change.section}
                  </CardTitle>
                  <span className="text-[11px] font-mono text-muted-foreground">{change.description}</span>
                </CardHeader>
                <CardContent className="p-5 font-serif text-xs leading-relaxed space-y-3">
                  {change.original && (
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">ORIGINAL TEXT (v1)</span>
                      <p className="p-3 bg-background border border-border rounded redline-delete text-foreground">
                        "{change.original}"
                      </p>
                    </div>
                  )}
                  {change.revised && (
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-[#234D34] dark:text-[#4E8B65] uppercase tracking-wider block font-bold">REVISED TEXT (v2)</span>
                      <p className="p-3 bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] rounded redline-insert text-[#154027] dark:text-[#4E8B65]">
                        "{change.revised}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MotionItem>
          ))
        ) : (
          <MotionItem>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Demo Default Comparison View if no comparisons yet */}
              <Card className="paper-card paper-card-interactive rounded-lg border-border group h-full">
                <CardHeader className="border-b border-border p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Original Vendor Draft (v1.0)
                    </CardTitle>
                    <span className="badge-risk-danger px-2.5 py-0.5 rounded text-[10px] font-mono font-medium">Uncapped Exposure</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 font-serif text-xs leading-relaxed text-foreground space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">SECTION 8.2 — LIMITATION OF LIABILITY</span>
                    <p className="p-3 bg-background border border-border rounded">
                      "Neither party shall be liable for indirect damages, except that Provider's total liability shall be <span className="redline-delete">unlimited for IP infringement and confidentiality</span>."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="paper-card paper-card-interactive rounded-lg border-[#8C6721] dark:border-[#C99A52] group h-full">
                <CardHeader className="border-b border-border p-4 bg-[#F9F5EB]/40 dark:bg-[#2A2621]/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-serif font-bold text-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52]" />
                      ClauseIQ Counter-Proposal (v1.1)
                    </CardTitle>
                    <span className="badge-risk-safe px-2.5 py-0.5 rounded text-[10px] font-mono font-medium">Balanced Counter-Proposal</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 font-serif text-xs leading-relaxed text-foreground space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">SECTION 8.2 — LIMITATION OF LIABILITY</span>
                    <p className="p-3 bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] rounded text-[#154027] dark:text-[#4E8B65]">
                      "Neither party shall be liable for indirect damages, except that Provider's total liability shall be <span className="redline-insert">capped at two (2) times total annual fees paid</span>."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </MotionItem>
        )}
      </MotionSection>
    </div>
  );
}
