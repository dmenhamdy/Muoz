import React, { useMemo } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { Mic2, Play } from 'lucide-react';
import { CuteTrack } from '../types/music';

export const ArtistsScreen: React.FC = () => {
  const { library, navigate, playTrack, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const artists = useMemo(() => {
    const map = new Map<string, { name: string; artUri: string; tracks: CuteTrack[]; albums: Set<string> }>();

    library.forEach(track => {
      const artistName = track.artist || 'Unknown Artist';
      if (!map.has(artistName)) {
        map.set(artistName, {
          name: artistName,
          artUri: track.artUri,
          tracks: [],
          albums: new Set(),
        });
      }
      const entry = map.get(artistName)!;
      entry.tracks.push(track);
      if (track.album) entry.albums.add(track.album);
    });

    return Array.from(map.values());
  }, [library]);

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Artists</h1>
          <p className="text-xs font-semibold text-white/60 mt-0.5">
            {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {artists.map(artist => (
          <div
            key={artist.name}
            onClick={() => navigate({ name: 'artistDetails', artistName: artist.name })}
            style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
            className="group rounded-3xl p-4 border shadow-md hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center text-center"
          >
            {/* Circular Artist Avatar */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 shadow-lg bg-black/40 border-2 border-white/10 group-hover:scale-105 transition-transform duration-300">
              <img
                src={artist.artUri}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={e => {
                  e.stopPropagation();
                  playTrack(artist.tracks[0], artist.tracks);
                }}
                style={{ backgroundColor: theme.primary }}
                className="absolute inset-0 m-auto w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
              >
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
            </div>

            <h3 className="text-xs font-black text-white truncate max-w-full leading-tight">
              {artist.name}
            </h3>
            <span className="text-[10px] text-white/50 block mt-1 font-bold">
              {artist.tracks.length} songs • {artist.albums.size} albums
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
