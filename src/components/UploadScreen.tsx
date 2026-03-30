import { useState, useCallback } from "react";
import { Upload, FileText, Sparkles, LogOut, User, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface Props { onUpload:(f:File)=>void; onDemo:()=>void; userName?:string; onLogout?:()=>void; }

export default function UploadScreen({onUpload,onDemo,userName,onLogout}:Props) {
  const [isDragging,setIsDragging]=useState(false);
  const handleDrop=useCallback((e:React.DragEvent)=>{
    e.preventDefault();setIsDragging(false);
    const f=e.dataTransfer.files[0];
    if(f&&(f.type==="application/pdf"||f.name.endsWith(".csv")))onUpload(f);
  },[onUpload]);

  return(
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{background:"rgba(15,23,41,0.8)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white"/>
            </div>
            <span className="font-bold text-white text-sm" style={{fontFamily:"'Space Grotesk',sans-serif"}}>MF Portfolio X-Ray</span>
          </div>
          <div className="flex items-center gap-3">
            {userName&&<div className="flex items-center gap-1.5 text-xs text-slate-400"><User className="h-3.5 w-3.5"/>{userName}</div>}
            {onLogout&&(
              <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"}}>
                <LogOut className="h-3.5 w-3.5"/>Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-20">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold text-blue-400" style={{background:"rgba(59,130,246,0.15)",border:"1px solid rgba(59,130,246,0.25)"}}>
            <Sparkles className="h-3.5 w-3.5"/>AI-Powered Portfolio Analysis
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            Know What Your Funds Are<br/>
            <span className="text-blue-400">Really Doing</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            {userName?`Welcome back, ${userName}! `:""}Upload your CAMS or KFintech statement. Get your X-Ray in 10 seconds.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e=>{e.preventDefault();setIsDragging(true);}}
            onDragLeave={()=>setIsDragging(false)}
            onDrop={handleDrop}
            onClick={()=>document.getElementById("file-input")?.click()}
            className="relative p-12 rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              border:`2px dashed ${isDragging?"rgba(96,165,250,0.8)":"rgba(255,255,255,0.15)"}`,
              background:isDragging?"rgba(59,130,246,0.1)":"rgba(255,255,255,0.03)",
              transform:isDragging?"scale(1.02)":"scale(1)"
            }}
          >
            <input id="file-input" type="file" accept=".pdf,.csv" className="hidden"
              onChange={e=>{const f=e.target.files?.[0];if(f)onUpload(f);}}/>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{background:"rgba(59,130,246,0.2)",border:"1px solid rgba(59,130,246,0.3)"}}>
                <Upload className="h-8 w-8 text-blue-400"/>
              </div>
              <div>
                <p className="font-semibold text-white">Drop your statement here</p>
                <p className="text-sm text-slate-500 mt-1">PDF or CSV from CAMS / KFintech</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FileText className="h-3.5 w-3.5"/>Supports consolidated account statements
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button onClick={onDemo}
              className="flex items-center gap-2 text-sm font-semibold text-green-400 px-6 py-3 rounded-xl transition-all"
              style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)"}}>
              <Sparkles className="h-4 w-4"/>Try Demo (No Upload Needed)
            </button>
            <p className="text-xs text-slate-600">🔒 Your file is never stored · Analysis runs in real time</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
