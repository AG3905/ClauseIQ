"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale, LayoutDashboard, FileSearch, History, GitCompare,
  Settings, HelpCircle,
  ChevronLeft, Search, Bell, Plus, Menu, X, LogOut, User, MessageSquare
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
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FileSearch, label: "Analyze Contract", href: "/dashboard/analyze" },
  { icon: GitCompare, label: "Compare Redlines", href: "/dashboard/compare" },
  { icon: History, label: "Audit History", href: "/dashboard/history" },
  { icon: MessageSquare, label: "Legal Assistant", href: "/dashboard/chat" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Compliance & Docs", href: "#" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-200">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full border-r border-[#292524] dark:border-[#2B2722] transition-all duration-300 flex flex-col
          ${collapsed ? "w-[72px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-[#181716] dark:bg-[#13110E] text-[#E7E5E4] dark:text-[#EDE7DA]
        `}
      >
        {/* Logo */}
        <div className={`h-20 flex items-center px-4 border-b border-[#292524] dark:border-[#2B2722] ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded bg-[#8C6721] dark:bg-[#C99A52] flex items-center justify-center flex-shrink-0 text-white dark:text-[#171512] shadow-xs">
              <Scale className="w-4.5 h-4.5" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-serif font-bold text-base tracking-tight text-[#FAF8F5] dark:text-[#EDE7DA]">ClauseIQ</span>
                <p className="text-[10px] font-mono text-[#A8A29E] leading-none">Legal Registry</p>
              </div>
            )}
          </Link>
          <button aria-label="Close sidebar" title="Close sidebar" onClick={() => setMobileOpen(false)} className="lg:hidden text-[#A8A29E] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: New Analysis */}
        <div className="px-3 py-4">
          <Link href="/dashboard/analyze">
            <Button
              aria-label="Analyze Document"
              title="Analyze Document"
              className={`w-full bg-[#8C6721] hover:bg-[#6E4E1C] dark:bg-[#C99A52] dark:hover:bg-[#B38743] text-white dark:text-[#171512] border border-[#785628] dark:border-[#B38743] shadow-xs text-sm font-semibold h-11 ${collapsed ? "px-0 justify-center" : "justify-start"}`}
              size={collapsed ? "icon" : "default"}
            >
              <Plus className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span className="ml-2">Analyze Document</span>}
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
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded text-sm font-semibold transition-colors cursor-pointer
                    ${isActive
                      ? "bg-[#292524] dark:bg-[#26221D] text-[#FAF8F5] dark:text-[#EDE7DA] border-l-2 border-[#8C6721] dark:border-[#C99A52]"
                      : "text-[#A8A29E] hover:text-[#FAF8F5] dark:hover:text-[#EDE7DA] hover:bg-[#292524]/50"
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
        <div className="px-3 py-4 space-y-1 border-t border-[#292524] dark:border-[#2B2722]">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3.5 px-3.5 py-3 rounded text-sm font-semibold text-[#A8A29E] hover:text-[#FAF8F5] dark:hover:text-[#EDE7DA] hover:bg-[#292524]/50 transition-colors ${collapsed ? "justify-center px-0" : ""}`}>
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          ))}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#292524] dark:bg-[#26221D] border border-[#44403C] text-[#E7E5E4] items-center justify-center hover:bg-[#8C6721] transition-colors cursor-pointer"
        >
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-64"}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 border-b border-border bg-background/95 backdrop-blur-xs flex items-center px-4 lg:px-6 gap-4 transition-colors duration-200">
          <button aria-label="Open sidebar" title="Open sidebar" onClick={() => setMobileOpen(true)} className="lg:hidden text-foreground">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <Input
                placeholder="Search contract register, clauses, redlines..."
                className="pl-10 h-11 bg-card border-border focus:border-ring text-sm w-full font-sans text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button aria-label="Notifications" title="Notifications" className="relative p-2.5 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8C6721] dark:bg-[#C99A52]" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger aria-label="User menu" title="User menu" className="flex items-center gap-2 outline-none border-0 bg-transparent cursor-pointer">
                <Avatar className="w-9 h-9 rounded border border-border">
                  <AvatarFallback className="bg-[#8C6721] dark:bg-[#C99A52] text-white dark:text-[#171512] text-xs font-mono font-bold">
                    SA
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 paper-card border-border">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-serif font-bold text-foreground">Senior Advocate</p>
                  <p className="text-xs font-mono text-muted-foreground">counsel@firm.com</p>
                </div>
                <DropdownMenuItem className="gap-2.5 text-xs font-medium hover:bg-muted p-2.5 cursor-pointer"><User className="w-4 h-4" /> Workspace Profile</DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 text-xs font-medium hover:bg-muted p-2.5 cursor-pointer"><Settings className="w-4 h-4" /> Preferences</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="gap-2.5 text-xs font-medium text-[#6B1D1D] dark:text-[#E87A7A] hover:bg-[#FCF0F0] dark:hover:bg-[#2C1414] p-2.5 cursor-pointer"><LogOut className="w-4 h-4" /> End Session</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Workspace Page View */}
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
