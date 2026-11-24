// Lecteur YouTube intégré (sans cookies) + liens de secours
import { VIDEOS } from '../data/videos.js';
import { icon, esc } from '../util.js';

export function videoBlock(key, searchHint = '') {
  const list = VIDEOS[key] || [];
  const v = list[0];
  const q = encodeURIComponent(`${searchHint || ''} tuto guitare`.trim());
  if (!v) return `<div class="video-ph"><div>${icon('video', 32)}<p style="margin-top:8px">Pas de vidéo pour ce thème.</p>
    <a class="btn sm" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${q}">Chercher sur YouTube</a></div></div>`;
  const alts = list.slice(1);
  return `<div class="video-box" data-vids='${esc(JSON.stringify(list.map((x) => x.id)))}'>
    ${online() ? `<div class="video"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?rel=0&modestbranding=1" title="${esc(v.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
      : `<div class="video-ph"><div>${icon('cloud', 32)}<p>Vidéo disponible avec une connexion internet.</p></div></div>`}
    <div class="row between small" style="margin-top:8px;gap:8px;flex-wrap:wrap">
      <span class="muted vt">${esc(v.title)} · <b>${esc(v.author)}</b></span>
      <span class="row" style="gap:6px">
        ${alts.length ? `<button class="btn sm ghost alt-video" data-i="0">Autre vidéo</button>` : ''}
        <a class="btn sm ghost" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}">${icon('external', 15)} YouTube</a>
      </span>
    </div></div>`;
}
function online() { return navigator.onLine !== false; }

// Bascule entre la vidéo principale et les alternatives
document.addEventListener('click', (e) => {
  const b = e.target.closest('.alt-video'); if (!b) return;
  const box = b.closest('.video-box');
  const key = Object.keys(VIDEOS).find((k) => JSON.stringify(VIDEOS[k].map((x) => x.id)) === box.dataset.vids);
  const list = VIDEOS[key]; if (!list) return;
  const i = (Number(b.dataset.i) + 1) % list.length; b.dataset.i = i;
  const v = list[i];
  const f = box.querySelector('iframe'); if (f) f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?rel=0&modestbranding=1`;
  box.querySelector('.vt').innerHTML = `${esc(v.title)} · <b>${esc(v.author)}</b>`;
  box.querySelector('a[href*="watch"]').href = `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}`;
});
