import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployees,
  createEmployee,
  editEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
} from "../features/EmployeeSlice";
import toast from "react-hot-toast";
import "./AddCustomer.css";
import "./Dashboard.css";

const emptyForm = { username: "", email: "", password: "" };

export default function Employees() {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.Employee);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // 🌟 Haddii uu jiro, foomka wuxuu ku jiraa Edit mode

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const startEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({ username: employee.username, email: employee.email, password: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(
          editEmployee({
            id: editingId,
            employeeData: { username: formData.username, email: formData.email },
          }),
        ).unwrap();
        toast.success("Shaqaalaha si guul leh ayaa wax looga beddelay! ✏️");
        cancelEdit();
      } else {
        await dispatch(createEmployee(formData)).unwrap();
        toast.success("Shaqaale cusub ayaa si guul leh loo daray! ➕");
        setFormData(emptyForm);
      }
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  const handleToggle = async (employee) => {
    const verb = employee.isActive ? "disable" : "enable";
    if (!window.confirm(`Ma hubtaa inaad ${verb} garayso ${employee.username}?`)) return;
    try {
      await dispatch(toggleEmployeeStatus(employee._id)).unwrap();
      toast.success("Xaaladda shaqaalaha waa la beddelay! ⚙️");
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Ma tirtiraysaa shaqaalaha ${employee.username} gabi ahaanba?`)) return;
    try {
      await dispatch(deleteEmployee(employee._id)).unwrap();
      toast.success("Shaqaalaha waa la tirtiray! 🗑️");
      if (editingId === employee._id) cancelEdit();
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday.");
    }
  };

  return (
    <div className="lenssuite-main">
      <div className="breadcrumb">
        Studio &gt; <span>Team &amp; Employees</span>
      </div>

      <h1 className="form-title">Team &amp; Employees</h1>
      <p className="form-subtitle">
        Ku dar oo maamul shaqaalaha (employees) ee studio-gaaga. Shaqaaluhu
        waxay maamuli karaan macaamiisha, laakiin ma arki karaan Reports ama
        maamulka shaqaalaha.
      </p>

      <form className="customer-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <h3 className="card-heading">
            <span>👤</span> {editingId ? "Edit Employee" : "Add Employee"}
          </h3>

          <div className="form-grid">
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="username"
                placeholder="Enter employee's full name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="employee@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!editingId && (
            <div className="input-group" style={{ marginTop: "20px" }}>
              <label>Temporary Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Set a starting password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : editingId ? "Save Changes" : "Add Employee"}
          </button>
          {editingId && (
            <button type="button" className="btn-cancel" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-container" style={{ marginTop: "32px" }}>
        {!loading && employees.length === 0 ? (
          <div
            className="loading-text"
            style={{ textAlign: "center", padding: "20px" }}
          >
            Wali ma jiro shaqaale la daray.
          </div>
        ) : (
          <table className="lenssuite-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td className="td-name">{emp.username}</td>
                  <td>{emp.email}</td>
                  <td>
                    <span
                      className="status-pill"
                      style={{
                        backgroundColor: emp.isActive ? "#e6f4ea" : "#fef7e0",
                        color: emp.isActive ? "#137333" : "#b06000",
                      }}
                    >
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => startEdit(emp)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "5px 10px" }}
                      title="Edit Employee"
                    >
                      🔄️
                    </button>
                    <button
                      onClick={() => handleToggle(emp)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "5px 10px" }}
                      title={emp.isActive ? "Disable Employee" : "Enable Employee"}
                    >
                      {emp.isActive ? "🔒" : "🔓"}
                    </button>
                    <button
                      className="btn-delete-customer"
                      onClick={() => handleDelete(emp)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "5px 10px" }}
                      title="Delete Employee"
                    >
                      🗑️
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
