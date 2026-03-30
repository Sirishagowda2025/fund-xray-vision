import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import type { PortfolioData } from "@/lib/demoData";

interface Message { role:"user"|"assistant"; text:string; }
interface Props { portfolioData:PortfolioData; userName?:string; }

const QUICK_Q=["Why is my score low?","Which fund is riskiest?","How do I improve returns?","Am I paying too much in fees?","Should I add more SIP?"];
const API_URL=import.meta.env.VITE_API_URL||"http://localhost:3001";

function localAnswer(q:string,d:PortfolioData):string {
  const l=q.toLowerCase();
  const {metrics,funds,redFlags,scoreBreakdown}=d;
  if(l.includes("score")||l.includes("low")||l.includes("why")){
    const worst=Object.entries(scoreBreakdown).sort((a,b)=>a[1]-b[1])[0];
    const lbl:Record<string,string>={performance:"performance",diversification:"diversification",costEfficiency:"cost efficiency",riskAlignment:"risk alignment"};
    return `Your health score is ${metrics.healthScore}/100. Biggest drag: ${lbl[worst[0]]} score (${worst[1]}/100). ${redFlags[0]?.message||"Review the Red Flags section below."}`;
  }
  if(l.includes("risk")||l.includes("risky")) return `The riskiest holding is your small/mid-cap fund. Your ${metrics.portfolioOverlap}% fund overlap also concentrates risk — multiple funds hold the same stocks.`;
  if(l.includes("fee")||l.includes("expense")) return `You're losing ₹${metrics.annualExpenseDrag.toLocaleString("en-IN")}/year to expense ratios. Switch to index funds (0.1% expense ratio) to cut this by up to 60%.`;
  if(l.includes("return")||l.includes("improve")) return `Key moves: (1) Exit funds with XIRR below 10%, (2) Reduce overlap, (3) Add mid/small cap. Your current XIRR is ${metrics.xirr}%.`;
  if(l.includes("sip")) return `Even ₹2,000-5,000/month more SIP compounds dramatically over 10 years. Use the Scenario Simulator below to see exact projections.`;
  return `Your portfolio: XIRR ${metrics.xirr}%, health score ${metrics.healthScore}/100. Biggest opportunity: reduce ${metrics.portfolioOverlap}% fund overlap. Check Action Recommendations above.`;
}

export default function AIChat({portfolioData,userName}:Props) {
  const [open,setOpen]=useState(false);
  const [messages,setMessages]=useState<Message[]>([{role:"assistant",text:`Hi ${userName||"there"}! 👋 I'm your AI financial advisor. Ask me anything about your portfolio.`}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,open]);

  const send=async(text:string)=>{
    if(!text.trim()||loading)return;
    setMessages(p=>[...p,{role:"user",text}]);
    setInput(""); setLoading(true);
    try{
      const res=await fetch(`${API_URL}/api/analyze/chat`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({question:text,portfolioContext:{funds:portfolioData.funds,metrics:portfolioData.metrics,scoreBreakdown:portfolioData.scoreBreakdown,redFlags:portfolioData.redFlags,userName},history:messages.slice(-6)}),
      });
      const data=await res.json();
      setMessages(p=>[...p,{role:"assistant",text:data.answer||"Sorry, couldn't process that."}]);
    }catch{
      setMessages(p=>[...p,{role:"assistant",text:localAnswer(text,portfolioData)}]);
    }finally{setLoading(false);}
  };

  const panelStyle={
    background:"rgba(15,23,41,0.97)",
    backdropFilter:"blur(20px)",
    border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:20,
    boxShadow:"0 20px 60px rgba(0,0,0,0.6)",
  };

  return(
    <>
      <button onClick={()=>setOpen(true)}
        className="fixed bottom-20 right-5 z-50 h-14 w-14 rounded-full flex items-center justify-center hover:scale-105 transition-all"
        style={{background:"linear-gradient(135deg,#2563eb,#1d4ed8)",boxShadow:"0 4px 20px rgba(37,99,235,0.5)"}}>
        <MessageCircle className="h-6 w-6 text-white"/>
        <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2" style={{borderColor:"#0f1729"}}/>
      </button>

      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:20,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.95}} transition={{duration:0.2}}
            className="fixed bottom-20 right-5 z-50 w-[340px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden" style={panelStyle}>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5" style={{borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(37,99,235,0.1)"}}>
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white"/>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-white">AI Portfolio Advisor</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"/>Online · Powered by Claude
                </div>
              </div>
              <button onClick={()=>setOpen(false)} className="text-slate-500 hover:text-slate-200 transition-colors"><X className="h-4 w-4"/></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m,i)=>(
                <div key={i} className={`flex gap-2 ${m.role==="user"?"flex-row-reverse":""}`}>
                  <div className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{background:m.role==="assistant"?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.1)"}}>
                    {m.role==="assistant"?<Bot className="h-3 w-3 text-blue-400"/>:<User className="h-3 w-3 text-slate-400"/>}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role==="assistant"?"rounded-tl-sm":"rounded-tr-sm"}`}
                    style={m.role==="assistant"?{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",color:"#e2e8f0"}:{background:"#2563eb",color:"white"}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading&&(
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{background:"rgba(59,130,246,0.2)"}}>
                    <Bot className="h-3 w-3 text-blue-400"/>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-500"/>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Quick questions */}
            {messages.length<=1&&(
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {QUICK_Q.map(q=>(
                  <button key={q} onClick={()=>send(q)}
                    className="text-xs px-2.5 py-1 rounded-full transition-all text-slate-400 hover:text-blue-300"
                    style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 flex gap-2" style={{borderTop:"1px solid rgba(255,255,255,0.07)"}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
                placeholder="Ask about your portfolio…" className="dark-input" style={{borderRadius:12,fontSize:13}}/>
              <button onClick={()=>send(input)} disabled={!input.trim()||loading}
                className="px-3 rounded-xl text-white transition-all disabled:opacity-40"
                style={{background:"#2563eb",minWidth:40}}>
                <Send className="h-3.5 w-3.5"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
