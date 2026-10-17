import { EQUALIZER_FREQUENCIES } from '../data/sampleTracks';

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  public audio: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private gainNode: GainNode | null = null;
  private analyzerNode: AnalyserNode | null = null;
  private isEqEnabled: boolean = true;
  private isInitialized: boolean = false;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Initializes the Web Audio pipeline on first user interaction
   */
  public initWebAudio() {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      // Create 10 EQ filters
      this.eqFilters = EQUALIZER_FREQUENCIES.map((freq, index) => {
        const filter = this.audioCtx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQUALIZER_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Analyzer for visualizers
      this.analyzerNode = this.audioCtx.createAnalyser();
      this.analyzerNode.fftSize = 64;

      // Master volume gain
      this.gainNode = this.audioCtx.createGain();

      // Connect source -> filter 0 -> filter 1 ... -> filter 9 -> analyzer -> gain -> destination
      let lastNode: AudioNode = this.sourceNode;
      for (const filter of this.eqFilters) {
        lastNode.connect(filter);
        lastNode = filter;
      }
      lastNode.connect(this.analyzerNode);
      this.analyzerNode.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio initialization error (will use HTML5 audio fallback):', e);
    }
  }

  public async resumeContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  public async loadAndPlay(src: string, autoPlay = true): Promise<void> {
    this.initWebAudio();
    await this.resumeContext();

    if (this.audio.src !== src) {
      this.audio.src = src;
      this.audio.load();
    }

    if (autoPlay) {
      try {
        await this.audio.play();
      } catch (err) {
        console.warn('Playback error / Autoplay blocked:', err);
      }
    }
  }

  public async play(): Promise<void> {
    this.initWebAudio();
    await this.resumeContext();
    return this.audio.play();
  }

  public pause(): void {
    this.audio.pause();
  }

  public seek(positionSeconds: number): void {
    if (isFinite(positionSeconds)) {
      this.audio.currentTime = Math.max(0, positionSeconds);
    }
  }

  public setPlaybackRate(rate: number): void {
    this.audio.playbackRate = Math.max(0.25, Math.min(rate, 4.0));
  }

  public setVolume(val: number): void {
    const clamped = Math.max(0, Math.min(val, 1));
    this.audio.volume = clamped;
  }

  public setBandGain(bandIndex: number, gainDb: number): void {
    if (this.eqFilters[bandIndex]) {
      this.eqFilters[bandIndex].gain.value = gainDb;
    }
  }

  public setAllBandGains(gains: number[]): void {
    gains.forEach((gain, index) => {
      this.setBandGain(index, gain);
    });
  }

  public setEqualizerEnabled(enabled: boolean): void {
    this.isEqEnabled = enabled;
    if (!this.isInitialized) return;

    this.eqFilters.forEach(filter => {
      // If disabled, bypass gain to 0 without clearing values
      filter.gain.value = enabled ? filter.gain.value : 0;
    });
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyzerNode) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyzerNode.frequencyBinCount);
    this.analyzerNode.getByteFrequencyData(dataArray);
    return dataArray;
  }
}
