/**
 * Generates playable audio blob URLs with cute synthesized lofi melodies
 * using Web Audio API offline rendering.
 */

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  writeString(view, pos, 'RIFF'); pos += 4;
  view.setUint32(pos, length - 8, true); pos += 4;
  writeString(view, pos, 'WAVE'); pos += 4;
  writeString(view, pos, 'fmt '); pos += 4;
  view.setUint32(pos, 16, true); pos += 4; // SubChunk1Size (16 for PCM)
  view.setUint16(pos, 1, true); pos += 2; // AudioFormat (1 for PCM)
  view.setUint16(pos, numOfChan, true); pos += 2;
  view.setUint32(pos, sampleRate, true); pos += 4;
  view.setUint32(pos, sampleRate * 2 * numOfChan, true); pos += 4; // ByteRate
  view.setUint16(pos, numOfChan * 2, true); pos += 2; // BlockAlign
  view.setUint16(pos, 16, true); pos += 2; // BitsPerSample
  writeString(view, pos, 'data'); pos += 4;
  view.setUint32(pos, length - pos - 4, true); pos += 4;

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}

export async function generateMelodyTrack(type: 'lofi' | 'pastel' | 'strawberry' | 'midnight' | 'starlight'): Promise<string> {
  const sampleRate = 22050; // keep small and fast
  const duration = 75; // 75 seconds loopable rich track
  const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

  // Musical chord progressions
  const progressions: Record<string, { chords: number[][]; bpm: number; tone: OscillatorType }> = {
    lofi: {
      chords: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
      bpm: 72,
      tone: 'sine',
    },
    pastel: {
      chords: [
        [293.66, 369.99, 440.00, 554.37], // Dmaj7
        [246.94, 293.66, 369.99, 440.00], // Bm7
        [196.00, 246.94, 293.66, 369.99], // Gmaj7
        [220.00, 277.18, 329.63, 440.00], // A7
      ],
      bpm: 80,
      tone: 'triangle',
    },
    strawberry: {
      chords: [
        [329.63, 392.00, 493.88, 587.33], // Em7
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [196.00, 246.94, 293.66, 392.00], // G
        [293.66, 369.99, 440.00, 587.33], // D
      ],
      bpm: 92,
      tone: 'sine',
    },
    midnight: {
      chords: [
        [174.61, 207.65, 261.63, 311.13], // Fm7
        [233.08, 293.66, 349.23, 415.30], // Bbm7
        [207.65, 261.63, 311.13, 392.00], // Abmaj7
        [261.63, 311.13, 392.00, 466.16], // Cm7
      ],
      bpm: 68,
      tone: 'triangle',
    },
    starlight: {
      chords: [
        [261.63, 329.63, 392.00, 523.25], // C
        [196.00, 246.94, 293.66, 392.00], // G
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23], // F
      ],
      bpm: 65,
      tone: 'sine',
    },
  };

  const currentProg = progressions[type] || progressions.lofi;
  const beatDuration = 60 / currentProg.bpm;
  const barDuration = beatDuration * 4;

  // Master compressor & filter
  const masterFilter = offlineCtx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.setValueAtTime(2800, 0);

  const masterGain = offlineCtx.createGain();
  masterGain.gain.setValueAtTime(0.45, 0);

  masterFilter.connect(masterGain);
  masterGain.connect(offlineCtx.destination);

  // Generate chords over time
  let t = 0;
  while (t < duration - 2) {
    for (const chord of currentProg.chords) {
      if (t >= duration - 2) break;
      
      // Play chord notes
      chord.forEach((freq, idx) => {
        const osc = offlineCtx.createOscillator();
        const noteGain = offlineCtx.createGain();
        osc.type = currentProg.tone;
        osc.frequency.setValueAtTime(freq * (idx === 0 ? 0.5 : 1), t);

        // Envelope
        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.exponentialRampToValueAtTime(0.12, t + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + barDuration * 0.95);

        osc.connect(noteGain);
        noteGain.connect(masterFilter);

        osc.start(t);
        osc.stop(t + barDuration);
      });

      // Add gentle percussion / vinyl warmth
      for (let beat = 0; beat < 4; beat++) {
        const beatTime = t + beat * beatDuration;
        if (beat === 0 || beat === 2) {
          // Soft kick drum
          const kickOsc = offlineCtx.createOscillator();
          const kickGain = offlineCtx.createGain();
          kickOsc.frequency.setValueAtTime(110, beatTime);
          kickOsc.frequency.exponentialRampToValueAtTime(35, beatTime + 0.15);
          kickGain.gain.setValueAtTime(0.3, beatTime);
          kickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.18);
          kickOsc.connect(kickGain);
          kickGain.connect(masterFilter);
          kickOsc.start(beatTime);
          kickOsc.stop(beatTime + 0.2);
        } else {
          // Soft snare / rim
          const rimOsc = offlineCtx.createOscillator();
          const rimGain = offlineCtx.createGain();
          rimOsc.type = 'triangle';
          rimOsc.frequency.setValueAtTime(220, beatTime);
          rimGain.gain.setValueAtTime(0.15, beatTime);
          rimGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.08);
          rimOsc.connect(rimGain);
          rimGain.connect(masterFilter);
          rimOsc.start(beatTime);
          rimOsc.stop(beatTime + 0.1);
        }

        // Melody bell accent
        const melodyOsc = offlineCtx.createOscillator();
        const melodyGain = offlineCtx.createGain();
        melodyOsc.type = 'sine';
        const chordNote = chord[(beat + 1) % chord.length] * 2;
        melodyOsc.frequency.setValueAtTime(chordNote, beatTime + beatDuration * 0.5);
        melodyGain.gain.setValueAtTime(0.0001, beatTime + beatDuration * 0.5);
        melodyGain.gain.exponentialRampToValueAtTime(0.05, beatTime + beatDuration * 0.5 + 0.04);
        melodyGain.gain.exponentialRampToValueAtTime(0.0001, beatTime + beatDuration * 0.9);
        melodyOsc.connect(melodyGain);
        melodyGain.connect(masterFilter);
        melodyOsc.start(beatTime + beatDuration * 0.5);
        melodyOsc.stop(beatTime + beatDuration);
      }

      t += barDuration;
    }
  }

  const rendered = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(rendered);
  return URL.createObjectURL(wavBlob);
}
