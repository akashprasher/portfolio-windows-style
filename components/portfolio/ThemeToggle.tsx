"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type ThemePreference = "system" | "light" | "dark";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const preference: ThemePreference =
    theme === "light" || theme === "dark" ? theme : "system";
  const displayedPreference = mounted ? preference : "system";

  return (
    <div className="theme-toggle">
      <svg
        aria-hidden="true"
        className="theme-toggle-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {displayedPreference === "system" ? (
          <>
            <rect x="3" y="4" width="18" height="13" rx="1.5" />
            <path d="M8 21h8m-4-4v4" />
          </>
        ) : displayedPreference === "dark" ? (
          <>
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </>
        ) : (
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />
        )}
      </svg>
      <select
        className="theme-toggle-select"
        aria-label="Color theme"
        value={displayedPreference}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
