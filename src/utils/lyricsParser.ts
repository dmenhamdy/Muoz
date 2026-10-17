import { LyricsLine } from '../types/music';

/**
 * Parses LRC lyrics formatted string into an array of LyricsLine
 */
export function parseLrc(lrcText: string): LyricsLine[] {
  if (!lrcText || !lrcText.trim()) return [];

  const lines = lrcText.split(/\r?\n/);
  const result: LyricsLine[] = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;

    // Check for timestamps
    const matches = [...rawLine.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = rawLine.replace(timeRegex, '').trim();
      for (const match of matches) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const fraction = match[3] ? parseFloat('0.' + match[3]) : 0;
        const totalSeconds = minutes * 60 + seconds + fraction;

        result.push({
          id: `lyric-${i}-${totalSeconds}`,
          timestamp: totalSeconds,
          lineLyrics: text,
        });
      }
    } else {
      // Plain line without timestamp
      if (rawLine.trim().startsWith('[') && rawLine.includes(':')) {
        // ID3 tag like [ti:Title] - skip or keep
        continue;
      }
      result.push({
        id: `lyric-${i}`,
        timestamp: -1,
        lineLyrics: rawLine.trim(),
      });
    }
  }

  // Sort timestamps in ascending order
  const timestamped = result.filter(r => r.timestamp >= 0).sort((a, b) => a.timestamp - b.timestamp);
  const untimestamped = result.filter(r => r.timestamp < 0);

  return timestamped.length > 0 ? timestamped : untimestamped;
}

/**
 * Formats seconds into mm:ss or mm:ss.xx
 */
export function formatTime(seconds: number, includeMs = false): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');
  if (includeMs) {
    const formattedMs = String(ms).padStart(2, '0');
    return `${formattedMins}:${formattedSecs}.${formattedMs}`;
  }
  return `${formattedMins}:${formattedSecs}`;
}

/**
 * Serializes LyricsLine list back to LRC string
 */
export function stringifyLrc(lines: LyricsLine[]): string {
  return lines
    .map(line => {
      if (line.timestamp >= 0) {
        return `[${formatTime(line.timestamp, true)}] ${line.lineLyrics}`;
      }
      return line.lineLyrics;
    })
    .join('\n');
}
