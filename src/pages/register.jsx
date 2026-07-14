import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterStudio } from "../features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import AuthShell from "../components/AuthShell";
import { TextField } from "../components/FormField";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(RegisterStudio({ username, email, password })).unwrap();
      navigate("/");
    } catch {
      // Error is already managed in Redux state.
    }
  };

  return (
    <AuthShell
      heading="Empower your photography business."
      description="The all-in-one workspace for modern photographers. Manage your client relationships, organize high-res folders, and handle your finances in a single, beautiful interface."
    >
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create Studio Account</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Please enter your details to access your studio.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <TextField
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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

        {successMessage && <p className="text-sm font-medium text-emerald-500">{successMessage}</p>}
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading....." : "Register Studio"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        account ma leedahay?{" "}
        <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
