/**
 * Calming felt-piano / music-box synthesizer playing "Happy Birthday"
 * in F major using the browser's native Web Audio API.
 */

interface NoteEvent {
  /** Midi note number */
  midi: number;
  /** Duration in beats */
  beats: number;
  /** Optional warm accompaniment chord (MIDI notes) */
  chord?: number[];
}

const BEAT_SECONDS = 0.88; // ~68 BPM, gentle and unhurried
const LOOP_PAUSE_SECONDS = 2.2;

// "Happy Birthday" in F major (C4 = 60, F4 = 65)
const MELODY: NoteEvent[] = [
  // Phrase 1: Happy birthday to you (Fmaj7)
  { midi: 60, beats: 0.75 },
  { midi: 60, beats: 0.25 },
  { midi: 62, beats: 1.0, chord: [53, 57, 60, 64] },
  { midi: 60, beats: 1.0 },
  { midi: 65, beats: 1.0, chord: [53, 57, 60] },
  { midi: 64, beats: 2.0, chord: [52, 55, 60] },

  // Phrase 2: Happy birthday to you (C7 -> F)
  { midi: 60, beats: 0.75 },
  { midi: 60, beats: 0.25 },
  { midi: 62, beats: 1.0, chord: [48, 55, 58, 64] },
  { midi: 60, beats: 1.0 },
  { midi: 67, beats: 1.0, chord: [48, 55, 58] },
  { midi: 65, beats: 2.0, chord: [53, 57, 60] },

  // Phrase 3: Happy birthday dear Mama (F7 -> Bbmaj7)
  { midi: 60, beats: 0.75 },
  { midi: 60, beats: 0.25 },
  { midi: 72, beats: 1.0, chord: [53, 57, 63] },
  { midi: 69, beats: 1.0 },
  { midi: 65, beats: 1.0, chord: [58, 62, 65] },
  { midi: 64, beats: 1.0, chord: [57, 60, 65] },
  { midi: 62, beats: 2.0, chord: [55, 58, 62] },

  // Phrase 4: Happy birthday to you (C9sus4 -> Fmaj7)
  { midi: 70, beats: 0.75 },
  { midi: 70, beats: 0.25 },
  { midi: 69, beats: 1.0, chord: [53, 57, 60] },
  { midi: 65, beats: 1.0 },
  { midi: 67, beats: 1.0, chord: [48, 55, 58, 62] },
  { midi: 65, beats: 2.6, chord: [53, 57, 60, 64] },
];

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class CalmingBirthdayPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private isPlaying = false;

  private ensureContext(): { ctx: AudioContext; destination: AudioNode } {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      const master = this.ctx.createGain();
      master.gain.value = 0.0001;

      // Warm felt-piano lowpass filter
      const warmthFilter = this.ctx.createBiquadFilter();
      warmthFilter.type = 'lowpass';
      warmthFilter.frequency.value = 1650;
      warmthFilter.Q.value = 0.6;

      // Gentle room echo
      const delay = this.ctx.createDelay(1.0);
      delay.delayTime.value = 0.28;

      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.22;

      const echoFilter = this.ctx.createBiquadFilter();
      echoFilter.type = 'lowpass';
      echoFilter.frequency.value = 850;

      const wetGain = this.ctx.createGain();
      wetGain.gain.value = 0.26;

      master.connect(warmthFilter);
      warmthFilter.connect(this.ctx.destination);

      warmthFilter.connect(delay);
      delay.connect(echoFilter);
      echoFilter.connect(feedback);
      feedback.connect(delay);
      echoFilter.connect(wetGain);
      wetGain.connect(this.ctx.destination);

      this.masterGain = master;
    }

    return { ctx: this.ctx, destination: this.masterGain! };
  }

  private playMelodyNote(ctx: AudioContext, dest: AudioNode, freq: number, startTime: number, duration: number) {
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, startTime);
    overtoneGain.gain.setValueAtTime(0.08, startTime);

    const decay = Math.max(1.3, duration * 1.45);
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.2, startTime + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(dest);

    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + decay + 0.05);
    overtone.stop(startTime + decay + 0.05);
  }

  private playChord(ctx: AudioContext, dest: AudioNode, midis: number[], startTime: number) {
    midis.forEach((midi, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const stagger = idx * 0.035;
      const t = startTime + stagger;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(midiToFreq(midi), t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.038, t + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 2.5);
    });
  }

  private scheduleLoop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    let offset = 0.08;
    const baseTime = this.ctx.currentTime;

    for (const event of MELODY) {
      const noteTime = baseTime + offset;
      const duration = event.beats * BEAT_SECONDS;

      this.playMelodyNote(this.ctx, this.masterGain, midiToFreq(event.midi), noteTime, duration);
      if (event.chord) {
        this.playChord(this.ctx, this.masterGain, event.chord, noteTime);
      }

      offset += duration;
    }

    const totalMs = (offset + LOOP_PAUSE_SECONDS) * 1000;
    this.loopTimer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleLoop();
      }
    }, totalMs);
  }

  async start(): Promise<void> {
    if (this.isPlaying) return;

    const { ctx } = this.ensureContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    this.isPlaying = true;
    if (this.masterGain) {
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      this.masterGain.gain.linearRampToValueAtTime(0.85, now + 0.6);
    }

    this.scheduleLoop();
  }

  stop(): void {
    this.isPlaying = false;
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);

      const currentCtx = this.ctx;
      window.setTimeout(() => {
        if (!this.isPlaying && currentCtx.state === 'running') {
          void currentCtx.suspend();
        }
      }, 400);
    }
  }
}

export const birthdayMusic = new CalmingBirthdayPlayer();
