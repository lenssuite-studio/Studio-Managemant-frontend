// Shared metric card used by Reports-Page and Finance — icon chip + label +
// big value, with the same hover lift as the rest of the premium SaaS shell.

const ICON_TONES = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

export default function StatCard({ icon, label, value, tone = "indigo", valueClassName = "" }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl ${ICON_TONES[tone]}`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <h2 className={`text-2xl font-bold text-slate-900 dark:text-white ${valueClassName}`}>{value}</h2>
      </div>
    </div>
  );
}
