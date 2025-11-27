import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CompanyIntro from './components/demos/CompanyIntro'; // New Home Page
import Dock from './components/Dock';
import DetailOverlay from './components/DetailOverlay';
import BackgroundMusic from './components/BackgroundMusic';
import { BlockData } from './types';
import { MODULES } from './constants';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<BlockData | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play Logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (autoplay && !activeModule) {
      // Wait 3 seconds on Home Screen before opening next module
      timer = setTimeout(() => {
        setActiveModule(MODULES[currentIndex]);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [autoplay, activeModule, currentIndex]);

  const handleModuleComplete = () => {
    // Close current module
    setActiveModule(null);
    // Move to next index
    setCurrentIndex((prev) => (prev + 1) % MODULES.length);
  };

  const handleManualSelect = (mod: BlockData) => {
    // In Kiosk mode, keep autoplay active even after manual interaction to ensure loop continues
    setAutoplay(true);
    setActiveModule(mod);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans select-none">
      
      {/* Global Background Music - Confirmed Presence */}
      <BackgroundMusic />

      {/* 1. Main Home Background (Company Intro + Ecosystem) */}
      <CompanyIntro active={!!activeModule} />

      {/* 2. Navigation Dock */}
      <Dock onSelect={handleManualSelect} />

      {/* 3. Detail Overlay */}
      <AnimatePresence>
        {activeModule && (
          <DetailOverlay 
            moduleData={activeModule} 
            onClose={() => { 
                setActiveModule(null); 
                // Ensure autoplay continues after closing
                setAutoplay(true); 
            }} 
            onComplete={handleModuleComplete}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;