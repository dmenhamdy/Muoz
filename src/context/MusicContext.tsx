import React, { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  CuteTrack,
  MusicState,
  RepeatMode,
  Playlist,
  EqualizerBand,
  EqualizerPreset,
  AppSettings,
  AppScreen,
  ThemeName,
  LyricsLine,
} from '../types/music';
import { INITIAL_TRACKS, INITIAL_PLAYLISTS, EQUALIZER_FREQUENCIES, EQUALIZER_PRESETS } from '../data/sampleTracks';
import { AudioEngine } from '../audio/AudioEngine';
import { generateMelodyTrack } from '../utils/audioSynthesizer';
import { parseLrc } from '../utils/lyricsParser';
import { createSvgArtwork } from '../utils/artworks';

interface MusicContextType {
  state: MusicState;
  library: CuteTrack[];
  playlists: Playlist[];
  settings: AppSettings;
  currentScreen: AppScreen;
  screenHistory: AppScreen[];
  eqBands: EqualizerBand[];
  isEqEnabled: boolean;
  activePreset: string;
  isNowPlayingExpanded: boolean;
  selectedTrackIds: Set<string>;
  searchQuery: string;
  sortBy: 'title' | 'artist' | 'album' | 'dateAdded' | 'duration';
  sortOrder: 'asc' | 'desc';

  // Navigation
  navigate: (screen: AppScreen) => void;
  navigateBack: () => void;
  setIsNowPlayingExpanded: (expanded: boolean) => void;

  // Search & Filter
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'title' | 'artist' | 'album' | 'dateAdded' | 'duration') => void;
  toggleSortOrder: () => void;

  // Multi-selection
  toggleSelectTrack: (trackId: string) => void;
  selectAllTracks: (trackIds: string[]) => void;
  clearSelection: () => void;

  // Playback Actions
  playTrack: (track: CuteTrack, customQueue?: CuteTrack[]) => Promise<void>;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
  restartSong: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setSpeed: (speed: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Queue Actions
  playNext: (track: CuteTrack) => void;
  addToQueue: (tracks: CuteTrack[]) => void;
  removeFromQueue: (index: number) => void;
  reArrangeQueue: (from: number, to: number) => void;
  clearQueue: () => void;

  // Sleep Timer
  setSleepTimer: (hours: number, minutes: number) => void;
  cancelSleepTimer: () => void;

  // Equalizer Actions
  setBandGain: (bandIndex: number, gainDb: number) => void;
  applyPreset: (preset: EqualizerPreset) => void;
  toggleEqualizer: (enabled?: boolean) => void;

  // Playlist Actions
  createPlaylist: (name: string, emoji: string, color: string, tags: string[], initialTracks?: string[]) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addTracksToPlaylist: (playlistId: string, trackIds: string[]) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

  // Track & Library Actions
  toggleFavorite: (trackId: string) => void;
  updateTrackMetadata: (trackId: string, updates: Partial<CuteTrack>) => void;
  updateTrackLyrics: (trackId: string, lyrics: string) => void;
  deleteTrack: (trackId: string) => void;
  importFiles: (files: FileList | File[]) => Promise<void>;

  // Settings Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  exportBackup: () => string;
  importBackup: (jsonString: string) => boolean;
}

