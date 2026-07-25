"use client";

import { Settings, Shield, Lock, Bell, User, Database, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { MotionSection, MotionItem } from "@/components/motion";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-foreground transition-colors duration-200">
      {/* Header */}
      <MotionSection amount={0.2} className="pb-4 border-b border-border space-y-1">
        <MotionItem>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8C6721] dark:text-[#C99A52] uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" />
            <span>Workspace Preferences & Governance</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Workspace Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your counsel profile, theme preferences, and security compliance options.</p>
        </MotionItem>
      </MotionSection>

      <MotionSection amount={0.15} className="space-y-6">
        {/* Appearance Settings */}
        <MotionItem>
          <Card className="paper-card paper-card-interactive rounded-lg border-border group">
            <CardHeader className="border-b border-border p-5">
              <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                  <Cpu className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                </div>
                Theme & Interface Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-serif font-semibold text-foreground">Color Identity & Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between warm light paper registry and dark ink document mode.</p>
              </div>
              <ThemeToggle />
            </CardContent>
          </Card>
        </MotionItem>

        {/* Profile Settings */}
        <MotionItem>
          <Card className="paper-card paper-card-interactive rounded-lg border-border group">
            <CardHeader className="border-b border-border p-5">
              <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                  <User className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                </div>
                Senior Counsel Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 font-sans text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-muted-foreground">Full Name</label>
                  <Input defaultValue="Senior Advocate" className="h-10 bg-background border-border text-foreground text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-muted-foreground">Counsel Email</label>
                  <Input defaultValue="counsel@firm.com" className="h-10 bg-background border-border text-foreground text-xs" />
                </div>
              </div>
              <Button className="h-10 px-5 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] btn-zoom">
                Save Profile Changes
              </Button>
            </CardContent>
          </Card>
        </MotionItem>

        {/* Security & Data Policy */}
        <MotionItem id="compliance">
          <Card className="paper-card paper-card-interactive rounded-lg border-border group">
            <CardHeader className="border-b border-border p-5">
              <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                  <Shield className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                </div>
                Data Retention & Governance Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 font-sans text-xs">
              <div className="p-3 bg-muted rounded border border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">Zero Permanent Retention Mode</p>
                  <p className="text-muted-foreground text-[11px]">Uploaded contracts are automatically purged from memory after report generation.</p>
                </div>
                <span className="badge-risk-safe px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold">Active</span>
              </div>
            </CardContent>
          </Card>
        </MotionItem>
      </MotionSection>
    </div>
  );
}
