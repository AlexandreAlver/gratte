import { lessonById, LESSONS, REVIEW_QUESTIONS } from '../data/lessons.js';
import { songById } from '../data/songs.js';
import { lessonState, setLessonStep, completeLesson } from '../store.js';
import { icon, esc, themeChip, fmtClock, confetti } from '../util.js';
import { mountPractice } from '../ui/practice.js';
import { mountChanges } from '../ui/changes.js';
import { videoBlock } from '../ui/video.js';
import { mountTuner } from './tuner.js';
import { mountSong } from './song.js';
import { STYLE_COLORS } from '../data/songs.js';

const KIND = {
  intro: ['sparkle', 'Introduction'], tuner: ['tuner', 'Accordage'], theory: ['book', 'Théorie'], video: ['video', 'Vidéo'],
  practice: ['metronome', 'Exercice'], changes: ['refresh', 'Changements'], song: ['music', 'Morceau'], review: ['star', 'Bilan'],
};
const lessonTimers = {}; // temps passé dans la leçon pendant la session

export function render(el, idStr, stepStr) {
  const L = lessonById(idStr);
  if (!L) { location.hash = '#/parcours'; return; }
  const st = lessonState(L.id);
  let i = stepStr != null ? Math.min(L.steps.length - 1, Number(stepStr)) : 0;
  if (stepStr == null && st.status === 'progress' && st.step) i = 0;
  setLessonStep(L.id, i);
  const step = L.steps[i];
  const [ic, kindName] = KIND[step.kind];
  const destroyers = [];
  lessonTimers[L.id] ||= Date.now();

  const head = (title) => `<div class="step-head"><div class="step-kind">${icon(ic, 16, 2.2)} ${kindName} · ${step.min} min</div><h1>${esc(title)}</h1></div>`;

  let body = '';
  switch (step.kind) {
    case 'intro': {
      const song = songById(L.song);
      body = `<div class="row wrap" style="margin-bottom:10px">${themeChip(L.theme)}<span class="chip">${icon('clock', 14)} ${L.minutes} min</span><span class="chip">Leçon ${L.id} / 12</span></div>
      ${head(L.title)}
      <div class="prose">${step.body}</div>
      <div class="card" style="margin-top:18px"><h3 style="margin-bottom:6px">${icon('target', 18)} Objectifs de la leçon</h3>
        ${step.objectives.map((o) => `<div class="objective">${icon('check', 18, 2.4)}<div>${esc(o)}</div></div>`).join('')}</div>
      <a class="song-row" href="#/morceau/${song.id}" style="margin-top:16px"><div class="cover" style="background:${STYLE_COLORS[song.style]}">${esc(song.title[0])}</div>
        <div class="info"><span>Le morceau de la leçon</span><b>${esc(song.title)} — ${esc(song.artist)}</b></div>${icon('right')}</a>
      <div class="card tint" style="margin-top:16px"><div class="small"><b>Déroulé :</b> ${L.steps.map((s) => esc(s.title || KIND[s.kind][1])).join(' → ')}</div></div>`;
      break;
    }
    case 'tuner':
      body = `${head(step.title)}<div class="prose"><p>Une guitare désaccordée sonne faux même avec un rythme parfait. Joue chaque corde à vide et tourne la mécanique jusqu'à ce que l'aiguille soit au centre, en vert.</p></div><div class="card tuner-host"></div>
      <details class="more"><summary>Voir comment accorder (vidéo)</summary><div style="margin-top:10px">${videoBlock('tuner', 'accorder guitare')}</div></details>`;
      break;
    case 'theory':
      body = `${head(step.title)}<div class="prose">${step.body}</div>`;
      break;
    case 'video':
      body = `${head(step.title)}<div class="prose">${step.body || ''}</div><div style="margin-top:12px">${videoBlock(step.video, step.title)}</div>
      <p class="tiny muted" style="margin-top:10px">Tu peux passer à l'étape suivante pendant que la vidéo est en pause et y revenir quand tu veux.</p>`;
      break;
    case 'practice':
      body = `${head(step.title)}<div class="prose">${step.body}</div><div class="pr-host" style="margin-top:14px"></div>`;
      break;
    case 'changes':
      body = `${head(step.title)}<div class="prose">${step.body || ''}</div><div class="ch-host" style="margin-top:14px"></div>`;
      break;
    case 'song': {
      const song = songById(step.song);
      body = `${head(song.title + ' — ' + song.artist)}<div class="prose">${step.body || ''}</div><div class="song-host" style="margin-top:8px"></div>`;
      break;
    }
    case 'review':
      body = reviewHTML(L);
      break;
  }

  const isLast = i === L.steps.length - 1;
  el.innerHTML = `
  <div class="lesson-top">
    <div class="row between">
      <a class="back" href="#/parcours" style="margin:0">${icon('left', 18)} Parcours</a>
      <div class="title" style="flex:1;text-align:center">Leçon ${L.id} · ${esc(L.title)}</div>
      <span class="timer">${icon('clock', 15)} <span class="tm">0:00</span></span>
    </div>
    <div class="progress-dots">${L.steps.map((s, k) => `<a href="#/lecon/${L.id}/${k}" class="${k < i ? 'done' : k === i ? 'cur' : ''}" title="${esc(s.title || KIND[s.kind][1])}" aria-label="Étape ${k + 1}"></a>`).join('')}</div>
  </div>
  <div class="fade-in">${body}</div>
  <div class="lesson-pad"></div>
  ${step.kind !== 'review' ? `<div class="step-nav"><div class="inner">
    ${i > 0 ? `<a class="btn ghost" href="#/lecon/${L.id}/${i - 1}" aria-label="Étape précédente">${icon('left', 20)}</a>` : ''}
    <a class="btn primary big" href="#/lecon/${L.id}/${i + 1}">${isLast ? 'Terminer' : i === 0 ? 'Commencer la leçon' : 'Étape suivante'} ${icon('right', 20)}</a>
  </div></div>` : ''}`;

  // Montage des composants interactifs
  if (step.kind === 'tuner') destroyers.push(mountTuner(el.querySelector('.tuner-host'), { compact: true }));
  if (step.kind === 'practice') destroyers.push(mountPractice(el.querySelector('.pr-host'), { id: step.id, ...step.pr }).destroy);
  if (step.kind === 'changes') destroyers.push(mountChanges(el.querySelector('.ch-host'), step.pairs).destroy);
  if (step.kind === 'song') destroyers.push(mountSong(el.querySelector('.song-host'), songById(step.song), { embedded: true }));
  if (step.kind === 'review') bindReview(el, L);

  const tm = el.querySelector('.tm');
  const t = setInterval(() => { tm.textContent = fmtClock((Date.now() - lessonTimers[L.id]) / 1000); }, 1000);
  tm.textContent = fmtClock((Date.now() - lessonTimers[L.id]) / 1000);
  return () => { clearInterval(t); destroyers.forEach((d) => typeof d === 'function' && d()); };
}

