import { useEffect, useState } from "react";

// 🌟 PHASE 5 (financial tracking): recharts (~120KB) is dynamically imported here,
// so it only loads when a Studio Manager actually opens the Finance page — same
// pattern as the PDF/Excel export libraries in Reports-Page.jsx.
export default function FinanceCharts({ trend, currentPeriod }) {
  const [Recharts, setRecharts] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("recharts").then((mod) => {
      if (mounted) setRecharts(mod);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Recharts) {
    return (
      <div className="loading-text" style={{ textAlign: "center", padding: "40px" }}>
        🔄 Charts-ka ayaa la soo kicinayaa...
      </div>
    );
  }

  const {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
  } = Recharts;

  const barData = currentPeriod
    ? [
        { name: "This Period", Income: currentPeriod.income, Expenses: currentPeriod.expenses, "Net Profit": currentPeriod.netProfit },
      ]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ marginBottom: "12px", color: "#1e293b", fontSize: "15px" }}>📈 Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#dc2626" strokeWidth={2} />
            <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {barData.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "12px", color: "#1e293b", fontSize: "15px" }}>💵 Income vs Expenses (Current Period)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#4f46e5" />
              <Bar dataKey="Expenses" fill="#dc2626" />
              <Bar dataKey="Net Profit" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
