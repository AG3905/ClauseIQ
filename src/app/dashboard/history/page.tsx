"use client";

import { motion } from "framer-motion";
import {
  FileText, Search, Filter, Clock, AlertTriangle,
  CheckCircle, XCircle, Download, Trash2, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";

const historyData = [
  { id: "1", name: "Acme Corp – Vendor MSA 2024", type: "Commercial / MSA", verdict: "review" as const, riskScore: 67, date: "2024-12-10", size: "2.4 MB" },
  { id: "2", name: "Globex Employment Agreement", type: "HR / Employment", verdict: "safe" as const, riskScore: 28, date: "2024-12-09", size: "1.1 MB" },
  { id: "3", name: "TechStart NDA – Series A", type: "Legal / NDA", verdict: "review" as const, riskScore: 45, date: "2024-12-08", size: "890 KB" },
  { id: "4", name: "Cloud Service SLA Agreement", type: "IT / SLA", verdict: "safe" as const, riskScore: 18, date: "2024-12-07", size: "3.2 MB" },
  { id: "5", name: "Office Lease Agreement 2025", type: "Real Estate / Lease", verdict: "danger" as const, riskScore: 82, date: "2024-12-06", size: "4.1 MB" },
  { id: "6", name: "Software License Agreement", type: "IT / License", verdict: "review" as const, riskScore: 55, date: "2024-12-05", size: "1.8 MB" },
  { id: "7", name: "Consulting Services Contract", type: "Professional / Services", verdict: "safe" as const, riskScore: 22, date: "2024-12-04", size: "960 KB" },
  { id: "8", name: "Partnership Agreement Draft", type: "Corporate / Partnership", verdict: "danger" as const, riskScore: 78, date: "2024-12-03", size: "2.9 MB" },
];

const verdictConfig = {
  safe: { icon: CheckCircle, label: "Safe", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  review: { icon: AlertTriangle, label: "Review", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  danger: { icon: XCircle, label: "Danger", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = historyData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.verdict === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Document History</h1>
        <p className="text-muted-foreground">View all previously analyzed contracts and documents.</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/[0.03] border-white/10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "safe", "review", "danger"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "border-white/10 bg-white/[0.02]"}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const vc = verdictConfig[item.verdict];
          const VIcon = vc.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card border-white/5 hover:border-purple-500/10 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(item.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-bold ${item.riskScore > 70 ? "text-red-400" : item.riskScore > 40 ? "text-amber-400" : "text-green-400"}`}>
                        {item.riskScore}/100
                      </p>
                      <p className="text-[10px] text-muted-foreground">Risk Score</p>
                    </div>
                  </div>

                  <Badge variant="outline" className={`${vc.color} ${vc.bg} ${vc.border} gap-1`}>
                    <VIcon className="w-3 h-3" />
                    {vc.label}
                  </Badge>

                  <div className="flex gap-1">
                    <Link href="/dashboard/analysis-result">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-500/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No documents match your search.</p>
        </div>
      )}
    </div>
  );
}
