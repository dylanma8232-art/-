import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, CreditCard, ChevronLeft, MoreHorizontal, PlusCircle, Smile, Mic, ChevronRight } from 'lucide-react';
import { DEMO_PLAYLIST } from '../../configs/DemoPlaylist';

// --- FIXED: Responsive Tablet Wrapper (h-[80vh]) ---
const TabletWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-[80vh] aspect-[3/4] max-h-[900px] bg-[#ededed] shadow-2xl flex flex-col overflow-hidden border-[12px] border-slate-800 rounded-[45px] mx-auto my-auto relative">
      {children}
  </div>
);

interface Message { id: number; type: 'user' | 'agent' | 'system'; content: string; card?: { title: string; desc: string; image: string; }; timestamp: number; }

const TypingIndicator = () => (
  <div className="flex space-x-2 bg-white p-4 rounded-xl w-20 items-center justify-center h-12"><div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div><div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div><div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div></div>
);

const PrivateDomainDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCommission, setShowCommission] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // 1. 添加 Ref 来引用聊天列表容器
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 读取统一配置
  const timeline = DEMO_PLAYLIST.find(s => s.id === 'eye')?.timeline || { userMsg: 1000, aiHint: 2500, typing: 4500, agentMsg: 6000, cardMsg: 7500, commission: 10500, userReply: 13000, finish: 16000 };

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const script = [
      { t: timeline.userMsg, action: () => addMsg({ id: 1, type: 'user', content: '你好，想问下宝宝最近不爱喝现在的奶粉了，有推荐吗？', timestamp: 0 }) },
      { t: timeline.aiHint, action: () => setShowAISuggestion(true) }, 
      { t: timeline.typing, action: () => { setShowAISuggestion(false); setIsTyping(true); } },
      { t: timeline.agentMsg, action: () => { setIsTyping(false); addMsg({ id: 2, type: 'agent', content: '宝妈您好！宝宝多大了呢？最近转季很多宝宝会有厌奶期。我们刚到了款“小金领”适合肠胃娇嫩的宝宝，口味很清淡。', timestamp: 0 }); } },
      { t: timeline.cardMsg, action: () => addMsg({ id: 3, type: 'agent', content: '给您发个附近门店的小程序，现在下单有活动，30分钟就能送到家试用一下。', card: { title: '美团超市 - 世纪公园店', desc: '距离您 2.8km | 预计 30分钟送达', image: 'Store' }, timestamp: 0 }) },
      { t: timeline.commission, action: () => setShowCommission(true) }, 
      { t: timeline.userReply, action: () => addMsg({ id: 4, type: 'user', content: '已经下单了，显示马上就送过来，真快！谢谢啦', timestamp: 0 }) },
      { t: timeline.finish, action: () => onComplete && onComplete() }
    ];
    script.forEach(step => { timeouts.push(setTimeout(step.action, step.t)); });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // 2. 添加 Effect：每当消息、输入状态或提示变化时，自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isTyping, showAISuggestion, showCommission]);

  const addMsg = (msg: Message) => { setMessages(prev => [...prev, msg]); };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-900 relative overflow-hidden rounded-2xl font-sans text-slate-900 border border-white/10">
      <TabletWrapper>
        <div className="bg-[#ededed] px-8 pt-16 pb-5 flex items-center justify-between border-b border-slate-300/50 z-10"><div className="flex items-center"><ChevronLeft size={32} className="text-slate-900"/><span className="font-medium text-2xl ml-2">金牌导购-小雅</span></div><MoreHorizontal size={32} /></div>
        
        {/* 3. 绑定 ref 到滚动容器 */}
        <div ref={chatContainerRef} className="flex-1 p-8 overflow-y-auto space-y-8 relative scroll-smooth">
          <div className="flex justify-center mb-8"><span className="text-base text-gray-400 bg-black/5 px-4 py-2 rounded">下午 2:30</span></div>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'}`}>
              {msg.type === 'user' && (<div className="w-14 h-14 rounded bg-white mr-4 flex items-center justify-center border border-gray-200 flex-shrink-0"><User size={28} className="text-gray-400"/></div>)}
              <div className="max-w-[75%]">
                {msg.content && (<div className={`p-6 rounded-2xl text-xl leading-relaxed shadow-sm relative ${msg.type === 'agent' ? 'bg-[#95ec69] text-black' : 'bg-white text-black'}`}><div className={`absolute top-6 w-4 h-4 rotate-45 ${msg.type === 'agent' ? '-right-2 bg-[#95ec69]' : '-left-2 bg-white'}`}></div><span className="relative z-10">{msg.content}</span></div>)}
                {msg.card && (<div className="mt-3 bg-white rounded-2xl p-5 shadow-sm w-80 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"><div className="flex items-start mb-4"><div className="w-14 h-14 bg-[#FFC300] rounded-xl flex items-center justify-center mr-4 text-black/80"><span className="font-bold text-lg">美团</span></div><div><div className="font-bold text-xl text-black">{msg.card.title}</div><div className="text-base text-gray-500 mt-2">{msg.card.desc}</div></div></div><div className="border-t border-gray-100 pt-4 mt-3 text-base text-gray-400 flex justify-between items-center"><span>小程序</span><ChevronLeft size={20} className="rotate-180"/></div></div>)}
              </div>
              {msg.type === 'agent' && (<div className="w-14 h-14 rounded bg-blue-600 ml-4 flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-sm">小雅</div>)}
            </motion.div>
          ))}
          {isTyping && (<div className="flex justify-end"><TypingIndicator /><div className="w-14 h-14 rounded bg-blue-600 ml-4 flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-sm">小雅</div></div>)}
          <AnimatePresence>{showAISuggestion && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute bottom-8 left-8 right-8 bg-blue-50 border border-blue-200 p-6 rounded-3xl shadow-lg z-20 cursor-pointer hover:bg-blue-100 transition-colors"><div className="flex items-center justify-between mb-3"><div className="flex items-center space-x-3"><Bot size={24} className="text-blue-600"/><span className="text-lg font-bold text-blue-600">AI 话术推荐 (根据历史订单分析)</span></div><span className="text-sm text-blue-400 bg-blue-100 px-3 py-1.5 rounded">点击发送</span></div><p className="text-lg text-slate-700 leading-normal">宝妈您好！宝宝多大了呢？最近转季很多宝宝会有厌奶期。我们刚到了款“小金领”适合肠胃娇嫩的宝宝...</p></motion.div>)}</AnimatePresence>
        </div>
        <div className="bg-[#f7f7f7] px-6 py-5 border-t border-slate-300 flex items-center justify-between z-20"><Mic size={36} className="text-slate-600 stroke-[1.5]"/><div className="flex-1 mx-5 bg-white h-14 rounded-xl flex items-center px-5 text-gray-400 text-xl border border-gray-200">输入消息...</div><Smile size={36} className="text-slate-600 mr-5 stroke-[1.5]"/><PlusCircle size={36} className="text-slate-600 stroke-[1.5]"/></div>
        <AnimatePresence>{showCommission && (<motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} className="absolute top-0 left-6 right-6 bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-3xl p-5 z-50 border border-gray-200 flex items-center"><div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mr-5 shrink-0"><CreditCard size={28} /></div><div><div className="font-bold text-xl text-slate-800">推广奖励到账</div><div className="text-base text-gray-500">用户已在美团完成订单，佣金 <span className="text-orange-500 font-bold">+3.00元</span></div></div></motion.div>)}</AnimatePresence>
      </TabletWrapper>
    </div>
  );
};

export default PrivateDomainDemo;