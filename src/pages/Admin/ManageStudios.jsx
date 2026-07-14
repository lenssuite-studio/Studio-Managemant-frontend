import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudios,
  toggleStudioStatus,
  deleteStudio,
} from "../../features/AdminSlice";
import toast from "react-hot-toast";
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import Pill from "../../components/Pill";

const ACTION_PILL_BTN =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm";

export default function ManageStudios() {
  const dispatch = useDispatch();
  const { studios, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllStudios());
  }, [dispatch]);

  // 🔒 TOGGLE STATUS (Hadda waa async/await iyo try-catch)
  const handleToggle = async (id) => {
    if (
      window.confirm(
        "Ma hubtaa inaad rabto inaad bedesho status-ka Studio-gan?",
      )
    ) {
      try {
        await dispatch(toggleStudioStatus(id)).unwrap();
        toast.success("Status-ka studio-ga si guul leh ayaa loo beddelay! ⚙️");
      } catch (err) {
        toast.error(err || "Cillad ayaa dhacday inta status-ka la beddelayay.");
      }
    }
  };

  // 🗑️ DELETE STUDIO (Hadda waa async/await iyo try-catch)
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "DIGNIIN: Ma hubtaa inaad gabi ahaanba tirtirto Studio-gan?",
      )
    ) {
      try {
        await dispatch(deleteStudio(id)).unwrap();
        toast.success("Studio-ga gabi ahaanba waa nidaamka laga saaray! 🗑️");
      } catch (err) {
        toast.error(err || "Waa la waayay tirtirista studio-ga.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
        Waa la soo kicinayaa maamulka xarumaha...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          👑 Superadmin Studio Management
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Xannib, fasax ama gabi ahaanba nidaamka kaga tirtir photography studios-ka ka diiwaangashan LensSuite.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Operational Ecosystem</h2>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["Studio Name", "Email Address", "Status", "Actions", "Last Login"].map((label) => (
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
                    <td className="px-5 py-3.5">
                      <Pill tone={studio.isActive ? "green" : "amber"}>
                        {studio.isActive ? "Active" : "Inactive"}
                      </Pill>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(studio._id)}
                          className={`${ACTION_PILL_BTN} ${
                            studio.isActive
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                          }`}
                        >
                          {studio.isActive ? <FaLock size={11} /> : <FaLockOpen size={11} />}
                          {studio.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleDelete(studio._id)}
                          className={`${ACTION_PILL_BTN} bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20`}
                        >
                          <FaTrash size={11} /> Delete
                        </button>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {studio.lastLogin ? (
                        new Date(studio.lastLogin).toLocaleString("en-GB", {
                          // 'en-GB' wuxuu soo saaraa Day/Month/Year (19/06/2026)
                          timeZone: "Africa/Nairobi",
                          hour12: true,
                          dateStyle: "short", // Kani wuxuu ka dhigayaa qaabka gaaban ee ah 19/06/2026
                          timeStyle: "short", // Kani wuxuu soo saarayaa saacadda iyo daqiiqada (e.g. 1:40 AM)
                        })
                      ) : (
                        <span className="italic text-slate-400 dark:text-slate-500">Never logged in</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center italic text-slate-400 dark:text-slate-500">
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
