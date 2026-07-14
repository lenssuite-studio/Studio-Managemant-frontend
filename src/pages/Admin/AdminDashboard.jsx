import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStats, getAllStudios } from "../../features/AdminSlice";
import StatCard from "../../components/StatCard";
import Pill from "../../components/Pill";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  // Ka soo dhex bixi xogta stats-ka ee adminSlice
  const {
    totalStudios,
    studios,
    totalCustomers,
    activeStudios,
    inactiveStudios,
    loading,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminStats());
    dispatch(getAllStudios());
  }, [dispatch]);

  if (loading) {
    return <div className="p-5 text-sm text-slate-500 dark:text-slate-400">Waa la soo kicinayaa xogta...</div>;
  }

  return (
    <div>
      {/* 🚀 PLATFORM OVERVIEW HEADERS */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Platform Overview</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Manage your photography ecosystem, monitor performance metrics, and oversee studio health from a
          centralized command center.
        </p>
      </div>

      {/* 📊 METRICS GRID */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="🏢" tone="indigo" label="Total Studios" value={totalStudios || 0} />
        <StatCard icon="👥" tone="blue" label="Total System Customers" value={totalCustomers || 0} />
        <StatCard icon="🟢" tone="green" label="Active Studios" value={activeStudios || 0} valueClassName="text-emerald-500!" />
        <StatCard icon="🔴" tone="red" label="Inactive Studios" value={inactiveStudios || 0} valueClassName="text-red-500!" />
      </div>

      {/* 📋 SHAXDA MAAMULKA XARUMAHA (STUDIO MANAGEMENT TABLE) */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Registered Studios</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A complete list of all photography studios operating on the platform.
        </p>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["Studio Name", "Email Address", "Joined Date", "Status"].map((label) => (
                  <th
                    key={label}
                    className="whitespace-nowrap border-b border-slate-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studios.length > 0 ? (
                studios.map((studio) => (
                  <tr
                    key={studio._id}
                    className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{studio.username}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{studio.email}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {new Date(studio.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill tone={studio.isActive ? "green" : "amber"}>
                        {studio.isActive ? "Active" : "Inactive"}
                      </Pill>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center italic text-slate-400 dark:text-slate-500">
                    Wax studio ah oo diiwaangashan wali lama helin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
