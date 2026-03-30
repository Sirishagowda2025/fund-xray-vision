import { motion } from "framer-motion";
import { Zap, AlertOctagon, TrendingDown, Building2 } from "lucide-react";
import type { Fund } from "@/lib/demoData";

interface Props {
  funds: Fund[];
  overlapPercent: number;
}

// Sector weights per category (approximate real-world data)
const SECTOR_MAP: Record<string, Record<string, number>> = {
  "Large Cap":    { IT: 28, Financials: 32, Energy: 15, Consumer: 12, Healthcare: 8, Others: 5 },
  "Flexi Cap":    { IT: 22, Financials: 28, Consumer: 18, Healthcare: 12, Energy: 10, Others: 10 },
  "Mid Cap":      { IT: 18, Industrials: 22, Consumer: 20, Financials: 18, Healthcare: 12, Others: 10 },
  "Small Cap":    { Industrials: 25, Consumer: 20, IT: 15, Healthcare: 15, Materials: 15, Others: 10 },
  "ELSS":         { IT: 25, Financials: 30, Consumer: 15, Healthcare: 10, Energy: 12, Others: 8 },
  "Index":        { IT: 13, Financials: 37, Energy: 12, Consumer: 10, Healthcare: 7, Others: 21 },
  "Hybrid":       { Financials: 30, IT: 20, Consumer: 15, Debt: 20, Healthcare: 8, Others: 7 },
  "Debt":         { Debt: 100 },
  "International":{ Technology: 35, Consumer: 25, Healthcare: 15, Financials: 15, Others: 10 },
  "Other":        { Mixed: 100 },
};

// Top stock per category for concentration detection
const TOP_STOCKS: Record<string, string[]> = {
  "Large Cap":    ["HDFC Bank", "Reliance", "Infosys", "TCS", "ICICI Bank"],
  "Flexi Cap":    ["HDFC Bank", "Infosys", "ICICI Bank", "Bajaj Finance", "Kotak Bank"],
  "Mid Cap":      ["Persistent", "Coforge", "Trent", "Voltas", "KPIT Tech"],
  "Small Cap":    ["Kaynes Tech", "Dixon Tech", "Balu Forge", "Cello World", "360 One"],
  "ELSS":         ["HDFC Bank", "Infosys", "Reliance", "Axis Bank", "Bharti Airtel"],
  "Index":        ["Reliance", "HDFC Bank", "Infosys", "TCS", "ICICI Bank"],
  "Hybrid":       ["HDFC Bank", "Reliance", "Infosys", "ICICI Bank", "TCS"],
};

function computeSectorExposure(funds: Fund[]) {
  const totalValue = funds.reduce((s, f) => s + f.currentValue, 0);
  const sectorTotals: Record<string, number> = {};

  funds.forEach(f => {
    const map = SECTOR_MAP[f.category] || SECTOR_MAP["Other"];
    const weight = f.currentValue / totalValue;
    Object.entries(map).forEach(([sector, pct]) => {
      sectorTotals[sector] = (sectorTotals[sector] || 0) + (pct * weight);
    });
  });

  return Object.entries(sectorTotals)
    .map(([sector, pct]) => ({ sector, pct: Math.round(pct) }))
    .sort((a, b) => b.pct - a.pct);
}

function computeStockConcentration(funds: Fund[]) {
  const stockCount: Record<string, number> = {};
  funds.forEach(f => {
    const stocks = TOP_STOCKS[f.category] || [];
    stocks.slice(0, 3).forEach(s => {
      stockCount[s] = (stockCount[s] || 0) + 1;
    });
  });
  return Object.entries(stockCount)
    .filter(([, count]) => count >= 2)
    .map(([stock, count]) => ({ stock, fundCount: count }))
    .sort((a, b) => b.fundCount - a.fundCount);
}

