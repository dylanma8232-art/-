import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODULES } from '../constants';
import { BlockData } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DockProps {
  onSelect: (module: BlockData) => void;
}

const Dock: React.FC<DockProps> = ({ onSelect }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-end pointer-events-none">
      <div className="flex items-end gap-4 pointer-events-auto">
        
        {/* Dock Modules Container */}
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex space-x-4 px-8 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl"
            >
              {MODULES.map((mod) => (
                <motion.button
                  key={mod.id}
                  onClick={() => onSelect(mod)}
                  whileHover={{ y: -20, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex flex-col items-center justify-end w-32 h-32 bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  {/* Color Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${mod.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className="mb-3 p-3 bg-white/10 rounded-lg backdrop-blur-md text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <mod.icon size={28} />
                  </div>
                  
                  {/* Text */}
                  <div className="w-full bg-black/40 backdrop-blur-sm py-2 px-1 text-center border-t border-white/5">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block truncate">
                      {mod.title.split(' ')[0]}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visibility Toggle Button */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 active:scale-95 group"
          title={isVisible ? "隐藏菜单" : "显示菜单"}
        >
          {isVisible ? (
            <ChevronDown size={24} className="group-hover:translate-y-0.5 transition-transform" />
          ) : (
            <ChevronUp size={24} className="group-hover:-translate-y-0.5 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Dock;