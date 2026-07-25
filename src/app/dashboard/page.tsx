"use client";

import {
  FileText, AlertTriangle, Upload,
  ArrowUpRight, Shield, Clock, FileCheck, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { MotionSection, MotionItem } from "@/components/motion";

const chartData = [
  { name: "Mon", analyses: 4 },
  { name: "Tue", analyses: 7 },
  { name: "Wed", analyses: 5 },
  { name: "Thu", analyses: 12 },
  { name: "Fri", analyses: 9 },
  { name: "Sat", analyses: 3 },
  { name: "Sun", analyses: 6 },
];

const recentAnalyses = [
  { name: "Acme Corp – Vendor MSA 2026", type: "Commercial / MSA", risk: "danger" as const, score: "74/100", time: "2 hours ago" },
  { name: "Globex Employment Agreement", type: "HR / Employment", risk: "safe" as const, score: "18/100", time: "5 hours ago" },
  { name: "TechStart NDA – Series A", type: "Legal / NDA", risk: "review" as const, score: "52/100", time: "1 day ago" },
  { name: "Cloud Service SLA Agreement", type: "IT / SLA", risk: "safe" as const, score: "24/100", time: "2 days ago" },
];

const riskBadgeStyle = {
  safe: "badge-risk-safe",
  review: "badge-risk-review",
  danger: "badge-risk-danger",
};

const riskLabels = {
  safe: "Low Risk",
  review: "Needs Review",
  danger: "Action Req",
};

const statCards = [
  { label: "Contracts Analyzed", value: "1,248", change: "+12%", up: true, icon: FileText },
  { label: "High Exposure Alerts", value: "24", badge: "Action Req", icon: AlertTriangle },
  { label: "Avg. Portfolio Risk", value: "42/100", sublabel: "Low Exposure", icon: Shield },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 text-foreground transition-colors duration-200">
      {/* Editorial Page Header */}
      <MotionSection amount={0.2} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <MotionItem>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider mb-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Workspace Register • Senior Counsel</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Contract Intelligence Overview</h1>
          <p className="text-xs text-muted-foreground">Summary of audited agreements, exposure alerts, and active redlines.</p>
        </MotionItem>

        <MotionItem>
          <Link href="/dashboard/analyze">
            <Button className="bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] border border-[#785628] dark:border-[#B38743] text-xs font-semibold px-4 h-9 shadow-xs btn-zoom">
              Upload & Analyze Document
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </MotionItem>
      </MotionSection>

      {/* Metrics Row */}
      <MotionSection amount={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <MotionItem key={stat.label}>
            <div className="paper-card paper-card-interactive group p-5 rounded-lg space-y-3 h-full">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                  <stat.icon className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-serif font-bold text-foreground">{stat.value}</p>
                {stat.change && (
                  <span className="flex items-center text-xs font-mono text-[#234D34] dark:text-[#4E8B65]">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
                {stat.badge && (
                  <span className="badge-risk-danger px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                    {stat.badge}
                  </span>
                )}
                {stat.sublabel && (
                  <span className="text-xs font-mono text-muted-foreground">{stat.sublabel}</span>
                )}
              </div>
            </div>
          </MotionItem>
        ))}

        {/* Quick Upload Drop Block */}
        <MotionItem>
          <Link href="/dashboard/analyze" className="block h-full">
            <div className="paper-card paper-card-interactive group p-5 rounded-lg border-dashed border-[#8C6721]/40 dark:border-[#C99A52]/40 hover:border-[#8C6721] dark:hover:border-[#C99A52] flex flex-col items-center justify-center h-full text-center space-y-1.5 cursor-pointer">
              <div className="w-8 h-8 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                <Upload className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
              </div>
              <p className="text-xs font-serif font-semibold text-foreground">Drag & Drop Contract</p>
              <p className="text-[10px] font-mono text-muted-foreground">PDF, DOCX, TXT or Scanned Image</p>
            </div>
          </Link>
        </MotionItem>
      </MotionSection>

      {/* Chart: Audit Volume */}
      <MotionSection amount={0.2}>
        <MotionItem>
          <Card className="paper-card rounded-lg border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border px-6 py-4">
              <div>
                <CardTitle className="text-base font-serif font-bold text-foreground">Audit Activity Volume</CardTitle>
                <p className="text-xs font-mono text-muted-foreground">Daily contract processing rate</p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#8C6721] dark:text-[#C99A52] bg-[#F9F5EB] dark:bg-[#2A2621] px-2.5 py-1 rounded border border-[#E6CFAB] dark:border-[#343029]">
                Last 7 Days
              </span>
            </CardHeader>
            <CardContent className="pt-6 pb-4 px-6">
              <div className="w-full h-56 min-w-0 min-h-[224px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="sealGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} fontFamily="var(--font-mono)" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--card-foreground)",
                        fontSize: "12px",
                        fontFamily: "var(--font-mono)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="analyses"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#sealGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </MotionItem>
      </MotionSection>

      {/* Recent Analyses Register */}
      <MotionSection amount={0.15}>
        <MotionItem>
          <Card className="paper-card rounded-lg border-border">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
              <div>
                <CardTitle className="text-base font-serif font-bold text-foreground">Recent Agreement Audits</CardTitle>
                <p className="text-xs font-mono text-muted-foreground">Most recently ingested contracts</p>
              </div>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm" className="text-xs font-mono text-[#8C6721] dark:text-[#C99A52] hover:text-foreground hover:bg-muted btn-zoom">
                  View Register →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {recentAnalyses.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-muted/40 transition-colors gap-3 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] icon-box-zoom">
                      <FileText className="w-4 h-4 icon-zoom" />
                    </div>
                    <div>
                      <p className="text-sm font-serif font-semibold text-foreground group-hover:text-[#8C6721] dark:group-hover:text-[#C99A52] transition-colors">{item.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-0.5">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-muted-foreground">Risk: {item.score}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-medium uppercase ${riskBadgeStyle[item.risk]}`}>
                      {riskLabels[item.risk]}
                    </span>
                    <Link href="/dashboard/analysis-result">
                      <Button variant="outline" size="sm" className="h-7 text-[11px] font-mono border-border bg-card hover:bg-muted text-foreground font-semibold btn-zoom">
                        View Audit
                      </Button>
                    </Link>
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
