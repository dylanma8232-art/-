import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroProps {
  title: string;
  role: string;
  goal: string;
  onComplete?: () => void;
}

const ScenarioIntro: React.FC<IntroProps> = ({ title, role, goal, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete && onComplete();
    }, 3500); // Show for 3.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 1.1, opacity: 0 }}
            className="max-w-xl w-full bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-sm font-bold text-slate-400 tracking-[0.2em] uppercase mb-2"
            >
              SCENARIO LOADED
            </motion.div>
            
            <h2 className="text-4xl font-bold text-white mb-8">{title}</h2>
            
            <div className="grid grid-cols-2 gap-8 text-left border-t border-white/5 pt-6">
              <div>
                 <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">CURRENT ROLE</div>
                 </div>
                 <div className="text-xl font-medium text-cyan-50">{role}</div>
              </div>
              <div>
                 <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">MISSION GOAL</div>
                 </div>
                 <div className="text-xl font-medium text-emerald-50">{goal}</div>
              </div>
            </div>

            <motion.div className="mt-8 h-1 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-white" 
                 initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3.5, ease: "linear" }}
               />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScenarioIntro;