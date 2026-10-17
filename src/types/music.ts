export interface CuteTrack {
  mediaId: string;
  title: string;
  artist: string;
  album: string;
  trackNumber: number;
  folder: string;
  path: string;
  uri: string;
  artUri: string;
  duration: number; // in seconds
  year?: number;
  genre?: string;
  lyrics?: string; // synced LRC text or plain text
  dateAdded: number;
  isFavorite?: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface LyricsLine {
  id: string | number;
  timestamp: number; // in seconds
  lineLyrics: string;
}

export interface EqualizerBand {
  frequency: number; // in Hz: 31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
  gain: number; // in dB: -12 to +12
}

export interface EqualizerPreset {
  name: string;
  emoji: string;
  gains: number[];
}

export interface Playlist {
  id: string;
  name: string;
  emoji: string;
  musics: string[]; // list of mediaIds
  color: string; // color hex code or name
  tags: string[];
  createdAt: number;
}

export type AppScreen =
  | { name: 'main' }
  | { name: 'albums' }
  | { name: 'albumDetails'; albumName: string }
  | { name: 'artists' }
  | { name: 'artistDetails'; artistName: string }
  | { name: 'playlists' }
  | { name: 'playlistDetails'; playlistId: string }
  | { name: 'queue' }
  | { name: 'lyrics' }
  | { name: 'lyricsEditor'; trackId: string }
  | { name: 'metadataEditor'; trackId: string }
  | { name: 'aod' }
  | { name: 'settings'; subScreen?: 'lookAndFeel' | 'navigation' | 'aod' | 'playback' | 'library' | 'lyrics' | 'backup' | 'about' };

export type ThemeName = 'pink' | 'purple' | 'mint' | 'peach' | 'amoled' | 'blue';

export interface AppSettings {
  theme: ThemeName;
  useArtAsBackground: boolean;
  snapSpeedAndPitch: boolean;
  groupByFolders: boolean;
  seekButtonsDuration: number; // in seconds (5, 10, 15, 30)
  defaultStartupTab: 'main' | 'albums' | 'artists' | 'playlists';
  lyricsFontSize: 'small' | 'medium' | 'large';
  sliderStyle: 'classic' | 'wavy' | 'expressive';
  aodEnabled: boolean;
  hiddenFolders: string[];
}

export interface MusicState {
  track: CuteTrack | null;
  isPlaying: boolean;
  duration: number; // seconds
  position: number; // seconds
  speed: number; // playback rate (e.g. 1.0)
  pitch: number; // pitch value (e.g. 1.0)
  isPlayerReady: boolean;
  sleepTimerRemainingDuration: number; // seconds (0 = off)
  mediaIndex: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  loadedMedias: CuteTrack[];
  lyrics: LyricsLine[];
  volume: number; // 0 to 1
  isMuted: boolean;
}
