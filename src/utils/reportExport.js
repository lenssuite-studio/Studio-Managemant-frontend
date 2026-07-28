import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function roleLabel(role) {
  if (role === "studio_manager" || role === "studio_admin") return "Studio Manager";
  if (role === "employee") return "Employee";
  return role || "—";
}

function rangeLabel(report) {
  const fromStr = new Date(report.range.from).toLocaleDateString();
  const toStr = new Date(report.range.to).toLocaleDateString();
  return { fromStr, toStr };
}

// 🌟 PHASE 4: PDF export — summary + employee performance + service breakdown
export function exportReportToPDF(report, periodLabel) {
  const { fromStr, toStr } = rangeLabel(report);
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("LensSuite Studio Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`${periodLabel}: ${fromStr} - ${toStr}`, 14, 25);

  const totalExpenses = report.expenses?.total || 0;
  const netProfit = report.netProfit ?? report.revenue.totalPaid - totalExpenses;

  autoTable(doc, {
    startY: 32,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue (Paid)", `$${report.revenue.totalPaid.toLocaleString()}`],
      ["Outstanding (Debt)", `$${report.revenue.totalOutstanding.toLocaleString()}`],
      ["Total Orders", String(report.revenue.orderCount)],
      ["Total Photos", String(report.photoCount)],
      ["Total Cash", `$${(report.revenue.totalCash || 0).toLocaleString()}`],
      ["Total Zaad", `$${(report.revenue.totalZaad || 0).toLocaleString()}`],
      ["Total eDahab", `$${(report.revenue.totaleDahab || 0).toLocaleString()}`],
      ["Total Expenses", `$${totalExpenses.toLocaleString()}`],
      ["Net Profit", `$${netProfit.toLocaleString()}`],
    ],
  });

  let nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text("Employee Performance", 14, nextY - 4);

  autoTable(doc, {
    startY: nextY,
    head: [["Employee", "Role", "Orders", "Revenue", "Photos"]],
    body: report.employeePerformance.length
      ? report.employeePerformance.map((e) => [
          e.username,
          roleLabel(e.role),
          String(e.orderCount),
          `$${e.revenue.toLocaleString()}`,
          String(e.photoCount),
        ])
      : [["No data for this period", "", "", "", ""]],
  });

  nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text("Service Breakdown (Most Requested First)", 14, nextY - 4);

  autoTable(doc, {
    startY: nextY,
    head: [["Service (Photo Type)", "Orders"]],
    body: report.serviceBreakdown.length
      ? report.serviceBreakdown.map((s) => [s.photoType || "—", String(s.count)])
      : [["No data for this period", ""]],
  });

  nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text("Payment Method Breakdown", 14, nextY - 4);

  autoTable(doc, {
    startY: nextY,
    head: [["Payment Method", "Orders", "Amount Collected"]],
    body: report.paymentBreakdown && report.paymentBreakdown.length
      ? report.paymentBreakdown.map((p) => [p.paymentMethod || "—", String(p.count), `$${p.totalPaid.toLocaleString()}`])
      : [["No data for this period", "", ""]],
  });

  nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text("Expenses by Category", 14, nextY - 4);

  const expensesByCategory = report.expenses?.byCategory || [];
  autoTable(doc, {
    startY: nextY,
    head: [["Category", "Amount"]],
    body: expensesByCategory.length
      ? expensesByCategory.map((e) => [e.category || "—", `$${e.total.toLocaleString()}`])
      : [["No expenses for this period", ""]],
  });

  doc.save(`studio-report-${fromStr}-to-${toStr}.pdf`);
}

// 🌟 PHASE 4: Excel export — one workbook, three sheets
export function exportReportToExcel(report, periodLabel) {
  const { fromStr, toStr } = rangeLabel(report);

  const totalExpenses = report.expenses?.total || 0;
  const netProfit = report.netProfit ?? report.revenue.totalPaid - totalExpenses;

  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: "Period", Value: `${periodLabel}: ${fromStr} - ${toStr}` },
    { Metric: "Total Revenue (Paid)", Value: report.revenue.totalPaid },
    { Metric: "Outstanding (Debt)", Value: report.revenue.totalOutstanding },
    { Metric: "Total Orders", Value: report.revenue.orderCount },
    { Metric: "Total Photos", Value: report.photoCount },
    { Metric: "Total Cash", Value: report.revenue.totalCash || 0 },
    { Metric: "Total Zaad", Value: report.revenue.totalZaad || 0 },
    { Metric: "Total eDahab", Value: report.revenue.totaleDahab || 0 },
    { Metric: "Total Expenses", Value: totalExpenses },
    { Metric: "Net Profit", Value: netProfit },
  ]);

  const employeeSheet = XLSX.utils.json_to_sheet(
    report.employeePerformance.map((e) => ({
      Employee: e.username,
      Role: roleLabel(e.role),
      Orders: e.orderCount,
      Revenue: e.revenue,
      Photos: e.photoCount,
    })),
  );

  const serviceSheet = XLSX.utils.json_to_sheet(
    report.serviceBreakdown.map((s) => ({
      "Photo Type": s.photoType,
      Orders: s.count,
    })),
  );

  const paymentSheet = XLSX.utils.json_to_sheet(
    (report.paymentBreakdown || []).map((p) => ({
      "Payment Method": p.paymentMethod,
      Orders: p.count,
      "Amount Collected": p.totalPaid,
    })),
  );

  const expensesSheet = XLSX.utils.json_to_sheet(
    (report.expenses?.byCategory || []).map((e) => ({
      Category: e.category,
      Amount: e.total,
    })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(workbook, employeeSheet, "Employee Performance");
  XLSX.utils.book_append_sheet(workbook, serviceSheet, "Service Breakdown");
  XLSX.utils.book_append_sheet(workbook, paymentSheet, "Payment Breakdown");
  XLSX.utils.book_append_sheet(workbook, expensesSheet, "Expenses");

  XLSX.writeFile(workbook, `studio-report-${fromStr}-to-${toStr}.xlsx`);
}
