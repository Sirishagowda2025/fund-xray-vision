import { useState, useCallback } from "react";
import { Upload, FileText, Sparkles, LogOut, User, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface Props { onUpload:(f:File)=>void; onDemo:()=>void; userName?:string; onLogout?:()=>void; }

export default function UploadScreen({onUpload,onDemo,userName,onLogout}:Props) {
  const [isDragging,setIsDragging]=useState(false);

  const handleDrop=useCallback((e:React.DragEvent)=>{
    e.preventDefault(); setIsDragging(false);
    const file=e.dataTransfer.files[0];
    if(file&&(file.type==="application/pdf"||file.name.endsWith(".csv")))onUpload(file);
  },[onUpload]);

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white"/>
            </div>
            <span className="font-bold text-gray-900 text-sm" style={{fontFamily:"'Space Grotesk',sans-serif"}}>MF Portfolio X-Ray</span>
          </div>
          <div className="flex items-center gap-3">
            {userName&&<div className="flex items-center gap-1.5 text-xs text-gray-500"><User className="h-3.5 w-3.5"/>{userName}</div>}
            {onLogout&&(
              <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                <LogOut className="h-3.5 w-3.5"/>Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-16">
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-3.5 w-3.5"/>AI-Powered Portfolio Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4" style={{fontFamily:"'Space Grotesk',sans-serif"}}>
            Know What Your Funds Are{" "}
            <span className="text-blue-600">Really Doing</span>
          </h1>
          <p className="text-gray-500 text-lg mb-10">
            {userName?`Welcome back, ${userName}! `:""}Upload your CAMS or KFintech statement. Get your X-Ray in 10 seconds.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e=>{e.preventDefault();setIsDragging(true);}}
            onDragLeave={()=>setIsDragging(false)}
            onDrop={handleDrop}
            onClick={()=>document.getElementById("file-input")?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-200 ${isDragging?"border-blue-500 bg-blue-50 scale-[1.02]":"border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 bg-white"}`}
          >
            <input id="file-input" type="file" accept=".pdf,.csv" className="hidden"
              onChange={e=>{const f=e.target.files?.[0];if(f)onUpload(f);}}/>
            <div className="flex flex-col items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging?"bg-blue-100":"bg-blue-50"}`}>
                <Upload className="h-8 w-8 text-blue-600"/>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Drop your statement here</p>
                <p className="text-sm text-gray-400 mt-1">PDF or CSV from CAMS / KFintech</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FileText className="h-3.5 w-3.5"/>Supports consolidated account statements
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button onClick={onDemo}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 bg-white px-6 py-3 rounded-xl transition-all shadow-sm">
              <Sparkles className="h-4 w-4"/>Try Demo Instead
            </button>
            <p className="text-xs text-gray-400">🔒 Your file is never stored · Analysis runs in real time</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
