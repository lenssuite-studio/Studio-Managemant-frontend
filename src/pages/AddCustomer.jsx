import { useNavigate } from "react-router-dom";
import "./AddCustomer.css";
import { addCustomer } from "../features/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";

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
    <div className="lenssuite-main">
      <div className="breadcrumb">
        Clients &gt; <span>New Registration</span>
      </div>

      <h1 className="form-title">Add New Customer</h1>
      <p className="form-subtitle">Enter the client details below.</p>

      <form className="customer-form" onSubmit={handleSubmit}>
        {/* PERSONAL INFO */}
        <div className="form-card">
          <h3 className="card-heading">
            <span>👤</span> Personal Information
          </h3>

          <div className="form-grid">
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="Phone"
                placeholder="+252..."
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: "20px" }}>
            <div className="input-group">
              <label>Folder Name *</label>
              <input
                type="text"
                name="folderName"
                placeholder="Folder Name"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Number Of Photos</label>
              <input
                type="number"
                name="numberOfPhotos"
                defaultValue={0}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* FINANCIAL */}
        <div className="form-card">
          <h3 className="card-heading">
            <span>💳</span> Financials
          </h3>

          <div className="form-grid">
            <div className="input-group">
              <label>Amount Paid</label>
              <input
                type="number"
                name="amountPaid"
                placeholder="$0"
                defaultValue={0}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Remaining Amount</label>
              <input
                type="number"
                name="remainingAmount"
                placeholder="$0"
                defaultValue={0}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: "20px" }}>
            <label>Customer Type</label>
            <select
              className="form-select"
              name="customerType"
              value={FromData.customerType}
              onChange={handleChange}
            >
              <option value="VIP">VIP</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </div>

          <div className="input-group" style={{ marginTop: "20px" }}>
            <label>Photo Type</label>
            <select
              className="form-select"
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
            </select>
          </div>

          <div className="input-group" style={{ marginTop: "20px" }}>
            <label>Status</label>
            <select
              className="form-select"
              name="status"
              value={FromData.status} // 🌟 Waa la saxay (FromData.status oo lowercase ah)
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="input-group" style={{ marginTop: "20px" }}>
            <label>Payment Method *</label>
            <select
              className="form-select"
              name="paymentMethod"
              value={FromData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="Cash">Cash</option>
              <option value="Edahab">Edahab</option>
              <option value="SAAD">SAAD</option>
            </select>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : "Create Customer"}
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/Dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
