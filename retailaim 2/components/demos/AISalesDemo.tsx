import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Battery, Signal, Wifi, Navigation, MapPin, Zap, Clock, 
  ChevronLeft, MoreHorizontal, Bot, ChevronRight, Car, CheckCircle, Package 
} from 'lucide-react';
// 注意：ScenarioIntro 已经移到 DirectorEngine 统一管理，这里不再需要引入

// --- Types ---
type ViewState = 'notification' | 'wechat_chat' | 'wechat_mini_program';

// --- Shared Mobile Frame ---
const MobileFrame: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div className={`w-[360px] h-[700px] rounded-[40px] border-[8px] border-slate-800 overflow-hidden relative shadow-2xl mx-auto transition-colors duration-500 ${dark ? 'bg-slate-900' : 'bg-[#f5f5f5]'}`}>
    {/* Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-50"></div>
    {/* Status Bar */}
    <div className={`absolute top-2 left-0 right-0 px-6 flex justify-between z-40 text-[10px] ${dark ? 'text-white' : 'text-black'}`}>
        <span>9:41</span>
        <div className="flex space-x-1"><Signal size={12} /><Wifi size={12} /><Battery size={12} /></div>
    </div>
    {/* Content Area */}
    <div className={`h-full w-full flex flex-col font-sans overflow-hidden`}>
        {children}
    </div>
  </div>
);

interface AISalesDemoProps {
  onComplete?: () => void;
  context?: any;
  // 接收导演系统 props
  directorProps?: {
    elapsedTime: number;
    currentStep: string | null;
    isPlaying: boolean;
  };
}

const AISalesDemo: React.FC<AISalesDemoProps> = ({ onComplete, directorProps }) => {
  const [view, setView] = useState<ViewState>('notification');
  
  // --- Director Controlled Sequence ---
  useEffect(() => {
    // 如果没有导演 props，使用默认 fallback 逻辑
    if (!directorProps) {
        const t1 = setTimeout(() => setView('wechat_chat'), 3500);
        return () => clearTimeout(t1);
    }

    // 导演控制逻辑
    const step = directorProps.currentStep;
    if (step === 'show_notification') setView('notification');
    else if (step === 'open_wechat') setView('wechat_chat');
    else if (step === 'open_map') setView('wechat_mini_program');

  }, [directorProps?.currentStep]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
       {/* Intro Card removed here, handled by DirectorEngine */}

       <MobileFrame dark={view === 'notification'}>
         <AnimatePresence mode="wait">
            {view === 'notification' && (
              <NotificationView 
                key="notif" 
                onClick={() => setView('wechat_chat')} 
              />
            )}
            {view === 'wechat_chat' && (
              <WeChatChatView 
                key="chat" 
                onOpenMiniProgram={() => setView('wechat_mini_program')} 
              />
            )}
            {view === 'wechat_mini_program' && (
              <MiniProgramRouteView 
                key="mini" 
                onBack={() => setView('wechat_chat')} 
              />
            )}
         </AnimatePresence>
       </MobileFrame>
    </div>
  );
};

// --- 1. Lock Screen View (早报通知) ---

