import { LESSONS } from '../data/lessons.js';
import { songById, STYLE_COLORS, SONGS } from '../data/songs.js';
import { getState, lessonState, nextLessonId, streak, weekSeconds, weekDays } from '../store.js';
import { icon, esc, themeChip, DAYS_FR } from '../util.js';

export function ring(pct, label, sub, size = 84) {
  const r = (size - 10) / 2, C = 2 * Math.PI * r;
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}"><circle class="bg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="9"/>
  <circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="9" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, pct))}"/></svg>
  <div class="lbl"><div>${label}<small>${sub}</small></div></div></div>`;
}

export function render(el) {
  const s = getState();
  const h = new Date().getHours();
  const hello = h < 6 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  const nextId = nextLessonId(LESSONS);
  const next = nextId ? LESSONS.find((l) => l.id === nextId) : null;
  const ls = next ? lessonState(next.id) : null;
  const done = LESSONS.filter((l) => lessonState(l.id).status === 'done').length;
  const st = streak();
  const wk = Math.round(weekSeconds() / 60), goal = s.settings.weeklyGoal;
  const days = weekDays();
  const nsong = next ? songById(next.song) : null;
  const mySongs = Object.entries(s.songs).map(([id, v]) => ({ ...songById(id), st: v })).filter((x) => x.id && !x.free);
  const kids = SONGS.filter((x) => x.free);

  el.innerHTML = `
  <div class="hello"><div class="muted small" style="font-weight:600">${hello} 👋</div><h1>Prêt à gratter ?</h1></div>

  ${next ? `<a class="hero" href="#/lecon/${next.id}${ls.status === 'progress' && ls.step ? '/' + ls.step : ''}">
    <div class="eyebrow">${ls.status === 'progress' ? 'Reprendre' : done ? 'Leçon suivante' : 'Commencer le parcours'} · Leçon ${next.id}/12</div>
    <h2>${esc(next.title)}</h2>
    <div class="meta"><span>${icon('clock', 16)} ${next.minutes} min</span><span>${icon('music', 16)} ${esc(nsong?.title || '')}</span></div>
    <span class="btn">${icon('play', 18)} ${ls.status === 'progress' ? 'Continuer' : "C'est parti"}</span>
  </a>` : `<a class="hero" href="#/morceaux"><div class="eyebrow">Parcours terminé 🎉</div><h2>Tu as fini les 12 leçons !</h2><p>Continue à faire vivre ton répertoire et à monter les tempos.</p><span class="btn">${icon('music', 18)} Mes morceaux</span></a>`}

  <div class="grid2" style="margin-top:16px">
    <div class="stat">
      <div class="k"><span class="flame">${icon('flame', 17)}</span> Série</div>
      <div class="v">${st}<small>jour${st > 1 ? 's' : ''}</small></div>
      <div class="week-dots">${days.map((d, i) => `<i class="${d.sec >= 300 ? 'on' : ''} ${d.today ? 'today' : ''}">${DAYS_FR[i]}</i>`).join('')}</div>
    </div>
    <div class="stat">
      <div class="k">${icon('target', 16)} Cette semaine</div>
      <div class="row" style="gap:12px;margin-top:8px">${ring(wk / goal, `${wk}`, `/ ${goal} min`, 70)}
      <div class="small muted">${wk >= goal ? 'Objectif atteint, bravo !' : `Encore <b style="color:var(--ink)">${goal - wk} min</b>`}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Outils rapides</div>
    <div class="tiles">
      <a class="tile" href="#/accordeur"><div class="ico">${icon('tuner')}</div><b>Accordeur</b><span>Avec le micro</span></a>
      <a class="tile" href="#/metronome"><div class="ico">${icon('metronome')}</div><b>Métronome</b><span>Garde le tempo</span></a>
      <a class="tile" href="#/accords"><div class="ico">${icon('grid')}</div><b>Accords</b><span>Schémas et sons</span></a>
      <a class="tile" href="#/progres"><div class="ico">${icon('chart')}</div><b>Progrès</b><span>${done}/12 leçons</span></a>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Mon répertoire <span class="chip">${mySongs.length}</span></div>
    ${mySongs.length ? `<div class="song-list">${mySongs.slice(0, 4).map(songRow).join('')}</div>${mySongs.length > 4 ? `<a class="btn ghost block" style="margin-top:10px" href="#/morceaux">Voir tout</a>` : ''}`
      : `<div class="card tint center"><p class="muted">Chaque leçon terminée débloque un morceau dans ton répertoire.</p>${next ? themeChip(next.theme) : ''}</div>`}
  </div>

  <div class="section">
    <div class="section-title">🧸 Comptines pour les enfants</div>
    <p class="small muted" style="margin:-4px 0 12px">Accords simples et paroles incluses, disponibles tout de suite.</p>
    <div class="song-list">${kids.map((x) => songRow({ ...x, st: s.songs[x.id] })).join('')}</div>
  </div>`;
}

export function songRow(x) {
  const status = x.st?.status || (x.free ? 'free' : null);
  const badge = status === 'mastered' ? `<span class="chip good">${icon('check', 14)} Maîtrisé</span>` : status === 'learning' ? '<span class="chip accent">En cours</span>' : status === 'free' ? '<span class="chip warn">Comptine</span>' : status ? '<span class="chip">Nouveau</span>' : `<span class="chip">${icon('lock', 13)} Leçon ${x.lesson}</span>`;
  return `<a class="song-row ${status ? '' : 'locked'}" href="#/morceau/${x.id}">
    <div class="cover" style="background:${STYLE_COLORS[x.style] || 'var(--accent)'}">${esc(x.title[0])}</div>
    <div class="info"><b>${esc(x.title)}</b><span>${esc(x.artist)}${x.bonus ? ' · bonus' : ''}</span></div>${badge}</a>`;
}
