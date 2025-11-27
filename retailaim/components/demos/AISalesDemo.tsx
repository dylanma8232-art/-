
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Battery, Signal, Wifi, Navigation, MapPin, Zap, Clock, ChevronLeft, MoreHorizontal, Bot, ChevronRight, Car, CheckCircle, Package } from 'lucide-react';
import ScenarioIntro from '../ScenarioIntro';

// --- Types & Mock Data ---
type ViewState = 'notification' | 'wechat_chat' | 'wechat_mini_program';

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
  context?: any; // Add context prop for receiving data from Supply Map
}

const AISalesDemo: React.FC<AISalesDemoProps> = ({ onComplete, context }) => {
  const [view, setView] = useState<ViewState>('notification');
  
  // Script Timeline
  useEffect(() => {
    // If context is provided (e.g. from Supply Map), we skip the delay or adjust flow
    const delay = context ? 1000 : 3500; 

    const sequence = [
      { t: delay + 2000, action: () => setView('wechat_chat') }, 
      { t: delay + 4000, action: () => {} }, // AI sends message logic in view
      { t: delay + 7000, action: () => setView('wechat_mini_program') }, 
      { t: delay + 13000, action: () => onComplete && onComplete() } 
    ];

    const timers = sequence.map(s => setTimeout(s.action, s.t));
    return () => timers.forEach(clearTimeout);
  }, [context]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      <ScenarioIntro 
       title= "AI 业务助手" 
      role="业务员" 
      goal=   "执行智能补货与巡店任务"    
      />

       <MobileFrame dark={view === 'notification'}>
         <AnimatePresence mode="wait">
            {view === 'notification' && (
              <NotificationView 
                key="notif" 
                onClick={() => setView('wechat_chat')} 
                context={context} 
              />
            )}
            {view === 'wechat_chat' && (
              <WeChatChatView 
                key="chat" 
                onOpenMiniProgram={() => setView('wechat_mini_program')} 
                context={context}
              />
            )}
            {view === 'wechat_mini_program' && (
              <MiniProgramRouteView 
                key="mini" 
                onBack={() => setView('wechat_chat')} 
                context={context}
              />
            )}
         </AnimatePresence>
       </MobileFrame>
    </div>
  );
};

// --- 1. Lock Screen Notification View ---

