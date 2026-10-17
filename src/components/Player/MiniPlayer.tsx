import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { THEMES } from '../../styles/theme';

export const MiniPlayer: React.FC = () => {
  const { state, togglePlayPause, skipNext, setIsNowPlayingExpanded, settings } = useMusic();
  const theme = THEMES[settings.theme];
  const track = state.track;

  if (!track) return null;

  const progressPercent = state.duration > 0 ? (state.position / state.duration) * 100 : 0;

  return (
    <div
      onClick={() => setIsNowPlayingExpanded(true)}
      style={{
        backgroundColor: theme.surfaceContainer,
        borderColor: theme.border,
      }}
      className="fixed bottom-[68px] left-3 right-3 md:left-6 md:right-6 max-w-xl mx-auto rounded-3xl p-2.5 flex items-center justify-between shadow-2xl border backdrop-blur-xl cursor-pointer z-30 transition-transform active:scale-[0.99] select-none"
    >
      {/* Progress line underneath */}
      <div className="absolute left-4 right-4 bottom-0 h-1 bg-black/20 rounded-full overflow-hidden">
        <div
          style={{ width: `${progressPercent}%`, backgroundColor: theme.primary }}
          className="h-full transition-all duration-200"
        />
      </div>

      <div className="flex items-center space-x-3 overflow-hidden flex-1 mr-2">
        {/* Album Artwork */}
        <div className="relative w-12 h-12 flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-black/30 flex items-center justify-center">
          {track.artUri ? (
            <img
              src={track.artUri}
              alt={track.title}
              className={`w-full h-full object-cover ${state.isPlaying ? 'animate-pulse-subtle' : ''}`}
            />
          ) : (
            <Music size={24} style={{ color: theme.primary }} />
          )}
        </div>

        {/* Title and Artist */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate text-white leading-tight">
            {track.title}
          </h4>
          <p className="text-xs truncate text-white/70 mt-0.5">
            {track.artist} • <span className="opacity-75">{track.album}</span>
          </p>
        </div>
      </div>

      {/* Playback action controls */}
      <div className="flex items-center space-x-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={togglePlayPause}
          style={{ backgroundColor: theme.primary, color: '#ffffff' }}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:opacity-90 cursor-pointer"
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        <button
          onClick={skipNext}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors active:scale-90 cursor-pointer"
          aria-label="Next track"
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
};
