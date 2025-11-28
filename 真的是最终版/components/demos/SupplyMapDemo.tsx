import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Smartphone, Navigation, Store, ThermometerSun, ScanLine, Loader2, Database } from 'lucide-react';

// --- Types & Mock Data ---
type CategoryId = 'eye_care' | 'summer' | 'drinks';
interface Hotspot { id: string; categoryId: CategoryId; x: number; y: number; categoryName: string; demandSource: 'Meituan' | 'Taobao' | 'JD'; delta: string; reason: string; storeName: string; }
interface HeatPoint { x: number; y: number; intensity: number; }

const CATEGORIES: { id: CategoryId; label: string; color: string }[] = [
  { id: 'eye_care', label: '眼部护理', color: '#3b82f6' },
  { id: 'summer', label: '防晒清凉', color: '#f59e0b' },
  { id: 'drinks', label: '功能饮料', color: '#10b981' },
];
const HOTSPOTS: Hotspot[] = [
  { id: 'h1', categoryId: 'eye_care', x: 25, y: 70, categoryName: '眼部护理', demandSource: 'Meituan', delta: '+320%', reason: '南京：新街口商圈写字楼用眼疲劳', storeName: '屈臣氏(新街口店)' },
  { id: 'h2', categoryId: 'summer', x: 65, y: 75, categoryName: '防晒喷雾', demandSource: 'Taobao', delta: '+150%', reason: '苏州：金鸡湖景区户外活动增加', storeName: '7-11(苏州中心店)' },
  { id: 'h3', categoryId: 'drinks', x: 55, y: 80, categoryName: '电解质水', demandSource: 'JD', delta: '+210%', reason: '无锡：太湖马拉松赛事期间需求暴涨', storeName: '全家(无锡海岸城)' },
];
const MAP_CITIES = [
  { name: "南京", x: 200, y: 420, main: true }, { name: "苏州", x: 520, y: 460, main: true }, { name: "无锡", x: 440, y: 450, main: false },
  { name: "常州", x: 380, y: 430, main: false }, { name: "南通", x: 580, y: 380, main: false }, { name: "徐州", x: 150, y: 100, main: true },
  { name: "扬州", x: 300, y: 350, main: false }, { name: "盐城", x: 450, y: 250, main: false },
];
const HEATMAP_DATA: Record<CategoryId, HeatPoint[]> = {
  eye_care: [{ x: 25, y: 70, intensity: 1.0 }, { x: 28, y: 72, intensity: 0.8 }, { x: 22, y: 68, intensity: 0.7 }],
  summer: [{ x: 65, y: 75, intensity: 1.0 }, { x: 68, y: 72, intensity: 0.9 }, { x: 55, y: 80, intensity: 0.8 }],
  drinks: [{ x: 55, y: 80, intensity: 0.95 }, { x: 60, y: 82, intensity: 0.85 }, { x: 75, y: 40, intensity: 0.6 }]
};
const getHeatColor = (intensity: number) => {
  if (intensity >= 0.8) return 'rgba(239, 68, 68, 0.9)';
  if (intensity >= 0.5) return 'rgba(245, 158, 11, 0.7)';
  return 'rgba(6, 182, 212, 0.4)';
};

// --- Tablet Wrapper (Unified Style) ---
const TabletWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-[80vh] aspect-[3/4] max-h-[900px] bg-slate-50 rounded-[40px] border-[12px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative mx-auto my-auto">
      {children}
  </div>
);

const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayedText((prev) => prev + text.charAt(i)); i++; } else { clearInterval(timer); onComplete && onComplete(); }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);
  return <p className="text-lg text-slate-600 leading-relaxed font-mono">{displayedText}</p>;
};

const SupplyMapDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [viewMode, setViewMode] = useState<'map' | 'mobile'>('map');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('eye_care');
  const [aiStep, setAiStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const delay = 500; // 减少初始延迟，因为 Controller 已经播放过 Intro 了
    const sequence = [
      { t: delay + 3000, action: () => setActiveCategory('summer') },
      { t: delay + 6000, action: () => setActiveCategory('drinks') },
      { t: delay + 9000, action: () => { setViewMode('mobile'); setIsCalculating(true); } },
      { t: delay + 11000, action: () => { setIsCalculating(false); setAiStep(1); } },
      { t: delay + 13000, action: () => setAiStep(2) },
      { t: delay + 25000, action: () => onComplete && onComplete() }
    ];
    sequence.forEach(step => timeouts.push(setTimeout(step.action, step.t)));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const handleStartNavigation = () => { onComplete && onComplete(); };
  const activeHotspot = HOTSPOTS.find(h => h.categoryId === activeCategory);
  const activeHeatPoints = HEATMAP_DATA[activeCategory];

  return (
    <div className="h-full w-full relative rounded-2xl overflow-hidden bg-[#080c14] border border-white/10 shadow-2xl font-sans select-none flex items-center justify-center">
      {/* 移除 ScenarioIntro 防止双重弹窗 */}
      
      <AnimatePresence mode="wait">
        {viewMode === 'map' && (
          <motion.div key="map-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }} className="absolute inset-0 w-full h-full flex items-center justify-center">
            {/* Map Graphics */}
            <div className="absolute inset-0 opacity-80 flex items-center justify-center">
              <svg viewBox="0 0 800 600" className="w-[110%] h-[110%] absolute">
                <defs>
                  <pattern id="grid-supply" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/></pattern>
                  <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" /><stop offset="100%" stopColor="#334155" stopOpacity="0.9" /></linearGradient>
                  <filter id="glow-heat"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-supply)" />
                <path d="M 250,50 L 320,20 L 450,40 L 550,60 L 600,100 L 650,150 L 700,200 L 750,250 L 720,350 L 680,450 L 600,500 L 500,550 L 400,520 L 300,500 L 250,450 L 200,400 L 150,350 L 100,250 L 120,150 L 180,100 Z" fill="url(#mapGradient)" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                {MAP_CITIES.map((city, i) => ( <g key={i} transform={`translate(${city.x}, ${city.y})`}><circle r={city.main ? 5 : 3} fill={city.main ? "white" : "#64748b"} className={city.main ? "animate-pulse" : ""} /><text x={12} y={6} fontSize={14} fill={city.main ? "white" : "rgba(148, 163, 184, 0.8)"}>{city.name}</text></g>))}
                {activeHeatPoints.map((point, idx) => ( <g key={`${activeCategory}-${idx}`}><motion.circle cx={`${point.x}%`} cy={`${point.y}%`} r={point.intensity * 80} fill={getHeatColor(point.intensity)} filter="blur(30px)" initial={{ opacity: 0 }} animate={{ opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 4, repeat: Infinity }} /></g>))}
              </svg>
            </div>
            
            {/* Left Panel */}
            <div className="absolute top-8 left-8 z-20 space-y-4">
              <div className="bg-slate-900/80 backdrop-blur p-5 rounded-2xl border border-white/10 shadow-lg w-80">
                <div className="flex items-center space-x-3"><div className="bg-cyan-500/20 p-2.5 rounded-lg text-cyan-400"><ScanLine size={24} className="animate-pulse"/></div><div><h3 className="font-bold text-white text-lg">全域供给热力图</h3><p className="text-xs text-gray-400 font-mono">DEMAND SENSING</p></div></div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur p-2 rounded-xl border border-white/10 shadow-lg w-80 space-y-1">
                {CATEGORIES.map((cat) => ( <div key={cat.id} className={`flex items-center justify-between px-4 py-3 rounded-lg text-base transition-all ${activeCategory === cat.id ? 'bg-white/10 text-white font-bold border border-white/10' : 'text-gray-400 border border-transparent'}`}><span>{cat.label}</span>{activeCategory === cat.id && <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: cat.color }}></div>}</div>))}
              </div>
            </div>

            {/* Insight Card */}
            <AnimatePresence mode="wait">
              {activeHotspot && (
                <motion.div key={activeHotspot.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} transition={{ duration: 0.4 }} className="absolute top-1/3 right-12 w-96 bg-slate-900/90 border-l-4 border-red-500 backdrop-blur-xl rounded-r-xl p-6 z-40 shadow-2xl">
                  <div className="flex items-start justify-between mb-3"><span className="text-xs font-bold uppercase text-red-400 tracking-wider bg-red-500/10 px-2 py-1 rounded animate-pulse">缺货预警 • HIGH ALERT</span><ThermometerSun className="text-red-400" size={20} /></div>
                  <h2 className="text-xl font-bold text-white mb-1">{activeHotspot.categoryName} 需求飙升</h2>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">{activeHotspot.delta}</div>
                  <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/5"><div className="flex items-center text-sm text-gray-300 mb-1"><Store size={14} className="mr-2 text-slate-400"/><span className="font-bold text-base">{activeHotspot.storeName}</span></div><p className="text-sm text-gray-400 italic">"{activeHotspot.reason}"</p></div>
                  <div className="flex items-center justify-between"><div className="flex items-center text-sm text-cyan-400"><Smartphone size={16} className="mr-2" /><span>智能调度中...</span></div><div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Tablet View */}
        {viewMode === 'mobile' && (
          <motion.div key="mobile-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
            <TabletWrapper>
               <div className="bg-white pt-10 pb-6 px-8 border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
                  <h2 className="text-2xl font-bold text-slate-800">智能调度助手 (Tablet)</h2>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">AI</div>
               </div>
               <div className="flex-1 bg-slate-50 p-8 space-y-6 overflow-y-auto">
                  {isCalculating ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-70"><Loader2 size={64} className="text-blue-500 animate-spin"/><div className="text-xl text-slate-500 font-mono">CALCULATING OPTIMAL ROUTE...</div><div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden"><motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} /></div></div>
                  ) : (
                    <>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
                        <div className="flex items-center space-x-3 mb-4"><div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div><span className="text-base font-bold text-blue-600 uppercase tracking-wider">AI Analysis Complete</span></div>
                        <TypewriterText text={`检测到全城多点位出现供给缺口。AI 已规划最优补货路线，预计可挽回 GMV ¥12,000。`} />
                      </motion.div>
                      <AnimatePresence>
                      {aiStep >= 1 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <h3 className="text-xl font-bold text-slate-700 px-1">推荐路线：</h3>
                          <div className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${aiStep === 2 ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-transparent hover:bg-white'}`}>
                              {aiStep === 2 && <motion.div layoutId="highlight" className="absolute inset-0 bg-blue-500/5 pointer-events-none"/>}
                              <div className="flex justify-between items-center mb-4 relative z-10"><span className="font-bold text-2xl text-slate-800">方案 A: 效率优先 (推荐)</span><span className="text-sm font-mono text-blue-600 bg-blue-100 px-4 py-1.5 rounded">2h 15m</span></div>
                              <div className="text-lg text-slate-500 flex items-center space-x-8 relative z-10"><span className="flex items-center"><Store size={20} className="mr-2"/> 3 重点门店</span><span className="flex items-center"><Navigation size={20} className="mr-2"/> 12.5 km</span></div>
                          </div>
                        </motion.div>
                      )}
                      </AnimatePresence>
                      {aiStep === 2 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-8 mt-auto">
                          <button onClick={handleStartNavigation} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 rounded-2xl font-bold shadow-xl text-2xl flex items-center justify-center hover:scale-[1.02] transition-transform">
                              <Navigation size={32} className="mr-4" /> <span className="tracking-wide">开始补货 (调度任务)</span>
                          </button>
                        </motion.div>
                      )}
                    </>
                  )}
               </div>
            </TabletWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplyMapDemo;