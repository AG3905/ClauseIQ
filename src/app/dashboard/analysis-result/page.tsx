"use client";

import { useEffect, useState } from "react";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  FileText, Calendar, Users, MessageSquare, Download, Share2, ArrowLeft, GitCompare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { AnalysisResult } from "@/types";

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

const demoResult: AnalysisResult = {
  summary: "This Master Service Agreement governs IT consulting deliverables between Acme Corp and TechStart Inc over a 24-month term. Key provisions requiring negotiation include uncapped indemnification for IP claims, an aggressive 30-day auto-renewal notification window, and broad pre-existing intellectual property assignment.",
  riskScore: 67,
  verdict: "review",
  verdictLabel: "Needs Review",
  verdictReason: "The agreement imposes asymmetric liability exposure on the service provider without a reciprocal direct damages cap. Furthermore, the auto-renewal term features a narrow 30-day non-renewal opt-out window that poses unintentional rollover risk.",
  consequences: [
    "Potential unlimited financial liability exposure for third-party IP claims",
    "Automatic 12-month contract extension without mandatory email notification",
    "Broad IP assignment clause risks encumbering contractor's core pre-existing technology",
  ],
  topConcerns: [
    "No aggregate liability cap specified for direct damages",
    "Auto-renewal clause with narrow 30-day notice requirement",
    "Overly broad IP assignment without explicit pre-existing IP carve-out",
    "Asymmetric termination for convenience rights",
  ],
  recommendedActions: [
    "Negotiate a hard liability cap equal to 2x total annual fees paid",
    "Extend auto-renewal non-renewal notification window from 30 to 90 days",
    "Insert express carve-out reserving contractor's pre-existing IP rights",
    "Establish mutual 30-day termination for convenience rights",
  ],
  nextSteps: [
    "Share structured redline brief with internal legal team",
    "Issue redline markup to counterparty counsel",
    "Schedule formal negotiation call regarding liability caps",
  ],
  redFlags: [
    { id: "rf-1", title: "Unlimited IP Liability", description: "Carve-out removes liability cap for confidentiality and IP claims, exposing firm to uncapped damages.", severity: "high", clause: "Section 8.2 - Limitation of Liability", impact: "Financial exposure exceeding contract value" },
    { id: "rf-2", title: "Narrow Auto-Renewal Opt-Out", description: "Agreement extends for 12 months unless non-renewal notice is delivered at least 30 days prior.", severity: "high", clause: "Section 12.1 - Term and Renewal", impact: "Unintended annual lock-in" },
    { id: "rf-3", title: "Broad Pre-Existing IP Assignment", description: "All work product and underlying tools are assigned exclusively to client upon creation.", severity: "medium", clause: "Section 9.1 - Intellectual Property", impact: "Loss of proprietary pre-existing IP" },
    { id: "rf-4", title: "Asymmetric Convenience Termination", description: "Client may terminate on 15 days notice, while provider requires 90 days prior notice.", severity: "medium", clause: "Section 12.3 - Termination Rights", impact: "Operational imbalance" },
  ],
  clauses: [
    { id: "cl-1", title: "Limitation of Liability", originalText: "Neither party's aggregate liability shall exceed fees paid in the twelve (12) months prior to the claim, except for breaches of confidentiality and IP infringement, for which liability shall be unlimited.", explanation: "This provision caps general contract damages but leaves liability completely uncapped for IP infringement and confidentiality breaches.", riskLevel: "high", legalImpact: "Uncapped liability exposes company to financial damages exceeding annual contract value.", negotiationSuggestion: "Establish a hard liability cap of 2x total annual fees paid for all claim categories.", rewriteOption: "Neither party's aggregate liability for any and all claims arising under or related to this Agreement shall exceed two times (2x) the total fees paid or payable under this Agreement in the twelve (12) month period preceding the claim." },
    { id: "cl-2", title: "Term and Renewal", originalText: "This Agreement shall auto-renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the current term.", explanation: "The contract automatically extends for another full year unless written non-renewal notice is served 30 days before expiration.", riskLevel: "high", legalImpact: "Narrow 30-day notice window creates significant risk of missing non-renewal deadlines.", negotiationSuggestion: "Extend opt-out notification window to 90 days and require written reminder notice.", rewriteOption: "This Agreement shall auto-renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term. Provider shall issue a written renewal reminder at least one hundred twenty (120) days prior to term expiration." },
    { id: "cl-3", title: "Intellectual Property", originalText: "All Work Product, including all intellectual property rights therein, shall be the sole and exclusive property of Client. Contractor hereby assigns all rights, title, and interest in and to Work Product.", explanation: "Assigns all created deliverables and underlying technology exclusively to client without reserving contractor's pre-existing IP.", riskLevel: "medium", legalImpact: "May transfer ownership of contractor's background IP or core tools incorporated into deliverables.", negotiationSuggestion: "Add explicit carve-out protecting pre-existing IP and grant client a non-exclusive license.", rewriteOption: "All Work Product specifically created for Client under this Agreement shall belong to Client. Pre-existing IP of Contractor incorporated into Work Product remains Contractor's sole property, subject to a perpetual, non-exclusive, royalty-free license to Client solely for utilizing Work Product." },
  ],
  dates: [
    { id: "dt-1", label: "Effective Date", date: "January 15, 2026", type: "effective", description: "Commencement date of legal obligations." },
    { id: "dt-2", label: "Non-Renewal Deadline", date: "November 15, 2027", type: "renewal", description: "Last day to deliver written non-renewal notice (30-day window)." },
    { id: "dt-3", label: "Term Expiration", date: "December 15, 2027", type: "termination", description: "End of initial 24-month agreement term." },
  ],
  parties: [
    { id: "pt-1", name: "Acme Corp", role: "Client / Counterparty", responsibilities: ["Timely payment of invoices", "Provision of system credentials", "Review of milestone deliverables"] },
    { id: "pt-2", name: "TechStart Inc", role: "Service Provider / Client", responsibilities: ["Delivery of IT consulting services", "Compliance with security standards", "Maintenance of staffing levels"] },
  ],
  negotiationSuggestions: [
    { id: "ns-1", clauseTitle: "Section 8.2 — Aggregate Liability Cap", currentWording: "Liability shall be unlimited for breaches of confidentiality and IP infringement.", suggestedWording: "Neither party's aggregate liability for all claims shall exceed two (2) times total annual fees.", reason: "Uncapped liability creates disproportionate catastrophic exposure." },
    { id: "ns-2", clauseTitle: "Section 12.1 — Renewal Opt-Out Window", currentWording: "Written notice of non-renewal at least thirty (30) days prior to term expiration.", suggestedWording: "Written notice of non-renewal at least ninety (90) days prior with 120-day reminder.", reason: "30-day window is narrow and easy to miss operationally." },
  ],
};

