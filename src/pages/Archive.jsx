import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Waxaad dib u isticmaali kartaa CSS-kii Dashboard-ka maadaama ay isku design yihiin
import { useDispatch, useSelector } from "react-redux";
import { getCustomer, deleteCustomer } from "../features/CustomerSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
        customer.status.toLowerCase().includes(term)  ||
        customer.customerType.toLowerCase().includes(term)  
      );
    }) || [];

  useEffect(() => {
    dispatch(getCustomer());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    if (status === "Pending") return { backgroundColor: "#e6f4ea", color: "#137333" };
    if (status === "Delivered") return { backgroundColor: "#e8f0fe", color: "#1a73e8" };
    if (status === "Completed") return { backgroundColor: "#e8f0fe", color: "#d71ae8" };
    return { backgroundColor: "#fef7e0", color: "#b06000" };
  };

  const getPaymentMethodStyle = (paymentMethod) => {
    if (paymentMethod === "Cash") return { backgroundColor: "#e6f4ea", color: "#137333" };
    if (paymentMethod === "Edahab") return { backgroundColor: "#ffedd5", color: "#c2410c" };
    if (paymentMethod === "SAAD") return { backgroundColor: "#e0e7ff", color: "#4338ca" };
    return { backgroundColor: "#f1f5f9", color: "#475569" };
  };

  return (
    <>
      {/* HEADER-KA BOGGA ARCHIVE */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="form-title">📂 Kaydka Macaamiisha (Archive)</h1>
          <p className="form-subtitle">
            Halkan waxaad ku guda jirtaa khaanadda kaydka ee macaamiishii hore ee shaqadoodu dhammaatay.
          </p>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Ka raadi kaydka magac, telefoon ama folder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Badhan dib kuugu celinaya Dashboard-ka weyn */}
        <button
          className="btn-add-customer"
          onClick={() => navigate("/Dashboard")}
          style={{ backgroundColor: "#1a73e8" }}
        >
          ⬅️ Dib u Noqo
        </button>
      </div>

      {/* MIISKA XOGTA ARCHIVE-KA */}
      <div className="table-container">
        {!loading && archivedCustomers.length === 0 ? (
          <div
            className="loading-text"
            style={{ textAlign: "center", padding: "20px" }}
          >
            {searchTerm
              ? `Ma jiro macmiil kaydsan oo la mida: "${searchTerm}"`
              : "Khaanadda kaydku hadda waa maran tahay."}
          </div>
        ) : (
          <table className="lenssuite-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Folder Name</th>
                <th>Time</th>
                <th>Photos</th>
                <th>Amount Paid</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>customerType</th>
                <th>PhotoType</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(archivedCustomers) &&
              archivedCustomers.length > 0 ? (
                archivedCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="td-name">{customer.fullName}</td>
                    <td>{customer.Phone || "---"}</td>
                    <td>
                      <code className="folder-badge">{customer.folderName}</code>
                    </td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>

                    <td>{customer.numberOfPhotos}</td>
                    <td className="td-paid">${customer.amountPaid}</td>
                    <td
                      className="td-remaining"
                      style={{
                        color: customer.remainingAmount > 0 ? "#ef4444" : "#10b981",
                      }}
                    >
                      ${customer.remainingAmount}
                    </td>
                    <td>
                      <span
                        className="status-pill"
                        style={getStatusStyle(customer.status)}
                      >
                        {customer.status}
                      </span>
                      {customer.pendingChange && (
                        <span
                          className="status-pill"
                          style={{ backgroundColor: "#fef3c7", color: "#b45309", marginLeft: "6px" }}
                          title="Isbeddel ayaa sugaya ansixinta maamulaha"
                        >
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="status-pill" style={{ backgroundColor: "#e8f0fe", color: "#1a73e8" }}>
                        {customer.customerType}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill" style={{ backgroundColor: "#e8f0fe", color: "#1a73e8" }}>
                        {customer.PhotoType}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill" style={getPaymentMethodStyle(customer.paymentMethod)}>
                        {customer.paymentMethod || "Not Recorded"}
                      </span>
                    </td>
                    <td>
                      {/* TIRTIR KALIYA AYAA REEBAN MAADAAMA UU KAYD YAHAY */}
                      <button
                        className="btn-delete-customer"
                        disabled={isRowLocked(customer)}
                        onClick={() => handleDelete(customer)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: isRowLocked(customer) ? "not-allowed" : "pointer",
                          opacity: isRowLocked(customer) ? 0.4 : 1,
                          fontSize: "16px",
                          padding: "5px 10px",
                        }}
                        title={
                          customer.pendingChange
                            ? "Isbeddel ayaa sugaya ansixin"
                            : isEmployee && customer.status === "Completed"
                            ? "Shaqaaluhu ma tirtiri karaan order-yada Completed"
                            : "Gabi ahaanba Tirtir"
                        }
                      >
                        🗑️
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