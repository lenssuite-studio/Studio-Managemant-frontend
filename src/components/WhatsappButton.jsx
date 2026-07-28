import { FaWhatsapp } from "react-icons/fa";
import { getWhatsappReceiptLink } from "../utils/whatsapp";

const ICON_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-500 hover:shadow-sm dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400";

const LABELED_CLASS =
  "inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0";

// Renders a WhatsApp icon button (default) or a labeled button (when `label`
// is passed) linking to a customer's receipt. Purely client-side
// https://wa.me/ integration — no backend call, no paid API. Falls back to a
// disabled control when the customer has no usable phone number.
export default function WhatsappButton({ customer, className, size = 13, label }) {
  const link = getWhatsappReceiptLink(customer);
  const baseClass = className || (label ? LABELED_CLASS : ICON_CLASS);

  if (!link) {
    return (
      <span
        className={`${baseClass} cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none ${label ? "" : "hover:bg-transparent hover:text-slate-400"}`}
        title="Lambar telefoon oo sax ah lama helin"
      >
        <FaWhatsapp size={size} />
        {label && <span>{label}</span>}
      </span>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      title="U dir Rasiidka WhatsApp"
      className={baseClass}
      onClick={(e) => e.stopPropagation()}
    >
      <FaWhatsapp size={size} />
      {label && <span>{label}</span>}
    </a>
  );
}
