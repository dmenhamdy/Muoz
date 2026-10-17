import React, { useRef, useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { Search, X, ArrowUpDown, UploadCloud, FolderSync, Check } from 'lucide-react';

interface CuteSearchbarProps {
  placeholder?: string;
}

export const CuteSearchbar: React.FC<CuteSearchbarProps> = ({ placeholder = 'Search songs, albums, artists...' }) => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    importFiles,
    settings,
    updateSettings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importFiles(e.target.files);
    }
  };

  const sortOptions = [
    { id: 'title' as const, label: 'Title' },
    { id: 'artist' as const, label: 'Artist' },
    { id: 'album' as const, label: 'Album' },
    { id: 'duration' as const, label: 'Duration' },
    { id: 'dateAdded' as const, label: 'Date Added' },
  ];

  return (
    <div className="w-full space-y-2 mb-3">
      <div
        style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
        className="w-full rounded-3xl p-1.5 px-3 border shadow-md flex items-center space-x-2 backdrop-blur-md"
      >
        <Search size={18} className="text-white/50 flex-shrink-0 ml-1" />

        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs font-semibold text-white placeholder-white/40 focus:outline-none"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X size={12} />
          </button>
        )}

        {/* Sort Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            style={{
              backgroundColor: showSortMenu ? theme.primary : 'rgba(255,255,255,0.08)',
              color: '#ffffff',
            }}
            className="w-8 h-8 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
            title="Sort tracks"
          >
            <ArrowUpDown size={15} />
          </button>

          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowSortMenu(false)}
              />
              <div
                style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
                className="absolute right-0 mt-2 w-48 rounded-3xl p-2 shadow-2xl border backdrop-blur-xl z-30"
              >
                <div className="px-3 py-1.5 text-[10px] font-black uppercase text-white/50 tracking-wider">
                  Sort By
                </div>
                {sortOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (sortBy === opt.id) {
                        toggleSortOrder();
                      } else {
                        setSortBy(opt.id);
                      }
                      setShowSortMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-left hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && (
                      <span className="text-[10px] text-pink-400 font-extrabold flex items-center space-x-1">
                        <span>{sortOrder.toUpperCase()}</span>
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Upload Audio File Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
          className="w-8 h-8 rounded-2xl flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer"
          title="Import music files (.mp3, .wav, .flac)"
        >
          <UploadCloud size={17} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Group by folders pill toggle */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => updateSettings({ groupByFolders: !settings.groupByFolders })}
          style={{
            backgroundColor: settings.groupByFolders ? theme.primary : 'rgba(255, 255, 255, 0.08)',
            color: settings.groupByFolders ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
          }}
          className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
        >
          <FolderSync size={13} />
          <span>{settings.groupByFolders ? 'Folders View (Active)' : 'Group by Folders'}</span>
        </button>
      </div>
    </div>
  );
};
