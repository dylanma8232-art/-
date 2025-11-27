import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, AlertCircle } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // 标记是否因浏览器策略被阻止
  const [volume, setVolume] = useState(0.4); 
  const [isHovered, setIsHovered] = useState(false);
  const [useBackupSource, setUseBackupSource] = useState(false); // 标记是否使用备用源

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsBlocked(false);
      } catch (err: any) {
        console.warn("Audio autoplay blocked or failed:", err);
        if (err.name === 'NotAllowedError') {
            // 浏览器拦截了自动播放
            setIsBlocked(true);
            
            // 添加一次性全局点击监听来尝试解锁
            const unlock = () => {
                if (audio.paused) {
                    audio.play().then(() => {
                        setIsPlaying(true);
                        setIsBlocked(false);
                    }).catch(e => console.error("Unlock failed:", e));
                }
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
            };
            document.addEventListener('click', unlock);
            document.addEventListener('touchstart', unlock);
        }
      }
    };

    attemptPlay();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Manual play failed:", e));
    }
    setIsPlaying(!isPlaying);
    setIsBlocked(false); // 手动交互后清除拦截状态
  };

  const handleError = () => {
      console.warn("Local bgm.mp3 not found, switching to backup source.");
      if (!useBackupSource) {
          setUseBackupSource(true);
          // 切换源后重新尝试播放
          if (audioRef.current) {
              audioRef.current.load();
              if (isPlaying || isBlocked) {
                  audioRef.current.play().catch(() => setIsBlocked(true));
              }
          }
      }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 状态提示 (被拦截时显示) */}
      {isBlocked && (
          <div className="absolute -top-12 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xl animate-bounce whitespace-nowrap">
              点击开启音效 🎵
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/10 rotate-45 border-r border-b border-white/20"></div>
          </div>
      )}

      {/* 音量滑块 */}
      <div 
        className={`transition-all duration-300 overflow-hidden bg-slate-900/90 backdrop-blur-md rounded-lg border border-white/10 p-3 mb-1 flex flex-col items-center gap-2 shadow-xl ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="text-[10px] text-slate-400 font-mono">{Math.round(volume * 100)}%</span>
        <input 
          type="range" 
          min="0" max="1" step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="h-24 w-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
          style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
        />
      </div>

      {/* 主控制按钮 */}
      <button 
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 shadow-2xl relative ${
          isPlaying 
            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
            : isBlocked 
                ? 'bg-red-500/80 border-red-400 text-white animate-pulse' 
                : 'bg-slate-800/80 border-white/20 text-slate-400'
        } hover:scale-110`}
      >
        {isPlaying ? (
            <span className="relative">
                <Music size={20} className="animate-pulse-slow" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
            </span>
        ) : isBlocked ? (
            <AlertCircle size={20} />
        ) : (
            <Play size={20} className="ml-1"/>
        )}
      </button>

      {/* 音频标签 */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        onError={handleError}
        // 优先使用根目录 bgm.mp3，失败则回退到 CDN 链接
        src={useBackupSource ? "https://cdn.pixabay.com/download/audio/2022/03/24/audio_3232972309.mp3" : "bgm.mp3"} 
      />
    </div>
  );
};

export default BackgroundMusic;