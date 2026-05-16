"use client";

import { motion } from "framer-motion";
import {
  User, Palette, Shield, Brain, Bell, Globe,
  Moon, Sun, Monitor, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and security settings.</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/[0.03] border border-white/10 p-1 h-auto">
          <TabsTrigger value="profile" className="gap-1.5 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400"><User className="w-3.5 h-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400"><Palette className="w-3.5 h-3.5" />Appearance</TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400"><Brain className="w-3.5 h-3.5" />AI Preferences</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400"><Shield className="w-3.5 h-3.5" />Security</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <Card className="glass-card border-white/5">
            <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-lg text-white">SA</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="border-white/10">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <Separator className="bg-white/5" />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="Sarah" className="bg-white/[0.03] border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Anderson" className="bg-white/[0.03] border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="sarah@company.com" className="bg-white/[0.03] border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input defaultValue="TechCorp Inc." className="bg-white/[0.03] border-white/10" />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card className="glass-card border-white/5">
            <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Moon, label: "Dark", active: true },
                    { icon: Sun, label: "Light", active: false },
                    { icon: Monitor, label: "System", active: false },
                  ].map((theme) => (
                    <button
                      key={theme.label}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        theme.active
                          ? "border-purple-500/30 bg-purple-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <theme.icon className={`w-5 h-5 mx-auto mb-2 ${theme.active ? "text-purple-400" : "text-muted-foreground"}`} />
                      <p className="text-xs font-medium">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Separator className="bg-white/5" />
              <div>
                <Label className="mb-3 block">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full md:w-64 bg-white/[0.03] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-white/5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Animations</p><p className="text-xs text-muted-foreground">Enable UI animations and transitions</p></div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Compact Mode</p><p className="text-xs text-muted-foreground">Reduce spacing in the interface</p></div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Preferences */}
        <TabsContent value="ai">
          <Card className="glass-card border-white/5">
            <CardHeader><CardTitle className="text-base">AI Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">AI Model</Label>
                <Select defaultValue="llama-70b">
                  <SelectTrigger className="w-full md:w-80 bg-white/[0.03] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="llama-70b">Llama 3.3 70B Versatile (Recommended)</SelectItem>
                    <SelectItem value="deepseek-70b">DeepSeek R1 Distill 70B</SelectItem>
                    <SelectItem value="llama-8b">Llama 3.3 8B (Faster)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-white/5" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Auto-analyze on upload</p><p className="text-xs text-muted-foreground">Automatically start analysis when a document is uploaded</p></div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Detailed clause analysis</p><p className="text-xs text-muted-foreground">Provide extra detail for each clause (uses more AI tokens)</p></div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Negotiation suggestions</p><p className="text-xs text-muted-foreground">Include AI-generated negotiation recommendations</p></div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="glass-card border-white/5">
            <CardHeader><CardTitle className="text-base">Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div><p className="text-sm font-medium">Change Password</p><p className="text-xs text-muted-foreground">Update your account password</p></div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div><p className="text-sm font-medium">Active Sessions</p><p className="text-xs text-muted-foreground">Manage devices logged into your account</p></div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <Separator className="bg-white/5" />
              <div>
                <p className="text-sm font-medium text-red-400 mb-1">Danger Zone</p>
                <p className="text-xs text-muted-foreground mb-3">Permanently delete your account and all data.</p>
                <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
