import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReport } from "../features/ReportsSlice";
import { getPeriodRange, PERIOD_LABELS } from "../utils/reportPeriods";
import toast from "react-hot-toast";
import "./Dashboard.css";
import "./report.css";

const roleLabel = (role) => {
  if (role === "studio_manager" || role === "studio_admin") return "Studio Manager";
  if (role === "employee") return "Employee";
  return role || "—";
};

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
    <div className="lenssuite-main reports-container">
      {/* HEADER */}
      <div className="dashboard-header-row" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="form-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>📊</span> Studio Analytics & Reports
          </h1>
          <p className="form-subtitle">
            Halkan ka la soco dakhliga, sawirrada, waxqabadka shaqaalaha, iyo adeegyada ugu badan ee la codsado.
          </p>
        </div>
      </div>

      {/* PERIOD SELECTOR */}
      <div
        className="form-card"
        style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}
      >
        {Object.keys(PERIOD_LABELS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={period === key ? "btn-submit" : "btn-cancel"}
            style={{ padding: "8px 16px" }}
          >
            {PERIOD_LABELS[key]}
          </button>
        ))}

        {period === "custom" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="form-input"
            />
            <span>—</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="form-input"
            />
            <button type="button" className="btn-submit" onClick={handleApplyCustom}>
              Apply
            </button>
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button type="button" className="btn-cancel" onClick={handleExportPDF} disabled={!report || loading}>
            📄 Export PDF
          </button>
          <button type="button" className="btn-cancel" onClick={handleExportExcel} disabled={!report || loading}>
            📊 Export Excel
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-wrapper" style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <div className="loading-text" style={{ fontSize: "16px", color: "#64748b" }}>
            🔄 Xogta warbixinta ayaa la soo kicinayaa...
          </div>
        </div>
      )}

      {!loading && report && (
        <>
          {/* STATS GRID */}
          <div className="reports-stats-grid" style={{ marginTop: "24px" }}>
            <div className="report-card income">
              <div className="card-icon" style={{ background: "#e6f4ea", color: "#137333" }}>💰</div>
              <div className="card-info">
                <span className="card-label">Revenue (Paid)</span>
                <h2 className="card-value">${report.revenue.totalPaid.toLocaleString()}</h2>
              </div>
            </div>

            <div className="report-card debt">
              <div className="card-icon" style={{ background: "#fef7e0", color: "#b06000" }}>💸</div>
              <div className="card-info">
                <span className="card-label">Outstanding (Debt)</span>
                <h2 className="card-value" style={{ color: report.revenue.totalOutstanding > 0 ? "#dc2626" : "#475569" }}>
                  ${report.revenue.totalOutstanding.toLocaleString()}
                </h2>
              </div>
            </div>

            <div className="report-card users">
              <div className="card-icon" style={{ background: "#e8f0fe", color: "#1a73e8" }}>🧾</div>
              <div className="card-info">
                <span className="card-label">Total Orders</span>
                <h2 className="card-value">{report.revenue.orderCount}</h2>
              </div>
            </div>

            <div className="report-card gallery">
              <div className="card-icon" style={{ background: "#f3e8ff", color: "#7e22ce" }}>📸</div>
              <div className="card-info">
                <span className="card-label">Photo Count</span>
                <h2 className="card-value">{report.photoCount}</h2>
              </div>
            </div>
          </div>

          {topService && (
            <div className="form-card" style={{ marginTop: "24px", padding: "16px 20px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>⭐ Most Requested Service</span>
              <h3 style={{ margin: "4px 0 0", color: "#1e293b" }}>
                {topService.photoType} — {topService.count} order{topService.count === 1 ? "" : "s"}
              </h3>
            </div>
          )}

          {/* EMPLOYEE PERFORMANCE */}
          <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "16px" }}>👥 Employee Performance</h3>
            <div className="table-container">
              {report.employeePerformance.length === 0 ? (
                <div className="loading-text" style={{ textAlign: "center", padding: "16px" }}>
                  Wax xog ah lama helin muddadan.
                </div>
              ) : (
                <table className="lenssuite-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Photos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.employeePerformance.map((e) => (
                      <tr key={e.userId}>
                        <td className="td-name">{e.username}</td>
                        <td>{roleLabel(e.role)}</td>
                        <td>{e.orderCount}</td>
                        <td className="td-paid">${e.revenue.toLocaleString()}</td>
                        <td>{e.photoCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* SERVICE BREAKDOWN */}
          <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "16px" }}>🖼️ Service Breakdown</h3>
            <div className="segment-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {report.serviceBreakdown.length === 0 ? (
                <span style={{ color: "#64748b", fontSize: "14px" }}>Wax xog ah lama helin muddadan.</span>
              ) : (
                report.serviceBreakdown.map((s) => (
                  <div key={s.photoType} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#64748b" }}>{s.photoType}</span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>{s.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PAYMENT METHOD BREAKDOWN */}
          <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "16px" }}>💳 Payment Method Breakdown</h3>
            <div className="segment-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {!report.paymentBreakdown || report.paymentBreakdown.length === 0 ? (
                <span style={{ color: "#64748b", fontSize: "14px" }}>Wax xog ah lama helin muddadan.</span>
              ) : (
                report.paymentBreakdown.map((p) => (
                  <div key={p.paymentMethod} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#64748b" }}>{p.paymentMethod}</span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
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
