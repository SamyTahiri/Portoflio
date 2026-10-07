import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./useTheme";

// night runs from 6pm to 6am on the visitor's own clock (index.html applies the same rule before first paint)
const NIGHT_START = 18;
const NIGHT_END = 6;
// a manual pick only lasts for the visit, so the next one follows the clock again
const OVERRIDE_KEY = "theme-override";

function clockTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= NIGHT_START || hour < NIGHT_END ? "dark" : "light";
}

function readOverride(): Theme | null {
  try {
    const value = sessionStorage.getItem(OVERRIDE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<Theme | null>(readOverride);
  const [clock, setClock] = useState<Theme>(clockTheme);
  const theme = override ?? clock;

  // re-check every minute so an open tab turns dark at 6pm without a reload
  useEffect(() => {
    const timer = window.setInterval(() => setClock(clockTheme()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#18130e" : "#f6ead8");
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setOverride(next);
    try {
      sessionStorage.setItem(OVERRIDE_KEY, next);
    } catch {
      // storage can be blocked; the switch still works for this page view
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
