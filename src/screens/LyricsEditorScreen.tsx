import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ChevronLeft, Save, Plus, Trash2, Clock, Code, List, Play, Pause } from 'lucide-react';
import { parseLrc, formatTime, stringifyLrc } from '../utils/lyricsParser';
import { LyricsLine } from '../types/music';

interface LyricsEditorScreenProps {
  trackId: string;
}

export const LyricsEditorScreen: React.FC<LyricsEditorScreenProps> = ({ trackId }) => {
  const {
    library,
    updateTrackLyrics,
    navigateBack,
    state,
    togglePlayPause,
    seekTo,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const track = library.find(t => t.mediaId === trackId) || state.track;

  const [lines, setLines] = useState<LyricsLine[]>(() => {
    return parseLrc(track?.lyrics || '');
  });

  const [isRawMode, setIsRawMode] = useState(false);
  const [rawText, setRawText] = useState(track?.lyrics || '');

  if (!track) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white text-center">
        <p className="text-sm font-bold text-white/60 mb-4">Track not found</p>
        <button onClick={navigateBack} className="px-4 py-2 rounded-2xl bg-white/10 text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const handleStampTime = (index: number) => {
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      timestamp: parseFloat(state.position.toFixed(2)),
    };
    // Sort chronologically
    updated.sort((a, b) => a.timestamp - b.timestamp);
    setLines(updated);
  };

  const handleTextChange = (index: number, newText: string) => {
    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      lineLyrics: newText,
    };
    setLines(updated);
  };

  const handleAddLine = () => {
    const newLine: LyricsLine = {
      id: `line-${Date.now()}`,
      timestamp: parseFloat(state.position.toFixed(2)),
      lineLyrics: 'New lyrics line',
    };
    setLines(prev => [...prev, newLine].sort((a, b) => a.timestamp - b.timestamp));
  };

  const handleDeleteLine = (index: number) => {
    setLines(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const finalLrc = isRawMode ? rawText : stringifyLrc(lines);
    updateTrackLyrics(track.mediaId, finalLrc);
    navigateBack();
  };

  const toggleRawMode = () => {
    if (isRawMode) {
      setLines(parseLrc(rawText));
      setIsRawMode(false);
    } else {
      setRawText(stringifyLrc(lines));
      setIsRawMode(true);
    }
  };

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
            <h1 className="text-lg font-black text-white">Lyrics Editor</h1>
            <p className="text-xs text-white/50 truncate max-w-[200px]">{track.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleRawMode}
            className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center space-x-1.5 cursor-pointer"
            title="Toggle Raw LRC text mode"
          >
            {isRawMode ? <List size={14} /> : <Code size={14} />}
            <span>{isRawMode ? 'List View' : 'Raw LRC'}</span>
          </button>

          <button
            onClick={handleSave}
            style={{ backgroundColor: theme.primary }}
            className="px-4 py-1.5 rounded-2xl text-xs font-black text-white flex items-center space-x-1.5 shadow-lg cursor-pointer active:scale-95"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Floating play & stamp current time bar */}
      <div
        style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
        className="p-3 mb-4 rounded-3xl border shadow-lg flex items-center justify-between backdrop-blur-md"
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayPause}
            style={{ backgroundColor: theme.primary }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md cursor-pointer active:scale-90 transition-transform"
          >
            {state.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <div>
            <span className="text-[10px] font-bold text-white/50 block">Playback Time</span>
            <span className="text-sm font-black text-white font-mono">
              {formatTime(state.position, true)}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddLine}
          style={{ backgroundColor: `${theme.primary}33`, color: theme.primary }}
          className="px-3.5 py-2 rounded-2xl text-xs font-black flex items-center space-x-1.5 cursor-pointer hover:opacity-90 active:scale-95"
        >
          <Plus size={15} />
          <span>Add Line at {formatTime(state.position)}</span>
        </button>
      </div>

      {/* Content */}
      {isRawMode ? (
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-bold text-white/60 mb-2">Edit Raw LRC Format</label>
          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            rows={15}
            className="w-full flex-1 p-4 rounded-3xl bg-black/30 border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-pink-500 leading-relaxed"
            placeholder="[00:12.30] Song lyric line..."
          />
        </div>
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="py-16 text-center text-white/50 text-xs font-bold">
              No lines yet. Click "Add Line" above or switch to Raw LRC mode to paste lyrics.
            </div>
          ) : (
            lines.map((line, idx) => (
              <div
                key={line.id}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
                className="p-2.5 rounded-2xl border flex items-center space-x-2"
              >
                {/* Stamp button */}
                <button
                  onClick={() => handleStampTime(idx)}
                  style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
                  className="px-2.5 py-1.5 rounded-xl font-mono text-xs font-black flex items-center space-x-1 cursor-pointer flex-shrink-0 hover:opacity-90"
                  title="Stamp current playback position to this line"
                >
                  <Clock size={12} />
                  <span>{formatTime(line.timestamp, true)}</span>
                </button>

                {/* Lyric input */}
                <input
                  type="text"
                  value={line.lineLyrics}
                  onChange={e => handleTextChange(idx, e.target.value)}
                  className="flex-1 bg-transparent border-none text-xs font-semibold text-white focus:outline-none px-2"
                />

                {/* Preview seek */}
                <button
                  onClick={() => seekTo(line.timestamp)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center cursor-pointer"
                  title="Jump playback to this timestamp"
                >
                  <Play size={12} fill="currentColor" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteLine(idx)}
                  className="w-7 h-7 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center cursor-pointer"
                  title="Delete line"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
