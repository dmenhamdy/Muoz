import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { BottomBar } from './components/Navigation/BottomBar';
import { MiniPlayer } from './components/Player/MiniPlayer';
import { NowPlayingModal } from './components/Player/NowPlayingModal';
import { MainScreen } from './screens/MainScreen';
import { AlbumsScreen } from './screens/AlbumsScreen';
import { AlbumDetailsScreen } from './screens/AlbumDetailsScreen';
import { ArtistsScreen } from './screens/ArtistsScreen';
import { ArtistDetailsScreen } from './screens/ArtistDetailsScreen';
import { PlaylistsScreen } from './screens/PlaylistsScreen';
import { PlaylistDetailsScreen } from './screens/PlaylistDetailsScreen';
import { QueueScreen } from './screens/QueueScreen';
import { LyricsScreen } from './screens/LyricsScreen';
import { LyricsEditorScreen } from './screens/LyricsEditorScreen';
import { MetadataEditorScreen } from './screens/MetadataEditorScreen';
import { AodScreen } from './screens/AodScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { THEMES } from './styles/theme';

const AppContent: React.FC = () => {
  const { currentScreen, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'main':
        return <MainScreen />;
      case 'albums':
        return <AlbumsScreen />;
      case 'albumDetails':
        return <AlbumDetailsScreen albumName={currentScreen.albumName} />;
      case 'artists':
        return <ArtistsScreen />;
      case 'artistDetails':
        return <ArtistDetailsScreen artistName={currentScreen.artistName} />;
      case 'playlists':
        return <PlaylistsScreen />;
      case 'playlistDetails':
        return <PlaylistDetailsScreen playlistId={currentScreen.playlistId} />;
      case 'queue':
        return <QueueScreen />;
      case 'lyrics':
        return <LyricsScreen />;
      case 'lyricsEditor':
        return <LyricsEditorScreen trackId={currentScreen.trackId} />;
      case 'metadataEditor':
        return <MetadataEditorScreen trackId={currentScreen.trackId} />;
      case 'aod':
        return <AodScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <MainScreen />;
    }
  };

  const isAod = currentScreen.name === 'aod';
  const isLyrics = currentScreen.name === 'lyrics';

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.textPrimary,
      }}
      className="min-h-screen flex flex-col font-sans relative selection:bg-pink-500 selection:text-white"
    >
      {/* Active Screen View */}
      <main className="flex-1 flex flex-col w-full overflow-y-auto">
        {renderScreen()}
      </main>

      {/* Docked Mini Player and Bottom Nav Bar */}
      {!isAod && !isLyrics && (
        <>
          <MiniPlayer />
          <BottomBar />
        </>
      )}

      {/* Fullscreen Now Playing Overlay */}
      <NowPlayingModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
};

export default App;
