import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { getCustomer } from "../features/CustomerSlice";
import { useEffect } from "react";
import { useState } from "react";
import { deleteCustomer, archiveCustomer } from "../features/CustomerSlice";


export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  // Soo qaado xogta iyo loading-ka
  const { customers, loading } = useSelector((state) => state.Customer);
  const { userCustomer } = useSelector((state) => state.auth);
  const isEmployee = userCustomer?.role === "employee";

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
       (customer.PhotoType && customer.PhotoType.toLowerCase().includes(term))
      );
    }) || [];

  useEffect(() => {
    dispatch(getCustomer());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    if (status === "Pending")
      return { backgroundColor: "#e6f4ea", color: "#137333" };
    if (status === "Delivered")
      return { backgroundColor: "#e8f0fe", color: "#1a73e8" };
    if (status === "Completed")
      return { backgroundColor: "#e8f0fe", color: "#d71ae8" };
    return { backgroundColor: "#fef7e0", color: "#b06000" };
  };
  const getcustomerType = (customerType) => {
    if (customerType === "VIP")
      return { backgroundColor: "#e6f4ea", color: "#137333" };
    if (customerType === "NORMAL")
      return { backgroundColor: "#e8f0fe", color: "#1a73e8" };
    return { backgroundColor: "#fef7e0", color: "#b06000" };
  };

  const getPhotoTypeStyle = (PhotoType) => {
    if (PhotoType === "FullBody")
      return { backgroundColor: "#e6f4ea", color: "#137333" };

    if (PhotoType  === "ID_Card")
      return { backgroundColor: "#e8f0fe", color: "#1a73e8" };

    if (PhotoType  === "Headshot")
      return { backgroundColor: "#f3e8ff", color: "#7e22ce" };

    if (PhotoType === "Portrait")
      return { backgroundColor: "#fef3c7", color: "#b45309" };

    if (PhotoType === "Certificate")
      return { backgroundColor: "#fee2e2", color: "#dc2626" };

    if (PhotoType === "Wedding")
      return { backgroundColor: "#fce7f3", color: "#db2777" };

    return { backgroundColor: "#f1f5f9", color: "#475569" };
  };

  // 🌟 PHASE 3 (fraud-prevention): row-ka waa la xayiraa haddii uu leeyahay isbeddel
  // sugaya ansixin, ama haddii uu yahay Employee oo order-ku Completed yahay
  const isRowLocked = (customer) =>
    Boolean(customer.pendingChange) || (isEmployee && customer.status === "Completed");

  return (
    <>
      {/* KALIYA XOGTA DASHBOARD-KA (MAUQAALKA MIDIG) */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="form-title">Macaamiisha Rasmiga ah</h1>
          <p className="form-subtitle">
            Halkan ka maamul folder-rada, sawirrada iyo lacagaha studio-gaaga.
          </p>
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search customers by name, phone or folder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <button
          className="btn-add-customer"
          onClick={() => navigate("/AddCustomer")}
        >
          + Add Customer
        </button>
      </div>

      {/* MIISKA (TABLE) */}
      <div className="table-container">
        {!loading && filteredCustomers.length === 0 ? (
          <div
            className="loading-text"
            style={{ textAlign: "center", padding: "20px" }}
          >
            {searchTerm
              ? `Ma jiro macmiil la mida waxaad qortay: "${searchTerm}"`
              : "Wali ma jiro wax la keydeyey"}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* 2. ISBEDDELKA RASMIGA AH: Halkan waxaa la saaray filteredCustomers halkii ay ka ahayd customers */}
              {Array.isArray(filteredCustomers) &&
              filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="td-name">{customer.fullName}</td>
                    <td>{customer.Phone || "---"}</td>
                    <td>
                      <code className="folder-badge">
                        {customer.folderName}
                      </code>
                    </td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>{customer.numberOfPhotos}</td>
                    <td className="td-paid">${customer.amountPaid}</td>
                    <td
                      className="td-remaining"
                      style={{
                        color:
                          customer.remainingAmount > 0 ? "#ef4444" : "#10b981",
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
                      <span
                        className="status-pill"
                        style={getcustomerType(customer.customerType)}
                      >
                        {customer.customerType}

                      </span>
                    </td>

                    <td>
                      <span
                        className="status-pill"
                        style={getPhotoTypeStyle(customer.PhotoType)}
                      >
                        {customer.PhotoType}
                          
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-delete-customer"
                        disabled={isRowLocked(customer)}
                        onClick={() => {
                          if (window.confirm("Ma tirtiraysaa customer-kan?")) {
                            dispatch(deleteCustomer(customer._id));
                          }
                        }}
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
                            : "Tirtir Macmiilka"
                        }
                      >
                        🗑️
                      </button>
                      <button
                        disabled={isRowLocked(customer)}
                        onClick={() =>
                          navigate(`/EditCustomer/${customer._id}`)
                        }
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
                            ? "Shaqaaluhu ma bedeli karaan order-yada Completed"
                            : "Bedel Macmiilka"
                        }
                      >
                        🔄️
                      </button>
                      {/*Adchive*/}
                      <button
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
                            ? "Shaqaaluhu ma kaydin karaan order-yada Completed"
                            : "U rar Kaydka (Archive)"
                        }
                      >
                        📂
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
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
