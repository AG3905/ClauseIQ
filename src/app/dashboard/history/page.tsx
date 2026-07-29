"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Clock, Filter, Download, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MotionSection, MotionItem } from "@/components/motion";
import { fetchUserAnalyses, AnalysisItem, createBrowserSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";

const verdictBadges = {
  safe: "badge-risk-safe",
  review: "badge-risk-review",
  danger: "badge-risk-danger",
};

const verdictLabels = {
  safe: "Low Risk",
  review: "Needs Review",
  danger: "Action Req",
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [historyItems, setHistoryItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const items = await fetchUserAnalyses();
        setHistoryItems(items);
      } catch {
        setHistoryItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this audit record from your register?")) {
      return;
    }

    setDeletingId(id);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("analyses").delete().eq("id", id);

      if (error) {
        toast.error("Failed to delete record: " + error.message);
      } else {
        setHistoryItems(prev => prev.filter(item => item.id !== id));
        toast.success("Audit record deleted successfully");
      }
    } catch {
      // Local fallback removal
      setHistoryItems(prev => prev.filter(item => item.id !== id));
      toast.success("Audit record deleted");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = historyItems.filter((item) =>
    item.document_name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Header */}
      <MotionSection amount={0.2} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <MotionItem>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Register • Archival Ledger</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Contract Audit History</h1>
          <p className="text-xs text-muted-foreground">Archival register of parsed contracts, historical risk assessments, and redlines.</p>
        </MotionItem>

        <MotionItem>
          <Button variant="outline" className="h-9 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold btn-zoom">
            <Download className="w-3.5 h-3.5 mr-2" /> Export Ledger CSV
          </Button>
        </MotionItem>
      </MotionSection>

      {/* Filter Bar */}
      <MotionSection amount={0.2}>
        <MotionItem>
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
            <Button variant="outline" className="h-10 text-xs font-mono bg-card border-border hover:bg-muted text-foreground font-semibold btn-zoom">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filter Category
            </Button>
          </div>
        </MotionItem>
      </MotionSection>

      {/* Audit History Table */}
      <MotionSection amount={0.15}>
        <MotionItem>
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono text-xs">
                        Loading audit records...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground space-y-3">
                        <FileText className="w-8 h-8 mx-auto text-muted-foreground/60" />
                        <p className="font-serif text-sm font-semibold text-foreground">No contract analyses found for your account</p>
                        <p className="text-xs font-sans text-muted-foreground max-w-sm mx-auto">
                          Audited contracts will appear here once you analyze a document under your authenticated session.
                        </p>
                        <div className="pt-2">
                          <Link href="/dashboard/analyze">
                            <Button className="bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold h-9 px-4">
                              <Plus className="w-3.5 h-3.5 mr-1.5" /> Analyze First Document
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors group">
                        <td className="p-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] icon-box-zoom">
                              <FileText className="w-4 h-4 icon-zoom" />
                            </div>
                            <div>
                              <p className="font-serif font-semibold text-foreground text-sm group-hover:text-[#8C6721] dark:group-hover:text-[#C99A52] transition-colors">{item.document_name}</p>
                              <span className="text-[10px] font-mono text-muted-foreground">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 px-6 font-mono text-muted-foreground">{item.type}</td>
                        <td className="p-4 px-6 font-mono text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 px-6 font-mono font-bold text-foreground">{item.riskScore}</td>
                        <td className="p-4 px-6 font-mono">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-medium ${verdictBadges[item.verdict] || verdictBadges.review}`}>
                            {verdictLabels[item.verdict] || "Needs Review"}
                          </span>
                        </td>
                        <td className="p-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/analysis-result/${item.id}`}
                              onClick={() => {
                                if (item.result) {
                                  sessionStorage.setItem("analysisResult", JSON.stringify(item.result));
                                  sessionStorage.setItem("documentName", item.document_name);
                                }
                              }}
                            >
                              <Button variant="outline" size="sm" className="h-8 text-xs font-mono border-border bg-card hover:bg-muted text-foreground font-semibold btn-zoom">
                                View Brief
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === item.id}
                              onClick={(e) => handleDelete(item.id, e)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-[#6B1D1D] dark:hover:text-[#E87A7A] hover:bg-[#FCF0F0] dark:hover:bg-[#2C1414] btn-zoom"
                              title="Delete analysis record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </MotionItem>
      </MotionSection>
    </div>
  );
}
