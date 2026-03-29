import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
          Something went wrong
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          The analysis timed out or your backend isn't responding. Check your Render URL and try again.
        </p>
        <button onClick={onRetry}
          className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all">
          <RefreshCw className="h-4 w-4" />Try Again
        </button>
      </motion.div>
    </div>
  );
}
