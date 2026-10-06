// A tiny generative lo-fi beat built on the Web Audio API — no audio files, no licensing.
// Jazzy 7th/9th chords on a soft electric piano with tape wobble, a round bass,
// swung boom-bap drums, a sparse melody and vinyl crackle.

const BPM = 74;
const STEP = 60 / BPM / 4; // one 16th note, in seconds
const STEPS_PER_BAR = 16;
const MASTER_LEVEL = 0.55;

type Chord = { bass: number; notes: number[] };

// MIDI note numbers; each progression is four bars long
const PROGRESSIONS: Chord[][] = [
  [
    { bass: 38, notes: [53, 57, 60, 64] }, // Dm9
    { bass: 43, notes: [53, 59, 64, 69] }, // G13
    { bass: 36, notes: [52, 55, 59, 62] }, // Cmaj9
    { bass: 45, notes: [55, 60, 64, 71] }, // Am9
  ],
  [
    { bass: 41, notes: [52, 57, 60, 64] }, // Fmaj7
    { bass: 40, notes: [50, 56, 59, 62] }, // E7
    { bass: 45, notes: [55, 60, 64, 71] }, // Am9
    { bass: 43, notes: [53, 58, 62, 65] }, // Gm7
  ],
];

const mtof = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const chance = (p: number) => Math.random() < p;
const jitter = (amount: number) => (Math.random() - 0.5) * amount;

