import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Music2, Disc3, Mic2, ListMusic, Settings as SettingsIcon } from 'lucide-react';
import { THEMES } from '../../styles/theme';

export const BottomBar: React.FC = () => {
  const { currentScreen, navigate, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const currentTab = currentScreen.name;

  const tabs = [
    { id: 'main', label: 'Songs', icon: Music2, screen: { name: 'main' as const } },
    { id: 'albums', label: 'Albums', icon: Disc3, screen: { name: 'albums' as const } },
    { id: 'artists', label: 'Artists', icon: Mic2, screen: { name: 'artists' as const } },
    { id: 'playlists', label: 'Playlists', icon: ListMusic, screen: { name: 'playlists' as const } },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, screen: { name: 'settings' as const } },
  ];

  return (
    <nav
      style={{
        backgroundColor: theme.surfaceContainer,
        borderColor: theme.border,
      }}
      className="fixed bottom-0 left-0 right-0 h-16 border-t px-2 flex items-center justify-around z-20 backdrop-blur-md select-none"
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id || (tab.id === 'albums' && currentTab === 'albumDetails') || (tab.id === 'artists' && currentTab === 'artistDetails') || (tab.id === 'playlists' && currentTab === 'playlistDetails');

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.screen)}
            className="flex flex-col items-center justify-center py-1 px-3 relative transition-all duration-200 group cursor-pointer"
          >
            {/* Material 3 active pill indicator */}
            <div
              style={{
                backgroundColor: isActive ? theme.primary : 'transparent',
                opacity: isActive ? 1 : 0,
              }}
              className="absolute inset-x-1.5 inset-y-1 rounded-2xl -z-10 transition-all duration-300 transform scale-90 group-hover:opacity-20"
            />
            
            <Icon
              size={22}
              className={`transition-all duration-200 ${isActive ? 'text-white scale-110' : 'text-white/60 group-hover:text-white/90'}`}
            />
            
            <span
              style={{
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: isActive ? 700 : 500,
              }}
              className="text-[11px] mt-0.5 tracking-tight transition-colors duration-200"
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
