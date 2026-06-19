import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudios,
  toggleStudioStatus,
  deleteStudio,
} from "../../features/AdminSlice";
import "../../pages/Admin/AdminLayout.css";
import toast from "react-hot-toast";

export default function ManageStudios() {
  const dispatch = useDispatch();
  const { studios, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllStudios());
  }, [dispatch]);

  // 🔒 TOGGLE STATUS (Hadda waa async/await iyo try-catch)
  const handleToggle = async (id) => {
    if (
      window.confirm(
        "Ma hubtaa inaad rabto inaad bedesho status-ka Studio-gan?",
      )
    ) {
      try {
        await dispatch(toggleStudioStatus(id)).unwrap();
        toast.success("Status-ka studio-ga si guul leh ayaa loo beddelay! ⚙️");
      } catch (err) {
        toast.error(err || "Cillad ayaa dhacday inta status-ka la beddelayay.");
      }
    }
  };

  // 🗑️ DELETE STUDIO (Hadda waa async/await iyo try-catch)
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "DIGNIIN: Ma hubtaa inaad gabi ahaanba tirtirto Studio-gan?",
      )
    ) {
      try {
        await dispatch(deleteStudio(id)).unwrap();
        toast.success("Studio-ga gabi ahaanba waa nidaamka laga saaray! 🗑️");
      } catch (err) {
        toast.error(err || "Waa la waayay tirtirista studio-ga.");
      }
    }
  };

  if (loading) {
    return (
      <div className="table-empty-state">
        Waa la soo kicinayaa maamulka xarumaha...
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">
          👑 Superadmin Studio Management
        </h1>
        <p className="admin-dashboard-subtitle">
          Xannib, fasax ama gabi ahaanba nidaamka kaga tirtir photography
          studios-ka ka diiwaangashan LensSuite.
        </p>
      </div>

      <div className="admin-table-section">
        <div className="table-header-container">
          <h2 className="table-title">Operational Ecosystem</h2>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-studios-table">
            <thead>
              <tr>
                <th>Studio Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Actions</th>
                <th>lasteTime</th>
              </tr>
            </thead>
            <tbody>
              {studios.length > 0 ? (
                studios.map((studio) => (
                  <tr key={studio._id}>
                    <td className="studio-name-cell">{studio.username}</td>

                    <td className="studio-email-cell">{studio.email}</td>
                    <td>
                      <span
                        className={`status-badge ${studio.isActive ? "status-active" : "status-inactive"}`}
                      >
                        {studio.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          onClick={() => handleToggle(studio._id)}
                          className={`btn-action ${studio.isActive ? "btn-disable" : "btn-enable"}`}
                        >
                          {studio.isActive ? "🔒 Disable" : "🔓 Enable"}
                        </button>
                        <button
                          onClick={() => handleDelete(studio._id)}
                          className="btn-action btn-delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                    <td
                      className="studio-name-cell"
                      style={{ fontSize: "13px", color: "#555" }}
                    >
                      {studio.lastLogin ? (
                        new Date(studio.lastLogin).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      ) : (
                        <span style={{ color: "#aaa", italic: "true" }}>
                          Never logged in
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="table-empty-state">
                    Wax studio ah oo diiwaangashan wali lama helin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
