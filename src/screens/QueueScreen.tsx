import React from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ChevronLeft, Trash2, ArrowUp, ArrowDown, Play, Music, Sparkles } from 'lucide-react';
import { formatTime } from '../../src/utils/lyricsParser';

export const QueueScreen: React.FC = () => {
  const {
    state,
    playTrack,
    removeFromQueue,
    reArrangeQueue,
    clearQueue,
    navigateBack,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const queue = state.loadedMedias;

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={navigateBack}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Playback Queue</h1>
            <p className="text-xs text-white/50">{queue.length} songs in line</p>
          </div>
        </div>

        {queue.length > 1 && (
          <button
            onClick={clearQueue}
            className="px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-xs font-bold text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear Queue</span>
          </button>
        )}
      </div>

      {/* Queue items list */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="py-20 text-center text-white/50 text-xs font-bold">
            Queue is empty. Play a song from your library!
          </div>
        ) : (
          queue.map((track, idx) => {
            const isNowPlaying = state.track?.mediaId === track.mediaId;

            return (
              <div
                key={`${track.mediaId}-${idx}`}
                style={{
                  backgroundColor: isNowPlaying ? `${theme.primary}20` : 'rgba(255, 255, 255, 0.03)',
                  borderColor: isNowPlaying ? theme.primary : 'rgba(255, 255, 255, 0.06)',
                }}
                className="p-2.5 rounded-3xl border flex items-center justify-between group select-none"
              >
                <div
                  className="flex items-center space-x-3 overflow-hidden flex-1 cursor-pointer"
                  onClick={() => playTrack(track, queue)}
                >
                  <div className="relative w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40">
                    <img src={track.artUri} alt="" className="w-full h-full object-cover" />
                    {isNowPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white truncate leading-tight">
                        {track.title}
                      </span>
                      {isNowPlaying && (
                        <span
                          style={{ backgroundColor: theme.primary }}
                          className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase text-white flex-shrink-0"
                        >
                          Now
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/60 truncate mt-0.5">
                      {track.artist} • {formatTime(track.duration)}
                    </p>
                  </div>
                </div>

                {/* Reorder and remove buttons */}
                <div className="flex items-center space-x-1">
                  {idx > 0 && (
                    <button
                      onClick={() => reArrangeQueue(idx, idx - 1)}
                      className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                  )}
                  {idx < queue.length - 1 && (
                    <button
                      onClick={() => reArrangeQueue(idx, idx + 1)}
                      className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  )}
                  {queue.length > 1 && (
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="w-7 h-7 rounded-xl hover:bg-red-500/20 text-white/50 hover:text-red-400 flex items-center justify-center cursor-pointer ml-1"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
