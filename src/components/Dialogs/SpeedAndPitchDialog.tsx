import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { THEMES } from '../../styles/theme';
import { Gauge, X, RotateCcw } from 'lucide-react';

interface SpeedAndPitchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeedAndPitchDialog: React.FC<SpeedAndPitchDialogProps> = ({ isOpen, onClose }) => {
  const { state, setSpeed, setPitch, settings, updateSettings } = useMusic();
  const theme = THEMES[settings.theme];

  if (!isOpen) return null;

  const handleSpeedChange = (rawVal: number) => {
    let finalVal = rawVal;
    if (settings.snapSpeedAndPitch) {
      // Snap to nearest 0.05
      finalVal = Math.round(rawVal * 20) / 20;
    }
    setSpeed(finalVal);
  };

  const handlePitchChange = (rawVal: number) => {
    let finalVal = rawVal;
    if (settings.snapSpeedAndPitch) {
      finalVal = Math.round(rawVal * 20) / 20;
    }
    setPitch(finalVal);
  };

  const resetAll = () => {
    setSpeed(1.0);
    setPitch(1.0);
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
              <Gauge size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Speed & Pitch</h3>
              <p className="text-[11px] text-white/60">Audio playback rate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="py-4 space-y-5">
          {/* Speed slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-white/80">Playback Speed</span>
              <span
                style={{ color: theme.primary }}
                className="text-xs font-black px-2 py-0.5 rounded-full bg-black/30"
              >
                {state.speed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step={settings.snapSpeedAndPitch ? '0.05' : '0.01'}
              value={state.speed}
              onChange={e => handleSpeedChange(parseFloat(e.target.value))}
              style={{ accentColor: theme.primary }}
              className="w-full cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-white/50 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
          </div>

          {/* Pitch slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-white/80">Audio Pitch</span>
              <span
                style={{ color: theme.accent }}
                className="text-xs font-black px-2 py-0.5 rounded-full bg-black/30"
              >
                {state.pitch.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step={settings.snapSpeedAndPitch ? '0.05' : '0.01'}
              value={state.pitch}
              onChange={e => handlePitchChange(parseFloat(e.target.value))}
              style={{ accentColor: theme.accent }}
              className="w-full cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-white/50 mt-1">
              <span>Lower</span>
              <span>Normal</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Snap toggle checkbox */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <span className="text-xs font-bold text-white/90 block">Snap increments</span>
              <span className="text-[10px] text-white/50">Snap steps by 0.05x</span>
            </div>
            <button
              onClick={() => updateSettings({ snapSpeedAndPitch: !settings.snapSpeedAndPitch })}
              style={{
                backgroundColor: settings.snapSpeedAndPitch ? theme.primary : 'rgba(255,255,255,0.1)',
              }}
              className="w-12 h-6 rounded-full transition-colors relative cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 ${
                  settings.snapSpeedAndPitch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={resetAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset (1.0x)</span>
          </button>
          <button
            onClick={onClose}
            style={{ backgroundColor: theme.primary }}
            className="px-5 py-2 rounded-2xl text-white text-xs font-bold cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
