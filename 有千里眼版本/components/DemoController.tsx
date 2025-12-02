
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DEMO_PLAYLIST } from '../configs/DemoPlaylist';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import CompanyIntro from './demos/CompanyIntro'; 
import ScenarioIntro from './ScenarioIntro';

const DemoController = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0); 
  const [isIntroPhase, setIsIntroPhase] = useState(false);
  
  const [showPanel, setShowPanel] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  
  // FIX 1: 增加首次渲染标记，防止初始时间为0时直接跳过第一页
  const isFirstRender = useRef(true);

  const currentScene = DEMO_PLAYLIST[currentIndex];
  // FIX: Type safe for browser env
  const timerRef = useRef<number | null>(null);

  const DEFAULT_INTRO_DURATION = 3500;

  // 1. Initialize Scene (切换场景时重置时间)
  useEffect(() => {
    // 切换场景时，如果是自然播放，不需要重置 manualOverride
    // 但为了确保新场景能正常跑，我们确保 isPlaying 为 true (除非被人工暂停了)
    
    if (currentScene.intro) {
        setIsIntroPhase(true);
        setPhaseTimeLeft(currentScene.intro.duration || DEFAULT_INTRO_DURATION);
    } else {
        setIsIntroPhase(false);
        setPhaseTimeLeft(currentScene.duration);
    }
  }, [currentIndex]);

  // 2. Timer Logic (计时器)
  useEffect(() => {
    if (!isPlaying || manualOverride) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
    }
    
    timerRef.current = window.setInterval(() => {
      setPhaseTimeLeft((prev) => {
        // 只有当时间确实 > 0 时才倒计时，防止负数
        if (prev <= 100) {
          return 0; 
        }
        return prev - 100;
      });
    }, 100);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, manualOverride]);

  // 3. Phase Completion Listener (时间到，切换下一阶段)
  useEffect(() => {
      // FIX 1: 如果是首次渲染，直接跳过，等待 Initialize Scene 设置正确时间
      if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
      }

      if (phaseTimeLeft === 0 && isPlaying && !manualOverride) {
          handlePhaseComplete();
      }
  }, [phaseTimeLeft, isPlaying, manualOverride]);

  const handlePhaseComplete = () => {
      if (isIntroPhase) {
          // Intro 结束 -> 进入 Content
          setIsIntroPhase(false);
          setPhaseTimeLeft(currentScene.duration);
      } else {
          // Content 结束 -> 下一个场景
          handleNext();
      }
  };

  const handleNext = () => {
    // 循环播放逻辑：如果是最后一个，回到第一个
    if (currentIndex === DEMO_PLAYLIST.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleJump = (index: number) => {
      setCurrentIndex(index);
      // FIX 2: 点击跳转后，强制继续播放，不暂停，不锁定
      // 这样用户点击任意模块后，演示会从该模块开始继续自动循环
      setIsPlaying(true);
      setManualOverride(false); 
  };

  // 如果暂停了，或者被锁定了，显示暂停图标
  const togglePlay = () => {
      if (isPlaying) {
          // 用户主动暂停 -> 开启锁定
          setIsPlaying(false);
          setManualOverride(true); 
      } else {
          // 用户主动播放 -> 解除锁定
          setIsPlaying(true);
          setManualOverride(false);
      }
  }

  const isIntroScene = currentScene.id === 'intro';
  const totalDuration = isIntroPhase ? (currentScene.intro?.duration || DEFAULT_INTRO_DURATION) : currentScene.duration;
  
  // 防止除以0 NaN
  const progress = totalDuration > 0 ? (1 - phaseTimeLeft / totalDuration) * 100 : 0;

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 font-sans">
      
      {/* LAYER 1: Persistent Background */}
      <div className="absolute inset-0 z-0">
         <CompanyIntro active={!isIntroScene} />
      </div>

      {/* LAYER 2: Overlay Scenes */}
      <AnimatePresence mode="wait">
        {!isIntroScene && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none">
             
             {isIntroPhase && currentScene.intro ? (
                 // Phase A: Intro Card
                 <motion.div
                    key={`intro-${currentScene.id}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="pointer-events-auto w-full h-full flex items-center justify-center"
                 >
                    <ScenarioIntro 
                        title={currentScene.intro.title}
                        role={currentScene.intro.role}
                        goal={currentScene.intro.goal}
                    />
                 </motion.div>
             ) : (
                 // Phase B: Demo Content
                 <motion.div
                    key={`content-${currentScene.id}`}
                    initial={{ scale: 0.9, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full max-w-6xl h-[85vh] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto relative"
                 >
                     <currentScene.component 
                        timeline={currentScene.timeline}
                        onComplete={() => {
                            if (!manualOverride) setTimeout(handleNext, 500);
                        }}
                     />
                 </motion.div>
             )}
          </div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 z-50 bg-white/5">
          <div 
            className={`h-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(6,182,212,0.8)] ${isIntroPhase ? 'bg-purple-500' : 'bg-cyan-500'}`}
            style={{ width: `${progress}%` }} 
          />
      </div>

      {/* Control Panel */}
      <div 
        className="absolute bottom-0 left-0 w-full h-16 z-[9999] flex justify-center items-end hover:h-auto group transition-all"
        onMouseEnter={() => setShowPanel(true)}
        onMouseLeave={() => setShowPanel(false)}
      >
         <div className="bg-slate-950/90 backdrop-blur-xl text-white p-6 rounded-t-2xl border-t border-white/10 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out w-[700px] shadow-2xl flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
               <div>
                   <h3 className="font-bold text-lg text-cyan-400 flex items-center gap-2">
                       <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-xs border border-cyan-500/30">SCENE {currentIndex + 1}</span>
                       {currentScene.title} 
                       {isIntroPhase && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 rounded border border-purple-500/30">INTRO</span>}
                   </h3>
               </div>
               <div className="font-mono text-sm text-slate-400 bg-black/30 px-3 py-1 rounded-lg">
                   {(phaseTimeLeft/1000).toFixed(1)}s
               </div>
            </div>
            
            <div className="flex items-center gap-6 justify-center">
               <button onClick={togglePlay} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/5">
                  {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
               </button>
               <button onClick={handleNext} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/5">
                  <SkipForward size={24} fill="currentColor"/>
               </button>
                <button onClick={() => window.location.reload()} className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5">
                  <RefreshCw size={24} />
               </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-1">
               {DEMO_PLAYLIST.map((scene, idx) => (
                  <button 
                    key={scene.id}
                    onClick={() => handleJump(idx)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                       idx === currentIndex 
                       ? 'bg-cyan-500 border-cyan-400 text-white font-bold' 
                       : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {idx + 1}. {scene.id}
                  </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default DemoController;
