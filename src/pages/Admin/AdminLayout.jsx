import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";
import { useState } from "react";
import useTheme from "../../hooks/useTheme";
import {
  FaChartBar,
  FaBuilding,
  FaUsers,
  FaLifeRing,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const SIDEBAR_COLLAPSED_KEY = "lenssuite-admin-sidebar-collapsed";

const NAV_ITEM_BASE =
  "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium cursor-pointer transition-all duration-200";
const NAV_ITEM_INACTIVE =
  "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";
const NAV_ITEM_ACTIVE =
  "bg-indigo-50 text-indigo-600 font-semibold dark:bg-indigo-500/10 dark:text-indigo-400";

function NavItem({ active, collapsed, icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`${NAV_ITEM_BASE} ${active ? NAV_ITEM_ACTIVE : NAV_ITEM_INACTIVE} ${
        collapsed ? "justify-center px-2.5" : ""
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
      )}
      <span className="flex shrink-0 text-lg transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Kani wuxuu inoo sheegayaa bogga aan taagan nahay
  const { isDark, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true",
  );

  // Xogta superadmin-ka haddii aad rabto inaad magaciisa muujiso
  const { userCustomer } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* SIDEBAR-KA GUUD — MAR KASTA WUU TAAGNAANAYAA */}
      <div
        className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-6 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="mb-8 flex min-h-10 items-center gap-3 px-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-lg shadow-indigo-600/30">
            📸
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col overflow-hidden">
              <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {userCustomer?.username || "Admin"}
              </h3>
              <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                Super Admin
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Ballaadhi Sidebar-ka" : "Cidhiidhi Sidebar-ka"}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors duration-200 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400 ${
              collapsed ? "" : "ml-auto"
            }`}
          >
            {collapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavItem
            active={isActive("/Admin/AdminDashboard")}
            collapsed={collapsed}
            icon={<FaChartBar />}
            label="Dashboard"
            onClick={() => navigate("/Admin/AdminDashboard")}
          />
          <NavItem
            active={isActive("/Admin/ManageStudios")}
            collapsed={collapsed}
            icon={<FaBuilding />}
            label="ManageStudios"
            onClick={() => navigate("/Admin/ManageStudios")}
          />
          <NavItem
            active={isActive("/Admin/Customers")}
            collapsed={collapsed}
            icon={<FaUsers />}
            label="Customers"
            onClick={() => navigate("/Admin/Customers")}
          />
        </nav>

        <div className="mt-2 flex flex-col gap-1 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={toggleTheme}
            title={collapsed ? "Beddel muuqaalka (Light/Dark)" : undefined}
            className={`${NAV_ITEM_BASE} ${NAV_ITEM_INACTIVE} w-full ${collapsed ? "justify-center px-2.5" : ""}`}
          >
            <span className="flex shrink-0 text-lg">{isDark ? <FaSun /> : <FaMoon />}</span>
            {!collapsed && <span className="truncate">{isDark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          <NavItem
            active={false}
            collapsed={collapsed}
            icon={<FaLifeRing />}
            label="Support"
            onClick={() => {}}
          />

          <div
            title={collapsed ? "Sign Out" : undefined}
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
            className={`${NAV_ITEM_BASE} text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 ${
              collapsed ? "justify-center px-2.5" : ""
            }`}
          >
            <span className="flex shrink-0 text-lg">
              <FaSignOutAlt />
            </span>
            {!collapsed && <span className="truncate">Sign Out</span>}
          </div>
        </div>
      </div>

      {/* QAYBTA MIDIG EE BOGAGGU KU KALA BEDDELMAYAAN */}
      <div className="w-full flex-grow animate-[lenssuite-fade-in-up_0.35s_ease-out] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-[1700px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
