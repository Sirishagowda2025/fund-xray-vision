import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Eye, EyeOff, Sparkles, Shield, BarChart2, Lightbulb } from "lucide-react";

interface Props { onLogin: (name: string, email: string) => void; }

export default function LoginScreen({ onLogin }: Props) {
  const [isLogin, setIsLogin]   = useState(true);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    setError("");
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }
    if (!isLogin && !name.trim()) { setError("Please enter your name"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const displayName = isLogin ? email.split("@")[0] : name.trim();
    localStorage.setItem("mf_user", JSON.stringify({ name: displayName, email }));
    onLogin(displayName, email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f1729 0%, #111827 50%, #0d1b3e 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-12">
            <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>MF Portfolio X-Ray</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Analyse Your Mutual Funds<br />
            <span className="text-blue-400">Like a Pro Advisor</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Upload your CAMS statement. Get true XIRR, overlap analysis,<br />
            hidden fee detection, and AI-powered recommendations — free.
          </p>
          <div className="space-y-4">
            {[
              { icon: BarChart2, text: "True XIRR across all SIP transactions" },
              { icon: Shield,    text: "Hidden expense drag calculated in ₹" },
              { icon: Lightbulb, text: "AI recommendations with fund-specific advice" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — login card */}
      <div className="flex items-center justify-center flex-1 px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>MF Portfolio X-Ray</span>
          </div>

          <div className="solid-card p-8">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Welcome</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>

            {/* Tab */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
              {["Login", "Sign Up"].map((t, i) => (
                <button key={t} onClick={() => { setIsLogin(i === 0); setError(""); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${(i === 0) === isLogin ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Sirisha Gowda" className="dark-input" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" onKeyDown={e => e.key === "Enter" && submit()} className="dark-input" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                    onKeyDown={e => e.key === "Enter" && submit()} className="dark-input pr-11" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-xs px-3 py-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </div>
              )}

              <button onClick={submit} disabled={loading} className="btn-primary mt-2">
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : <Sparkles className="h-4 w-4" />}
                {loading ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
              </button>

              <div className="relative flex items-center my-1">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="px-3 text-xs text-slate-500">OR</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              <button onClick={() => { localStorage.setItem("mf_user", JSON.stringify({ name: "Demo User", email: "demo@test.com" })); onLogin("Demo User", "demo@test.com"); }}
                className="btn-secondary">
                <Sparkles className="h-4 w-4 text-green-400" />
                Try Demo (No Login)
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            🔒 Your data stays private · No financial data stored
          </p>
        </motion.div>
      </div>
    </div>
  );
}
