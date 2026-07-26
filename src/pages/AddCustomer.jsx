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
    PhotoType: "FullBody",
    vipTierLevel: "VIP_1",
    amountPaid: 0,
    remainingAmount: 0,
    numberOfPhotos: 0,
    normalPhotosCount: 0,
    vipPhotosCount: 0,
    expPhotosCount: 0,
    expExtraCharge: 0,
    cashAmount: 0,
    zaadAmount: 0,
    edahabAmount: 0,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    SetFromData((prevData) => ({
      ...prevData,
      // 🌟 HADDII INPUT-KU YAHAY NUMBER, TOOS U BEDDEL NUMBER DHAB AH
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCustomer(FromData)).unwrap();
      toast.success("Customer si guul leh ayaa loo diiwaangeliyay! ➕");

      // 🚀 Marka uu guuleysto toos ugu celi Dashboard-ka
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
        <span className="text-slate-600 dark:text-slate-300">
          New Registration
        </span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Add New Customer
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Enter the client details below.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* PERSONAL INFO */}
        <FormSection icon="👤" title="Personal Information">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Full Name"
              required
              type="text"
              name="fullName"
              value={FromData.fullName}
              placeholder="Enter full name"
              onChange={handleChange}
            />
            <TextField
              label="Phone Number"
              type="text"
              name="Phone"
              value={FromData.Phone}
              placeholder="+252..."
              onChange={handleChange}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Folder Name"
              required
              type="text"
              name="folderName"
              value={FromData.folderName}
              placeholder="Folder Name"
              onChange={handleChange}
            />

            <SelectField
              label="Photo Type"
              name="PhotoType"
              value={FromData.PhotoType}
              onChange={handleChange}
            >
              <option value="FullBody">FullBody</option>
              <option value="ID_Card">ID_Card</option>
              <option value="Headshot">Headshot</option>
              <option value="Portrait">Portrait</option>
              <option value="Certificate">Certificate</option>
              <option value="Wedding">Wedding</option>
            </SelectField>
          </div>
        </FormSection>

        {/* PHOTO BREAKDOWN & VIP TIERS */}
        <FormSection title="Photo Breakdown & VIP Tiers" icon="📸">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <TextField
              label="Number Of Photos"
              type="number"
              name="numberOfPhotos"
              value={FromData.numberOfPhotos}
              onChange={handleChange}
            />

            <TextField
              label="Normal Photos Count"
              placeholder="0"
              name="normalPhotosCount"
              type="number"
              value={FromData.normalPhotosCount}
              onChange={handleChange}
            />
            <TextField
              label="VIP Photos Count"
              placeholder="0"
              name="vipPhotosCount"
              type="number"
              value={FromData.vipPhotosCount}
              onChange={handleChange}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              label="VIP Tier Level"
              name="vipTierLevel"
              value={FromData.vipTierLevel}
              onChange={handleChange}
            >
              <option value="VIP_1">VIP 1 (Standard VIP)</option>
              <option value="VIP_2">VIP 2 (Premium VIP)</option>
              <option value="VIP_3">VIP 3 (Exclusive VIP)</option>
            </SelectField>

            <SelectField
              label="Order Status"
              name="status"
              value={FromData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </SelectField>
          </div>
        </FormSection>

        {/* EXP */}
        <FormSection title="EXP" icon="⏱️">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="EXP Photo"
              type="number"
              name="expPhotosCount"
              value={FromData.expPhotosCount}
              onChange={handleChange}
            />
            <TextField
              label="EXP Extra Charge"
              type="number"
              name="expExtraCharge"
              value={FromData.expExtraCharge}
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
              value={FromData.amountPaid}
              onChange={handleChange}
            />
            <TextField
              label="Remaining Amount"
              type="number"
              name="remainingAmount"
              value={FromData.remainingAmount}
              onChange={handleChange}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <TextField
              label="Cash Paid ($)"
              type="number"
              name="cashAmount"
              value={FromData.cashAmount}
              onChange={handleChange}
            />
            <TextField
              label="Zaad Paid ($)"
              type="number"
              name="zaadAmount"
              value={FromData.zaadAmount}
              onChange={handleChange}
            />
            <TextField
              label="eDahab Paid ($)"
              type="number"
              name="edahabAmount"
              value={FromData.edahabAmount}
              onChange={handleChange}
            />
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
