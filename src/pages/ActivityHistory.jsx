import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityHistory } from "../features/ActivityHistorySlice";
import Pill, { actionTypeTone, outcomeTone } from "../components/Pill";

const actionLabels = { create: "Create", edit: "Edit", delete: "Delete", archive: "Archive" };

function formatSnapshot(snapshot) {
  if (!snapshot) return "—";
  const entries = Object.entries(snapshot);
  if (entries.length === 0) return "—";
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(", ");
}

export default function ActivityHistory() {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.ActivityHistory);

  useEffect(() => {
    dispatch(getActivityHistory());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-1 text-sm text-slate-400 dark:text-slate-500">
        Studio <span className="mx-1">›</span>
        <span className="text-slate-600 dark:text-slate-300">Activity History</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Activity History</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Diiwaanka joogtada ah ee dhammaan isbeddelada order-yada studio-gaaga — cid, waqti, iyo qiyamka hore/dib.
      </p>

      <div className="mt-6 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {!loading && entries.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Weli wax activity ah lama helin.
          </div>
        ) : (
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["Order", "Action", "Outcome", "User", "Before", "After", "Timestamp"].map((label) => (
                  <th
                    key={label}
                    className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry._id}
                  className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {entry.customerId?.fullName || "(deleted)"}
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={actionTypeTone(entry.action)}>{actionLabels[entry.action]}</Pill>
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={outcomeTone(entry.outcome)}>{entry.outcome}</Pill>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {entry.userId?.username || "—"}
                  </td>
                  <td className="max-w-[220px] px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {formatSnapshot(entry.before)}
                  </td>
                  <td className="max-w-[220px] px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                    {formatSnapshot(entry.after)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
