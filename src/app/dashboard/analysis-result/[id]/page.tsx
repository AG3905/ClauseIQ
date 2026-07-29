"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  FileText, Calendar, Share2, Download, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { AnalysisResult } from "@/types";
import { MotionSection, MotionItem } from "@/components/motion";
import { createBrowserSupabaseClient } from "@/lib/supabase";

import { pdf } from "@react-pdf/renderer";
import { ContractAuditPdfDocument } from "@/components/pdf-report";
import { toast } from "sonner";

const verdictConfig = {
  safe: {
    icon: CheckCircle,
    label: "Safe to Sign",
    color: "text-[#234D34] dark:text-[#4E8B65]",
    bg: "bg-[#EDF4EF] dark:bg-[#1B2E21]",
    border: "border-[#BCD4C4] dark:border-[#2C4F37]",
    badge: "badge-risk-safe"
  },
  review: {
    icon: AlertTriangle,
    label: "Needs Review",
    color: "text-[#6E4410] dark:text-[#E5A85C]",
    bg: "bg-[#FBF4E8] dark:bg-[#2B1F10]",
    border: "border-[#E6CFAB] dark:border-[#4D361C]",
    badge: "badge-risk-review"
  },
  danger: {
    icon: XCircle,
    label: "Do Not Sign Yet",
    color: "text-[#6B1D1D] dark:text-[#E87A7A]",
    bg: "bg-[#FCF0F0] dark:bg-[#2C1414]",
    border: "border-[#E8BCBC] dark:border-[#4D2222]",
    badge: "badge-risk-danger"
  },
};

const riskConfig = {
  low: { badge: "badge-risk-safe", rule: "margin-rule-low", text: "text-[#234D34] dark:text-[#4E8B65]" },
  medium: { badge: "badge-risk-review", rule: "margin-rule-medium", text: "text-[#6E4410] dark:text-[#E5A85C]" },
  high: { badge: "badge-risk-danger", rule: "margin-rule-high", text: "text-[#6B1D1D] dark:text-[#E87A7A]" },
};

