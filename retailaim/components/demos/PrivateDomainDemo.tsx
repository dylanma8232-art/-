
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, CreditCard, ChevronLeft, MoreHorizontal, PlusCircle, Smile, Mic } from 'lucide-react';
import ScenarioIntro from '../ScenarioIntro';

interface Message {
  id: number;
  type: 'user' | 'agent' | 'system';
  content: string;
  card?: {
    title: string;
    desc: string;
    image: string;
  };
  timestamp: number; // delay in ms
}

const TypingIndicator = () => (
  <div className="flex space-x-1 bg-white p-2 rounded-lg w-12 items-center justify-center h-8">
     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
     <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

const PrivateDomainDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCommission, setShowCommission] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Script Timeline
  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const delay = 3500; 

    const script = [
      { t: delay + 1000, action: () => addMsg({ id: 1, type: 'user', content: '你好，想问下宝宝最近不爱喝现在的奶粉了，有推荐吗？', timestamp: 0 }) },
      { t: delay + 2500, action: () => setShowAISuggestion(true) }, // AI Hint appears
      { t: delay + 4500, action: () => {
          setShowAISuggestion(false);
          setIsTyping(true);
        } 
      },
      { t: delay + 6000, action: () => {
          setIsTyping(false);
          addMsg({ id: 2, type: 'agent', content: '宝妈您好！宝宝多大了呢？最近转季很多宝宝会有厌奶期。我们刚到了款“小金领”适合肠胃娇嫩的宝宝，口味很清淡。', timestamp: 0 });
        }
      },
      { t: delay + 7500, action: () => addMsg({ 
          id: 3, 
          type: 'agent', 
          content: '给您发个附近门店的小程序，现在下单有活动，30分钟就能送到家试用一下。', 
          card: {
            title: '美团超市 - 世纪公园店',
            desc: '距离您 2.8km | 预计 30分钟送达',
            image: 'Store'
          },
          timestamp: 0 
        }) 
      },
      { t: delay + 10500, action: () => setShowCommission(true) }, // Commission Notification
      { t: delay + 13000, action: () => addMsg({ id: 4, type: 'user', content: '已经下单了，显示马上就送过来，真快！谢谢啦', timestamp: 0 }) },
      { t: delay + 16000, action: () => onComplete && onComplete() }
    ];

    script.forEach(step => {
      const timer = setTimeout(step.action, step.t);
      timeouts.push(timer);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const addMsg = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-900 relative overflow-hidden rounded-2xl font-sans text-slate-900 border border-white/10">
      <ScenarioIntro 
        title="私域即时触达" 
        role="导购员" 
        goal="O2O即时转化" 
      />

      {/* Mobile Frame */}
      <div className="w-[375px] h-[700px] bg-[#ededed] shadow-2xl flex flex-col overflow-hidden border-[8px] border-slate-800 rounded-[40px]">
        
        {/* Header */}
        <div className="bg-[#ededed] px-4 pt-12 pb-3 flex items-center justify-between border-b border-slate-300/50 z-10">
          <div className="flex items-center">
            <ChevronLeft size={24} className="text-slate-900"/>
            <span className="font-medium text-lg ml-1">金牌导购-小雅</span>
          </div>
          <MoreHorizontal size={24} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 relative scroll-smooth">
          
          {/* Time Stamp */}
          <div className="flex justify-center mb-4">
             <span className="text-xs text-gray-400 bg-black/5 px-2 py-1 rounded">下午 2:30</span>
          </div>

          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              {msg.type === 'user' && (
                 <div className="w-10 h-10 rounded bg-white mr-3 flex items-center justify-center border border-gray-200 flex-shrink-0">
                    <User size={20} className="text-gray-400"/>
                 </div>
              )}

              <div className="max-w-[70%]">
                {msg.content && (
                  <div className={`p-3 rounded-lg text-sm leading-relaxed shadow-sm relative ${
                    msg.type === 'agent' ? 'bg-[#95ec69] text-black' : 'bg-white text-black'
                  }`}>
                    {/* Bubble Arrow */}
                    <div className={`absolute top-3 w-3 h-3 rotate-45 ${
                         msg.type === 'agent' ? '-right-1.5 bg-[#95ec69]' : '-left-1.5 bg-white'
                    }`}></div>
                    <span className="relative z-10">{msg.content}</span>
                  </div>
                )}
                
                {msg.card && (
                  <div className="mt-2 bg-white rounded-lg p-3 shadow-sm w-64 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-start mb-2">
                       <div className="w-10 h-10 bg-[#FFC300] rounded flex items-center justify-center mr-3 text-black/80">
                          <span className="font-bold text-xs">美团</span>
                       </div>
                       <div>
                          <div className="font-bold text-sm text-black">{msg.card.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{msg.card.desc}</div>
                       </div>
                    </div>
                    <div className="border-t border-gray-100 pt-2 mt-2 text-xs text-gray-400 flex justify-between items-center">
                       <span>小程序</span>
                       <ChevronLeft size={12} className="rotate-180"/>
                    </div>
                  </div>
                )}
              </div>

              {msg.type === 'agent' && (
                 <div className="w-10 h-10 rounded bg-blue-600 ml-3 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
                    小雅
                 </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
             <div className="flex justify-end">
                <TypingIndicator />
                <div className="w-10 h-10 rounded bg-blue-600 ml-3 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
                   小雅
                </div>
             </div>
          )}

          {/* AI Assistant Suggestion Overlay */}
          <AnimatePresence>
            {showAISuggestion && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-4 left-4 right-4 bg-blue-50 border border-blue-200 p-3 rounded-xl shadow-lg z-20 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                   <div className="flex items-center space-x-1">
                      <Bot size={14} className="text-blue-600"/>
                      <span className="text-xs font-bold text-blue-600">AI 话术推荐 (根据历史订单分析)</span>
                   </div>
                   <span className="text-[10px] text-blue-400 bg-blue-100 px-1.5 rounded">点击发送</span>
                </div>
                <p className="text-xs text-slate-700 leading-normal">
                   宝妈您好！宝宝多大了呢？最近转季很多宝宝会有厌奶期。我们刚到了款“小金领”适合肠胃娇嫩的宝宝...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="bg-[#f7f7f7] px-4 py-3 border-t border-slate-300 flex items-center justify-between z-20">
           <Mic size={28} className="text-slate-600 stroke-[1.5]"/>
           <div className="flex-1 mx-3 bg-white h-10 rounded flex items-center px-3 text-gray-400 text-sm border border-gray-200">
              输入消息...
           </div>
           <Smile size={28} className="text-slate-600 mr-3 stroke-[1.5]"/>
           <PlusCircle size={28} className="text-slate-600 stroke-[1.5]"/>
        </div>

        {/* Commission Notification Overlay */}
        <AnimatePresence>
          {showCommission && (
            <motion.div 
              initial={{ y: -100 }} animate={{ y: 12 }} exit={{ y: -100 }}
              className="absolute top-0 left-3 right-3 bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl p-3 z-50 border border-gray-200 flex items-center"
            >
               <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mr-3 shrink-0">
                  <CreditCard size={20} />
               </div>
               <div>
                  <div className="font-bold text-sm text-slate-800">推广奖励到账</div>
                  <div className="text-xs text-gray-500">用户已在美团完成订单，佣金 <span className="text-orange-500 font-bold">+3.00元</span></div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default PrivateDomainDemo;
