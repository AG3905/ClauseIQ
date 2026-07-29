"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createBrowserSupabaseClient, setLocalAuthSession } from "@/lib/supabase";
import { toast } from "sonner";
import { MotionSection, MotionItem } from "@/components/motion";

export default function SignInPage() {
  const [email, setEmail] = useState("demo@clauseiq.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes("email not confirmed")) {
          toast.error("Email not confirmed. Please check your inbox and verify your email before signing in.");
        } else {
          toast.error(error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user && data?.session) {
        const fullName = data.user.user_metadata?.full_name || email.split('@')[0];
        setLocalAuthSession({
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName,
          organization: data.user.user_metadata?.organization,
        });

        toast.success("Signed in successfully");
        window.location.href = "/dashboard";
        return;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      {/* Top Header with Brand & ThemeToggle */}
      <header className="p-4 px-6 flex items-center justify-between border-b border-border bg-background/95">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-[#8C6721] dark:bg-[#C99A52] flex items-center justify-center text-white dark:text-[#171512] icon-box-zoom">
            <Scale className="w-4.5 h-4.5 icon-zoom" />
          </div>
          <div>
            <span className="text-lg font-serif font-bold text-foreground">ClauseIQ</span>
            <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Contract Redline Intelligence</span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Editorial Legal Context */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-muted/40 border-r border-border">
          <MotionSection amount={0.2} className="max-w-md space-y-8">
            <MotionItem>
              <div className="paper-card paper-card-interactive rounded-lg p-8 space-y-4 group">
                <div className="w-10 h-10 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center text-[#8C6721] dark:text-[#C99A52] icon-box-zoom">
                  <Shield className="w-5 h-5 icon-zoom" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Lawyer-grade agreement audit & redline platform.
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  Sign in to access your saved contract analyses, legal diff comparisons, and margin annotation reports.
                </p>
                <div className="flex gap-2 font-mono text-[10px]">
                  <span className="badge-risk-safe px-2.5 py-1 rounded font-medium">Safe</span>
                  <span className="badge-risk-review px-2.5 py-1 rounded font-medium">Review</span>
                  <span className="badge-risk-danger px-2.5 py-1 rounded font-medium">Danger</span>
                </div>
              </div>
            </MotionItem>

            <MotionItem>
              <p className="text-xs text-muted-foreground font-mono">
                Encrypted TLS 1.3 session • 256-Bit Data Security
              </p>
            </MotionItem>
          </MotionSection>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="flex-1 flex items-center justify-center p-6 bg-background">
          <MotionSection amount={0.2} className="w-full max-w-md">
            <MotionItem>
              <div className="paper-card paper-card-interactive rounded-lg p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-serif font-bold text-foreground">Sign In to ClauseIQ</h1>
                  <p className="text-xs text-muted-foreground">Enter your credentials to access your document workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-mono text-foreground">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="counsel@firm.com"
                        className="pl-10 h-10 bg-card border-border focus:border-[#8C6721] dark:focus:border-[#C99A52] text-xs font-sans text-foreground"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-mono text-foreground">Password</Label>
                      <Link href="#" className="text-xs text-[#8C6721] dark:text-[#C99A52] hover:underline font-mono">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-10 bg-card border-border focus:border-[#8C6721] dark:focus:border-[#C99A52] text-xs font-mono text-foreground"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground btn-zoom"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] shadow-xs btn-zoom"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="relative my-4">
                  <Separator className="bg-border" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[11px] font-mono text-muted-foreground border border-border rounded">
                    Or authentication provider
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-10 bg-card border-border hover:bg-muted text-xs text-foreground font-semibold btn-zoom">
                    Google
                  </Button>
                  <Button variant="outline" className="h-10 bg-card border-border hover:bg-muted text-xs text-foreground font-semibold btn-zoom">
                    Single Sign-On
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up" className="text-[#8C6721] dark:text-[#C99A52] hover:underline font-semibold">
                    Request Access
                  </Link>
                </p>
              </div>
            </MotionItem>
          </MotionSection>
        </div>
      </div>
    </div>
  );
}