export default function DynamicAnalysisResultPage() {
  const params = useParams();
  const analysisId = params?.id as string;

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [docName, setDocName] = useState("");
  const [auditDate, setAuditDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [expandedClauses, setExpandedClauses] = useState<string[]>(["cl-1"]);

  useEffect(() => {
    async function loadAnalysis() {
      if (!analysisId) return;

      try {
        const supabase = createBrowserSupabaseClient();
        const { data: dbRow, error } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();

        if (!error && dbRow && dbRow.result) {
          setResult(dbRow.result);
          setDocName(dbRow.document_name || "Contract Agreement");
          setAuditDate(new Date(dbRow.created_at).toLocaleDateString());
          setLoading(false);
          return;
        }
      } catch {
        // Fall back to local session storage
      }

      const stored = sessionStorage.getItem("analysisResult");
      const name = sessionStorage.getItem("documentName");
      if (stored) {
        try {
          setResult(JSON.parse(stored));
        } catch {
          setResult(null);
        }
      }
      setDocName(name || "Contract Agreement");
      setAuditDate(new Date().toLocaleDateString());
      setLoading(false);
    }

    loadAnalysis();
  }, [analysisId]);

  const handleExportPdf = async () => {
    if (!result) return;
    setExportingPdf(true);
    try {
      const blob = await pdf(<ContractAuditPdfDocument documentName={docName} result={result} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${docName.replace(/\s+/g, "_")}_ClauseIQ_Redline.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDF report downloaded successfully!");
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Failed to generate PDF report");
    } finally {
      setExportingPdf(false);
    }
  };

  const toggleClause = (id: string) => {
    setExpandedClauses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <div className="w-8 h-8 border-2 border-[#8C6721] dark:border-[#C99A52] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-muted-foreground">Retrieving audit record from register...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto text-center p-12 space-y-4">
        <AlertTriangle className="w-10 h-10 mx-auto text-[#8C6721] dark:text-[#C99A52]" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Analysis Record Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested contract audit record could not be loaded or has been deleted.</p>
        <Link href="/dashboard/history">
          <Button className="bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold px-4 h-9">
            Return to Audit Register
          </Button>
        </Link>
      </div>
    );
  }

  const verdictKey = result.verdict && verdictConfig[result.verdict] ? result.verdict : "review";
  const vc = verdictConfig[verdictKey];
  const VerdictIcon = vc.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Editorial Header */}
      <MotionSection amount={0.2} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <MotionItem className="flex items-center gap-3">
          <Link href="/dashboard/history">
            <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted text-foreground btn-zoom">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              <span>Audit Record ID: {analysisId.slice(0, 8)}...</span>
              <span>•</span>
              <span>{auditDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">{docName}</h1>
          </div>
        </MotionItem>
        <MotionItem className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold btn-zoom">
            <Share2 className="w-3.5 h-3.5 mr-2" /> Share Brief
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exportingPdf}
            onClick={handleExportPdf}
            className="h-9 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold btn-zoom"
          >
            <Download className="w-3.5 h-3.5 mr-2" /> {exportingPdf ? "Generating PDF..." : "Export PDF Redline"}
          </Button>
        </MotionItem>
      </MotionSection>

      {/* Verdict & Exposure Score Bar */}
      <MotionSection amount={0.15} className="grid md:grid-cols-2 gap-6">
        {/* Verdict Seal */}
        <MotionItem>
          <div className={`paper-card paper-card-interactive p-6 rounded-lg ${vc.border} ${vc.bg} space-y-3 group`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Audit Verdict Seal</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium ${vc.badge}`}>
                {vc.label}
              </span>
            </div>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${vc.bg} border ${vc.border} icon-box-zoom`}>
                <VerdictIcon className={`w-7 h-7 ${vc.color} icon-zoom`} />
              </div>
              <div>
                <p className={`text-2xl font-serif font-bold ${vc.color}`}>{result.verdictLabel || vc.label}</p>
                <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">{result.verdictReason}</p>
              </div>
            </div>
          </div>
        </MotionItem>

        {/* Risk Exposure Score */}
        <MotionItem>
          <div className="paper-card paper-card-interactive p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Exposure Index</span>
              <span className="font-mono text-2xl font-bold text-[#6B1D1D] dark:text-[#E87A7A]">
                {result.riskScore}<span className="text-xs text-muted-foreground">/100</span>
              </span>
            </div>
            <Progress value={result.riskScore} className="h-2 bg-muted" />
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span className="text-[#234D34] dark:text-[#4E8B65]">0-30 (Standard)</span>
              <span className="text-[#6E4410] dark:text-[#E5A85C]">31-65 (Caution)</span>
              <span className="text-[#6B1D1D] dark:text-[#E87A7A]">66-100 (High Risk)</span>
            </div>
          </div>
        </MotionItem>
      </MotionSection>

      {/* Executive Summary */}
      {result.summary && (
        <MotionSection amount={0.15}>
          <MotionItem>
            <div className="paper-card paper-card-interactive p-6 rounded-lg space-y-2 group">
              <h2 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                  <FileText className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                </div>
                Executive Brief Summary
              </h2>
              <p className="text-xs font-serif text-foreground leading-relaxed italic bg-background p-4 rounded border border-border">
                "{result.summary}"
              </p>
            </div>
          </MotionItem>
        </MotionSection>
      )}

      {/* Tabs Section */}
      <MotionSection amount={0.1} className="space-y-6">
        <MotionItem>
          <Tabs defaultValue="clauses" className="space-y-6">
            <TabsList className="bg-muted border border-border p-1 gap-1">
              <TabsTrigger value="clauses" className="text-xs font-mono font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground btn-zoom">
                Clause Breakdown ({(result.clauses || []).length})
              </TabsTrigger>
              <TabsTrigger value="redflags" className="text-xs font-mono font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground btn-zoom">
                Red Flags ({(result.redFlags || []).length})
              </TabsTrigger>
              <TabsTrigger value="dates" className="text-xs font-mono font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground btn-zoom">
                Key Deadlines ({(result.dates || []).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clauses" className="space-y-4">
              {(result.clauses || []).map((clause) => {
                const isExpanded = expandedClauses.includes(clause.id);
                const rLevel = clause.riskLevel && riskConfig[clause.riskLevel] ? clause.riskLevel : "medium";
                const rc = riskConfig[rLevel];
                return (
                  <div key={clause.id} className={`paper-card paper-card-interactive rounded-lg p-6 ${rc.rule} space-y-4`}>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleClause(clause.id)}>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase ${rc.badge}`}>
                          {clause.riskLevel} exposure
                        </span>
                        <h3 className="text-base font-serif font-bold text-foreground">{clause.title}</h3>
                      </div>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </div>

                    <div className="space-y-3 font-serif text-sm">
                      <div className="p-3 bg-background border border-border rounded font-serif text-xs leading-relaxed text-foreground">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase block mb-1">ORIGINAL CLAUSE PROVISION:</span>
                        "{clause.originalText}"
                      </div>

                      {clause.rewriteOption && (
                        <div className="p-3 bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] rounded font-serif text-xs leading-relaxed text-[#154027] dark:text-[#4E8B65]">
                          <span className="font-mono text-[10px] text-[#234D34] dark:text-[#4E8B65] uppercase block mb-1 font-bold">PROPOSED REDLINE REWRITE:</span>
                          "{clause.rewriteOption}"
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-border space-y-2 text-xs font-sans">
                        <p className="text-muted-foreground"><strong className="text-foreground font-mono">Analysis:</strong> {clause.explanation}</p>
                        <p className="text-muted-foreground"><strong className="text-foreground font-mono">Negotiation Strategy:</strong> {clause.negotiationSuggestion}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="redflags" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {(result.redFlags || []).map((rf) => (
                  <div key={rf.id} className="paper-card paper-card-interactive p-5 rounded-lg space-y-3 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#6B1D1D] dark:text-[#E87A7A] uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 icon-zoom" />
                        {rf.clause}
                      </span>
                      <span className="badge-risk-danger px-2 py-0.5 rounded text-[10px] font-mono">HIGH</span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-foreground">{rf.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">{rf.description}</p>
                    <div className="pt-2 border-t border-border text-[11px] font-mono text-muted-foreground">
                      <span>Exposure Impact: </span>
                      <span className="text-foreground font-medium">{rf.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dates" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {(result.dates || []).map((dt) => (
                  <div key={dt.id} className="paper-card paper-card-interactive p-5 rounded-lg space-y-2 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{dt.label}</span>
                      <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                        <Calendar className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                      </div>
                    </div>
                    <p className="text-lg font-serif font-bold text-foreground">{dt.date}</p>
                    <p className="text-xs text-muted-foreground font-sans">{dt.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </MotionItem>
      </MotionSection>
    </div>
  );
}
