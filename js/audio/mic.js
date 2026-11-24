// Micro : détection de hauteur (accordeur) et détection d'attaques (écoute du rythme)
import { audio } from './engine.js';

let shared = null; // { stream, src, users }

export async function openMic() {
  if (shared) { shared.users++; return shared; }
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Micro indisponible dans ce navigateur.');
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const c = audio();
  const src = c.createMediaStreamSource(stream);
  shared = { stream, src, users: 1 };
  return shared;
}
export function closeMic() {
  if (!shared) return;
  shared.users--;
  if (shared.users <= 0) {
    shared.stream.getTracks().forEach((t) => t.stop());
    try { shared.src.disconnect(); } catch { /* déjà déconnecté */ }
    shared = null;
  }
}

// ---------- Hauteur (algorithme YIN) ----------
export function yin(buf, sr, threshold = 0.12) {
  const n = buf.length, half = n >> 1;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.006) return null;
  const d = new Float32Array(half);
  const minTau = Math.floor(sr / 1100), maxTau = Math.min(half - 2, Math.floor(sr / 65));
  for (let tau = 1; tau <= maxTau + 1; tau++) {
    let s = 0;
    for (let i = 0; i < half; i++) { const x = buf[i] - buf[i + tau]; s += x * x; }
    d[tau] = s;
  }
  d[0] = 1;
  let run = 0;
  for (let tau = 1; tau <= maxTau + 1; tau++) { run += d[tau]; d[tau] = run ? (d[tau] * tau) / run : 1; }
  let tau = -1;
  for (let t = minTau; t < maxTau; t++) {
    if (d[t] < threshold) { while (t + 1 < maxTau && d[t + 1] < d[t]) t++; tau = t; break; }
  }
  if (tau < 0) return null;
  const x0 = d[tau - 1], x1 = d[tau], x2 = d[tau + 1];
  const den = x0 + x2 - 2 * x1;
  const t = den ? tau + (x0 - x2) / (2 * den) : tau;
  return { freq: sr / t, clarity: 1 - x1, rms };
}

export class PitchTracker {
  constructor(onPitch) { this.onPitch = onPitch; this.hist = []; }
  async start() {
    const m = await openMic();
    const c = audio();
    this.an = c.createAnalyser(); this.an.fftSize = 2048;
    m.src.connect(this.an);
    this.buf = new Float32Array(this.an.fftSize);
    this.running = true;
    const tick = () => {
      if (!this.running) return;
      this.an.getFloatTimeDomainData(this.buf);
      const r = yin(this.buf, c.sampleRate);
      if (r && r.clarity > 0.85) {
        this.hist.push(r.freq); if (this.hist.length > 5) this.hist.shift();
        const sorted = [...this.hist].sort((a, b) => a - b);
        this.onPitch({ freq: sorted[sorted.length >> 1], rms: r.rms });
      } else {
        this.hist = [];
        this.onPitch(null);
      }
      this.raf = setTimeout(tick, 45);
    };
    tick();
  }
  stop() { this.running = false; clearTimeout(this.raf); try { this.an?.disconnect(); } catch { /* */ } closeMic(); }
}

export const NOTES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FR = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
export function freqToMidi(f) { return 69 + 12 * Math.log2(f / 440); }

// ---------- Attaques (AudioWorklet) ----------
const WORKLET = `
class OnsetProc extends AudioWorkletProcessor {
  constructor() { super(); this.avg = 0.0003; this.prev = 0; this.last = -1; this.k = 5; this.floor = 0.0002;
    this.port.onmessage = (e) => { if (e.data.k) this.k = e.data.k; if (e.data.floor) this.floor = e.data.floor; }; this.n = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    let e = 0; for (let i = 0; i < ch.length; i++) e += ch[i] * ch[i]; e /= ch.length;
    const t = currentTime;
    if (e > this.avg * this.k && e > this.floor && e > this.prev * 1.8 && t - this.last > 0.085) {
      this.last = t; this.port.postMessage({ t, e });
    }
    this.avg = this.avg * 0.993 + e * 0.007; this.prev = e;
    if (++this.n % 12 === 0) this.port.postMessage({ level: e });
    return true;
  }
}
registerProcessor('onset-proc', OnsetProc);`;
let workletReady = null;

export class OnsetDetector {
  constructor(onOnset, onLevel) { this.onOnset = onOnset; this.onLevel = onLevel; }
  async start({ k = 5, floor = 0.0002 } = {}) {
    const c = audio();
    if (!c.audioWorklet) throw new Error("Ce navigateur ne permet pas l'écoute précise du rythme.");
    if (!workletReady) {
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
      workletReady = c.audioWorklet.addModule(url);
    }
    await workletReady;
    const m = await openMic();
    this.node = new AudioWorkletNode(c, 'onset-proc');
    this.node.port.postMessage({ k, floor });
    this.node.port.onmessage = (e) => {
      if (e.data.level != null) this.onLevel && this.onLevel(e.data.level);
      else this.onOnset(e.data.t, e.data.e);
    };
    m.src.connect(this.node);
    // le nœud doit être relié à la sortie pour être exécuté (gain nul)
    this.sink = c.createGain(); this.sink.gain.value = 0;
    this.node.connect(this.sink); this.sink.connect(c.destination);
  }
  set(o) { this.node?.port.postMessage(o); }
  stop() {
    try { this.node?.disconnect(); this.sink?.disconnect(); } catch { /* */ }
    this.node = null; closeMic();
  }
}
