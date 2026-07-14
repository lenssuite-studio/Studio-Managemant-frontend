import useTheme from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa";

// Shared centered-card shell for the lighter-weight auth flows
// (ForgotPassword, ResetPassword) — same brand identity as AuthShell,
// without the split marketing panel.
export default function AuthCard({ children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <button
        type="button"
        onClick={toggleTheme}
        title="Beddel muuqaalka (Light/Dark)"
        aria-label="Toggle dark mode"
        className="fixed right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </button>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-lg shadow-indigo-600/30">
          📸
        </div>
        {children}
      </div>
    </div>
  );
}
