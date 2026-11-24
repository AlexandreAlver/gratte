import { LESSONS } from '../data/lessons.js';
import { SONGS, songById } from '../data/songs.js';
import { getState, lessonState, streak, bestStreak, weekSeconds, totalSeconds } from '../store.js';
import { barChart, lineChart } from '../ui/charts.js';
import { icon, esc, fmtMin, parseDay, MONTHS_FR, mondayOf, addDays, dayKey, DAYS_FR } from '../util.js';
import { songRow } from './home.js';

// Noms lisibles des exercices
function exerciseName(id) {
  if (id.startsWith('song-')) {
    const [, sid, sec] = id.split('-');
    const s = songById(sid); if (!s) return id;
    return `${s.title} · ${s.sections[sec]?.name || sec}`;
  }
  for (const l of LESSONS) for (const st of l.steps) if (st.id === id) return `L${l.id} · ${st.title}`;
  return id;
}
const shortDate = (k) => { const d = parseDay(k); return `${d.getDate()} ${MONTHS_FR[d.getMonth()]}`; };

let selEx = null, selPair = null;

export function render(el) {
  const s = getState();
  const done = LESSONS.filter((l) => lessonState(l.id).status === 'done').length;
  const mastered = SONGS.filter((x) => s.songs[x.id]?.status === 'mastered');
  const goal = s.settings.weeklyGoal;
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const off = 7 - i; const mon = addDays(mondayOf(), -7 * off);
    return { label: off === 0 ? 'cette s.' : `${mon.getDate()}/${mon.getMonth() + 1}`, value: Math.round(weekSeconds(off) / 60) };
  });
  const thisWeek = Array.from({ length: 7 }, (_, i) => { const k = dayKey(addDays(mondayOf(), i)); return { label: DAYS_FR[i], value: Math.round((s.practice[k] || 0) / 60) }; });
  const exIds = Object.keys(s.exercises).filter((k) => s.exercises[k].history.length);
  if (!selEx || !exIds.includes(selEx)) selEx = exIds[exIds.length - 1] || null;
  const pairs = Object.keys(s.changes);
  if (!selPair || !pairs.includes(selPair)) selPair = pairs[pairs.length - 1] || null;

  const exPoints = (id) => {
    const byDay = {};
    for (const h of s.exercises[id].history) byDay[h.d] = Math.max(byDay[h.d] || 0, h.bpm);
    return Object.keys(byDay).sort().map((k) => ({ label: shortDate(k), value: byDay[k] }));
  };
  const pairPoints = (p) => {
    const byDay = {};
    for (const h of s.changes[p]) byDay[h.d] = Math.max(byDay[h.d] || 0, h.n);
    return Object.keys(byDay).sort().map((k) => ({ label: shortDate(k), value: byDay[k] }));
  };

  el.innerHTML = `
  <div class="page-head"><div><div class="eyebrow">Tes progrès</div><h1>Regarde le chemin parcouru</h1></div></div>
  <div class="grid2">
    <div class="stat"><div class="k"><span class="flame">${icon('flame', 16)}</span> Série actuelle</div><div class="v">${streak()}<small>j</small></div><div class="tiny muted">Record : ${bestStreak()} j</div></div>
    <div class="stat"><div class="k">${icon('clock', 16)} Temps total</div><div class="v" style="font-size:26px">${fmtMin(totalSeconds())}</div><div class="tiny muted">de pratique active</div></div>
    <div class="stat"><div class="k">${icon('path', 16)} Leçons</div><div class="v">${done}<small>/ 12</small></div><div class="bar"><i style="width:${(done / 12) * 100}%"></i></div></div>
    <div class="stat"><div class="k">${icon('music', 16)} Morceaux maîtrisés</div><div class="v">${mastered.length}<small>/ ${SONGS.length}</small></div><div class="bar"><i style="width:${(mastered.length / SONGS.length) * 100}%;background:var(--good)"></i></div></div>
  </div>

  <div class="section"><div class="section-title">${icon('chart', 20)} Temps de pratique</div>
    <div class="card"><div class="row between"><b>Par semaine (minutes)</b><span class="chip">objectif ${goal} min</span></div>${barChart(weeks, { goal, unit: ' min' })}</div>
    <div class="card" style="margin-top:12px"><b>Cette semaine, jour par jour</b>${barChart(thisWeek, { unit: ' min', h: 150 })}</div>
  </div>

  <div class="section"><div class="section-title">${icon('metronome', 20)} Tempo atteint</div>
    <div class="card">${exIds.length ? `<select class="ex-sel">${exIds.map((id) => `<option value="${esc(id)}" ${id === selEx ? 'selected' : ''}>${esc(exerciseName(id))} (record ${s.exercises[id].best})</option>`).join('')}</select>
      <div style="margin-top:10px">${lineChart(exPoints(selEx), { unit: ' BPM' })}</div>`
      : `<div class="empty">Valide un tempo avec le bouton <b>Réussi</b> dans un exercice : ta courbe apparaîtra ici.</div>`}</div>
  </div>

  <div class="section"><div class="section-title">${icon('refresh', 20)} Changements d'accords (en 1 minute)</div>
    <div class="card">${pairs.length ? `<select class="pair-sel">${pairs.map((p) => `<option value="${esc(p)}" ${p === selPair ? 'selected' : ''}>${esc(p.replace('>', ' ↔ ').replace('Gw', 'G'))} (record ${Math.max(...s.changes[p].map((h) => h.n))})</option>`).join('')}</select>
      <div style="margin-top:10px">${lineChart(pairPoints(selPair), { unit: ' chgts' })}</div>`
      : `<div class="empty">Fais un exercice « Une minute de changements » (leçon 4) pour suivre ta vitesse.</div>`}</div>
  </div>

  <div class="section"><div class="section-title">${icon('trophy', 20)} Mes morceaux</div>
    ${Object.keys(s.songs).length ? `<div class="song-list">${SONGS.filter((x) => s.songs[x.id]).map((x) => songRow({ ...x, st: s.songs[x.id] })).join('')}</div>` : '<div class="card tint empty">Termine ta première leçon pour débloquer ton premier morceau.</div>'}
  </div>`;

  el.querySelector('.ex-sel')?.addEventListener('change', (e) => { selEx = e.target.value; render(el); });
  el.querySelector('.pair-sel')?.addEventListener('change', (e) => { selPair = e.target.value; render(el); });
}
