import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "lenssuite-theme"; // "light" | "dark" — absent means "follow system"

function getSystemPrefersDark() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// 🌟 Dark mode: resolves to the saved preference, falling back to the OS/browser
// preference (prefers-color-scheme) when the user has never explicitly chosen.
export default function useTheme() {
  const [stored, setStored] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [systemDark, setSystemDark] = useState(getSystemPrefersDark);

  useEffect(() => {
    applyTheme(stored);
  }, [stored]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const isDark = stored ? stored === "dark" : systemDark;

  const toggleTheme = useCallback(() => {
    setStored((prev) => {
      const currentlyDark = prev ? prev === "dark" : getSystemPrefersDark();
      const next = currentlyDark ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
}
