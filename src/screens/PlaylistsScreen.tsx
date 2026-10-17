import React, { useState, useMemo } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ListMusic, Plus, Play, Sparkles } from 'lucide-react';
import { EditPlaylistModal } from '../components/Dialogs/EditPlaylistModal';
import { Playlist } from '../types/music';

export const PlaylistsScreen: React.FC = () => {
  const { playlists, navigate, playTrack, library, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    playlists.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set);
  }, [playlists]);

  const filteredPlaylists = useMemo(() => {
    if (!selectedTag) return playlists;
    return playlists.filter(p => p.tags.includes(selectedTag));
  }, [playlists, selectedTag]);

  const handlePlayPlaylist = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    const tracks = library.filter(t => playlist.musics.includes(t.mediaId));
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Playlists</h1>
            <Sparkles size={18} style={{ color: theme.primary }} />
          </div>
          <p className="text-xs font-semibold text-white/60 mt-0.5">
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'} created
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{ backgroundColor: theme.primary }}
          className="px-3.5 py-1.5 rounded-2xl text-xs font-extrabold text-white flex items-center space-x-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer active:scale-95"
        >
          <Plus size={16} />
          <span>New</span>
        </button>
      </div>

      {/* Tag filters row */}
      {allTags.length > 0 && (
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedTag === null
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Playlists grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPlaylists.map(playlist => {
          return (
            <div
              key={playlist.id}
              onClick={() => navigate({ name: 'playlistDetails', playlistId: playlist.id })}
              style={{
                backgroundColor: theme.surfaceContainer,
                borderColor: theme.border,
              }}
              className="p-3.5 rounded-3xl border shadow-md flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center space-x-3.5 overflow-hidden flex-1">
                {/* Custom Emoji and Color Icon */}
                <div
                  style={{
                    backgroundColor: `${playlist.color}35`,
                    borderColor: `${playlist.color}70`,
                  }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border shadow-inner group-hover:scale-105 transition-transform"
                >
                  {playlist.emoji}
                </div>

                <div className="overflow-hidden flex-1 pr-2">
                  <h3 className="text-sm font-black text-white truncate leading-tight">
                    {playlist.name}
                  </h3>
                  <span className="text-xs text-white/50 block mt-0.5 font-bold">
                    {playlist.musics.length} {playlist.musics.length === 1 ? 'track' : 'tracks'}
                  </span>

                  {/* Tags */}
                  {playlist.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {playlist.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/10 text-white/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Play Button */}
              <button
                onClick={e => handlePlayPlaylist(playlist, e)}
                style={{ backgroundColor: playlist.color }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform cursor-pointer flex-shrink-0"
                title="Play Playlist"
              >
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>

      <EditPlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
