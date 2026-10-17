<p align=center><image src="https://i.ibb.co/N6qJFWMw/icon.png" height="160" style="border-radius: 50%;" /></p>
<h1 align="center">Chocola - Cute Music Player (React Edition)</h1>
<p align="center">A cute, fluid, and powerful offline music player with Material 3 Expressive design, rewritten from Android to React + TypeScript + Web Audio API.</p>

---

## ✨ Features

- **Material 3 Expressive UI**: Aesthetic pastel color themes (Strawberry Milk, Lavender Dream, Matcha Mint, Sweet Peach, AMOLED Black, Ocean Cyan) with fluid animations and squircle shapes.
- **10-Band Built-in Equalizer**: Real-time Web Audio API frequency filtering across 10 bands (31Hz - 16kHz) with audio presets (Flat, Bass Boost, Vocal Booster, Pop, Rock, EDM) and a real-time audio spectrum visualizer.
- **Synchronized Lyrics & Lyrics Editor**: Full karaoke-style auto-scrolling synced lyrics with one-click seek to line, plus an interactive LRC editor with real-time timestamp stamping.
- **Rich Playback Controls**:
  - Play, pause, skip, scrub bar with elapsed and remaining time
  - Playback speed & pitch controls (0.5x to 2.0x) with snap toggle
  - Configurable seek rewind / fast-forward (5s, 10s, 15s, 30s)
  - Shuffle and Repeat modes (Off, All, One)
  - Queue management: reorder tracks, play next, add to queue, clear queue
- **Custom Playlists**: Create personalized playlists with cute emoji icons, custom accent colors, and tag filters.
- **Sleep Timer**: Customizable countdown timer with quick presets (15m, 30m, 45m, 1h) and smooth auto-pause.
- **Library Management**:
  - Search across songs, artists, albums, and folders
  - Group by folders toggle
  - Multi-selection actions: play selection, add to playlist, add to queue, batch delete
  - Drag-and-drop & file picker import for local audio files (.mp3, .wav, .flac, .ogg, .m4a)
- **ID3 Metadata Editor**: Edit song title, artist, album, year, genre, and track number.
- **Always On Display (AOD)**: Minimal true AMOLED standby mode with digital clock, date, and essential player controls.
- **Backup & Restore**: Export and import your playlists, settings, and favorites as JSON.

---

## 🛠️ Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Audio Processing**: Web Audio API (BiquadFilterNode chain, AnalyserNode, AudioContext)
- **Styling**: Tailwind CSS, Material 3 Expressive tokens & color systems
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage & Object URLs

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 License

GPL-3.0 License. Original Android application by sosauce. Rewritten as a modern React web application.
