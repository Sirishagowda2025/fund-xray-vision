import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, TrendingUp } from "lucide-react";

const steps=["Reading your statement…","Calculating your returns…","Generating AI insights…"];

export default function LoadingScreen({onComplete}:{onComplete:()=>void}) {
  const [cur,setCur]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setCur(1),3000);
    const t2=setTimeout(()=>setCur(2),6000);
    const t3=setTimeout(()=>onComplete(),9500);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[onComplete]);

  return(
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center max-w-sm w-full px-6">
        <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:2,ease:"linear"}}
          className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-blue-600 flex items-center justify-center"
          style={{boxShadow:"0 0 40px rgba(37,99,235,0.5)"}}>
          <TrendingUp className="h-8 w-8 text-white"/>
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Analysing Your Portfolio</h2>
        <p className="text-slate-400 text-sm mb-10">This usually takes 8–12 seconds</p>
        <div className="solid-card p-6 space-y-4 text-left">
          {steps.map((step,i)=>(
            <motion.div key={step} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.15}}
              className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                  {i<cur?(
                    <motion.div key="done" initial={{scale:0}} animate={{scale:1}} className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white"/>
                    </motion.div>
                  ):i===cur?(
                    <motion.div key="loading" className="h-8 w-8 rounded-full flex items-center justify-center" style={{background:"rgba(59,130,246,0.2)"}}>
                      <Loader2 className="h-4 w-4 text-blue-400 animate-spin"/>
                    </motion.div>
                  ):(
                    <div className="h-8 w-8 rounded-full" style={{background:"rgba(255,255,255,0.06)"}}/>
                  )}
                </AnimatePresence>
              </div>
              <span className={`text-sm font-medium ${i<=cur?"text-white":"text-slate-500"}`}>{step}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
