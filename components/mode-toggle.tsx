"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function ModeToggle({
  asChild,
  size,
}: {
  asChild?: boolean;
  size?: number;
}) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    if (!theme) {
      setTheme("system");
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    const current = theme === "system" ? systemTheme : theme;
    const newTheme = current === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme, setTheme, systemTheme]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable;

      if (e.key.toLowerCase() === "d" && !isInput) {
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const resolvedTheme = mounted ? (theme === "system" ? systemTheme : theme) : systemTheme;

  const content = !mounted ? (
    <div className="w-full flex justify-center">
      <Spinner />
    </div>
  ) : (
    <>
      {resolvedTheme === "light" ? (
        <Sun size={size} className="text-primary" />
      ) : (
        <Moon size={size} className="text-primary" />
      )}
      <span className="group-data-[collapsible=icon]:hidden">
        {resolvedTheme === "dark" ? "Dark" : "Light"}
      </span>
    </>
  );

  if (asChild) {
    return (
      <span className="w-full flex items-center gap-2" onClick={toggleTheme}>
        {content}
      </span>
    );
  }

  return (
    <Button
      variant="outline"
      className="flex items-center rounded-full fixed top-4 right-4"
      onClick={toggleTheme}
    >
      {content}
    </Button>
  );
}
