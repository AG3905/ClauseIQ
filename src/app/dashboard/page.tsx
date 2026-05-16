"use client";

import { motion } from "framer-motion";
import {
  FileText, AlertTriangle, TrendingUp, Upload,
  ArrowUpRight, ArrowDownRight, Shield, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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
  { name: "Acme Corp – Vendor MSA 2024", type: "Commercial / MSA", risk: "high" as const, time: "2 hours ago" },
  { name: "Globex Employment Agreement", type: "HR / Employment", risk: "low" as const, time: "5 hours ago" },
  { name: "TechStart NDA – Series A", type: "Legal / NDA", risk: "medium" as const, time: "1 day ago" },
  { name: "Cloud Service SLA Agreement", type: "IT / SLA", risk: "low" as const, time: "2 days ago" },
];

const riskColors = {
  low: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  high: "text-red-400 bg-red-500/10 border-red-500/20",
};

const statCards = [
  { label: "Contracts Analyzed", value: "1,248", change: "+12%", up: true, icon: FileText },
  { label: "High-Risk Alerts", value: "24", badge: "Action Req", icon: AlertTriangle },
  { label: "Avg. Risk Score", value: "42/100", sublabel: "Low Risk", icon: Shield },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Welcome back, Sarah.</h1>
        <p className="text-muted-foreground">Here is the latest intelligence on your active contracts.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-white/5 hover:border-purple-500/20 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.change && (
                    <span className="flex items-center text-xs text-green-400 mb-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  )}
                  {stat.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 mb-1">
                      {stat.badge}
                    </span>
                  )}
                  {stat.sublabel && (
                    <span className="text-xs text-muted-foreground mb-1">{stat.sublabel}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Quick Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/dashboard/analyze">
            <Card className="glass-card border-white/5 hover:border-purple-500/20 transition-all cursor-pointer group h-full">
              <CardContent className="p-5 flex flex-col items-center justify-center h-full gap-2">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                <p className="text-sm font-medium">Quick Upload</p>
                <p className="text-xs text-muted-foreground text-center">Drag & drop NDA or MSA files here</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Analysis Volume</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Last 30 Days ▾
            </Button>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 15, 35, 0.95)",
                      border: "1px solid rgba(124, 58, 237, 0.2)",
                      borderRadius: "8px",
                      color: "#e2e8f0",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="analyses"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#purpleGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Analyses</CardTitle>
            <Link href="/dashboard/history">
              <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnalyses.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:block">• {item.type}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${riskColors[item.risk]}`}>
                      {item.risk === "high" ? "High Risk" : item.risk === "medium" ? "Medium" : "Low Risk"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
