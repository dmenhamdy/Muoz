import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ChevronLeft, Play, Shuffle, Edit3, Trash2 } from 'lucide-react';
import { MusicListItem } from '../components/Common/MusicListItem';
import { EditPlaylistModal } from '../components/Dialogs/EditPlaylistModal';
import { DeletionDialog } from '../components/Dialogs/DeletionDialog';

interface PlaylistDetailsScreenProps {
  playlistId: string;
}

export const PlaylistDetailsScreen: React.FC<PlaylistDetailsScreenProps> = ({ playlistId }) => {
  const {
    playlists,
    library,
    navigateBack,
    playTrack,
    deletePlaylist,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const playlist = playlists.find(p => p.id === playlistId);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeletePlaylistDialog, setShowDeletePlaylistDialog] = useState(false);

  if (!playlist) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white text-center">
        <p className="text-sm font-bold text-white/60 mb-4">Playlist not found</p>
        <button
          onClick={navigateBack}
          className="px-4 py-2 rounded-2xl bg-white/10 text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Get full track objects
  const tracks = playlist.musics
    .map(id => library.find(t => t.mediaId === id))
    .filter((t): t is typeof library[0] => t !== undefined);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleShuffleAll = () => {
    if (tracks.length > 0) {
      const rand = Math.floor(Math.random() * tracks.length);
      playTrack(tracks[rand], tracks);
    }
  };

  const handleDelete = () => {
    deletePlaylist(playlist.id);
    navigateBack();
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Top back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={navigateBack}
          className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Edit Playlist"
          >
            <Edit3 size={17} />
          </button>
          <button
            onClick={() => setShowDeletePlaylistDialog(true)}
            className="w-10 h-10 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete Playlist"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Playlist Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-5 mb-6 text-center sm:text-left">
        <div
          style={{
            backgroundColor: `${playlist.color}35`,
            borderColor: `${playlist.color}70`,
          }}
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-[36px] flex items-center justify-center text-6xl shadow-2xl border-2 flex-shrink-0"
        >
          {playlist.emoji}
        </div>

        <div className="flex-1">
          <span className="text-xs font-bold text-white/50 tracking-wider uppercase">
            Playlist
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mt-1">
            {playlist.name}
          </h1>

          <div className="flex flex-wrap gap-1 mt-2 justify-center sm:justify-start">
            {playlist.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-xs text-white/50 mt-2 font-bold">
            {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
          </p>

          <div className="flex items-center space-x-3 mt-4 justify-center sm:justify-start">
            <button
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
              style={{ backgroundColor: playlist.color }}
              className="px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center space-x-2 shadow-lg cursor-pointer active:scale-95 disabled:opacity-40"
            >
              <Play size={15} fill="currentColor" />
              <span>Play All</span>
            </button>
            <button
              onClick={handleShuffleAll}
              disabled={tracks.length === 0}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center space-x-2 transition-colors cursor-pointer active:scale-95 disabled:opacity-40"
            >
              <Shuffle size={14} />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracks list */}
      <div className="space-y-1">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white/60 mb-2 px-1">
          Songs in playlist
        </h3>
        {tracks.length === 0 ? (
          <div className="py-12 text-center text-white/50 text-xs font-bold">
            No tracks in this playlist yet. Add songs from the library!
          </div>
        ) : (
          tracks.map((track, idx) => (
            <MusicListItem
              key={track.mediaId}
              track={track}
              index={idx}
              playlistContextId={playlist.id}
              onPlay={() => playTrack(track, tracks)}
            />
          ))
        )}
      </div>

      <EditPlaylistModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        playlistToEdit={playlist}
      />

      {showDeletePlaylistDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
            className="w-full max-w-sm rounded-3xl p-5 border shadow-2xl flex flex-col"
          >
            <h3 className="font-extrabold text-base text-white mb-2">Delete Playlist?</h3>
            <p className="text-xs text-white/70 mb-4">
              Are you sure you want to delete <span className="font-bold text-white">{playlist.name}</span>? The songs will still remain in your library.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeletePlaylistDialog(false)}
                className="px-4 py-2 rounded-2xl bg-white/10 text-xs font-bold text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-2xl bg-red-500 text-xs font-bold text-white shadow-lg cursor-pointer hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
