"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme || theme) : "light";
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative w-10 h-10 rounded-md border-[#E5E0D4] dark:border-[#343029] bg-[#FFFFFF] dark:bg-[#211E1A] text-[#1C1A17] dark:text-[#EDE7DA] hover:bg-[#F2EEE5] dark:hover:bg-[#2B2722] transition-colors overflow-hidden cursor-pointer flex items-center justify-center"
    >
      <Sun className={`w-4.5 h-4.5 text-[#8C6721] transition-transform duration-300 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`absolute w-4.5 h-4.5 text-[#C99A52] transition-transform duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
    </Button>
  );
}
