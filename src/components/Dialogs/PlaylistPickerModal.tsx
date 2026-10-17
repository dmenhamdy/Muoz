import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { ListPlus, X, Plus, Check } from 'lucide-react';
import { EditPlaylistModal } from './EditPlaylistModal';

interface PlaylistPickerModalProps {
  trackIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const PlaylistPickerModal: React.FC<PlaylistPickerModalProps> = ({
  trackIds,
  isOpen,
  onClose,
}) => {
  const { playlists, addTracksToPlaylist, settings } = useMusic();
  const theme = THEMES[settings.theme];
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addedPlaylists, setAddedPlaylists] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleSelectPlaylist = (playlistId: string) => {
    addTracksToPlaylist(playlistId, trackIds);
    setAddedPlaylists(prev => new Set(prev).add(playlistId));
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
        <div
          style={{
            backgroundColor: theme.surfaceContainer,
            borderColor: theme.border,
          }}
          className="w-full max-w-sm rounded-3xl p-5 border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div
                style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
              >
                <ListPlus size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Add to Playlist</h3>
                <p className="text-[11px] text-white/60">
                  {trackIds.length} {trackIds.length === 1 ? 'song' : 'songs'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Playlists list */}
          <div className="py-3 overflow-y-auto space-y-2 flex-1">
            {/* Create new button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 flex items-center space-x-3 text-left transition-colors cursor-pointer group"
            >
              <div
                style={{ backgroundColor: `${theme.primary}33`, color: theme.primary }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
              >
                <Plus size={20} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-white block">Create New Playlist</span>
                <span className="text-[10px] text-white/50">Custom emoji and color</span>
              </div>
            </button>

            {playlists.map(pl => {
              const isAdded = addedPlaylists.has(pl.id);
              const alreadyContainsAll = trackIds.every(id => pl.musics.includes(id));

              return (
                <button
                  key={pl.id}
                  onClick={() => handleSelectPlaylist(pl.id)}
                  className="w-full p-3 rounded-2xl bg-black/20 hover:bg-black/35 border border-white/5 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div
                      style={{ backgroundColor: `${pl.color}33` }}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    >
                      {pl.emoji}
                    </div>
                    <div className="text-left overflow-hidden">
                      <span className="text-xs font-bold text-white truncate block">
                        {pl.name}
                      </span>
                      <span className="text-[10px] text-white/50">
                        {pl.musics.length} tracks {alreadyContainsAll ? '• Already added' : ''}
                      </span>
                    </div>
                  </div>

                  {isAdded ? (
                    <div
                      style={{ backgroundColor: theme.primary }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                    >
                      <Check size={14} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                      <Plus size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <EditPlaylistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={newPl => {
            addTracksToPlaylist(newPl.id, trackIds);
            onClose();
          }}
        />
      )}
    </>
  );
};
