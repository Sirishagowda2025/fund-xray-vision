import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Shield, TrendingUp, CreditCard, Receipt, Landmark, PiggyBank, LogOut, Sparkles } from "lucide-react";

export interface UserProfile {
  name: string; age: string; monthlyIncome: string; monthlyExpenses: string;
  hasEmergencyFund: string; emergencyFundMonths: string; hasInsurance: string;
  hasLoans: string; loanEMI: string; investmentGoal: string;
  riskProfile: "conservative" | "moderate" | "aggressive"; investmentHorizon: string;
  healthDimensions: {
    emergencyPreparedness: number; insuranceCoverage: number; investmentDiversification: number;
    debtHealth: number; taxEfficiency: number; retirementReadiness: number;
  };
}

interface Props { onComplete: (p: UserProfile) => void; userName?: string; onLogout?: () => void; }

function computeDimensions(p: Partial<UserProfile>) {
  const iMap: Record<string,number> = {"Under ₹25,000":20000,"₹25,000–50,000":37500,"₹50,000–1,00,000":75000,"₹1,00,000–2,00,000":150000,"Above ₹2,00,000":250000};
  const eMap: Record<string,number> = {"Under ₹15,000":12000,"₹15,000–30,000":22000,"₹30,000–60,000":45000,"₹60,000–1,00,000":80000,"Above ₹1,00,000":125000};
  const emMap: Record<string,number>= {"Under ₹5,000":3000,"₹5,000–15,000":10000,"₹15,000–30,000":22000,"₹30,000–50,000":40000,"Above ₹50,000":60000};
  const income=iMap[p.monthlyIncome||""]||50000, expenses=eMap[p.monthlyExpenses||""]||30000;
  const emi=p.hasLoans==="No"?0:(emMap[p.loanEMI||""]||5000);
  const sr=Math.max(0,(income-expenses)/income), er=income>0?emi/income:0;
  return {
    emergencyPreparedness: p.hasEmergencyFund==="Yes"?(p.emergencyFundMonths==="6+ months"?95:p.emergencyFundMonths==="3–6 months"?72:p.emergencyFundMonths==="1–3 months"?45:20):p.hasEmergencyFund==="Building one"?30:10,
    insuranceCoverage: p.hasInsurance==="Health + Life"?92:p.hasInsurance==="Health only"?58:p.hasInsurance==="Life only"?38:8,
    investmentDiversification: Math.min(92,Math.round(sr*180+20)),
    debtHealth: er===0?95:er<0.2?78:er<0.35?52:er<0.5?30:12,
    taxEfficiency: p.investmentGoal==="Tax saving"?85:p.investmentGoal==="Retirement planning"?72:55,
    retirementReadiness: p.investmentHorizon==="More than 10 years"?82:p.investmentHorizon==="5–10 years"?62:p.investmentHorizon==="3–5 years"?38:18,
  };
}

const DIMS=[
  {key:"emergencyPreparedness",label:"Emergency Fund",Icon:Shield},
  {key:"insuranceCoverage",label:"Insurance",Icon:Shield},
  {key:"investmentDiversification",label:"Investments",Icon:TrendingUp},
  {key:"debtHealth",label:"Debt Health",Icon:CreditCard},
  {key:"taxEfficiency",label:"Tax Efficiency",Icon:Receipt},
  {key:"retirementReadiness",label:"Retirement",Icon:Landmark},
];

