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
    // customerType: "VIP",
    status: "Pending",
    PhotoType: "FullBody",
    vipTierLevel: "VIP_1",
    // paymentMethod: "Cash",
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
    reason: "",
  });

  // GET SINGLE CUSTOMER
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/Customer/List");
        const customer = res.data.find((c) => c._id === id);

        if (customer) {
          setFormData({
            ...customer,
            vipTierLevel: customer.vipTierLevel || "VIP_1",
            normalPhotosCount: customer.normalPhotosCount || 0,
            vipPhotosCount: customer.vipPhotosCount || 0,
            expPhotosCount: customer.expPhotosCount || 0,
            expExtraCharge: customer.expExtraCharge || 0,
            cashAmount: customer.cashAmount || 0,
            zaadAmount: customer.zaadAmount || 0,
            edahabAmount: customer.edahabAmount || 0,
            reason: "",
          });
        }
      } catch (error) {
        toast.error("Waa la qaadi waayay xogta macmiilka");
      }
    };

    fetchData();
  }, [id]);

  // input change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(updateCustomer({ id, customerData: formData })).unwrap();

      if (result?.pending) {
        toast.success(result.message || "Isbeddelkaaga waxaa loo diray maamulaha si loo ansixiyo.");
      } else {
        toast.success("Customer si guul leh ayaa loo cusboonaysiiyay ✅");
      }

      navigate("/Dashboard");
    } catch (err) {
      toast.error("Waxaa dhacday cillad xilliga cusboonaysiinta");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Edit Customer
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        {/* Basic Info */}
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <TextField
          label="Phone Number"
          name="Phone"
          value={formData.Phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <TextField
          label="Folder Name"
          name="folderName"
          value={formData.folderName}
          onChange={handleChange}
          placeholder="Folder Name"
        />

        {/* Photos Counts Breakdown */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <TextField
            label="Total Photos"
            type="number"
            name="numberOfPhotos"
            value={formData.numberOfPhotos}
            onChange={handleChange}
          />
          <TextField
            label="Normal Photos"
            type="number"
            name="normalPhotosCount"
            value={formData.normalPhotosCount}
            onChange={handleChange}
          />
          <TextField
            label="VIP Photos"
            type="number"
            name="vipPhotosCount"
            value={formData.vipPhotosCount}
            onChange={handleChange}
          />
        </div>

        {/* EXP Info */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            label="EXP Photos Count"
            type="number"
            name="expPhotosCount"
            value={formData.expPhotosCount}
            onChange={handleChange}
          />
          <TextField
            label="EXP Extra Charge ($)"
            type="number"
            name="expExtraCharge"
            value={formData.expExtraCharge}
            onChange={handleChange}
          />
        </div>

        {/* Financial Amounts */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

        {/* Payment Breakdown */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <TextField
            label="Cash Amount ($)"
            type="number"
            name="cashAmount"
            value={formData.cashAmount}
            onChange={handleChange}
          />
          <TextField
            label="Zaad Amount ($)"
            type="number"
            name="zaadAmount"
            value={formData.zaadAmount}
            onChange={handleChange}
          />
          <TextField
            label="eDahab Amount ($)"
            type="number"
            name="edahabAmount"
            value={formData.edahabAmount}
            onChange={handleChange}
          />
        </div>

        {/* Types & Selects */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* <SelectField
            label="Customer Type"
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
          >
            <option value="VIP">VIP</option>
            <option value="NORMAL">NORMAL</option>
          </SelectField> */}

          <SelectField
            label="VIP Tier Level"
            name="vipTierLevel"
            value={formData.vipTierLevel}
            onChange={handleChange}
          >
            <option value="VIP_1">VIP Tier 1</option>
            <option value="VIP_2">VIP Tier 2</option>
            <option value="VIP_3">VIP Tier 3</option>
          </SelectField>

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

          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </SelectField>

          {/* <SelectField
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod || "Cash"}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="Edahab">Edahab</option>
            <option value="SAAD">SAAD</option>
          </SelectField> */}
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