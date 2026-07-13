import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReport, getRevenueTrend } from "../features/ReportsSlice";
import { getExpenses, addExpense, deleteExpense } from "../features/ExpensesSlice";
import { getPeriodRange, PERIOD_LABELS } from "../utils/reportPeriods";
import FinanceCharts from "../components/FinanceCharts";
import toast from "react-hot-toast";
import "./AddCustomer.css";
import "./Dashboard.css";
import "./report.css";

const EXPENSE_CATEGORIES = ["Rent", "Equipment", "Supplies", "Utilities", "Salaries", "Marketing", "Other"];

const emptyExpenseForm = {
  category: "Other",
  description: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function Finance() {
  const dispatch = useDispatch();
  const { data: report, trend, loading } = useSelector((state) => state.Reports);
  const { expenses, loading: expensesLoading } = useSelector((state) => state.Expenses);

  const [period, setPeriod] = useState("monthly");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [formData, setFormData] = useState(emptyExpenseForm);

  const runReport = (from, to) => {
    dispatch(getReport({ from: from.toISOString(), to: to.toISOString() }));
    dispatch(getExpenses({ from: from.toISOString(), to: to.toISOString() }));
  };

  useEffect(() => {
    if (period === "custom") return;
    const range = getPeriodRange(period);
    if (range) runReport(range.from, range.to);
  }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getRevenueTrend(6));
  }, [dispatch]);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Fadlan geli qadar (amount) sax ah.");
      return;
    }
    try {
      await dispatch(addExpense(formData)).unwrap();
      toast.success("Kharashka waa la daray! ➕");
      setFormData(emptyExpenseForm);
      // Isbedel xogta warbixinta si Net Profit-ku isla markiiba u cusboonaado
      if (period !== "custom") {
        const range = getPeriodRange(period);
        if (range) runReport(range.from, range.to);
      }
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (!window.confirm(`Ma tirtiraysaa kharashkan: ${expense.description || expense.category}?`)) return;
    try {
      await dispatch(deleteExpense(expense._id)).unwrap();
      toast.success("Kharashka waa la tirtiray! 🗑️");
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  const income = report?.revenue?.totalPaid || 0;
  const totalExpenses = report?.expenses?.total || 0;
  const netProfit = report?.netProfit ?? income - totalExpenses;

  return (
    <div className="lenssuite-main reports-container">
      <div className="dashboard-header-row" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="form-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>💰</span> Financial Tracking
          </h1>
          <p className="form-subtitle">
            Dakhliga, kharashaadka, iyo faa'iidada saafiga ah (Net Profit) ee studio-gaaga.
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
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="form-input" />
            <span>—</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="form-input" />
            <button type="button" className="btn-submit" onClick={handleApplyCustom}>
              Apply
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-wrapper" style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <div className="loading-text" style={{ fontSize: "16px", color: "#64748b" }}>
            🔄 Xogta maaliyadda ayaa la soo kicinayaa...
          </div>
        </div>
      )}

      {/* SUMMARY CARDS: Income / Expenses / Net Profit */}
      <div className="reports-stats-grid" style={{ marginTop: "24px" }}>
        <div className="report-card income">
          <div className="card-icon" style={{ background: "#e6f4ea", color: "#137333" }}>💰</div>
          <div className="card-info">
            <span className="card-label">Income</span>
            <h2 className="card-value">${income.toLocaleString()}</h2>
          </div>
        </div>

        <div className="report-card debt">
          <div className="card-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>💸</div>
          <div className="card-info">
            <span className="card-label">Expenses</span>
            <h2 className="card-value" style={{ color: "#dc2626" }}>${totalExpenses.toLocaleString()}</h2>
          </div>
        </div>

        <div className="report-card users">
          <div className="card-icon" style={{ background: netProfit >= 0 ? "#e6f4ea" : "#fee2e2", color: netProfit >= 0 ? "#137333" : "#dc2626" }}>
            📈
          </div>
          <div className="card-info">
            <span className="card-label">Net Profit</span>
            <h2 className="card-value" style={{ color: netProfit >= 0 ? "#137333" : "#dc2626" }}>
              ${netProfit.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* PAYMENT METHOD BREAKDOWN */}
      <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
        <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "16px" }}>💳 Payment Method Breakdown</h3>
        <div className="segment-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!report?.paymentBreakdown || report.paymentBreakdown.length === 0 ? (
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

      {/* CHARTS */}
      <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
        <FinanceCharts trend={trend} currentPeriod={{ income, expenses: totalExpenses, netProfit }} />
      </div>

      {/* ADD EXPENSE */}
      <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
        <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "16px" }}>➕ Add Expense</h3>
        <form onSubmit={handleAddExpense} className="form-grid">
          <div className="input-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleFormChange} className="form-select">
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Amount ($) *</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} placeholder="$0" required />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleFormChange} />
          </div>
          <div className="input-group">
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleFormChange} placeholder="Optional note" />
          </div>
          <div className="form-actions" style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn-submit">Add Expense</button>
          </div>
        </form>
      </div>

      {/* EXPENSE LIST */}
      <div className="form-card" style={{ marginTop: "24px", padding: "20px" }}>
        <h3 style={{ marginBottom: "16px", color: "#1e293b", fontSize: "16px" }}>🧾 Expenses (This Period)</h3>
        <div className="table-container">
          {!expensesLoading && expenses.length === 0 ? (
            <div className="loading-text" style={{ textAlign: "center", padding: "16px" }}>
              Wax kharash ah lama diiwaan gelin muddadan.
            </div>
          ) : (
            <table className="lenssuite-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Added By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      <span className="status-pill" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.description || "—"}</td>
                    <td className="td-remaining" style={{ color: "#dc2626" }}>${expense.amount.toLocaleString()}</td>
                    <td>{expense.createdBy?.username || "—"}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteExpense(expense)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "5px 10px" }}
                        title="Tirtir Kharashka"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
