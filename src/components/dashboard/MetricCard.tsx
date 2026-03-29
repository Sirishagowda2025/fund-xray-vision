import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const MetricCard = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
    <div className="flex items-center gap-2.5 mb-2">
      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{value}</p>
  </motion.div>
);

export default MetricCard;
