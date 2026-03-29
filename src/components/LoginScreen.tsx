import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Eye, EyeOff, Sparkles, Shield } from "lucide-react";

interface Props {
  onLogin: (name: string, email: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [isLogin, setIsLogin]   = useState(true);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    if (!isLogin && !name.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // small UX delay
    const displayName = isLogin ? email.split("@")[0] : name.trim();
    localStorage.setItem("mf_user", JSON.stringify({ name: displayName, email }));
    onLogin(displayName, email);
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-200">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>MF Portfolio X-Ray</h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered mutual fund analysis for Indian investors</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {["Login", "Sign Up"].map((t, i) => (
              <button key={t} onClick={() => { setIsLogin(i === 0); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${(i === 0) === isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sirisha Gowda" className={inputCls} />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" onKeyDown={e => e.key === "Enter" && handleSubmit()} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  className={`${inputCls} pr-11`} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-md shadow-blue-200 mt-2">
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : <Sparkles className="h-4 w-4" />}
              {loading ? "Please wait…" : isLogin ? "Login & Analyse" : "Create Account"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-gray-400">
          <Shield className="h-3 w-3" />
          <span>Your data stays private · No financial data stored</span>
        </div>
      </motion.div>
    </div>
  );
}
