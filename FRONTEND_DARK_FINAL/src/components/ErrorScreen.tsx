import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Something went wrong</h2>
        <p className="text-slate-400 text-sm mb-6">The analysis timed out or the backend isn't responding. Check your Render URL and try again.</p>
        <button onClick={onRetry} className="btn-primary" style={{ width: "auto", padding: "12px 24px" }}>
          <RefreshCw className="h-4 w-4" />Try Again
        </button>
      </motion.div>
    </div>
  );
}
