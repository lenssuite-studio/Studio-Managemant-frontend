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
import { FaSyncAlt, FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import FormSection from "../components/FormSection";
import { TextField } from "../components/FormField";
import Pill from "../components/Pill";

const emptyForm = { username: "", email: "", password: "" };

const ACTION_BTN =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm";

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
    <div>
      <div className="mb-1 text-sm text-slate-400 dark:text-slate-500">
        Studio <span className="mx-1">›</span>
        <span className="text-slate-600 dark:text-slate-300">Team &amp; Employees</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Team &amp; Employees</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Ku dar oo maamul shaqaalaha (employees) ee studio-gaaga. Shaqaaluhu waxay maamuli karaan macaamiisha,
        laakiin ma arki karaan Reports ama maamulka shaqaalaha.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <FormSection icon="👤" title={editingId ? "Edit Employee" : "Add Employee"}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Full Name"
              required
              type="text"
              name="username"
              placeholder="Enter employee's full name"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              required
              type="email"
              name="email"
              placeholder="employee@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {!editingId && (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                label="Temporary Password"
                required
                type="password"
                name="password"
                placeholder="Set a starting password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          )}
        </FormSection>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
          >
            {loading ? "Saving..." : editingId ? "Save Changes" : "Add Employee"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex-none sm:px-8"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {!loading && employees.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Wali ma jiro shaqaale la daray.
          </div>
        ) : (
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["Full Name", "Email", "Status", "Joined", "Actions"].map((label) => (
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
              {employees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{emp.username}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{emp.email}</td>
                  <td className="px-5 py-4">
                    <Pill tone={emp.isActive ? "green" : "amber"}>{emp.isActive ? "Active" : "Inactive"}</Pill>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(emp)}
                        title="Edit Employee"
                        className={`${ACTION_BTN} hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10`}
                      >
                        <FaSyncAlt size={13} />
                      </button>
                      <button
                        onClick={() => handleToggle(emp)}
                        title={emp.isActive ? "Disable Employee" : "Enable Employee"}
                        className={`${ACTION_BTN} hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10`}
                      >
                        {emp.isActive ? <FaLock size={13} /> : <FaLockOpen size={13} />}
                      </button>
                      <button
                        onClick={() => handleDelete(emp)}
                        title="Delete Employee"
                        className={`${ACTION_BTN} hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10`}
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
  );
}
