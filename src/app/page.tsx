"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Shield, AlertTriangle, MessageSquare, Scale,
  ArrowRight, ChevronDown,
  Brain, FileText, Lock, Zap, FileCheck, GitCompare, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── Navbar with Scroll Progress Bar & Theme Toggle ─────
function Navbar() {
  const { scrollYProgress } = useScroll();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-colors duration-200">
      {/* Accent-Colored Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#8C6721] dark:bg-[#C99A52] origin-left z-[60]"
      />

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#8C6721] dark:bg-[#C99A52] flex items-center justify-center text-white dark:text-[#171512] shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-foreground">ClauseIQ</span>
            <span className="text-xs uppercase tracking-widest font-mono font-semibold text-[#8C6721] dark:text-[#C99A52] bg-[#F9F5EB] dark:bg-[#2A2621] px-2.5 py-1 rounded border border-[#E6CFAB] dark:border-[#343029] hidden sm:inline-block">Legal Spec</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-9 text-sm font-semibold text-muted-foreground">
          <a href="#features" className="link-underline hover:text-foreground transition-colors">Capabilities</a>
          <a href="#how-it-works" className="link-underline hover:text-foreground transition-colors">Redline Workflow</a>
          <a href="#trust" className="link-underline hover:text-foreground transition-colors">Security & Governance</a>
          <a href="#faq" className="link-underline hover:text-foreground transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/sign-in">
            <Button variant="ghost" className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted h-10 px-4">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-sm font-semibold px-5 h-10 shadow-xs border border-[#785628] dark:border-[#B38743]">
              Analyze Contract
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section with Parallax & Document Specimen ─────
function HeroSection() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 400], [0, 35]);

  return (
    <section className="relative pt-12 pb-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Parallax Heading & Copy */}
        <motion.div style={{ y: yParallax }} className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-md bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] text-xs sm:text-sm text-[#8C6721] dark:text-[#C99A52] font-mono font-semibold shadow-xs">
            <Shield className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52]" />
            Contract Audit & Margin Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-bold text-foreground leading-[1.15] tracking-tight">
            Legal Analysis with <br />
            <span className="italic text-[#8C6721] dark:text-[#C99A52] font-normal">Lawyer-Grade</span> Margin Redlines.
          </h1>

          <p className="text-base text-muted-foreground max-w-xl leading-relaxed font-sans">
            ClauseIQ parses complex agreements into structured risk assessments, identifying hidden exposure, auto-renewals, and non-standard indemnities with line-by-line margin annotations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/dashboard/analyze">
              <Button size="lg" className="bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] px-7 h-11 text-sm font-semibold border border-[#785628] dark:border-[#B38743] shadow-xs">
                Analyze Document
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="bg-card border-border text-foreground hover:bg-muted px-6 h-11 text-sm font-semibold">
                View Sample Audit
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-border grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="block text-foreground font-bold text-sm">01</span>
              <span className="text-muted-foreground">Margin Notes</span>
            </div>
            <div>
              <span className="block text-foreground font-bold text-sm">02</span>
              <span className="text-muted-foreground">Redline Striking</span>
            </div>
            <div>
              <span className="block text-foreground font-bold text-sm">03</span>
              <span className="text-[#4A5D53] dark:text-[#6B8478] font-bold">Ink-Green Spec</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Signature Legal Document Specimen */}
        <div className="lg:col-span-6">
          <div className="paper-card p-6 rounded-lg relative font-sans text-xs space-y-4">
            {/* Header Stamp */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <FileText className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52]" />
                <span>SPECIMEN_MSA_2026.PDF</span>
              </div>
              <span className="badge-risk-danger px-2.5 py-1 rounded text-[10px] font-mono font-medium uppercase tracking-wider">
                Needs Review • Risk 74/100
              </span>
            </div>

            {/* Document Body with Margin Rule & Annotations */}
            <div className="space-y-4 font-serif text-foreground text-sm leading-relaxed">
              <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider">SECTION 8.2 — LIMITATION OF LIABILITY</p>

              {/* Risky Clause with Redline */}
              <div className="margin-rule margin-rule-high space-y-2 py-1">
                <div className="text-xs text-muted-foreground font-mono">Original vs. Redline Revision:</div>
                <p className="font-serif">
                  "Neither party shall be liable for indirect damages, except that Provider's total liability under all causes of action shall be{" "}
                  <span className="redline-delete">unlimited for claims arising out of IP infringement</span>{" "}
                  <span className="redline-insert">capped at two (2) times total fees paid in preceding 12 months</span>."
                </p>
                {/* Lawyer Margin Note */}
                <div className="bg-[#FCF0F0] dark:bg-[#2C1414] border border-[#E8BCBC] dark:border-[#4D2222] p-3 rounded text-xs text-[#6B1D1D] dark:text-[#E87A7A] font-sans">
                  <div className="flex items-center justify-between font-mono font-medium text-[11px] mb-1">
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> High Exposure Alert</span>
                    <span>Line 42</span>
                  </div>
                  Uncapped IP liability creates catastrophic exposure. Replaced with 2x annual fee cap.
                </div>
              </div>

              {/* Clause 2: Auto-Renewal */}
              <div className="margin-rule margin-rule-medium space-y-2 py-1 pt-2">
                <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider">SECTION 12.1 — TERM & RENEWAL</p>
                <p className="font-serif text-xs">
                  "Contract automatically extends for 12 months unless cancelled{" "}
                  <span className="redline-delete">30 days</span>{" "}
                  <span className="redline-insert">90 days prior with written reminder</span>."
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>ClauseIQ Redline Engine v2.4</span>
              <span className="text-[#8C6721] dark:text-[#C99A52] font-semibold">3 High Risks Identified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Capabilities Section (Asymmetric Layout) ─────────
