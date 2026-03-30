import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Target, TrendingUp, Shield } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { UserProfile } from "@/components/OnboardingScreen";

interface Props {
  userProfile?: UserProfile;
  currentPortfolioValue: number;
}

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

const INCOME_MAP: Record<string, number> = {
  "Under ₹25,000": 20000, "₹25,000–50,000": 37500,
  "₹50,000–1,00,000": 75000, "₹1,00,000–2,00,000": 150000, "Above ₹2,00,000": 250000,
};
const EXPENSE_MAP: Record<string, number> = {
  "Under ₹15,000": 12000, "₹15,000–30,000": 22000,
  "₹30,000–60,000": 45000, "₹60,000–1,00,000": 80000, "Above ₹1,00,000": 125000,
};
const AGE_MAP: Record<string, number> = {
  "Under 25": 22, "25–35": 30, "35–45": 40, "45–55": 50, "55+": 58,
};

export default function FIREPathPlanner({ userProfile, currentPortfolioValue }: Props) {
  const income   = INCOME_MAP[userProfile?.monthlyIncome || ""] || 50000;
  const expenses = EXPENSE_MAP[userProfile?.monthlyExpenses || ""] || 30000;
  const age      = AGE_MAP[userProfile?.age || ""] || 28;
  const risk     = userProfile?.riskProfile || "moderate";

  const returnRate = risk === "aggressive" ? 14 : risk === "moderate" ? 12 : 9;
  const savings   = Math.max(0, income - expenses);

  const [retireAge,    setRetireAge]    = useState(Math.min(50, age + 15));
  const [monthlyNeeds, setMonthlyNeeds] = useState(Math.round(expenses * 0.8));
  const [sipTop,       setSipTop]       = useState(Math.round(savings * 0.6));

  const plan = useMemo(() => {
    const yearsToRetire = Math.max(1, retireAge - age);
    const months = yearsToRetire * 12;
    const monthlyRate = returnRate / 100 / 12;

    // How much corpus needed (25x annual expenses rule — standard FIRE rule)
    const corpusNeeded = monthlyNeeds * 12 * 25;

    // FV of current portfolio
    const fvCurrent = currentPortfolioValue * Math.pow(1 + monthlyRate, months);

    // FV of monthly SIP
    const fvSip = sipTop > 0
      ? sipTop * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : 0;

    const projectedCorpus = fvCurrent + fvSip;
    const gap = Math.max(0, corpusNeeded - projectedCorpus);

    // What SIP would close the gap
    const sipNeededToClose = gap > 0 && months > 0
      ? gap / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
      : 0;

    const onTrack = projectedCorpus >= corpusNeeded;

    // Allocation based on risk + years to retire
    const alloc = yearsToRetire > 10
      ? { equity: risk === "aggressive" ? 80 : risk === "moderate" ? 70 : 55, debt: risk === "aggressive" ? 15 : 22, gold: 5, international: risk === "aggressive" ? 0 : 8 }
      : { equity: 50, debt: 40, gold: 5, international: 5 };

    // Emergency fund target (6 months expenses)
    const emergencyTarget = expenses * 6;

    // Tax saving target
    const taxSaving = Math.min(150000 / 12, savings * 0.3);

    return { corpusNeeded, projectedCorpus, gap, sipNeededToClose, onTrack, alloc, yearsToRetire, emergencyTarget, taxSaving };
  }, [retireAge, monthlyNeeds, sipTop, age, returnRate, currentPortfolioValue, expenses, savings, risk]);

  const steps = [
    { icon: Shield, label: "Emergency Fund",   target: fmt(plan.emergencyTarget), action: `Keep ${fmt(plan.emergencyTarget)} in a liquid fund or high-yield savings`, done: plan.emergencyTarget < currentPortfolioValue * 0.1 },
    { icon: Shield, label: "Term Insurance",   target: "15–20x annual income",    action: `Get ₹${Math.round(income * 180 / 100000)}L term cover — costs ~₹${Math.round(income * 180 / 100000 * 4)} /month`, done: false },
    { icon: TrendingUp, label: "ELSS (80C)",   target: fmt(plan.taxSaving) + "/mo", action: `Invest ₹1.5L/year in ELSS to max 80C deduction — saves ₹${Math.round(150000 * 0.3).toLocaleString("en-IN")} in taxes`, done: false },
    { icon: Flame, label: "Core SIP",          target: fmt(sipTop) + "/mo",         action: `Split as Nifty 50 index (40%) + Flexi Cap (30%) + Mid Cap (${risk === "aggressive" ? "30%" : "20%"}) + Debt (${risk === "aggressive" ? "0%" : "10%"})`, done: false },
    { icon: Target, label: "FIRE Corpus",      target: fmt(plan.corpusNeeded),       action: plan.onTrack ? `You're on track! Keep your current plan.` : `Increase SIP by ${fmt(Math.round(plan.sipNeededToClose))} to close the gap`, done: plan.onTrack },
  ];

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold font-display text-foreground mb-2 flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" /> FIRE Path Planner
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Financial Independence, Retire Early — your personalised roadmap
      </p>

      <div className="glass-card p-5 mb-4">
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Retire at age</span>
              <span className="font-bold text-primary">{retireAge}</span>
            </div>
            <Slider value={[retireAge]} onValueChange={([v]) => setRetireAge(v)} min={age + 5} max={65} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>In {plan.yearsToRetire}y</span><span>Age 65</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Monthly needs in retirement</span>
              <span className="font-bold text-primary">{fmt(monthlyNeeds)}</span>
            </div>
            <Slider value={[monthlyNeeds]} onValueChange={([v]) => setMonthlyNeeds(v)} min={10000} max={300000} step={5000} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Monthly SIP I can manage</span>
              <span className="font-bold text-primary">{fmt(sipTop)}</span>
            </div>
            <Slider value={[sipTop]} onValueChange={([v]) => setSipTop(v)} min={500} max={Math.round(savings)} step={500} />
          </div>
        </div>

        {/* FIRE target vs projection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Corpus needed",    value: fmt(plan.corpusNeeded),     sub: "25x rule" },
            { label: "Projected corpus", value: fmt(plan.projectedCorpus),  sub: `${returnRate}% returns` },
            { label: plan.onTrack ? "Surplus" : "Shortfall", value: fmt(Math.abs(plan.corpusNeeded - plan.projectedCorpus)), sub: plan.onTrack ? "Great!" : "Needs more SIP" },
            { label: "Extra SIP needed", value: plan.onTrack ? "₹0" : fmt(plan.sipNeededToClose), sub: "to close gap" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="text-center p-3 bg-muted/30 rounded-xl">
              <div className="text-xs text-muted-foreground mb-1">{label}</div>
              <div className="font-bold text-foreground text-sm">{value}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          ))}
        </div>

        {/* On-track banner */}
        <div className={`rounded-xl p-3 text-sm font-medium text-center ${
          plan.onTrack ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        }`}>
          {plan.onTrack
            ? `✅ You're on track to retire at ${retireAge} with ${fmt(plan.projectedCorpus)} corpus!`
            : `⚠️ Increase monthly SIP by ${fmt(Math.round(plan.sipNeededToClose))} to retire at ${retireAge}`}
        </div>
      </div>

      {/* Ideal allocation */}
      <div className="glass-card p-4 mb-4">
        <div className="text-sm font-semibold text-foreground mb-3">Ideal Allocation for Your Profile</div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(plan.alloc).filter(([,v]) => v > 0).map(([type, pct]) => {
            const colors: Record<string, string> = {
              equity: "bg-primary/20 text-primary border-primary/30",
              debt: "bg-blue-500/20 text-blue-600 border-blue-500/30",
              gold: "bg-amber-500/20 text-amber-600 border-amber-500/30",
              international: "bg-purple-500/20 text-purple-600 border-purple-500/30",
            };
            return (
              <div key={type} className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${colors[type] || "bg-muted"}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}: {pct}%
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-step roadmap */}
      <div className="glass-card p-4">
        <div className="text-sm font-semibold text-foreground mb-3">Your Month-by-Month Roadmap</div>
        <div className="space-y-3">
          {steps.map(({ icon: Icon, label, target, action, done }, i) => (
            <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex gap-3 p-3 rounded-xl border ${done ? "border-success/30 bg-success/5" : "border-border bg-muted/20"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-success/10" : "bg-primary/10"}`}>
                {done ? <span className="text-success text-sm">✓</span> : <Icon className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">Step {i+1}: {label}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{target}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{action}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
