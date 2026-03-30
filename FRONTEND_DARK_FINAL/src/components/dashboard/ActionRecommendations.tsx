import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Repeat, Minus, Plus } from "lucide-react";
import type { ActionRecommendation } from "@/lib/demoData";

const categoryIcons = {
  rebalance: RefreshCw,
  switch: Repeat,
  reduce: Minus,
  add: Plus,
};

const categoryColors = {
  rebalance: "bg-primary/10 text-primary",
  switch: "bg-warning/10 text-warning",
  reduce: "bg-destructive/10 text-destructive",
  add: "bg-success/10 text-success",
};

interface Props {
  recommendations: ActionRecommendation[];
  currentScore: number;
  onSimulate?: (rec: ActionRecommendation) => void;
}

const ActionRecommendations = ({ recommendations, currentScore, onSimulate }: Props) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-primary" /> Action Recommendations
      </h2>
      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const Icon = categoryIcons[rec.category];
          const newScore = currentScore + rec.projectedScoreChange;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSimulate?.(rec)}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${categoryColors[rec.category]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{rec.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rec.impact}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Score impact</p>
                  <p className="text-sm font-bold text-success">
                    {currentScore} → {newScore} (+{rec.projectedScoreChange})
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 glass-card p-4 bg-primary/5 border-primary/20">
        <p className="text-sm font-semibold text-foreground">
          💡 If you implement all recommendations: Score becomes{" "}
          <span className="text-primary font-bold">
            {Math.min(100, currentScore + recommendations.reduce((s, r) => s + r.projectedScoreChange, 0))}
          </span>{" "}
          (+{recommendations.reduce((s, r) => s + r.projectedScoreChange, 0)} points)
        </p>
      </div>
    </section>
  );
};

export default ActionRecommendations;
