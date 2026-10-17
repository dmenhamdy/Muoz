import React, { useMemo } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { Disc3, Play } from 'lucide-react';
import { CuteTrack } from '../types/music';

export const AlbumsScreen: React.FC = () => {
  const { library, navigate, playTrack, settings } = useMusic();
  const theme = THEMES[settings.theme];

  // Group library by album
  const albums = useMemo(() => {
    const map = new Map<string, { name: string; artist: string; artUri: string; tracks: CuteTrack[] }>();

    library.forEach(track => {
      const albumName = track.album || 'Unknown Album';
      if (!map.has(albumName)) {
        map.set(albumName, {
          name: albumName,
          artist: track.artist || 'Various Artists',
          artUri: track.artUri,
          tracks: [],
        });
      }
      map.get(albumName)!.tracks.push(track);
    });

    return Array.from(map.values());
  }, [library]);

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Albums</h1>
          <p className="text-xs font-semibold text-white/60 mt-0.5">
            {albums.length} {albums.length === 1 ? 'album' : 'albums'} available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {albums.map(album => (
          <div
            key={album.name}
            onClick={() => navigate({ name: 'albumDetails', albumName: album.name })}
            style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
            className="group rounded-3xl p-3 border shadow-md hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Artwork thumbnail */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-2.5 shadow-md bg-black/40">
              <img
                src={album.artUri}
                alt={album.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={e => {
                  e.stopPropagation();
                  playTrack(album.tracks[0], album.tracks);
                }}
                style={{ backgroundColor: theme.primary }}
                className="absolute bottom-2 right-2 w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
              >
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>

            <h3 className="text-xs font-black text-white truncate leading-tight">
              {album.name}
            </h3>
            <p className="text-[11px] font-semibold text-white/60 truncate mt-0.5">
              {album.artist}
            </p>
            <span className="text-[10px] text-white/40 block mt-1 font-bold">
              {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
