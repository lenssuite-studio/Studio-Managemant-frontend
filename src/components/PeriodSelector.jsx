import { PERIOD_LABELS } from "../utils/reportPeriods";

// Shared Daily/Weekly/Monthly/Yearly/Custom Range filter bar used by
// Reports-Page and Finance. `right` renders extra actions (e.g. export
// buttons) flush to the right edge of the same card.
export default function PeriodSelector({
  period,
  setPeriod,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  onApplyCustom,
  right,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      {Object.keys(PERIOD_LABELS).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => setPeriod(key)}
          className={
            period === key
              ? "rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300"
              : "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }
        >
          {PERIOD_LABELS[key]}
        </button>
      ))}

      {period === "custom" && (
        <div className="ml-1 flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <span className="text-slate-400">—</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            type="button"
            onClick={onApplyCustom}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
          >
            Apply
          </button>
        </div>
      )}

      {right && <div className="ml-auto flex gap-2">{right}</div>}
    </div>
  );
}
