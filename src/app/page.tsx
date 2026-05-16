"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Shield, FileSearch, AlertTriangle, MessageSquare, Scale,
  ArrowRight, CheckCircle, ChevronDown, Star, Sparkles,
  Brain, FileText, Upload, BarChart3, Lock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

// ─── Navbar ──────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 20));
  }
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">ClauseIQ</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#trust" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trust</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero ────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 animated-gradient-bg" />
      <div className="absolute inset-0 grid-bg" />
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-purple-300 mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Legal Intelligence Redefined
          </motion.div>
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
            AI That Explains{" "}
            <span className="gradient-text">Legal Contracts</span>{" "}
            in Plain English
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Upload contracts, detect hidden risks, and negotiate smarter.
            ClauseIQ bridges the gap between complex legal jargon and actionable insights.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/analyze">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-xl shadow-purple-500/25 h-12 px-8 text-base">
                Analyze Contract
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5">
                <Sparkles className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="px-2.5 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">Low Risk</div>
              <div className="px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">Review Needed</div>
            </div>
          </div>
        </motion.div>

        {/* Right - Floating Cards */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden lg:block"
        >
          {/* Risk Alert Card */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -top-4 left-8 glass-card rounded-xl p-4 w-64"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium">High Risk Detected</p>
                <p className="text-xs text-muted-foreground mt-0.5">Liability Cap Missing</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
            </div>
          </motion.div>

          {/* AI Translation Card */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="glass-card rounded-xl p-5 w-80 ml-20 mt-20"
          >
            <p className="text-xs text-muted-foreground mb-2">Original Text:</p>
            <p className="text-sm italic text-foreground/80 mb-4">
              &quot;In the event of termination, the indemnifying party shall be held...&quot;
            </p>
            <div className="flex items-center justify-center my-2">
              <ChevronDown className="w-4 h-4 text-purple-400" />
            </div>
            <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/10">
              <p className="text-xs text-purple-300 mb-1">AI Plain English:</p>
              <p className="text-sm">
                &quot;If the contract ends, they won&apos;t pay for your legal mistakes.&quot;
              </p>
            </div>
          </motion.div>

          {/* Standard Clause Badge */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 glass-card rounded-xl p-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs font-medium">Standard Clause</p>
                <p className="text-[10px] text-muted-foreground">Governing Law: NY</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features ──────────────────────────────────────────
const features = [
  { icon: Brain, title: "AI Contract Analysis", desc: "Instant AI-powered analysis of legal documents with risk scoring and recommendations.", color: "from-purple-500 to-violet-500" },
  { icon: AlertTriangle, title: "Red Flag Detection", desc: "Auto-detect hidden risks, unfair terms, and dangerous clauses before you sign.", color: "from-red-500 to-orange-500" },
  { icon: FileSearch, title: "Clause Breakdown", desc: "Every clause explained in plain English with risk levels and negotiation tips.", color: "from-blue-500 to-cyan-500" },
  { icon: MessageSquare, title: "Contract Q&A Chat", desc: "Ask AI anything about your contract and get instant, contextual answers.", color: "from-green-500 to-emerald-500" },
  { icon: Shield, title: "Signing Advisor", desc: "AI-powered verdict system: Safe to Sign, Needs Review, or Do Not Sign Yet.", color: "from-amber-500 to-yellow-500" },
  { icon: BarChart3, title: "Risk Analytics", desc: "Visual risk heatmaps, charts, and detailed analytics for every contract.", color: "from-pink-500 to-rose-500" },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand, analyze, and negotiate legal contracts with confidence.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────
const steps = [
  { icon: Upload, title: "Upload Contract", desc: "Drag & drop your PDF, DOCX, or paste text. We support OCR for scanned documents." },
  { icon: Brain, title: "AI Analyzes", desc: "Our AI engine reads every clause, identifies risks, and generates insights in seconds." },
  { icon: FileText, title: "Review Results", desc: "Get a comprehensive breakdown with risk scores, red flags, and negotiation tips." },
  { icon: Shield, title: "Make Decision", desc: "Receive a clear verdict: Safe to Sign, Needs Review, or Do Not Sign Yet." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From upload to verdict in under 60 seconds.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-purple-400" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust ────────────────────────────────────────────
const trustItems = [
  { icon: Lock, title: "Bank-Grade Encryption", desc: "256-bit AES encryption for all documents in transit and at rest." },
  { icon: Shield, title: "Zero Data Retention", desc: "Your contracts are never stored after analysis. Complete privacy guaranteed." },
  { icon: Zap, title: "SOC 2 Compliant", desc: "Enterprise-grade security standards with continuous monitoring." },
];

function TrustSection() {
  return (
    <section id="trust" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Built on <span className="gradient-text">Trust</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your legal documents deserve the highest level of security and privacy.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────
const testimonials = [
  { name: "Sarah Chen", role: "General Counsel, TechCorp", quote: "ClauseIQ caught a liability clause that our team of lawyers missed. Saved us from a potential $2M exposure.", avatar: "SC" },
  { name: "Michael Rivera", role: "Startup Founder", quote: "As a non-lawyer founder, ClauseIQ is like having a legal advisor in my pocket. It explains everything in plain English.", avatar: "MR" },
  { name: "Emily Thompson", role: "Contract Manager, Fortune 500", quote: "We've reduced contract review time by 80%. The AI analysis is incredibly thorough and accurate.", avatar: "ET" },
];

function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">Legal Teams</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-foreground/80 mb-4">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────
const faqs = [
  { q: "How does ClauseIQ analyze contracts?", a: "ClauseIQ uses advanced AI models to read and understand legal language. It identifies clauses, assesses risks, detects red flags, and provides plain-English explanations — all in under 60 seconds." },
  { q: "Is my data secure?", a: "Absolutely. We use bank-grade 256-bit AES encryption. Your documents are processed securely and never permanently stored on our servers." },
  { q: "What types of contracts can I analyze?", a: "ClauseIQ supports all types of contracts including NDAs, employment agreements, service agreements, leases, partnership agreements, and more." },
  { q: "Can I use ClauseIQ without legal knowledge?", a: "Yes! ClauseIQ was designed for everyone. It translates complex legal jargon into plain English, making it accessible to non-lawyers." },
  { q: "What AI models does ClauseIQ use?", a: "We use state-of-the-art large language models fine-tuned for legal document analysis, ensuring high accuracy and comprehensive coverage." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="relative py-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">ClauseIQ</span>
            <span className="text-xs text-muted-foreground ml-2">Legal Intelligence Redefined.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Compliance</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} ClauseIQ. Legal Intelligence Redefined.
        </p>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ──────────────────────────────
export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
