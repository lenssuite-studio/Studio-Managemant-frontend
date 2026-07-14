import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReport, getRevenueTrend } from "../features/ReportsSlice";
import { getExpenses, addExpense, deleteExpense } from "../features/ExpensesSlice";
import { getPeriodRange } from "../utils/reportPeriods";
import FinanceCharts from "../components/FinanceCharts";
import StatCard from "../components/StatCard";
import PeriodSelector from "../components/PeriodSelector";
import Pill from "../components/Pill";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaReceipt } from "react-icons/fa";

const EXPENSE_CATEGORIES = ["Rent", "Equipment", "Supplies", "Utilities", "Salaries", "Marketing", "Other"];

const emptyExpenseForm = {
  category: "Other",
  description: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
};

const INPUT_CLASS =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

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
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          <span>💰</span> Financial Tracking
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Dakhliga, kharashaadka, iyo faa'iidada saafiga ah (Net Profit) ee studio-gaaga.
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
      />

      {loading && (
        <div className="flex justify-center py-6 text-sm text-slate-500 dark:text-slate-400">
          🔄 Xogta maaliyadda ayaa la soo kicinayaa...
        </div>
      )}

      {/* SUMMARY CARDS: Income / Expenses / Net Profit */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon="💰" tone="green" label="Income" value={`$${income.toLocaleString()}`} />
        <StatCard icon="💸" tone="red" label="Expenses" value={`$${totalExpenses.toLocaleString()}`} valueClassName="text-red-500!" />
        <StatCard
          icon="📈"
          tone={netProfit >= 0 ? "green" : "red"}
          label="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          valueClassName={netProfit >= 0 ? "text-emerald-500!" : "text-red-500!"}
        />
      </div>

      {/* PAYMENT METHOD BREAKDOWN */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">💳 Payment Method Breakdown</h3>
        <div className="flex flex-col gap-2.5">
          {!report?.paymentBreakdown || report.paymentBreakdown.length === 0 ? (
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

      {/* CHARTS */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <FinanceCharts trend={trend} currentPeriod={{ income, expenses: totalExpenses, netProfit }} />
      </div>

      {/* ADD EXPENSE */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <FaPlus size={13} /> Add Expense
        </h3>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</label>
            <select name="category" value={formData.category} onChange={handleFormChange} className={INPUT_CLASS}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Amount ($) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleFormChange}
              placeholder="$0"
              required
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleFormChange} className={INPUT_CLASS} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Optional note"
              className={INPUT_CLASS}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>

      {/* EXPENSE LIST */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <FaReceipt size={13} /> Expenses (This Period)
        </h3>
        {!expensesLoading && expenses.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Wax kharash ah lama diiwaan gelin muddadan.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  {["Date", "Category", "Description", "Amount", "Added By", "Actions"].map((label) => (
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
                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill tone="red">{expense.category}</Pill>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{expense.description || "—"}</td>
                    <td className="px-5 py-3.5 font-semibold text-red-500">${expense.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {expense.createdBy?.username || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDeleteExpense(expense)}
                        title="Tirtir Kharashka"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-500 hover:shadow-sm dark:hover:bg-red-500/10"
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