const capabilities = [
  { icon: AlertTriangle, title: "Exposure & Red Flag Detection", desc: "Flag unlimited liability, aggressive auto-renewals, non-standard indemnities, and asymmetric termination." },
  { icon: GitCompare, title: "Line-by-Line Redlining", desc: "Generates precise struck-through original text alongside inserted counter-proposal rewrites." },
  { icon: MessageSquare, title: "Legal Context Q&A", desc: "Interrogate your contract in plain, restrained legal language with direct clause citations." },
  { icon: Shield, title: "Verdict & Signing Guidance", desc: "Clear desaturated verdict seals: Safe to Sign, Needs Review, or Do Not Sign Yet." },
];

function CapabilitiesSection() {
  const [activeTab, setActiveTab] = useState<"original" | "redline">("redline");

  return (
    <section id="features" className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] text-xs sm:text-sm font-mono font-semibold text-[#8C6721] dark:text-[#C99A52] uppercase tracking-widest leading-none shadow-xs">
            Document Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">Designed Specifically for Legal Analysis</h2>
          <p className="text-sm text-muted-foreground">
            No generic dashboard widgets or glowing metrics. Built around legal document structures, redline markups, and margin annotations.
          </p>
        </motion.div>

        {/* Asymmetric Feature Grid: 1 Large Hero Card (2-col) + 4 Grid Cards */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured Large Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 paper-card paper-card-interactive p-8 rounded-lg space-y-6 group"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] group-hover:bg-[#8C6721] dark:group-hover:bg-[#C99A52] group-hover:text-white dark:group-hover:text-[#171512] transition-colors duration-200">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground">Structured Contract Parsing & Redlining</h3>
                  <p className="text-xs text-muted-foreground font-mono">CORE INTELLIGENCE ENGINE</p>
                </div>
              </div>

              {/* Interactive Specimen Toggle Buttons */}
              <div className="flex gap-1.5 bg-muted p-1 rounded border border-border">
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveTab("original"); }}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === "original" ? "bg-card text-foreground font-bold shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveTab("redline"); }}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === "redline" ? "bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512] font-bold shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Redlined
                </button>
              </div>
            </div>

            <p className="text-xs font-sans text-muted-foreground leading-relaxed">
              Extracts provisions, party responsibilities, and effective timelines while instantly generating struck-through original language and inserted counter-proposal rewrites.
            </p>

            {/* Live Interactive Specimen Preview */}
            <div className="p-4 rounded bg-background border border-border font-serif text-xs leading-relaxed space-y-2">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">SECTION 9.1 — INTELLECTUAL PROPERTY RIGHTS</span>
              {activeTab === "original" ? (
                <p className="text-foreground">
                  "All Work Product, including all intellectual property rights therein, shall be the sole and exclusive property of Client. Contractor hereby assigns all rights, title, and interest in Work Product."
                </p>
              ) : (
                <p className="text-foreground">
                  "All Work Product created specifically for Client shall belong to Client.{" "}
                  <span className="redline-delete">Contractor assigns all background IP.</span>{" "}
                  <span className="redline-insert">Pre-existing IP of Contractor remains Contractor's sole property, subject to a non-exclusive license to Client.</span>"
                </p>
              )}
            </div>
          </motion.div>

          {/* 4 Secondary Feature Cards Grid */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="paper-card paper-card-interactive p-6 rounded-lg space-y-3 group"
              >
                <div className="w-10 h-10 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] group-hover:bg-[#8C6721] dark:group-hover:bg-[#C99A52] group-hover:text-white dark:group-hover:text-[#171512] transition-colors duration-200">
                  <cap.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-semibold text-foreground">{cap.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Workflow (Horizontal Process Timeline) ──
const workflowSteps = [
  { step: "01", title: "Document Ingestion", desc: "Upload PDF, DOCX, or scanned contract image. OCR automatically extracts text layout schema." },
  { step: "02", title: "Clause Mapping & Exposure", desc: "ClauseIQ maps provisions against commercial benchmarks and calculates exposure scores." },
  { step: "03", title: "Margin Redlining", desc: "Red flags map to the margin rule alongside struck-through original and inserted rewrites." },
  { step: "04", title: "Negotiation Brief Export", desc: "Export a structured redline brief or share the interactive audit report with counsel." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] text-xs sm:text-sm font-mono font-semibold text-[#4A5D53] dark:text-[#6B8478] uppercase tracking-widest leading-none shadow-xs">
            Audit Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">From Agreement to Redline Brief</h2>
        </motion.div>

        {/* Process Timeline */}
        <div className="grid md:grid-cols-4 gap-6">
          {workflowSteps.map((ws, i) => (
            <motion.div
              key={ws.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="paper-card paper-card-interactive p-6 rounded-lg space-y-4 relative group"
            >
              <div className="w-10 h-10 rounded bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] flex items-center justify-center font-mono font-bold text-sm text-[#4A5D53] dark:text-[#6B8478] group-hover:bg-[#4A5D53] dark:group-hover:bg-[#6B8478] group-hover:text-white dark:group-hover:text-[#171512] transition-colors duration-200">
                {ws.step}
              </div>
              <h3 className="text-base font-serif font-semibold text-foreground">{ws.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{ws.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust & Security (Asymmetric 2-Column Layout) ────
const trustStandards = [
  { icon: Lock, title: "256-Bit Encrypted Processing", desc: "All contracts are processed via TLS 1.3 encrypted channels in isolated memory nodes." },
  { icon: Shield, title: "Zero Permanent Retention", desc: "Uploaded files are parsed in memory and cleared automatically after your session." },
  { icon: Zap, title: "SOC 2 Type II Aligned", desc: "Built following strict enterprise data governance standards for legal artifacts." },
];

function TrustSection() {
  return (
    <section id="trust" className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Left-Aligned Editorial Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] text-xs sm:text-sm font-mono font-semibold text-[#8C6721] dark:text-[#C99A52] uppercase tracking-widest leading-none shadow-xs">
            Data Governance
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground leading-tight">
            Built for Confidential Legal Artifacts
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your contracts contain proprietary intellectual property and commercially sensitive terms. ClauseIQ enforces zero permanent data retention and isolated memory parsing.
          </p>
          <div className="p-4 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] text-xs font-mono text-[#8C6721] dark:text-[#C99A52] space-y-1">
            <span className="font-bold flex items-center gap-1.5"><FileCheck className="w-4 h-4" /> Enterprise Security Spec</span>
            <p className="text-muted-foreground text-[11px]">Strict Memory Scrubbing • Non-Training Data Policy</p>
          </div>
        </motion.div>

        {/* Right Column: Stacked Security Standard Cards */}
        <div className="lg:col-span-7 space-y-4">
          {trustStandards.map((ts, i) => (
            <motion.div
              key={ts.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="paper-card paper-card-interactive p-6 rounded-lg flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded bg-[#EDF4EF] dark:bg-[#1B2E21] border border-[#BCD4C4] dark:border-[#2C4F37] flex items-center justify-center text-[#4A5D53] dark:text-[#6B8478] group-hover:bg-[#4A5D53] dark:group-hover:bg-[#6B8478] group-hover:text-white dark:group-hover:text-[#171512] transition-colors duration-200 flex-shrink-0">
                <ts.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-semibold text-foreground">{ts.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ts.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────
const faqs = [
  { q: "How does ClauseIQ generate redlines?", a: "ClauseIQ identifies high-risk provisions, strikes through non-standard or asymmetric phrasing, and inserts balanced legal counter-proposals based on commercial standards." },
  { q: "Are uploaded contracts retained for AI training?", a: "No. Your contracts are processed solely for generating your report and are never stored permanently or used for model training." },
  { q: "What document formats are supported?", a: "PDF, DOCX, TXT, and scanned image formats (PNG/JPEG) via built-in optical character recognition." },
  { q: "Is ClauseIQ a replacement for legal counsel?", a: "ClauseIQ is an intelligence tool that highlights risk exposure and accelerates contract review. It provides structured insights to support, not replace, qualified legal counsel." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-6 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] text-xs sm:text-sm font-mono font-semibold text-[#8C6721] dark:text-[#C99A52] uppercase tracking-widest leading-none shadow-xs">
            Questions & Guidance
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="paper-card rounded-lg overflow-hidden border-border">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-serif text-base font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180 text-[#8C6721] dark:text-[#C99A52]" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 font-sans text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#8C6721] dark:bg-[#C99A52] flex items-center justify-center text-white dark:text-[#171512]">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-base font-serif font-bold text-foreground">ClauseIQ</span>
            <span className="text-xs text-muted-foreground border-l border-border pl-3 font-mono">Contract Redline Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="link-underline hover:text-foreground">Privacy Policy</a>
            <a href="#" className="link-underline hover:text-foreground">Terms of Service</a>
            <a href="#" className="link-underline hover:text-foreground">Security Governance</a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground font-mono mt-8">
          © {new Date().getFullYear()} ClauseIQ Legal Systems. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ──────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <HeroSection />
      <CapabilitiesSection />
      <HowItWorksSection />
      <TrustSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
