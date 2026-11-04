"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode } from "react";

export type ThemePreference = "dark" | "light" | "system";
type ResolvedTheme = Exclude<ThemePreference, "system">;
type ThemeContextValue = { preference: ThemePreference; resolvedTheme: ResolvedTheme; setPreference: (theme: ThemePreference) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "moses-portfolio-theme";
const changeEvent = "moses-portfolio-theme-change";
const serverTheme = () => "dark" as const;

const palettes: Record<ResolvedTheme, CSSProperties> = {
  dark: {
    "--canvas": "#0f0f0f", "--surface": "#111412", "--surface-raised": "#151916", "--surface-inset": "#0d0f0e",
    "--ink": "#f2f3ee", "--body": "#c7cbc5", "--muted": "#929b92", "--dim": "#717a72",
    "--line": "rgba(237,244,235,0.13)", "--line-soft": "rgba(237,244,235,0.075)",
    "--accent": "#8cba85", "--accent-strong": "#a6cb9e", "--accent-hover": "#c0dfb8", "--accent-ink": "#101311",
    "--warm-accent": "#c7a77a", "--shade": "rgba(0,0,0,0.5)",
  } as CSSProperties,
  light: {
    "--canvas": "#f1efe7", "--surface": "#faf9f4", "--surface-raised": "#fffef9", "--surface-inset": "#e7e8df",
    "--ink": "#171d18", "--body": "#303b32", "--muted": "#566257", "--dim": "#677468",
    "--line": "rgba(26,39,28,0.2)", "--line-soft": "rgba(26,39,28,0.12)",
    "--accent": "#386b42", "--accent-strong": "#4d8056", "--accent-hover": "#2f5b38", "--accent-ink": "#f8faf5",
    "--warm-accent": "#875d2f", "--shade": "rgba(27,34,26,0.18)",
  } as CSSProperties,
};

function readPreference(): ThemePreference {
  const saved = window.localStorage.getItem(storageKey);
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "dark";
}

function readResolvedTheme(): ResolvedTheme {
  const preference = readPreference();
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
    media.removeEventListener("change", callback);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribeTheme, readPreference, serverTheme);
  const resolved = useSyncExternalStore(subscribeTheme, readResolvedTheme, serverTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const setPreference = useCallback((theme: ThemePreference) => {
    window.localStorage.setItem(storageKey, theme);
    window.dispatchEvent(new Event(changeEvent));
  }, []);
  const value = useMemo<ThemeContextValue>(() => ({ preference, resolvedTheme: resolved, setPreference }), [preference, resolved, setPreference]);

  return <ThemeContext.Provider value={value}>
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] transition-colors duration-300" style={palettes[resolved]}>{children}</div>
  </ThemeContext.Provider>;
}

export function useThemePreference() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useThemePreference must be used inside ThemeProvider.");
  return value;
}
