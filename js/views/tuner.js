import { PitchTracker, freqToMidi, NOTES_EN, NOTES_FR } from '../audio/mic.js';
import { OPEN, midiToFreq, pluck, audio } from '../audio/engine.js';
import { icon } from '../util.js';

const STR = [
  { n: 6, en: 'E', fr: 'Mi grave' }, { n: 5, en: 'A', fr: 'La' }, { n: 4, en: 'D', fr: 'Ré' },
  { n: 3, en: 'G', fr: 'Sol' }, { n: 2, en: 'B', fr: 'Si' }, { n: 1, en: 'e', fr: 'Mi aigu' },
];

export function render(el) {
  el.innerHTML = `<a class="back" href="#/outils">${icon('left', 18)} Outils</a>
  <div class="page-head"><div><div class="eyebrow">Accordeur</div><h1>Accorde ta guitare folk</h1>
  <p class="muted" style="margin-top:8px">Accordage standard : Mi La Ré Sol Si Mi (E A D G B E), de la corde la plus grave à la plus aiguë.</p></div></div>
  <div class="card host"></div>
  <div class="card tint" style="margin-top:16px"><b>${icon('bulb', 18)} Conseils</b><ul class="prose small" style="margin:8px 0 0">
    <li>Accorde toujours <b>en montant</b> vers la note : si tu es trop haut, descends un peu en dessous puis remonte.</li>
    <li>Pince la corde franchement, puis laisse-la sonner sans la toucher pendant la lecture.</li>
    <li>Place le téléphone près de la rosace, dans une pièce calme.</li>
    <li>Avec un capodastre, accorde <b>avant</b> de le poser, puis vérifie.</li></ul></div>`;
  return mountTuner(el.querySelector('.host'));
}

