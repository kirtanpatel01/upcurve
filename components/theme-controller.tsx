'use client'
import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function ThemeController({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"halloween" | "winter">("winter");

  // Load saved theme on mount
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "halloween" | "winter") || "winter";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "halloween" ? "winter" : "halloween";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer select-none ${className || ""}`}
      onClick={toggleTheme} // 👈 handles click anywhere
    >
      <label className="swap swap-rotate pointer-events-none">
        <input
          type="checkbox"
          className="theme-controller"
          checked={theme === "halloween"}
          readOnly // 👈 avoid warning since we’re controlling manually
        />
        <Sun className="swap-off" size={16} />
        <Moon className="swap-on" size={16} />
      </label>

      <span className="text-sm">
        {theme === "halloween" ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}

export default ThemeController;
