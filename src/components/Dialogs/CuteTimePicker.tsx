import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { Moon, X, Clock, Trash2 } from 'lucide-react';
import { formatTime } from '../../utils/lyricsParser';

interface CuteTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CuteTimePicker: React.FC<CuteTimePickerProps> = ({ isOpen, onClose }) => {
  const { state, setSleepTimer, cancelSleepTimer, settings } = useMusic();
  const theme = THEMES[settings.theme];

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  if (!isOpen) return null;

  const isTimerActive = state.sleepTimerRemainingDuration > 0;

  const handleStartTimer = () => {
    setSleepTimer(hours, minutes);
    onClose();
  };

  const setPreset = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
  };

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
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div
              style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}
              className="w-9 h-9 rounded-2xl flex items-center justify-center"
            >
              <Moon size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Sleep Timer</h3>
              <p className="text-[11px] text-white/60">Turn off playback automatically</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current running timer state */}
        {isTimerActive && (
          <div className="mt-3 p-3 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={16} style={{ color: theme.primary }} className="animate-pulse" />
              <div>
                <span className="text-[10px] text-white/50 block font-semibold">Active Timer</span>
                <span className="text-base font-extrabold text-white">
                  {formatTime(state.sleepTimerRemainingDuration)} remaining
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                cancelSleepTimer();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Trash2 size={13} />
              <span>Cancel</span>
            </button>
          </div>
        )}

        {/* Quick presets */}
        <div className="mt-4">
          <label className="text-[11px] font-bold text-white/60 block mb-2">Quick Presets</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '15 min', h: 0, m: 15 },
              { label: '30 min', h: 0, m: 30 },
              { label: '45 min', h: 0, m: 45 },
              { label: '1 hour', h: 1, m: 0 },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => setPreset(preset.h, preset.m)}
                className={`py-2 rounded-2xl text-xs font-bold border border-white/10 transition-all cursor-pointer ${
                  hours === preset.h && minutes === preset.m
                    ? 'bg-white/20 text-white shadow'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time input pickers */}
        <div className="my-5 flex items-center justify-center space-x-4">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={e => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              className="w-18 h-16 rounded-2xl bg-black/30 border border-white/15 text-center text-3xl font-black text-white focus:outline-none focus:border-pink-500"
            />
            <span className="text-[11px] text-white/60 font-bold mt-1">Hours</span>
          </div>

          <span className="text-3xl font-black text-white/40 pb-5">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={e => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-18 h-16 rounded-2xl bg-black/30 border border-white/15 text-center text-3xl font-black text-white focus:outline-none focus:border-pink-500"
            />
            <span className="text-[11px] text-white/60 font-bold mt-1">Minutes</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-white/10 flex justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleStartTimer}
            disabled={hours === 0 && minutes === 0}
            style={{ backgroundColor: theme.primary }}
            className="px-5 py-2 rounded-2xl text-white text-xs font-bold cursor-pointer shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Start Timer
          </button>
        </div>
      </div>
    </div>
  );
};
