import React, { useMemo } from 'react';
import { useMusic } from '../context/MusicContext';
import { CuteSearchbar } from '../components/Navigation/CuteSearchbar';
import { MusicListItem } from '../components/Common/MusicListItem';
import { SelectedBar } from '../components/Common/SelectedBar';
import { THEMES } from '../styles/theme';
import { Shuffle, Play, Music, Folder, Sparkles } from 'lucide-react';
import { CuteTrack } from '../types/music';

export const MainScreen: React.FC = () => {
  const {
    library,
    searchQuery,
    sortBy,
    sortOrder,
    settings,
    playTrack,
    state,
  } = useMusic();

  const theme = THEMES[settings.theme];

  // Filter and sort tracks
  const filteredTracks = useMemo(() => {
    let result = [...library];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q) ||
          t.folder.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'artist':
          cmp = a.artist.localeCompare(b.artist);
          break;
        case 'album':
          cmp = a.album.localeCompare(b.album);
          break;
        case 'duration':
          cmp = a.duration - b.duration;
          break;
        case 'dateAdded':
          cmp = a.dateAdded - b.dateAdded;
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [library, searchQuery, sortBy, sortOrder]);

  // Group by folders if enabled
  const folderGroups = useMemo(() => {
    if (!settings.groupByFolders) return null;
    const groups: Record<string, CuteTrack[]> = {};
    for (const track of filteredTracks) {
      const fName = track.folder || 'Default Folder';
      if (!groups[fName]) groups[fName] = [];
      groups[fName].push(track);
    }
    return groups;
  }, [filteredTracks, settings.groupByFolders]);

  const handleShuffleAll = () => {
    if (filteredTracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredTracks.length);
    playTrack(filteredTracks[randomIndex], filteredTracks);
  };

  const handlePlayAll = () => {
    if (filteredTracks.length === 0) return;
    playTrack(filteredTracks[0], filteredTracks);
  };

  const allTrackIds = filteredTracks.map(t => t.mediaId);

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Header / Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Music Library</h1>
            <Sparkles size={18} style={{ color: theme.primary }} />
          </div>
          <p className="text-xs font-semibold text-white/60 mt-0.5">
            {filteredTracks.length} {filteredTracks.length === 1 ? 'song' : 'songs'} in your collection
          </p>
        </div>

        {/* Play all / Shuffle buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShuffleAll}
            style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
            className="px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 hover:opacity-85 transition-opacity cursor-pointer shadow-sm active:scale-95"
            title="Shuffle All"
          >
            <Shuffle size={14} />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handlePlayAll}
            style={{ backgroundColor: theme.primary, color: '#ffffff' }}
            className="px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-md active:scale-95"
            title="Play All"
          >
            <Play size={14} fill="currentColor" />
            <span>Play</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <CuteSearchbar placeholder="Search songs, artists, albums..." />

      {/* Track List */}
      <div className="flex-1 mt-2">
        {filteredTracks.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div
              style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
              className="w-16 h-16 rounded-3xl flex items-center justify-center mb-3"
            >
              <Music size={32} />
            </div>
            <h3 className="font-bold text-base text-white">No tracks found</h3>
            <p className="text-xs text-white/50 max-w-xs mt-1">
              Try a different search term or import audio files using the upload button above.
            </p>
          </div>
        ) : folderGroups ? (
          // Folder Grouping View
          <div className="space-y-4">
            {Object.entries(folderGroups).map(([folderName, tracks]) => (
              <div key={folderName} className="space-y-1.5">
                <div className="flex items-center space-x-2 px-2 py-1 text-xs font-black text-white/80">
                  <Folder size={14} style={{ color: theme.primary }} />
                  <span className="truncate">{folderName}</span>
                  <span className="text-[10px] text-white/40">({tracks.length})</span>
                </div>
                {tracks.map((track, idx) => (
                  <MusicListItem key={track.mediaId} track={track} index={idx} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          // Standard List View
          filteredTracks.map((track, idx) => (
            <MusicListItem key={track.mediaId} track={track} index={idx} />
          ))
        )}
      </div>

      <SelectedBar allTrackIds={allTrackIds} />
    </div>
  );
};
