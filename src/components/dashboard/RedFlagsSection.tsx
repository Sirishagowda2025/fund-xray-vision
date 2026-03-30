import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { RedFlag } from "@/lib/demoData";

interface Props {
  redFlags: RedFlag[];
}

const severityStyles = {
  high: "bg-destructive/8 border-destructive/20 text-destructive",
  medium: "bg-warning/8 border-warning/20 text-warning",
  low: "bg-muted/50 border-border text-muted-foreground",
};

const severityLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const RedFlagsSection = ({ redFlags }: Props) => {
  const sorted = [...redFlags].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" /> Red Flags
      </h2>
      <div className="space-y-3">
        {sorted.map((flag, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-3 p-4 rounded-xl border ${severityStyles[flag.severity]}`}
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{flag.message}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
              flag.severity === "high" ? "bg-destructive/10 text-destructive" :
              flag.severity === "medium" ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            }`}>
              {severityLabels[flag.severity]}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RedFlagsSection;
