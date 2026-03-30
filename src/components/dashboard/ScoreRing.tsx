import { motion } from "framer-motion";

const ScoreRing = ({ score }: { score: number }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score < 50 ? "#ef4444" : score < 75 ? "#f59e0b" : "#22c55e";
  const label = score < 50 ? "Needs Attention" : score < 75 ? "Getting There" : "Looking Good!";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
          <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
          <motion.circle cx="90" cy="90" r={r} fill="none" strokeWidth="12" strokeLinecap="round"
            style={{ stroke: color, filter: `drop-shadow(0 0 8px ${color}60)` }}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeDasharray={circ}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="text-5xl font-bold" style={{ color, fontFamily: "'Space Grotesk',sans-serif" }}>
            {score}
          </motion.div>
          <p className="text-xs text-slate-500 mt-1">Health Score</p>
        </div>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="text-sm font-semibold mt-2" style={{ color }}>
        {label}
      </motion.p>
    </div>
  );
};

export default ScoreRing;
