import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomer } from "../features/CustomerSlice";
import { useEffect } from "react";
import { useState } from "react";
import { deleteCustomer, archiveCustomer } from "../features/CustomerSlice";
import { FaSearch, FaTrash, FaSyncAlt, FaArchive } from "react-icons/fa";

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

function Pill({ tone = "slate", title, children }) {
  return (
    <span className={`${PILL_BASE} ${PILL_COLORS[tone]}`} title={title}>
      {children}
    </span>
  );
}

const statusTone = (status) => {
  if (status === "Pending") return "amber";
  if (status === "Delivered") return "blue";
  if (status === "Completed") return "fuchsia";
  return "slate";
};

const customerTypeTone = (customerType) => {
  if (customerType === "VIP") return "green";
  if (customerType === "NORMAL") return "blue";
  return "amber";
};

const photoTypeTone = (photoType) => {
  if (photoType === "FullBody") return "green";
  if (photoType === "ID_Card") return "blue";
  if (photoType === "Headshot") return "purple";
  if (photoType === "Portrait") return "amber";
  if (photoType === "Certificate") return "red";
  if (photoType === "Wedding") return "pink";
  return "slate";
};

const paymentMethodTone = (paymentMethod) => {
  if (paymentMethod === "Cash") return "green";
  if (paymentMethod === "Edahab") return "orange";
  if (paymentMethod === "SAAD") return "indigo";
  return "slate";
};

const ACTION_BTN =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 enabled:hover:-translate-y-0.5 enabled:hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  // Soo qaado xogta iyo loading-ka
  const { customers, loading } = useSelector((state) => state.Customer);
  const { userCustomer } = useSelector((state) => state.auth);
  const isEmployee = userCustomer?.role === "employee";
  console.log(customers);

  // 1. HALKAN WAXAAN KU DARNAY ?. IYO || [] SI AY SAN XOGTU U CRASH GAROOBIN
  const filteredCustomers =
    customers?.filter((customer) => {
      if (customer.isArchived) return false;
      const term = searchTerm.toLowerCase();
      return (
        customer.fullName.toLowerCase().includes(term) ||
        (customer.Phone && customer.Phone.toLowerCase().includes(term)) ||
        customer.folderName.toLowerCase().includes(term) ||
        customer.status.toLowerCase().includes(term) ||
        customer.customerType.toLowerCase().includes(term) ||
        (customer.PhotoType &&
          customer.PhotoType.toLowerCase().includes(term)) ||
        customer.paymentMethod?.toLowerCase().includes(term)
      );
    }) || [];

  useEffect(() => {
    dispatch(getCustomer());
  }, [dispatch]);

  // 🌟 PHASE 3 (fraud-prevention): row-ka waa la xayiraa haddii uu leeyahay isbeddel
  // sugaya ansixin, ama haddii uu yahay Employee oo order-ku Completed yahay
  const isRowLocked = (customer) =>
    Boolean(customer.pendingChange) ||
    (isEmployee && customer.status === "Completed");

  return (
    <>
      {/* KALIYA XOGTA DASHBOARD-KA (MAUQAALKA MIDIG) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Macaamiisha Rasmiga ah
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Halkan ka maamul folder-rada, sawirrada iyo lacagaha studio-gaaga.
          </p>
          <div className="relative mt-4 max-w-md">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by name, phone or folder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/AddCustomer")}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0"
        >
          + Add Customer
        </button>
      </div>

      {/* MIISKA (TABLE) */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {!loading && filteredCustomers.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            {searchTerm
              ? `Ma jiro macmiil la mida waxaad qortay: "${searchTerm}"`
              : "Wali ma jiro wax la keydeyey"}
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
              {/* 2. ISBEDDELKA RASMIGA AH: Halkan waxaa la saaray filteredCustomers halkii ay ka ahayd customers */}
              {Array.isArray(filteredCustomers) &&
              filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
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
                        customer.remainingAmount > 0
                          ? "text-red-500"
                          : "text-emerald-500"
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
                      <Pill tone={customerTypeTone(customer.customerType)}>
                        {customer.customerType}
                      </Pill>
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
                      <div className="flex items-center gap-1">
                        <button
                          className={`${ACTION_BTN} enabled:hover:bg-red-50 enabled:hover:text-red-500 dark:enabled:hover:bg-red-500/10`}
                          disabled={isRowLocked(customer)}
                          onClick={() => {
                            if (window.confirm("Ma tirtiraysaa customer-kan?")) {
                              dispatch(deleteCustomer(customer._id));
                            }
                          }}
                          title={
                            customer.pendingChange
                              ? "Isbeddel ayaa sugaya ansixin"
                              : isEmployee && customer.status === "Completed"
                                ? "Shaqaaluhu ma tirtiri karaan order-yada Completed"
                                : "Tirtir Macmiilka"
                          }
                        >
                          <FaTrash size={13} />
                        </button>
                        <button
                          className={`${ACTION_BTN} enabled:hover:bg-indigo-50 enabled:hover:text-indigo-600 dark:enabled:hover:bg-indigo-500/10`}
                          disabled={isRowLocked(customer)}
                          onClick={() => navigate(`/EditCustomer/${customer._id}`)}
                          title={
                            customer.pendingChange
                              ? "Isbeddel ayaa sugaya ansixin"
                              : isEmployee && customer.status === "Completed"
                                ? "Shaqaaluhu ma bedeli karaan order-yada Completed"
                                : "Bedel Macmiilka"
                          }
                        >
                          <FaSyncAlt size={13} />
                        </button>
                        <button
                          className={`${ACTION_BTN} enabled:hover:bg-amber-50 enabled:hover:text-amber-600 dark:enabled:hover:bg-amber-500/10`}
                          disabled={isRowLocked(customer)}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Ma rabtaa inaad Archive (Kaydka) u rarto macmiilkan: ${customer.fullName}?`,
                              )
                            ) {
                              dispatch(archiveCustomer(customer._id));
                            }
                          }}
                          title={
                            customer.pendingChange
                              ? "Isbeddel ayaa sugaya ansixin"
                              : isEmployee && customer.status === "Completed"
                                ? "Shaqaaluhu ma kaydin karaan order-yada Completed"
                                : "U rar Kaydka (Archive)"
                          }
                        >
                          <FaArchive size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                    Wax macaamiil ah lama helin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
