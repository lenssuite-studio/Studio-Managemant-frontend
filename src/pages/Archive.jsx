import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomer, deleteCustomer } from "../features/CustomerSlice";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaTrash,
  FaArrowLeft,
  FaFolderOpen,
  FaImages,
  FaDollarSign,
} from "react-icons/fa";
import Pill, {
  statusTone,
  customerTypeTone,
  photoTypeTone,
  paymentMethodTone,
} from "../components/Pill";
import WhatsappButton from "../components/WhatsappButton";

const ACTION_BTN =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40";

export default function Archive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { customers, loading } = useSelector((state) => state.Customer);
  const { userCustomer } = useSelector((state) => state.auth);
  const isEmployee = userCustomer?.role === "employee";

  const isRowLocked = (customer) =>
    Boolean(customer.pendingChange) ||
    (isEmployee && customer.status === "Completed");

  const handleDelete = async (customer) => {
    if (!window.confirm("Ma tirtiraysaa macmiilkan kaydsan gabi ahaanba?"))
      return;
    try {
      const result = await dispatch(deleteCustomer(customer._id)).unwrap();
      if (result?.pending) {
        toast.success(
          result.message ||
            "Codsiga tirtiridda waxaa loo diray maamulaha si loo ansixiyo.",
        );
      } else {
        toast.success("Macmiilka waa la tirtiray! 🗑️");
      }
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  // Filter-ka Archive-ka
  const archivedCustomers = useMemo(() => {
    return (
      customers?.filter((customer) => {
        if (!customer.isArchived) return false;

        const term = searchTerm.toLowerCase();
        return (
          customer.fullName.toLowerCase().includes(term) ||
          (customer.Phone && customer.Phone.toLowerCase().includes(term)) ||
          customer.folderName.toLowerCase().includes(term) ||
          customer.status.toLowerCase().includes(term) ||
          customer.customerType.toLowerCase().includes(term)
        );
      }) || []
    );
  }, [customers, searchTerm]);

  // Tirokoobka Summary Metrics ee Kaydka
  const stats = useMemo(() => {
    const totalOrders = archivedCustomers.length;
    const totalPhotos = archivedCustomers.reduce(
      (sum, c) => sum + (c.numberOfPhotos || 0),
      0,
    );
    const totalPaid = archivedCustomers.reduce(
      (sum, c) => sum + (c.amountPaid || 0),
      0,
    );
    return { totalOrders, totalPhotos, totalPaid };
  }, [archivedCustomers]);

  useEffect(() => {
    dispatch(getCustomer());
  }, [dispatch]);

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/20">
              <FaFolderOpen size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Kaydka Macaamiisha (Archive)
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Maamul oo kormeer dalabyadii hore ee loo kaydiyay studio-ga
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/Dashboard")}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <FaArrowLeft size={12} /> Dashboard-ka Dib u Noqo
        </button>
      </div>

      {/* STAT CARDS SECTION (Muuqaalka Dashboard-ka) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaFolderOpen size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Wadarta Kaydka
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.totalOrders} Order
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FaImages size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Wadarta Sawirada
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.totalPhotos} Sawir
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <FaDollarSign size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dakhliga Ku Jira
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              ${stats.totalPaid}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Ka raadi kaydka magac, telefoon, folder..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200/80 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-500/20"
        />
      </div>

      {/* DATA TABLE SECTION */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          {!loading && archivedCustomers.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              {searchTerm
                ? `Ma jiro macmiil kaydsan oo la mida: "${searchTerm}"`
                : "Khaanadda kaydku hadda waa maran tahay."}
            </div>
          ) : (
            <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
                  {[
                    "Full Name",
                    "Phone Number",
                    "Folder Name",
                    "Date",
                    "Photos Breakdown",
                    "VIP Tier",
                    "EXP Info",
                    "Amount Paid",
                    "Payment Breakdown",
                    "Remaining",
                    "Status",
                    "Photo Type",
                    "Actions",
                  ].map((label) => (
                    <th
                      key={label}
                      className="whitespace-nowrap px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {archivedCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                  >
                    {/* Full Name */}
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {customer.fullName}
                    </td>

                    {/* Phone Number */}
                    <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">
                      {customer.Phone || "---"}
                    </td>

                    {/* Folder Name */}
                    <td className="px-5 py-4">
                      <code className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {customer.folderName}
                      </code>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>

                    {/* Photos Breakdown */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Total: {customer.numberOfPhotos || 0}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400">
                        N: {customer.normalPhotosCount || 0} | VIP:{" "}
                        {customer.vipPhotosCount || 0}
                      </div>
                    </td>

                    {/* VIP Tier */}
                    <td className="px-5 py-4">
                      <Pill tone={customerTypeTone(customer.customerType)}>
                        {customer.vipTierLevel || customer.customerType}
                      </Pill>
                    </td>

                    {/* EXP Info */}
                    <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {customer.expPhotosCount > 0 ? (
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {customer.expPhotosCount} pcs (+${customer.expExtraCharge || 0})
                        </span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>

                    {/* Amount Paid */}
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                      ${customer.amountPaid}
                    </td>

                    {/* Payment Breakdown */}
                    <td className="px-5 py-4 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex flex-col gap-0.5">
                        {customer.cashAmount > 0 && (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            💵 Cash: ${customer.cashAmount}
                          </span>
                        )}
                        {customer.zaadAmount > 0 && (
                          <span className="text-blue-600 dark:text-blue-400">
                            📱 Zaad: ${customer.zaadAmount}
                          </span>
                        )}
                        {customer.edahabAmount > 0 && (
                          <span className="text-amber-600 dark:text-amber-400">
                            💳 eDahab: ${customer.edahabAmount}
                          </span>
                        )}
                        {!customer.cashAmount &&
                          !customer.zaadAmount &&
                          !customer.edahabAmount && (
                            <Pill tone={paymentMethodTone(customer.paymentMethod)}>
                              {customer.paymentMethod || "Not Recorded"}
                            </Pill>
                          )}
                      </div>
                    </td>

                    {/* Remaining Amount */}
                    <td
                      className={`px-5 py-4 font-bold ${
                        customer.remainingAmount > 0
                          ? "text-red-500"
                          : "text-emerald-500"
                      }`}
                    >
                      ${customer.remainingAmount}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Pill tone={statusTone(customer.status)}>
                          {customer.status}
                        </Pill>
                        {customer.pendingChange && (
                          <Pill
                            tone="amber"
                            title="Isbeddel ayaa sugaya ansixinta maamulaha"
                          >
                            ⏳ Pending
                          </Pill>
                        )}
                      </div>
                    </td>

                    {/* Photo Type */}
                    <td className="px-5 py-4">
                      <Pill tone={photoTypeTone(customer.PhotoType)}>
                        {customer.PhotoType}
                      </Pill>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <WhatsappButton customer={customer} />
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}