export function mountTuner(el, { compact = false } = {}) {
  let tracker = null, sel = null, okSince = 0;
  const tuned = new Set();
  el.innerHTML = `<div class="tuner">
    <div class="note">—</div><div class="note-fr">Joue une corde à vide</div>
    <svg class="gauge" viewBox="0 0 300 175" aria-hidden="true">
      <path class="zone" d="${arcPath(-6, 6, 128, 98)}"/>
      ${Array.from({ length: 21 }, (_, i) => { const c = -50 + i * 5; const a = (c * 1.2 - 90) * Math.PI / 180; const r1 = c % 25 === 0 ? 108 : 116;
        return `<line class="tick ${c === 0 ? 'mid' : ''}" x1="${150 + Math.cos(a) * r1}" y1="${160 + Math.sin(a) * r1}" x2="${150 + Math.cos(a) * 128}" y2="${160 + Math.sin(a) * 128}"/>`; }).join('')}
      <text class="lab" x="${150 + Math.cos((-60 - 90) * Math.PI / 180) * 142}" y="${160 + Math.sin((-150) * Math.PI / 180) * 142}" text-anchor="middle">grave</text>
      <text class="lab" x="${150 + Math.cos(-30 * Math.PI / 180) * 142}" y="${160 + Math.sin(-30 * Math.PI / 180) * 142}" text-anchor="middle">aigu</text>
      <line class="needle" x1="150" y1="160" x2="150" y2="44"/>
      <circle class="hub" cx="150" cy="160" r="7"/>
    </svg>
    <div class="hz">&nbsp;</div>
    <div class="hint">&nbsp;</div>
    <div class="strings">${STR.map((s, i) => `<button data-i="${i}" title="Corde ${s.n} : ${s.fr}">${s.en}<small>${s.n}</small></button>`).join('')}</div>
    <div class="row" style="justify-content:center;margin-top:12px;gap:8px;flex-wrap:wrap">
      <button class="btn sm ghost auto" aria-pressed="true">Auto</button>
      <button class="btn sm ghost ref">${icon('volume', 16)} Note de référence</button>
    </div>
    <div class="start-wrap" style="margin-top:18px"><button class="btn primary big start">${icon('mic', 20)} Activer le micro</button>
    <p class="tiny muted" style="margin-top:8px">Le son reste sur ton téléphone : rien n'est enregistré ni envoyé.</p></div>
  </div>`;
  const q = (s) => el.querySelector(s);
  const needle = q('.needle');

  function setSel(i) {
    sel = i;
    el.querySelectorAll('.strings button').forEach((b) => b.classList.toggle('sel', Number(b.dataset.i) === i));
    q('.auto').style.opacity = i == null ? 1 : 0.5;
  }
  el.querySelectorAll('.strings button').forEach((b) => b.onclick = () => {
    const i = Number(b.dataset.i);
    setSel(sel === i ? null : i);
    if (!tracker) playRef(i);
  });
  q('.auto').onclick = () => setSel(null);
  q('.ref').onclick = () => playRef(sel ?? 0);
  function playRef(i) { const c = audio(); pluck(OPEN[i], c.currentTime + 0.02, { gain: 0.5, dur: 2.5 }); }

  q('.start').onclick = async () => {
    tracker = new PitchTracker(onPitch);
    try { await tracker.start(); q('.start-wrap').classList.add('hidden'); }
    catch (e) {
      tracker = null;
      q('.hint').textContent = e.name === 'NotAllowedError' ? 'Accès au micro refusé : autorise-le dans les réglages du navigateur.' : e.message;
    }
  };

  function onPitch(p) {
    if (!p) { needle.classList.remove('ok'); return; }
    const m = freqToMidi(p.freq);
    let i = sel;
    if (i == null) { let bd = 1e9; OPEN.forEach((o, k) => { const d = Math.abs(m - o); if (d < bd) { bd = d; i = k; } }); }
    const target = OPEN[i];
    const cents = 1200 * Math.log2(p.freq / midiToFreq(target));
    const near = Math.round(m);
    const shown = Math.abs(cents) > 100 ? near : target;
    const ok = Math.abs(cents) <= 5;
    q('.note').textContent = NOTES_EN[((shown % 12) + 12) % 12];
    q('.note').classList.toggle('ok', ok);
    q('.note-fr').textContent = `${NOTES_FR[((shown % 12) + 12) % 12]} · corde ${STR[i].n} (${STR[i].fr})`;
    q('.hz').textContent = `${p.freq.toFixed(1)} Hz · ${cents > 0 ? '+' : ''}${Math.round(cents)} cents`;
    const ang = Math.max(-60, Math.min(60, cents * 1.2));
    needle.style.transform = `rotate(${ang}deg)`;
    needle.classList.toggle('ok', ok);
    q('.hint').textContent = ok ? 'Parfait ✓' : cents < 0 ? (cents < -100 ? '⬆ Beaucoup trop grave : tends la corde' : '⬆ Un peu grave : tends légèrement') : (cents > 100 ? '⬇ Beaucoup trop aigu : détends la corde' : '⬇ Un peu aigu : détends légèrement');
    q('.hint').style.color = ok ? 'var(--good)' : 'var(--ink)';
    el.querySelectorAll('.strings button').forEach((b) => b.classList.toggle('sel', Number(b.dataset.i) === i && (sel != null || !ok)));
    if (ok) {
      if (!okSince) okSince = Date.now();
      if (Date.now() - okSince > 600 && !tuned.has(i)) {
        tuned.add(i); el.querySelector(`.strings button[data-i="${i}"]`).classList.add('tuned');
        if (tuned.size === 6) q('.hint').textContent = '🎉 Les 6 cordes sont accordées !';
      }
    } else okSince = 0;
  }
  return () => tracker?.stop();
}

function arcPath(c1, c2, r1, r2) {
  const a = (c) => ((c * 1.2 - 90) * Math.PI) / 180;
  const p = (c, r) => `${150 + Math.cos(a(c)) * r} ${160 + Math.sin(a(c)) * r}`;
  return `M${p(c1, r1)} A${r1} ${r1} 0 0 1 ${p(c2, r1)} L${p(c2, r2)} A${r2} ${r2} 0 0 0 ${p(c1, r2)} Z`;
}
