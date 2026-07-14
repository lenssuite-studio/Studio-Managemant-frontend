import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingChanges,
  approvePendingChange,
  rejectPendingChange,
} from "../features/ApprovalsSlice";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import Pill, { actionTypeTone } from "../components/Pill";

const actionLabels = { edit: "Edit", delete: "Delete", archive: "Archive" };

function DiffView({ pendingChange }) {
  const reasonNote = pendingChange.reason ? (
    <div className="mb-1.5 flex items-start gap-1.5 text-xs italic text-slate-500 dark:text-slate-400">
      <span>💬</span> {pendingChange.reason}
    </div>
  ) : null;

  if (pendingChange.actionType !== "edit") {
    return (
      <div>
        {reasonNote}
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {pendingChange.actionType === "delete"
            ? "Codsi ah in order-ka gabi ahaanba la tirtiro"
            : "Codsi ah in order-ka la kaydiyo (archive)"}
        </span>
      </div>
    );
  }

  const fields = Object.keys(pendingChange.proposedChanges || {});

  return (
    <div className="flex flex-col gap-1">
      {reasonNote}
      {fields.map((field) => (
        <div key={field} className="text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{field}:</span>{" "}
          <span className="text-red-500">{String(pendingChange.originalSnapshot?.[field] ?? "—")}</span>{" "}
          <span className="text-slate-400">→</span>{" "}
          <span className="text-emerald-500">{String(pendingChange.proposedChanges?.[field] ?? "—")}</span>
        </div>
      ))}
    </div>
  );
}

export default function Approvals() {
  const dispatch = useDispatch();
  const { pendingChanges, loading, error } = useSelector((state) => state.Approvals);

  useEffect(() => {
    dispatch(getPendingChanges());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleApprove = async (pendingChange) => {
    if (!window.confirm(`Ma ansixinaysaa isbeddelkan (${actionLabels[pendingChange.actionType]})?`)) return;
    try {
      await dispatch(approvePendingChange(pendingChange._id)).unwrap();
      toast.success("Isbeddelka waa la ansixiyay! ✅");
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  const handleReject = async (pendingChange) => {
    if (!window.confirm(`Ma diidaysaa isbeddelkan (${actionLabels[pendingChange.actionType]})?`)) return;
    try {
      await dispatch(rejectPendingChange(pendingChange._id)).unwrap();
      toast.success("Isbeddelka waa la diiday.");
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  return (
    <div>
      <div className="mb-1 text-sm text-slate-400 dark:text-slate-500">
        Studio <span className="mx-1">›</span>
        <span className="text-slate-600 dark:text-slate-300">Approvals</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Pending Approvals</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Isbeddelada uu shaqaaluhu (employees) codsaday ee sugaya ansixintaada.
      </p>

      <div className="mt-6 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {!loading && error ? (
          <div className="px-6 py-10 text-center text-sm text-red-500">
            Wax qalad ah ayaa dhacay markii la soo qaadanayay isbeddellada sugaya: {error}
          </div>
        ) : !loading && pendingChanges.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Wax isbeddel sugaya lama helin. ✅
          </div>
        ) : (
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["Order", "Action", "Requested By", "Changes", "Requested At", "Actions"].map((label) => (
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
              {pendingChanges.map((pc) => (
                <tr
                  key={pc._id}
                  className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {pc.customerId?.fullName || "—"}
                    </div>
                    <code className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {pc.customerId?.folderName}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <Pill tone={actionTypeTone(pc.actionType)}>{actionLabels[pc.actionType]}</Pill>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{pc.requestedBy?.username || "—"}</td>
                  <td className="px-5 py-4">
                    <DiffView pendingChange={pc} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(pc.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleApprove(pc)}
                        title="Ansixi"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-sm dark:hover:bg-emerald-500/10"
                      >
                        <FaCheck size={13} />
                      </button>
                      <button
                        onClick={() => handleReject(pc)}
                        title="Diid"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-500 hover:shadow-sm dark:hover:bg-red-500/10"
                      >
                        <FaTimes size={13} />
                      </button>
                    </div>
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
