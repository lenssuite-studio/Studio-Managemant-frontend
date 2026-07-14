// Shared form controls for customer/order forms (AddCustomer, EditCustomer,
// ...) — consistent label + input styling, focus ring, and dark mode in one
// place.

const BASE_INPUT =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400";

function FieldWrapper({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

export function TextField({ label, required, className = "", ...props }) {
  return (
    <FieldWrapper label={label} required={required}>
      <input required={required} className={`${BASE_INPUT} ${className}`} {...props} />
    </FieldWrapper>
  );
}

export function SelectField({ label, required, children, className = "", ...props }) {
  return (
    <FieldWrapper label={label} required={required}>
      <select required={required} className={`${BASE_INPUT} ${className}`} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}

export function TextAreaField({ label, required, className = "", ...props }) {
  return (
    <FieldWrapper label={label} required={required}>
      <textarea required={required} className={`${BASE_INPUT} resize-y ${className}`} {...props} />
    </FieldWrapper>
  );
}
