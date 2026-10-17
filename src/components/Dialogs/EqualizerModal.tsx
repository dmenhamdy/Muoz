import React, { useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { EQUALIZER_PRESETS } from '../../data/sampleTracks';
import { THEMES } from '../../styles/theme';
import { X, Sliders, Volume2, Sparkles } from 'lucide-react';
import { AudioEngine } from '../../audio/AudioEngine';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const { eqBands, isEqEnabled, activePreset, setBandGain, applyPreset, toggleEqualizer, settings, state } = useMusic();
  const theme = THEMES[settings.theme];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio spectrum visualizer loop
  useEffect(() => {
    if (!isOpen) return;
    const engine = AudioEngine.getInstance();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = engine.getVisualizerData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (data && data.length > 0 && state.isPlaying) {
        const barWidth = (canvas.width / (data.length * 0.6)) - 2;
        let x = 4;
        for (let i = 0; i < Math.floor(data.length * 0.6); i++) {
          const barHeight = (data[i] / 255) * canvas.height * 0.85;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
          gradient.addColorStop(0, theme.primary);
          gradient.addColorStop(1, theme.accent);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, Math.max(3, barWidth), barHeight, [4, 4, 0, 0]);
          ctx.fill();

          x += barWidth + 3;
        }
      } else {
        // Flat idle visualizer line
        ctx.fillStyle = `${theme.primary}33`;
        ctx.fillRect(0, canvas.height - 4, canvas.width, 2);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, state.isPlaying, theme.accent, theme.primary]);

  if (!isOpen) return null;

  const formatFreq = (freq: number) => {
    if (freq >= 1000) return `${freq / 1000}k`;
    return `${freq}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: theme.surfaceContainer,
          borderColor: theme.border,
        }}
        className="w-full max-w-lg rounded-3xl p-5 border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div
              style={{ backgroundColor: `${theme.primary}22`, color: theme.primary }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
            >
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Equalizer</h3>
              <p className="text-xs text-white/60">10-band audio processor</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Enable/Disable Toggle */}
            <button
              onClick={() => toggleEqualizer()}
              style={{
                backgroundColor: isEqEnabled ? theme.primary : 'rgba(255,255,255,0.15)',
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 flex items-center space-x-1 cursor-pointer"
            >
              <span>{isEqEnabled ? 'Enabled' : 'Bypassed'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Spectrum Visualizer Canvas */}
        <div className="my-3 py-2 px-3 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
          <canvas ref={canvasRef} width={380} height={50} className="w-full h-12" />
          <div className="absolute top-2 left-3 flex items-center space-x-1.5 text-[10px] text-white/50 font-semibold tracking-wider uppercase">
            <Sparkles size={11} style={{ color: theme.primary }} />
            <span>Real-time Spectrum</span>
          </div>
        </div>

        {/* Presets Chips */}
        <div className="mb-4">
          <label className="text-xs font-bold text-white/70 block mb-2">Presets</label>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {EQUALIZER_PRESETS.map(preset => {
              const isSelected = activePreset === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  style={{
                    backgroundColor: isSelected ? theme.primary : 'rgba(255, 255, 255, 0.08)',
                    borderColor: isSelected ? theme.primary : 'transparent',
                  }}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap border flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isSelected ? 'text-white shadow-md' : 'text-white/80 hover:bg-white/15'
                  }`}
                >
                  <span>{preset.emoji}</span>
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 10-Band Sliders */}
        <div className="flex-1 overflow-y-auto px-1 py-2">
          <div className="grid grid-cols-10 gap-1.5 h-48 items-end justify-items-center bg-black/20 p-3 rounded-2xl border border-white/5">
            {eqBands.map((band, index) => {
              const gain = band.gain;
              const normalizedHeight = ((gain + 12) / 24) * 100;

              return (
                <div key={band.frequency} className="flex flex-col items-center h-full justify-between w-full">
                  <span className="text-[10px] font-bold text-white/70 mb-1">
                    {gain > 0 ? `+${gain.toFixed(0)}` : gain.toFixed(0)}
                  </span>

                  <div className="relative flex-1 w-full flex items-center justify-center">
                    {/* Vertical Range Slider */}
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      disabled={!isEqEnabled}
                      value={gain}
                      onChange={e => setBandGain(index, parseFloat(e.target.value))}
                      className="accent-pink-500 w-28 -rotate-90 origin-center cursor-pointer disabled:opacity-40"
                      style={{
                        accentColor: theme.primary,
                      }}
                    />
                  </div>

                  <span className="text-[9px] font-extrabold text-white/80 mt-2 truncate max-w-full">
                    {formatFreq(band.frequency)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] text-white/50 font-bold px-2 mt-2">
            <span>Bass (31Hz)</span>
            <span>Mids (1kHz)</span>
            <span>Treble (16kHz)</span>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="pt-3 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={() => {
              applyPreset(EQUALIZER_PRESETS[0]); // Flat
            }}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Reset (Flat)
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
