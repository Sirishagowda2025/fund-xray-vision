import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const MetricCard = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="metric-card">
    <div className="flex items-center gap-2.5 mb-2">
      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <Icon className="h-4 w-4 text-blue-400" />
      </div>
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{value}</p>
  </motion.div>
);

export default MetricCard;
