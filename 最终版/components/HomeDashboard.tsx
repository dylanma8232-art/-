import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, ComposedChart, Line, CartesianGrid, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, MapPin, 
  Activity, Database, 
  Store, AlertTriangle, ArrowDownRight, ArrowUpRight, 
  Bot, Download, X, Loader2, Sparkles,
  BarChart3, Rocket, AlertOctagon,
  LayoutTemplate, Trophy, CheckCircle2,
  Megaphone,
  Package
} from 'lucide-react';
import BackgroundMap from './BackgroundMap';

const SEVEN_DAY_DATA = [
    { "date": "T-7", "gmv": 82000, "roi": 4.2, "loss": 1200 },
    { "date": "T-6", "gmv": 91000, "roi": 4.5, "loss": 800 },
    { "date": "T-5", "gmv": 88000, "roi": 4.1, "loss": 2500 },
    { "date": "T-4", "gmv": 90000, "roi": 5.8, "loss": 500 },
    { "date": "T-3", "gmv": 105000, "roi": 6.1, "loss": 1000 },
    { "date": "T-2", "gmv": 110491, "roi": 6.4, "loss": 5200 },
    { "date": "昨日", "gmv": 45000, "roi": 6.2, "loss": 0 }
];
const PLATFORM_MATRIX_DATA = [
  { name: '美团', amount: '¥6,870,250', percent: 62, roi: 7.2, color: 'bg-yellow-400', iconColor: 'bg-yellow-500' },
  { name: '淘宝', amount: '¥2,210,500', percent: 20, roi: 4.5, color: 'bg-orange-500', iconColor: 'bg-orange-600' },
  { name: '京东', amount: '¥1,320,142', percent: 12, roi: 5.8, color: 'bg-red-600', iconColor: 'bg-red-700' },
  { name: '饿了么', amount: '¥660,100', percent: 6, roi: 3.1, color: 'bg-blue-500', iconColor: 'bg-blue-600' },
];
const STOCK_ALERTS = [
  { id: 1, x: 78, y: 55, region: '上海', platform: '饿了么', message: '上海仓缺货：防晒喷雾已售罄', action: '建议调拨 (¥2.4W)', theme: 'red', type: 'STOCK' },
  { id: 2, x: 68, y: 35, region: '北京', platform: '淘宝闪购', message: '北京仓库存周转异常 (低)', action: '建议调拨', theme: 'orange', type: 'STOCK' },
  { id: 3, x: 65, y: 78, region: '深圳', platform: '美团', message: '深圳福田仓爆品缺货', action: '建议调拨 (¥2.0W)', theme: 'red', type: 'STOCK' },
  { id: 5, x: 62, y: 62, region: '武汉', platform: '美团', message: '武汉仓供给告急', action: '备货提醒', theme: 'red', type: 'STOCK' },
];
const TOP_SKU_MONITOR = [
  { name: '睿钛曲奇饼干', gmv: '¥450,200', trend: '+12.5%' },
  { name: '电解质水草莓味', gmv: '¥320,800', trend: '+8.2%' },
  { name: '睿钛蛋白粉', gmv: '¥280,500', trend: '-2.4%' },
  { name: '高纤燕麦片', gmv: '¥150,000', trend: '+5.1%' },
  { name: '黑巧能量棒', gmv: '¥98,200', trend: '+18.4%' },
];
const TOP_CITIES = [
  { name: '上海', value: '¥2,450,000', trend: '+12%' },
  { name: '北京', value: '¥1,850,000', trend: '+8%' },
  { name: '成都', value: '¥1,200,000', trend: '+25%' },
  { name: '广州', value: '¥980,000', trend: '-2%' },
  { name: '杭州', value: '¥820,000', trend: '+5%' },
  { name: '深圳', value: '¥760,000', trend: '-4%' },
  { name: '武汉', value: '¥640,000', trend: '+11%' },
  { name: '南京', value: '¥580,000', trend: '+6%' },
  { name: '西安', value: '¥520,000', trend: '+9%' },
  { name: '重庆', value: '¥490,000', trend: '+15%' },
];
const TOP_MERCHANTS = [
  { name: '屈臣氏 (Watsons)', value: '¥850,000', trend: '+15%' },
  { name: '7-Eleven', value: '¥620,000', trend: '+22%' },
  { name: '罗森 (Lawson)', value: '¥540,000', trend: '+18%' },
  { name: '永辉超市', value: '¥480,000', trend: '+5%' },
  { name: '全家 (FamilyMart)', value: '¥450,000', trend: '+9%' },
  { name: '沃尔玛', value: '¥410,000', trend: '-1%' },
  { name: '盒马鲜生', value: '¥390,000', trend: '+28%' },
  { name: '华润万家', value: '¥350,000', trend: '+4%' },
  { name: '家乐福', value: '¥310,000', trend: '-5%' },
];
const getAlertTheme = (theme) => {
  switch (theme) {
    case 'blue': return { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-white', dot: 'bg-blue-400', shadow: 'shadow-blue-900/50', actionBg: 'bg-blue-900/30', arrow: 'bg-blue-600' };
    case 'orange': return { bg: 'bg-orange-600', border: 'border-orange-400', text: 'text-white', dot: 'bg-orange-400', shadow: 'shadow-orange-900/50', actionBg: 'bg-orange-900/30', arrow: 'bg-orange-600' };
    case 'yellow': return { bg: 'bg-yellow-400', border: 'border-yellow-200', text: 'text-yellow-950', dot: 'bg-yellow-500', shadow: 'shadow-yellow-900/50', actionBg: 'bg-yellow-600/20', arrow: 'bg-yellow-400' };
    case 'red': return { bg: 'bg-red-600', border: 'border-red-400', text: 'text-white', dot: 'bg-red-400', shadow: 'shadow-red-900/50', actionBg: 'bg-red-900/30', arrow: 'bg-red-600' };
    default: return { bg: 'bg-slate-800', border: 'border-slate-600', text: 'text-white', dot: 'bg-slate-400', shadow: 'shadow-slate-900/50', actionBg: 'bg-slate-700/50', arrow: 'bg-slate-800' };
  }
};
const AI_ANALYSIS_DATA = {
  summary: {
    gmv: "96.78万",
    trend: "+2.34%",
    text: "本周品牌 GMV 增长看似稳健，实则结构脆弱。京东到家提供主要增量，但饿了么出现严重价格倒挂，需立即干预。",
    tags: [
      { label: "结构脆弱", color: "orange" },
      { label: "美团高效", color: "emerald" },
      { label: "饿了么异常", color: "rose" }
    ]
  },
  growth: [
    { title: "爆品驱动", value: "+85.4%", sub: "100%番茄汁", desc: "新品贡献绝大部分增量" },
    { title: "渠道爆发", value: "+702%", sub: "便利店 (罗森/7-11)", desc: "小业态增长迅猛" },
    { title: "区域标杆", value: "+2391%", sub: "成都市场", desc: "跨越式增长样板" }
  ],
  drag: [
    { title: "老品老化", value: "-125%", sub: "串装红樱桃", desc: "核心单品严重拖累大盘" },
    { title: "一线失守", value: "-2.6%", sub: "深圳/广州", desc: "高竞争市场集体下滑" },
    { title: "无效投入", value: "0.04%", sub: "联盟券核销率", desc: "ROI极低，预算浪费" }
  ],
  issues: [
    { title: "产品结构断层", text: "极度依赖新品拉动，主力老品失去竞争力，增长不可持续。" },
    { title: "资源错配", text: "预算浪费在低效的 '联盟券' 上，而高效的 '满9减2' 机制未覆盖。" },
    { title: "区域分化", text: "一线城市策略失效，未跑通适合高竞争市场的打法。" }
  ],
  plan: [
    { type: 'urgent', label: '立即止血', text: "对 '串装红樱桃' 进行包装焕新与组合销售，遏制下滑。" },
    { type: 'optimize', label: '调整机制', text: "砍掉联盟券预算，全量加注 ROI 7.05 的 '满9减2' 机制。" },
    { type: 'expand', label: '攻坚一线', text: "成立深/广复苏小组，复制 '成都模式' 进行本地化爆破。" }
  ]
};

const ChinaMapAlertSection = () => {
  const [currentAlert, setCurrentAlert] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev === null ? 0 : (prev + 1) % STOCK_ALERTS.length));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const alert = currentAlert !== null ? STOCK_ALERTS[currentAlert] : null;
  const themeStyles = alert ? getAlertTheme(alert.theme) : getAlertTheme('default');
  return (
    <div className="relative w-full h-full bg-slate-900/40 backdrop-blur rounded-2xl border border-white/10 overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
      <div className="p-3 border-b border-white/5 flex justify-between items-center bg-slate-800/30 z-10">
        <h3 className="font-bold text-white text-sm flex items-center gap-2"><AlertTriangle size={14} className="text-red-400"/> 全域供给预警</h3>
      </div>
      <div className="flex-1 relative p-2 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full select-none flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-[110%] h-[110%] drop-shadow-2xl">
               <defs>
                 <linearGradient id="chinaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                 </linearGradient>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                 </filter>
               </defs>
               <path d="M 120,200 L 150,140 L 220,100 L 300,80 L 350,50 L 450,20 L 520,30 L 600,20 L 650,40 L 700,20 L 720,50 L 700,100 L 730,120 L 700,150 L 650,180 L 620,200 L 680,250 L 700,300 L 680,350 L 650,400 L 600,450 L 550,520 L 500,550 L 450,530 L 400,550 L 350,500 L 300,480 L 250,450 L 200,420 L 150,380 L 100,350 L 80,300 L 60,250 Z" fill="url(#chinaGradient)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" filter="url(#glow)"/>
               <path d="M 120,200 L 150,140 L 220,100 L 300,80 L 350,50 L 450,20 L 520,30 L 600,20 L 650,40 L 700,20 L 720,50 L 700,100 L 730,120 L 700,150 L 650,180 L 620,200 L 680,250 L 700,300 L 680,350 L 650,400 L 600,450 L 550,520 L 500,550 L 450,530 L 400,550 L 350,500 L 300,480 L 250,450 L 200,420 L 150,380 L 100,350 L 80,300 L 60,250 Z" fill="url(#grid)" opacity="0.2" pointerEvents="none"/>
               <ellipse cx="690" cy="420" rx="8" ry="16" fill="url(#chinaGradient)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
               <ellipse cx="520" cy="570" rx="12" ry="8" fill="url(#chinaGradient)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0">
              {STOCK_ALERTS.map((item, index) => {
                const itemStyles = getAlertTheme(item.theme);
                return (
                  <div key={index} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
                    <div className={`relative flex items-center justify-center group`}>
                        <div className={`w-3 h-3 rounded-full z-10 ${currentAlert === index ? 'bg-white shadow-[0_0_15px_white]' : itemStyles.dot} transition-colors duration-300`}></div>
                        {(item.type === 'STOCK' || currentAlert === index) && (<div className={`absolute w-12 h-12 rounded-full border ${itemStyles.border} animate-ping opacity-50`}></div>)}
                    </div>
                  </div>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              {alert && (
                <motion.div 
                    key={alert.id} 
                    /* MODIFICATION 3: Changed y from -40 to -130 to move the popup higher up,
                       preventing it from exceeding the bottom edge (楼层边缘).
                    */
                    initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.8 }} 
                    animate={{ opacity: 1, y: -130, x: '-50%', scale: 1 }} 
                    exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.8 }} 
                    className="absolute z-20 pointer-events-none" 
                    style={{ left: `${alert.x}%`, top: `${alert.y}%` }}
                >
                   <div className={`w-64 ${themeStyles.bg} bg-opacity-95 backdrop-blur-xl border ${themeStyles.border} rounded-xl p-4 shadow-2xl relative overflow-hidden ${themeStyles.shadow}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold flex items-center gap-1 opacity-90 ${themeStyles.text === 'text-yellow-950' ? 'text-yellow-900' : 'text-white'}`}><MapPin size={12}/> {alert.region}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm bg-white/20 backdrop-blur-md ${themeStyles.text}`}>{alert.platform}</span>
                      </div>
                      <div className={`text-lg font-extrabold mb-3 leading-tight ${themeStyles.text}`}>{alert.message}</div>
                      <div className={`rounded-lg p-3 flex items-start gap-2 ${themeStyles.actionBg}`}>
                          <Activity size={16} className={`${themeStyles.text} mt-0.5 shrink-0`}/> 
                          <div className={`text-xs font-bold leading-snug ${themeStyles.text} opacity-90`}>{alert.action}</div>
                      </div>
                      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 ${themeStyles.arrow} border-r border-b ${themeStyles.border}`}></div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

const ContributionRank = () => {
  const [activeTab, setActiveTab] = useState('city');
  const listData = activeTab === 'city' ? TOP_CITIES : TOP_MERCHANTS;
  return (
    <div className="bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-4 h-full flex flex-col">
       <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
          <h3 className="font-bold text-white text-sm flex items-center gap-2"><Trophy size={14} className="text-yellow-400"/> 贡献排行榜</h3>
          <div className="flex bg-slate-800 rounded-lg p-0.5">
             <button onClick={() => setActiveTab('city')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'city' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>城市</button>
             <button onClick={() => setActiveTab('merchant')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'merchant' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>商家</button>
          </div>
       </div>
       <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {listData.map((item, idx) => (
             <div key={idx} className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0">
                 <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-yellow-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-orange-700 text-orange-200' : 'bg-slate-800 text-slate-500'}`}>{idx + 1}</div>
                    <span className="text-sm font-bold text-slate-200">{item.name}</span>
                 </div>
                 <div className="text-right">
                    <div className="text-sm font-mono font-bold text-white">{item.value}</div>
                    <div className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{item.trend}</div>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const HomeDashboard = ({ activeModule, onComplete }) => {
  const [gmv, setGmv] = useState(11049149);
  
  // AI Modal Logic
  const [aiReportOpen, setAiReportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const hasAutoTriggered = useRef(false);
  const reportContainerRef = useRef(null);

  // AI Auto-Trigger Logic
  useEffect(() => {
    // Only if dashboard is visible
    const timer = setTimeout(() => setShowAiPrompt(true), 2000);
    
    const autoDemoTimer = setTimeout(() => {
        if (!hasAutoTriggered.current && !aiReportOpen) {
            handleSimulateGeneration();
            hasAutoTriggered.current = true;
        }
    }, 5000);

    return () => {
        clearTimeout(timer);
        clearTimeout(autoDemoTimer);
    };
  }, [aiReportOpen]);

  const handleSimulateGeneration = () => {
    setShowAiPrompt(false);
    setAiReportOpen(true);
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; 
      });
    }, 40);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setIsGenerating(false);

      // Auto-Scroll Logic
      setTimeout(() => {
         if (reportContainerRef.current) {
             reportContainerRef.current.scrollTo({
                 top: reportContainerRef.current.scrollHeight,
                 behavior: 'smooth'
             });
         }
         
         // Auto-Close after reading time
         setTimeout(() => {
             // Directly finish the module to let DirectorEngine handle transition
             onComplete && onComplete();
         }, 4500);
      }, 800);

    }, 3000);
  };

  const handleExportPDF = () => {
     setTimeout(() => {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
     }, 1000);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden text-sans">
      
      {/* 1. Base Layer: The Canvas Map */}
      <BackgroundMap active={activeModule} />

      {/* 2. Dashboard Overlay Layer */}
      <div 
        className={`absolute inset-0 z-10 p-6 flex flex-col transition-all duration-700 ${
          activeModule ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Success Toast */}
        <AnimatePresence>
            {exportSuccess && (
                <motion.div 
                initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm"
                >
                <CheckCircle2 size={18} />
                分析报告已导出 (PDF)
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- HEADER SECTION --- */}
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center space-x-4">
              <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                  <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 tracking-tight">
                      GrowthEngine<span className="text-cyan-400">.AI</span>
                  </h1>
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="flex flex-col justify-center">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Data Synced: Yesterday (T+1)</span>
                  <p className="text-slate-200 text-xs font-light tracking-wide text-shadow-sm">O2O 全域生意指挥舱</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg z-20 whitespace-nowrap border border-white/20 animate-bounce">
                     ✨ 试试用 AI 解读
                     <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-purple-600 rotate-45 border-r border-t border-white/20"></div>
                 </div>
                 <button onClick={handleSimulateGeneration} className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-purple-900/30 transition-all text-xs font-bold border border-white/10 group">
                     <Sparkles size={14} className="text-purple-100 group-hover:scale-110 transition-transform" /> AI 智能解读
                 </button>
              </div>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              <div className="flex items-center gap-3">
                {['美团', '淘宝', '京东', '饿了么'].map((p, i) => (
                    <div key={i} className={`bg-${['yellow','orange','red','blue'][i]}-500/20 text-${['yellow','orange','red','blue'][i]}-400 border border-${['yellow','orange','red','blue'][i]}-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg`}>
                        <div className={`w-2 h-2 bg-${['yellow','orange','red','blue'][i]}-500 rounded-full animate-pulse`}></div> {p}
                    </div>
                ))}
              </div>
           </div>
        </div>

        {/* Row 2: Command Center Metrics Grid (Zone B & C) */}
        <div className="grid grid-cols-12 gap-4 mb-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
             {/* Group 1: Business */}
             <div className="col-span-3 border-r border-white/10 px-4 flex flex-col justify-center relative">
                <div className="flex items-center gap-2 mb-1"><Database size={14} className="text-blue-400"/><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">全域 GMV</span></div>
                <div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-white font-mono tracking-tight">¥{gmv.toLocaleString()}</span><span className="text-xs font-bold text-emerald-400">+12.4%</span></div>
                <div className="flex items-center gap-2 mt-1 opacity-70"><span className="text-[10px] text-slate-400">活动 GMV:</span><span className="text-xs font-mono text-white">¥3.52M (32%)</span></div>
             </div>
             {/* Group 2: Supply */}
             <div className="col-span-3 border-r border-white/10 px-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1"><Package size={14} className="text-cyan-400"/><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">全网供给</span></div>
                <div className="grid grid-cols-2 gap-2">
                   <div><div className="text-2xl font-bold text-white font-mono">128.4k</div><div className="text-[10px] text-slate-500 uppercase font-bold">全网销量</div></div>
                   <div><div className="text-2xl font-bold text-cyan-400 font-mono">2,410</div><div className="text-[10px] text-slate-500 uppercase font-bold">动销门店</div></div>
                </div>
             </div>
             {/* Group 3: Activity Efficiency */}
             <div className="col-span-6 px-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2"><Activity size={14} className="text-purple-400"/><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">活动能效</span></div>
                <div className="flex items-center justify-between">
                   <div className="flex gap-8">
                      <div><div className="text-2xl font-bold text-white font-mono">¥249,100</div><div className="text-[10px] text-slate-500 uppercase font-bold">活动费用</div></div>
                      <div><div className="text-2xl font-bold text-rose-400 font-mono">15.6%</div><div className="text-[10px] text-slate-500 uppercase font-bold">费比</div></div>
                      <div><div className="text-2xl font-bold text-white font-mono">6.4</div><div className="text-[10px] text-slate-500 uppercase font-bold">ROI</div></div>
                   </div>
                   <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-red-950/60 transition-colors">
                       {/* MODIFICATION 1: Removed the icon container as requested */}
                       <div><div className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1"><AlertOctagon size={10} /> 异常预警 (Critical)</div><div className="text-sm font-bold text-white leading-tight">满199减100 费比倒挂</div></div>
                   </div>
                </div>
             </div>
        </div>

        {/* --- MAIN GRID CONTENT --- */}
        <div className="flex-1 grid grid-cols-12 gap-6 pb-20 min-h-0">
          <div className="col-span-3 flex flex-col space-y-4 min-h-0">
              <div className="flex-1 bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-3 shrink-0"><h3 className="font-bold text-white flex items-center gap-2 text-sm"><LayoutTemplate size={16} className="text-cyan-400"/> 平台分布 (GMV)</h3></div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                      {PLATFORM_MATRIX_DATA.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                              <div className="flex items-center gap-2 w-1/3"><span className="text-sm font-bold text-white leading-tight">{p.name}</span></div>
                              <div className="flex-1 px-2 flex flex-col justify-center"><div className="flex justify-between text-[10px] font-mono font-bold text-slate-300 mb-0.5"><span>{p.amount}</span><span className="text-slate-500">{p.percent}%</span></div><div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${p.color}`} style={{ width: `${p.percent}%` }}></div></div></div>
                              <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${p.roi > 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>{p.roi}</div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="flex-1 bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden">
                 <div className="flex justify-between items-center mb-3 shrink-0"><h3 className="font-bold text-white text-sm flex items-center gap-2"><Rocket size={16} className="text-purple-400"/> 目标商品监控</h3></div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                    {TOP_SKU_MONITOR.slice(0, 4).map((sku, i) => (
                       <div key={i} className="group bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
                          <div className="flex justify-between items-center mb-1"><div className="flex items-center gap-2"><div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold ${i<3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>{i+1}</div><span className="text-xs font-bold text-slate-200">{sku.name}</span></div><div className="text-xs font-mono text-white font-bold">{sku.gmv}</div></div>
                          <div className="flex justify-between items-center"><div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${80 - i*10}%`}}></div></div><span className={`text-[9px] font-bold ${sku.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{sku.trend}</span></div>
                       </div>
                    ))}
                 </div>
              </div>
          </div>
          <div className="col-span-5 flex flex-col space-y-4 min-h-0">
             <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-4 border border-white/10 flex flex-col h-[35%]">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2 border-l-4 border-cyan-400 pl-3"><h3 className="font-bold text-white text-sm">趋势图 (Trend)</h3></div>
                   <div className="flex items-center gap-4 text-[10px]"><div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-cyan-500 rounded-sm"></div><span className="text-slate-300">GMV</span></div><div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-purple-400 rounded-full"></div><span className="text-slate-300">ROI</span></div></div>
                </div>
                <div className="flex-1 w-full min-h-0">
                   <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={SEVEN_DAY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                         <XAxis dataKey="date" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                         <YAxis yAxisId="left" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`}/>
                         <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} domain={[0, 10]} />
                         <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ fontSize: '11px' }} />
                         {/* MODIFICATION 2: Added isAnimationActive={false} to disable dynamic effects */}
                         <Bar yAxisId="left" dataKey="gmv" fill="#22d3ee" barSize={16} radius={[2, 2, 0, 0]} isAnimationActive={false} />
                         <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#a855f7" strokeWidth={2} dot={{r: 2}} isAnimationActive={false} />
                      </ComposedChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="flex-1 min-h-0 bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl overflow-hidden relative">
                 <ChinaMapAlertSection />
             </div>
          </div>
          <div className="col-span-4 flex flex-col min-h-0">
             <div className="h-full"><ContributionRank /></div>
          </div>
        </div>
      </div>

      {/* --- AI ANALYSIS MODAL --- */}
      <AnimatePresence>
          {aiReportOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 pointer-events-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-4xl h-[75vh] bg-[#0f172a] border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
              >
                 <button onClick={() => setAiReportOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white z-50"><X size={24}/></button>
                 <div className="flex-none p-8 border-b border-white/5 flex items-start gap-5 bg-gradient-to-r from-purple-900/20 to-indigo-900/10">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50"><Bot size={32} className="text-white" /></div>
                    <div><h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">AI 智能运营报告 <span className="text-xs font-normal text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Gemini Analysis</span></h2><p className="text-slate-400 text-sm">基于大盘数据生成的深度诊断与策略建议</p></div>
                 </div>
                 <div ref={reportContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 scroll-smooth">
                    {isGenerating ? (
                       <div className="h-full flex flex-col items-center justify-center"><Loader2 size={48} className="text-purple-500 animate-spin mb-4" /><h3 className="text-xl font-bold text-white mb-2">正在生成深度分析报告...</h3><div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden"><motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: `${generationProgress}%` }} /></div><p className="text-slate-500 text-sm mt-4 font-mono">Analyzing {generationProgress}%</p></div>
                    ) : (
                       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                          {/* Report Content */}
                          <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
                             <div className="flex items-center gap-2 mb-4"><BarChart3 className="text-purple-400" size={20}/><h3 className="text-lg font-bold text-white">核心洞察 (Executive Summary)</h3></div>
                             <div className="flex items-start gap-6">
                                <div className="flex-1"><div className="text-4xl font-mono font-bold text-white mb-1">{AI_ANALYSIS_DATA.summary.gmv}</div><div className="text-sm font-bold text-emerald-400 mb-4">{AI_ANALYSIS_DATA.summary.trend}</div><p className="text-slate-300 leading-relaxed text-sm">{AI_ANALYSIS_DATA.summary.text}</p></div>
                                <div className="flex flex-col gap-2">{AI_ANALYSIS_DATA.summary.tags.map((tag, i) => (<span key={i} className={`px-3 py-1 rounded text-xs font-bold bg-${tag.color}-500/10 text-${tag.color}-400 border border-${tag.color}-500/20 text-center`}>{tag.label}</span>))}</div>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/20 pb-2"><ArrowUpRight className="text-emerald-400" size={20}/><h3 className="text-lg font-bold text-emerald-100">增长引擎 (Growth Drivers)</h3></div>
                                <div className="space-y-4">{AI_ANALYSIS_DATA.growth.map((item, i) => (<div key={i} className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/10"><div className="flex justify-between items-center mb-1"><span className="text-emerald-200 font-bold text-sm">{item.title}</span><span className="text-emerald-400 font-mono font-bold text-xs">{item.value}</span></div><div className="text-xs text-emerald-100/70 mb-1">{item.sub}</div><div className="text-[10px] text-emerald-100/50">{item.desc}</div></div>))}</div>
                             </div>
                             <div className="bg-rose-900/10 border border-rose-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-rose-500/20 pb-2"><ArrowDownRight className="text-rose-400" size={20}/><h3 className="text-lg font-bold text-rose-100">风险阻力 (Risk Factors)</h3></div>
                                <div className="space-y-4">{AI_ANALYSIS_DATA.drag.map((item, i) => (<div key={i} className="bg-rose-950/30 p-3 rounded-lg border border-rose-500/10"><div className="flex justify-between items-center mb-1"><span className="text-rose-200 font-bold text-sm">{item.title}</span><span className="text-rose-400 font-mono font-bold text-xs">{item.value}</span></div><div className="text-xs text-rose-100/70 mb-1">{item.sub}</div><div className="text-[10px] text-rose-100/50">{item.desc}</div></div>))}</div>
                             </div>
                          </div>
                          <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5">
                             <div className="flex items-center gap-2 mb-4"><AlertOctagon className="text-yellow-400" size={20}/><h3 className="text-lg font-bold text-white">问题症结 (Core Issues)</h3></div>
                             <div className="grid grid-cols-3 gap-4">{AI_ANALYSIS_DATA.issues.map((issue, i) => (<div key={i} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors"><div className="text-sm font-bold text-yellow-100 mb-2">{i+1}. {issue.title}</div><p className="text-xs text-slate-400 leading-relaxed">{issue.text}</p></div>))}</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-white/10">
                             <div className="flex items-center gap-2 mb-6"><Rocket className="text-blue-400" size={20}/><h3 className="text-lg font-bold text-white">下一步计划 (Action Plan)</h3></div>
                             <div className="space-y-4 relative"><div className="absolute left-6 top-2 bottom-2 w-px bg-slate-700"></div>{AI_ANALYSIS_DATA.plan.map((step, i) => (<div key={i} className="flex items-start gap-4 relative z-10"><div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 border-4 border-[#0f172a] ${step.type === 'urgent' ? 'bg-red-500' : step.type === 'optimize' ? 'bg-blue-500' : 'bg-purple-500'}`}>{i+1}</div><div className="bg-slate-800/80 p-4 rounded-xl border border-white/5 flex-1 shadow-lg"><div className="flex items-center gap-2 mb-1"><span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${step.type === 'urgent' ? 'bg-red-500/20 text-red-300' : step.type === 'optimize' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>{step.label}</span></div><p className="text-sm text-slate-200">{step.text}</p></div></div>))}</div>
                          </div>
                       </div>
                    )}
                 </div>
                 <div className="flex-none p-6 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-xs text-slate-400">Generated by Google Gemini</span></div>
                    <div className="flex gap-3"><button onClick={handleExportPDF} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"><Download size={16}/> 导出 PDF</button><button onClick={() => setAiReportOpen(false)} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-purple-900/30">确认</button></div>
                 </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default HomeDashboard;