const NotificationView: React.FC<{ onClick: () => void; context?: any }> = ({ onClick, context }) => {
  // Customized Content based on Context
  const notifTitle = context ? "调度任务通知" : "AI 业务助手";
  const notifBody = context 
    ? `收到新的补货调度任务: ${context.storeName} 缺货 ${context.sku} x${context.count}，请立即处理。`
    : "早报：海淀区昨日销量数据异常，3家门店缺货，请查看...";
  
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
  
          {/* iOS Style Notification Stack */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            className="w-full bg-white/70 backdrop-blur-xl rounded-[20px] p-3 shadow-lg cursor-pointer"
          >
             <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center space-x-1.5">
                   <div className="w-5 h-5 bg-[#07c160] rounded flex items-center justify-center"><span className="text-white text-[10px] font-bold">We</span></div>
                   <span className="text-xs font-bold text-black/80 uppercase tracking-tight">微信</span>
                </div>
                <span className="text-[10px] text-black/50">现在</span>
             </div>
             <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                   {context ? <Package size={22} /> : <Bot size={22} />}
                </div>
                <div className="flex-1 pt-0.5">
                   <div className="text-sm font-bold text-black mb-0.5">{notifTitle}</div>
                   <div className="text-xs text-black/80 leading-snug">{notifBody}</div>
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

// --- 2. WeChat Chat Interface View ---

const WeChatChatView: React.FC<{ onOpenMiniProgram: () => void; context?: any }> = ({ onOpenMiniProgram, context }) => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Different scripts based on context
        if (context) {
             setMessages(prev => [...prev, { type: 'text', content: '🚨 紧急调度任务下达' }]);
             setTimeout(() => {
                setMessages(prev => [...prev, { type: 'text', content: `检测到 ${context.storeName} 爆发式需求，请优先执行补货。` }]);
             }, 800);
             setTimeout(() => {
                setMessages(prev => [...prev, { type: 'card', content: '实时调度方案', customTitle: '紧急补货任务' }]);
             }, 2000);
        } else {
             // Default Script
             setTimeout(() => {
                setMessages(prev => [...prev, { type: 'text', content: '早上好！☀️ 昨天的海淀区销售数据已生成。' }]);
             }, 500);
             setTimeout(() => {
                setMessages(prev => [...prev, { type: 'text', content: '📉 整体 GMV 环比下跌 5%。监测到 3 家重点门店存在缺货风险，建议优先拜访。' }]);
             }, 1500);
             setTimeout(() => {
                setMessages(prev => [...prev, { type: 'card', content: '今日智能排程方案' }]);
             }, 3500);
        }
    }, [context]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="flex-1 flex flex-col bg-[#f5f5f5] h-full pt-8">
            {/* WeChat Header */}
            <div className="bg-[#f5f5f5] px-4 py-3 flex items-center justify-between border-b border-gray-200 z-10 shadow-sm">
                <div className="flex items-center">
                    <ChevronLeft size={24} className="text-black"/>
                    <span className="font-medium text-base ml-1">AI 业务助手 (Bot)</span>
                </div>
                <MoreHorizontal size={20} className="text-black"/>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-center"><span className="text-xs text-gray-400 bg-black/5 px-2 py-1 rounded">09:42</span></div>
                
                {messages.map((msg, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="flex justify-start items-start space-x-2"
                    >
                        <div className={`w-9 h-9 rounded bg-gradient-to-br ${context ? 'from-orange-500 to-red-500' : 'from-blue-500 to-cyan-500'} flex items-center justify-center text-white shrink-0 mt-1 shadow-sm`}>
                            {context ? <Package size={18} /> : <Bot size={18} />}
                        </div>
                        <div className="max-w-[75%]">
                            {msg.type === 'text' ? (
                                <div className="bg-white p-2.5 rounded-lg text-sm text-black border border-gray-200 shadow-sm relative">
                                    {/* Bubble Arrow */}
                                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white rotate-45 border-l border-b border-gray-200"></div>
                                    <span className="relative z-10">{msg.content}</span>
                                </div>
                            ) : (
                                <div onClick={onOpenMiniProgram} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer w-60 relative group">
                                    {/* Bubble Arrow */}
                                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white rotate-45 border-l border-b border-gray-200 z-0"></div>
                                    
                                    <div className="relative z-10">
                                        <div className={`h-28 bg-gradient-to-br ${context ? 'from-orange-50 to-red-50' : 'from-blue-50 to-white'} flex flex-col justify-center px-4 relative overflow-hidden`}>
                                            <Zap className={`absolute -right-4 -top-4 ${context ? 'text-red-100' : 'text-blue-100'} opacity-50`} size={80}/>
                                            <h4 className={`text-sm font-bold ${context ? 'text-red-800' : 'text-blue-800'} z-10`}>{msg.customTitle || '智能巡店排程'}</h4>
                                            <p className={`text-xs ${context ? 'text-red-600' : 'text-blue-600'} z-10 mt-1`}>
                                                {context ? '紧急程度: High' : '预计挽回 GMV ¥3,200'}
                                            </p>
                                            <div className="mt-3 flex items-center space-x-2">
                                               <div className={`${context ? 'bg-red-500' : 'bg-blue-500'} text-white text-[10px] px-1.5 py-0.5 rounded`}>
                                                    {context ? 'Urgent' : 'Efficiency'}
                                               </div>
                                               <div className={`${context ? 'text-red-400' : 'text-blue-400'} text-[10px]`}>Route A</div>
                                            </div>
                                        </div>
                                        <div className="p-2 flex items-center justify-between bg-white border-t border-gray-50">
                                            <div className="flex items-center space-x-1">
                                               <div className={`w-4 h-4 ${context ? 'bg-red-500' : 'bg-blue-500'} rounded-full flex items-center justify-center`}><Zap size={10} className="text-white"/></div>
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

// --- 3. Mini Program Route View ---

const MiniProgramRouteView: React.FC<{ onBack: () => void; context?: any }> = ({ onBack, context }) => {
    const [aiPlanVisible, setAiPlanVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setAiPlanVisible(true), 800);
    }, []);

    return (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 flex flex-col bg-white h-full z-50">
            {/* Mini Program Header */}
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
                    {context ? '紧急调度任务' : '智能巡店助手'}
                </span>
            </div>

            <div className="flex-1 bg-slate-50 p-4 flex flex-col overflow-y-auto">
                <div className="text-lg font-bold text-slate-800 mb-1">{context ? '补货任务详情' : '今日海淀区路线推荐'}</div>
                <p className="text-xs text-slate-500 mb-4 flex items-center">
                   <CheckCircle size={12} className="text-green-500 mr-1"/>
                   AI 已根据缺货紧急程度优化顺序
                </p>

                <AnimatePresence>
                    {aiPlanVisible && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col space-y-4">
                            
                            {/* Enhanced Map Visual with Moving Car */}
                            <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden shadow-inner">
                                {/* Map Background Pattern */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                
                                <svg className="absolute inset-0 w-full h-full">
                                    {/* Route Path */}
                                    <path id="route" d="M 50 150 C 80 80 150 50 200 80 S 250 150 300 120" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"/>
                                    <path d="M 50 150 C 80 80 150 50 200 80 S 250 150 300 120" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="animate-dash"/>
                                    
                                    {/* Store Nodes */}
                                    <g transform="translate(50, 150)"><circle r="6" fill="#ef4444"/><circle r="10" fill="#ef4444" opacity="0.3" className="animate-ping"/></g>
                                    <g transform="translate(200, 80)"><circle r="6" fill="#f97316"/></g>
                                    <g transform="translate(300, 120)"><circle r="6" fill="#3b82f6"/></g>
                                </svg>

                                {/* Animated Car */}
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

                            {/* Detailed Task List */}
                            <div className="space-y-3">
                                {/* Only show the relevant store or prioritize it if context exists */}
                                <div className={`bg-white rounded-xl p-3 border-l-4 ${context ? 'border-red-600 ring-2 ring-red-500/20' : 'border-red-500'} shadow-sm flex items-start space-x-3`}>
                                   <div className="bg-red-50 text-red-500 p-2 rounded-lg font-bold text-xs text-center min-w-[40px]">
                                      <div>STOP</div><div>1</div>
                                   </div>
                                   <div className="flex-1">
                                      <div className="flex justify-between items-center mb-1">
                                         <span className="font-bold text-sm text-slate-800">
                                            {context ? context.storeName : '7-Eleven (中关村)'}
                                         </span>
                                         <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">严重缺货</span>
                                      </div>
                                      <div className="text-xs text-slate-500 leading-relaxed">
                                         任务: 补货 SKU-{context ? '4211' : '2938'} ({context ? context.sku : '眼药水'}) x {context ? context.count : '20'} <br/>
                                         <span className="text-blue-500">建议: 检查竞品促销陈列</span>
                                      </div>
                                   </div>
                                </div>

                                {!context && (
                                    <div className="bg-white rounded-xl p-3 border-l-4 border-orange-500 shadow-sm flex items-start space-x-3">
                                    <div className="bg-orange-50 text-orange-500 p-2 rounded-lg font-bold text-xs text-center min-w-[40px]">
                                        <div>STOP</div><div>2</div>
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
                                )}
                            </div>

                            {/* Action Button */}
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                className={`w-full ${context ? 'bg-red-600 hover:bg-red-500' : 'bg-[#07c160] hover:bg-[#06ad56]'} text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center mt-4 transition-colors`}
                            >
                                <Navigation size={16} className="mr-2"/> 确认并开始{context ? '补货' : '导航'}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AISalesDemo;
