"use client";

import { GitCompare, FileText, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-border space-y-1">
        <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Side-by-Side Diff Engine</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Compare Redline Versions</h1>
        <p className="text-xs text-muted-foreground">Audit modifications between original vendor contract and ClauseIQ counter-proposal.</p>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Version */}
        <Card className="paper-card rounded-lg border-border">
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
                "Neither party shall be liable for indirect damages, except that Provider's total liability under all causes of action shall be <span className="redline-delete">unlimited for claims arising out of IP infringement and confidentiality</span>."
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">SECTION 12.1 — TERM & RENEWAL</span>
              <p className="p-3 bg-background border border-border rounded">
                "This Agreement shall automatically extend for successive 12-month periods unless cancelled <span className="redline-delete">at least thirty (30) days prior to expiration</span>."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Counter-Proposal Redline Version */}
        <Card className="paper-card rounded-lg border-[#8C6721] dark:border-[#C99A52]">
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
                "Neither party shall be liable for indirect damages, except that Provider's total aggregate liability under all causes of action shall be <span className="redline-insert">capped at two (2) times total fees paid in preceding 12 months</span>."
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">SECTION 12.1 — TERM & RENEWAL</span>
              <p className="p-3 bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] rounded text-[#154027] dark:text-[#4E8B65]">
                "This Agreement shall automatically extend for successive 12-month periods unless cancelled <span className="redline-insert">at least ninety (90) days prior to expiration with written reminder</span>."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