export default function HiddenRiskDetector({ funds, overlapPercent }: Props) {
  const sectors = computeSectorExposure(funds);
  const topSector = sectors[0];
  const overexposed = sectors.filter(s => s.pct > 30 && s.sector !== "Debt");
  const concentrated = computeStockConcentration(funds);

  const risks: { icon: typeof Zap; title: string; detail: string; severity: "high" | "medium" | "low" }[] = [];

  if (topSector && topSector.pct > 35) {
    risks.push({
      icon: Building2,
      title: `${topSector.sector} overexposure: ${topSector.pct}%`,
      detail: `Over one-third of your portfolio is in ${topSector.sector}. A sector downturn could hit your portfolio hard. Recommended max: 25–30%.`,
      severity: topSector.pct > 45 ? "high" : "medium",
    });
  }

  if (overlapPercent > 40) {
    risks.push({
      icon: TrendingDown,
      title: `${overlapPercent}% portfolio overlap detected`,
      detail: `Your funds share many of the same stocks — you're paying fees for ${funds.length} funds but getting diversification of roughly ${Math.round(funds.length * (1 - overlapPercent / 100))}. Consider consolidating.`,
      severity: overlapPercent > 60 ? "high" : "medium",
    });
  }

  concentrated.slice(0, 2).forEach(({ stock, fundCount }) => {
    risks.push({
      icon: Zap,
      title: `${stock} appears in ${fundCount} of your funds`,
      detail: `Single-stock concentration risk — if ${stock} drops significantly, multiple funds in your portfolio get hit simultaneously.`,
      severity: "medium",
    });
  });

  const noDebt = !funds.some(f => f.category === "Debt" || f.category === "Hybrid");
  if (noDebt) {
    risks.push({
      icon: AlertOctagon,
      title: "Zero debt allocation",
      detail: "100% equity portfolio is highly volatile. At least 10–20% in debt funds or liquid funds acts as a cushion during market crashes.",
      severity: funds.length > 3 ? "high" : "medium",
    });
  }

  if (risks.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Hidden Risk Detector
        </h2>
        <div className="glass-card p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-success" />
          </div>
          <div>
            <div className="font-semibold text-foreground">No hidden risks detected</div>
            <div className="text-sm text-muted-foreground">Your portfolio looks well-structured across sectors and stocks.</div>
          </div>
        </div>
      </section>
    );
  }

  const severityColors = {
    high:   "bg-destructive/8 border-destructive/25",
    medium: "bg-warning/8 border-warning/25",
    low:    "bg-muted/40 border-border",
  };
  const badgeColors = {
    high:   "bg-destructive/10 text-destructive",
    medium: "bg-warning/10 text-warning",
    low:    "bg-muted text-muted-foreground",
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-2 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" /> Hidden Risk Detector
      </h2>
      <p className="text-sm text-muted-foreground mb-4">Risks that don't show up in standard fund analysis</p>

      {/* Sector heatmap */}
      <div className="glass-card p-4 mb-4">
        <div className="text-sm font-semibold text-foreground mb-3">Sector Exposure Heatmap</div>
        <div className="flex flex-wrap gap-2">
          {sectors.slice(0, 8).map(({ sector, pct }) => {
            const intensity = pct > 40 ? "bg-destructive/20 text-destructive border-destructive/30"
              : pct > 25 ? "bg-warning/20 text-warning border-warning/30"
              : "bg-muted/50 text-muted-foreground border-border";
            return (
              <motion.div key={sector} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${intensity}`}
                style={{ fontSize: `${Math.max(10, Math.min(14, 9 + pct / 5))}px` }}>
                {sector} {pct}%
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Risk items */}
      <div className="space-y-3">
        {risks.map((risk, i) => {
          const Icon = risk.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex gap-3 p-4 rounded-xl border ${severityColors[risk.severity]}`}>
              <Icon className="h-4 w-4 mt-0.5 shrink-0 text-foreground" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{risk.title}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeColors[risk.severity]}`}>
                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{risk.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
