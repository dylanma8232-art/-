import React, { useEffect, useRef, useState } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4); 
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // 尝试自动播放，如果失败则等待用户点击页面任意位置后解锁
    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay blocked by browser policy. Waiting for user interaction.");
        const unlockAudio = () => {
            audio.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
            // 解锁后移除监听器
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
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
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 音量滑块 - 悬停显示 */}
      <div 
        className={`transition-all duration-300 overflow-hidden bg-slate-900/90 backdrop-blur-md rounded-lg border border-white/10 p-3 mb-1 flex flex-col items-center gap-2 shadow-xl origin-bottom ${
          isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="text-white/80">
            {volume === 0 ? <VolumeX size={16}/> : <Volume2 size={16}/>}
        </div>
        <span className="text-[10px] text-slate-400 font-mono select-none">{Math.round(volume * 100)}%</span>
        <input 
          type="range" 
          min="0" max="1" step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="h-24 w-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-md"
          style={{ writingMode: 'vertical-lr', WebkitAppearance: 'slider-vertical' }} 
        />
      </div>

      {/* 主控制按钮 */}
      <button 
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative ${
          isPlaying 
            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 animate-[pulse_3s_infinite]' 
            : 'bg-slate-800/90 border-white/20 text-slate-400 hover:bg-slate-700 hover:text-white'
        } hover:scale-110 active:scale-95`}
      >
        {isPlaying ? (
            <span className="relative flex items-center justify-center">
                <Music size={24} className="animate-[bounce_2s_infinite]" />
                {/* 播放状态指示灯 */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_5px_#4ade80]"></span>
            </span>
        ) : (
            <Play size={24} className="ml-1 fill-current"/>
        )}
      </button>

      {/* 音频标签 
          Vite 中 public 文件夹下的文件可直接用 /bgm.mp3 访问
      */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        src="/bgm.mp3" 
      />
    </div>
  );
};

export default BackgroundMusic;