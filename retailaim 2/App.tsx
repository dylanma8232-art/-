
import React from 'react';
import DemoController from './components/DemoController';
import BackgroundMusic from './components/BackgroundMusic';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans select-none">
      
      {/* Global Background Music */}
      <BackgroundMusic />

      {/* Central Director System */}
      <DemoController />

    </div>
  );
};

export default App;
