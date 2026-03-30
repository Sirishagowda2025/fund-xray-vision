import { motion } from "framer-motion";
import type { ScoreBreakdown } from "@/lib/demoData";

interface Props {
  scoreBreakdown: ScoreBreakdown;
}

const weights = {
  performance: 30,
  diversification: 25,
  costEfficiency: 25,
  riskAlignment: 20,
};

const labels: Record<keyof ScoreBreakdown, string> = {
  performance: "Performance",
  diversification: "Diversification",
  costEfficiency: "Cost Efficiency",
  riskAlignment: "Risk Alignment",
};

const getDeductionReason = (key: keyof ScoreBreakdown, value: number): string | null => {
  if (value >= 80) return null;
  const reasons: Record<keyof ScoreBreakdown, string> = {
    performance: "Some funds underperforming benchmark peers",
    diversification: "High overlap and limited geographic exposure",
    costEfficiency: "Expense ratios above category average",
    riskAlignment: "Allocation doesn't fully match risk profile",
  };
  return reasons[key];
};

const ScoreBreakdownSection = ({ scoreBreakdown }: Props) => {
  const entries = Object.entries(scoreBreakdown) as [keyof ScoreBreakdown, number][];

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-4">Score Breakdown</h2>
      <div className="glass-card p-6 space-y-5">
        {entries.map(([key, value]) => {
          const reason = getDeductionReason(key, value);
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">
                  {labels[key]}{" "}
                  <span className="text-xs opacity-60">({weights[key]}% weight)</span>
                </span>
                <span className="font-semibold text-foreground">{value}/100</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    value >= 75 ? "bg-success" : value >= 50 ? "bg-warning" : "bg-destructive"
                  }`}
                />
              </div>
              {reason && (
                <p className="text-xs text-muted-foreground mt-1 pl-1">
                  ⓘ {reason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ScoreBreakdownSection;
