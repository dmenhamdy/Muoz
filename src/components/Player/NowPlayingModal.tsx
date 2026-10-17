import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { formatTime } from '../../utils/lyricsParser';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Gauge,
  Moon,
  Sliders,
  FileText,
  ListOrdered,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Play,
  Pause,
  Info,
  Edit3,
  ListPlus,
  Share2,
} from 'lucide-react';
import { EqualizerModal } from '../Dialogs/EqualizerModal';
import { SpeedAndPitchDialog } from '../Dialogs/SpeedAndPitchDialog';
import { CuteTimePicker } from '../Dialogs/CuteTimePicker';
import { TracksDetailsDialog } from '../Dialogs/TracksDetailsDialog';
import { PlaylistPickerModal } from '../Dialogs/PlaylistPickerModal';

export const NowPlayingModal: React.FC = () => {
  const {
    state,
    togglePlayPause,
    seekTo,
    skipNext,
    skipPrevious,
    toggleShuffle,
    cycleRepeatMode,
    toggleFavorite,
    isNowPlayingExpanded,
    setIsNowPlayingExpanded,
    navigate,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const track = state.track;

  // Dialog states
  const [showEqModal, setShowEqModal] = useState(false);
  const [showSpeedDialog, setShowSpeedDialog] = useState(false);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  if (!isNowPlayingExpanded || !track) return null;

  const seekDuration = settings.seekButtonsDuration || 10;

  const handleRewind = () => {
    seekTo(Math.max(0, state.position - seekDuration));
  };

  const handleFastForward = () => {
    seekTo(Math.min(state.duration, state.position + seekDuration));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Listening to "${track.title}" by ${track.artist} on Chocola! 🎶`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`"${track.title}" by ${track.artist}`);
      alert('Track info copied to clipboard!');
    }
    setShowOptionsMenu(false);
  };

  const isTimerActive = state.sleepTimerRemainingDuration > 0;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#140f13] text-white overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* Blurred Album Artwork Background */}
      {settings.useArtAsBackground && track.artUri && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <img
            src={track.artUri}
            alt=""
            className="w-full h-full object-cover scale-150 blur-3xl opacity-35"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Top Bar */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2 z-10">
        <button
          onClick={() => setIsNowPlayingExpanded(false)}
          style={{ backgroundColor: theme.surfaceContainer }}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white/90 shadow-md hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          aria-label="Collapse player"
        >
          <ChevronDown size={24} />
        </button>

        <div className="text-center">
          <span className="text-[11px] font-bold text-white/60 tracking-wider uppercase">
            Playing From
          </span>
          <p className="text-xs font-bold text-white truncate max-w-[200px]">
            {track.album || track.folder || 'Library'}
          </p>
        </div>

        {/* More Options Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            style={{ backgroundColor: theme.surfaceContainer }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white/90 shadow-md hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical size={20} />
          </button>

          {showOptionsMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowOptionsMenu(false)}
              />
              <div
                style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
                className="absolute right-0 mt-2 w-56 rounded-3xl p-2 shadow-2xl border backdrop-blur-xl z-30 animate-in fade-in zoom-in-95 duration-150"
              >
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowDetailsDialog(true);
                  }}
                  className="w-full px-3 py-2.5 rounded-2xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  <Info size={16} />
                  <span>Track Details</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setIsNowPlayingExpanded(false);
                    navigate({ name: 'metadataEditor', trackId: track.mediaId });
                  }}
                  className="w-full px-3 py-2.5 rounded-2xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  <Edit3 size={16} />
                  <span>Edit Metadata</span>
                </button>

                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowPlaylistPicker(true);
                  }}
                  className="w-full px-3 py-2.5 rounded-2xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  <ListPlus size={16} />
                  <span>Add to Playlist</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full px-3 py-2.5 rounded-2xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>Share Song</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-between px-6 py-4 max-w-md mx-auto w-full overflow-hidden">
        {/* Large Album Artwork */}
        <div className="flex-1 flex items-center justify-center w-full my-auto max-h-[380px] p-2">
          <div
            className={`relative aspect-square w-full max-w-[340px] rounded-[42px] overflow-hidden shadow-2xl border-4 border-white/10 transition-transform duration-700 ${
              state.isPlaying ? 'scale-100 shadow-pink-500/10' : 'scale-[0.96] opacity-90'
            }`}
          >
            <img
              src={track.artUri}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title, Artist, and Favorite Button */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="text-2xl font-black text-white truncate tracking-tight">
              {track.title}
            </h2>
            <p className="text-sm font-semibold text-white/70 truncate mt-0.5">
              {track.artist}
            </p>
            <p className="text-xs font-medium text-white/45 truncate mt-0.5">
              {track.album}
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(track.mediaId)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              track.isFavorite
                ? 'bg-pink-500/20 text-pink-500 scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <Heart size={24} fill={track.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* CuteSlider / Scrub Bar */}
        <div className="w-full mb-4">
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={state.duration || 100}
              step="0.1"
              value={state.position}
              onChange={e => seekTo(parseFloat(e.target.value))}
              style={{ accentColor: theme.primary }}
              className="w-full h-2.5 bg-white/15 rounded-full appearance-none cursor-pointer hover:h-3 transition-all"
            />
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-white/60 mt-2 px-1">
            <span>{formatTime(state.position)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="w-full flex items-center justify-between px-2 mb-6">
          {/* Skip Previous */}
          <button
            onClick={skipPrevious}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous"
          >
            <SkipBack size={22} />
          </button>

          {/* Rewind 10s */}
          <button
            onClick={handleRewind}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-90 text-white/80 flex items-center justify-center transition-all cursor-pointer"
            aria-label={`Rewind ${seekDuration}s`}
          >
            <RotateCcw size={20} />
          </button>

          {/* Big Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            style={{ backgroundColor: theme.primary, color: '#ffffff' }}
            className="w-20 h-20 rounded-[28px] shadow-2xl flex items-center justify-center transition-transform active:scale-90 hover:opacity-95 cursor-pointer"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <Pause size={34} fill="currentColor" />
            ) : (
              <Play size={34} fill="currentColor" className="ml-1" />
            )}
          </button>

          {/* Fast Forward 10s */}
          <button
            onClick={handleFastForward}
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-90 text-white/80 flex items-center justify-center transition-all cursor-pointer"
            aria-label={`Fast Forward ${seekDuration}s`}
          >
            <RotateCw size={20} />
          </button>

          {/* Skip Next */}
          <button
            onClick={skipNext}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next"
          >
            <SkipForward size={22} />
          </button>
        </div>

        {/* Quick Actions Row */}
        <div
          style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
          className="w-full rounded-3xl p-2 border flex items-center justify-around shadow-xl backdrop-blur-md"
        >
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            style={{
              backgroundColor: state.shuffle ? theme.primary : 'transparent',
              color: state.shuffle ? '#ffffff' : 'rgba(255,255,255,0.7)',
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeatMode}
            style={{
              backgroundColor: state.repeatMode !== 'off' ? theme.primary : 'transparent',
              color: state.repeatMode !== 'off' ? '#ffffff' : 'rgba(255,255,255,0.7)',
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer relative"
            title={`Repeat: ${state.repeatMode}`}
          >
            {state.repeatMode === 'one' ? <Repeat1 size={19} /> : <Repeat size={18} />}
          </button>

          {/* Speed & Pitch */}
          <button
            onClick={() => setShowSpeedDialog(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Speed & Pitch"
          >
            <Gauge size={18} />
          </button>

          {/* Sleep Timer */}
          <button
            onClick={() => setShowTimerDialog(true)}
            style={{
              backgroundColor: isTimerActive ? `${theme.primary}33` : 'transparent',
              color: isTimerActive ? theme.primary : 'rgba(255,255,255,0.7)',
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer relative"
            title="Sleep Timer"
          >
            <Moon size={18} />
            {isTimerActive && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            )}
          </button>

          {/* Equalizer */}
          <button
            onClick={() => setShowEqModal(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Equalizer"
          >
            <Sliders size={18} />
          </button>

          {/* Synced Lyrics */}
          <button
            onClick={() => {
              setIsNowPlayingExpanded(false);
              navigate({ name: 'lyrics' });
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Lyrics"
          >
            <FileText size={18} />
          </button>

          {/* Queue */}
          <button
            onClick={() => {
              setIsNowPlayingExpanded(false);
              navigate({ name: 'queue' });
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Queue"
          >
            <ListOrdered size={18} />
          </button>
        </div>
      </main>

      {/* Modals */}
      <EqualizerModal isOpen={showEqModal} onClose={() => setShowEqModal(false)} />
      <SpeedAndPitchDialog isOpen={showSpeedDialog} onClose={() => setShowSpeedDialog(false)} />
      <CuteTimePicker isOpen={showTimerDialog} onClose={() => setShowTimerDialog(false)} />
      <TracksDetailsDialog
        track={track}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
      />
      <PlaylistPickerModal
        trackIds={[track.mediaId]}
        isOpen={showPlaylistPicker}
        onClose={() => setShowPlaylistPicker(false)}
      />
    </div>
  );
};