const NotificationView: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      className="h-full w-full flex flex-col items-center justify-center px-6 relative bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover"
      onClick={onClick}
    >
       <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
       
       <div className="relative z-10 w-full flex flex-col items-center mt-16">
          <div className="text-6xl font-thin text-white mb-4 tracking-tight">09:41</div>
          <div className="text-lg text-white/90 mb-12 font-medium">10月24日 星期四</div>
  
          {/* Notification Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="w-full bg-white/70 backdrop-blur-xl rounded-[20px] p-3 shadow-lg cursor-pointer"
          >
             <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center space-x-1.5">
                   <div className="w-5 h-5 bg-[#07c160] rounded flex items-center justify-center"><span className="text-white text-[10px] font-bold">We</span></div>
                   <span className="text-xs font-bold text-black/80 uppercase tracking-tight">企业微信</span>
                </div>
                <span className="text-[10px] text-black/50">现在</span>
             </div>
             <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                   <Bot size={22} />
                </div>
                <div className="flex-1 pt-0.5">
                   <div className="text-sm font-bold text-black mb-0.5">AI 业务助手</div>
                   <div className="text-xs text-black/80 leading-snug">
                      早报：海淀区昨日销量数据异常，3家门店缺货，请查看详细分析...
                   </div>
                </div>
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-auto mb-8 text-xs text-white/60 animate-pulse">
             向上轻扫以解锁
          </motion.div>
       </div>
    </motion.div>
  );
};

// --- 2. Chat Interface View (早报对话) ---

const WeChatChatView: React.FC<{ onOpenMiniProgram: () => void }> = ({ onOpenMiniProgram }) => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Script: Morning Briefing
        const script = [
            { t: 500, type: 'text', sender: 'ai', content: '早上好！☀️ 昨天的海淀区销售数据已生成。' },
            { t: 1500, type: 'text', sender: 'ai', content: '📉 整体 GMV 环比下跌 5%。监测到 3 家重点门店存在缺货风险，建议优先拜访。' },
            { t: 3500, type: 'card', sender: 'ai', customTitle: '今日智能排程方案' },
        ];

        let timeouts: NodeJS.Timeout[] = [];

        script.forEach(step => {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, step]);
                if (step.type === 'card') {
                    // Auto-click card after showing (simulated)
                    setTimeout(onOpenMiniProgram, 2500); 
                }
            }, step.t);
            timeouts.push(timer);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="flex-1 flex flex-col bg-[#f5f5f5] h-full pt-8">
            {/* Header */}
            <div className="bg-[#f5f5f5] px-4 py-3 flex items-center justify-between border-b border-gray-200 z-10 shadow-sm">
                <div className="flex items-center">
                    <ChevronLeft size={24} className="text-black"/>
                    <span className="font-medium text-base ml-1">AI 业务助手 (Bot)</span>
                </div>
                <MoreHorizontal size={20} className="text-black"/>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-center"><span className="text-xs text-gray-400 bg-black/5 px-2 py-1 rounded">09:42</span></div>
                
                {messages.map((msg, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex justify-start items-start space-x-2`}
                    >
                        <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                            <Bot size={18} />
                        </div>

                        <div className="max-w-[75%]">
                            {msg.type === 'text' ? (
                                <div className="bg-white p-2.5 rounded-lg text-sm text-black border border-gray-200 shadow-sm relative">
                                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white rotate-45 border-l border-b border-gray-200"></div>
                                    <span className="relative z-10">{msg.content}</span>
                                </div>
                            ) : (
                                <div onClick={onOpenMiniProgram} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer w-60 relative group hover:bg-gray-50 transition-colors">
                                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white rotate-45 border-l border-b border-gray-200 z-0"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="h-28 bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center px-4 relative overflow-hidden">
                                            <Zap className="absolute -right-4 -top-4 text-blue-100 opacity-50" size={80}/>
                                            <h4 className="text-sm font-bold text-blue-800 z-10">{msg.customTitle}</h4>
                                            <p className="text-xs text-blue-600 z-10 mt-1">预计挽回 GMV ¥3,200</p>
                                            <div className="mt-3 flex items-center space-x-2">
                                               <div className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">Efficiency</div>
                                               <div className="text-blue-400 text-[10px]">Route A</div>
                                            </div>
                                        </div>
                                        <div className="p-2 flex items-center justify-between bg-white border-t border-gray-50">
                                            <div className="flex items-center space-x-1">
                                               <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><Zap size={10} className="text-white"/></div>
                                               <div className="text-xs text-gray-500">小程序 · 业务助手</div>
                                            </div>
                                            <ChevronRight size={12} className="text-gray-400"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Bar */}
            <div className="bg-[#f7f7f7] px-3 py-2 border-t border-gray-300 flex items-center space-x-3 pb-6">
               <div className="p-1.5 rounded-full border border-gray-400"><div className="w-4 h-4" /></div>
               <div className="flex-1 bg-white h-9 rounded border border-gray-200"></div>
               <div className="p-1.5 rounded-full border border-gray-400"><div className="w-4 h-4" /></div>
            </div>
        </motion.div>
    );
};

// --- 3. Mini Program Map View (巡店路线) ---

const MiniProgramRouteView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [aiPlanVisible, setAiPlanVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setAiPlanVisible(true), 800);
    }, []);

    return (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 flex flex-col bg-white h-full z-50">
            {/* Header */}
            <div className="bg-white px-4 pt-10 pb-2 flex items-center justify-between border-b border-gray-100 relative z-20">
                <div onClick={onBack} className="flex items-center space-x-1 text-black cursor-pointer">
                     <div className="border border-gray-200 rounded-full px-2 py-1 flex items-center space-x-3 hover:bg-gray-50 transition-colors">
                        <MoreHorizontal size={16}/>
                        <div className="w-px h-3 bg-gray-200"></div>
                        <div className="w-4 h-4 rounded-full border-2 border-black relative">
                           <div className="absolute inset-0 m-auto bg-black w-1.5 h-1.5 rounded-full"></div>
                        </div>
                     </div>
                </div>
                <span className="font-bold text-sm absolute left-0 right-0 text-center pointer-events-none">
                    智能巡店助手
                </span>
            </div>

            <div className="flex-1 bg-slate-50 p-4 flex flex-col overflow-y-auto">
                <div className="text-lg font-bold text-slate-800 mb-1">今日海淀区路线推荐</div>
                <p className="text-xs text-slate-500 mb-4 flex items-center">
                   <CheckCircle size={12} className="text-green-500 mr-1"/>
                   AI 已根据缺货紧急程度优化顺序
                </p>

                <AnimatePresence>
                    {aiPlanVisible && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col space-y-4">
                            
                            {/* Map Visual */}
                            <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden shadow-inner">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                
                                <svg className="absolute inset-0 w-full h-full">
                                    {/* Route */}
                                    <path id="route" d="M 50 150 C 80 80 150 50 200 80 S 250 150 300 120" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"/>
                                    <path d="M 50 150 C 80 80 150 50 200 80 S 250 150 300 120" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="animate-dash"/>
                                    
                                    {/* Nodes */}
                                    <g transform="translate(50, 150)"><circle r="6" fill="#ef4444"/><circle r="10" fill="#ef4444" opacity="0.3" className="animate-ping"/></g>
                                    <g transform="translate(200, 80)"><circle r="6" fill="#f97316"/></g>
                                    <g transform="translate(300, 120)"><circle r="6" fill="#3b82f6"/></g>
                                </svg>

                                {/* Car */}
                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                   <style>{`
                                     @keyframes moveCar {
                                       0% { offset-distance: 0%; }
                                       100% { offset-distance: 100%; }
                                     }
                                     .car-icon {
                                       offset-path: path("M 50 150 C 80 80 150 50 200 80 S 250 150 300 120");
                                       animation: moveCar 4s linear infinite alternate;
                                     }
                                   `}</style>
                                   <div className="car-icon absolute w-6 h-6 bg-white border border-blue-500 rounded-full shadow-md flex items-center justify-center z-10 text-blue-600">
                                      <Car size={12} fill="currentColor"/>
                                   </div>
                                </div>

                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm text-slate-600 border border-slate-200">
                                   全程 8.5km • 畅通
                                </div>
                            </div>

                            {/* Task List */}
                            <div className="space-y-3">
                                {/* Only one task shown as an example */}
                                <div className="bg-white rounded-xl p-3 border-l-4 border-orange-500 shadow-sm flex items-start space-x-3">
                                   <div className="bg-orange-50 text-orange-500 p-2 rounded-lg font-bold text-xs text-center min-w-[40px]">
                                      <div>STOP</div><div>1</div>
                                   </div>
                                   <div className="flex-1">
                                      <div className="flex justify-between items-center mb-1">
                                         <span className="font-bold text-sm text-slate-800">罗森 (丹棱街)</span>
                                         <span className="text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">库存预警</span>
                                      </div>
                                      <div className="text-xs text-slate-500">
                                         任务: 盘点冷柜饮料库存
                                      </div>
                                   </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-[#07c160] hover:bg-[#06ad56] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center mt-4 transition-colors"
                            >
                                <Navigation size={16} className="mr-2"/> 确认并开始导航
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AISalesDemo;