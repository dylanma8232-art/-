import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { 
  BarChart3, Map as MapIcon, Cpu, LayoutGrid, Image as ImageIcon, Plus, Globe
} from 'lucide-react';

// ... (Imports and Data Arrays remain unchanged) ...
// Copied existing METRICS_LAYOUT, BUSINESS_MODULES, BRAND_LOGOS from context to ensure integrity
const METRICS_LAYOUT = [
  { id: 'm1', value: 8, suffix: '万+', label: '链接零售商户', subLabel: 'Connected Merchants', type: 'standard', color: 'text-indigo-200' },
  { id: 'm2', value: 50, suffix: '万+', label: '覆盖终端门店', subLabel: 'Retail Terminals', type: 'hero', color: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]' },
  { id: 'm3', value: 300, suffix: '亿+', label: '助力全渠道业绩', subLabel: 'Omnichannel GMV', type: 'super-hero', color: 'text-amber-400', glow: 'shadow-[0_0_50px_rgba(251,191,36,0.6)]' },
  { id: 'm4', value: 200, suffix: '+', label: '服务顶尖品牌', subLabel: 'Top Brands Served', type: 'hero', color: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]' },
  { id: 'm5', value: 3, suffix: '大', label: '主流平台全覆盖', subLabel: 'Major Platforms', type: 'standard', color: 'text-indigo-200' }
];

const BUSINESS_MODULES = [
  { title: "即时零售平台运营", en: "INSTANT RETAIL OPERATIONS", icon: BarChart3, border: "border-blue-500", glow: "group-hover:shadow-blue-500/50" },
  { title: "全域供需管理", en: "TOTAL SUPPLY & DEMAND ", icon: MapIcon, border: "border-emerald-500", glow: "group-hover:shadow-emerald-500/50" },
  { title: "线下渠道 AI 赋能", en: "OFFLINE CHANNEL AI", icon: Cpu, border: "border-purple-500", glow: "group-hover:shadow-purple-500/50" }
];

const BRAND_LOGOS = [
  { name: "蒙牛", en: "MENGNIU" },
  { name: "益海嘉里", en: "YIHAI KERRY" },
  { name: "立白", en: "LIBY" },
  { name: "雀巢", en: "NESTLÉ" },
  { name: "舒适达", en: "SENSODYNE" },
  { name: "好丽友", en: "ORION" },
  { name: "家乐", en: "KNORR" },
  { name: "百事", en: "PEPSI" },
  { name: "佳沛", en: "ZESPRI" },
  { name: "达能", en: "DANONE" },
];

// ... (ParticleNetwork, RisingDataStream, DeepSeaBackground components remain same as context) ...
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles: {x: number, y: number, vx: number, vy: number}[] = [];
    const particleCount = 70; 
    for (let i = 0; i < particleCount; i++) {
      particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.fillStyle = 'rgba(100, 240, 255, 0.4)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x; const dy = p.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 180) {
                ctx.beginPath(); ctx.strokeStyle = `rgba(100, 240, 255, ${0.15 * (1 - dist / 180)})`;
                ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
    const handleResize = () => { if(canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

const RisingDataStream = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
             <div key={i} className="absolute text-cyan-500/10 font-mono text-xs leading-none select-none font-bold"
                style={{ left: `${Math.random() * 100}%`, bottom: '-100px', animation: `rise ${10 + Math.random() * 15}s linear infinite`, animationDelay: `${Math.random() * -20}s`, writingMode: 'vertical-lr', textOrientation: 'upright' }}>
                {Array(30).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
             </div>
        ))}
    </div>
);

const DeepSeaBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#020617] pointer-events-none">
    <style>{`
      @keyframes blob { 0% { transform: translate(0px, 0px) scale(1) rotate(0deg); } 33% { transform: translate(30px, -50px) scale(1.1) rotate(20deg); } 66% { transform: translate(-20px, 20px) scale(0.9) rotate(-10deg); } 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); } }
      .animate-blob { animation: blob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
      .animate-shimmer-text { background: linear-gradient(90deg, #ffffff 0%, #94a3b8 40%, #ffffff 50%, #94a3b8 60%, #ffffff 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 3s ease-in-out infinite; }
      @keyframes rise { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-120vh); opacity: 0; } }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes breathe-border { 0%, 100% { border-color: rgba(255,255,255,0.1); } 50% { border-color: rgba(34,211,238,0.5); box-shadow: 0 0 20px rgba(34,211,238,0.1); } }
      .animate-breathe-border { animation: breathe-border 3s ease-in-out infinite; }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
      .animate-float { animation: float 6s ease-in-out infinite; }
    `}</style>
    <div className="absolute top-[-10%] left-[10%] w-[900px] h-[900px] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
    <div className="absolute top-[20%] right-[5%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-[20%] left-[25%] w-[1000px] h-[1000px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
    <RisingDataStream />
    <ParticleNetwork />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
  </div>
);

