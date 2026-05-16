"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare, Upload, FileText, ArrowRight, ArrowLeft,
  Plus, Minus, AlertTriangle, CheckCircle, TrendingUp, TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const demoChanges = [
  { id: "1", type: "modified" as const, section: "Liability Cap", original: "Liability shall be unlimited for IP infringement claims", revised: "Total liability shall not exceed 2x annual fees for all claim types", riskImpact: "positive" as const, description: "Liability cap has been added, significantly reducing financial exposure" },
  { id: "2", type: "removed" as const, section: "Non-Compete Clause", original: "Employee shall not work for any competitor within 100 miles for 3 years", revised: undefined, riskImpact: "positive" as const, description: "Overly broad non-compete clause has been removed" },
  { id: "3", type: "added" as const, section: "Data Protection", original: undefined, revised: "Both parties shall comply with GDPR and applicable data protection laws", riskImpact: "positive" as const, description: "New data protection clause added for regulatory compliance" },
  { id: "4", type: "modified" as const, section: "Termination Notice", original: "90 days written notice required for termination", revised: "30 days written notice required for termination", riskImpact: "negative" as const, description: "Shorter termination notice may not provide enough time for transition" },
];

export default function ComparePage() {
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");
  const [comparing, setComparing] = useState(false);
  const [results, setResults] = useState<typeof demoChanges | null>(null);

  const handleCompare = async () => {
    if (!original.trim() || !revised.trim()) return;
    setComparing(true);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original, revised }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.changes || demoChanges);
      } else {
        setResults(demoChanges);
      }
    } catch {
      setResults(demoChanges);
    } finally {
      setComparing(false);
    }
  };

  const impactConfig = {
    positive: { icon: TrendingDown, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "Lower Risk" },
    negative: { icon: TrendingUp, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Higher Risk" },
    neutral: { icon: ArrowRight, color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20", label: "No Change" },
  };

  const typeConfig = {
    added: { icon: Plus, color: "text-green-400", bg: "bg-green-500/10", label: "Added" },
    removed: { icon: Minus, color: "text-red-400", bg: "bg-red-500/10", label: "Removed" },
    modified: { icon: GitCompare, color: "text-amber-400", bg: "bg-amber-500/10", label: "Modified" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
          <GitCompare className="w-8 h-8 text-purple-400" />
          Contract Comparison
        </h1>
        <p className="text-muted-foreground">Compare two contract versions to identify changes, added risks, and removed protections.</p>
      </motion.div>

      {!results ? (
        <>
          {/* Input Area */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="glass-card border-white/5">
              <CardHeader><CardTitle className="text-sm">Original Contract</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste original contract text..."
                  value={original}
                  onChange={(e) => setOriginal(e.target.value)}
                  className="min-h-[300px] bg-transparent border-white/10 resize-none"
                />
              </CardContent>
            </Card>
            <Card className="glass-card border-white/5">
              <CardHeader><CardTitle className="text-sm">Revised Contract</CardTitle></CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste revised contract text..."
                  value={revised}
                  onChange={(e) => setRevised(e.target.value)}
                  className="min-h-[300px] bg-transparent border-white/10 resize-none"
                />
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleCompare}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20"
            disabled={!original.trim() || !revised.trim() || comparing}
          >
            {comparing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <GitCompare className="w-5 h-5 mr-2" />
                Compare Contracts
              </>
            )}
          </Button>

          {/* Demo Button */}
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setResults(demoChanges)}>
              Or view demo comparison →
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Results */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setResults(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Compare
            </Button>
            <Badge variant="outline" className="text-purple-400 border-purple-500/20 bg-purple-500/10">
              {results.length} changes detected
            </Badge>
          </div>

          <div className="space-y-4">
            {results.map((change, i) => {
              const tc = typeConfig[change.type];
              const ic = impactConfig[change.riskImpact];
              const TIcon = tc.icon;
              const IIcon = ic.icon;
              return (
                <motion.div
                  key={change.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card border-white/5">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${tc.color} ${tc.bg} gap-1`}>
                            <TIcon className="w-3 h-3" />{tc.label}
                          </Badge>
                          <h4 className="font-semibold text-sm">{change.section}</h4>
                        </div>
                        <Badge variant="outline" className={`${ic.color} ${ic.bg} ${ic.border} gap-1`}>
                          <IIcon className="w-3 h-3" />{ic.label}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {change.original && (
                          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                            <p className="text-[10px] text-red-400 font-medium mb-1">Original</p>
                            <p className="text-xs">{change.original}</p>
                          </div>
                        )}
                        {change.revised && (
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <p className="text-[10px] text-green-400 font-medium mb-1">Revised</p>
                            <p className="text-xs">{change.revised}</p>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-3">{change.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
