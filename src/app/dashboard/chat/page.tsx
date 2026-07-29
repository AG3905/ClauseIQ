"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Scale, FileText, User, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionSection, MotionItem } from "@/components/motion";
import { fetchUserAnalyses, AnalysisItem, createBrowserSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";

interface ChatMsg {
  sender: "user" | "assistant";
  text: string;
  references?: string[];
  time: string;
}

export default function ChatPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisItem | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadAnalysesAndChat() {
      try {
        const items = await fetchUserAnalyses();
        setAnalyses(items);
        if (items.length > 0) {
          const first = items[0];
          setSelectedAnalysis(first);
          await loadChatHistory(first.id);
        } else {
          setMessages([
            {
              sender: "assistant",
              text: "Welcome counsel. I am your ClauseIQ Legal Assistant. Once you analyze a contract, you can interrogate its clauses, liability caps, and auto-renewal deadlines here.",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadAnalysesAndChat();
  }, []);

  const loadChatHistory = async (analysisId: string) => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: dbMsgs, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("analysis_id", analysisId)
        .order("created_at", { ascending: true });

      if (!error && dbMsgs && dbMsgs.length > 0) {
        const formatted: ChatMsg[] = dbMsgs.map(m => {
          let text = m.content;
          let references: string[] = [];

          if (m.role === "assistant") {
            try {
              const parsed = JSON.parse(m.content);
              if (parsed.text) {
                text = parsed.text;
                references = parsed.references || [];
              }
            } catch {
              // Raw text format
            }
          }

          return {
            sender: m.role === "user" ? "user" : "assistant",
            text,
            references,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });

        setMessages(formatted);
      } else {
        setMessages([
          {
            sender: "assistant",
            text: `Connected to analysis for "${selectedAnalysis?.document_name || 'selected contract'}". Ask any question regarding specific provisions, risk factors, or negotiation options.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch {
      // Fallback
    }
  };

  const handleSelectContract = async (item: AnalysisItem) => {
    setSelectedAnalysis(item);
    setLoading(true);
    await loadChatHistory(item.id);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const currentQuestion = input.trim();
    setInput("");

    const userMsg: ChatMsg = {
      sender: "user",
      text: currentQuestion,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: selectedAnalysis?.id,
          question: currentQuestion,
          history: historyPayload
        })
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();

      const botMsg: ChatMsg = {
        sender: "assistant",
        text: data.response || "No response generated.",
        references: data.references || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to generate response");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-foreground transition-colors duration-200">
      {/* Header */}
      <MotionSection amount={0.2} className="pb-4 border-b border-border space-y-1">
        <MotionItem className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Interactive Context Q&A</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Legal Assistant Chat</h1>
            <p className="text-xs text-muted-foreground">Interrogate your contract repository in authoritative, restrained legal language.</p>
          </div>

          {/* Active Contract Selector Dropdown */}
          {analyses.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">Active Audit:</span>
              <select
                aria-label="Select contract audit to chat about"
                title="Select contract audit to chat about"
                value={selectedAnalysis?.id || ""}
                onChange={(e) => {
                  const found = analyses.find(a => a.id === e.target.value);
                  if (found) handleSelectContract(found);
                }}
                className="h-9 px-3 bg-card border border-border rounded text-xs font-serif font-semibold text-foreground focus:border-[#8C6721] dark:focus:border-[#C99A52]"
              >
                {analyses.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.document_name} ({item.riskScore})
                  </option>
                ))}
              </select>
            </div>
          )}
        </MotionItem>
      </MotionSection>

      {/* Chat Container */}
      <MotionSection amount={0.15}>
        <MotionItem>
          <div className="paper-card rounded-lg flex flex-col h-[580px] overflow-hidden border-border">
            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-background/50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-[#8C6721] dark:border-[#C99A52] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 max-w-2xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 icon-box-zoom ${
                      msg.sender === "user" ? "bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512]" : "bg-card border border-border text-foreground"
                    }`}>
                      {msg.sender === "user" ? <User className="w-4 h-4 icon-zoom" /> : <Scale className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-4 rounded-lg font-serif text-xs leading-relaxed space-y-2 ${
                        msg.sender === "user"
                          ? "bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512] font-sans"
                          : "bg-card border border-border text-foreground shadow-xs"
                      }`}>
                        <p>{msg.text}</p>
                        {msg.references && msg.references.length > 0 && (
                          <div className="pt-2 border-t border-border/40 flex flex-wrap gap-1.5 font-mono text-[10px]">
                            <span className="text-muted-foreground uppercase font-bold">Citations:</span>
                            {msg.references.map((ref, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                {ref}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground block px-1">{msg.time}</span>
                    </div>
                  </div>
                ))
              )}
              {sending && (
                <div className="flex gap-3 max-w-2xl">
                  <div className="w-8 h-8 rounded bg-card border border-border flex items-center justify-center text-foreground">
                    <Scale className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] animate-pulse" />
                  </div>
                  <div className="p-3 bg-card border border-border rounded-lg text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52] animate-spin" />
                    Searching contract provisions...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-card border-t border-border flex gap-3">
              <Input
                placeholder={selectedAnalysis ? `Ask a question about "${selectedAnalysis.document_name}"...` : "Ask a question about your contract provisions..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                className="flex-1 h-11 bg-background border-border focus:border-[#8C6721] dark:focus:border-[#C99A52] text-xs font-sans text-foreground"
              />
              <Button
                type="submit"
                disabled={sending || !input.trim()}
                className="h-11 px-5 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] btn-zoom"
              >
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </form>
          </div>
        </MotionItem>
      </MotionSection>
    </div>
  );
}
