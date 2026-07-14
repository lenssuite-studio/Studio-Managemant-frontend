import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../features/axiosInstance";
import { useDispatch } from "react-redux";
import { updateCustomer } from "../features/CustomerSlice";
import toast from "react-hot-toast";
import { TextField, SelectField, TextAreaField } from "../components/FormField";

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
    paymentMethod: "Cash",
    amountPaid: 0,
    remainingAmount: 0,
    numberOfPhotos: 0,
    reason: "",
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
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Edit Customer</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
        <TextField label="Phone Number" name="Phone" value={formData.Phone} onChange={handleChange} placeholder="Phone" />
        <TextField
          label="Folder Name"
          name="folderName"
          value={formData.folderName}
          onChange={handleChange}
          placeholder="Folder Name"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <TextField
            label="Number of Photos"
            type="number"
            name="numberOfPhotos"
            value={formData.numberOfPhotos}
            onChange={handleChange}
          />
          <TextField
            label="Amount Paid ($)"
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
          />
          <TextField
            label="Remaining Amount ($)"
            type="number"
            name="remainingAmount"
            value={formData.remainingAmount}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* 🌟 Talo: Magaca "Status" halkan waxaa loo beddelay Customer Type maadaama uu VIP/NORMAL yahay */}
          <SelectField label="Customer Type" name="customerType" value={formData.customerType} onChange={handleChange}>
            <option value="VIP">VIP</option>
            <option value="NORMAL">NORMAL</option>
          </SelectField>

          {/* 🌟 KU DARID: Qaybta doorashada PhotoType ee foomka Edit-ka */}
          <SelectField
            label="Photo Type"
            name="PhotoType"
            value={formData.PhotoType || "FullBody"}
            onChange={handleChange}
          >
            <option value="FullBody">FullBody</option>
            <option value="ID_Card">ID_Card</option>
            <option value="Headshot">Headshot</option>
            <option value="Portrait">Portrait</option>
            <option value="Certificate">Certificate</option>
            <option value="Wedding">Wedding</option>
          </SelectField>

          <SelectField label="Status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </SelectField>

          <SelectField
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod || "Cash"}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="Edahab">Edahab</option>
            <option value="SAAD">SAAD</option>
          </SelectField>
        </div>

        <TextAreaField
          label="Reason for Change (optional)"
          name="reason"
          value={formData.reason || ""}
          onChange={handleChange}
          placeholder="Why are you requesting this change? (optional)"
          rows={3}
        />

        <button
          type="submit"
          className="mt-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0"
        >
          Update Customer
        </button>
      </form>
    </div>
  );
}