function reviewHTML(L) {
  return `<div class="step-head"><div class="step-kind">${icon('star', 16, 2.2)} Bilan</div><h1>Comment ça s'est passé ?</h1></div>
  <div class="prose"><p>Sois honnête, ça t'aidera à savoir quoi retravailler. Une leçon peut se refaire autant de fois que tu veux : les meilleurs guitaristes répètent les bases en boucle.</p></div>
  ${REVIEW_QUESTIONS.map((q) => `<div class="card" style="margin-top:12px"><b>${esc(q.q)}</b>
    <div class="rate" data-k="${q.k}">${[['😕', 'Pas encore'], ['😐', 'Bof'], ['🙂', 'Ça vient'], ['😃', 'Oui !']].map(([e, t], n) => `<button data-v="${n + 1}" aria-pressed="false">${e}<small>${t}</small></button>`).join('')}</div></div>`).join('')}
  <button class="btn primary big block finish" style="margin-top:20px">${icon('trophy', 20)} Terminer la leçon</button>
  <div class="celebrate-host"></div>`;
}

function bindReview(el, L) {
  const ratings = {};
  el.querySelectorAll('.rate').forEach((r) => r.querySelectorAll('button').forEach((b) => b.onclick = () => {
    r.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    ratings[r.dataset.k] = Number(b.dataset.v);
  }));
  el.querySelector('.finish').onclick = () => {
    const unlocked = [L.song, ...(L.bonus || [])];
    completeLesson(L.id, ratings, unlocked);
    confetti();
    const weak = Object.entries(ratings).filter(([, v]) => v <= 2).map(([k]) => k);
    const advice = weak.includes('tempo') ? 'Refais les exercices au micro 5 minutes par jour : la régularité vient avec la répétition.'
      : weak.includes('changes') ? 'Fais tes « une minute de changements » chaque jour avant de jouer : tes scores vont grimper.'
      : weak.includes('song') ? 'Retravaille le morceau section par section, 10 BPM plus lentement.'
      : 'Tu es prêt pour la suite ! Pense à rejouer le morceau dans les prochains jours pour l\'ancrer.';
    const next = LESSONS.find((x) => x.id === L.id + 1);
    el.querySelector('.fade-in').innerHTML = `<div class="card celebrate fade-in">
      <div class="medal">${icon('trophy', 48, 1.8)}</div>
      <h1>Leçon ${L.id} terminée !</h1>
      <p class="muted" style="margin-top:8px">${esc(L.title)}</p>
      <div class="callout good" style="text-align:left">${icon('music', 20)}<div><b>Débloqué dans ton répertoire :</b> ${unlocked.map((id) => esc(songById(id).title)).join(', ')}</div></div>
      <div class="callout" style="text-align:left">${icon('bulb', 20)}<div>${esc(advice)}</div></div>
      <div class="row wrap" style="justify-content:center;margin-top:14px">
        ${next ? `<a class="btn primary" href="#/lecon/${next.id}">Leçon ${next.id} ${icon('right', 18)}</a>` : ''}
        <a class="btn ghost" href="#/morceaux">Mes morceaux</a><a class="btn ghost" href="#/progres">Mes progrès</a>
      </div></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}
