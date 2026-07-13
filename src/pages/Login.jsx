import { useState, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/Dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className="Container">
      <button
        type="button"
        onClick={toggleTheme}
        title="Beddel muuqaalka (Light/Dark)"
        aria-label="Toggle dark mode"
        className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </button>
      <div className="Content-login">
        <div className="content-Right">
          <div className="right-conten">
            <h2 className="Title-Right">
              <span>📸</span>LensSuite Admin
            </h2>
            <h1 className="subTitile">Elevate your creative workflow.</h1>

            <p className="subContent">
              Manage sessions, clients, and finances in one unified
              precision-built workspace. Joined by 500+ studio owners
            </p>
          </div>
        </div>

        <div className="content-Left">
          <div className="Form-login">
            <div className="Header-top">
              <h1 className="title-left"> Welcome Back 👋</h1>
              <p className="left-content">
                Please enter your details to access your studio.
              </p>
            </div>
            <div className="From-container">
              <form className="from-item" onSubmit={handleSubmit}>
                <input
                  className="input"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  className="input"
                  type="password"
                  placeholder="password......"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* 🌟 KANI WAA BADHANKA CUSUB EE LOO DARAY */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "-5px",
                    marginBottom: "15px",
                  }}
                >
                  <Link
                    to="/forgot-password"
                    style={{
                      color: "#4CAF50",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    forget Password ?
                  </Link>
                </div>

                {error && <p className="error-text">{error}</p>}
                <button className="from-button" disabled={loading}>
                  {loading ? "Loading....." : "sign in to studio"}
                </button>
              </form>
              <p className="register-text">
                Account ma lihid?{" "}
                <Link to="/Register" className="register-link">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}