import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { X, CheckSquare, Square, Play, Plus, ListPlus, Trash2 } from 'lucide-react';
import { PlaylistPickerModal } from '../Dialogs/PlaylistPickerModal';
import { DeletionDialog } from '../Dialogs/DeletionDialog';

interface SelectedBarProps {
  allTrackIds: string[];
}

export const SelectedBar: React.FC<SelectedBarProps> = ({ allTrackIds }) => {
  const {
    selectedTrackIds,
    clearSelection,
    selectAllTracks,
    library,
    playTrack,
    playNext,
    addToQueue,
    deleteTrack,
    settings,
  } = useMusic();

  const theme = THEMES[settings.theme];
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const count = selectedTrackIds.size;
  if (count === 0) return null;

  const isAllSelected = count === allTrackIds.length;
  const selectedTracks = library.filter(t => selectedTrackIds.has(t.mediaId));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllTracks(allTrackIds);
    }
  };

  const handlePlaySelected = () => {
    if (selectedTracks.length > 0) {
      playTrack(selectedTracks[0], selectedTracks);
      clearSelection();
    }
  };

  const handlePlayNext = () => {
    selectedTracks.forEach(t => playNext(t));
    clearSelection();
  };

  const handleAddToQueue = () => {
    addToQueue(selectedTracks);
    clearSelection();
  };

  const handleDeleteConfirmed = () => {
    selectedTracks.forEach(t => deleteTrack(t.mediaId));
    clearSelection();
  };

  return (
    <>
      <div
        style={{ backgroundColor: theme.surfaceContainer, borderColor: theme.border }}
        className="fixed bottom-[74px] left-3 right-3 md:left-6 md:right-6 max-w-xl mx-auto rounded-3xl p-3 border shadow-2xl z-30 flex items-center justify-between backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-200"
      >
        <div className="flex items-center space-x-2.5">
          <button
            onClick={clearSelection}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
          <div>
            <span className="text-xs font-black text-white block">
              {count} selected
            </span>
            <button
              onClick={handleSelectAllToggle}
              className="text-[10px] font-bold text-white/60 hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              {isAllSelected ? <CheckSquare size={11} /> : <Square size={11} />}
              <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
            </button>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePlaySelected}
            style={{ backgroundColor: theme.primary }}
            className="px-3 py-1.5 rounded-2xl text-xs font-bold text-white flex items-center space-x-1 shadow cursor-pointer active:scale-95"
            title="Play Selection"
          >
            <Play size={13} fill="currentColor" />
            <span>Play</span>
          </button>

          <button
            onClick={handleAddToQueue}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            title="Add to Queue"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={() => setShowPlaylistPicker(true)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            title="Add to Playlist"
          >
            <ListPlus size={16} />
          </button>

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 flex items-center justify-center cursor-pointer"
            title="Delete Selected"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <PlaylistPickerModal
        trackIds={Array.from(selectedTrackIds)}
        isOpen={showPlaylistPicker}
        onClose={() => {
          setShowPlaylistPicker(false);
          clearSelection();
        }}
      />

      <DeletionDialog
        tracks={selectedTracks}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
};
