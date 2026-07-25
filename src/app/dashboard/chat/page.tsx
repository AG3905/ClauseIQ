"use client";

import { useState } from "react";
import { MessageSquare, Send, Scale, FileText, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionSection, MotionItem } from "@/components/motion";

const initialMessages = [
  { sender: "assistant", text: "Welcome counsel. I am your ClauseIQ Legal Assistant. Ask me any question regarding your active contract repository, indemnities, liability caps, or auto-renewal deadlines.", time: "10:00 AM" },
  { sender: "user", text: "What is our aggregate liability cap under the Acme Vendor MSA?", time: "10:01 AM" },
  { sender: "assistant", text: "Under Section 8.2 of the Acme Vendor MSA 2026, general liability is capped at 12 months of paid fees. However, IP claims and confidentiality breaches are currently uncapped, creating significant financial exposure. I recommend inserting a 2x annual fee cap.", time: "10:01 AM" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    setTimeout(() => {
      const botMsg = {
        sender: "assistant",
        text: `Based on your contract repository analysis regarding "${currentInput}": The agreement requires written non-renewal notice at least 90 days prior to term expiration to avoid automatic extension.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-foreground transition-colors duration-200">
      {/* Header */}
      <MotionSection amount={0.2} className="pb-4 border-b border-border space-y-1">
        <MotionItem>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Interactive Context Q&A</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Legal Assistant Chat</h1>
          <p className="text-xs text-muted-foreground">Interrogate your contract repository in authoritative, restrained legal language.</p>
        </MotionItem>
      </MotionSection>

      {/* Chat Container */}
      <MotionSection amount={0.15}>
        <MotionItem>
          <div className="paper-card rounded-lg flex flex-col h-[560px] overflow-hidden border-border">
            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-background/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 max-w-2xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 icon-box-zoom ${
                    msg.sender === "user" ? "bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512]" : "bg-card border border-border text-foreground"
                  }`}>
                    {msg.sender === "user" ? <User className="w-4 h-4 icon-zoom" /> : <Scale className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />}
                  </div>
                  <div className="space-y-1">
                    <div className={`p-4 rounded-lg font-serif text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512] font-sans"
                        : "bg-card border border-border text-foreground shadow-xs"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-card border-t border-border flex gap-3">
              <Input
                placeholder="Ask a question about your contract provisions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 h-11 bg-background border-border focus:border-[#8C6721] dark:focus:border-[#C99A52] text-xs font-sans text-foreground"
              />
              <Button type="submit" className="h-11 px-5 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] btn-zoom">
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </form>
          </div>
        </MotionItem>
      </MotionSection>
    </div>
  );
}
