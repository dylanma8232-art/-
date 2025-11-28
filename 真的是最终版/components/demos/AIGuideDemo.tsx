import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Activity, ChevronRight, Star, AlertCircle, FileCheck, PlayCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
// 1. 恢复导入全局配置
import { DEMO_PLAYLIST } from '../../configs/DemoPlaylist';

const REPORT_DATA = [{ subject: '情绪感知', A: 95, fullMark: 100 }, { subject: '话术逻辑', A: 85, fullMark: 100 }, { subject: '产品知识', A: 90, fullMark: 100 }, { subject: '应变能力', A: 80, fullMark: 100 }, { subject: '亲和力', A: 98, fullMark: 100 }];
const REPORT_CHECKPOINTS = [{ label: '开场问候与破冰', status: 'pass', comment: '热情自然，成功建立连接' }, { label: '需求挖掘 (询问肤质/困扰)', status: 'pass', comment: '问题精准，引导性强' }, { label: '产品核心成分解释', status: 'warning', comment: '玻色因功效描述略显生硬' }, { label: '价格异议处理', status: 'warning', comment: '未充分运用价值锚定技巧' }, { label: '连带销售 (眼部按摩仪)', status: 'pass', comment: '场景关联非常丝滑' }];

const TabletWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-[80vh] aspect-[3/4] max-h-[900px] bg-slate-50 rounded-[40px] border-[12px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative mx-auto my-auto">
      {children}
  </div>
);

const AIAvatar: React.FC<{ state: 'idle' | 'listening' | 'speaking' | 'thinking' }> = ({ state }) => {
  const getColor = () => { switch (state) { case 'listening': return '#f472b6'; case 'speaking': return '#06b6d4'; case 'thinking': return '#a855f7'; default: return '#64748b'; } };
  const color = getColor();
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden rounded-3xl border border-white/10">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(circle, black 40%, transparent 80%)' }}></div>
      <div className="relative z-10 flex items-center justify-center scale-90 lg:scale-100">
         <motion.div animate={{ scale: state === 'speaking' ? [1, 1.4, 1] : [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: state === 'speaking' ? 0.3 : 2, repeat: Infinity }} className="absolute w-28 h-28 rounded-full blur-2xl" style={{ backgroundColor: color }} />
         <div className="relative w-28 h-28 rounded-full bg-black border-2 border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden">
            <motion.div className="absolute inset-0 opacity-30" style={{ background: `conic-gradient(from 0deg, transparent, ${color}, transparent)` }} animate={{ rotate: 360 }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} />
            <div className="absolute flex items-center justify-center gap-1 z-10">{[1,2,3,4,5].map(i => (<motion.div key={i} className="w-1 bg-white rounded-full" animate={{ height: state === 'speaking' ? [8, 40, 8] : 3 }} transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }} style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />))}</div>
         </div>
         {[1, 2, 3].map((i) => (<motion.div key={i} className="absolute rounded-full border border-dashed" style={{ width: 160 + i * 50, height: 160 + i * 50, borderColor: `${color}40`, borderWidth: 2, borderStyle: i === 2 ? 'solid' : 'dashed' }} animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: state === 'listening' ? [1, 1.02, 1] : 1 }} transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}><div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]" style={{ backgroundColor: color }}></div></motion.div>))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center"><div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"><div className="w-2 h-2 rounded-full mr-3 animate-pulse" style={{ backgroundColor: color }}></div><span className="text-xs font-mono text-slate-300 uppercase tracking-widest">{state === 'idle' && 'AI SYSTEM READY'}{state === 'listening' && 'LISTENING...'}{state === 'thinking' && 'PROCESSING...'}{state === 'speaking' && 'AI COACH SPEAKING'}</span></div></div>
    </div>
  );
};

const AIGuideDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [mode, setMode] = useState<'intro' | 'simulation' | 'report'>('intro');
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [transcript, setTranscript] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
  const simulationRef = useRef<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 2. 直接读取 DEMO_PLAYLIST 配置 (带 ?. 防止循环引用初始为空)
  const timeline = DEMO_PLAYLIST?.find(s => s.id === 'guide')?.timeline || { 
      workbenchStay: 2000, 
      intro: 1000, 
      userSpeech: 5000, 
      thinking: 11000, 
      feedback: 13500, 
      report: 20000, 
      complete: 26500 
  };

  useEffect(() => {
    let autoStartTimer: ReturnType<typeof setTimeout>;
    // 使用 timeline.workbenchStay
    if (mode === 'intro' && !simulationRef.current) { 
        autoStartTimer = setTimeout(() => startSimulation(), timeline.workbenchStay); 
    }
    return () => clearTimeout(autoStartTimer);
  }, [mode]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [transcript, avatarState]);

  const startSimulation = () => {
    if (simulationRef.current) return;
    simulationRef.current = true;
    setMode('simulation');
    
    // 使用 timeline 里的时间点配置
    setTimeout(() => { setAvatarState('speaking'); setTranscript(prev => [...prev, { sender: 'ai', text: '你好，我是您的 AI 陪练。今天的课题是《新品眼霜的连带销售》。请尝试向我推荐这款产品。' }]); }, timeline.intro); 
    setTimeout(() => { setAvatarState('listening'); setTranscript(prev => [...prev, { sender: 'user', text: '您好，这款眼霜特别添加了高浓度玻色因，能有效淡化细纹。而且现在我们在做活动，搭配这款按摩仪一起买，效果更好，价格也非常划算。' }]); }, timeline.userSpeech);
    setTimeout(() => { setAvatarState('thinking'); }, timeline.thinking); 
    setTimeout(() => { setAvatarState('speaking'); setTranscript(prev => [...prev, { sender: 'ai', text: '语速适中，连带销售切入得很自然。不过在介绍玻色因成分时，可以更具体一点，比如“像给肌肤喝饱水”。综合评分生成中...' }]); }, timeline.feedback);
    setTimeout(() => { setAvatarState('idle'); setMode('report'); }, timeline.report); 
    setTimeout(() => { simulationRef.current = false; onComplete && onComplete(); }, timeline.complete); 
  };

  return (
    <div className="h-full flex flex-col relative font-sans bg-slate-900 items-center justify-center">
      <AnimatePresence>
      {mode === 'intro' && (
         <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <TabletWrapper>
               <div className="h-full w-full bg-white flex flex-col font-sans">
                   <div className="bg-blue-600 px-8 py-10 text-white shrink-0">
                      <div className="flex justify-between items-center mb-6"><div className="flex items-center space-x-4"><div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"><Star fill="white" size={28}/></div><div><div className="text-base opacity-80">欢迎回来</div><div className="font-bold text-2xl">金牌导购员</div></div></div></div>
                      <div className="flex space-x-4 mt-2"><div className="flex-1 bg-white/10 rounded-xl p-4 text-center"><div className="text-3xl font-bold">12</div><div className="text-sm opacity-70">今日待办</div></div><div className="flex-1 bg-white/10 rounded-xl p-4 text-center"><div className="text-3xl font-bold">98%</div><div className="text-sm opacity-70">通关率</div></div></div>
                   </div>
                   <div className="flex-1 bg-slate-50 p-8 relative">
                      <h3 className="font-bold text-slate-700 mb-5 text-xl">今日必修任务</h3>
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startSimulation} className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 flex items-center justify-between cursor-pointer group relative overflow-hidden">
                         <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping"></div><div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full"></div>
                         <div className="flex items-center space-x-5"><div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Mic size={32}/></div><div><div className="font-bold text-slate-800 text-xl">AI 话术陪练</div><div className="text-base text-slate-500 mt-1">新品眼霜连带销售场景</div><div className="text-sm text-blue-500 font-bold mt-2 flex items-center"><PlayCircle size={16} className="mr-2"/> 点击开始训练</div></div></div><ChevronRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
                      </motion.div>
                   </div>
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-12 w-full text-center pointer-events-none"><div className="bg-black/70 text-white text-sm px-6 py-2 rounded-full inline-block backdrop-blur-sm animate-bounce">👆 自动播放中...</div></motion.div>
               </div>
            </TabletWrapper>
         </motion.div>
      )}
      </AnimatePresence>

      <div className="flex-1 p-0 h-full w-full max-w-[1600px] overflow-hidden relative flex flex-col items-center justify-center">
         {mode === 'intro' ? (<div className="flex items-center justify-center h-full"></div>) : mode === 'report' ? (
             <motion.div key="full-report" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-[96%] h-[92%] bg-slate-800/80 backdrop-blur rounded-3xl border border-white/10 p-6 lg:p-10 flex flex-col">
                 <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4"><div><h2 className="text-3xl font-bold text-white mb-2">培训诊断报告</h2><p className="text-slate-400 text-sm">Session ID: #TR-20241024-091</p></div><div className="flex items-center space-x-6"><div className="text-right"><div className="text-xs text-slate-400 uppercase tracking-wider">Total Score</div><div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">92</div></div><div className="w-20 h-20 rounded-full border-8 border-cyan-500/20 flex items-center justify-center"><div className="text-3xl font-bold text-cyan-400">A+</div></div></div></div>
                 <div className="flex-1 grid grid-cols-2 gap-8 min-h-0 overflow-hidden">
                     <div className="flex flex-col"><h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center"><Activity size={20} className="mr-3 text-cyan-400"/> 能力模型分析</h3><div className="flex-1 bg-slate-900/50 rounded-2xl border border-white/5 relative"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="70%" data={REPORT_DATA}><PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} /><Radar name="Capability" dataKey="A" stroke="#22d3ee" strokeWidth={4} fill="#22d3ee" fillOpacity={0.4} /></RadarChart></ResponsiveContainer></div></div>
                     <div className="flex flex-col overflow-hidden"><h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center"><FileCheck size={20} className="mr-3 text-cyan-400"/> 关键考核点回顾</h3><div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">{REPORT_CHECKPOINTS.map((item, idx) => (<div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 flex justify-between items-start"><div className="flex-1 mr-4"><div className="text-sm text-slate-200 font-bold mb-1">{item.label}</div><div className="text-xs text-slate-400 flex items-start"><span className="mr-2 mt-0.5 opacity-50">💡</span>{item.comment}</div></div><div className={`px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap ${item.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>{item.status === 'pass' ? 'PASSED' : 'IMPROVE'}</div></div>))}<div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start space-x-4"><AlertCircle size={20} className="text-blue-400 mt-0.5 shrink-0"/><div><div className="text-sm font-bold text-blue-300 mb-1">AI 导师建议</div><p className="text-xs text-blue-200/70 leading-relaxed">整体表现优秀。建议在处理价格异议时，多使用“平均每天仅需...”的成本拆解法，以降低客户心理阻力。</p></div></div></div></div>
                 </div>
             </motion.div>
         ) : (
            <div className="h-full w-full flex flex-col gap-4 p-4 lg:p-8">
                <div className="relative h-[30%] min-h-[200px] w-full">
                   <AIAvatar state={avatarState} />
                </div>
                <div className="flex-1 bg-slate-800/50 rounded-3xl border border-white/5 overflow-hidden relative">
                    <div ref={chatContainerRef} className="absolute inset-0 p-6 lg:p-8 overflow-y-auto space-y-6 custom-scrollbar scroll-smooth">
                       {transcript.map((t, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: t.sender === 'ai' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${t.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                             <div className={`max-w-[85%] p-5 rounded-3xl text-lg lg:text-xl leading-relaxed ${t.sender === 'ai' ? 'bg-slate-700/50 text-slate-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                <div className="flex items-center space-x-2 mb-2 opacity-50 text-sm uppercase tracking-wider font-bold">{t.sender === 'ai' ? <Radio size={16}/> : <Mic size={16}/>}<span>{t.sender === 'ai' ? 'AI Mentor' : 'You (Simulated)'}</span></div>{t.text}
                             </div>
                          </motion.div>
                       ))}
                       {avatarState === 'listening' && (<div className="flex justify-end"><div className="bg-blue-600/20 text-blue-400 p-4 rounded-3xl rounded-tr-none flex items-center space-x-2"><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div><div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div></div></div>)}
                       <div className="h-4"></div>
                    </div>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AIGuideDemo;