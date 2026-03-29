import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, TrendingUp } from "lucide-react";

const steps = [
  "Reading your statement…",
  "Calculating your returns…",
  "Generating AI insights…",
];

interface Props { onComplete: () => void; }

export default function LoadingScreen({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(1), 3000);
    const t2 = setTimeout(() => setCurrentStep(2), 6000);
    const t3 = setTimeout(() => onComplete(), 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-sm w-full px-6">
        {/* Animated logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200"
        >
          <TrendingUp className="h-8 w-8 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
          Analysing Your Portfolio
        </h2>
        <p className="text-gray-500 text-sm mb-10">This usually takes 8–12 seconds</p>

        <div className="space-y-4 text-left bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
          {steps.map((step, i) => (
            <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {i < currentStep ? (
                    <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  ) : i === currentStep ? (
                    <motion.div key="loading" className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    </motion.div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-100" />
                  )}
                </AnimatePresence>
              </div>
              <span className={`text-sm font-medium ${i <= currentStep ? "text-gray-900" : "text-gray-400"}`}>{step}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
