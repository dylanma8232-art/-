
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Target, BrainCircuit, Activity, FileText, CheckCircle2 } from 'lucide-react';

// ------------------------------------------------------------------
// 配置区域：视频链接 
// ------------------------------------------------------------------
const VIDEO_URLS = {
  // 主视频 (千里眼演示视频)
  MAIN_FEED: "https://netresource.retailaim.com/video/qly/%E5%8D%83%E9%87%8C%E7%9C%BC%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4",
  // 旋转眼镜 (设备展示)
  GLASSES_HUD: "https://netresource.retailaim.com/video/qly/%E6%97%8B%E8%BD%AC%E7%9C%BC%E9%95%9C.mp4"
};
// ------------------------------------------------------------------

const VideoFeedPlaceholder: React.FC = () => (
  <div className="w-full h-full bg-black relative overflow-hidden rounded-2xl border border-slate-700 shadow-inner group">
    
    {/* 1. 背景层：模糊填充 (解决黑边问题，营造氛围) */}
    <video
      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-110"
      src={VIDEO_URLS.MAIN_FEED}
      autoPlay
      loop
      muted
      playsInline
    />

    {/* 2. 前景层：完整显示 (object-contain 保证不拉伸变形) */}
    <video
      className="absolute inset-0 w-full h-full object-contain z-10"
      src={VIDEO_URLS.MAIN_FEED}
      autoPlay
      loop
      muted
      playsInline
    />
    
    {/* 3. 科技网格叠加 (在视频之上，增加质感) */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-20 pointer-events-none opacity-30"></div>
    
    {/* 左上角 HUD */}
    <div className="absolute top-4 left-4 text-cyan-500 font-mono text-xs flex flex-col gap-1 z-30 bg-black/40 p-2 rounded backdrop-blur-sm border border-cyan-500/20">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> REC 00:04:23</div>
        <div className="opacity-70">ISO 800 | F/2.8</div>
    </div>
  </div>
);

interface AnalysisLog {
  id: number;
  time: string;
  type: 'info' | 'success' | 'alert' | 'report';
  text: string;
  detail?: string;
  reportContent?: {
      title: string;
      summary: string;
  }
}

const ClairvoyanceDemo: React.FC<{ onComplete?: () => void; timeline?: any }> = ({ onComplete, timeline: propTimeline }) => {
  const [logs, setLogs] = useState<AnalysisLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到底部 (确保只在内部滚动，不影响整个页面)
  useEffect(() => {
    // 使用 setTimeout 确保 DOM 渲染更新后再滚动
    const timer = setTimeout(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ 
                top: scrollRef.current.scrollHeight, 
                behavior: 'smooth' 
            });
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [logs]);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    const addLog = (text: string, type: 'info' | 'success' | 'alert' | 'report' = 'info', detail?: string, reportContent?: any) => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      setLogs(prev => [...prev, { id: Date.now(), time: timeStr, type, text, detail, reportContent }]);
    };

    const script = [
      { t: 1000, action: () => addLog('正在连接 AI 智能眼镜终端...', 'info') },
      
      // 00:00 - 00:14 门店入口
      { t: 4000, action: () => addLog('区域识别：门店入口', 'info', '监测到工作人员站立引导，顾客秩序良好，无拥堵。') },
      
      // 00:15 - 00:30 商品陈列 (巧克力)
      { t: 16000, action: () => addLog('商品识别：Kirkland 巧克力卷', 'success', '价格：¥99.90/盒 | 效期：2026-08-05\n陈列状态：整齐堆叠，标签合规。') },
      
      // 00:31 - 00:57 家电 (除螨仪)
      { t: 32000, action: () => addLog('商品识别：友望智能除螨仪', 'success', '型号：CM2401 | 价格：¥349.90\n状态：包装完整，功能卡清晰。') },
      
      // 00:58 - End 环境与人流
      { t: 58000, action: () => addLog('全场环境分析', 'info', '通道畅通，促销氛围活跃，试吃服务正常开展。') },
      
      // 生成报告
      { t: 65000, action: () => addLog('巡店任务完成，报告已生成', 'report', '', {
          title: 'Costco 开市客 巡店报告',
          summary: '门店整体运营正常，入口引导规范。重点区域（食品/家电）陈列整齐，价格及参数标注清晰。场内促销氛围活跃，顾客流动有序，员工服务态度良好，符合运营标准。'
      })},

      // 结束回调
      { t: 72000, action: () => onComplete && onComplete() }
    ];

    script.forEach(step => timeouts.push(setTimeout(step.action, step.t)));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full w-full bg-slate-950 relative overflow-hidden flex flex-col font-sans p-4 lg:p-8 text-white">
      
      {/* 头部标题栏 */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 shrink-0 h-[80px]">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                 <Scan size={28} className="text-cyan-400 relative z-10" />
                 <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full scale-150 border-dashed animate-[spin_10s_linear_infinite]"></div>
             </div>
             
             <div>
                 <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    千里眼 <span className="text-sm font-normal not-italic text-slate-400 ml-2 tracking-widest font-mono">PROJECT CLAIRVOYANCE</span>
                 </h1>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-emerald-400 font-mono tracking-wide">SYSTEM ONLINE • V4.2.0</span>
                 </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-cyan-400">RADAR ACTIVE</span>
                <span className="text-[10px] text-slate-500">Lat: 31.2304 | Long: 121.4737</span>
             </div>
             <div className="relative w-10 h-10 flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border border-cyan-500/50 animate-ping"></div>
                 <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
             </div>
          </div>
      </div>

      {/* 主内容区 - Grid Ratio Adjusted to 7:5 */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 relative">
          
          {/* 左侧：主视频区 */}
          <div className="col-span-7 flex flex-col relative h-full">
              <div className="flex items-center justify-between mb-2 shrink-0">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <Target size={16} className="text-red-400" /> REAL-TIME FEED
                  </h3>
                  <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400 font-mono">CAM_01</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-emerald-400 font-mono">LIVE</span>
                  </div>
              </div>
              <div className="flex-1 relative min-h-0">
                  <VideoFeedPlaceholder />
              </div>
          </div>

          {/* 右侧：AI 分析面板 */}
          {/* 使用绝对定位布局来确保 Header 和 Footer 固定，中间区域滚动，且不影响父级页面滚动 */}
          <div className="col-span-5 flex flex-col h-full relative">
              <div className="absolute inset-0 bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  
                  {/* 1. Header (Fixed Top) */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-slate-800/90 backdrop-blur z-30 border-b border-white/10 flex items-center justify-between px-6">
                      <h3 className="font-bold text-cyan-400 flex items-center gap-2 text-xl">
                          <BrainCircuit size={24} /> AI COGNITION
                      </h3>
                      <Activity size={24} className="text-emerald-500 animate-pulse" />
                  </div>

                  {/* 2. Logs Stream (Scrollable Middle) */}
                  {/* Note: top-20 to clear header, bottom-44 to clear footer */}
                  <div 
                    className="absolute top-20 bottom-44 left-0 right-0 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth z-10"
                    ref={scrollRef}
                  >
                      {/* Gradient overlay for fade effect at top */}
                      <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
                      
                      <AnimatePresence initial={false}>
                          {logs.map((log) => {
                              if (log.type === 'report') {
                                  return (
                                      <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 relative"
                                      >
                                          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-3xl">
                                              <FileText size={32} />
                                              {log.reportContent?.title}
                                          </div>
                                          <p className="text-xl text-slate-300 leading-relaxed text-justify">
                                              {log.reportContent?.summary}
                                          </p>
                                          <div className="mt-5 flex items-center justify-end">
                                              <span className="text-base bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded flex items-center gap-2 font-bold">
                                                  <CheckCircle2 size={18}/> 已自动归档
                                              </span>
                                          </div>
                                      </motion.div>
                                  );
                              }
                              return (
                                  <motion.div 
                                    key={log.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="border-l-4 border-slate-700 pl-6 py-2 relative group"
                                  >
                                      <div className={`absolute -left-[10px] top-4 w-5 h-5 rounded-full border-4 border-slate-900 ${
                                          log.type === 'alert' ? 'bg-purple-500' : 
                                          log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                                      }`}></div>
                                      <div className="text-base font-mono text-slate-400 mb-1">{log.time}</div>
                                      <div className={`text-3xl font-bold mb-3 leading-tight ${
                                          log.type === 'success' ? 'text-emerald-300' : 'text-slate-100'
                                      }`}>{log.text}</div>
                                      {log.detail && (
                                          <div className="text-xl text-cyan-100/80 font-normal leading-relaxed whitespace-pre-wrap mt-2">
                                              {log.detail}
                                          </div>
                                      )}
                                  </motion.div>
                              );
                          })}
                      </AnimatePresence>
                      {/* 底部缓冲空间 */}
                      <div className="h-8"></div>
                  </div>

                  {/* 3. Footer with Floating Glasses Card (Fixed Bottom) */}
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-slate-900/95 backdrop-blur-xl z-30 border-t border-white/10 p-4 flex items-center justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                      
                      {/* 设备连接卡片 */}
                      <div className="bg-white rounded-2xl w-full h-full relative overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.15)] flex items-center justify-center border-4 border-white/90 group">
                          
                          {/* 左上角状态 */}
                          <div className="absolute top-4 left-5 z-20 flex items-center gap-3">
                             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-sm font-bold text-slate-800 tracking-wider">AI GLASSES CONNECTED</span>
                          </div>
                          
                          {/* 右上角信号 */}
                          <div className="absolute top-4 right-5 z-20 text-slate-800 opacity-50">
                             <div className="flex gap-[4px] items-end h-5">
                                <div className="w-1.5 h-2 bg-current rounded-sm"></div>
                                <div className="w-1.5 h-3 bg-current rounded-sm"></div>
                                <div className="w-1.5 h-5 bg-current rounded-sm"></div>
                             </div>
                          </div>

                          {/* 旋转眼镜视频 (无边框，白底融合) */}
                          <div className="w-full h-full flex items-center justify-center pt-2">
                             <video 
                                src={VIDEO_URLS.GLASSES_HUD}
                                className="w-[85%] h-[85%] object-contain scale-125" 
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                          </div>

                          {/* 扫描动效 */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[30%] w-full animate-[scan_3s_linear_infinite] pointer-events-none border-b border-cyan-500/20"></div>
                      </div>
                  </div>

              </div>
          </div>

      </div>
    </div>
  );
};

export default ClairvoyanceDemo;
        