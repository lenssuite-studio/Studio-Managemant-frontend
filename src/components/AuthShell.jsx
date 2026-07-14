import useTheme from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa";

// Shared split-panel shell for Login/Register — brand panel on the left,
// form content (children) on the right. Single place for the theme toggle
// so every auth page gets it for free.
export default function AuthShell({ heading, description, children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950">
      <button
        type="button"
        onClick={toggleTheme}
        title="Beddel muuqaalka (Light/Dark)"
        aria-label="Toggle dark mode"
        className="fixed right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </button>

      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 px-14 py-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span>📸</span> LensSuite Admin
        </div>
        <h1 className="mt-10 text-4xl font-bold leading-tight">{heading}</h1>
        <p className="mt-5 max-w-md leading-relaxed text-indigo-100">{description}</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