export default function OnboardingScreen({onComplete, userName, onLogout}: Props) {
  const [step,setStep]=useState(0);
  const [showScore,setShowScore]=useState(false);
  const [p,setP]=useState<Partial<UserProfile>>({riskProfile:"moderate", name:userName||""});

  type Q={q:string;sub:string;field:keyof UserProfile;type:"text"|"select"|"risk";opts?:string[]|{v:string;label:string;desc:string}[];skip?:()=>boolean};
  const Qs:Q[]=[
    {q:"What should we call you?",sub:"We'll personalise your report",field:"name",type:"text"},
    {q:"How old are you?",sub:"Age shapes your ideal asset allocation",field:"age",type:"select",opts:["Under 25","25–35","35–45","45–55","55+"]},
    {q:"Monthly take-home income?",sub:"Approximate ₹ amount",field:"monthlyIncome",type:"select",opts:["Under ₹25,000","₹25,000–50,000","₹50,000–1,00,000","₹1,00,000–2,00,000","Above ₹2,00,000"]},
    {q:"Monthly expenses?",sub:"Rent + food + bills — roughly",field:"monthlyExpenses",type:"select",opts:["Under ₹15,000","₹15,000–30,000","₹30,000–60,000","₹60,000–1,00,000","Above ₹1,00,000"]},
    {q:"Do you have an emergency fund?",sub:"Money set aside for unexpected situations",field:"hasEmergencyFund",type:"select",opts:["Yes","No","Building one"]},
    {q:"How many months does it cover?",sub:"6 months is the recommended minimum",field:"emergencyFundMonths",type:"select",opts:["Less than 1 month","1–3 months","3–6 months","6+ months"],skip:()=>p.hasEmergencyFund==="No"},
    {q:"What insurance do you have?",sub:"Health + term life is the essential combo",field:"hasInsurance",type:"select",opts:["Health + Life","Health only","Life only","None"]},
    {q:"Do you have any loans or EMIs?",sub:"Home, car, personal loan, credit card",field:"hasLoans",type:"select",opts:["Yes","No"]},
    {q:"Total monthly EMI amount?",sub:"All EMIs combined — ideally under 40% of income",field:"loanEMI",type:"select",opts:["Under ₹5,000","₹5,000–15,000","₹15,000–30,000","₹30,000–50,000","Above ₹50,000"],skip:()=>p.hasLoans==="No"},
    {q:"Primary financial goal?",sub:"We'll tailor your recommendations to this",field:"investmentGoal",type:"select",opts:["Wealth creation","Retirement planning","Child's education","Home purchase","Tax saving","Emergency corpus"]},
    {q:"Your risk appetite?",sub:"How comfortable are you with market swings?",field:"riskProfile",type:"risk",opts:[
      {v:"conservative",label:"Conservative",desc:"Stability first — FD-like returns are fine"},
      {v:"moderate",label:"Moderate",desc:"Some volatility is okay for better returns"},
      {v:"aggressive",label:"Aggressive",desc:"Maximum growth — I can handle big swings"},
    ]},
    {q:"Investment horizon?",sub:"Longer = more time for compounding to work",field:"investmentHorizon",type:"select",opts:["Less than 3 years","3–5 years","5–10 years","More than 10 years"]},
  ];

  const visible=Qs.filter(q=>!q.skip||!q.skip());
  const cur=visible[step];
  const isLast=step===visible.length-1;
  const val=p[cur?.field];
  const canGo=!!val&&val!=="";
  const pct=Math.round(((step+1)/visible.length)*100);

  const next=()=>{if(isLast)setShowScore(true);else setStep(s=>s+1);};
  const finish=()=>{
    const dims=computeDimensions(p);
    onComplete({...(p as UserProfile),name:p.name||userName||"Investor",healthDimensions:dims});
  };

  if(showScore){
    const dims=computeDimensions(p);
    const overall=Math.round(Object.values(dims).reduce((a,b)=>a+b,0)/6);
    const col=overall>=75?"#16a34a":overall>=50?"#d97706":"#dc2626";
    const barC=(v:number)=>v>=75?"bg-green-500":v>=50?"bg-amber-500":"bg-red-500";
    return(
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <PiggyBank className="h-3.5 w-3.5"/>Your Money Health Score
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
                {p.name||userName}, here's your financial health
              </h2>
              <p className="text-gray-500 text-sm">Across 6 dimensions — personalised to your profile</p>
            </div>
            <div className="text-center mb-6">
              <div className="text-7xl font-bold mb-1" style={{color:col,fontFamily:"'Space Grotesk',sans-serif"}}>{overall}</div>
              <div className="text-gray-400 text-sm">out of 100</div>
            </div>
            <div className="space-y-3 mb-6">
              {DIMS.map(({key,label,Icon})=>{
                const v=dims[key as keyof typeof dims];
                return(
                  <div key={key} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-gray-400 shrink-0"/>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{label}</span>
                        <span className="text-gray-400">{v}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{width:0}} animate={{width:`${v}%`}} transition={{duration:0.7,delay:0.1}}
                          className={`h-full rounded-full ${barC(v)}`}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={finish}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-blue-100">
              <Sparkles className="h-4 w-4"/>Now Analyse My Portfolio →
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">Upload CAMS statement or try with demo data</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return(
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {onLogout&&(
        <button onClick={onLogout} className="fixed top-4 right-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors z-50 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <LogOut className="h-3.5 w-3.5"/>Logout
        </button>
      )}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:0.22}} className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-medium text-blue-600">5-min Money Health Check</span>
                <span>{step+1} / {visible.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-blue-600 rounded-full" animate={{width:`${pct}%`}} transition={{duration:0.35}}/>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{cur.q}</h2>
            <p className="text-sm text-gray-500 mb-6">{cur.sub}</p>

            <div className="mb-6">
              {cur.type==="text"&&(
                <input autoFocus type="text" placeholder="Type here…"
                  value={(p[cur.field] as string)||""}
                  onChange={e=>setP(prev=>({...prev,[cur.field]:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&canGo&&next()}
                  className="w-full text-xl text-center border-b-2 border-gray-200 focus:border-blue-500 bg-transparent py-3 outline-none transition-colors placeholder-gray-300"/>
              )}
              {cur.type==="select"&&(
                <div className="grid gap-2">
                  {(cur.opts as string[]).map(opt=>(
                    <button key={opt} onClick={()=>setP(prev=>({...prev,[cur.field]:opt}))}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${p[cur.field]===opt?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {cur.type==="risk"&&(
                <div className="grid gap-2">
                  {(cur.opts as {v:string;label:string;desc:string}[]).map(opt=>(
                    <button key={opt.v} onClick={()=>setP(prev=>({...prev,riskProfile:opt.v as UserProfile["riskProfile"]}))}
                      className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${p.riskProfile===opt.v?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-blue-300"}`}>
                      <div className={`font-semibold text-sm mb-0.5 ${p.riskProfile===opt.v?"text-blue-700":"text-gray-800"}`}>{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={next} disabled={!canGo}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-all">
              {isLast?"See My Money Health Score":"Continue"}<ChevronRight className="h-4 w-4"/>
            </button>
            {step>0&&(
              <button onClick={()=>setStep(s=>s-1)} className="mt-3 w-full text-sm text-gray-400 hover:text-gray-700 text-center transition-colors">← Back</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
