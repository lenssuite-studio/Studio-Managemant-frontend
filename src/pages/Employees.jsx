import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees, createEmployee } from "../features/EmployeeSlice";
import toast from "react-hot-toast";
import "./AddCustomer.css";
import "./Dashboard.css";

export default function Employees() {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.Employee);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createEmployee(formData)).unwrap();
      toast.success("Shaqaale cusub ayaa si guul leh loo daray! ➕");
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      toast.error(err || "Cillad ayaa dhacday inta shaqaalaha la darayay.");
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
            <span>👤</span> Add Employee
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
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : "Add Employee"}
          </button>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
