import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Smartphone, Navigation, Store, ThermometerSun, ScanLine, Loader2, Database } from 'lucide-react';
import ScenarioIntro from '../ScenarioIntro';

// --- Types & Mock Data ---
type CategoryId = 'eye_care' | 'summer' | 'drinks';

interface Hotspot {
  id: string;
  categoryId: CategoryId;
  x: number;
  y: number;
  categoryName: string;
  demandSource: 'Meituan' | 'Taobao' | 'JD';
  delta: string;
  reason: string;
  storeName: string;
}

interface HeatPoint {
  x: number;
  y: number;
  intensity: number; // 0.0 - 1.0
}

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

// Added Geographic Markers for Jiangsu Context
const MAP_CITIES = [
  { name: "南京", x: 200, y: 420, main: true }, // Provincial Capital
  { name: "苏州", x: 520, y: 460, main: true },
  { name: "无锡", x: 440, y: 450, main: false },
  { name: "常州", x: 380, y: 430, main: false },
  { name: "南通", x: 580, y: 380, main: false },
  { name: "徐州", x: 150, y: 100, main: true }, // North
  { name: "扬州", x: 300, y: 350, main: false },
  { name: "盐城", x: 450, y: 250, main: false },
];

const HEATMAP_DATA: Record<CategoryId, HeatPoint[]> = {
  eye_care: [
    { x: 25, y: 70, intensity: 1.0 },  // Nanjing
    { x: 28, y: 72, intensity: 0.8 },
    { x: 22, y: 68, intensity: 0.7 },
  ],
  summer: [
    { x: 65, y: 75, intensity: 1.0 }, // Suzhou
    { x: 68, y: 72, intensity: 0.9 },
    { x: 55, y: 80, intensity: 0.8 }, // Wuxi
  ],
  drinks: [
    { x: 55, y: 80, intensity: 0.95 }, // Wuxi
    { x: 60, y: 82, intensity: 0.85 },
    { x: 75, y: 40, intensity: 0.6 }, // Lianyungang/Northern Jiangsu
  ]
};

const getHeatColor = (intensity: number) => {
  if (intensity >= 0.8) return 'rgba(239, 68, 68, 0.9)';
  if (intensity >= 0.5) return 'rgba(245, 158, 11, 0.7)';
  return 'rgba(6, 182, 212, 0.4)';
};

const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);
  return <p className="text-sm text-slate-600 leading-relaxed font-mono">{displayedText}</p>;
};

interface SupplyMapDemoProps {
  onComplete?: () => void;
}

