// Meridian theme controller (React).
//
// Dark mode is pure token overrides in dls/tokens.css. This provider does not
// style anything: it decides WHICH theme is active, reflects it onto <html> as
// [data-theme], remembers the user's choice, and follows the OS setting while
// the user has not chosen explicitly. A tiny inline script in index.html sets
// the initial theme before first paint to avoid a flash; this picks it up.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const STORAGE_KEY = "meridian-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

const systemPrefersDark = (): boolean =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function storedChoice(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function initialTheme(): Theme {
  // Trust the attribute the pre-paint script already set, then fall back.
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return storedChoice() ?? (systemPrefersDark() ? "dark" : "light");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable; theme still applies for this session */
      }
      return next;
    });
  }, []);

  // Follow the OS setting live, but only while the user has not chosen.
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!storedChoice()) setTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