const AnimatedCounter: React.FC<{ value: number; suffix?: string; delay?: number }> = ({ value, suffix = '', delay = 0 }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());
  useEffect(() => {
    const t = setTimeout(() => spring.set(value), delay);
    return () => clearTimeout(t);
  }, [value, spring, delay]);
  return <span className="inline-flex items-baseline tracking-tight"><motion.span>{display}</motion.span>{suffix && <span className="ml-1 text-[0.4em] font-normal opacity-90">{suffix}</span>}</span>;
};

// --- MAIN COMPONENT MODIFIED ---
const CompanyIntro: React.FC<{ active?: boolean; onComplete?: () => void }> = ({ active = false }) => {
  return (
    <div className={`h-full w-full relative overflow-hidden flex flex-col font-sans text-white transition-all duration-1000 
      ${active ? 'blur-xl opacity-30 pointer-events-none' : 'scale-100 opacity-100'}`}>
      
      <DeepSeaBackground />

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center w-full h-full max-w-[2400px] mx-auto p-12 lg:p-16 pb-32">
        
        {/* 1. HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="flex flex-col items-center text-center mt-6 mb-16 relative"
        >
          <div className="flex items-center justify-center gap-8 mb-4">
             <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)] backdrop-blur-md flex-shrink-0 overflow-hidden relative">
                 <svg viewBox="0 0 512 512" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
                    <path fill="white" d="M0 0h512v512H0z" opacity="0"/>
                    <path d="M166 126H266C340 126 386 160 386 226C386 260 376 280 366 296C386 276 396 256 396 226C396 150 340 116 266 116H156V326H166V126Z" fill="#009A44"/>
                    <path d="M156 116V436H226V326H266L346 436H426L336 316C360 306 386 280 386 226C386 160 340 126 266 126H166V116H156Z" fill="#0072CE"/>
                    <path d="M226 186H266C300 186 316 200 316 226C316 252 300 266 266 266H226V186Z" fill="white" fillOpacity="1"/> 
                 </svg>
             </div>
             <h1 className="text-8xl lg:text-9xl font-black italic tracking-tighter animate-shimmer-text drop-shadow-2xl">
               Retail<span className="text-cyan-400">AIM</span>
             </h1>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">全域零售 AI 解决方案专家</h2>
            <h3 className="text-2xl lg:text-3xl font-light text-slate-300 tracking-[0.2em] uppercase opacity-90">打通即时零售与线下门店协同增长的全渠道引擎</h3>
          </div>
        </motion.div>

        {/* 2. CORE METRICS */}
        <div className="w-full grid grid-cols-5 gap-8 mb-16 relative px-4 items-end">
              {METRICS_LAYOUT.map((m, i) => {
                 const isSuperHero = m.type === 'super-hero';
                 const isHero = m.type === 'hero';
                 let heightClass = isSuperHero ? "h-[320px]" : isHero ? "h-[260px]" : "h-[220px]";
                 let valueSizeClass = isSuperHero ? "text-8xl lg:text-9xl" : isHero ? "text-7xl lg:text-8xl" : "text-7xl lg:text-8xl";
                 let labelSizeClass = isSuperHero ? "text-3xl lg:text-4xl font-extrabold text-amber-100" : isHero ? "text-2xl lg:text-3xl font-bold text-cyan-50" : "text-2xl lg:text-3xl font-bold text-slate-200";
                 let animationClass = isSuperHero ? "" : "animate-breathe-border bg-white/5";

                 return (
                    <motion.div key={m.id} initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 60 }} className={`relative w-full ${isSuperHero ? 'z-20' : 'z-10'}`}>
                       {isSuperHero ? (
                          <div className={`relative ${heightClass} w-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(251,191,36,0.3)]`}>
                              <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#fbbf24_360deg)] animate-[spin-slow_4s_linear_infinite] opacity-80"></div>
                              <div className="absolute inset-[3px] bg-slate-900/90 backdrop-blur-xl rounded-[22px] flex flex-col items-center justify-center p-4">
                                  <div className={`font-black tracking-tighter ${m.color} ${valueSizeClass} flex items-baseline justify-center relative z-10 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]`}>
                                      <AnimatedCounter value={m.value} suffix={m.suffix} delay={1000 + i*150} />
                                  </div>
                                  <div className="flex flex-col items-center mt-2 relative z-10">
                                      <div className={`tracking-widest leading-tight ${labelSizeClass}`}>{m.label}</div>
                                      <div className="text-sm lg:text-base font-mono text-amber-200/60 uppercase tracking-widest mt-1">{m.subLabel}</div>
                                  </div>
                              </div>
                          </div>
                       ) : (
                          <div className={`relative flex flex-col items-center justify-center text-center backdrop-blur-xl border-2 rounded-3xl transition-all duration-500 w-full shadow-2xl ${heightClass} ${m.glow || ''} ${animationClass} border-white/10`}>
                              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                              <div className={`font-black tracking-tighter ${m.color} ${valueSizeClass} flex items-baseline justify-center relative z-10 drop-shadow-lg`}>
                                  <AnimatedCounter value={m.value} suffix={m.suffix} delay={1000 + i*150} />
                              </div>
                              <div className="flex flex-col items-center mt-2 relative z-10">
                                  <div className={`tracking-widest leading-tight ${labelSizeClass}`}>{m.label}</div>
                                  <div className="text-sm lg:text-base font-mono text-slate-400 uppercase tracking-widest mt-1 opacity-80">{m.subLabel}</div>
                              </div>
                          </div>
                       )}
                    </motion.div>
                 );
              })}
        </div>

        {/* 3. MODULES */}
        <div className="w-full max-w-[1800px] flex flex-col items-center relative z-20 mb-10">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex items-center gap-3 mb-8 opacity-90">
              <Globe size={24} className="text-cyan-400 animate-spin-slow" />
              <span className="text-lg font-bold tracking-[0.3em] text-cyan-200 uppercase">Growth Engine Modules</span>
           </motion.div>
           <div className="grid grid-cols-3 gap-10 w-full">
              {BUSINESS_MODULES.map((mod, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 + i * 0.1 }} style={{ animationDelay: `${i * 1.5}s` }}
                   className={`relative group cursor-pointer overflow-hidden animate-float h-48 bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-3xl flex flex-col items-center justify-center text-center p-8 hover:border-${mod.border.split('-')[1]}-400/50 transition-all duration-300 shadow-2xl ${mod.glow}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-${mod.border.split('-')[1]}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                       <mod.icon className={`w-16 h-16 text-${mod.border.split('-')[1]}-400 group-hover:text-white group-hover:scale-110 transition-all duration-300`} strokeWidth={1.5} />
                       <div>
                          <h3 className="text-3xl lg:text-4xl font-bold text-white group-hover:text-cyan-100 mb-2 tracking-wide">{mod.title}</h3>
                          <p className="text-sm font-mono text-slate-400 tracking-widest group-hover:text-slate-200">{mod.en}</p>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* 4. BRAND WALL */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }} className="w-full max-w-[1600px] mt-4">
           <div className="bg-white/5 border border-white/10 rounded-full px-10 py-4 backdrop-blur-xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
               <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#020617] to-transparent z-10"></div>
               <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#020617] to-transparent z-10"></div>
               <div className="flex items-center gap-8 px-4">
                  <div className="flex items-center gap-4 shrink-0 border-r border-white/10 pr-8 mr-4">
                      <LayoutGrid size={28} className="text-cyan-400" />
                      <span className="text-xl font-bold text-white tracking-widest uppercase whitespace-nowrap">Trusted Partners</span>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    <div className="flex animate-[marquee_40s_linear_infinite] items-center gap-10 h-24">
                      {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 shrink-0 opacity-70 hover:opacity-100 transition-all cursor-default group">
                             <div className="w-32 h-16 bg-white/10 border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:bg-white/15 group-hover:border-white/20 transition-all">
                                <div className="absolute inset-0 flex items-center justify-center text-white/20"><ImageIcon size={20} /></div>
                                <span className="relative z-10 text-xs font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">{brand.en}</span>
                             </div>
                             <span className="text-xs text-slate-500 font-medium tracking-wide group-hover:text-slate-400">{brand.name}</span>
                          </div>
                      ))}
                      <div className="flex items-center gap-4 shrink-0 opacity-100 pl-6 border-l border-white/10 ml-4">
                           <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.2)]"><Plus size={24} className="text-cyan-400" /></div>
                           <div className="flex flex-col"><span className="text-2xl font-bold text-cyan-300 italic tracking-wider">And More...</span><span className="text-xs text-cyan-400/70 font-mono tracking-wider">GLOBAL NETWORK</span></div>
                      </div>
                      <div className="w-32 shrink-0"></div> 
                    </div>
                  </div>
               </div>
           </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CompanyIntro;