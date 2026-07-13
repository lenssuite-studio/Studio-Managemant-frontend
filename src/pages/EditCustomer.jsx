import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../features/axiosInstance";
import { useDispatch } from "react-redux";
import { updateCustomer } from "../features/CustomerSlice";
import "./EditCustomer.css";
import toast from "react-hot-toast";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    Phone: "",
    folderName: "",
    customerType: "VIP",
    status: "Pending",
    PhotoType: "FullBody", // 🌟 KU DARID: State-ka bilowga ah waxaa lagu daray PhotoType
    amountPaid: 0,
    remainingAmount: 0,
    numberOfPhotos: 0,
  });

  // 🔥 GET SINGLE CUSTOMER (from list)
  useEffect(() => {
    const fetchData = async () => {
      // 🌟 SAXID: Waxaan isticmaaleynaa API instance-ka la wadaago (Bearer token sax ah)
      // halkii aan isticmaali lahayn axios tooska ah oo isticmaali jiray 'token' oo aan jirin
      const res = await API.get("/Customer/List");

      const customer = res.data.find((c) => c._id === id);

      if (customer) {
        setFormData(customer);
      }
    };

    fetchData();
  }, [id]);

  // input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      // 🌟 SAXID: Haddii uu yahay input number ah, u beddel lambar dhab ah si uusan backend-ku u diidin
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(updateCustomer({ id, customerData: formData })).unwrap();

    // 🌟 PHASE 3 (fraud-prevention): Employee-ka codsigiisu wuxuu sugayaa ansixin,
    // marka farriinta la muujiyo waa in ay saxdo waxa dhab ahaan dhacay
    if (result?.pending) {
      toast.success(result.message || "Isbeddelkaaga waxaa loo diray maamulaha si loo ansixiyo.");
    } else {
      toast.success("Customer si guul leh ayaa loo cusboonaysiiyay ✅");
    }

    navigate("/Dashboard");
  };

  return (
    <div className="lenssuite-main edit-customer-container">
      <h1 className="form-title">Edit Customer</h1>

      <form onSubmit={handleSubmit} className="customer-form edit-form-card">
        
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            placeholder="Phone"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Folder Name</label>
          <input
            name="folderName"
            value={formData.folderName}
            onChange={handleChange}
            placeholder="Folder Name"
            className="form-input"
          />
        </div>

        <div className="form-group-grid">
          <div className="form-group">
            <label className="form-label">Number of Photos</label>
            <input
              name="numberOfPhotos"
              type="number"
              value={formData.numberOfPhotos}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount Paid ($)</label>
            <input
              name="amountPaid"
              type="number"
              value={formData.amountPaid}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remaining Amount ($)</label>
            <input
              name="remainingAmount"
              type="number"
              value={formData.remainingAmount}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Customer Type</label> {/* 🌟 Talo: Magaca "Status" halkan waxaa loo beddelay Customer Type maadaama uu VIP/NORMAL yahay */}
          <select
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
            className="form-select"
          >
            <option value="VIP">VIP</option>
            <option value="NORMAL">NORMAL</option>
          </select>
        </div>

        {/* 🌟 KU DARID: Qaybta doorashada PhotoType ee foomka Edit-ka */}
        <div className="form-group">
          <label className="form-label">Photo Type</label>
          <select
            name="PhotoType" // Waa xarfo waaweyn sidii nidaamka kale
            value={formData.PhotoType || "FullBody"} // Haddii uu xog hore waayo wuxuu qaadanayaa FullBody
            onChange={handleChange}
            className="form-select"
          >
            <option value="FullBody">FullBody</option>
            <option value="ID_Card">ID_Card</option>
            <option value="Headshot">Headshot</option>
            <option value="Portrait">Portrait</option>
            <option value="Certificate">Certificate</option>
            <option value="Wedding">Wedding</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label> {/* 🌟 Talo: Magaca "Status2" halkan waxaa dib loogu soo celiyay Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn-submit-customer">
          Update Customer
        </button>
      </form>
    </div>
  );
}