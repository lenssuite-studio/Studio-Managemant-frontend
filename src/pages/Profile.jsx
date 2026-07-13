import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../features/ProfileSlice";
import "./AddCustomer.css";

const roleLabels = {
  superadmin: "Super Admin",
  studio_manager: "Studio Manager",
  studio_admin: "Studio Manager",
  employee: "Employee",
};

export default function Profile() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.Profile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className="lenssuite-main">
      <div className="breadcrumb">
        Account &gt; <span>My Profile</span>
      </div>

      <h1 className="form-title">My Profile</h1>
      <p className="form-subtitle">Xogtaada shakhsi ahaaneed ee akoonkan.</p>

      <div className="form-card" style={{ maxWidth: "480px" }}>
        {loading || !data ? (
          <p>Loading...</p>
        ) : (
          <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={data.username} disabled readOnly />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="text" value={data.email} disabled readOnly />
            </div>
            <div className="input-group">
              <label>Role</label>
              <input
                type="text"
                value={roleLabels[data.role] || data.role}
                disabled
                readOnly
              />
            </div>
            {data.studioName && (
              <div className="input-group">
                <label>Studio</label>
                <input type="text" value={data.studioName} disabled readOnly />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
