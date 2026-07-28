import { useState } from "react";
import { createPortal } from "react-dom";
import { FaPrint } from "react-icons/fa";
import CustomerReceipt from "./CustomerReceipt";

const BASE_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400";

// Prints a single customer's thermal-POS receipt. Mounts CustomerReceipt into
// a portal at document.body (kept off-screen by .receipt-print-area in
// theme.css until window.print() runs), so it works from any table row
// without each page needing its own print-area plumbing.
export default function ReceiptPrintButton({ customer, className, size = 13 }) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    // Wait a paint so the portal is actually in the DOM before the browser
    // captures the page for printing.
    requestAnimationFrame(() => {
      const stopPrinting = () => {
        setPrinting(false);
        window.removeEventListener("afterprint", stopPrinting);
      };
      window.addEventListener("afterprint", stopPrinting);
      window.print();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePrint}
        title="Daabac Rasiidka (Print Receipt)"
        className={className || BASE_CLASS}
      >
        <FaPrint size={size} />
      </button>
      {printing &&
        createPortal(
          <div className="receipt-print-area">
            <CustomerReceipt customer={customer} />
          </div>,
          document.body,
        )}
    </>
  );
}