const MusicContext = createContext<MusicContextType | null>(null);

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'pink',
  useArtAsBackground: true,
  snapSpeedAndPitch: true,
  groupByFolders: false,
  seekButtonsDuration: 10,
  defaultStartupTab: 'main',
  lyricsFontSize: 'medium',
  sliderStyle: 'expressive',
  aodEnabled: true,
  hiddenFolders: [],
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const engine = useRef(AudioEngine.getInstance()).current;

  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>({ name: 'main' });
  const [screenHistory, setScreenHistory] = useState<AppScreen[]>([{ name: 'main' }]);
  const [isNowPlayingExpanded, setIsNowPlayingExpanded] = useState(false);

  // Library & Playlists state
  const [library, setLibrary] = useState<CuteTrack[]>(() => {
    const saved = localStorage.getItem('chocola_library');
    if (saved) {
      try {
        const parsed: CuteTrack[] = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing saved library', e);
      }
    }
    // Return empty placeholder until synthetic tracks load
    return [];
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('chocola_playlists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PLAYLISTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('chocola_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Player State
  const [state, setState] = useState<MusicState>({
    track: null,
    isPlaying: false,
    duration: 0,
    position: 0,
    speed: 1.0,
    pitch: 1.0,
    isPlayerReady: false,
    sleepTimerRemainingDuration: 0,
    mediaIndex: 0,
    repeatMode: 'off',
    shuffle: false,
    loadedMedias: [],
    lyrics: [],
    volume: 1.0,
    isMuted: false,
  });

  // Equalizer State
  const [isEqEnabled, setIsEqEnabled] = useState(true);
  const [activePreset, setActivePreset] = useState('Flat');
  const [eqBands, setEqBands] = useState<EqualizerBand[]>(() =>
    EQUALIZER_FREQUENCIES.map(freq => ({ frequency: freq, gain: 0 }))
  );

  // Search & Multi-selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album' | 'dateAdded' | 'duration'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sleep timer interval ref
  const sleepTimerRef = useRef<number | null>(null);

  // Keep state.loadedMedias and state.mediaIndex in refs for audio event callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  // Initialize synthesized audio blobs on first startup
  useEffect(() => {
    let isCancelled = false;

    async function initSampleTracks() {
      const saved = localStorage.getItem('chocola_library');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0 && parsed[0].uri) {
            setLibrary(parsed);
            if (!state.track && parsed.length > 0) {
              setState(prev => ({
                ...prev,
                track: parsed[0],
                loadedMedias: parsed,
                lyrics: parseLrc(parsed[0].lyrics || ''),
              }));
            }
            return;
          }
        } catch {
          // ignore
        }
      }

      // Generate tracks
      const melodyTypes: ('lofi' | 'pastel' | 'strawberry' | 'midnight' | 'starlight')[] = [
        'lofi', 'pastel', 'strawberry', 'midnight', 'starlight'
      ];

      const loadedTracks: CuteTrack[] = [];
      for (let i = 0; i < INITIAL_TRACKS.length; i++) {
        if (isCancelled) return;
        const initial = INITIAL_TRACKS[i];
        const audioUri = await generateMelodyTrack(melodyTypes[i % melodyTypes.length]);
        loadedTracks.push({
          ...initial,
          uri: audioUri,
        });
      }

      if (!isCancelled) {
        setLibrary(loadedTracks);
        localStorage.setItem('chocola_library', JSON.stringify(loadedTracks));
        if (loadedTracks.length > 0) {
          setState(prev => ({
            ...prev,
            track: loadedTracks[0],
            loadedMedias: loadedTracks,
            mediaIndex: 0,
            lyrics: parseLrc(loadedTracks[0].lyrics || ''),
            isPlayerReady: true,
          }));
        }
      }
    }

    initSampleTracks();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (library.length > 0) {
      localStorage.setItem('chocola_library', JSON.stringify(library));
    }
  }, [library]);

  useEffect(() => {
    localStorage.setItem('chocola_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('chocola_settings', JSON.stringify(settings));
  }, [settings]);

  // Sync Audio Engine events
  useEffect(() => {
    const audio = engine.audio;

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        position: audio.currentTime,
        duration: audio.duration && !isNaN(audio.duration) ? audio.duration : prev.duration,
      }));
    };

    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setState(prev => ({ ...prev, duration: audio.duration }));
      }
    };

    const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));

    const handleEnded = () => {
      const currState = stateRef.current;
      if (currState.repeatMode === 'one') {
        engine.seek(0);
        engine.play();
      } else {
        skipNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [engine]);

  // Navigation handlers
  const navigate = useCallback((screen: AppScreen) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  }, []);

  const navigateBack = useCallback(() => {
    setScreenHistory(prev => {
      if (prev.length <= 1) return prev;
      const nextHistory = prev.slice(0, -1);
      setCurrentScreen(nextHistory[nextHistory.length - 1]);
      return nextHistory;
    });
  }, []);

  // Playback control
  const playTrack = useCallback(async (track: CuteTrack, customQueue?: CuteTrack[]) => {
    const queue = customQueue || (stateRef.current.loadedMedias.length > 0 ? stateRef.current.loadedMedias : library);
    const index = queue.findIndex(t => t.mediaId === track.mediaId);

    setState(prev => ({
      ...prev,
      track,
      loadedMedias: queue,
      mediaIndex: index >= 0 ? index : 0,
      position: 0,
      duration: track.duration,
      lyrics: parseLrc(track.lyrics || ''),
      isPlayerReady: true,
    }));

    await engine.loadAndPlay(track.uri, true);
  }, [engine, library]);

  const togglePlayPause = useCallback(() => {
    if (!state.track) {
      if (library.length > 0) {
        playTrack(library[0]);
      }
      return;
    }

    if (state.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  }, [engine, library, playTrack, state.isPlaying, state.track]);

  const seekTo = useCallback((seconds: number) => {
    engine.seek(seconds);
    setState(prev => ({ ...prev, position: seconds }));
  }, [engine]);

  const skipNext = useCallback(() => {
    const curr = stateRef.current;
    if (curr.loadedMedias.length === 0) return;

    let nextIndex = curr.mediaIndex + 1;
    if (curr.shuffle) {
      nextIndex = Math.floor(Math.random() * curr.loadedMedias.length);
    } else if (nextIndex >= curr.loadedMedias.length) {
      if (curr.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // Stop playback at end of queue
        engine.pause();
        return;
      }
    }

    const nextTrack = curr.loadedMedias[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack, curr.loadedMedias);
    }
  }, [engine, playTrack]);

  const skipPrevious = useCallback(() => {
    const curr = stateRef.current;
    if (curr.loadedMedias.length === 0) return;

    // If more than 3 seconds in, restart song like native Android media player
    if (curr.position > 3) {
      engine.seek(0);
      return;
    }

    let prevIndex = curr.mediaIndex - 1;
    if (prevIndex < 0) {
      prevIndex = curr.loadedMedias.length - 1;
    }

    const prevTrack = curr.loadedMedias[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack, curr.loadedMedias);
    }
  }, [engine, playTrack]);

  const restartSong = useCallback(() => {
    engine.seek(0);
    setState(prev => ({ ...prev, position: 0 }));
  }, [engine]);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const cycleRepeatMode = useCallback(() => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length];
    setState(prev => ({ ...prev, repeatMode: nextMode }));
  }, [state.repeatMode]);

  const setSpeed = useCallback((speed: number) => {
    engine.setPlaybackRate(speed);
    setState(prev => ({ ...prev, speed }));
  }, [engine]);

  const setPitch = useCallback((pitch: number) => {
    setState(prev => ({ ...prev, pitch }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    engine.setVolume(volume);
    setState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
  }, [engine]);

  const toggleMute = useCallback(() => {
    setState(prev => {
      const nextMuted = !prev.isMuted;
      engine.setVolume(nextMuted ? 0 : prev.volume || 1);
      return { ...prev, isMuted: nextMuted };
    });
  }, [engine]);

  // Queue actions
  const playNext = useCallback((track: CuteTrack) => {
    setState(prev => {
      const newQueue = [...prev.loadedMedias];
      const insertAt = prev.mediaIndex + 1;
      newQueue.splice(insertAt, 0, track);
      return { ...prev, loadedMedias: newQueue };
    });
  }, []);

  const addToQueue = useCallback((tracks: CuteTrack[]) => {
    setState(prev => ({
      ...prev,
      loadedMedias: [...prev.loadedMedias, ...tracks],
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setState(prev => {
      const newQueue = [...prev.loadedMedias];
      newQueue.splice(index, 1);
      let nextIndex = prev.mediaIndex;
      if (index < prev.mediaIndex) {
        nextIndex--;
      } else if (index === prev.mediaIndex && newQueue.length > 0) {
        nextIndex = Math.min(nextIndex, newQueue.length - 1);
        if (newQueue[nextIndex]) {
          playTrack(newQueue[nextIndex], newQueue);
        }
      }
      return { ...prev, loadedMedias: newQueue, mediaIndex: Math.max(0, nextIndex) };
    });
  }, [playTrack]);

  const reArrangeQueue = useCallback((from: number, to: number) => {
    setState(prev => {
      const newQueue = [...prev.loadedMedias];
      const [moved] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, moved);
      return { ...prev, loadedMedias: newQueue };
    });
  }, []);

  const clearQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      loadedMedias: prev.track ? [prev.track] : [],
      mediaIndex: 0,
    }));
  }, []);

  // Sleep Timer
  const setSleepTimer = useCallback((hours: number, minutes: number) => {
    if (sleepTimerRef.current) {
      window.clearInterval(sleepTimerRef.current);
    }

    const totalSeconds = hours * 3600 + minutes * 60;
    if (totalSeconds <= 0) return;

    setState(prev => ({ ...prev, sleepTimerRemainingDuration: totalSeconds }));

    sleepTimerRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.sleepTimerRemainingDuration <= 1) {
          if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
          engine.pause();
          return { ...prev, sleepTimerRemainingDuration: 0, isPlaying: false };
        }
        return { ...prev, sleepTimerRemainingDuration: prev.sleepTimerRemainingDuration - 1 };
      });
    }, 1000);
  }, [engine]);

  const cancelSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      window.clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    setState(prev => ({ ...prev, sleepTimerRemainingDuration: 0 }));
  }, []);

  // Equalizer actions
  const setBandGain = useCallback((bandIndex: number, gainDb: number) => {
    engine.setBandGain(bandIndex, gainDb);
    setEqBands(prev => {
      const updated = [...prev];
      if (updated[bandIndex]) {
        updated[bandIndex] = { ...updated[bandIndex], gain: gainDb };
      }
      return updated;
    });
    setActivePreset('Custom');
  }, [engine]);

  const applyPreset = useCallback((preset: EqualizerPreset) => {
    engine.setAllBandGains(preset.gains);
    setEqBands(EQUALIZER_FREQUENCIES.map((freq, idx) => ({
      frequency: freq,
      gain: preset.gains[idx] || 0,
    })));
    setActivePreset(preset.name);
  }, [engine]);

  const toggleEqualizer = useCallback((enabled?: boolean) => {
    setIsEqEnabled(prev => {
      const next = enabled !== undefined ? enabled : !prev;
      engine.setEqualizerEnabled(next);
      return next;
    });
  }, [engine]);

  // Playlist actions
  const createPlaylist = useCallback((name: string, emoji: string, color: string, tags: string[], initialTracks: string[] = []): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name || 'My Cute Playlist',
      emoji: emoji || '🎵',
      color: color || '#ff4d6d',
      tags: tags || [],
      musics: initialTracks,
      createdAt: Date.now(),
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    return newPlaylist;
  }, []);

  const updatePlaylist = useCallback((id: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  const addTracksToPlaylist = useCallback((playlistId: string, trackIds: string[]) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id !== playlistId) return p;
      const combined = Array.from(new Set([...p.musics, ...trackIds]));
      return { ...p, musics: combined };
    }));
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id !== playlistId) return p;
      return { ...p, musics: p.musics.filter(id => id !== trackId) };
    }));
  }, []);

  // Track & Library actions
  const toggleFavorite = useCallback((trackId: string) => {
    setLibrary(prev => prev.map(t => {
      if (t.mediaId === trackId) {
        const nextFav = !t.isFavorite;
        // Also update in playlists 'Loved Songs'
        setPlaylists(pls => pls.map(p => {
          if (p.id === 'playlist-favorites') {
            const musics = nextFav
              ? Array.from(new Set([...p.musics, trackId]))
              : p.musics.filter(id => id !== trackId);
            return { ...p, musics };
          }
          return p;
        }));
        return { ...t, isFavorite: nextFav };
      }
      return t;
    }));

    setState(prev => {
      if (prev.track?.mediaId === trackId) {
        return {
          ...prev,
          track: { ...prev.track, isFavorite: !prev.track.isFavorite },
        };
      }
      return prev;
    });
  }, []);

  const updateTrackMetadata = useCallback((trackId: string, updates: Partial<CuteTrack>) => {
    setLibrary(prev => prev.map(t => (t.mediaId === trackId ? { ...t, ...updates } : t)));
    setState(prev => {
      if (prev.track?.mediaId === trackId) {
        return {
          ...prev,
          track: { ...prev.track, ...updates },
        };
      }
      return prev;
    });
  }, []);

  const updateTrackLyrics = useCallback((trackId: string, lyrics: string) => {
    updateTrackMetadata(trackId, { lyrics });
    if (stateRef.current.track?.mediaId === trackId) {
      setState(prev => ({
        ...prev,
        lyrics: parseLrc(lyrics),
      }));
    }
  }, [updateTrackMetadata]);

  const deleteTrack = useCallback((trackId: string) => {
    setLibrary(prev => prev.filter(t => t.mediaId !== trackId));
    setPlaylists(prev => prev.map(p => ({
      ...p,
      musics: p.musics.filter(id => id !== trackId),
    })));
    setState(prev => {
      const filtered = prev.loadedMedias.filter(t => t.mediaId !== trackId);
      if (prev.track?.mediaId === trackId) {
        return {
          ...prev,
          track: filtered[0] || null,
          loadedMedias: filtered,
          mediaIndex: 0,
          isPlaying: false,
        };
      }
      return { ...prev, loadedMedias: filtered };
    });
  }, []);

  // File import for local user audio files
  const importFiles = useCallback(async (files: FileList | File[]) => {
    const newTracks: CuteTrack[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)) {
        continue;
      }

      const blobUrl = URL.createObjectURL(file);
      const nameParts = file.name.replace(/\.[^/.]+$/, '').split(' - ');
      const title = nameParts.length > 1 ? nameParts[1].trim() : nameParts[0].trim();
      const artist = nameParts.length > 1 ? nameParts[0].trim() : 'Unknown Artist';

      // Estimate duration with Audio object
      let duration = 180;
      try {
        const tempAudio = new Audio(blobUrl);
        await new Promise<void>((resolve) => {
          tempAudio.addEventListener('loadedmetadata', () => {
            if (tempAudio.duration && !isNaN(tempAudio.duration)) {
              duration = tempAudio.duration;
            }
            resolve();
          });
          tempAudio.addEventListener('error', () => resolve());
          setTimeout(resolve, 1500);
        });
      } catch {
        // fallback duration
      }

      const newTrack: CuteTrack = {
        mediaId: `imported-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        artist,
        album: 'Imported Tracks',
        trackNumber: newTracks.length + 1,
        folder: 'Local Files',
        path: `/local/${file.name}`,
        uri: blobUrl,
        artUri: createSvgArtwork(title, artist, ['#9b5de5', '#f15bb5'], '🎧'),
        duration,
        year: new Date().getFullYear(),
        genre: 'User Import',
        dateAdded: Date.now(),
        isFavorite: false,
      };

      newTracks.push(newTrack);
    }

    if (newTracks.length > 0) {
      setLibrary(prev => [...newTracks, ...prev]);
    }
  }, []);

  // Multi-selection
  const toggleSelectTrack = useCallback((trackId: string) => {
    setSelectedTrackIds(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const selectAllTracks = useCallback((trackIds: string[]) => {
    setSelectedTrackIds(new Set(trackIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTrackIds(new Set());
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  // Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const exportBackup = useCallback((): string => {
    const backupData = {
      version: '4.4.6',
      exportDate: new Date().toISOString(),
      playlists,
      settings,
      favorites: library.filter(t => t.isFavorite).map(t => t.mediaId),
    };
    return JSON.stringify(backupData, null, 2);
  }, [library, playlists, settings]);

  const importBackup = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.playlists) setPlaylists(data.playlists);
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
      if (data.favorites && Array.isArray(data.favorites)) {
        setLibrary(prev => prev.map(t => ({
          ...t,
          isFavorite: data.favorites.includes(t.mediaId),
        })));
      }
      return true;
    } catch (err) {
      console.error('Backup restore failed', err);
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      library,
      playlists,
      settings,
      currentScreen,
      screenHistory,
      eqBands,
      isEqEnabled,
      activePreset,
      isNowPlayingExpanded,
      selectedTrackIds,
      searchQuery,
      sortBy,
      sortOrder,

      navigate,
      navigateBack,
      setIsNowPlayingExpanded,

      setSearchQuery,
      setSortBy,
      toggleSortOrder,

      toggleSelectTrack,
      selectAllTracks,
      clearSelection,

      playTrack,
      togglePlayPause,
      seekTo,
      skipNext,
      skipPrevious,
      restartSong,
      toggleShuffle,
      cycleRepeatMode,
      setSpeed,
      setPitch,
      setVolume,
      toggleMute,

      playNext,
      addToQueue,
      removeFromQueue,
      reArrangeQueue,
      clearQueue,

      setSleepTimer,
      cancelSleepTimer,

      setBandGain,
      applyPreset,
      toggleEqualizer,

      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTracksToPlaylist,
      removeTrackFromPlaylist,

      toggleFavorite,
      updateTrackMetadata,
      updateTrackLyrics,
      deleteTrack,
      importFiles,

      updateSettings,
      exportBackup,
      importBackup,
    }),
    [
      state,
      library,
      playlists,
      settings,
      currentScreen,
      screenHistory,
      eqBands,
      isEqEnabled,
      activePreset,
      isNowPlayingExpanded,
      selectedTrackIds,
      searchQuery,
      sortBy,
      sortOrder,
      navigate,
      navigateBack,
      playTrack,
      togglePlayPause,
      seekTo,
      skipNext,
      skipPrevious,
      restartSong,
      toggleShuffle,
      cycleRepeatMode,
      setSpeed,
      setPitch,
      setVolume,
      toggleMute,
      playNext,
      addToQueue,
      removeFromQueue,
      reArrangeQueue,
      clearQueue,
      setSleepTimer,
      cancelSleepTimer,
      setBandGain,
      applyPreset,
      toggleEqualizer,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTracksToPlaylist,
      removeTrackFromPlaylist,
      toggleFavorite,
      updateTrackMetadata,
      updateTrackLyrics,
      deleteTrack,
      importFiles,
      updateSettings,
      exportBackup,
      importBackup,
    ]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
