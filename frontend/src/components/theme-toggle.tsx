"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "theme-preference";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

const getSnapshot = () => {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getServerSnapshot = () => "light";

export function ThemeToggle() {
  const systemTheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | null>(
    null,
  );
  const theme = themeOverride ?? systemTheme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeOverride(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
      <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
