import React from 'react';
import { CuteTrack } from '../../types/music';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { Info, X, Music, Folder, Calendar, Disc, Clock, Hash } from 'lucide-react';
import { formatTime } from '../../utils/lyricsParser';

interface TracksDetailsDialogProps {
  track: CuteTrack | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TracksDetailsDialog: React.FC<TracksDetailsDialogProps> = ({ track, isOpen, onClose }) => {
  const { settings } = useMusic();
  const theme = THEMES[settings.theme];

  if (!isOpen || !track) return null;

  const details = [
    { label: 'Title', value: track.title, icon: Music },
    { label: 'Artist', value: track.artist, icon: Music },
    { label: 'Album', value: track.album, icon: Disc },
    { label: 'Track #', value: track.trackNumber ? `#${track.trackNumber}` : '1', icon: Hash },
    { label: 'Duration', value: formatTime(track.duration), icon: Clock },
    { label: 'Year', value: track.year ? `${track.year}` : 'Unknown', icon: Calendar },
    { label: 'Folder', value: track.folder, icon: Folder },
    { label: 'File Path', value: track.path, icon: Folder, breakAll: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: theme.surfaceContainer,
          borderColor: theme.border,
        }}
        className="w-full max-w-md rounded-3xl p-5 border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div
              style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
            >
              <Info size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Track Details</h3>
              <p className="text-[11px] text-white/60">Metadata & file properties</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content list */}
        <div className="py-3 overflow-y-auto space-y-2.5">
          {details.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/20 border border-white/5 flex items-start space-x-3"
              >
                <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/60">
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-white/50 block">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-semibold text-white/95 ${
                      item.breakAll ? 'break-all font-mono text-[11px] opacity-80' : 'truncate block'
                    }`}
                  >
                    {item.value || 'None'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            style={{ backgroundColor: theme.primary }}
            className="px-5 py-2 rounded-2xl text-white text-xs font-bold cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