// --- Main Component with Automation ---
const SupplyMapDemo: React.FC<SupplyMapDemoProps> = ({ onComplete }) => {
  const [viewMode, setViewMode] = useState<'map' | 'mobile'>('map');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('eye_care');
  const [aiStep, setAiStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // Automation Script
  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const delay = 3500; // Account for intro

    const sequence = [
      // 1. Map View: Cycle Categories
      // Start with eye_care default
      { t: delay + 3000, action: () => setActiveCategory('summer') },
      { t: delay + 6000, action: () => setActiveCategory('drinks') },
      // 3. Transition to Mobile
      { t: delay + 9000, action: () => { setViewMode('mobile'); setIsCalculating(true); } },
      // 4. Mobile AI Steps
      { t: delay + 11000, action: () => { setIsCalculating(false); setAiStep(1); } }, // Options appear
      { t: delay + 13000, action: () => setAiStep(2) }, // Route selected
      // 5. Finish (Autoplay fallback, but user should ideally click)
      { t: delay + 25000, action: () => onComplete && onComplete() }
    ];

    sequence.forEach(step => {
      timeouts.push(setTimeout(step.action, step.t));
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const handleStartNavigation = () => {
      // Finished the demo instead of transitioning to AI Sales
      onComplete && onComplete();
  };

  const activeHotspot = HOTSPOTS.find(h => h.categoryId === activeCategory);
  const activeHeatPoints = HEATMAP_DATA[activeCategory];

  return (
    <div className="h-full w-full relative rounded-2xl overflow-hidden bg-[#080c14] border border-white/10 shadow-2xl font-sans select-none">
      <ScenarioIntro 
        title="全域供给热力图" 
        role="供应链经理" 
        goal="识别全域需求热点与缺货风险" 
      />

      <AnimatePresence mode="wait">
        {viewMode === 'map' && (
          <motion.div 
            key="map-view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* Background Map Graphics - Jiangsu Province Stylized */}
            <div className="absolute inset-0 opacity-80 flex items-center justify-center">
              <svg viewBox="0 0 800 600" className="w-[110%] h-[110%] absolute">
                <defs>
                  <pattern id="grid-supply" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#334155" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="glow-heat">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-supply)" />
                
                {/* Decorative Grid Lines (Lat/Long) */}
                <g stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4">
                    <line x1="0" y1="150" x2="800" y2="150" />
                    <line x1="0" y1="300" x2="800" y2="300" />
                    <line x1="0" y1="450" x2="800" y2="450" />
                    <line x1="200" y1="0" x2="200" y2="600" />
                    <line x1="400" y1="0" x2="400" y2="600" />
                    <line x1="600" y1="0" x2="600" y2="600" />
                </g>

                {/* Stylized Jiangsu Map Shape */}
                <path 
                  d="M 250,50 L 320,20 L 450,40 L 550,60 L 600,100 L 650,150 L 700,200 L 750,250 L 720,350 L 680,450 L 600,500 L 500,550 L 400,520 L 300,500 L 250,450 L 200,400 L 150,350 L 100,250 L 120,150 L 180,100 Z" 
                  fill="url(#mapGradient)" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="2"
                />
                
                {/* Yangtze River Flow */}
                <path
                  d="M 150,350 Q 300,320 400,340 T 700,300"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth="4"
                  strokeDasharray="10 5"
                />

                {/* City Markers & Labels */}
                {MAP_CITIES.map((city, i) => (
                  <g key={i} transform={`translate(${city.x}, ${city.y})`}>
                    {/* Dot */}
                    <circle 
                      r={city.main ? 4 : 2} 
                      fill={city.main ? "white" : "#64748b"} 
                      className={city.main ? "animate-pulse" : ""}
                    />
                    {/* Ripple for main cities */}
                    {city.main && <circle r="8" stroke="white" strokeWidth="1" opacity="0.2" fill="none" />}
                    
                    {/* Text Label */}
                    <text
                      x={8}
                      y={4}
                      fontSize={city.main ? 14 : 10}
                      fontWeight={city.main ? "bold" : "normal"}
                      fill={city.main ? "white" : "rgba(148, 163, 184, 0.8)"}
                      className="pointer-events-none select-none"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      {city.name}
                    </text>
                  </g>
                ))}

                {/* Compass Rose */}
                <g transform="translate(740, 60)" opacity="0.6">
                   <text x="0" y="-20" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="bold">N</text>
                   <path d="M 0,-15 L 5,5 L 0,2 L -5,5 Z" fill="rgba(6, 182, 212, 0.9)" />
                   <circle r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
                </g>

                {activeHeatPoints.map((point, idx) => (
                   <g key={`${activeCategory}-${idx}`}>
                      {/* Core Heat */}
                      <motion.circle
                        cx={`${point.x}%`}
                        cy={`${point.y}%`}
                        r={point.intensity * 80}
                        fill={getHeatColor(point.intensity)}
                        filter="blur(30px)"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        style={{ mixBlendMode: 'screen' }} 
                      />
                      {/* Ripple Lines */}
                      <motion.circle
                         cx={`${point.x}%`}
                         cy={`${point.y}%`}
                         r={point.intensity * 40}
                         stroke={getHeatColor(point.intensity)}
                         strokeWidth="2"
                         fill="none"
                         initial={{ scale: 0.5, opacity: 1 }}
                         animate={{ scale: 2, opacity: 0 }}
                         transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                      />
                   </g>
                ))}
              </svg>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent w-full h-[20%] animate-[scan_3s_linear_infinite] pointer-events-none border-b border-cyan-500/20"></div>
            <style>{`
              @keyframes scan {
                0% { top: -20%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 120%; opacity: 0; }
              }
            `}</style>

            {/* Left Panel: Categories */}
            <div className="absolute top-6 left-6 z-20 space-y-4">
              <div className="bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-white/10 shadow-lg w-72">
                <div className="flex items-center space-x-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400"><ScanLine size={20} className="animate-pulse"/></div>
                  <div><h3 className="font-bold text-white">全域供给热力图</h3><p className="text-[10px] text-gray-400 font-mono">DEMAND SENSING</p></div>
                </div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur p-2 rounded-xl border border-white/10 shadow-lg w-72 space-y-1">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${activeCategory === cat.id ? 'bg-white/10 text-white font-bold border border-white/10' : 'text-gray-400 border border-transparent'}`}>
                    <span>{cat.label}</span>
                    {activeCategory === cat.id && (
                        <div className="flex items-center space-x-2">
                             <span className="text-[10px] text-gray-300">Monitored</span>
                             <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cat.color }}></div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Left Panel: Data Sources */}
            <div className="absolute bottom-6 left-6 z-20">
               <div className="bg-slate-900/80 backdrop-blur px-4 py-3 rounded-xl border border-white/10 shadow-lg flex items-center space-x-4">
                   <div className="flex items-center space-x-2 text-slate-400 border-r border-white/10 pr-4">
                      <Database size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">Data Sources</span>
                   </div>
                   <div className="flex space-x-4">
                      <div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-[#FFC300] rounded-full"></div>
                          <span className="text-xs font-bold text-slate-200">美团 (Meituan)</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-[#FF5000] rounded-full"></div>
                          <span className="text-xs font-bold text-slate-200">淘宝秒送</span>
                      </div>
                   </div>
               </div>
            </div>

            {/* Hotspot Marker on Map */}
            {activeHotspot && (
              <motion.div
                key={activeHotspot.id}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${activeHotspot.x}%`, top: `${activeHotspot.y}%` }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <div className="relative group cursor-pointer">
                   {/* Pulse Effect */}
                   <div className="absolute -inset-8 bg-red-500/20 rounded-full animate-ping"></div>
                   <div className="relative w-10 h-10 rounded-full bg-slate-900 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] z-10">
                      <TrendingUp size={18} />
                   </div>
                   {/* Connecting Line */}
                   <div className="absolute top-5 left-5 w-20 h-px bg-red-500 origin-left rotate-45 z-0"></div>
                </div>
              </motion.div>
            )}

            {/* Dynamic Insight Card (Synchronized) */}
            <AnimatePresence mode="wait">
              {activeHotspot && (
                <motion.div 
                  key={activeHotspot.id}
                  initial={{ x: 50, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-1/3 right-10 w-80 bg-slate-900/90 border-l-4 border-red-500 backdrop-blur-xl rounded-r-xl p-5 z-40 shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-2">
                     <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider bg-red-500/10 px-2 py-1 rounded animate-pulse">缺货预警 • HIGH ALERT</span>
                     <ThermometerSun className="text-red-400" size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">{activeHotspot.categoryName} 需求飙升</h2>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-3">{activeHotspot.delta}</div>
                  
                  <div className="bg-white/5 rounded p-3 mb-3 border border-white/5">
                     <div className="flex items-center text-xs text-gray-300 mb-1">
                        <Store size={12} className="mr-2 text-slate-400"/>
                        <span className="font-bold">{activeHotspot.storeName}</span>
                     </div>
                     <p className="text-xs text-gray-400 italic">"{activeHotspot.reason}"</p>
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-cyan-400">
                        <Smartphone size={14} className="mr-2" />
                        <span>智能调度中...</span>
                      </div>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Mobile View */}
        {viewMode === 'mobile' && (
          <motion.div 
            key="mobile-view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="relative w-[360px] h-[700px] bg-slate-50 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="bg-white pt-10 pb-4 px-6 border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
                  <h2 className="text-lg font-bold text-slate-800">智能调度助手</h2>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">AI</div>
               </div>
               
               <div className="flex-1 bg-slate-50 p-4 space-y-4 overflow-y-auto">
                  {isCalculating ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-70">
                          <Loader2 size={48} className="text-blue-500 animate-spin"/>
                          <div className="text-sm text-slate-500 font-mono">CALCULATING OPTIMAL ROUTE...</div>
                          <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                             <motion.div 
                                className="h-full bg-blue-500" 
                                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }}
                             />
                          </div>
                      </div>
                  ) : (
                    <>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">AI Analysis Complete</span>
                        </div>
                        <TypewriterText text={`检测到全城多点位出现供给缺口。为您规划最优补货路线，预计可挽回GMV ¥12,000。`} />
                      </motion.div>

                      <AnimatePresence>
                      {aiStep >= 1 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <h3 className="text-sm font-bold text-slate-700 px-1">推荐路线：</h3>
                          <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${aiStep === 2 ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-transparent hover:bg-white'}`}>
                              {aiStep === 2 && <motion.div layoutId="highlight" className="absolute inset-0 bg-blue-500/5 pointer-events-none"/>}
                              <div className="flex justify-between items-center mb-2 relative z-10">
                                <span className="font-bold text-slate-800">方案 A: 效率优先 (推荐)</span>
                                <span className="text-xs font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">2h 15m</span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center space-x-4 relative z-10">
                                <span className="flex items-center"><Store size={12} className="mr-1"/> 3 重点门店</span>
                                <span className="flex items-center"><Navigation size={12} className="mr-1"/> 12.5 km</span>
                              </div>
                          </div>
                        </motion.div>
                      )}
                      </AnimatePresence>

                      {aiStep === 2 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-4 mt-auto">
                          <button 
                            onClick={handleStartNavigation}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center hover:scale-[1.02] transition-transform"
                          >
                              <Navigation size={20} className="mr-2" /> 
                              <span className="tracking-wide">开始补货 (调度任务)</span>
                          </button>
                        </motion.div>
                      )}
                    </>
                  )}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplyMapDemo;