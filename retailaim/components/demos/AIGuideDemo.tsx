import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Activity, ChevronRight, Star, AlertCircle, FileCheck, PlayCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import ScenarioIntro from '../ScenarioIntro';

const REPORT_DATA = [
  { subject: '情绪感知', A: 95, fullMark: 100 },
  { subject: '话术逻辑', A: 85, fullMark: 100 },
  { subject: '产品知识', A: 90, fullMark: 100 },
  { subject: '应变能力', A: 80, fullMark: 100 },
  { subject: '亲和力', A: 98, fullMark: 100 },
];

const REPORT_CHECKPOINTS = [
    { label: '开场问候与破冰', status: 'pass', comment: '热情自然，成功建立连接' },
    { label: '需求挖掘 (询问肤质/困扰)', status: 'pass', comment: '问题精准，引导性强' },
    { label: '产品核心成分解释', status: 'warning', comment: '玻色因功效描述略显生硬' },
    { label: '价格异议处理', status: 'warning', comment: '未充分运用价值锚定技巧' },
    { label: '连带销售 (眼部按摩仪)', status: 'pass', comment: '场景关联非常丝滑' },
];

// --- COMPONENTS ---

// Sci-Fi Holographic Avatar
const AIAvatar: React.FC<{ state: 'idle' | 'listening' | 'speaking' | 'thinking' }> = ({ state }) => {
  
  const getColor = () => {
    switch (state) {
      case 'listening': return '#f472b6'; // Pink
      case 'speaking': return '#06b6d4'; // Cyan
      case 'thinking': return '#a855f7'; // Purple
      default: return '#64748b'; // Slate
    }
  };

  const color = getColor();

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-xl border border-white/10">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-20" style={{ 
         backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`, 
         backgroundSize: '40px 40px',
         maskImage: 'radial-gradient(circle, black 40%, transparent 80%)'
      }}></div>

      {/* Central Core */}
      <div className="relative z-10 flex items-center justify-center scale-125">
         
         {/* Core Glow */}
         <motion.div 
           animate={{ scale: state === 'speaking' ? [1, 1.4, 1] : [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: state === 'speaking' ? 0.3 : 2, repeat: Infinity }}
           className="absolute w-32 h-32 rounded-full blur-2xl"
           style={{ backgroundColor: color }}
         />

         {/* Inner Sphere */}
         <div className="relative w-32 h-32 rounded-full bg-black border-2 border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden">
            <motion.div 
               className="absolute inset-0 opacity-30"
               style={{ background: `conic-gradient(from 0deg, transparent, ${color}, transparent)` }}
               animate={{ rotate: 360 }}
               transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
            
            {/* Voice Waveform Simulation */}
            <div className="absolute flex items-center justify-center gap-1 z-10">
               {[1,2,3,4,5].map(i => (
                 <motion.div 
                   key={i}
                   className="w-1 bg-white rounded-full"
                   animate={{ height: state === 'speaking' ? [10, 50, 10] : 4 }}
                   transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                   style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                 />
               ))}
            </div>
         </div>

         {/* Rotating Rings (Sci-Fi HUD) */}
         {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-dashed"
              style={{ 
                width: 180 + i * 60, 
                height: 180 + i * 60, 
                borderColor: `${color}40`,
                borderWidth: 1,
                borderStyle: i === 2 ? 'solid' : 'dashed'
              }}
              animate={{ 
                rotate: i % 2 === 0 ? 360 : -360, 
                scale: state === 'listening' ? [1, 1.02, 1] : 1 
              }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]" style={{ backgroundColor: color }}></div>
            </motion.div>
         ))}
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: color }}></div>
            <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                {state === 'idle' && 'AI SYSTEM READY'}
                {state === 'listening' && 'LISTENING...'}
                {state === 'thinking' && 'PROCESSING...'}
                {state === 'speaking' && 'AI COACH SPEAKING'}
            </span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DEMO COMPONENT ---

const AIGuideDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [mode, setMode] = useState<'intro' | 'simulation' | 'report'>('intro');
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [transcript, setTranscript] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  
  const simulationRef = useRef<boolean>(false); 

  // Auto-start for Large Screen Playback
  useEffect(() => {
    let autoStartTimer: ReturnType<typeof setTimeout>;
    if (mode === 'intro' && !simulationRef.current) {
        autoStartTimer = setTimeout(() => {
            startSimulation();
        }, 4000); // Auto-start after 4 seconds if no user interaction
    }
    return () => clearTimeout(autoStartTimer);
  }, [mode]);

  const startSimulation = () => {
    if (simulationRef.current) return;
    simulationRef.current = true;

    setMode('simulation');
    
    // Script Content
    const introText = '你好，我是您的 AI 陪练。今天的课题是《新品眼霜的连带销售》。请尝试向我推荐这款产品。';
    const userPitchText = '您好，这款眼霜特别添加了高浓度玻色因，能有效淡化细纹。而且现在我们在做活动，搭配这款按摩仪一起买，效果更好，价格也非常划算。';
    const feedbackText = '语速适中，连带销售切入得很自然。不过在介绍玻色因成分时，可以更具体一点，比如“像给肌肤喝饱水”。综合评分生成中...';

    // Timeline execution
    
    // 1. AI Intro
    setTimeout(() => {
        setAvatarState('speaking');
        setTranscript(prev => [...prev, { sender: 'ai', text: introText }]);
    }, 1500); 

    // 2. User Speaking (Simulated)
    // Wait approx 8 seconds for intro to finish reading
    setTimeout(() => {
        setAvatarState('listening'); // AI is listening
        // Visual feedback for user speaking
        setTranscript(prev => [...prev, { sender: 'user', text: userPitchText }]);
    }, 10000);

    // 3. AI Thinking
    // Wait approx 8 seconds for user pitch to finish
    setTimeout(() => {
        setAvatarState('thinking');
    }, 20000); 

    // 4. AI Feedback
    setTimeout(() => {
        setAvatarState('speaking');
        setTranscript(prev => [...prev, { sender: 'ai', text: feedbackText }]);
    }, 23000);

    // 5. End Simulation / Show Report
    // Wait for feedback to finish
    setTimeout(() => {
        setAvatarState('idle');
        setMode('report');
    }, 35000); 

    // 6. Complete Module
    setTimeout(() => {
        simulationRef.current = false; // Reset lock
        onComplete && onComplete();
    }, 45000); 
  };

  return (
    <div className="h-full flex flex-col relative font-sans bg-slate-900">
      <ScenarioIntro 
        title="AI 智能陪练" 
        role="导购员" 
        goal="提升产品知识销售技巧和服务能力" 
      />

      {/* 1. Intro / Workbench View */}
      <AnimatePresence>
      {mode === 'intro' && (
         <motion.div 
           initial={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }}
           className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900"
         >
            {/* Mobile Workbench Simulation */}
            <div className="w-[360px] h-[600px] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl border-8 border-slate-800 relative">
               <div className="bg-blue-600 p-6 text-white">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Star fill="white" size={16}/></div>
                        <div>
                           <div className="text-sm opacity-80">欢迎回来</div>
                           <div className="font-bold text-lg">金牌导购员</div>
                        </div>
                     </div>
                  </div>
                  <div className="flex space-x-4 mt-4">
                     <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-xl font-bold">12</div>
                        <div className="text-xs opacity-70">今日待办</div>
                     </div>
                     <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                        <div className="text-xl font-bold">98%</div>
                        <div className="text-xs opacity-70">通关率</div>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 bg-slate-50 p-4 relative">
                  <h3 className="font-bold text-slate-700 mb-3">今日必修任务</h3>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startSimulation}
                    className="bg-white p-4 rounded-xl shadow-md border border-blue-100 flex items-center justify-between cursor-pointer group relative overflow-hidden"
                  >
                     {/* Pulse Hint */}
                     <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                     <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>

                     <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                           <Mic size={24}/>
                        </div>
                        <div>
                           <div className="font-bold text-slate-800">AI 话术陪练</div>
                           <div className="text-xs text-slate-500">新品眼霜连带销售场景</div>
                           <div className="text-[10px] text-blue-500 font-bold mt-1 flex items-center">
                              <PlayCircle size={10} className="mr-1"/> 点击开始训练
                           </div>
                        </div>
                     </div>
                     <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
                  </motion.div>
               </div>
               
               {/* Click Hint Overlay */}
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
                  className="absolute bottom-10 w-full text-center pointer-events-none"
               >
                  <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full inline-block backdrop-blur-sm animate-bounce">
                     👆 请点击任务卡片开始 (自动播放中...)
                  </div>
               </motion.div>
            </div>
         </motion.div>
      )}
      </AnimatePresence>

      {/* 2. Main Content Area */}
      <div className="flex-1 p-6 h-full overflow-hidden relative">
         {/* Fix: Only render main content if NOT in intro mode to prevent bleeding through */}
         {mode === 'intro' ? (
           <div className="flex items-center justify-center h-full text-slate-600">
              {/* Placeholder to keep layout consistent if needed */}
           </div>
         ) : mode === 'report' ? (
             <motion.div 
               key="full-report"
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
               className="h-full bg-slate-800/80 backdrop-blur rounded-2xl border border-white/10 p-8 flex flex-col"
             >
                 <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-1">培训诊断报告</h2>
                        <p className="text-slate-400 text-sm">Session ID: #TR-20241024-091</p>
                     </div>
                     <div className="flex items-center space-x-4">
                         <div className="text-right">
                            <div className="text-xs text-slate-400 uppercase tracking-wider">Total Score</div>
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">92</div>
                         </div>
                         <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 flex items-center justify-center">
                            <div className="text-2xl font-bold text-cyan-400">A+</div>
                         </div>
                     </div>
                 </div>

                 <div className="flex-1 grid grid-cols-2 gap-8 min-h-0">
                     {/* Left: Radar */}
                     <div className="flex flex-col">
                        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center"><Activity size={16} className="mr-2 text-cyan-400"/> 能力模型分析</h3>
                        <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={REPORT_DATA}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Capability" dataKey="A" stroke="#22d3ee" strokeWidth={3} fill="#22d3ee" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Right: Checkpoints */}
                     <div className="flex flex-col overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center"><FileCheck size={16} className="mr-2 text-cyan-400"/> 关键考核点回顾</h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {REPORT_CHECKPOINTS.map((item, idx) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5 flex justify-between items-start">
                                    <div className="flex-1 mr-4">
                                        <div className="text-sm text-slate-200 font-bold mb-1">{item.label}</div>
                                        <div className="text-xs text-slate-400 flex items-start">
                                           <span className="mr-1 mt-0.5 opacity-50">💡</span>
                                           {item.comment}
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap ${
                                        item.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                                    }`}>
                                        {item.status === 'pass' ? 'PASSED' : 'IMPROVE'}
                                    </div>
                                </div>
                            ))}
                            
                            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start space-x-3">
                                <AlertCircle size={16} className="text-blue-400 mt-0.5 shrink-0"/>
                                <div>
                                    <div className="text-xs font-bold text-blue-300 mb-0.5">AI 导师建议</div>
                                    <p className="text-xs text-blue-200/70 leading-relaxed">
                                        整体表现优秀。建议在处理价格异议时，多使用“平均每天仅需...”的成本拆解法，以降低客户心理阻力。
                                    </p>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
             </motion.div>
         ) : (
            <div className="h-full grid grid-rows-2 gap-6">
                {/* Top: Avatar Area */}
                <div className="relative row-span-1 min-h-0">
                   <AIAvatar state={avatarState} />
                </div>

                {/* Bottom: Chat Area */}
                <div className="row-span-1 bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden relative">
                    <div className="absolute inset-0 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                       {transcript.map((t, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: t.sender === 'ai' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex ${t.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                          >
                             <div className={`max-w-[80%] p-4 rounded-2xl ${
                                t.sender === 'ai' 
                                ? 'bg-slate-700/50 text-slate-200 rounded-tl-none' 
                                : 'bg-blue-600 text-white rounded-tr-none'
                             }`}>
                                <div className="flex items-center space-x-2 mb-1 opacity-50 text-xs uppercase tracking-wider">
                                   {t.sender === 'ai' ? <Radio size={12}/> : <Mic size={12}/>}
                                   <span>{t.sender === 'ai' ? 'AI Mentor' : 'You (Simulated)'}</span>
                                </div>
                                {t.text}
                             </div>
                          </motion.div>
                       ))}
                       {avatarState === 'listening' && (
                          <div className="flex justify-end">
                             <div className="bg-blue-600/20 text-blue-400 p-3 rounded-2xl rounded-tr-none flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                             </div>
                          </div>
                       )}
                    </div>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AIGuideDemo;