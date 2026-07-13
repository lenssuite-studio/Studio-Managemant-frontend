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

  autoTable(doc, {
    startY: 32,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue (Paid)", `$${report.revenue.totalPaid.toLocaleString()}`],
      ["Outstanding (Debt)", `$${report.revenue.totalOutstanding.toLocaleString()}`],
      ["Total Orders", String(report.revenue.orderCount)],
      ["Total Photos", String(report.photoCount)],
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

  doc.save(`studio-report-${fromStr}-to-${toStr}.pdf`);
}

// 🌟 PHASE 4: Excel export — one workbook, three sheets
export function exportReportToExcel(report, periodLabel) {
  const { fromStr, toStr } = rangeLabel(report);

  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: "Period", Value: `${periodLabel}: ${fromStr} - ${toStr}` },
    { Metric: "Total Revenue (Paid)", Value: report.revenue.totalPaid },
    { Metric: "Outstanding (Debt)", Value: report.revenue.totalOutstanding },
    { Metric: "Total Orders", Value: report.revenue.orderCount },
    { Metric: "Total Photos", Value: report.photoCount },
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

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(workbook, employeeSheet, "Employee Performance");
  XLSX.utils.book_append_sheet(workbook, serviceSheet, "Service Breakdown");

  XLSX.writeFile(workbook, `studio-report-${fromStr}-to-${toStr}.xlsx`);
}
