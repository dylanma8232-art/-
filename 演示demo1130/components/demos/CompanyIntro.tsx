import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { 
  BarChart3, Map as MapIcon, Cpu, LayoutGrid, Image as ImageIcon, Plus, Globe
} from 'lucide-react';

// --- CONFIG & DATA ---

// Updated Metrics for the 5-card symmetric layout
const METRICS_LAYOUT = [
  { 
    id: 'm1', 
    value: 8, 
    suffix: '万+', 
    label: '链接零售商户', 
    subLabel: 'Connected Merchants',
    type: 'standard',
    color: 'text-indigo-200'
  },
  { 
    id: 'm2', 
    value: 50, 
    suffix: '万+', 
    label: '覆盖终端门店', 
    subLabel: 'Retail Terminals',
    type: 'hero',
    color: 'text-cyan-400',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]'
  },
  { 
    id: 'm3', 
    value: 300, 
    suffix: '亿+', 
    label: '助力全渠道业绩', 
    subLabel: 'Omnichannel GMV',
    type: 'super-hero', // Largest, Gold
    color: 'text-amber-400', 
    glow: 'shadow-[0_0_50px_rgba(251,191,36,0.6)]'
  },
  { 
    id: 'm4', 
    value: 200, 
    suffix: '+', 
    label: '服务顶尖品牌', 
    subLabel: 'Top Brands Served',
    type: 'hero',
    color: 'text-cyan-400',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.3)]'
  },
  { 
    id: 'm5', 
    value: 3, 
    suffix: '大', 
    label: '主流平台全覆盖', 
    subLabel: 'Major Platforms',
    type: 'standard',
    color: 'text-indigo-200'
  }
];

// 3 Core Modules
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

// --- SUB-COMPONENTS ---

// Particle Network Background
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
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw Particles and Lines
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw Dot
        ctx.fillStyle = 'rgba(100, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 180) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 240, 255, ${0.15 * (1 - dist / 180)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      });
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// Rising Data Stream
const RisingDataStream = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
             <div 
                key={i}
                className="absolute text-cyan-500/10 font-mono text-xs leading-none select-none font-bold"
                style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '-100px',
                    animation: `rise ${10 + Math.random() * 15}s linear infinite`,
                    animationDelay: `${Math.random() * -20}s`,
                    writingMode: 'vertical-lr',
                    textOrientation: 'upright'
                }}
             >
                {Array(30).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')}
             </div>
        ))}
    </div>
);

