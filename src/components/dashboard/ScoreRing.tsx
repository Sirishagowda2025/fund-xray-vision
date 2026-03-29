import { motion } from "framer-motion";

const ScoreRing = ({ score }: { score: number }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const colorClass = score < 50 ? "score-ring-red" : score < 75 ? "score-ring-amber" : "score-ring-green";
  const textColor  = score < 50 ? "text-red-500" : score < 75 ? "text-amber-500" : "text-green-600";

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180" style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="hsl(210 40% 96%)" strokeWidth="12" />
        <motion.circle
          cx="90" cy="90" r={r} fill="none" strokeWidth="12" strokeLinecap="round"
          className={colorClass}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeDasharray={circ}
        />
      </svg>
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-5xl font-bold ${textColor}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {score}
        </motion.div>
        <p className="text-sm text-gray-500 mt-1">Health Score</p>
      </div>
    </div>
  );
};

export default ScoreRing;
