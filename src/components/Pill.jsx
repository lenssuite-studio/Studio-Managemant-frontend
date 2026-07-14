// Shared "status pill" used across every LensSuite table/list (Dashboard,
// Archive, Reports, Finance, ...) — one place to keep the premium-SaaS badge
// look (tinted background, colored dot, bold text) consistent everywhere.

const PILL_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide before:h-1.5 before:w-1.5 before:rounded-full before:bg-current";

const PILL_COLORS = {
  green:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
  purple:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400",
  amber:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
  red: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
  pink: "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-400",
  fuchsia:
    "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
  indigo:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400",
  orange:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
  slate:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export default function Pill({ tone = "slate", title, children }) {
  return (
    <span className={`${PILL_BASE} ${PILL_COLORS[tone]}`} title={title}>
      {children}
    </span>
  );
}

export const statusTone = (status) => {
  if (status === "Pending") return "amber";
  if (status === "Delivered") return "blue";
  if (status === "Completed") return "fuchsia";
  return "slate";
};

export const customerTypeTone = (customerType) => {
  if (customerType === "VIP") return "green";
  if (customerType === "NORMAL") return "blue";
  return "amber";
};

export const photoTypeTone = (photoType) => {
  if (photoType === "FullBody") return "green";
  if (photoType === "ID_Card") return "blue";
  if (photoType === "Headshot") return "purple";
  if (photoType === "Portrait") return "amber";
  if (photoType === "Certificate") return "red";
  if (photoType === "Wedding") return "pink";
  return "slate";
};

export const paymentMethodTone = (paymentMethod) => {
  if (paymentMethod === "Cash") return "green";
  if (paymentMethod === "Edahab") return "orange";
  if (paymentMethod === "SAAD") return "indigo";
  return "slate";
};

export const roleTone = (role) => {
  if (role === "studio_manager" || role === "studio_admin") return "indigo";
  if (role === "employee") return "slate";
  return "slate";
};
