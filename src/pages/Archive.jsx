import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomer, deleteCustomer } from "../features/CustomerSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaTrash, FaArrowLeft } from "react-icons/fa";
import Pill, { statusTone, customerTypeTone, photoTypeTone, paymentMethodTone } from "../components/Pill";

const ACTION_BTN =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40";

export default function Archive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Soo qaado xogta iyo loading-ka
  const { customers, loading } = useSelector((state) => state.Customer);
  const { userCustomer } = useSelector((state) => state.auth);
  const isEmployee = userCustomer?.role === "employee";

  // 🌟 PHASE 3 (fraud-prevention): isku mid la Dashboard-ka
  const isRowLocked = (customer) =>
    Boolean(customer.pendingChange) || (isEmployee && customer.status === "Completed");

  const handleDelete = async (customer) => {
    if (!window.confirm("Ma tirtiraysaa macmiilkan kaydsan gabi ahaanba?")) return;
    try {
      const result = await dispatch(deleteCustomer(customer._id)).unwrap();
      if (result?.pending) {
        toast.success(result.message || "Codsiga tirtiridda waxaa loo diray maamulaha si loo ansixiyo.");
      } else {
        toast.success("Macmiilka waa la tirtiray! 🗑️");
      }
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  // 🌟 FILTER-KA ARCHIVE-KA: KALIYA SOO REEB KUWA LA ARCHIVE-GAREEYEY (isArchived === true)
  const archivedCustomers =
    customers?.filter((customer) => {
      // Haddii macmiilka aan la archive-gareyn, halkan ha tusin
      if (!customer.isArchived) return false;

      const term = searchTerm.toLowerCase();
      return (
        customer.fullName.toLowerCase().includes(term) ||
        (customer.Phone && customer.Phone.toLowerCase().includes(term)) ||
        customer.folderName.toLowerCase().includes(term) ||
        customer.status.toLowerCase().includes(term) ||
        customer.customerType.toLowerCase().includes(term)
      );
    }) || [];

  useEffect(() => {
    dispatch(getCustomer());
  }, [dispatch]);

  return (
    <>
      {/* HEADER-KA BOGGA ARCHIVE */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            📂 Kaydka Macaamiisha (Archive)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Halkan waxaad ku guda jirtaa khaanadda kaydka ee macaamiishii hore ee shaqadoodu dhammaatay.
          </p>
          <div className="relative mt-4 max-w-md">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ka raadi kaydka magac, telefoon ama folder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Badhan dib kuugu celinaya Dashboard-ka weyn */}
        <button
          onClick={() => navigate("/Dashboard")}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:translate-y-0"
        >
          <FaArrowLeft size={12} /> Dib u Noqo
        </button>
      </div>

      {/* MIISKA XOGTA ARCHIVE-KA */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {!loading && archivedCustomers.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            {searchTerm
              ? `Ma jiro macmiil kaydsan oo la mida: "${searchTerm}"`
              : "Khaanadda kaydku hadda waa maran tahay."}
          </div>
        ) : (
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {[
                  "Full Name",
                  "Phone Number",
                  "Folder Name",
                  "Time",
                  "Photos",
                  "Amount Paid",
                  "Remaining",
                  "Status",
                  "customerType",
                  "PhotoType",
                  "Payment Method",
                  "Actions",
                ].map((label) => (
                  <th
                    key={label}
                    className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(archivedCustomers) &&
              archivedCustomers.length > 0 ? (
                archivedCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {customer.fullName}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {customer.Phone || "---"}
                    </td>
                    <td className="px-5 py-4">
                      <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {customer.folderName}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {customer.numberOfPhotos}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                      ${customer.amountPaid}
                    </td>
                    <td
                      className={`px-5 py-4 font-semibold ${
                        customer.remainingAmount > 0 ? "text-red-500" : "text-emerald-500"
                      }`}
                    >
                      ${customer.remainingAmount}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Pill tone={statusTone(customer.status)}>{customer.status}</Pill>
                        {customer.pendingChange && (
                          <Pill tone="amber" title="Isbeddel ayaa sugaya ansixinta maamulaha">
                            ⏳ Pending
                          </Pill>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Pill tone={customerTypeTone(customer.customerType)}>{customer.customerType}</Pill>
                    </td>
                    <td className="px-5 py-4">
                      <Pill tone={photoTypeTone(customer.PhotoType)}>{customer.PhotoType}</Pill>
                    </td>
                    <td className="px-5 py-4">
                      <Pill tone={paymentMethodTone(customer.paymentMethod)}>
                        {customer.paymentMethod || "Not Recorded"}
                      </Pill>
                    </td>
                    <td className="px-5 py-4">
                      {/* TIRTIR KALIYA AYAA REEBAN MAADAAMA UU KAYD YAHAY */}
                      <button
                        className={`${ACTION_BTN} enabled:hover:bg-red-50 enabled:hover:text-red-500 dark:enabled:hover:bg-red-500/10`}
                        disabled={isRowLocked(customer)}
                        onClick={() => handleDelete(customer)}
                        title={
                          customer.pendingChange
                            ? "Isbeddel ayaa sugaya ansixin"
                            : isEmployee && customer.status === "Completed"
                              ? "Shaqaaluhu ma tirtiri karaan order-yada Completed"
                              : "Gabi ahaanba Tirtir"
                        }
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
