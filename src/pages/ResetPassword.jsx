import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  resetPasswordThunk,
  clearPasswordStates,
} from "../features/passwordSlice";
import AuthCard from "../components/AuthCard";
import { TextField } from "../components/FormField";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Ka soo dhex bixi states-ka Redux Store (password reducer)
  const { loading, error, successMessage } = useSelector(
    (state) => state.password,
  );

  useEffect(() => {
    dispatch(clearPasswordStates());
  }, [dispatch]);

  // Haddii uu si guul leh u beddelmo, 3 ilbiriqsi ka dib u weeci Login-ka
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      return setLocalError("Labada Password isma laha!");
    }

    dispatch(resetPasswordThunk({ token, password }));
  };

  return (
    <AuthCard>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Abuur Password Cusub</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fadlan qor password-kaaga cusub hoos.</p>

      {successMessage && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          ✅ {successMessage} - Waxaa loo weecinayaa Login...
        </div>
      )}
      {(error || localError) && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-left text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          ❌ {error || localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Password-ka Cusub"
        />

        <TextField
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Ku celi Password-ka"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Waa la beddelayaa..." : "Update Password"}
        </button>
      </form>

      <div className="mt-6">
        <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          Ku noqo Login
        </Link>
      </div>
    </AuthCard>
  );
}
