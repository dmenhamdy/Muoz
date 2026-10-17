import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { Playlist } from '../../types/music';
import { ListMusic, X, Plus, Palette, Smile, Tag as TagIcon } from 'lucide-react';

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistToEdit?: Playlist | null;
  onCreated?: (newPlaylist: Playlist) => void;
}

const EMOJI_OPTIONS = ['🎵', '💖', '⭐', '🌙', '☕', '🍓', '🌸', '🎧', '✨', '🎸', '🎹', '🔥', '☁️', '🐱', '🐾', '🎀'];

const COLOR_OPTIONS = [
  '#ff4d6d', '#ff70a6', '#8338ec', '#3a86ff', '#06d6a0', '#ffd166', '#fb5607', '#48cae4', '#9b5de5', '#f15bb5'
];

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistToEdit,
  onCreated,
}) => {
  const { createPlaylist, updatePlaylist, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const [name, setName] = useState(playlistToEdit ? playlistToEdit.name : '');
  const [emoji, setEmoji] = useState(playlistToEdit ? playlistToEdit.emoji : '🎵');
  const [color, setColor] = useState(playlistToEdit ? playlistToEdit.color : '#ff4d6d');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(playlistToEdit ? playlistToEdit.tags : ['Favorites']);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (playlistToEdit) {
      updatePlaylist(playlistToEdit.id, {
        name: name.trim(),
        emoji,
        color,
        tags,
      });
      onClose();
    } else {
      const created = createPlaylist(name.trim(), emoji, color, tags);
      if (onCreated) {
        onCreated(created);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: theme.surfaceContainer,
          borderColor: theme.border,
        }}
        className="w-full max-w-sm rounded-3xl p-5 border shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div
              style={{ backgroundColor: `${color}33`, color }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow"
            >
              {emoji}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {playlistToEdit ? 'Edit Playlist' : 'New Playlist'}
              </h3>
              <p className="text-[11px] text-white/60">Customize styling & tags</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Playlist name */}
          <div>
            <label className="text-xs font-bold text-white/70 block mb-1">Playlist Name</label>
            <input
              type="text"
              placeholder="e.g. Kawaii Beats..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/30 border border-white/15 text-sm font-semibold text-white placeholder-white/30 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white/70 mb-2">
              <Smile size={14} />
              <span>Choose Emoji</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 p-2 rounded-2xl bg-black/20 border border-white/5">
              {EMOJI_OPTIONS.map(em => (
                <button
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    emoji === em ? 'bg-white/25 scale-110 shadow' : 'hover:bg-white/10'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white/70 mb-2">
              <Palette size={14} />
              <span>Accent Color</span>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full flex-shrink-0 transition-transform cursor-pointer ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1b151a]' : 'opacity-85 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white/70 mb-2">
              <TagIcon size={14} />
              <span>Tags & Categories</span>
            </div>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/30 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white/90 flex items-center space-x-1"
                >
                  <span>#{t}</span>
                  <button
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-400 cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{ backgroundColor: color }}
            className="px-5 py-2 rounded-2xl text-white text-xs font-bold cursor-pointer shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {playlistToEdit ? 'Save Changes' : 'Create Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
};
