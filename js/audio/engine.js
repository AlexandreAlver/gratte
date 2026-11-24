// Moteur audio : contexte unique, clics de métronome et guitare synthétique (Karplus-Strong)
import { getState } from '../store.js';

let ctx = null, master = null;

export function audio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = getState().settings.volume ?? 0.85;
    master.connect(comp); comp.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
export function out() { audio(); return master; }
export function setVolume(v) { audio(); master.gain.value = v; }
export const outputLatency = () => (ctx ? (ctx.outputLatency || ctx.baseLatency || 0) : 0);

// ---------- Clic de métronome ----------
export function click(time, kind = 'beat') {
  const c = audio();
  const o = c.createOscillator(), g = c.createGain();
  const f = kind === 'accent' ? 1760 : kind === 'beat' ? 1180 : 820;
  const v = kind === 'accent' ? 0.9 : kind === 'beat' ? 0.6 : 0.22;
  o.type = 'triangle'; o.frequency.setValueAtTime(f, time);
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(v, time + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
  o.connect(g); g.connect(out());
  o.start(time); o.stop(time + 0.06);
}

// ---------- Guitare : corde pincée ----------
export const OPEN = [40, 45, 50, 55, 59, 64]; // Mi grave → Mi aigu (MIDI)
export const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const cache = new Map();

function stringBuffer(midi) {
  const c = audio();
  const key = midi + ':' + c.sampleRate;
  if (cache.has(key)) return cache.get(key);
  const sr = c.sampleRate, freq = midiToFreq(midi);
  const dur = 3.2, len = Math.floor(sr * dur);
  const buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0);
  const N = Math.max(2, Math.round(sr / freq - 0.5));
  const line = new Float32Array(N);
  // excitation : bruit filtré (plus doux pour les cordes graves)
  const bright = midi < 52 ? 0.45 : 0.62;
  let prev = 0, mean = 0;
  for (let i = 0; i < N; i++) { prev += bright * ((Math.random() * 2 - 1) - prev); line[i] = prev; mean += prev; }
  mean /= N;
  for (let i = 0; i < N; i++) line[i] -= mean;
  const T60 = midi < 52 ? 4.5 : 3.2;
  const g = Math.pow(0.001, 1 / (freq * T60));
  let idx = 0;
  for (let n = 0; n < len; n++) {
    const cur = line[idx], nxt = line[(idx + 1) % N];
    d[n] = cur;
    line[idx] = g * 0.5 * (cur + nxt);
    idx = (idx + 1) % N;
  }
  // normalisation
  let peak = 0; for (let n = 0; n < Math.min(len, sr * 0.1); n++) peak = Math.max(peak, Math.abs(d[n]));
  if (peak > 0) for (let n = 0; n < len; n++) d[n] /= peak;
  cache.set(key, buf);
  return buf;
}

export function pluck(midi, time, { gain = 0.35, dur = 2.6, muted = false } = {}) {
  const c = audio();
  const src = c.createBufferSource(); src.buffer = stringBuffer(midi);
  const g = c.createGain();
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = muted ? 900 : 5200;
  g.gain.setValueAtTime(gain, time);
  if (muted) g.gain.setTargetAtTime(0.0001, time + 0.015, 0.035);
  else g.gain.setTargetAtTime(0.0001, time + dur, 0.12);
  src.connect(lp); lp.connect(g); g.connect(out());
  src.start(time); src.stop(time + (muted ? 0.4 : dur + 1));
}

function chuck(time, gain = 0.5) {
  const c = audio();
  const len = Math.floor(c.sampleRate * 0.06);
  const b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const s = c.createBufferSource(); s.buffer = b;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 0.9;
  const g = c.createGain(); g.gain.value = gain;
  s.connect(bp); bp.connect(g); g.connect(out());
  s.start(time);
}

/**
 * Joue un coup de médiator sur un accord.
 * frets : tableau de 6 valeurs (Mi grave → Mi aigu), null = corde non jouée
 * dir : 'd' (bas) | 'u' (haut) ; opts : { accent, mute, palm, strings: [indices], capo }
 */
export function strum(frets, time, dir = 'd', opts = {}) {
  const { accent = false, mute = false, palm = false, strings = null, capo = 0 } = opts;
  if (mute) { chuck(time, accent ? 0.7 : 0.5); }
  let idx = [0, 1, 2, 3, 4, 5].filter((i) => frets[i] != null && (!strings || strings.includes(i)));
  if (dir === 'u') idx = idx.reverse();
  const spread = dir === 'u' ? 0.009 : 0.012;
  const base = accent ? 0.5 : dir === 'u' ? 0.24 : 0.34;
  idx.forEach((i, n) => {
    const m = OPEN[i] + frets[i] + capo;
    const g = base * (dir === 'u' ? 1 - n * 0.06 : 0.85 + n * 0.03);
    pluck(m, time + n * spread, { gain: mute ? g * 0.45 : g, muted: mute || palm });
  });
}

export function note(stringIdx, fret, time, opts = {}) {
  pluck(OPEN[stringIdx] + fret + (opts.capo || 0), time, { gain: opts.gain ?? 0.42, muted: !!opts.palm });
}