export default function AnalysisResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [docName, setDocName] = useState("");
  const [expandedClauses, setExpandedClauses] = useState<string[]>(["cl-1"]);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    const name = sessionStorage.getItem("documentName");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { setResult(demoResult); }
    } else {
      setResult(demoResult);
    }
    setDocName(name || "Acme_Vendor_MSA_2026.pdf");
  }, []);

  const toggleClause = (id: string) => {
    setExpandedClauses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  if (!result) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-[#8C6721] dark:border-[#C99A52] border-t-transparent rounded-full animate-spin" /></div>;

  const vc = verdictConfig[result.verdict];
  const VerdictIcon = vc.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/analyze">
            <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              <span>Audit Record</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">{docName}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold">
            <Share2 className="w-3.5 h-3.5 mr-2" /> Share Brief
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold">
            <Download className="w-3.5 h-3.5 mr-2" /> Export PDF Redline
          </Button>
        </div>
      </div>

      {/* Verdict & Exposure Score Bar */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Verdict Seal */}
        <div className={`paper-card p-6 rounded-lg ${vc.border} ${vc.bg} space-y-3`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Audit Verdict Seal</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-medium ${vc.badge}`}>
              {vc.label}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${vc.bg} border ${vc.border}`}>
              <VerdictIcon className={`w-7 h-7 ${vc.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-serif font-bold ${vc.color}`}>{result.verdictLabel}</p>
              <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">{result.verdictReason}</p>
            </div>
          </div>
        </div>

        {/* Risk Exposure Score */}
        <div className="paper-card p-6 rounded-lg space-y-4">
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
      </div>

      {/* Executive Summary */}
      <div className="paper-card p-6 rounded-lg space-y-2">
        <h2 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52]" />
          Executive Brief Summary
        </h2>
        <p className="text-xs font-serif text-foreground leading-relaxed italic bg-background p-4 rounded border border-border">
          "{result.summary}"
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="clauses" className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 gap-1">
          <TabsTrigger value="clauses" className="text-xs font-mono font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground">
            Clause Breakdown ({result.clauses.length})
          </TabsTrigger>
          <TabsTrigger value="redflags" className="text-xs font-mono font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground">
            Red Flags ({result.redFlags.length})
          </TabsTrigger>
          <TabsTrigger value="dates" className="text-xs font-mono font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground">
            Key Deadlines ({result.dates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clauses" className="space-y-4">
          {result.clauses.map((clause) => {
            const isExpanded = expandedClauses.includes(clause.id);
            const rc = riskConfig[clause.riskLevel];
            return (
              <div key={clause.id} className={`paper-card rounded-lg p-6 ${rc.rule} space-y-4`}>
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
            {result.redFlags.map((rf) => (
              <div key={rf.id} className="paper-card p-5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#6B1D1D] dark:text-[#E87A7A] uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
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
            {result.dates.map((dt) => (
              <div key={dt.id} className="paper-card p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{dt.label}</span>
                  <Calendar className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52]" />
                </div>
                <p className="text-lg font-serif font-bold text-foreground">{dt.date}</p>
                <p className="text-xs text-muted-foreground font-sans">{dt.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
