import React, { useState } from 'react';
import { CuteTrack } from '../../types/music';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { formatTime } from '../../utils/lyricsParser';
import {
  MoreVertical,
  Heart,
  Play,
  Pause,
  Plus,
  ListPlus,
  Info,
  Edit3,
  Trash2,
  Check,
} from 'lucide-react';
import { TracksDetailsDialog } from '../Dialogs/TracksDetailsDialog';
import { PlaylistPickerModal } from '../Dialogs/PlaylistPickerModal';
import { DeletionDialog } from '../Dialogs/DeletionDialog';

interface MusicListItemProps {
  track: CuteTrack;
  index: number;
  playlistContextId?: string;
  onPlay?: () => void;
}

export const MusicListItem: React.FC<MusicListItemProps> = ({
  track,
  index,
  playlistContextId,
  onPlay,
}) => {
  const {
    state,
    playTrack,
    togglePlayPause,
    playNext,
    addToQueue,
    toggleFavorite,
    deleteTrack,
    removeTrackFromPlaylist,
    selectedTrackIds,
    toggleSelectTrack,
    navigate,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const isCurrent = state.track?.mediaId === track.mediaId;
  const isPlaying = isCurrent && state.isPlaying;
  const isSelected = selectedTrackIds.has(track.mediaId);
  const isInSelectionMode = selectedTrackIds.size > 0;

  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRowClick = () => {
    if (isInSelectionMode) {
      toggleSelectTrack(track.mediaId);
    } else {
      if (onPlay) {
        onPlay();
      } else {
        if (isCurrent) {
          togglePlayPause();
        } else {
          playTrack(track);
        }
      }
    }
  };

  const handleDeleteOrRemove = () => {
    if (playlistContextId) {
      removeTrackFromPlaylist(playlistContextId, track.mediaId);
    } else {
      deleteTrack(track.mediaId);
    }
  };

  return (
    <>
      <div
        onClick={handleRowClick}
        style={{
          backgroundColor: isSelected
            ? `${theme.primary}25`
            : isCurrent
            ? `${theme.primary}15`
            : 'rgba(255, 255, 255, 0.03)',
          borderColor: isSelected
            ? theme.primary
            : isCurrent
            ? `${theme.primary}50`
            : 'rgba(255, 255, 255, 0.05)',
        }}
        className="w-full p-2.5 rounded-3xl border flex items-center justify-between mb-2 transition-all hover:bg-white/10 select-none cursor-pointer group"
      >
        <div className="flex items-center space-x-3 overflow-hidden flex-1 mr-2">
          {/* Avatar / Selection Checkbox / Artwork */}
          <div
            onClick={e => {
              e.stopPropagation();
              toggleSelectTrack(track.mediaId);
            }}
            className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
          >
            {isSelected ? (
              <div
                style={{ backgroundColor: theme.primary }}
                className="w-full h-full flex items-center justify-center text-white"
              >
                <Check size={20} strokeWidth={3} />
              </div>
            ) : (
              <>
                <img src={track.artUri} alt={track.title} className="w-full h-full object-cover" />
                {isCurrent && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex space-x-0.5 items-end h-4">
                        <span className="w-1 bg-pink-400 h-3 animate-bounce" />
                        <span className="w-1 bg-pink-400 h-4 animate-bounce delay-100" />
                        <span className="w-1 bg-pink-400 h-2 animate-bounce delay-200" />
                      </div>
                    ) : (
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Title & Artist info */}
          <div className="flex-1 min-w-0">
            <h4
              style={{ color: isCurrent ? theme.primary : '#ffffff' }}
              className="text-xs font-bold truncate leading-tight tracking-tight"
            >
              {track.title}
            </h4>
            <p className="text-[11px] text-white/60 truncate mt-0.5">
              {track.artist}
            </p>
            <div className="flex items-center space-x-1.5 text-[10px] text-white/40 mt-0.5 truncate">
              <span>{track.album}</span>
              <span>•</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>
        </div>

        {/* Trailing action buttons */}
        <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(track.mediaId)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              track.isFavorite
                ? 'text-pink-500 scale-110'
                : 'text-white/30 hover:text-white/80 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart size={16} fill={track.isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* 3-dots Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  style={{
                    backgroundColor: theme.surfaceContainer,
                    borderColor: theme.border,
                  }}
                  className="absolute right-0 mt-1 w-52 rounded-3xl p-2 shadow-2xl border backdrop-blur-xl z-30 animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    onClick={() => {
                      playNext(track);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                  >
                    <Play size={14} />
                    <span>Play Next</span>
                  </button>

                  <button
                    onClick={() => {
                      addToQueue([track]);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add to Queue</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPlaylistPicker(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                  >
                    <ListPlus size={14} />
                    <span>Add to Playlist</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDetails(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                  >
                    <Info size={14} />
                    <span>Song Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate({ name: 'metadataEditor', trackId: track.mediaId });
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-3 text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>Edit Metadata</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteDialog(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center space-x-3 text-left hover:bg-red-500/20 text-xs font-bold text-red-400 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>{playlistContextId ? 'Remove from Playlist' : 'Delete Song'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <TracksDetailsDialog
        track={track}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      <PlaylistPickerModal
        trackIds={[track.mediaId]}
        isOpen={showPlaylistPicker}
        onClose={() => setShowPlaylistPicker(false)}
      />

      <DeletionDialog
        tracks={[track]}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteOrRemove}
        playlistContext={!!playlistContextId}
      />
    </>
  );
};
