import { motion } from "framer-motion";
import { Download, TrendingUp, Wallet, Layers, DollarSign, Lightbulb, RefreshCw, AlertTriangle, LogOut, X } from "lucide-react";
import type { PortfolioData, Fund } from "@/lib/demoData";
import type { UserProfile } from "@/components/OnboardingScreen";
import ScoreRing from "./dashboard/ScoreRing";
import MetricCard from "./dashboard/MetricCard";
import ActionRecommendations from "./dashboard/ActionRecommendations";
import BenchmarkComparison from "./dashboard/BenchmarkComparison";
import RiskRadar from "./dashboard/RiskRadar";
import RedFlagsSection from "./dashboard/RedFlagsSection";
import ScoreBreakdownSection from "./dashboard/ScoreBreakdownSection";
import ScenarioSimulator from "./dashboard/ScenarioSimulator";
import HiddenRiskDetector from "./dashboard/HiddenRiskDetector";
import FIREPathPlanner from "./dashboard/FIREPathPlanner";
import AIChat from "./AIChat";

interface Props {
  data:PortfolioData; userName?:string; userProfile?:UserProfile;
  uploadWarning?:boolean; onAnalyseAnother?:()=>void; onExit?:()=>void; onLogout?:()=>void;
}

const fmt=(n:number)=>"₹"+n.toLocaleString("en-IN");

const StatusBadge=({status}:{status:Fund["status"]})=>{
  const s={
    Outperforming:{bg:"rgba(34,197,94,0.15)",border:"rgba(34,197,94,0.3)",color:"#4ade80"},
    Underperforming:{bg:"rgba(239,68,68,0.15)",border:"rgba(239,68,68,0.3)",color:"#f87171"},
    Watch:{bg:"rgba(245,158,11,0.15)",border:"rgba(245,158,11,0.3)",color:"#fbbf24"},
  };
  const c=s[status];
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{background:c.bg,border:`1px solid ${c.border}`,color:c.color}}>{status}</span>;
};

const DIMS=[
  {key:"emergencyPreparedness",label:"Emergency Fund"},
  {key:"insuranceCoverage",label:"Insurance"},
  {key:"investmentDiversification",label:"Investments"},
  {key:"debtHealth",label:"Debt Health"},
  {key:"taxEfficiency",label:"Tax Efficiency"},
  {key:"retirementReadiness",label:"Retirement"},
];

const dimBarColor=(v:number)=>v>=75?"#22c55e":v>=50?"#f59e0b":"#ef4444";

