import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReport } from "../features/ReportsSlice";
import { getPeriodRange, PERIOD_LABELS } from "../utils/reportPeriods";
import toast from "react-hot-toast";
import { FaFileAlt, FaFileExcel } from "react-icons/fa";
import StatCard from "../components/StatCard";
import PeriodSelector from "../components/PeriodSelector";
import Pill, { roleTone } from "../components/Pill";

export default function Reports() {
  const dispatch = useDispatch();
  const { data: report, loading } = useSelector((state) => state.Reports);

  const [period, setPeriod] = useState("monthly");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const runReport = (from, to) => {
    dispatch(getReport({ from: from.toISOString(), to: to.toISOString() }));
  };

  // 🔥 Marka period-ku isbedelo (Daily/Weekly/Monthly/Yearly), toos u soo qaad xogta cusub
  useEffect(() => {
    if (period === "custom") return; // Custom wuxuu sugayaa "Apply" badhanka
    const range = getPeriodRange(period);
    if (range) runReport(range.from, range.to);
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) {
      toast.error("Fadlan dooro labada taariikhood (From iyo To).");
      return;
    }
    const from = new Date(`${customFrom}T00:00:00`);
    const to = new Date(`${customTo}T23:59:59.999`);
    if (from > to) {
      toast.error("Taariikhda 'From' waa in ay ka horreysaa 'To'.");
      return;
    }
    runReport(from, to);
  };

  // 🌟 Dynamic import: jspdf/xlsx (~1MB combined) suulo la geliyo kaliya marka
  // Manager-ku dhab ahaan riixo Export, halkii ay ku jiri lahaayeen bundle guud ee app-ka
  const handleExportPDF = async () => {
    if (!report) return;
    const { exportReportToPDF } = await import("../utils/reportExport");
    exportReportToPDF(report, PERIOD_LABELS[period]);
  };

  const handleExportExcel = async () => {
    if (!report) return;
    const { exportReportToExcel } = await import("../utils/reportExport");
    exportReportToExcel(report, PERIOD_LABELS[period]);
  };

  const topService = report?.serviceBreakdown?.[0] || null;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          <span>📊</span> Studio Analytics & Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Halkan ka la soco dakhliga, sawirrada, waxqabadka shaqaalaha, iyo adeegyada ugu badan ee la codsado.
        </p>
      </div>

      {/* PERIOD SELECTOR */}
      <PeriodSelector
        period={period}
        setPeriod={setPeriod}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
        onApplyCustom={handleApplyCustom}
        right={
          <>
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={!report || loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FaFileAlt /> Export PDF
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={!report || loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FaFileExcel /> Export Excel
            </button>
          </>
        }
      />

      {loading && (
        <div className="flex justify-center py-10 text-sm text-slate-500 dark:text-slate-400">
          🔄 Xogta warbixinta ayaa la soo kicinayaa...
        </div>
      )}

      {!loading && report && (
        <>
          {/* STATS GRID */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon="💰" tone="green" label="Revenue (Paid)" value={`$${report.revenue.totalPaid.toLocaleString()}`} />
            <StatCard
              icon="💸"
              tone="amber"
              label="Outstanding (Debt)"
              value={`$${report.revenue.totalOutstanding.toLocaleString()}`}
              valueClassName={report.revenue.totalOutstanding > 0 ? "text-red-500!" : ""}
            />
            <StatCard icon="🧾" tone="blue" label="Total Orders" value={report.revenue.orderCount} />
            <StatCard icon="📸" tone="purple" label="Photo Count" value={report.photoCount} />
          </div>

          {topService && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-sm text-slate-500 dark:text-slate-400">⭐ Most Requested Service</span>
              <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {topService.photoType} — {topService.count} order{topService.count === 1 ? "" : "s"}
              </h3>
            </div>
          )}

          {/* EMPLOYEE PERFORMANCE */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">👥 Employee Performance</h3>
            {report.employeePerformance.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Wax xog ah lama helin muddadan.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60">
                      {["Name", "Role", "Orders", "Revenue", "Photos"].map((label) => (
                        <th
                          key={label}
                          className="whitespace-nowrap border-b border-slate-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.employeePerformance.map((e) => (
                      <tr
                        key={e.userId}
                        className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{e.username}</td>
                        <td className="px-5 py-3.5">
                          <Pill tone={roleTone(e.role)}>
                            {e.role === "studio_manager" || e.role === "studio_admin"
                              ? "Studio Manager"
                              : e.role === "employee"
                                ? "Employee"
                                : e.role || "—"}
                          </Pill>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{e.orderCount}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                          ${e.revenue.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{e.photoCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SERVICE BREAKDOWN */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">🖼️ Service Breakdown</h3>
            <div className="flex flex-col gap-2.5">
              {report.serviceBreakdown.length === 0 ? (
                <span className="text-sm text-slate-500 dark:text-slate-400">Wax xog ah lama helin muddadan.</span>
              ) : (
                report.serviceBreakdown.map((s) => (
                  <div key={s.photoType} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{s.photoType}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{s.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PAYMENT METHOD BREAKDOWN */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">💳 Payment Method Breakdown</h3>
            <div className="flex flex-col gap-2.5">
              {!report.paymentBreakdown || report.paymentBreakdown.length === 0 ? (
                <span className="text-sm text-slate-500 dark:text-slate-400">Wax xog ah lama helin muddadan.</span>
              ) : (
                report.paymentBreakdown.map((p) => (
                  <div key={p.paymentMethod} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{p.paymentMethod}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {p.count} orders — ${p.totalPaid.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
