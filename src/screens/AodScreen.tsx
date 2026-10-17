import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, SkipBack, SkipForward, BatteryMedium, X } from 'lucide-react';

export const AodScreen: React.FC = () => {
  const { state, togglePlayPause, skipNext, skipPrevious, navigateBack } = useMusic();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const track = state.track;

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onDoubleClick={navigateBack}
      className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-between p-8 select-none"
    >
      {/* Top minimal status: Battery & Exit button */}
      <div className="w-full flex items-center justify-between opacity-40">
        <div className="flex items-center space-x-1 text-xs">
          <BatteryMedium size={16} />
          <span>88%</span>
        </div>
        <button
          onClick={navigateBack}
          className="text-xs font-mono px-2.5 py-1 rounded-full border border-white/20 hover:opacity-100 transition-opacity cursor-pointer flex items-center space-x-1"
        >
          <X size={12} />
          <span>Exit AOD</span>
        </button>
      </div>

      {/* Center Minimal Clock & Date */}
      <div className="flex flex-col items-center">
        <div className="text-7xl sm:text-8xl font-thin tracking-wider opacity-90 font-mono">
          {hours}:{minutes}
        </div>
        <div className="text-xs font-semibold opacity-50 uppercase tracking-widest mt-2">
          {dateStr}
        </div>
      </div>

      {/* Now Playing Widget */}
      {track ? (
        <div className="w-full max-w-xs flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md opacity-80 border border-white/10">
            <img src={track.artUri} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="text-center w-full px-2">
            <h4 className="text-sm font-bold truncate opacity-90">{track.title}</h4>
            <p className="text-xs truncate opacity-50 mt-0.5">{track.artist}</p>
          </div>

          {/* Minimal playback controls */}
          <div className="flex items-center space-x-8 opacity-75">
            <button
              onClick={skipPrevious}
              className="hover:opacity-100 active:scale-90 transition-all cursor-pointer"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:opacity-100 active:scale-90 transition-all cursor-pointer"
            >
              {state.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={skipNext}
              className="hover:opacity-100 active:scale-90 transition-all cursor-pointer"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs opacity-40">No song playing</div>
      )}

      {/* Footer hint */}
      <div className="text-[10px] opacity-25 uppercase tracking-widest font-mono">
        Double tap anywhere to exit
      </div>
    </div>
  );
};
