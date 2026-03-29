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
    return `Your health score is ${metrics.healthScore}/100. Biggest drag: ${lbl[worst[0]]} (${worst[1]}/100). ${redFlags[0]?.message||"See the Red Flags section for details."}`;
  }
  if(l.includes("risk")||l.includes("risky"))
    return `The riskiest holding is typically your small/mid-cap fund. Your ${metrics.portfolioOverlap}% overlap also concentrates risk — multiple funds hold the same stocks.`;
  if(l.includes("fee")||l.includes("expense")||l.includes("cost"))
    return `You're losing ₹${metrics.annualExpenseDrag.toLocaleString("en-IN")}/year to expense ratios. Switch to index funds (0.1% expense ratio) to cut this by up to 60%.`;
  if(l.includes("return")||l.includes("improve"))
    return `Key moves: (1) Exit funds with XIRR below 10%, (2) Reduce overlap, (3) Add mid/small cap for long-term growth. Current XIRR: ${metrics.xirr}%.`;
  if(l.includes("sip"))
    return `Even ₹2,000-5,000/month more SIP compounds dramatically over 10 years. Use the Scenario Simulator below to see exact projections.`;
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
      setMessages(p=>[...p,{role:"assistant",text:data.answer||"Sorry, I couldn't process that."}]);
    }catch{
      setMessages(p=>[...p,{role:"assistant",text:localAnswer(text,portfolioData)}]);
    }finally{setLoading(false);}
  };

  return(
    <>
      {/* Floating button — bottom-20 clears the sticky download bar */}
      <button onClick={()=>setOpen(true)}
        className="fixed bottom-20 right-5 z-50 h-14 w-14 rounded-full bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center hover:scale-105 hover:bg-blue-700 transition-all"
        aria-label="Open AI Chat">
        <MessageCircle className="h-6 w-6 text-white"/>
        <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"/>
      </button>

      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:20,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.95}} transition={{duration:0.2}}
            className="fixed bottom-20 right-5 z-50 w-[340px] sm:w-[380px] h-[500px] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-blue-50">
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot className="h-4.5 w-4.5 text-white"/>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">AI Portfolio Advisor</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"/>Online · Powered by Claude
                </div>
              </div>
              <button onClick={()=>setOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="h-4 w-4"/>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {messages.map((m,i)=>(
                <div key={i} className={`flex gap-2 ${m.role==="user"?"flex-row-reverse":""}`}>
                  <div className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${m.role==="assistant"?"bg-blue-100":"bg-gray-200"}`}>
                    {m.role==="assistant"?<Bot className="h-3 w-3 text-blue-600"/>:<User className="h-3 w-3 text-gray-600"/>}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role==="assistant"?"bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm":"bg-blue-600 text-white rounded-tr-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading&&(
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-blue-600"/>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400"/>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Quick questions */}
            {messages.length<=1&&(
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-gray-50/50">
                {QUICK_Q.map(q=>(
                  <button key={q} onClick={()=>send(q)}
                    className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
                placeholder="Ask about your portfolio…"
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-gray-400 transition-all"/>
              <button onClick={()=>send(input)} disabled={!input.trim()||loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl px-3 transition-all">
                <Send className="h-3.5 w-3.5"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
