import { Clock, tempoName } from '../audio/clock.js';
import { audio } from '../audio/engine.js';
import { icon, clamp } from '../util.js';

let saved = { bpm: 80, beats: 4, sub: false };

export function render(el) {
  let clock = null, taps = [];
  el.innerHTML = `<a class="back" href="#/outils">${icon('left', 18)} Outils</a>
  <div class="page-head"><div><div class="eyebrow">Métronome</div><h1>Garde le tempo</h1></div></div>
  <div class="card metro">
    <div class="tempo"><b class="v">${saved.bpm}</b><span>BPM</span></div>
    <div class="tempo-name">${tempoName(saved.bpm)}</div>
    <div class="beats"></div>
    <input type="range" min="30" max="220" value="${saved.bpm}" aria-label="Tempo">
    <div class="row" style="justify-content:center;gap:14px;margin-top:10px">
      <button class="icon-btn m5" aria-label="Moins 5">−5</button>
      <button class="icon-btn m1" aria-label="Moins 1">${icon('minus')}</button>
      <button class="icon-btn lg primary play" aria-label="Démarrer">${icon('play', 28)}</button>
      <button class="icon-btn p1" aria-label="Plus 1">${icon('plus')}</button>
      <button class="icon-btn p5" aria-label="Plus 5">+5</button>
    </div>
    <hr class="sep">
    <div class="row wrap" style="justify-content:center">
      <div class="seg meas">${[2, 3, 4, 6].map((b) => `<button data-b="${b}" aria-pressed="${b === saved.beats}">${b} temps</button>`).join('')}</div>
      <button class="toggle sub" aria-pressed="${saved.sub}">${icon('ear', 18)} Croches</button>
      <button class="btn ghost tap">Taper le tempo</button>
    </div>
  </div>
  <div class="card tint" style="margin-top:16px"><b>${icon('bulb', 18)} La méthode du tempo progressif</b>
  <p class="small" style="margin-top:6px">Trouve le tempo où tu joues <b>parfaitement</b> (sans faute, sans tension). Joue 4 fois de suite proprement, puis monte de 5 BPM. Si tu fais une faute, redescends de 10. C'est la manière la plus sûre de gagner en vitesse sans perdre la précision.</p></div>`;
  const q = (s) => el.querySelector(s);
  const drawBeats = () => { q('.beats').innerHTML = Array.from({ length: saved.beats }, (_, i) => `<i class="${i === 0 ? 'first' : ''}"></i>`).join(''); };
  drawBeats();
  const set = (v) => {
    saved.bpm = clamp(Math.round(v), 30, 220);
    q('.v').textContent = saved.bpm; q('.tempo-name').textContent = tempoName(saved.bpm); q('input').value = saved.bpm;
    if (clock) clock.setBpm(saved.bpm);
  };
  const start = () => {
    audio();
    clock = new Clock({ bpm: saved.bpm, beats: saved.beats, steps: 2, subClick: saved.sub, countIn: false,
      onStep: (ev) => { if (!ev.isBeat) return; el.querySelectorAll('.beats i').forEach((d, i) => d.classList.toggle('on', i === ev.beat)); } });
    clock.start(); q('.play').innerHTML = icon('stop', 26);
  };
  const stop = () => { clock?.stop(); clock = null; q('.play').innerHTML = icon('play', 28); el.querySelectorAll('.beats i').forEach((d) => d.classList.remove('on')); };
  q('.play').onclick = () => (clock ? stop() : start());
  q('input').oninput = (e) => set(e.target.value);
  q('.m5').onclick = () => set(saved.bpm - 5); q('.m1').onclick = () => set(saved.bpm - 1);
  q('.p1').onclick = () => set(saved.bpm + 1); q('.p5').onclick = () => set(saved.bpm + 5);
  el.querySelectorAll('.meas button').forEach((b) => b.onclick = () => {
    saved.beats = Number(b.dataset.b); el.querySelectorAll('.meas button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    drawBeats(); if (clock) { stop(); start(); }
  });
  q('.sub').onclick = (e) => { saved.sub = !saved.sub; e.currentTarget.setAttribute('aria-pressed', saved.sub); if (clock) clock.subClick = saved.sub; };
  q('.tap').onclick = () => {
    const now = performance.now(); taps = taps.filter((t) => now - t < 3000); taps.push(now);
    if (taps.length >= 3) { const d = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); set(60000 / d); }
  };
  return stop;
}
