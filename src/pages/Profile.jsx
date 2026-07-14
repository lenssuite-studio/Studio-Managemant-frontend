import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../features/ProfileSlice";
import { TextField } from "../components/FormField";

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
    <div>
      <div className="mb-1 text-sm text-slate-400 dark:text-slate-500">
        Account <span className="mx-1">›</span>
        <span className="text-slate-600 dark:text-slate-300">My Profile</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Xogtaada shakhsi ahaaneed ee akoonkan.</p>

      <div className="mt-6 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        {loading || !data ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <div className="flex flex-col gap-5">
            <TextField label="Full Name" type="text" value={data.username} disabled readOnly />
            <TextField label="Email" type="text" value={data.email} disabled readOnly />
            <TextField label="Role" type="text" value={roleLabels[data.role] || data.role} disabled readOnly />
            {data.studioName && (
              <TextField label="Studio" type="text" value={data.studioName} disabled readOnly />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
