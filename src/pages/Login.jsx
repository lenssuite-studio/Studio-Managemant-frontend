import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { TextField } from "../components/FormField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <AuthShell
      heading="Elevate your creative workflow."
      description="Manage sessions, clients, and finances in one unified precision-built workspace. Joined by 500+ studio owners"
    >
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome Back 👋</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Please enter your details to access your studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <TextField
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          type="password"
          placeholder="password......"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="-mt-1.5 flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            forget Password ?
          </Link>
        </div>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading....." : "sign in to studio"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Account ma lihid?{" "}
        <Link to="/Register" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          Register
        </Link>
      </p>
    </AuthShell>
  );
}
