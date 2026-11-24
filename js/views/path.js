import { LESSONS } from '../data/lessons.js';
import { songById } from '../data/songs.js';
import { lessonState, nextLessonId } from '../store.js';
import { icon, esc, themeChip } from '../util.js';

export function render(el) {
  const nextId = nextLessonId(LESSONS);
  const done = LESSONS.filter((l) => lessonState(l.id).status === 'done').length;
  el.innerHTML = `
  <div class="page-head"><div><div class="eyebrow">Ton parcours</div><h1>12 leçons pour gratter en rythme</h1>
  <p class="muted" style="margin-top:8px">D'abord le rythme, puis les accords et les techniques. Chaque leçon se termine par un morceau célèbre.</p></div></div>
  <div class="card flat row" style="margin-bottom:20px">
    <div style="flex:1"><b>${done} / 12 leçons terminées</b><div class="stat" style="box-shadow:none;padding:0;background:none"><div class="bar"><i style="width:${(done / 12) * 100}%"></i></div></div></div>
    <span class="chip ${done === 12 ? 'good' : 'accent'}">${Math.round((done / 12) * 100)} %</span>
  </div>
  <div class="path">
  ${LESSONS.map((l) => {
    const st = lessonState(l.id);
    const cls = st.status === 'done' ? 'done' : l.id === nextId ? 'current' : '';
    const song = songById(l.song);
    return `<a class="step-item ${cls}" href="#/lecon/${l.id}">
      <div class="num">${st.status === 'done' ? icon('check', 24, 2.6) : l.id}</div>
      <div class="body">
        <div class="row wrap">${themeChip(l.theme)}<span class="chip">${icon('clock', 14)} ${l.minutes} min</span>${st.status === 'progress' ? '<span class="chip accent">En cours</span>' : ''}</div>
        <h3>${esc(l.title)}</h3>
        <div class="small muted">${esc(l.subtitle)}</div>
        <div class="song">${icon('music', 15)} ${esc(song.title)} — ${esc(song.artist)}${(l.bonus || []).map((b) => ` · <span>+ ${esc(songById(b).title)}</span>`).join('')}</div>
      </div></a>`;
  }).join('')}
  </div>`;
}
