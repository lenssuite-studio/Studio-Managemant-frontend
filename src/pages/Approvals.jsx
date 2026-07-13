import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingChanges,
  approvePendingChange,
  rejectPendingChange,
} from "../features/ApprovalsSlice";
import toast from "react-hot-toast";
import "./AddCustomer.css";
import "./Dashboard.css";

const actionLabels = { edit: "Edit", delete: "Delete", archive: "Archive" };

function DiffView({ pendingChange }) {
  if (pendingChange.actionType !== "edit") {
    return (
      <span style={{ color: "#64748b", fontSize: "13px" }}>
        {pendingChange.actionType === "delete"
          ? "Codsi ah in order-ka gabi ahaanba la tirtiro"
          : "Codsi ah in order-ka la kaydiyo (archive)"}
      </span>
    );
  }

  const fields = Object.keys(pendingChange.proposedChanges || {});

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {fields.map((field) => (
        <div key={field} style={{ fontSize: "13px" }}>
          <strong>{field}:</strong>{" "}
          <span style={{ color: "#dc2626" }}>
            {String(pendingChange.originalSnapshot?.[field] ?? "—")}
          </span>{" "}
          →{" "}
          <span style={{ color: "#16a34a" }}>
            {String(pendingChange.proposedChanges?.[field] ?? "—")}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Approvals() {
  const dispatch = useDispatch();
  const { pendingChanges, loading, error } = useSelector((state) => state.Approvals);

  useEffect(() => {
    dispatch(getPendingChanges());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleApprove = async (pendingChange) => {
    if (!window.confirm(`Ma ansixinaysaa isbeddelkan (${actionLabels[pendingChange.actionType]})?`)) return;
    try {
      await dispatch(approvePendingChange(pendingChange._id)).unwrap();
      toast.success("Isbeddelka waa la ansixiyay! ✅");
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  const handleReject = async (pendingChange) => {
    if (!window.confirm(`Ma diidaysaa isbeddelkan (${actionLabels[pendingChange.actionType]})?`)) return;
    try {
      await dispatch(rejectPendingChange(pendingChange._id)).unwrap();
      toast.success("Isbeddelka waa la diiday.");
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  return (
    <div className="lenssuite-main">
      <div className="breadcrumb">
        Studio &gt; <span>Approvals</span>
      </div>

      <h1 className="form-title">Pending Approvals</h1>
      <p className="form-subtitle">
        Isbeddelada uu shaqaaluhu (employees) codsaday ee sugaya ansixintaada.
      </p>

      <div className="table-container" style={{ marginTop: "24px" }}>
        {!loading && error ? (
          <div className="loading-text" style={{ textAlign: "center", padding: "20px", color: "#dc2626" }}>
            Wax qalad ah ayaa dhacay markii la soo qaadanayay isbeddellada sugaya: {error}
          </div>
        ) : !loading && pendingChanges.length === 0 ? (
          <div className="loading-text" style={{ textAlign: "center", padding: "20px" }}>
            Wax isbeddel sugaya lama helin. ✅
          </div>
        ) : (
          <table className="lenssuite-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Action</th>
                <th>Requested By</th>
                <th>Changes</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingChanges.map((pc) => (
                <tr key={pc._id}>
                  <td className="td-name">
                    {pc.customerId?.fullName || "—"}
                    <br />
                    <code className="folder-badge">{pc.customerId?.folderName}</code>
                  </td>
                  <td>
                    <span className="status-pill" style={{ backgroundColor: "#e8f0fe", color: "#1a73e8" }}>
                      {actionLabels[pc.actionType]}
                    </span>
                  </td>
                  <td>{pc.requestedBy?.username || "—"}</td>
                  <td>
                    <DiffView pendingChange={pc} />
                  </td>
                  <td>{new Date(pc.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleApprove(pc)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "5px 10px" }}
                      title="Ansixi"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => handleReject(pc)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "5px 10px" }}
                      title="Diid"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
