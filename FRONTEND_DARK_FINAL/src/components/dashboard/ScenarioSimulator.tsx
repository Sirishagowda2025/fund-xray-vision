import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  currentValue: number;
  currentXirr: number;
}

const formatCurrency = (n: number) => "₹" + n.toLocaleString("en-IN");

const ScenarioSimulator = ({ currentValue, currentXirr }: Props) => {
  const [sipAmount, setSipAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(currentXirr);

  const projection = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    // FV of current portfolio
    const fvCurrent = currentValue * Math.pow(1 + monthlyRate, months);
    // FV of SIP
    const fvSip = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalValue = fvCurrent + fvSip;
    const totalInvested = currentValue + sipAmount * months;
    const wealthGain = totalValue - totalInvested;
    return { totalValue, totalInvested, wealthGain };
  }, [sipAmount, years, expectedReturn, currentValue]);

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" /> Scenario Simulator
      </h2>
      <div className="glass-card p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monthly SIP</span>
                <span className="font-semibold text-foreground">{formatCurrency(sipAmount)}</span>
              </div>
              <Slider
                value={[sipAmount]}
                onValueChange={([v]) => setSipAmount(v)}
                min={1000}
                max={100000}
                step={1000}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Time Horizon</span>
                <span className="font-semibold text-foreground">{years} years</span>
              </div>
              <Slider
                value={[years]}
                onValueChange={([v]) => setYears(v)}
                min={1}
                max={30}
                step={1}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Expected Return</span>
                <span className="font-semibold text-foreground">{expectedReturn}%</span>
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={([v]) => setExpectedReturn(v)}
                min={6}
                max={25}
                step={0.5}
              />
            </div>
          </div>
          <motion.div
            key={`${sipAmount}-${years}-${expectedReturn}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col justify-center gap-4"
          >
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground">Projected Value</p>
              <p className="text-3xl font-bold font-display text-primary">
                {formatCurrency(Math.round(projection.totalValue))}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Total Invested</p>
                <p className="text-sm font-bold text-foreground">{formatCurrency(Math.round(projection.totalInvested))}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/5">
                <p className="text-xs text-muted-foreground">Wealth Gain</p>
                <p className="text-sm font-bold text-success">{formatCurrency(Math.round(projection.wealthGain))}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScenarioSimulator;