export default function Dashboard({data,userName,userProfile,uploadWarning,onAnalyseAnother,onExit,onLogout}:Props) {
  const {funds,metrics,scoreBreakdown,insights,redFlags,recommendations,benchmarks,riskRadar}=data;

  const handleDownload=()=>{
    const L:string[]=[];
    L.push("MF PORTFOLIO X-RAY — FULL REPORT");
    L.push("Powered by Claude AI · ET Gen AI Hackathon 2026");
    L.push("=".repeat(52));
    if(userName)L.push(`Investor: ${userName}`);
    L.push(`Date: ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}`);
    L.push("");
    if(userProfile?.healthDimensions){
      const d=userProfile.healthDimensions;
      const overall=Math.round(Object.values(d).reduce((a,b)=>a+b,0)/6);
      L.push("MONEY HEALTH SCORE");L.push("-".repeat(30));L.push(`Overall: ${overall}/100`);
      DIMS.forEach(({key,label})=>L.push(`  ${label}: ${d[key as keyof typeof d]}/100`));L.push("");
    }
    L.push("PORTFOLIO SUMMARY");L.push("-".repeat(30));
    L.push(`Health Score: ${metrics.healthScore}/100`);L.push(`XIRR: ${metrics.xirr}%`);
    L.push(`Total Value: ${fmt(metrics.totalValue)}`);L.push(`Overlap: ${metrics.portfolioOverlap}%`);
    L.push(`Expense Drag: ${fmt(metrics.annualExpenseDrag)}/yr`);L.push("");
    L.push("YOUR FUNDS");L.push("-".repeat(30));
    funds.forEach(f=>{L.push(`${f.name} (${f.category})`);L.push(`  Invested:${fmt(f.amountInvested)}  Current:${fmt(f.currentValue)}  XIRR:${f.xirr}%  ${f.status}`);});
    L.push("");L.push("AI RECOMMENDATIONS");L.push("-".repeat(30));
    recommendations.forEach((r,i)=>{L.push(`${i+1}. ${r.action}`);L.push(`   Impact: ${r.impact}`);});
    L.push("");L.push("RED FLAGS");L.push("-".repeat(30));
    redFlags.forEach(f=>L.push(`[${f.severity.toUpperCase()}] ${f.message}`));
    const blob=new Blob([L.join("\n")],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;
    a.download=`portfolio-xray-${(userName||"report").toLowerCase().replace(/\s+/g,"-")}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();URL.revokeObjectURL(url);
  };

  const navStyle={background:"rgba(15,23,41,0.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)"};
  const btnStyle={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"};

  return(
    <div className="min-h-screen pb-28">
      {/* Nav */}
      <nav className="sticky top-0 z-40 px-6 py-3" style={navStyle}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-white"/>
            </div>
            <span className="font-bold text-white text-sm" style={{fontFamily:"'Space Grotesk',sans-serif"}}>MF Portfolio X-Ray</span>
          </div>
          <div className="flex items-center gap-2">
            {userName&&<span className="text-xs text-slate-400 hidden sm:block">{userName}</span>}
            {onExit&&(
              <button onClick={onExit} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-all" style={btnStyle}>
                <X className="h-3.5 w-3.5"/>Exit
              </button>
            )}
            {onLogout&&(
              <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-all" style={btnStyle}>
                <LogOut className="h-3.5 w-3.5"/>Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            {userName?`${userName}'s Portfolio X-Ray`:"Your Portfolio X-Ray"}
          </h1>
          <p className="text-slate-400 text-sm">AI-powered analysis · Powered by Claude · ET Gen AI Hackathon 2026</p>
        </motion.div>

        {/* Upload warning */}
        {uploadWarning&&(
          <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl text-sm" style={{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)"}}>
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400"/>
            <span className="text-amber-300">Couldn't fully read your PDF — showing demo data. Try a CAMS consolidated statement.</span>
          </div>
        )}

        {/* Money Health Score */}
        {userProfile?.healthDimensions&&(
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Your Money Health Score</h2>
            <p className="text-sm text-slate-400 mb-4">6-dimension financial wellness · personalised to {userName||"your"} profile</p>
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-5xl font-bold text-blue-400" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
                  {Math.round(Object.values(userProfile.healthDimensions).reduce((a,b)=>a+b,0)/6)}
                </div>
                <div>
                  <div className="font-semibold text-white">Overall Score</div>
                  <div className="text-xs text-slate-500">out of 100</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DIMS.map(({key,label})=>{
                  const v=userProfile.healthDimensions![key as keyof typeof userProfile.healthDimensions];
                  return(
                    <div key={key} className="p-3 rounded-xl" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      <div className="text-xl font-bold text-white mb-1.5" style={{fontFamily:"'Space Grotesk',sans-serif"}}>{v}<span className="text-xs font-normal text-slate-500">/100</span></div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.08)"}}>
                        <div className="h-full rounded-full transition-all" style={{width:`${v}%`,background:dimBarColor(v)}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Score Ring */}
        <div className="flex justify-center mb-8">
          <ScoreRing score={metrics.healthScore}/>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard icon={TrendingUp} label="XIRR" value={`${metrics.xirr}%`}/>
          <MetricCard icon={Wallet} label="Total Value" value={fmt(metrics.totalValue)}/>
          <MetricCard icon={Layers} label="Overlap" value={`${metrics.portfolioOverlap}%`}/>
          <MetricCard icon={DollarSign} label="Expense Drag" value={fmt(metrics.annualExpenseDrag)+"/yr"}/>
        </div>

        <ActionRecommendations recommendations={recommendations} currentScore={metrics.healthScore}/>
        <HiddenRiskDetector funds={funds} overlapPercent={metrics.portfolioOverlap}/>
        <RiskRadar data={riskRadar}/>
        <BenchmarkComparison benchmarks={benchmarks}/>

        {/* Funds table */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4" style={{fontFamily:"'Space Grotesk',sans-serif"}}>Your Funds</h2>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)"}}>
                    {["Fund Name","Category","Invested","Current","XIRR","Status"].map((h,i)=>(
                      <th key={h} className={`px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide ${i===0||i===1?"text-left":i===5?"text-center":"text-right"} ${i===1?"hidden md:table-cell":""} ${i===4?"hidden sm:table-cell":""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {funds.map((fund,i)=>(
                    <motion.tr key={fund.name} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
                      className="table-row-dark">
                      <td className="px-4 py-3.5 font-medium text-white">{fund.name}</td>
                      <td className="px-4 py-3.5 text-slate-400 hidden md:table-cell">{fund.category}</td>
                      <td className="px-4 py-3.5 text-right text-slate-300">{fmt(fund.amountInvested)}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-white">{fmt(fund.currentValue)}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-white hidden sm:table-cell">{fund.xirr}%</td>
                      <td className="px-4 py-3.5 text-center"><StatusBadge status={fund.status}/></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* AI Insights */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            <Lightbulb className="h-5 w-5 text-blue-400"/>AI Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {insights.map((insight,i)=>(
              <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="metric-card">
                <span className="text-2xl mb-3 block">{insight.icon}</span>
                <h3 className="font-semibold text-white mb-1 text-sm">{insight.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <RedFlagsSection redFlags={redFlags}/>
        <ScoreBreakdownSection scoreBreakdown={scoreBreakdown}/>
        <FIREPathPlanner userProfile={userProfile} currentPortfolioValue={metrics.totalValue}/>
        <ScenarioSimulator currentValue={metrics.totalValue} currentXirr={metrics.xirr}/>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 z-40" style={{background:"rgba(15,23,41,0.95)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={handleDownload} className="btn-primary" style={{width:"auto",padding:"12px 32px"}}>
            <Download className="h-4 w-4"/>Download Full Report
          </button>
          {onAnalyseAnother&&(
            <button onClick={onAnalyseAnother} className="btn-secondary" style={{width:"auto",padding:"12px 32px"}}>
              <RefreshCw className="h-4 w-4"/>Analyse Another File
            </button>
          )}
        </div>
      </div>

      <AIChat portfolioData={data} userName={userName}/>
    </div>
  );
}
