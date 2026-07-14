import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// 🌟 1. Soo iimport-garee Thunk-ka cusub iyo clearState-ka gaarka u ah passwordSlice
import { forgotPasswordThunk, clearPasswordStates } from "../features/passwordSlice";
import AuthCard from "../components/AuthCard";
import { TextField } from "../components/FormField";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  // 🌟 2. Ka soo dhex bixi states-ka Redux Store (password reducer)
  const { loading, error, successMessage } = useSelector((state) => state.password);

  // 🌟 3. Nadiifi states-ka hore (error iyo success) marka bogga la soo galo ama laga tago
  useEffect(() => {
    dispatch(clearPasswordStates());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🌟 4. U yeer Thunk-ka saxda ah adoo u dhiibaya email-ka
    dispatch(forgotPasswordThunk({ email }));
  };

  return (
    <AuthCard>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ilowday Password-ka?</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Geli email-kaaga si aan kuugu soo dirno link-ga dib-u-dajinta password-ka.
      </p>

      {successMessage && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          📬 {successMessage}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-left text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="example@gmail.com"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Waa la dirayaa..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-6">
        <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          ← Ku noqo Loginn
        </Link>
      </div>
    </AuthCard>
  );
}
