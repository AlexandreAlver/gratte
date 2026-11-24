import { CHORDS } from '../data/chords.js';
import { chordCard } from '../ui/chord.js';
import { tabSVG } from '../ui/tab.js';
import { icon, esc } from '../util.js';

const GROUPS = [
  ['Accords ouverts majeurs', ['C', 'D', 'E', 'G', 'A']],
  ['Accords ouverts mineurs', ['Am', 'Dm', 'Em']],
  ['Accords de 7e', ['A7', 'B7', 'C7', 'D7', 'E7', 'G7', 'Am7', 'Em7', 'Bm7', 'F#m7']],
  ['Couleurs (sus, add, 7M)', ['Cadd9', 'Dsus2', 'Dsus4', 'A7sus4', 'Cmaj7', 'Fmaj7', 'D/F#', 'Gw']],
  ['Fa et barrés', ['Fs', 'F', 'G3', 'A5', 'Bm', 'B', 'Bb', 'Cm', 'F#m']],
];

export function render(el) {
  el.innerHTML = `<a class="back" href="#/outils">${icon('left', 18)} Outils</a>
  <div class="page-head"><div><div class="eyebrow">Dictionnaire</div><h1>Les accords</h1>
  <p class="muted" style="margin-top:8px">Touche un accord pour l'entendre et voir sa tablature. Ronds = doigts (1 index, 2 majeur, 3 annulaire, 4 auriculaire, T pouce). ○ corde à vide, ✕ corde non jouée.</p></div></div>
  <div class="card detail hidden" style="margin-bottom:18px"></div>
  ${GROUPS.map(([t, ids]) => `<div class="section" style="margin-top:20px"><div class="section-title" style="font-size:18px">${esc(t)}</div>
    <div class="chords-row" style="flex-wrap:wrap">${ids.filter((id) => CHORDS[id]).map((id) => chordCard(id, 80)).join('')}</div></div>`).join('')}`;
  el.addEventListener('click', (e) => {
    const c = e.target.closest('[data-chord]'); if (!c || c.closest('.detail')) return;
    const id = c.dataset.chord, d = el.querySelector('.detail');
    d.classList.remove('hidden');
    d.innerHTML = `<div class="row" style="align-items:flex-start;gap:18px;flex-wrap:wrap">${chordCard(id, 110)}
      <div style="flex:1;min-width:220px"><b>Tablature</b><div class="tab-wrap">${tabSVG([id], '654321', { steps: 1, beats: 6, showCount: false, colW: 30 })}</div>
      ${CHORDS[id].tip ? `<p class="small" style="margin-top:8px">${icon('bulb', 16)} ${esc(CHORDS[id].tip)}</p>` : ''}</div></div>`;
    d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
