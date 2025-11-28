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

  const toggleTheme = () => {
    const current = theme === "system" ? systemTheme : theme;
    const newTheme = current === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

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
