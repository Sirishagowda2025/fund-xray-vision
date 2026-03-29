import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Shield } from "lucide-react";
import type { RiskRadarData } from "@/lib/demoData";

interface Props {
  data: RiskRadarData[];
}

const RiskRadar = ({ data }: Props) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" /> Risk Radar
      </h2>
      <div className="glass-card p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Radar
                name="Portfolio"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {data.map((d, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-muted-foreground">{d.axis}</p>
              <p className={`text-sm font-bold ${d.value >= 70 ? "text-success" : d.value >= 50 ? "text-warning" : "text-destructive"}`}>
                {d.value}/100
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RiskRadar;