// 1. Deep Sea Aurora Background
const DeepSeaBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#020617] pointer-events-none">
    <style>{`
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
        33% { transform: translate(30px, -50px) scale(1.1) rotate(20deg); }
        66% { transform: translate(-20px, 20px) scale(0.9) rotate(-10deg); }
        100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
      }
      .animate-blob {
        animation: blob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
      }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .animate-shimmer-text {
        background: linear-gradient(90deg, #ffffff 0%, #94a3b8 40%, #ffffff 50%, #94a3b8 60%, #ffffff 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: shimmer 3s ease-in-out infinite;
      }

      /* New Animations */
      @keyframes rise {
        0% { transform: translateY(0); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(-120vh); opacity: 0; }
      }

      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes breathe-border {
        0%, 100% { border-color: rgba(255,255,255,0.1); }
        50% { border-color: rgba(34,211,238,0.5); box-shadow: 0 0 20px rgba(34,211,238,0.1); }
      }
      
      .animate-breathe-border {
         animation: breathe-border 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      /* --- FIXED: Marquee Animation Explicit Class --- */
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 40s linear infinite;
      }
      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `}</style>
    
    {/* Aurora Blobs */}
    <div className="absolute top-[-10%] left-[10%] w-[900px] h-[900px] bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
    <div className="absolute top-[20%] right-[5%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-[20%] left-[25%] w-[1000px] h-[1000px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
    
    {/* Dynamic Layers */}
    <RisingDataStream />
    <ParticleNetwork />
    
    {/* Holographic Grid Overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
  </div>
);

// 2. Animated Counter
const AnimatedCounter: React.FC<{ value: number; suffix?: string; delay?: number }> = ({ value, suffix = '', delay = 0 }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    const t = setTimeout(() => spring.set(value), delay);
    return () => clearTimeout(t);
  }, [value, spring, delay]);

  return (
    <span className="inline-flex items-baseline tracking-tight">
      <motion.span>{display}</motion.span>
      {suffix && <span className="ml-1 text-[0.4em] font-normal opacity-90">{suffix}</span>}
    </span>
  );
};

// --- MAIN COMPONENT ---

const CompanyIntro: React.FC<{ active?: boolean; onComplete?: () => void }> = ({ active = false }) => {
  return (
    <div className={`h-full w-full relative overflow-hidden flex flex-col font-sans text-white transition-all duration-1000 
      ${active ? 'blur-xl opacity-30 pointer-events-none' : 'scale-100 opacity-100'}`}>
      
      <DeepSeaBackground />

      {/* Content Container - 使用 Flex-col 和 justify-between 确保内容均匀分布 */}
      <div className="relative z-10 flex-1 flex flex-col justify-between items-center w-full h-full max-w-[2400px] mx-auto p-4 md:p-8 lg:p-10 pb-20 lg:pb-24">
        
        {/* 1. HEADER (Compact margin) */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="flex flex-col items-center text-center mt-4"
        >
          <div className="flex items-center justify-center gap-6 mb-2">
             <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)] backdrop-blur-md flex-shrink-0 overflow-hidden relative">
                 {/* RetailAIM Logo SVG */}
                 <svg viewBox="0 0 512 512" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet">
                    <path fill="white" d="M0 0h512v512H0z" opacity="0"/>
                    <path d="M166 126H266C340 126 386 160 386 226C386 260 376 280 366 296C386 276 396 256 396 226C396 150 340 116 266 116H156V326H166V126Z" fill="#009A44"/>
                    <path d="M156 116V436H226V326H266L346 436H426L336 316C360 306 386 280 386 226C386 160 340 126 266 126H166V116H156Z" fill="#0072CE"/>
                    <path d="M226 186H266C300 186 316 200 316 226C316 252 300 266 266 266H226V186Z" fill="white" fillOpacity="1"/> 
                 </svg>
             </div>
             <h1 className="text-7xl lg:text-8xl font-black italic tracking-tighter animate-shimmer-text drop-shadow-2xl">
               Retail<span className="text-cyan-400">AIM</span>
             </h1>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">全域零售 AI 解决方案专家</h2>
          <h3 className="text-lg lg:text-xl font-light text-slate-300 tracking-[0.15em] uppercase opacity-90 mt-2">
            打通即时零售与线下门店协同增长的全渠道引擎
          </h3>
        </motion.div>

        {/* 2. CORE METRICS (Adjusted heights) */}
        <div className="w-full grid grid-cols-5 gap-4 lg:gap-8 px-4 items-end">
              {METRICS_LAYOUT.map((m, i) => {
                 const isSuperHero = m.type === 'super-hero';
                 const isHero = m.type === 'hero';
                 // Reduce heights slightly for better fit
                 let heightClass = isSuperHero ? "h-[260px] lg:h-[300px]" : isHero ? "h-[200px] lg:h-[240px]" : "h-[160px] lg:h-[200px]";
                 let valueSizeClass = isSuperHero ? "text-7xl lg:text-9xl" : isHero ? "text-6xl lg:text-8xl" : "text-5xl lg:text-7xl";
                 let labelSizeClass = isSuperHero ? "text-2xl lg:text-4xl font-extrabold text-amber-100" : isHero ? "text-xl lg:text-3xl font-bold text-cyan-50" : "text-lg lg:text-2xl font-bold text-slate-200";
                 let animationClass = isSuperHero ? "" : "animate-breathe-border bg-white/5";

                 return (
                    <motion.div key={m.id} initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 60 }} className={`relative w-full ${isSuperHero ? 'z-20' : 'z-10'}`}>
                       <div className={`relative flex flex-col items-center justify-center text-center backdrop-blur-xl border-2 rounded-3xl transition-all duration-500 w-full shadow-2xl ${heightClass} ${m.glow || ''} ${animationClass} border-white/10 overflow-hidden`}>
                          {isSuperHero && <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#fbbf24_360deg)] animate-[spin-slow_4s_linear_infinite] opacity-80"></div>}
                          {isSuperHero && <div className="absolute inset-[3px] bg-slate-900/90 rounded-[22px] z-0"></div>}
                          
                          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                              <div className={`font-black tracking-tighter ${m.color} ${valueSizeClass} flex items-baseline justify-center drop-shadow-lg`}>
                                  <AnimatedCounter value={m.value} suffix={m.suffix} delay={800 + i*100} />
                              </div>
                              <div className={`tracking-widest leading-tight ${labelSizeClass} mt-2`}>{m.label}</div>
                              <div className="text-xs lg:text-sm font-mono text-slate-400 uppercase tracking-widest mt-1 opacity-80">{m.subLabel}</div>
                          </div>
                       </div>
                    </motion.div>
                 );
              })}
        </div>

        {/* 3. MODULES (Reduced height) */}
        <div className="w-full max-w-[1600px] flex flex-col items-center relative z-20">
           <div className="grid grid-cols-3 gap-6 lg:gap-10 w-full">
              {BUSINESS_MODULES.map((mod, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 + i * 0.1 }}
                   className={`relative group cursor-pointer overflow-hidden animate-float h-36 lg:h-44 bg-slate-900/40 backdrop-blur-2xl border border-white/20 rounded-3xl flex flex-col items-center justify-center text-center p-4 hover:border-${mod.border.split('-')[1]}-400/50 transition-all duration-300 shadow-2xl ${mod.glow}`}>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                       <mod.icon className={`w-10 h-10 lg:w-14 lg:h-14 text-${mod.border.split('-')[1]}-400 group-hover:text-white transition-all duration-300`} strokeWidth={1.5} />
                       <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-cyan-100 tracking-wide">{mod.title}</h3>
                          <p className="text-xs font-mono text-slate-400 tracking-widest">{mod.en}</p>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* 4. BRAND WALL (Fixed Scrolling) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }} className="w-full max-w-[1400px]">
           <div className="bg-white/5 border border-white/10 rounded-full px-6 py-3 backdrop-blur-xl relative overflow-hidden shadow-2xl">
               <div className="flex items-center gap-6 px-4">
                  <div className="flex items-center gap-3 shrink-0 border-r border-white/10 pr-6 mr-2">
                      <LayoutGrid size={24} className="text-cyan-400" />
                      <span className="text-lg font-bold text-white tracking-widest uppercase whitespace-nowrap">Trusted Partners</span>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    {/* FIXED: Using direct CSS class .animate-marquee */}
                    <div className="flex animate-marquee items-center gap-8 h-16">
                      {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 shrink-0 opacity-70 hover:opacity-100 transition-all cursor-default group">
                             <div className="w-24 h-10 bg-white/10 border border-white/5 rounded flex items-center justify-center relative overflow-hidden group-hover:bg-white/15 transition-all">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-white">{brand.en}</span>
                             </div>
                          </div>
                      ))}
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