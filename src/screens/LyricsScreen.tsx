import React, { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ChevronLeft, Edit3, Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { formatTime } from '../utils/lyricsParser';

export const LyricsScreen: React.FC = () => {
  const {
    state,
    seekTo,
    togglePlayPause,
    skipNext,
    skipPrevious,
    navigate,
    navigateBack,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const track = state.track;
  const lyrics = state.lyrics;
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Find currently active lyric line
  const activeIndex = lyrics.findIndex((line, i) => {
    const nextLine = lyrics[i + 1];
    if (nextLine && nextLine.timestamp >= 0) {
      return state.position >= line.timestamp && state.position < nextLine.timestamp;
    }
    return state.position >= line.timestamp;
  });

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  if (!track) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white text-center">
        <p className="text-sm font-bold text-white/60 mb-4">No song currently playing</p>
        <button onClick={navigateBack} className="px-4 py-2 rounded-2xl bg-white/10 text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const fontSizeClass =
    settings.lyricsFontSize === 'large'
      ? 'text-2xl sm:text-3xl'
      : settings.lyricsFontSize === 'small'
      ? 'text-base sm:text-lg'
      : 'text-xl sm:text-2xl';

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#140f13] text-white">
      {/* Blurred artwork background */}
      {track.artUri && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src={track.artUri}
            alt=""
            className="w-full h-full object-cover scale-150 blur-3xl opacity-30"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
      )}

      {/* Top Bar */}
      <header className="flex items-center justify-between px-5 pt-4 pb-3 z-10">
        <button
          onClick={navigateBack}
          style={{ backgroundColor: theme.surfaceContainer }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/90 shadow-md hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="text-center px-2 flex-1 min-w-0">
          <h2 className="text-xs font-black text-white truncate">{track.title}</h2>
          <p className="text-[11px] font-semibold text-white/60 truncate">{track.artist}</p>
        </div>

        <button
          onClick={() => navigate({ name: 'lyricsEditor', trackId: track.mediaId })}
          style={{ backgroundColor: theme.surfaceContainer }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/90 shadow-md hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          title="Edit Lyrics"
        >
          <Edit3 size={17} />
        </button>
      </header>

      {/* Synchronized Lyrics Container */}
      <div className="flex-1 overflow-y-auto px-6 py-12 space-y-7 text-center select-none scroll-smooth">
        {lyrics.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Music size={42} style={{ color: theme.primary }} className="mb-3 opacity-60" />
            <p className="text-sm font-bold text-white/70">No synchronized lyrics available</p>
            <button
              onClick={() => navigate({ name: 'lyricsEditor', trackId: track.mediaId })}
              style={{ backgroundColor: theme.primary }}
              className="mt-4 px-4 py-2 rounded-2xl text-xs font-bold text-white shadow-lg cursor-pointer"
            >
              Add Lyrics Now
            </button>
          </div>
        ) : (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div
                key={line.id}
                ref={isActive ? activeLineRef : null}
                onClick={() => {
                  if (line.timestamp >= 0) {
                    seekTo(line.timestamp);
                  }
                }}
                className={`transition-all duration-300 font-extrabold cursor-pointer tracking-tight ${fontSizeClass} ${
                  isActive
                    ? 'scale-105 opacity-100 text-white drop-shadow-[0_4px_16px_rgba(255,105,180,0.5)]'
                    : 'opacity-35 hover:opacity-70 text-white/80'
                }`}
              >
                {line.lineLyrics}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Mini Player Controls at bottom of Lyrics */}
      <footer
        style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
        className="p-3 mx-4 mb-4 rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-white/60 w-9 text-right">
            {formatTime(state.position)}
          </span>
          <input
            type="range"
            min="0"
            max={state.duration || 100}
            step="0.1"
            value={state.position}
            onChange={e => seekTo(parseFloat(e.target.value))}
            style={{ accentColor: theme.primary }}
            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-[10px] font-bold text-white/60 w-9">
            {formatTime(state.duration)}
          </span>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={skipPrevious}
            className="text-white/80 hover:text-white cursor-pointer active:scale-90 transition-transform"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlayPause}
            style={{ backgroundColor: theme.primary }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg cursor-pointer active:scale-90 transition-transform"
          >
            {state.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>

          <button
            onClick={skipNext}
            className="text-white/80 hover:text-white cursor-pointer active:scale-90 transition-transform"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};
