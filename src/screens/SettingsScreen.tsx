import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { THEMES } from '../styles/theme';
import { ThemeName } from '../types/music';
import {
  Palette,
  Compass,
  Volume2,
  Clock,
  HardDrive,
  FileText,
  Save,
  Info,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sparkles,
  Check,
  Upload,
  Download,
  RotateCcw,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportBackup,
    importBackup,
    navigate,
    library,
    playlists,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const [activeCategory, setActiveCategory] = useState<
    'main' | 'lookAndFeel' | 'navigation' | 'playback' | 'library' | 'lyrics' | 'backup' | 'about'
  >('main');

  const [backupJson, setBackupJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const categories = [
    {
      id: 'lookAndFeel' as const,
      name: 'Look and Feel',
      desc: 'Theme colors, artwork backgrounds & slider styles',
      icon: Palette,
    },
    {
      id: 'navigation' as const,
      name: 'Navigation',
      desc: 'Default startup tab & interface preferences',
      icon: Compass,
    },
    {
      id: 'playback' as const,
      name: 'Playback',
      desc: 'Seek duration, speed controls & audio options',
      icon: Volume2,
    },
    {
      id: 'library' as const,
      name: 'Library & Folders',
      desc: 'Manage tracks, folder grouping & import music',
      icon: HardDrive,
    },
    {
      id: 'lyrics' as const,
      name: 'Lyrics',
      desc: 'Font sizes & sync preferences',
      icon: FileText,
    },
    {
      id: 'backup' as const,
      name: 'Backup and Restore',
      desc: 'Export or import your playlists & settings',
      icon: Save,
    },
    {
      id: 'about' as const,
      name: 'About Chocola',
      desc: 'Version 4.4.6, credits & information',
      icon: Info,
    },
  ];

  const handleExport = () => {
    const json = exportBackup();
    setBackupJson(json);
    // Trigger download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chocola-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportSubmit = () => {
    if (!backupJson.trim()) return;
    const success = importBackup(backupJson);
    if (success) {
      setImportStatus('Backup restored successfully! ✨');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Failed to parse backup JSON. Please check formatting.');
    }
  };

  // Sub-screen rendering
  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'lookAndFeel':
        return (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-white/70 block mb-2">Accent Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(Object.keys(THEMES) as ThemeName[]).map(key => {
                  const t = THEMES[key];
                  const isSelected = settings.theme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateSettings({ theme: key })}
                      style={{
                        backgroundColor: t.surfaceContainer,
                        borderColor: isSelected ? t.primary : t.border,
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all cursor-pointer ${
                        isSelected ? 'ring-2 ring-white/20 shadow-md' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: t.primary }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow flex-shrink-0"
                      >
                        {t.emoji}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <span className="text-xs font-bold text-white block truncate">{t.name}</span>
                        {isSelected && (
                          <span style={{ color: t.primary }} className="text-[10px] font-black uppercase">
                            Active
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blurred Artwork Background Toggle */}
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Album Art as Background</span>
                <span className="text-[10px] text-white/50">Blur current track artwork behind player</span>
              </div>
              <button
                onClick={() => updateSettings({ useArtAsBackground: !settings.useArtAsBackground })}
                style={{
                  backgroundColor: settings.useArtAsBackground ? theme.primary : 'rgba(255,255,255,0.1)',
                }}
                className="w-12 h-6 rounded-full transition-colors relative cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 ${
                    settings.useArtAsBackground ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Slider style */}
            <div>
              <label className="text-xs font-bold text-white/70 block mb-2">Seek Bar Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(['expressive', 'classic'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => updateSettings({ sliderStyle: style })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                      settings.sliderStyle === style
                        ? 'bg-white/20 border-white/30 text-white shadow'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/70 block mb-2">Default Startup Tab</label>
              <div className="space-y-2">
                {[
                  { id: 'main' as const, label: 'Songs Library' },
                  { id: 'albums' as const, label: 'Albums' },
                  { id: 'artists' as const, label: 'Artists' },
                  { id: 'playlists' as const, label: 'Playlists' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => updateSettings({ defaultStartupTab: item.id })}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      settings.defaultStartupTab === item.id
                        ? 'bg-white/15 border-white/25 text-white shadow'
                        : 'bg-black/20 border-white/5 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {settings.defaultStartupTab === item.id && (
                      <Check size={16} style={{ color: theme.primary }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'playback':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/70 block mb-2">Rewind / Fast Forward Interval</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 30].map(sec => (
                  <button
                    key={sec}
                    onClick={() => updateSettings({ seekButtonsDuration: sec })}
                    className={`py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                      settings.seekButtonsDuration === sec
                        ? 'bg-white/20 border-white/30 text-white shadow'
                        : 'bg-black/20 border-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Launch AOD */}
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Always On Display (AOD)</span>
                <span className="text-[10px] text-white/50">Launch minimal black AMOLED standby mode</span>
              </div>
              <button
                onClick={() => navigate({ name: 'aod' })}
                style={{ backgroundColor: theme.primary }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white cursor-pointer active:scale-95 shadow"
              >
                Launch
              </button>
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-black/20 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-white/60 block">Library Overview</span>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-white/5">
                  <span className="text-xl font-black text-white">{library.length}</span>
                  <span className="text-[10px] text-white/50 block font-bold mt-0.5">Total Tracks</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5">
                  <span className="text-xl font-black text-white">{playlists.length}</span>
                  <span className="text-[10px] text-white/50 block font-bold mt-0.5">Playlists</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Folder Grouping</span>
                <span className="text-[10px] text-white/50">Group songs by folder path in library</span>
              </div>
              <button
                onClick={() => updateSettings({ groupByFolders: !settings.groupByFolders })}
                style={{
                  backgroundColor: settings.groupByFolders ? theme.primary : 'rgba(255,255,255,0.1)',
                }}
                className="w-12 h-6 rounded-full transition-colors relative cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 ${
                    settings.groupByFolders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        );

      case 'lyrics':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/70 block mb-2">Lyrics Display Font Size</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small' as const, label: 'Small' },
                  { id: 'medium' as const, label: 'Medium' },
                  { id: 'large' as const, label: 'Large' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateSettings({ lyricsFontSize: opt.id })}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      settings.lyricsFontSize === opt.id
                        ? 'bg-white/20 border-white/30 text-white shadow'
                        : 'bg-black/20 border-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-black/20 border border-white/5 space-y-3">
              <span className="text-xs font-bold text-white block">Export Backup</span>
              <p className="text-[11px] text-white/60">
                Save your custom playlists, favorite tracks, and player settings to a JSON file.
              </p>
              <button
                onClick={handleExport}
                style={{ backgroundColor: theme.primary }}
                className="px-4 py-2 rounded-2xl text-xs font-black text-white flex items-center space-x-1.5 cursor-pointer shadow active:scale-95"
              >
                <Download size={14} />
                <span>Export to JSON File</span>
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-black/20 border border-white/5 space-y-3">
              <span className="text-xs font-bold text-white block">Restore Backup</span>
              <textarea
                value={backupJson}
                onChange={e => setBackupJson(e.target.value)}
                placeholder="Paste backup JSON here..."
                rows={5}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={handleImportSubmit}
                disabled={!backupJson.trim()}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
              >
                <Upload size={14} />
                <span>Restore Settings & Playlists</span>
              </button>

              {importStatus && (
                <p className="text-xs font-bold text-pink-400 mt-2">{importStatus}</p>
              )}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-4xl shadow-xl mx-auto mb-2">
              🎵
            </div>
            <h2 className="text-xl font-black text-white">Chocola</h2>
            <span className="text-xs font-bold text-white/50 block">v4.4.6 • React Edition</span>
            <p className="text-xs text-white/70 max-w-sm mx-auto leading-relaxed">
              A cute, fluid, and powerful offline music player originally developed by sosauce, rewritten for the web with Material 3 Expressive styling.
            </p>

            <div className="p-4 rounded-3xl bg-black/20 border border-white/5 max-w-sm mx-auto text-left space-y-2 mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-white/50 font-bold">Original Engine</span>
                <span className="text-white font-semibold">Jetpack Compose / ExoPlayer</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50 font-bold">Web Engine</span>
                <span className="text-white font-semibold">React / Web Audio API</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50 font-bold">Equalizer</span>
                <span className="text-white font-semibold">10-band BiquadFilterNode</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/50 font-bold">License</span>
                <span className="text-white font-semibold">GNU GPL v3</span>
              </div>
            </div>

            <div className="text-[11px] text-white/40 mt-6 font-bold">
              Enjoying Chocola? Keep spreading cuteness & music! 🌸
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-36 max-w-2xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center space-x-3 mb-5">
        {activeCategory !== 'main' && (
          <button
            onClick={() => setActiveCategory('main')}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {activeCategory === 'main'
              ? 'Settings'
              : categories.find(c => c.id === activeCategory)?.name}
          </h1>
          <p className="text-xs font-semibold text-white/50 mt-0.5">
            {activeCategory === 'main' ? 'App preferences & customization' : 'Category settings'}
          </p>
        </div>
      </div>

      {activeCategory === 'main' ? (
        <div className="space-y-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  backgroundColor: theme.surfaceContainer,
                  borderColor: theme.border,
                }}
                className="w-full p-3.5 rounded-3xl border shadow-sm flex items-center justify-between text-left hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3.5 overflow-hidden flex-1">
                  <div
                    style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-xs font-extrabold text-white truncate">{cat.name}</h3>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">{cat.desc}</p>
                  </div>
                </div>

                <ChevronRight size={18} className="text-white/40 group-hover:text-white transition-colors" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-black/15 border border-white/5">
          {renderCategoryContent()}
        </div>
      )}
    </div>
  );
};
