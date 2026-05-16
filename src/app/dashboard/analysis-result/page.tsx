"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  FileText, Calendar, Users, MessageSquare, Lightbulb, TrendingDown,
  TrendingUp, Minus, Download, Share2, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { AnalysisResult } from "@/types";

const verdictConfig = {
  safe: { icon: CheckCircle, label: "Safe to Sign", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", glow: "shadow-green-500/20" },
  review: { icon: AlertTriangle, label: "Needs Review", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
  danger: { icon: XCircle, label: "Do Not Sign Yet", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "shadow-red-500/20" },
};

const riskConfig = {
  low: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  high: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

// Demo data for display when no real analysis exists
const demoResult: AnalysisResult = {
  summary: "This is a Master Service Agreement between Acme Corp and TechStart Inc. The contract covers IT consulting services with a 24-month term. Several clauses require attention, particularly around liability caps, auto-renewal terms, and intellectual property assignment.",
  riskScore: 67,
  verdict: "review",
  verdictLabel: "Needs Review",
  verdictReason: "The contract contains several clauses that disproportionately favor one party. Key concerns include unlimited liability exposure, aggressive auto-renewal terms, and broad IP assignment language that could affect your company's core technology.",
  consequences: [
    "Potential unlimited financial liability if service deliverables fail",
    "Automatic 12-month renewal without 90-day prior notice",
    "Broad IP assignment may affect pre-existing intellectual property",
  ],
  topConcerns: [
    "No liability cap specified for direct damages",
    "Auto-renewal clause with short opt-out window",
    "Overly broad intellectual property assignment",
    "One-sided termination rights favoring the service provider",
  ],
  recommendedActions: [
    "Negotiate a liability cap equal to 12 months of fees paid",
    "Request mutual termination rights with 30-day notice",
    "Narrow IP assignment to deliverables created under this agreement",
    "Extend auto-renewal opt-out window to 60 days",
  ],
  nextSteps: [
    "Share the analysis with your legal team for review",
    "Prepare a redline version with suggested amendments",
    "Schedule a negotiation call with the counterparty",
  ],
  redFlags: [
    { id: "rf-1", title: "Unlimited Liability", description: "No cap on direct damages, exposing you to potentially unlimited financial liability.", severity: "high", clause: "Section 8.2 - Limitation of Liability", impact: "Could result in liability exceeding the total contract value" },
    { id: "rf-2", title: "Auto-Renewal Trap", description: "Contract auto-renews for 12-month periods with only a 30-day opt-out window.", severity: "high", clause: "Section 12.1 - Term and Renewal", impact: "You could be locked into an additional year unintentionally" },
    { id: "rf-3", title: "Broad IP Assignment", description: "All work product and related IP is assigned to the client, including pre-existing IP used in deliverables.", severity: "medium", clause: "Section 9.1 - Intellectual Property", impact: "Could lose rights to your own pre-existing technology" },
    { id: "rf-4", title: "One-Sided Termination", description: "Service provider can terminate with 15-day notice, but client requires 90-day notice.", severity: "medium", clause: "Section 12.3 - Termination for Convenience", impact: "Unequal termination rights" },
  ],
  clauses: [
    { id: "cl-1", title: "Limitation of Liability", originalText: "Neither party's aggregate liability shall exceed the fees paid in the twelve (12) months prior to the claim, except for breaches of confidentiality and IP infringement, for which liability shall be unlimited.", explanation: "This clause caps general liability at 12 months of fees, but critically removes that cap for confidentiality breaches and IP infringement claims - meaning you could face unlimited financial exposure.", riskLevel: "high", legalImpact: "Unlimited liability for IP and confidentiality could expose your company to claims far exceeding the contract value.", negotiationSuggestion: "Negotiate a hard cap of 2x annual fees for all liability types, including carve-outs.", rewriteOption: "Neither party's aggregate liability for any and all claims shall exceed two (2) times the total fees paid or payable under this Agreement in the twelve (12) month period preceding the claim." },
    { id: "cl-2", title: "Term and Renewal", originalText: "This Agreement shall auto-renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current term.", explanation: "The contract will automatically renew for another full year unless you send written notice at least 30 days before it expires. This short window could cause you to miss the opt-out deadline.", riskLevel: "high", legalImpact: "Missing the 30-day window locks you into another 12-month commitment.", negotiationSuggestion: "Extend the notice period to 60-90 days and add email notification requirements.", rewriteOption: "This Agreement shall auto-renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term. Provider shall send a renewal reminder notice at least one hundred twenty (120) days before each renewal date." },
    { id: "cl-3", title: "Intellectual Property", originalText: "All Work Product, including all intellectual property rights therein, shall be the sole and exclusive property of Client. Contractor hereby assigns all rights, title, and interest in and to the Work Product.", explanation: "Everything you create under this contract becomes the client's property. This is broadly worded and could potentially include tools and methods you developed independently.", riskLevel: "medium", legalImpact: "Could lose rights to pre-existing IP if incorporated into deliverables.", negotiationSuggestion: "Add explicit carve-out for pre-existing IP and a license-back provision.", rewriteOption: "All Work Product specifically created for Client under this Agreement shall be the property of Client. Pre-existing IP of Contractor incorporated into Work Product shall remain Contractor's property, with Client receiving a perpetual, non-exclusive license to use such pre-existing IP solely as part of the Work Product." },
  ],
  dates: [
    { id: "dt-1", label: "Effective Date", date: "January 15, 2024", type: "effective", description: "The date this agreement becomes legally binding." },
    { id: "dt-2", label: "Renewal Deadline", date: "November 15, 2025", type: "renewal", description: "Last day to send non-renewal notice (30 days before expiry)." },
    { id: "dt-3", label: "Contract Expiry", date: "December 15, 2025", type: "termination", description: "End of current contract term." },
  ],
  parties: [
    { id: "pt-1", name: "Acme Corp", role: "Client", responsibilities: ["Payment of service fees", "Providing access to systems", "Timely feedback on deliverables"] },
    { id: "pt-2", name: "TechStart Inc", role: "Service Provider", responsibilities: ["Delivery of IT consulting services", "Maintaining qualified personnel", "Compliance with security requirements"] },
  ],
  negotiationSuggestions: [
    { id: "ns-1", clauseTitle: "Liability Cap", currentWording: "Liability unlimited for IP and confidentiality breaches", suggestedWording: "Cap all liability at 2x annual fees paid", reason: "Unlimited liability creates disproportionate risk exposure." },
    { id: "ns-2", clauseTitle: "Renewal Period", currentWording: "30-day opt-out window before auto-renewal", suggestedWording: "90-day opt-out window with email reminder at 120 days", reason: "30 days is too short and easy to miss." },
  ],
};

export default function AnalysisResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [docName, setDocName] = useState("");
  const [expandedClauses, setExpandedClauses] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult");
    const name = sessionStorage.getItem("documentName");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { setResult(demoResult); }
    } else {
      setResult(demoResult);
    }
    setDocName(name || "Demo Contract");
  }, []);

  const toggleClause = (id: string) => {
    setExpandedClauses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  if (!result) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" /></div>;

  const vc = verdictConfig[result.verdict];
  const VerdictIcon = vc.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/analyze">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{docName}</h1>
            <p className="text-sm text-muted-foreground">Analysis completed • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10"><Share2 className="w-4 h-4 mr-2" />Share</Button>
          <Button variant="outline" size="sm" className="border-white/10"><Download className="w-4 h-4 mr-2" />Export PDF</Button>
        </div>
      </motion.div>

      {/* Verdict + Risk Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={`glass-card ${vc.border} shadow-lg ${vc.glow}`}>
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl ${vc.bg} ${vc.border} border flex items-center justify-center`}>
                <VerdictIcon className={`w-8 h-8 ${vc.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Verdict</p>
                <p className={`text-2xl font-bold ${vc.color}`}>{result.verdictLabel}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">{result.verdictReason.substring(0, 100)}...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Score</p>
                <span className={`text-3xl font-bold ${result.riskScore > 70 ? "text-red-400" : result.riskScore > 40 ? "text-amber-400" : "text-green-400"}`}>
                  {result.riskScore}/100
                </span>
              </div>
              <Progress value={result.riskScore} className="h-3 mb-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Safe</span><span>Caution</span><span>Danger</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card border-white/5">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4 text-purple-400" />Executive Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p></CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="redflags" className="space-y-4">
        <TabsList className="bg-white/[0.03] border border-white/10 p-1 h-auto flex-wrap">
          <TabsTrigger value="redflags" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Red Flags ({result.redFlags.length})</TabsTrigger>
          <TabsTrigger value="clauses" className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 gap-1.5"><FileText className="w-3.5 h-3.5" />Clauses ({result.clauses.length})</TabsTrigger>
          <TabsTrigger value="dates" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 gap-1.5"><Calendar className="w-3.5 h-3.5" />Dates ({result.dates.length})</TabsTrigger>
          <TabsTrigger value="parties" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 gap-1.5"><Users className="w-3.5 h-3.5" />Parties ({result.parties.length})</TabsTrigger>
          <TabsTrigger value="negotiate" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 gap-1.5"><Lightbulb className="w-3.5 h-3.5" />Negotiate</TabsTrigger>
        </TabsList>

        {/* Red Flags */}
        <TabsContent value="redflags" className="space-y-3">
          {result.redFlags.map((flag, i) => {
            const rc = riskConfig[flag.severity];
            return (
              <motion.div key={flag.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`glass-card ${rc.border}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${rc.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <AlertTriangle className={`w-4 h-4 ${rc.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold">{flag.title}</h4>
                          <Badge variant="outline" className={`text-[10px] ${rc.color} ${rc.border} ${rc.bg}`}>{flag.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                        {flag.clause && <p className="text-xs text-purple-300 mt-2">📌 {flag.clause}</p>}
                        <p className="text-xs text-muted-foreground mt-1">⚠️ Impact: {flag.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Clauses */}
        <TabsContent value="clauses" className="space-y-3">
          {result.clauses.map((clause, i) => {
            const rc = riskConfig[clause.riskLevel];
            const expanded = expandedClauses.includes(clause.id);
            return (
              <motion.div key={clause.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card border-white/5">
                  <div className="p-4 cursor-pointer" onClick={() => toggleClause(clause.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <h4 className="text-sm font-semibold">{clause.title}</h4>
                        <Badge variant="outline" className={`text-[10px] ${rc.color} ${rc.border} ${rc.bg}`}>{clause.riskLevel}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 ml-7">{clause.explanation.substring(0, 120)}...</p>
                  </div>
                  {expanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-4 pb-4 ml-7 space-y-3 border-t border-white/5 pt-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Original Text</p>
                        <p className="text-xs bg-white/[0.02] p-3 rounded-lg italic">{clause.originalText}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Plain English Explanation</p>
                        <p className="text-xs">{clause.explanation}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Legal Impact</p>
                        <p className="text-xs text-amber-300">{clause.legalImpact}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">💡 Negotiation Tip</p>
                        <p className="text-xs text-purple-300">{clause.negotiationSuggestion}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">✏️ Suggested Rewrite</p>
                        <p className="text-xs bg-green-500/5 p-3 rounded-lg border border-green-500/10">{clause.rewriteOption}</p>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Dates */}
        <TabsContent value="dates">
          <div className="space-y-3">
            {result.dates.map((date, i) => (
              <motion.div key={date.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card border-white/5">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{date.label}</p>
                      <p className="text-lg font-bold text-blue-400">{date.date}</p>
                      <p className="text-xs text-muted-foreground">{date.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-[10px]">{date.type}</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Parties */}
        <TabsContent value="parties">
          <div className="grid md:grid-cols-2 gap-4">
            {result.parties.map((party, i) => (
              <motion.div key={party.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card border-white/5">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{party.name}</p>
                        <Badge variant="outline" className="text-[10px]">{party.role}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Responsibilities:</p>
                      {party.responsibilities.map((r, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Negotiate */}
        <TabsContent value="negotiate" className="space-y-4">
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-400" />AI Negotiation Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.negotiationSuggestions.map((ns) => (
                <div key={ns.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                  <h4 className="text-sm font-semibold">{ns.clauseTitle}</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <p className="text-[10px] text-red-400 font-medium mb-1">Current Wording</p>
                      <p className="text-xs">{ns.currentWording}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                      <p className="text-[10px] text-green-400 font-medium mb-1">Suggested Wording</p>
                      <p className="text-xs">{ns.suggestedWording}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">💡 {ns.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-purple-400" />Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 flex-shrink-0">{i + 1}</span>
                  <p className="text-sm">{action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/chat">
          <Button variant="outline" className="border-white/10"><MessageSquare className="w-4 h-4 mr-2" />Ask AI About This Contract</Button>
        </Link>
        <Link href="/dashboard/analyze">
          <Button variant="outline" className="border-white/10"><FileText className="w-4 h-4 mr-2" />Analyze Another</Button>
        </Link>
      </div>
    </div>
  );
}
