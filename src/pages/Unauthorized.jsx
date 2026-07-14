import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
      <h1 className="text-7xl font-bold text-red-500">403</h1>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Oggolaansho Ma Lahid!</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Boggan waxaa u oggolaan oo kaliya maamulayaasha sare (Superadmin) ee LensSuite.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0"
      >
        ← Dib u Noqo
      </button>
    </div>
  );
}
