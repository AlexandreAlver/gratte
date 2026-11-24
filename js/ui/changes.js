// Exercice « une minute de changements » (one-minute changes)
import { chordCard } from './chord.js';
import { getState, logChanges } from '../store.js';
import { click, audio } from '../audio/engine.js';
import { icon, esc, toast, confetti } from '../util.js';
import { chordName } from '../data/chords.js';

export function mountChanges(el, pairs) {
  let sel = 0, timer = null, left = 60, count = 0, phase = 'ready';
  const key = (p) => `${p[0]}>${p[1]}`;
  const hist = (p) => getState().changes[key(p)] || [];
  const best = (p) => Math.max(0, ...hist(p).map((h) => h.n));

  function render() {
    const p = pairs[sel];
    const h = hist(p);
    el.innerHTML = `<div class="practice">
      <div class="seg" style="margin-bottom:14px">${pairs.map((q, i) => `<button data-i="${i}" aria-pressed="${i === sel}">${esc(chordName(q[0]))} ↔ ${esc(chordName(q[1]))}${best(q) ? ` · ${best(q)}` : ''}</button>`).join('')}</div>
      <div class="row" style="justify-content:center;gap:16px">${chordCard(p[0], 92)}<div style="font-size:26px;color:var(--muted)">⇄</div>${chordCard(p[1], 92)}</div>
      <div class="changes-timer">${phase === 'run' ? left : phase === 'count' ? '0' : '1:00'}</div>
      ${phase === 'count' ? `
        <p class="center"><b>Combien de changements propres ?</b><br><span class="small muted">Un aller-retour ${esc(chordName(p[0]))} → ${esc(chordName(p[1]))} = 2 changements</span></p>
        <div class="counter"><button class="icon-btn lg dec">${icon('minus')}</button><b>${count}</b><button class="icon-btn lg inc">${icon('plus')}</button></div>
        <div class="row" style="justify-content:center;margin-top:16px"><button class="btn primary save">${icon('check', 18)} Enregistrer</button><button class="btn ghost again">Recommencer</button></div>`
      : `<div class="row" style="justify-content:center"><button class="btn primary big go">${phase === 'run' ? `${icon('stop', 20)} Arrêter` : `${icon('play', 20)} Lancer 1 minute`}</button></div>
         <p class="center small muted" style="margin-top:12px">Un coup de médiator par accord, aucun rythme imposé. Compte dans ta tête.</p>`}
      <div class="row between small" style="margin-top:14px;border-top:1px solid var(--line);padding-top:12px">
        <span class="muted">Meilleur score : <b style="color:var(--ink)">${best(p) || '—'}</b></span>
        <span class="muted">Dernier : <b style="color:var(--ink)">${h.length ? h[h.length - 1].n : '—'}</b></span>
        <span class="muted">Essais : <b style="color:var(--ink)">${h.length}</b></span>
      </div></div>`;
    el.querySelectorAll('.seg button').forEach((b) => b.onclick = () => { if (phase === 'run') return; sel = +b.dataset.i; phase = 'ready'; render(); });
    el.querySelector('.go')?.addEventListener('click', () => (phase === 'run' ? finish() : run()));
    el.querySelector('.dec')?.addEventListener('click', () => { count = Math.max(0, count - 1); el.querySelector('.counter b').textContent = count; });
    el.querySelector('.inc')?.addEventListener('click', () => { count++; el.querySelector('.counter b').textContent = count; });
    el.querySelector('.again')?.addEventListener('click', () => { phase = 'ready'; render(); });
    el.querySelector('.save')?.addEventListener('click', () => {
      const prev = best(p);
      logChanges(key(p), count);
      if (count > prev && prev > 0) { confetti(); toast(`🎉 Nouveau record : ${count} changements !`); } else toast('Score enregistré');
      phase = 'ready'; render();
    });
  }
  function run() {
    audio(); phase = 'run'; left = 60; render();
    const c = audio(); click(c.currentTime + 0.05, 'accent');
    timer = setInterval(() => {
      left--; const t = el.querySelector('.changes-timer'); if (t) t.textContent = left;
      if (left <= 3 && left > 0) click(audio().currentTime + 0.01, 'beat');
      if (left <= 0) finish();
    }, 1000);
  }
  function finish() {
    clearInterval(timer); timer = null;
    const c = audio(); click(c.currentTime + 0.01, 'accent'); click(c.currentTime + 0.18, 'accent');
    count = best(pairs[sel]) ? Math.max(0, best(pairs[sel]) - 2) : 20;
    phase = 'count'; render();
  }
  render();
  return { destroy() { clearInterval(timer); } };
}
