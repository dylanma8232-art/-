import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ModuleType, BlockData } from '../types';
import SupplyMapDemo from './demos/SupplyMapDemo';
import AISalesDemo from './demos/AISalesDemo';
import AIGuideDemo from './demos/AIGuideDemo';
import PrivateDomainDemo from './demos/PrivateDomainDemo';
import CompanyIntro from './demos/CompanyIntro';
import HomeDashboard from './HomeDashboard';

interface DetailOverlayProps {
  moduleData: BlockData;
  onClose: () => void;
  onComplete: () => void;
}

const GenericPlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="text-6xl mb-4">✨</div>
    <h3 className="text-2xl font-bold text-white">{title} 演示</h3>
    <p className="text-gray-400 mt-2">功能模块加载中...</p>
  </div>
);

const DetailOverlay: React.FC<DetailOverlayProps> = ({ moduleData, onClose, onComplete }) => {
  
  const renderContent = () => {
    switch (moduleData.id) {
      case ModuleType.COMPANY_INTRO:
        return <CompanyIntro onComplete={onComplete} />;
      case ModuleType.DATA_DASHBOARD:
        return (
          // 确保 Dashboard 容器占满且不溢出
          <div className="w-full h-full relative overflow-hidden rounded-3xl">
             <HomeDashboard activeModule={false} onComplete={onComplete} />
          </div>
        );
      case ModuleType.AI_GUIDE_EMPOWERMENT:
        return <AIGuideDemo onComplete={onComplete} />;
      case ModuleType.CLAIRVOYANCE:
        return <PrivateDomainDemo onComplete={onComplete} />;
      case ModuleType.SUPPLY_MAP:
        return <SupplyMapDemo onComplete={onComplete} />;
      case ModuleType.AI_SALES:
        return <AISalesDemo onComplete={onComplete} />;
      default:
        return <GenericPlaceholder title={moduleData.title} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4 lg:p-8"
    >
      <motion.div 
        initial={{ scale: 0.98, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, y: 10, opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        // 使用 w-[95vw] 保证宽度，但不再强制像素宽度
        className="w-[95vw] h-[90vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        style={{ boxShadow: `0 0 100px -20px ${moduleData.color.includes('blue') ? '#3b82f640' : moduleData.color.includes('pink') ? '#ec489940' : '#a855f740'}`}}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md border border-white/10"
        >
          <X size={24} />
        </button>

        {/* Content Container */}
        <div className="flex-1 w-full h-full overflow-hidden">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailOverlay;