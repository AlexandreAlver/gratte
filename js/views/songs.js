import { SONGS } from '../data/songs.js';
import { getState } from '../store.js';
import { songRow } from './home.js';

const FILTERS = ['Tous', 'Mon répertoire', 'Comptines', 'Folk', 'Pop / rock', 'Chanson récente', 'Variété française'];
let filter = 'Tous';

export function render(el, param) {
  if (param === 'comptines') filter = 'Comptines';
  const draw = () => {
    const s = getState();
    const list = SONGS.map((x) => ({ ...x, st: s.songs[x.id] }))
      .filter((x) => filter === 'Tous' || (filter === 'Mon répertoire' ? !!x.st : x.style === filter))
      .sort((a, b) => (!!(b.st || b.free) - !!(a.st || a.free)) || (!!a.free - !!b.free) || a.lesson - b.lesson);
    const mastered = SONGS.filter((x) => s.songs[x.id]?.status === 'mastered').length;
    const unlocked = SONGS.filter((x) => s.songs[x.id]).length;
    el.innerHTML = `
    <div class="page-head"><div><div class="eyebrow">Répertoire</div><h1>Morceaux</h1>
      <p class="muted" style="margin-top:8px">${unlocked} débloqué${unlocked > 1 ? 's' : ''} · ${mastered} maîtrisé${mastered > 1 ? 's' : ''} sur ${SONGS.length}</p></div></div>
    <div class="seg" style="margin-bottom:16px">${FILTERS.map((f) => `<button data-f="${f}" aria-pressed="${f === filter}">${f}</button>`).join('')}</div>
    <div class="song-list">${list.map(songRow).join('') || '<div class="empty">Aucun morceau ici pour l\'instant.</div>'}</div>`;
    el.querySelectorAll('[data-f]').forEach((b) => b.onclick = () => { filter = b.dataset.f; draw(); });
  };
  draw();
}
