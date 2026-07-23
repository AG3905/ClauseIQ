"use client";

import { useState } from "react";
import { FileText, Search, Clock, ArrowUpRight, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockAuditHistory = [
  { id: "aud-01", name: "Acme Corp – Vendor MSA 2026", type: "Commercial MSA", date: "2026-07-22", riskScore: "74/100", verdict: "danger" as const, label: "Action Req", author: "Senior Counsel" },
  { id: "aud-02", name: "Globex Employment Agreement", type: "HR Employment", date: "2026-07-21", riskScore: "18/100", verdict: "safe" as const, label: "Low Risk", author: "Legal Associate" },
  { id: "aud-03", name: "TechStart NDA – Series A", type: "Legal NDA", date: "2026-07-20", riskScore: "52/100", verdict: "review" as const, label: "Needs Review", author: "Senior Counsel" },
  { id: "aud-04", name: "Cloud Service SLA Agreement", type: "IT SLA", date: "2026-07-18", riskScore: "24/100", verdict: "safe" as const, label: "Low Risk", author: "Contract Spec" },
  { id: "aud-05", name: "Apex Data Processing Addendum", type: "Compliance DPA", date: "2026-07-15", riskScore: "68/100", verdict: "danger" as const, label: "Action Req", author: "DPO Counsel" },
];

const verdictBadges = {
  safe: "badge-risk-safe",
  review: "badge-risk-review",
  danger: "badge-risk-danger",
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");

  const filtered = mockAuditHistory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Register • Archival Ledger</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Contract Audit History</h1>
          <p className="text-xs text-muted-foreground">Archival register of parsed contracts, historical risk assessments, and redlines.</p>
        </div>

        <Button variant="outline" className="h-9 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold">
          <Download className="w-3.5 h-3.5 mr-2" /> Export Ledger CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="paper-card p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contract name, category, or risk score..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-background border-border focus:border-[#8C6721] dark:focus:border-[#C99A52] text-xs font-sans text-foreground"
          />
        </div>
        <Button variant="outline" className="h-10 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold">
          <Filter className="w-3.5 h-3.5 mr-2" /> Filter Category
        </Button>
      </div>

      {/* Audit History Table */}
      <div className="paper-card rounded-lg overflow-hidden border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                <th className="p-4 px-6">Document Agreement Name</th>
                <th className="p-4 px-6">Category</th>
                <th className="p-4 px-6">Audit Date</th>
                <th className="p-4 px-6">Exposure Score</th>
                <th className="p-4 px-6">Verdict State</th>
                <th className="p-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] flex-shrink-0" />
                      <div>
                        <p className="font-serif font-semibold text-foreground text-sm">{item.name}</p>
                        <span className="text-[10px] font-mono text-muted-foreground">ID: {item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6 font-mono text-muted-foreground">{item.type}</td>
                  <td className="p-4 px-6 font-mono text-muted-foreground">{item.date}</td>
                  <td className="p-4 px-6 font-mono font-bold text-foreground">{item.riskScore}</td>
                  <td className="p-4 px-6 font-mono">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-medium ${verdictBadges[item.verdict]}`}>
                      {item.label}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <Link href="/dashboard/analysis-result">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-mono border-border bg-card hover:bg-muted text-foreground font-semibold">
                        View Brief
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
