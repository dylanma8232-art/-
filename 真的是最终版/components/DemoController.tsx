import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DEMO_PLAYLIST } from '../configs/DemoPlaylist';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import CompanyIntro from './demos/CompanyIntro'; // Persistent Background
import ScenarioIntro from './ScenarioIntro';

const DemoController = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0); // Time left for CURRENT PHASE (Intro OR Content)
  const [isIntroPhase, setIsIntroPhase] = useState(false);
  
  const [showPanel, setShowPanel] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const currentScene = DEMO_PLAYLIST[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const INTRO_DURATION = 3500; // Standard duration for intro card

  // Initialize Scene
  useEffect(() => {
    // Check if this scene has an intro configuration
    if (currentScene.intro) {
        setIsIntroPhase(true);
        setPhaseTimeLeft(currentScene.intro.duration || INTRO_DURATION);
    } else {
        setIsIntroPhase(false);
        setPhaseTimeLeft(currentScene.duration);
    }
    setManualOverride(false);
    setIsPlaying(true);
  }, [currentIndex]);

  // Timer Logic
  useEffect(() => {
    if (!isPlaying || manualOverride) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
    }
    
    timerRef.current = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 100) {
          // Phase Complete
          handlePhaseComplete();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying, manualOverride, isIntroPhase]);

  const handlePhaseComplete = () => {
      if (isIntroPhase) {
          // Intro finished, switch to Content
          setIsIntroPhase(false);
          setPhaseTimeLeft(currentScene.duration);
      } else {
          // Content finished, go to Next Scene
          handleNext();
      }
  };

  const handleNext = () => {
    // 关键逻辑：循环播放
    // 如果当前是最后一个场景，则重置为第一个场景 (index 0)
    if (currentIndex === DEMO_PLAYLIST.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleJump = (index: number) => {
      setCurrentIndex(index);
      setManualOverride(true);
      setIsPlaying(false);
  };

  const isIntroScene = currentScene.id === 'intro';

  // Calculate progress for the top bar
  const totalDuration = isIntroPhase ? (currentScene.intro?.duration || INTRO_DURATION) : currentScene.duration;
  const progress = (1 - phaseTimeLeft / totalDuration) * 100;

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 font-sans">
      
      {/* LAYER 1: Persistent Background (Home Page) */}
      {/* Active=true implies it's in background (blurred). Active=false implies it's main content. */}
      {/* So if we are NOT on intro scene (index > 0), active should be true */}
      <div className="absolute inset-0 z-0">
         <CompanyIntro active={!isIntroScene} />
      </div>

      {/* LAYER 2: Overlay Scenes (Medium Window) OR Intro Card */}
      <AnimatePresence mode="wait">
        {!isIntroScene && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-8 pointer-events-none">
             
             {isIntroPhase && currentScene.intro ? (
                 // PHASE A: INTRO CARD (Full Screen Overlay)
                 <motion.div
                    key={`intro-${currentScene.id}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="pointer-events-auto w-full h-full flex items-center justify-center"
                 >
                    <ScenarioIntro 
                        title={currentScene.intro.title}
                        role={currentScene.intro.role}
                        goal={currentScene.intro.goal}
                    />
                 </motion.div>
             ) : (
                 // PHASE B: ACTUAL CONTENT (Medium Window)
                 <motion.div
                    key={`content-${currentScene.id}`}
                    initial={{ scale: 0.9, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 30, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full max-w-6xl h-[85vh] bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto relative"
                 >
                     {/* Render Component.
                        Because we only mount this AFTER intro phase, 
                        the component's internal useEffects will start from T=0 now. 
                     */}
                     <currentScene.component 
                        onComplete={() => {
                            // 确保自动播放时也能触发循环逻辑
                            if (!manualOverride) setTimeout(handleNext, 1000);
                        }}
                     />
                 </motion.div>
             )}
          </div>
        )}
      </AnimatePresence>

      {/* LAYER 3: Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 z-50 bg-white/5">
          <div 
            className={`h-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(6,182,212,0.8)] ${isIntroPhase ? 'bg-purple-500' : 'bg-cyan-500'}`}
            style={{ width: `${progress}%` }} 
          />
      </div>

      {/* LAYER 4: Control Panel */}
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
               <button 
                 onClick={() => { setIsPlaying(!isPlaying); setManualOverride(true); }} 
                 className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all border border-white/5"
               >
                  {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
               </button>
               <button onClick={handleNext} className="p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all border border-white/5">
                  <SkipForward size={24} fill="currentColor"/>
               </button>
                <button onClick={() => window.location.reload()} className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 hover:scale-110 transition-all border border-white/5">
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