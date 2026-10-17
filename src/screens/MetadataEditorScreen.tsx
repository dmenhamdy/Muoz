import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ChevronLeft, Save, Music, User, Disc, Calendar, Hash, Tag } from 'lucide-react';

interface MetadataEditorScreenProps {
  trackId: string;
}

export const MetadataEditorScreen: React.FC<MetadataEditorScreenProps> = ({ trackId }) => {
  const { library, updateTrackMetadata, navigateBack, state, settings } = useMusic();
  const theme = THEMES[settings.theme];
  const track = library.find(t => t.mediaId === trackId) || state.track;

  const [title, setTitle] = useState(track?.title || '');
  const [artist, setArtist] = useState(track?.artist || '');
  const [album, setAlbum] = useState(track?.album || '');
  const [year, setYear] = useState(track?.year ? String(track.year) : '');
  const [genre, setGenre] = useState(track?.genre || '');
  const [trackNumber, setTrackNumber] = useState(track?.trackNumber ? String(track.trackNumber) : '1');

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

  const handleSave = () => {
    updateTrackMetadata(track.mediaId, {
      title: title.trim() || track.title,
      artist: artist.trim() || track.artist,
      album: album.trim() || track.album,
      year: year ? parseInt(year, 10) : undefined,
      genre: genre.trim() || undefined,
      trackNumber: trackNumber ? parseInt(trackNumber, 10) : 1,
    });
    navigateBack();
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={navigateBack}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Edit Metadata</h1>
            <p className="text-xs text-white/50">Edit song tags and ID3 fields</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{ backgroundColor: theme.primary }}
          className="px-5 py-2 rounded-2xl text-xs font-black text-white flex items-center space-x-1.5 shadow-lg cursor-pointer active:scale-95"
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Artwork banner */}
      <div className="flex items-center space-x-4 p-4 rounded-3xl bg-black/25 border border-white/10 mb-6">
        <img
          src={track.artUri}
          alt=""
          className="w-16 h-16 rounded-2xl object-cover shadow-md border border-white/10 flex-shrink-0"
        />
        <div className="overflow-hidden flex-1">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Editing Song</span>
          <h2 className="text-sm font-bold text-white truncate">{track.title}</h2>
          <p className="text-xs text-white/60 truncate font-mono mt-0.5">{track.path}</p>
        </div>
      </div>

      {/* Edit fields */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-bold text-white/70 flex items-center space-x-1.5 mb-1.5">
            <Music size={14} style={{ color: theme.primary }} />
            <span>Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Artist */}
        <div>
          <label className="text-xs font-bold text-white/70 flex items-center space-x-1.5 mb-1.5">
            <User size={14} style={{ color: theme.primary }} />
            <span>Artist</span>
          </label>
          <input
            type="text"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Album */}
        <div>
          <label className="text-xs font-bold text-white/70 flex items-center space-x-1.5 mb-1.5">
            <Disc size={14} style={{ color: theme.primary }} />
            <span>Album</span>
          </label>
          <input
            type="text"
            value={album}
            onChange={e => setAlbum(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Year */}
          <div>
            <label className="text-xs font-bold text-white/70 flex items-center space-x-1.5 mb-1.5">
              <Calendar size={14} />
              <span>Year</span>
            </label>
            <input
              type="number"
              placeholder="2024"
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-pink-500 text-center"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="text-xs font-bold text-white/70 flex items-center space-x-1.5 mb-1.5">
              <Tag size={14} />
              <span>Genre</span>
            </label>
            <input
              type="text"
              placeholder="Lofi"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Track Number */}
          <div>
            <label className="text-xs font-bold text-white/70 flex items-center space-x-1.5 mb-1.5">
              <Hash size={14} />
              <span>Track #</span>
            </label>
            <input
              type="number"
              placeholder="1"
              value={trackNumber}
              onChange={e => setTrackNumber(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-pink-500 text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
