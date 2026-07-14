// Shared titled card wrapper for grouped form fields (AddCustomer's
// "Personal Information" / "Financials" sections, etc.)
export default function FormSection({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}
