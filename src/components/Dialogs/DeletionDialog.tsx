import React from 'react';
import { CuteTrack } from '../../types/music';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeletionDialogProps {
  tracks: CuteTrack[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  playlistContext?: boolean;
}

export const DeletionDialog: React.FC<DeletionDialogProps> = ({
  tracks,
  isOpen,
  onClose,
  onConfirm,
  playlistContext = false,
}) => {
  const { settings } = useMusic();
  const theme = THEMES[settings.theme];

  if (!isOpen || tracks.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: theme.surfaceContainer,
          borderColor: theme.border,
        }}
        className="w-full max-w-sm rounded-3xl p-5 border shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <Trash2 size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {playlistContext ? 'Remove from Playlist' : 'Delete Music'}
            </h3>
            <p className="text-[11px] text-white/60">This action can be undone</p>
          </div>
        </div>

        <p className="text-xs text-white/80 my-3 leading-relaxed">
          {playlistContext ? (
            <>
              Are you sure you want to remove{' '}
              <span className="font-bold text-white">
                {tracks.length === 1 ? tracks[0].title : `${tracks.length} tracks`}
              </span>{' '}
              from this playlist?
            </>
          ) : (
            <>
              Are you sure you want to delete{' '}
              <span className="font-bold text-white">
                {tracks.length === 1 ? tracks[0].title : `${tracks.length} tracks`}
              </span>{' '}
              from your library?
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold cursor-pointer shadow-lg transition-colors"
          >
            {playlistContext ? 'Remove' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
