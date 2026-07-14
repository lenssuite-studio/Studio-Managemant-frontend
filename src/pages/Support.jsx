import { FaWhatsapp, FaLifeRing } from "react-icons/fa";

export default function Support() {
  return (
    <div>
      <div className="mb-1 text-sm text-slate-400 dark:text-slate-500">
        Account <span className="mx-1">›</span>
        <span className="text-slate-600 dark:text-slate-300">Support</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Support &amp; Help</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Halkan waxaad ka heli kartaa caawinaad iyo taageero degdeg ah.
      </p>

      <div className="mt-6 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaLifeRing />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Haddii ay cilad dhacdo</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Waxaan kuu joognaa 24/7</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <strong className="font-semibold text-slate-800 dark:text-slate-100">Haddii ay cilad dhacdo:</strong>{" "}
          Dib u cusbooneysii bogga (Refresh). Haddii ay dhibaatadu sii jirto, si toos ah ula xiriir engineer-ka.
        </p>

        <a
          href="https://wa.me/252636045303"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <FaWhatsapp size={16} /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
