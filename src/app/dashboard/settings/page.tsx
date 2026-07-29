"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Settings, Shield, User, Cpu, Bell, KeyRound, Database,
  Download, Trash2, Calendar, Clock, Building, Mail, Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { MotionSection, MotionItem } from "@/components/motion";
import { createBrowserSupabaseClient, getInitials, getDisplayName } from "@/lib/supabase";
import { toast } from "sonner";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "platform" ? "platform" : "profile";

  // User Profile State
  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [lastSignIn, setLastSignIn] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Platform Preferences State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState("standard");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [savingPlatform, setSavingPlatform] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          const userEmail = user.email || "";
          setEmail(userEmail);
          
          if (user.created_at) {
            setCreatedAt(new Date(user.created_at).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            }));
          }
          if (user.last_sign_in_at) {
            setLastSignIn(new Date(user.last_sign_in_at).toLocaleString(undefined, {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }));
          }

          // Fetch from Supabase profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setFullName(profile.full_name || user.user_metadata?.full_name || getDisplayName("", userEmail));
            setOrganization(profile.organization || user.user_metadata?.organization || "");
            if (typeof profile.notifications_enabled === "boolean") {
              setNotificationsEnabled(profile.notifications_enabled);
            }
            if (profile.risk_threshold) setRiskThreshold(profile.risk_threshold);
            if (profile.export_format) setExportFormat(profile.export_format);
          } else {
            const metaName = user.user_metadata?.full_name || getDisplayName("", userEmail);
            const metaOrg = user.user_metadata?.organization || "";
            setFullName(metaName);
            setOrganization(metaOrg);

            // Auto-create initial profile row in database
            await supabase.from("profiles").upsert({
              id: user.id,
              email: userEmail,
              full_name: metaName,
              organization: metaOrg,
              notifications_enabled: true,
              risk_threshold: "standard",
              export_format: "pdf",
              updated_at: new Date().toISOString()
            });
          }
        }
      } catch {
        // Fallback for environment without active auth connection
        setFullName("Senior Counsel");
        setEmail("counsel@firm.com");
        setOrganization("Global Legal Corp");
      }
    }

    loadUserData();
  }, []);

  const handleTabChange = (value: string) => {
    router.replace(`/dashboard/settings?tab=${value}`, { scroll: false });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Update user metadata in Supabase auth
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            organization: organization
          }
        });

        // Upsert profile in Supabase database
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          email: email || user.email || "",
          full_name: fullName,
          organization: organization,
          updated_at: new Date().toISOString()
        });

        if (error) throw new Error(error.message);
      }

      toast.success("Counsel profile updated successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw new Error(error.message);

      toast.success("Password changed successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      toast.error(msg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPlatform(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          email: email || user.email || "",
          notifications_enabled: notificationsEnabled,
          risk_threshold: riskThreshold,
          export_format: exportFormat,
          updated_at: new Date().toISOString()
        });

        if (error) throw new Error(error.message);
      }

      toast.success("Platform preferences saved successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save platform preferences";
      toast.error(msg);
    } finally {
      setSavingPlatform(false);
    }
  };

  const handleExportData = async () => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data: analyses } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", userId);

      const exportObject = {
        export_date: new Date().toISOString(),
        profile: {
          id: userId,
          full_name: fullName,
          email: email,
          organization: organization,
          notifications_enabled: notificationsEnabled,
          risk_threshold: riskThreshold,
          export_format: exportFormat
        },
        analyses: analyses || []
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `clauseiq_data_export_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("Data export initiated", { description: "Your workspace data package has been downloaded." });
    } catch {
      toast.error("Failed to export workspace data");
    }
  };

  const handlePurgeData = async () => {
    if (!window.confirm("Are you sure you want to purge your cached analysis history? This action cannot be undone.")) {
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      if (userId) {
        await supabase.from("analyses").delete().eq("user_id", userId);
      }
      toast.success("Analysis history purged successfully");
    } catch {
      toast.error("Failed to purge analysis history");
    }
  };

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
          <p className="text-xs text-muted-foreground">Manage counsel identity, security policies, and platform options.</p>
        </MotionItem>
      </MotionSection>

      {/* Tabs UI */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-muted border border-border p-1 gap-1">
          <TabsTrigger
            value="profile"
            className="text-xs font-mono font-semibold gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground btn-zoom"
          >
            <User className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52]" />
            Profile & Identity
          </TabsTrigger>
          <TabsTrigger
            value="platform"
            className="text-xs font-mono font-semibold gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground btn-zoom"
          >
            <Cpu className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52]" />
            Platform Preferences
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFILE & IDENTITY */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          <MotionSection amount={0.15} className="space-y-6">
            
            {/* Identity Summary Card */}
            <MotionItem>
              <Card className="paper-card rounded-lg border-border">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-16 h-16 rounded-full bg-[#8C6721] dark:bg-[#C99A52] flex items-center justify-center text-white dark:text-[#171512] font-mono font-bold text-xl flex-shrink-0 shadow-md">
                    {getInitials(fullName, email)}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-xl font-serif font-bold text-foreground">{fullName || "Counsel Member"}</h2>
                      <span className="badge-risk-safe px-2.5 py-0.5 rounded font-mono text-[10px] uppercase font-bold w-fit mx-auto sm:mx-0">
                        Authenticated Counsel
                      </span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {email || "counsel@firm.com"}
                    </p>
                    {organization && (
                      <p className="text-xs font-mono text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                        <Building className="w-3.5 h-3.5" />
                        {organization}
                      </p>
                    )}

                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono text-muted-foreground border-t border-border mt-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52]" />
                        <span>Member Since: {createdAt || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52]" />
                        <span>Last Active: {lastSignIn || "Recent"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionItem>

            {/* Profile Settings Form */}
            <MotionItem>
              <Card className="paper-card paper-card-interactive rounded-lg border-border group">
                <CardHeader className="border-b border-border p-5">
                  <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                      <User className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                    </div>
                    Counsel Identity Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 font-sans text-xs">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground">Full Name</label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Senior Advocate"
                          className="h-10 bg-background border-border text-foreground text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground">Organization / Firm</label>
                        <Input
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="e.g. Chambers of Legal Counsel"
                          className="h-10 bg-background border-border text-foreground text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-muted-foreground">Counsel Email (Auth Managed)</label>
                      <Input
                        value={email}
                        disabled
                        className="h-10 bg-muted/60 border-border text-muted-foreground text-xs cursor-not-allowed"
                      />
                      <p className="text-[11px] text-muted-foreground font-mono">Email address is bound to your primary Supabase auth credential.</p>
                    </div>

                    <Button
                      type="submit"
                      disabled={savingProfile}
                      className="h-10 px-5 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] btn-zoom"
                    >
                      {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </MotionItem>

            {/* Password Management */}
            <MotionItem>
              <Card className="paper-card paper-card-interactive rounded-lg border-border group">
                <CardHeader className="border-b border-border p-5">
                  <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                      <KeyRound className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                    </div>
                    Change Authentication Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 font-sans text-xs">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground">New Password</label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="h-10 bg-background border-border text-foreground text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground">Confirm New Password</label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="h-10 bg-background border-border text-foreground text-xs"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={updatingPassword}
                      className="h-10 px-5 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] btn-zoom"
                    >
                      {updatingPassword ? "Updating Password..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </MotionItem>

          </MotionSection>
        </TabsContent>

        {/* TAB 2: PLATFORM PREFERENCES */}
        <TabsContent value="platform" className="space-y-6 outline-none">
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
                    <p className="text-sm font-serif font-semibold text-[#8C6721] dark:text-[#C99A52]">Color Identity & Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Switch between warm light paper registry and dark ink document mode.</p>
                  </div>
                  <ThemeToggle />
                </CardContent>
              </Card>
            </MotionItem>

            {/* Notification Preferences */}
            <MotionItem>
              <Card className="paper-card paper-card-interactive rounded-lg border-border group">
                <CardHeader className="border-b border-border p-5">
                  <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                      <Bell className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                    </div>
                    Counsel Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between p-3 bg-muted rounded border border-border">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">Email Analysis Dispatch</p>
                      <p className="text-muted-foreground text-[11px]">Receive an email notification whenever contract exposure analysis completes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8C6721] dark:peer-checked:bg-[#C99A52]"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </MotionItem>

            {/* App-wide Workspace Preferences */}
            <MotionItem>
              <Card className="paper-card paper-card-interactive rounded-lg border-border group">
                <CardHeader className="border-b border-border p-5">
                  <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                      <Sliders className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                    </div>
                    Analysis & Export Defaults
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 font-sans text-xs">
                  <form onSubmit={handleSavePlatformSettings} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground">Default Verdict Risk Threshold</label>
                        <select
                          value={riskThreshold}
                          onChange={(e) => setRiskThreshold(e.target.value)}
                          className="w-full h-10 px-3 bg-background border border-border rounded text-foreground text-xs focus:outline-none focus:border-ring"
                        >
                          <option value="standard">Standard Exposure (Balanced Risk Detection)</option>
                          <option value="strict">Strict Exposure (Conservative / Low Risk)</option>
                          <option value="permissive">Permissive Exposure (High Exposure Tolerance)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-muted-foreground">Default Audit Export Format</label>
                        <select
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value)}
                          className="w-full h-10 px-3 bg-background border border-border rounded text-foreground text-xs focus:outline-none focus:border-ring"
                        >
                          <option value="pdf">PDF Audit Report</option>
                          <option value="markdown">Markdown Registry File</option>
                          <option value="docx">DOCX Executive Summary</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={savingPlatform}
                      className="h-10 px-5 bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] text-xs font-semibold border border-[#785628] dark:border-[#B38743] btn-zoom"
                    >
                      {savingPlatform ? "Saving Preferences..." : "Save Workspace Preferences"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </MotionItem>

            {/* Data & Privacy Actions */}
            <MotionItem>
              <Card className="paper-card paper-card-interactive rounded-lg border-border group">
                <CardHeader className="border-b border-border p-5">
                  <CardTitle className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#F9F5EB] dark:bg-[#2A2621] border border-[#E6CFAB] dark:border-[#343029] flex items-center justify-center icon-box-zoom">
                      <Database className="w-4 h-4 text-[#8C6721] dark:text-[#C99A52] icon-zoom" />
                    </div>
                    Data Governance & Privacy Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 font-sans text-xs">
                  <div className="p-4 bg-muted rounded border border-border space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-semibold text-foreground">Export Workspace Package</p>
                        <p className="text-muted-foreground text-[11px]">Download full JSON payload of your profile metadata and contract analysis records.</p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleExportData}
                        variant="outline"
                        className="h-9 px-4 text-xs font-mono gap-1.5 border-border hover:bg-background cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8C6721] dark:text-[#C99A52]" />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FFF5F5] dark:bg-[#2C1414] rounded border border-[#FCA5A5] dark:border-[#7F1D1D] space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-semibold text-[#991B1B] dark:text-[#F87171]">Purge Analysis Records</p>
                        <p className="text-[#B91C1C]/80 dark:text-[#FCA5A5]/80 text-[11px]">Permanently clear your cached contract analysis history and redline logs.</p>
                      </div>
                      <Button
                        type="button"
                        onClick={handlePurgeData}
                        className="h-9 px-4 text-xs font-mono gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white border border-[#991B1B] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Purge Records
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionItem>

            {/* Security & Data Retention Policy */}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-8 text-center text-xs font-mono text-muted-foreground">Loading settings...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
