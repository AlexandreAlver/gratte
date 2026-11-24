// Point d'entrée : navigation, suivi du temps de pratique, service worker
import { icon, $ } from './util.js';
import { getState, addPractice } from './store.js';
import { strum, audio } from './audio/engine.js';
import { fretsOf } from './data/chords.js';
import { stopAllPractice } from './ui/practice.js';
import * as home from './views/home.js';
import * as path from './views/path.js';
import * as lesson from './views/lesson.js';
import * as songs from './views/songs.js';
import * as song from './views/song.js';
import * as tools from './views/tools.js';
import * as tuner from './views/tuner.js';
import * as metronome from './views/metronome.js';
import * as chords from './views/chords.js';
import * as calibrate from './views/calibrate.js';
import * as progress from './views/progress.js';
import * as settings from './views/settings.js';

const ROUTES = [
  [/^$/, home, 'home'],
  [/^parcours$/, path, 'path'],
  [/^lecon\/(\d+)(?:\/(\d+))?$/, lesson, 'path'],
  [/^morceaux(?:\/(\w+))?$/, songs, 'songs'],
  [/^morceau\/([\w-]+)$/, song, 'songs'],
  [/^outils$/, tools, 'tools'],
  [/^accordeur$/, tuner, 'tools'],
  [/^metronome$/, metronome, 'tools'],
  [/^accords$/, chords, 'tools'],
  [/^calibrer$/, calibrate, 'tools'],
  [/^reglages$/, settings, 'tools'],
  [/^progres$/, progress, 'progress'],
];
const PRACTICE_ROUTES = /^(lecon|morceau|accordeur|metronome|accords|calibrer)/;

const NAV = [
  ['home', '#/', 'home', 'Accueil'],
  ['path', '#/parcours', 'path', 'Parcours'],
  ['songs', '#/morceaux', 'music', 'Morceaux'],
  ['tools', '#/outils', 'tools', 'Outils'],
  ['progress', '#/progres', 'chart', 'Progrès'],
];

function renderNav(active) {
  $('#nav').innerHTML = `<a class="brand" href="#/">${logo()} Gratte</a>` + NAV.map(([k, href, ic, label]) =>
    `<a href="${href}" class="${k === active ? 'active' : ''}" ${k === active ? 'aria-current="page"' : ''}><span class="pill">${icon(ic, 22)}</span>${label}</a>`).join('');
}
export function logo(size = 30) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="var(--accent)"/><path d="M32 13c9 0 15 3.5 15 10.5 0 9.5-8.5 22-15 27.5-6.5-5.5-15-18-15-27.5C17 16.5 23 13 32 13z" fill="#fff"/><path d="M26 25h12M27 31h10M29 37h6" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round"/></svg>`;
}

let cleanup = null;
let currentRoute = '';
function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  currentRoute = hash;
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  stopAllPractice();
  const view = $('#view');
  for (const [re, mod, nav] of ROUTES) {
    const m = hash.match(re);
    if (m) {
      renderNav(nav);
      view.innerHTML = '';
      view.classList.remove('fade-in'); void view.offsetWidth; view.classList.add('fade-in');
      const r = mod.render(view, ...m.slice(1));
      cleanup = typeof r === 'function' ? r : null;
      if (!hash.match(/^lecon\/\d+\/\d+/) || !history.state?.keepScroll) window.scrollTo(0, 0);
      return;
    }
  }
  location.hash = '#/';
}

// ---------- Temps de pratique ----------
let lastInteraction = Date.now(), pending = 0;
['pointerdown', 'keydown', 'touchstart'].forEach((e) => addEventListener(e, () => { lastInteraction = Date.now(); }, { passive: true }));
setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  if (!PRACTICE_ROUTES.test(currentRoute)) return;
  if (Date.now() - lastInteraction > 4 * 60 * 1000) return; // inactif depuis 4 min
  pending++;
  if (pending >= 10) { addPractice(pending); pending = 0; }
}, 1000);
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pending) { addPractice(pending); pending = 0; } });

// ---------- Écouter un accord en touchant son schéma ----------
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-chord]');
  if (!card) return;
  const c = audio();
  strum(fretsOf(card.dataset.chord), c.currentTime + 0.03, 'd', { accent: true });
});

// ---------- Thème ----------
export function applyTheme() {
  const t = getState().settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}
applyTheme();

addEventListener('hashchange', route);
route();

// ---------- Hors ligne ----------
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

// ---------- Synchronisation (si configurée) ----------
import('./sync.js').then((m) => m.initSync()).catch((e) => console.warn('Synchro indisponible', e));
