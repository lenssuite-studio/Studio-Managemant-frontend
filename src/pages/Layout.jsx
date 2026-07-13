import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../pages/Dashboard.css"; 
import { logout } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaArchive,
  FaLifeRing,
  FaSignOutAlt,
  FaUserFriends,
} from "react-icons/fa";

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // 🌟 Wuxuu eegayaa boga aad hadda taagan tahay

  const { userCustomer } = useSelector((state) => state.auth);
  // 🌟 PHASE 2: Reports iyo Team-ka waxaa arki kara Studio Manager oo kaliya, ma aha Employee
  const isStudioManager =
    userCustomer?.role === "studio_manager" ||
    userCustomer?.role === "studio_admin";

  // Func-kan wuxuu si automatic ah ugu darayaa class-ka 'active' meeshii aad taagan tahay
  const getMenuItemClass = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };

  return (
    <div className="lenssuite-layout">
      {/* SIDEBAR-KA GUUD — MAR KASTA WUU TAAGNAANAYAA */}
      <div className="lenssuite-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">📸</div>
          <div>
            <h3> {userCustomer?.username || "Admin"}</h3>
            <p>Pro Plan</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <div className={getMenuItemClass("/Dashboard")} onClick={() => navigate("/Dashboard")}>
            <span>
              <FaChartBar />
            </span>{" "}
            Dashboard
          </div>

          <div className={getMenuItemClass("/AddCustomer")} onClick={() => navigate("/AddCustomer")}>
            <span>
              <FaUsers />
            </span>{" "}
            AddCustomer
          </div>

          {isStudioManager && (
            <div className={getMenuItemClass("/Reports-Page")} onClick={() => navigate("/Reports-Page")}>
              <span>
                <FaFileAlt />
              </span>{" "}
              Studio Reports
            </div>
          )}

          {isStudioManager && (
            <div className={getMenuItemClass("/Employees")} onClick={() => navigate("/Employees")}>
              <span>
                <FaUserFriends />
              </span>{" "}
              Team
            </div>
          )}

          <div className={getMenuItemClass("/Archive")} onClick={() => navigate("/Archive")}>
            <span>
              <FaArchive />
            </span>{" "}
            Archive
          </div>
        </nav>

        {/* FOOTER-KA SIDEBAR-KA: MAR KASTA HOOS AYUU KU DHAMANAYAA */}
        <div className="sidebar-footer">
          <div className="menu-item" onClick={()=> navigate("/Support")}>
            <span>
              <FaLifeRing />
            </span>{" "}
            Support
          </div>
          <div
            className="menu-item"
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            <span>
              <FaSignOutAlt />
            </span>{" "}
            Sign Out
          </div>
        </div>
      </div>

      {/* QAYBTA MIDIG EE BOGAGGU KU KALA BEDDELMAYAAN */}
      <div className="lenssuite-main">
        <Outlet />
      </div>
    </div>
  );
}