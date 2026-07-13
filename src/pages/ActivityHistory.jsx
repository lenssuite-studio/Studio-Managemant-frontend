import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityHistory } from "../features/ActivityHistorySlice";
import "./AddCustomer.css";
import "./Dashboard.css";

const actionLabels = { create: "Create", edit: "Edit", delete: "Delete", archive: "Archive" };
const outcomeStyles = {
  applied: { backgroundColor: "#e6f4ea", color: "#137333" },
  requested: { backgroundColor: "#fef3c7", color: "#b45309" },
  approved: { backgroundColor: "#e6f4ea", color: "#137333" },
  rejected: { backgroundColor: "#fee2e2", color: "#dc2626" },
};

function formatSnapshot(snapshot) {
  if (!snapshot) return "—";
  const entries = Object.entries(snapshot);
  if (entries.length === 0) return "—";
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(", ");
}

export default function ActivityHistory() {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.ActivityHistory);

  useEffect(() => {
    dispatch(getActivityHistory());
  }, [dispatch]);

  return (
    <div className="lenssuite-main">
      <div className="breadcrumb">
        Studio &gt; <span>Activity History</span>
      </div>

      <h1 className="form-title">Activity History</h1>
      <p className="form-subtitle">
        Diiwaanka joogtada ah ee dhammaan isbeddelada order-yada studio-gaaga — cid, waqti, iyo qiyamka hore/dib.
      </p>

      <div className="table-container" style={{ marginTop: "24px" }}>
        {!loading && entries.length === 0 ? (
          <div className="loading-text" style={{ textAlign: "center", padding: "20px" }}>
            Weli wax activity ah lama helin.
          </div>
        ) : (
          <table className="lenssuite-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Action</th>
                <th>Outcome</th>
                <th>User</th>
                <th>Before</th>
                <th>After</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td className="td-name">
                    {entry.customerId?.fullName || "(deleted)"}
                  </td>
                  <td>
                    <span className="status-pill" style={{ backgroundColor: "#e8f0fe", color: "#1a73e8" }}>
                      {actionLabels[entry.action]}
                    </span>
                  </td>
                  <td>
                    <span className="status-pill" style={outcomeStyles[entry.outcome]}>
                      {entry.outcome}
                    </span>
                  </td>
                  <td>{entry.userId?.username || "—"}</td>
                  <td style={{ fontSize: "12px", maxWidth: "220px" }}>{formatSnapshot(entry.before)}</td>
                  <td style={{ fontSize: "12px", maxWidth: "220px" }}>{formatSnapshot(entry.after)}</td>
                  <td>{new Date(entry.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
