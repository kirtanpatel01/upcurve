"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ModeToggle({
  asChild,
  size,
}: {
  asChild?: boolean;
  size?: number;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const content = (
    <>
      {theme === "light" ? (
        <Sun size={size} className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-primary" />
      ) : (
        <Moon size={size} className="scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-primary" />
      )}
      <span className="group-data-[collapsible=icon]:hidden mt-1">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </>
  );

  if (asChild) {
    return <span className="w-full flex items-center gap-2" onClick={toggleTheme}>{content}</span>;
  }

  return (
    <Button
      variant={"outline"}
      className='flex items-center rounded-full absolute top-4 right-4'
      onClick={toggleTheme}
    >
      {content}
    </Button>
  );
}
