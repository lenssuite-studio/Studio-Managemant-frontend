import { useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import AddCustomer from "./pages/AddCustomer";
import Layout from "./pages/Layout";
import EditCustomer from "./pages/EditCustomer";
import Reports from "./pages/Reports-Page";
import Employees from "./pages/Employees";
import Profile from "./pages/Profile";
import Approvals from "./pages/Approvals";
import ActivityHistory from "./pages/ActivityHistory";
import Finance from "./pages/Finance";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import ManageStudios from "./pages/Admin/ManageStudios";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Archive from "./pages/Archive";
import Support from "./pages/Support";

// 🌟 KUWA CUSUB: Soo iimport-garee foomamka password-ka rasmiga ah
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const { token, userCustomer, loading } = useSelector((state) => state.auth);
  const role = userCustomer?.role;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        LensSuite la soo kicinayaa...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* 🔐 BOGGA HORE (Login & Register Redirects) */}
        <Route
          path="/"
          element={
            token && userCustomer ? (
              role === "superadmin" ? (
                <Navigate to="/Admin/AdminDashboard" replace />
              ) : (
                <Navigate to="/Dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/Register"
          element={
            token && userCustomer ? (
              role === "superadmin" ? (
                <Navigate to="/Admin/AdminDashboard" replace />
              ) : (
                <Navigate to="/Dashboard" replace />
              )
            ) : (
              <Register />
            )
          }
        />

        {/* 🌟 KUWA CUSUB: Public Routes oo furan qof kasta ka hor intaanu Login sameyn */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 📸 1. STUDIO ROUTES — Studio Manager iyo Employee labaduba way wadaagaan */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["studio_manager", "studio_admin", "employee"]}
            />
          }
        >
          <Route element={<Layout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/AddCustomer" element={<AddCustomer />} />
            <Route path="/EditCustomer/:id" element={<EditCustomer />} />
            <Route path="/Support" element={<Support/>}/>
            <Route path="/Archive" element={<Archive/>} />
            <Route path="/Profile" element={<Profile/>} />
          </Route>
        </Route>

        {/* 📊 1b. STUDIO MANAGER OO KALIYA — Reports iyo Team Management */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["studio_manager", "studio_admin"]} />
          }
        >
          <Route element={<Layout />}>
            <Route path="/Reports-Page" element={<Reports />} />
            <Route path="/Employees" element={<Employees />} />
            <Route path="/Approvals" element={<Approvals />} />
            <Route path="/ActivityHistory" element={<ActivityHistory />} />
            <Route path="/Finance" element={<Finance />} />
          </Route>
        </Route>

        {/* 👑 2. SUPERADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/Admin/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/Admin/ManageStudios" element={<ManageStudios />} />
          </Route>
        </Route>

        {/* Af-duubka URL-ada khaldan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}