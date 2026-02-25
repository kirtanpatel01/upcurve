"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function ModeToggle({ asChild }: { asChild?: boolean }) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (!theme) setTheme("system");
  }, [theme, setTheme]);

  const toggleTheme = React.useCallback(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [theme, systemTheme, setTheme]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key.toLowerCase() === "d" && !isInput) {
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  const content = !mounted ? (
    <div className="flex w-full justify-center"><Spinner /></div>
  ) : (
    <>
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      <span className="group-data-[collapsible=icon]:hidden">
        {isDark ? "Dark" : "Light"}
      </span>
    </>
  );

  return (
    <>
      {asChild ? (
        <span className="flex items-center gap-2 cursor-pointer" onClick={toggleTheme}>
          {content}
        </span>
      ) : (
        <Button
          variant="outline"
          className="flex items-center rounded-full cursor-pointer absolute right-4 top-4"
          onClick={toggleTheme}
        >
          {content}
        </Button>
      )}
    </>
  )
}