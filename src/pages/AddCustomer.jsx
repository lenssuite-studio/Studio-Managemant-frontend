import { useNavigate } from "react-router-dom";
import { addCustomer } from "../features/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";
import FormSection from "../components/FormSection";
import { TextField, SelectField } from "../components/FormField";

export default function AddCustomer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.Customer);

  const [FromData, SetFromData] = useState({
    fullName: "",
    Phone: "",
    folderName: "",
    status: "Pending",
    customerType: "VIP",
    PhotoType: "FullBody",
    paymentMethod: "Cash",
    amountPaid: 0,
    remainingAmount: 0,
    numberOfPhotos: 0,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    SetFromData({
      ...FromData,
      // 🌟 HADDII INPUT-KU YAHAY NUMBER, TOOS U BEDDEL NUMBER DHAB AH
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCustomer(FromData)).unwrap();
      toast.success("Customer si guul leh ba lo diwan galeyey! ➕");

      // 🚀 Marka uu guuleysto toos ugu celi Dashboard-ka si uu u arko shaxda
      navigate("/Dashboard");
    } catch (err) {
      toast.error(
        err || "Cillad ayaa dhacday inta lagu guda jiray diiwaangelinta.",
      );
    }
  };

  return (
    <div>
      <div className="mb-1 text-sm text-slate-400 dark:text-slate-500">
        Clients <span className="mx-1">›</span>
        <span className="text-slate-600 dark:text-slate-300">New Registration</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Add New Customer</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter the client details below.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* PERSONAL INFO */}
        <FormSection icon="👤" title="Personal Information">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Full Name"
              required
              type="text"
              name="fullName"
              placeholder="Enter full name"
              onChange={handleChange}
            />
            <TextField label="Phone Number" type="text" name="Phone" placeholder="+252..." onChange={handleChange} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Folder Name"
              required
              type="text"
              name="folderName"
              placeholder="Folder Name"
              onChange={handleChange}
            />
            <TextField
              label="Number Of Photos"
              type="number"
              name="numberOfPhotos"
              defaultValue={0}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* FINANCIAL */}
        <FormSection icon="💳" title="Financials">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Amount Paid"
              type="number"
              name="amountPaid"
              placeholder="$0"
              defaultValue={0}
              onChange={handleChange}
            />
            <TextField
              label="Remaining Amount"
              type="number"
              name="remainingAmount"
              placeholder="$0"
              defaultValue={0}
              onChange={handleChange}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField label="Customer Type" name="customerType" value={FromData.customerType} onChange={handleChange}>
              <option value="VIP">VIP</option>
              <option value="NORMAL">NORMAL</option>
            </SelectField>

            <SelectField label="Photo Type" name="PhotoType" value={FromData.PhotoType} onChange={handleChange}>
              <option value="FullBody">FullBody</option>
              <option value="ID_Card">ID_Card</option>
              <option value="Headshot">Headshot</option>
              <option value="Portrait">Portrait</option>
              <option value="Certificate">Certificate</option>
              <option value="Wedding">Wedding</option>
            </SelectField>

            <SelectField label="Status" name="status" value={FromData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </SelectField>

            <SelectField
              label="Payment Method"
              required
              name="paymentMethod"
              value={FromData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Edahab">Edahab</option>
              <option value="SAAD">SAAD</option>
            </SelectField>
          </div>
        </FormSection>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
          >
            {loading ? "Saving..." : "Create Customer"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/Dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