export class LofiEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private reverbSend: GainNode | null = null;
  private wobble: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer = 0;
  private step = 0;
  private nextTime = 0;
  private playing = false;
  private wanted = false; // guards against stop() landing while start() is still awaiting resume

  async start() {
    this.wanted = true;
    const ctx = this.ctx ?? this.setup();
    await ctx.resume();
    if (!this.wanted || this.playing) return;
    this.playing = true;

    const now = ctx.currentTime;
    this.fadeTo(MASTER_LEVEL, now, 1.5);
    this.step = 0;
    this.nextTime = now + 0.1;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stop() {
    this.wanted = false;
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    this.playing = false;
    window.clearInterval(this.timer);
    this.fadeTo(0, ctx.currentTime, 0.6);
    window.setTimeout(() => {
      if (!this.playing) void ctx.suspend();
    }, 800);
  }

  dispose() {
    this.wanted = false;
    this.playing = false;
    window.clearInterval(this.timer);
    void this.ctx?.close();
    this.ctx = null;
  }

  // ---------- setup ----------

  private setup() {
    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.ratio.value = 3;
    const warmth = ctx.createBiquadFilter();
    warmth.type = "lowpass";
    warmth.frequency.value = 3400;
    warmth.Q.value = 0.4;

    const bus = ctx.createGain();
    bus.connect(warmth).connect(compressor).connect(master).connect(ctx.destination);

    const reverb = ctx.createConvolver();
    reverb.buffer = this.makeImpulse(ctx, 2.6);
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.3;
    reverbSend.connect(reverb).connect(bus);

    // slow pitch drift, like a slightly tired tape deck
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.33;
    const wobble = ctx.createGain();
    wobble.gain.value = 7; // cents
    lfo.connect(wobble);
    lfo.start();

    this.master = master;
    this.bus = bus;
    this.reverbSend = reverbSend;
    this.wobble = wobble;
    this.noise = this.makeNoise(ctx);
    this.startCrackle(ctx, bus);
    return ctx;
  }

  private fadeTo(level: number, now: number, seconds: number) {
    const gain = this.master!.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(level, now + seconds);
  }

  private makeNoise(ctx: AudioContext) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private makeImpulse(ctx: AudioContext, seconds: number) {
    const length = ctx.sampleRate * seconds;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
    return impulse;
  }

  private startCrackle(ctx: AudioContext, destination: AudioNode) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.012; // hiss
      if (chance(0.00035)) {
        // a dusty pop: a few samples of decaying noise
        const size = 20 + Math.floor(Math.random() * 60);
        const amp = 0.2 + Math.random() * 0.5;
        for (let j = 0; j < size && i + j < data.length; j++) data[i + j] += (Math.random() * 2 - 1) * amp * (1 - j / size);
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 900;
    const level = ctx.createGain();
    level.gain.value = 0.22;
    source.connect(highpass).connect(level).connect(destination);
    source.start();
  }

  // ---------- sequencing ----------

  private schedule() {
    const ctx = this.ctx!;
    // background tabs only tick about once a second, so look further ahead there
    const lookahead = document.hidden ? 1.5 : 0.15;
    if (this.nextTime < ctx.currentTime) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + lookahead) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += STEP;
      this.step++;
    }
  }

  private playStep(step: number, time: number) {
    const bar = Math.floor(step / STEPS_PER_BAR);
    const s = step % STEPS_PER_BAR;
    const progression = PROGRESSIONS[Math.floor(bar / 8) % PROGRESSIONS.length];
    const chord = progression[bar % progression.length];
    const barLength = STEP * STEPS_PER_BAR;

    // lazy swing: push the off-beat 8ths and 16ths back a little
    const swing = s % 4 === 2 ? STEP * 0.32 : s % 2 === 1 ? STEP * 0.18 : 0;
    const t = time + swing + jitter(0.012);

    if (s === 0) {
      chord.notes.forEach((note, i) => this.keys(note, t + i * 0.022 + jitter(0.01), barLength * 0.92, 0.075));
      this.bass(chord.bass, t, STEP * 6);
    }
    if (s === 10) {
      if (chance(0.35)) chord.notes.slice(1).forEach((note, i) => this.keys(note, t + i * 0.018, STEP * 5, 0.045));
      if (chance(0.6)) this.bass(chord.bass + (chance(0.3) ? 7 : 0), t, STEP * 4);
    }

    // melody joins after the intro, a few notes per bar at most
    if (bar >= 4 && s % 2 === 0 && chance(0.18)) {
      const pool = chord.notes.map((note) => note + 12);
      this.lead(pool[Math.floor(Math.random() * pool.length)], t, STEP * (chance(0.5) ? 2 : 4));
    }

    // drums come in after a two-bar intro
    if (bar < 2) return;
    if (s === 0 || s === 10 || (s === 7 && chance(0.35)) || (s === 13 && chance(0.2))) this.kick(t);
    if (s === 4 || s === 12) this.snare(t, 0.85);
    else if (s === 15 && chance(0.15)) this.snare(t, 0.25);
    if (s % 2 === 0) this.hat(t, 0.5 + Math.random() * 0.4);
    else if (chance(0.25)) this.hat(t, 0.25);
  }

  // ---------- instruments ----------

  private keys(midi: number, t: number, duration: number, velocity: number) {
    const ctx = this.ctx!;
    const freq = mtof(midi);
    const body = ctx.createOscillator();
    body.frequency.value = freq;
    const tine = ctx.createOscillator();
    tine.frequency.value = freq * 3;

    const tineLevel = ctx.createGain();
    tineLevel.gain.setValueAtTime(0.25, t);
    tineLevel.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(velocity, t + 0.012);
    env.gain.setTargetAtTime(velocity * 0.45, t + 0.012, 0.7);
    env.gain.setTargetAtTime(0, t + duration, 0.25);

    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 1700;

    body.connect(env);
    tine.connect(tineLevel).connect(env);
    env.connect(tone);
    tone.connect(this.bus!);
    tone.connect(this.reverbSend!);
    this.wobble!.connect(body.detune);
    this.wobble!.connect(tine.detune);

    const end = t + duration + 1.5;
    body.start(t);
    tine.start(t);
    body.stop(end);
    tine.stop(end);
    // the shared wobble LFO would otherwise keep every finished voice alive
    body.onended = () => {
      this.wobble?.disconnect(body.detune);
      this.wobble?.disconnect(tine.detune);
    };
  }

  private bass(midi: number, t: number, duration: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = mtof(midi);
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 320;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.42, t + 0.015);
    env.gain.setTargetAtTime(0.25, t + 0.015, 0.3);
    env.gain.setTargetAtTime(0, t + duration, 0.08);
    osc.connect(tone).connect(env).connect(this.bus!);
    osc.start(t);
    osc.stop(t + duration + 0.6);
  }

  private lead(midi: number, t: number, duration: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.value = mtof(midi);
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5;
    const depth = ctx.createGain();
    depth.gain.value = 9;
    vibrato.connect(depth).connect(osc.detune);
    this.wobble!.connect(osc.detune);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.05, t + 0.04);
    env.gain.setTargetAtTime(0, t + duration, 0.18);
    osc.connect(env);
    env.connect(this.bus!);
    env.connect(this.reverbSend!);

    const end = t + duration + 1;
    osc.start(t);
    vibrato.start(t);
    osc.stop(end);
    vibrato.stop(end);
    osc.onended = () => this.wobble?.disconnect(osc.detune);
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(115, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.85, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    osc.connect(env).connect(this.bus!);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  private snare(t: number, velocity: number) {
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1900;
    band.Q.value = 0.8;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.32 * velocity, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    noise.connect(band).connect(env);
    env.connect(this.bus!);
    env.connect(this.reverbSend!);

    const body = ctx.createOscillator();
    body.frequency.setValueAtTime(190, t);
    body.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    const bodyEnv = ctx.createGain();
    bodyEnv.gain.setValueAtTime(0.18 * velocity, t);
    bodyEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    body.connect(bodyEnv).connect(this.bus!);

    noise.start(t, Math.random());
    noise.stop(t + 0.25);
    body.start(t);
    body.stop(t + 0.12);
  }

  private hat(t: number, velocity: number) {
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noise;
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 7000;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.07 * velocity, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    noise.connect(highpass).connect(env).connect(this.bus!);
    noise.start(t, Math.random());
    noise.stop(t + 0.06);
  }
}
