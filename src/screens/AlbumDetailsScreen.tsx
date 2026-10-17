import React from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ChevronLeft, Play, Shuffle } from 'lucide-react';
import { MusicListItem } from '../components/Common/MusicListItem';

interface AlbumDetailsScreenProps {
  albumName: string;
}

export const AlbumDetailsScreen: React.FC<AlbumDetailsScreenProps> = ({ albumName }) => {
  const { library, navigateBack, playTrack, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const tracks = library.filter(t => (t.album || 'Unknown Album') === albumName);
  const artist = tracks[0]?.artist || 'Unknown Artist';
  const artUri = tracks[0]?.artUri;
  const year = tracks[0]?.year;

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

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Top back button */}
      <button
        onClick={navigateBack}
        className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center mb-4 transition-colors cursor-pointer"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-5 mb-6 text-center sm:text-left">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[36px] overflow-hidden shadow-2xl border-2 border-white/10 flex-shrink-0">
          <img src={artUri} alt={albumName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <span className="text-xs font-bold text-white/50 tracking-wider uppercase">
            Album
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mt-1">
            {albumName}
          </h1>
          <p className="text-sm font-bold text-white/80 mt-1">
            {artist} {year ? `• ${year}` : ''}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {tracks.length} songs
          </p>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 mt-4 justify-center sm:justify-start">
            <button
              onClick={handlePlayAll}
              style={{ backgroundColor: theme.primary }}
              className="px-5 py-2.5 rounded-2xl text-xs font-black text-white flex items-center space-x-2 shadow-lg cursor-pointer active:scale-95"
            >
              <Play size={15} fill="currentColor" />
              <span>Play All</span>
            </button>
            <button
              onClick={handleShuffleAll}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center space-x-2 transition-colors cursor-pointer active:scale-95"
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
          Tracklist
        </h3>
        {tracks.map((track, idx) => (
          <MusicListItem
            key={track.mediaId}
            track={track}
            index={idx}
            onPlay={() => playTrack(track, tracks)}
          />
        ))}
      </div>
    </div>
  );
};
