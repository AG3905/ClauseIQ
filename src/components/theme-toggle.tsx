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

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        className="w-10 h-10 rounded-md border-border bg-card text-foreground"
      >
        <Sun className="w-4.5 h-4.5 text-[#8C6721]" />
      </Button>
    );
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative w-10 h-10 rounded-md border-border bg-card text-foreground hover:bg-muted transition-colors overflow-hidden cursor-pointer flex items-center justify-center"
    >
      <Sun className={`w-4.5 h-4.5 text-[#8C6721] dark:text-[#C99A52] transition-transform duration-300 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`absolute w-4.5 h-4.5 text-[#C99A52] transition-transform duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
    </Button>
  );
}
