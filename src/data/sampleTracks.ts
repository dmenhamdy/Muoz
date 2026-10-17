import { CuteTrack, EqualizerPreset, Playlist } from '../types/music';
import { createSvgArtwork } from '../utils/artworks';

export const INITIAL_TRACKS: Omit<CuteTrack, 'uri'>[] = [
  {
    mediaId: 'track-1',
    title: "Chocola's Daydream",
    artist: 'sosauce',
    album: 'Cute Vibes Vol. 1',
    trackNumber: 1,
    folder: 'Chocola Favorites',
    path: '/storage/emulated/0/Music/Chocola Favorites/Chocola_Daydream.mp3',
    artUri: createSvgArtwork("Chocola's Daydream", 'sosauce', ['#ff758c', '#ff7eb3'], '🌸'),
    duration: 75,
    year: 2024,
    genre: 'Kawaii Lofi',
    dateAdded: Date.now() - 86400000 * 3,
    isFavorite: true,
    lyrics: `[00:02.00] Soft morning light creeping in through the lace
[00:08.50] A cozy warm blanket in my favorite place
[00:15.00] Cup of sweet cocoa, the steam starts to rise
[00:22.00] Looking out at the pastel pink skies
[00:29.50] Chocola hums a soft little song
[00:36.00] Floating along where melodies belong
[00:43.00] Gentle soft beats that ease all the stress
[00:50.00] Today is a day to feel truly blessed
[00:58.00] In this sweet daydream, forever we stay
[01:06.00] Whispering rhythm that carries us away~`
  },
  {
    mediaId: 'track-2',
    title: 'Pastel Clouds',
    artist: 'Chibi Beats',
    album: 'Dreamy Horizon',
    trackNumber: 2,
    folder: 'Chillhop',
    path: '/storage/emulated/0/Music/Chillhop/Pastel_Clouds.mp3',
    artUri: createSvgArtwork('Pastel Clouds', 'Chibi Beats', ['#a18cd1', '#fbc2eb'], '☁️'),
    duration: 75,
    year: 2024,
    genre: 'Ambient Chill',
    dateAdded: Date.now() - 86400000 * 5,
    isFavorite: true,
    lyrics: `[00:04.00] Drifting high above the town
[00:11.00] Not a single worry to pull us down
[00:18.00] Lavender mist and cotton candy hue
[00:26.00] Breathing in the quiet afternoon view
[00:34.00] Every cloud has a silver line
[00:42.00] Soft warm breezes ticking in time
[00:50.00] Just close your eyes and let it flow
[00:58.00] Wherever the pastel breezes blow~`
  },
  {
    mediaId: 'track-3',
    title: 'Strawberry Milk Tea',
    artist: 'Neko Sounds',
    album: 'Sweet Boba Cafe',
    trackNumber: 3,
    folder: 'Cafe Sessions',
    path: '/storage/emulated/0/Music/Cafe Sessions/Strawberry_Milk_Tea.mp3',
    artUri: createSvgArtwork('Strawberry Milk Tea', 'Neko Sounds', ['#f093fb', '#f5576c'], '🍓'),
    duration: 75,
    year: 2023,
    genre: 'Future Pop',
    dateAdded: Date.now() - 86400000 * 8,
    isFavorite: false,
    lyrics: `[00:03.00] Ice cubes clinking in the glass
[00:09.00] Watching sunny moments pass
[00:16.00] Sweet pink berries, cold fresh cream
[00:23.00] Sweeter than any summer dream
[00:31.00] Tapioca bouncing at the base
[00:38.00] Putting a bright smile on your face
[00:46.00] One sip, two sips, take your time
[00:54.00] Dancing to this cozy rhyme!`
  },
  {
    mediaId: 'track-4',
    title: 'Midnight Walk in Shibuya',
    artist: 'Tokyo Lo-Fi',
    album: 'Neon Rain',
    trackNumber: 4,
    folder: 'Night Vibes',
    path: '/storage/emulated/0/Music/Night Vibes/Midnight_Shibuya.mp3',
    artUri: createSvgArtwork('Midnight Walk', 'Tokyo Lo-Fi', ['#4facfe', '#00f2fe'], '🌃'),
    duration: 75,
    year: 2024,
    genre: 'Lo-Fi Chill',
    dateAdded: Date.now() - 86400000 * 12,
    isFavorite: true,
    lyrics: `[00:05.00] City lights reflect on the wet street
[00:12.00] Steady footsteps with a mellow beat
[00:20.00] Umbrella spinning under neon glow
[00:28.00] Watching empty train cars go
[00:36.00] Headphones on, blocking out the sound
[00:44.00] Peaceful solitude is found
[00:52.00] Midnight rhythm keeps me sane
[01:00.00] Washing away in gentle rain...`
  },
  {
    mediaId: 'track-5',
    title: 'Starlight Lullaby',
    artist: 'Sakura Drops',
    album: 'Cute Vibes Vol. 1',
    trackNumber: 5,
    folder: 'Chocola Favorites',
    path: '/storage/emulated/0/Music/Chocola Favorites/Starlight_Lullaby.mp3',
    artUri: createSvgArtwork('Starlight Lullaby', 'Sakura Drops', ['#fa709a', '#fee140'], '⭐'),
    duration: 75,
    year: 2023,
    genre: 'Acoustic Lo-Fi',
    dateAdded: Date.now() - 86400000 * 15,
    isFavorite: false,
    lyrics: `[00:05.00] Little stars twinkling so bright
[00:13.00] Guarding you through the quiet night
[00:21.00] Sleep timer ticking soft and slow
[00:29.00] Watching golden fireflies glow
[00:38.00] Rest your head, let slumber start
[00:46.00] Keep the music in your heart
[00:55.00] Goodnight dreamer, sleep so deep
[01:04.00] Promises the stars will keep...`
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-favorites',
    name: 'Loved Songs',
    emoji: '💖',
    musics: ['track-1', 'track-2', 'track-4'],
    color: '#ff4d6d',
    tags: ['Favorites', 'Daily', 'Cozy'],
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: 'playlist-chill',
    name: 'Late Night Chill',
    emoji: '🌙',
    musics: ['track-2', 'track-4', 'track-5'],
    color: '#8338ec',
    tags: ['Night', 'Study', 'Sleep'],
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'playlist-cafe',
    name: 'Sweet Cafe Beats',
    emoji: '☕',
    musics: ['track-1', 'track-3'],
    color: '#fb5607',
    tags: ['Cafe', 'Sweet'],
    createdAt: Date.now() - 86400000 * 2
  }
];

export const EQUALIZER_FREQUENCIES = [
  31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
];

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', emoji: '⚖️', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', emoji: '🔊', gains: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Vocal Booster', emoji: '🎙️', gains: [-2, -1, 0, 1, 3, 4, 3, 1, 0, -1] },
  { name: 'Pop', emoji: '🎤', gains: [-1, 1, 2, 3, 2, -1, -2, -1, 1, 2] },
  { name: 'Rock', emoji: '🎸', gains: [5, 4, 2, 0, -1, 0, 2, 3, 4, 4] },
  { name: 'EDM', emoji: '🪩', gains: [6, 5, 2, 0, -2, 2, 1, 3, 5, 4] }
];
