"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, LayoutDashboard, FileSearch, History, GitCompare,
  MessageSquare, BarChart3, FileText, Settings, HelpCircle,
  ChevronLeft, Search, Bell, Plus, Sparkles, Menu, X, LogOut, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileSearch, label: "Analyze", href: "/dashboard/analyze" },
  { icon: GitCompare, label: "Compare", href: "/dashboard/compare" },
  { icon: History, label: "History", href: "/dashboard/history" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Support", href: "#" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full border-r border-white/5 transition-all duration-300 flex flex-col
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-[oklch(0.08_0.01_270)]
        `}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center px-4 border-b border-white/5 ${collapsed ? "justify-center" : "gap-2"}`}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4.5 h-4.5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-sm">ClauseIQ</span>
              <p className="text-[10px] text-muted-foreground">Legal Intelligence</p>
            </div>
          )}
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Analysis Button */}
        <div className="px-3 py-4">
          <Link href="/dashboard/analyze">
            <Button className={`w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-purple-500/20 ${collapsed ? "px-0 justify-center" : ""}`} size={collapsed ? "icon" : "default"}>
              <Plus className="w-4 h-4" />
              {!collapsed && <span className="ml-2">New Analysis</span>}
            </Button>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer
                    ${isActive
                      ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                    }
                    ${collapsed ? "justify-center px-0" : ""}
                  `}
                >
                  <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Items */}
        <div className="px-3 py-4 space-y-1 border-t border-white/5">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all ${collapsed ? "justify-center px-0" : ""}`}>
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Collapse Toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-[oklch(0.15_0.02_270)] border border-white/10 items-center justify-center hover:bg-purple-500/20 transition-colors"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 glass flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts, clauses..."
                className="pl-10 h-9 bg-white/[0.03] border-white/10 focus:border-purple-500/30 text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
              <Bell className="w-4.5 h-4.5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-xs text-white">
                      SA
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card border-white/10">
                <DropdownMenuItem className="gap-2"><User className="w-4 h-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem className="gap-2"><Settings className="w-4 h-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="gap-2 text-red-400"><LogOut className="w-4 h-4" /> Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Button */}
      <Link href="/dashboard/chat">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-xl shadow-purple-500/30 flex items-center justify-center z-50 hover:shadow-purple-500/50 transition-shadow"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.button>
      </Link>
    </div>
  );
}
