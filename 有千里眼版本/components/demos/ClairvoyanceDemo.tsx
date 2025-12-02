
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Aperture, Target, ChevronRight, BrainCircuit, Activity, Eye, Disc } from 'lucide-react';

const VideoFeedPlaceholder: React.FC = () => (
  <div className="w-full h-full bg-slate-800 relative overflow-hidden rounded-2xl border border-slate-700 shadow-inner group">
    {/* Grid Overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    
    {/* Simulated Video Content (Placeholder for User's Image 2) */}
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-slate-600 font-mono text-sm flex flex-col items-center">
            <Eye size={48} className="mb-4 opacity-50 animate-pulse" />
            <span>LIVE FEED SIGNAL</span>
            <span className="text-xs opacity-50 mt-1">Waiting for video source input...</span>
        </div>
    </div>

    {/* Bounding Box Simulation */}
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-cyan-400/80 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.2)]"
    >
        {/* Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
        
        {/* Label */}
        <div className="absolute -top-6 left-0 bg-cyan-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1">
            <Scan size={10} />
            <span>CUSTOMER DETECTED</span>
        </div>

        {/* Tracking Points */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
    </motion.div>

    {/* HUD Elements */}
    <div className="absolute top-4 left-4 text-cyan-500 font-mono text-xs flex flex-col gap-1">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> REC 00:04:23</div>
        <div className="opacity-70">ISO 800 | F/2.8</div>
    </div>
  </div>
);

interface AnalysisLog {
  id: number;
  time: string;
  type: 'info' | 'success' | 'alert';
  text: string;
  detail?: string;
}

const ClairvoyanceDemo: React.FC<{ onComplete?: () => void; timeline?: any }> = ({ onComplete, timeline: propTimeline }) => {
  const [logs, setLogs] = useState<AnalysisLog[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  
  const timeline = propTimeline || {
    scanStart: 1000,
    detectObject: 3000,
    analyzeFeature: 5000,
    generatePitch: 7000,
    finish: 15000
  };

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    const addLog = (text: string, type: 'info' | 'success' | 'alert' = 'info', detail?: string) => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      setLogs(prev => [{ id: Date.now(), time: timeStr, type, text, detail }, ...prev].slice(0, 5));
    };

    const sequence = [
      { t: timeline.scanStart, action: () => addLog('Initializing Vision System...', 'info') },
      { t: timeline.detectObject, action: () => addLog('Target Detected: Adult Female, Age 25-30', 'success') },
      { t: timeline.analyzeFeature, action: () => {
          addLog('Visual Analysis Complete', 'info', 'Focus: Eye Area. Detected: Fine lines, dehydration signals.');
          setIsScanning(false);
      }},
      { t: timeline.generatePitch, action: () => addLog('AI Recommendation Generated', 'alert', 'Suggest: Advanced Repair Eye Cream (SKU: #8821). Pitch: "Contains Pro-Xylane for deep hydration."') },
      { t: timeline.finish, action: () => onComplete && onComplete() }
    ];

    sequence.forEach(step => timeouts.push(setTimeout(step.action, step.t)));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full w-full bg-slate-950 relative overflow-hidden flex flex-col font-sans p-6 lg:p-10 text-white">
      {/* --- HEADER SECTION --- */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-6">
             {/* Project Logo / Icon */}
             <div className="w-16 h-16 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                 <Scan size={32} className="text-cyan-400 relative z-10" />
                 {/* Rotating Ring (CSS) */}
                 <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full scale-150 border-dashed animate-[spin_10s_linear_infinite]"></div>
             </div>
             
             <div>
                 <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    千里眼 <span className="text-lg font-normal not-italic text-slate-400 ml-2 tracking-widest font-mono">PROJECT CLAIRVOYANCE</span>
                 </h1>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-emerald-400 font-mono tracking-wide">SYSTEM ONLINE • V4.2.0</span>
                 </div>
             </div>
          </div>

          {/* Rotating Video Placeholder (Top Right) */}
          <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer Rotating Ring */}
              <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                 className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 border-l-transparent"
              ></motion.div>
              {/* Inner Counter-Rotating Ring */}
              <motion.div 
                 animate={{ rotate: -360 }} 
                 transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                 className="absolute inset-2 rounded-full border border-dashed border-purple-500/50"
              ></motion.div>
              {/* Center Icon */}
              <Aperture size={32} className="text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <div className="absolute -bottom-6 text-[10px] font-mono text-cyan-500/70">RADAR ACTIVE</div>
          </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
          
          {/* LEFT: Video Feed (2/3 width) */}
          <div className="col-span-8 flex flex-col relative">
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Target size={16} className="text-red-400" /> REAL-TIME FEED
                  </h3>
                  <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400 font-mono">CAM_01</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400 font-mono">1080P</span>
                  </div>
              </div>
              <div className="flex-1 relative">
                  <VideoFeedPlaceholder />
              </div>
          </div>

          {/* RIGHT: AI Analysis Panel (1/3 width) */}
          <div className="col-span-4 flex flex-col">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl h-full flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/10 bg-slate-800/50 backdrop-blur flex justify-between items-center">
                      <h3 className="font-bold text-cyan-400 flex items-center gap-2">
                          <BrainCircuit size={18} /> AI COGNITION
                      </h3>
                      <Activity size={16} className="text-emerald-500 animate-pulse" />
                  </div>

                  {/* Log Stream */}
                  <div className="flex-1 p-4 space-y-3 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80 z-10 pointer-events-none"></div>
                      <AnimatePresence initial={false}>
                          {logs.map((log) => (
                              <motion.div 
                                key={log.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-l-2 border-slate-700 pl-3 py-1 relative"
                              >
                                  <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${log.type === 'alert' ? 'bg-purple-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                  <div className="text-[10px] font-mono text-slate-500 mb-0.5">{log.time}</div>
                                  <div className="text-sm font-bold text-slate-200">{log.text}</div>
                                  {log.detail && (
                                      <div className="mt-1 text-xs text-cyan-400/80 bg-cyan-950/30 p-2 rounded border border-cyan-900/50 font-mono leading-relaxed">
                                          {log.detail}
                                      </div>
                                  )}
                              </motion.div>
                          ))}
                      </AnimatePresence>
                  </div>

                  {/* Static Footer Status */}
                  <div className="p-4 bg-black/20 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                          <span>CONFIDENCE SCORE</span>
                          <span className="text-emerald-400">98.4%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "98.4%" }}
                            transition={{ duration: 1 }}
                          ></motion.div>
                      </div>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default ClairvoyanceDemo;
