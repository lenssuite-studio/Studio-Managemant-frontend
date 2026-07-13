// 🌟 PHASE 4: computes the [from, to] Date range for each report period preset.
// "Custom" has no computed range — the caller supplies its own from/to.
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export function getPeriodRange(period) {
  const now = new Date();

  if (period === "daily") {
    return { from: startOfDay(now), to: endOfDay(now) };
  }

  if (period === "weekly") {
    const day = now.getDay(); // 0=Sun..6=Sat
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    return { from: startOfDay(monday), to: endOfDay(now) };
  }

  if (period === "monthly") {
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: startOfDay(firstOfMonth), to: endOfDay(now) };
  }

  if (period === "yearly") {
    const firstOfYear = new Date(now.getFullYear(), 0, 1);
    return { from: startOfDay(firstOfYear), to: endOfDay(now) };
  }

  return null;
}

export const PERIOD_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  custom: "Custom Range",
};
