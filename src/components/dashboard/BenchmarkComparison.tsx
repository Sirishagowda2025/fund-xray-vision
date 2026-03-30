import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import type { BenchmarkData } from "@/lib/demoData";

interface Props {
  benchmarks: BenchmarkData[];
}

const BenchmarkComparison = ({ benchmarks }: Props) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" /> Benchmark Comparison
      </h2>
      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground mb-4">Your portfolio vs NIFTY 50 Total Returns Index</p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarks} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 13,
                }}
                formatter={(value: number) => [`${value}%`]}
              />
              <Legend />
              <Bar dataKey="portfolioReturn" name="Your Portfolio" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmarkReturn" name="NIFTY 50" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <div className="flex flex-wrap gap-4 mt-4">
          {benchmarks.map((b, i) => {
            const diff = b.portfolioReturn - b.benchmarkReturn;
            return (
              <div key={i} className="text-center">
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className={`text-sm font-bold ${diff >= 0 ? "text-success" : "text-destructive"}`}>
                  {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenchmarkComparison;
