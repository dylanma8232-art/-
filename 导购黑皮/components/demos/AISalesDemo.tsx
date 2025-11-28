import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signal, Wifi, Battery, ChevronLeft, MoreHorizontal, Bot, Zap, ChevronRight, CheckCircle, Navigation, Package, Car } from 'lucide-react';
import { DEMO_PLAYLIST } from '../../configs/DemoPlaylist';

// --- Tablet Wrapper ---
const TabletWrapper: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div className={`h-[80vh] aspect-[3/4] max-h-[900px] rounded-[45px] border-[12px] border-slate-800 overflow-hidden relative shadow-2xl mx-auto transition-colors duration-500 ${dark ? 'bg-slate-900' : 'bg-[#f5f5f5]'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-50"></div>
      <div className={`absolute top-3 left-0 right-0 px-8 flex justify-between z-40 text-sm font-medium ${dark ? 'text-white' : 'text-black'}`}>
          <span>9:41</span>
          <div className="flex space-x-2"><Signal size={16} /><Wifi size={16} /><Battery size={16} /></div>
      </div>
      <div className={`h-full w-full flex flex-col font-sans overflow-hidden pt-10`}>
          {children}
      </div>
  </div>
);

interface AISalesDemoProps {
  onComplete?: () => void;
  context?: any;
  directorProps?: { currentStep: string | null; };
}

const AISalesDemo: React.FC<AISalesDemoProps> = ({ onComplete, directorProps }) => {
  const [view, setView] = useState<'notification' | 'wechat_chat' | 'wechat_mini_program'>('notification');
  
  const timeline = DEMO_PLAYLIST.find(s => s.id === 'sales')?.timeline || { msg1: 500, msg2: 1500, card: 3500, openMap: 8000, finish: 15000 };

  useEffect(() => {
    if (!directorProps) {
        const t1 = setTimeout(() => setView('wechat_chat'), 3500); 
        const t2 = setTimeout(() => setView('wechat_mini_program'), timeline.openMap); 
        const t3 = setTimeout(() => onComplete && onComplete(), timeline.finish);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    const step = directorProps.currentStep;
    if (step === 'show_notification') setView('notification');
    else if (step === 'open_wechat') setView('wechat_chat');
    else if (step === 'open_map') setView('wechat_mini_program');
  }, [directorProps?.currentStep]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
       <TabletWrapper dark={view === 'notification'}>
         <AnimatePresence mode="wait">
            {view === 'notification' && <NotificationView key="notif" onClick={() => setView('wechat_chat')} />}
            {view === 'wechat_chat' && <WeChatChatView key="chat" onOpenMiniProgram={() => setView('wechat_mini_program')} timeline={timeline} />}
            {view === 'wechat_mini_program' && <MiniProgramRouteView key="mini" onBack={() => setView('wechat_chat')} />}
         </AnimatePresence>
       </TabletWrapper>
    </div>
  );
};

// --- Sub-components ---

const NotificationView: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} className="h-full w-full flex flex-col items-center justify-center px-10 relative bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover" onClick={onClick}>
       <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
       <div className="relative z-10 w-full flex flex-col items-center mt-20">
          <div className="text-8xl font-thin text-white mb-6 tracking-tight">09:41</div>
          <div className="text-3xl text-white/90 mb-20 font-medium">10月24日 星期四</div>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full bg-white/70 backdrop-blur-xl rounded-[30px] p-6 shadow-2xl cursor-pointer">
             <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center space-x-3"><div className="w-8 h-8 bg-[#07c160] rounded-lg flex items-center justify-center"><span className="text-white text-xs font-bold">We</span></div><span className="text-lg font-bold text-black/80 uppercase tracking-tight">企业微信</span></div>
                <span className="text-base text-black/50">现在</span>
             </div>
             <div className="flex items-start space-x-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm"><Bot size={36} /></div>
                <div className="flex-1 pt-1"><div className="text-xl font-bold text-black mb-2">AI 业务助手</div><div className="text-lg text-black/80 leading-relaxed">早报：海淀区昨日销量数据异常，3家门店缺货，请查看详细分析...</div></div>
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-auto mb-16 text-lg text-white/60 animate-pulse">向上轻扫以解锁</motion.div>
       </div>
    </motion.div>
  );
};

const WeChatChatView: React.FC<{ onOpenMiniProgram: () => void; timeline: any }> = ({ onOpenMiniProgram, timeline }) => {
    const [messages, setMessages] = useState<any[]>([]);
    useEffect(() => {
         setTimeout(() => setMessages(prev => [...prev, { type: 'text', content: '早上好！☀️ 昨天的海淀区销售数据已生成。' }]), timeline.msg1);
         setTimeout(() => setMessages(prev => [...prev, { type: 'text', content: '📉 整体 GMV 环比下跌 5%。监测到 3 家重点门店存在缺货风险，建议优先拜访。' }]), timeline.msg2);
         setTimeout(() => setMessages(prev => [...prev, { type: 'card', content: '今日智能排程方案' }]), timeline.card);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="flex-1 flex flex-col bg-[#f5f5f5] h-full pt-10">
            <div className="bg-[#f5f5f5] px-6 py-4 flex items-center justify-between border-b border-gray-200 z-10 shadow-sm">
                <div className="flex items-center"><ChevronLeft size={32} className="text-black"/><span className="font-medium text-xl ml-2 text-black">AI 业务助手 (Bot)</span></div>
                <MoreHorizontal size={28} className="text-black"/>
            </div>
            <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <div className="flex justify-center"><span className="text-sm text-gray-400 bg-black/5 px-3 py-1.5 rounded">09:42</span></div>
                {messages.map((msg, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex justify-start items-start space-x-4">
                        <div className="w-12 h-12 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm"><Bot size={24} /></div>
                        <div className="max-w-[85%]">
                            {msg.type === 'text' ? (
                                <div className="bg-white p-5 rounded-2xl text-xl text-black border border-gray-200 shadow-sm relative"><div className="absolute top-4 -left-2 w-4 h-4 bg-white rotate-45 border-l border-b border-gray-200"></div><span className="relative z-10">{msg.content}</span></div>
                            ) : (
                                <div onClick={onOpenMiniProgram} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer w-80 relative group hover:bg-gray-50 transition-colors"><div className="absolute top-4 -left-2 w-4 h-4 bg-white rotate-45 border-l border-b border-gray-200 z-0"></div><div className="relative z-10"><div className="h-40 bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center px-6 relative overflow-hidden"><Zap className="absolute -right-6 -top-6 text-blue-100 opacity-50" size={120}/><h4 className="text-xl font-bold text-blue-800 z-10">智能巡店排程</h4><p className="text-base text-blue-600 z-10 mt-2">预计挽回 GMV ¥3,200</p><div className="mt-4 flex items-center space-x-3"><div className="bg-blue-500 text-white text-sm px-3 py-1 rounded">Efficiency</div><div className="text-blue-400 text-sm">Route A</div></div></div><div className="p-4 flex items-center justify-between bg-white border-t border-gray-50"><div className="flex items-center space-x-3"><div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"><Zap size={14} className="text-white"/></div><div className="text-base text-gray-500">小程序 · 业务助手</div></div><ChevronRight size={20} className="text-gray-400"/></div></div></div>
                            )}
                        </div>
                    </motion.div>
                ))}
                <div className="h-8"></div>
            </div>
            <div className="bg-[#f7f7f7] px-5 py-4 border-t border-gray-300 flex items-center space-x-4 pb-10"><div className="p-2.5 rounded-full border border-gray-400"><div className="w-6 h-6" /></div><div className="flex-1 bg-white h-12 rounded border border-gray-200"></div><div className="p-2.5 rounded-full border border-gray-400"><div className="w-6 h-6" /></div></div>
        </motion.div>
    );
};

const MiniProgramRouteView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [aiPlanVisible, setAiPlanVisible] = useState(false);
    useEffect(() => { setTimeout(() => setAiPlanVisible(true), 800); }, []);

    return (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 flex flex-col bg-white h-full z-50">
            <div className="bg-white px-6 pt-16 pb-4 flex items-center justify-between border-b border-gray-100 relative z-20">
                <div onClick={onBack} className="flex items-center space-x-1 text-black cursor-pointer"><div className="border border-gray-200 rounded-full px-4 py-2 flex items-center space-x-4 hover:bg-gray-50 transition-colors"><MoreHorizontal size={24}/><div className="w-px h-5 bg-gray-200"></div><div className="w-6 h-6 rounded-full border-2 border-black relative"><div className="absolute inset-0 m-auto bg-black w-2.5 h-2.5 rounded-full"></div></div></div></div>
                <span className="font-bold text-xl absolute left-0 right-0 text-center pointer-events-none">智能巡店助手</span>
            </div>
            
            {/* FIXED: pb-24 防止底部被遮挡 */}
            <div className="flex-1 bg-slate-50 p-6 flex flex-col overflow-y-auto pb-24">
                <div className="text-xl font-bold text-slate-800 mb-1">今日海淀区路线推荐</div>
                <p className="text-sm text-slate-500 mb-4 flex items-center"><CheckCircle size={16} className="text-green-500 mr-2"/> AI 已根据缺货紧急程度优化顺序</p>
                <AnimatePresence>
                    {aiPlanVisible && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col space-y-2">
                            {/* FIXED: 地图高度 h-32 (128px) 更紧凑 */}
                            <div className="h-32 bg-slate-100 rounded-3xl border border-slate-200 relative overflow-hidden shadow-inner shrink-0">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                                    <path id="route" d="M 50 150 C 100 50 200 50 250 80 S 300 150 350 100" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round"/>
                                    <path d="M 50 150 C 100 50 200 50 250 80 S 300 150 350 100" fill="none" stroke="white" strokeWidth="3" strokeDasharray="8,8" className="animate-dash"/>
                                    <g transform="translate(50, 150)"><circle r="10" fill="#ef4444"/><circle r="16" fill="#ef4444" opacity="0.3" className="animate-ping"/></g>
                                    <g transform="translate(250, 80)"><circle r="10" fill="#f97316"/></g>
                                    <g transform="translate(350, 100)"><circle r="10" fill="#3b82f6"/></g>
                                    
                                    {/* FIXED: 使用 SVG 原生动画解决错位问题 */}
                                    <g>
                                      {/* foreignObject 用于嵌入 HTML div (Car Icon) */}
                                      <foreignObject x="-15" y="-15" width="30" height="30">
                                         <div className="w-full h-full bg-white border-2 border-blue-500 rounded-full shadow-md flex items-center justify-center">
                                            <Car size={16} className="text-blue-600" />
                                         </div>
                                      </foreignObject>
                                      {/* 沿路径移动动画 */}
                                      <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                                         <mpath href="#route" />
                                      </animateMotion>
                                    </g>
                                </svg>
                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm text-slate-600 border border-slate-200">全程 8.5km • 畅通</div>
                            </div>
                            
                            {/* FIXED: 紧凑列表布局 */}
                            <div className="space-y-2">
                                <div className="bg-white rounded-xl p-2 border-l-4 border-orange-500 shadow-sm flex items-start space-x-3">
                                    <div className="bg-orange-50 text-orange-500 p-2 rounded-lg font-bold text-sm text-center min-w-[50px]"><div>STOP</div><div>1</div></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-0.5"><span className="font-bold text-base text-slate-800">罗森 (丹棱街)</span><span className="text-[10px] text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">库存预警</span></div>
                                        <div className="text-xs text-slate-500">任务: 盘点冷柜饮料库存</div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-2 border-l-4 border-blue-500 shadow-sm flex items-start space-x-3 opacity-60">
                                    <div className="bg-blue-50 text-blue-500 p-2 rounded-lg font-bold text-sm text-center min-w-[50px]"><div>STOP</div><div>2</div></div>
                                    <div className="flex-1"><div className="flex justify-between items-center mb-0.5"><span className="font-bold text-base text-slate-800">7-Eleven (海淀黄庄)</span></div><div className="text-xs text-slate-500">任务: 新品陈列检查</div></div>
                                </div>
                            </div>
                            
                            {/* FIXED: 按钮 */}
                            <motion.button whileTap={{ scale: 0.98 }} className="w-full bg-[#07c160] hover:bg-[#06ad56] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center mt-2 transition-colors">
                                <Navigation size={20} className="mr-2"/> 确认并开始导航
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AISalesDemo;