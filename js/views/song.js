import { songById, songChords, songTutorial, STYLE_COLORS } from '../data/songs.js';
import { songState, setSong, bestTempo } from '../store.js';
import { chordsRow } from '../ui/chord.js';
import { mountPractice } from '../ui/practice.js';
import { videoBlock } from '../ui/video.js';
import { patternWords } from '../music.js';
import { chordName } from '../data/chords.js';
import { icon, esc, toast, confetti } from '../util.js';

export function render(el, id) {
  const song = songById(id);
  if (!song) { location.hash = '#/morceaux'; return; }
  el.innerHTML = `<a class="back" href="#/morceaux">${icon('left', 18)} Morceaux</a><div class="song-host"></div>`;
  return mountSong(el.querySelector('.song-host'), song, {});
}

/** "[G]Frère [D]Jacques" → ligne d'accords alignée au-dessus de la ligne de paroles */
export function chordLyricLine(line) {
  let text = '', chords = '';
  const re = /\[([^\]]+)\]/g;
  let last = 0, m;
  while ((m = re.exec(line))) {
    text += line.slice(last, m.index);
    const name = chordName(m[1]);
    if (chords.length > text.length) text += ' '.repeat(chords.length - text.length + 1);
    chords = chords.padEnd(text.length, ' ') + name;
    last = re.lastIndex;
  }
  text += line.slice(last);
  if (!chords) return esc(text);
  return `<span class="ch">${esc(chords)}</span>\n${esc(text)}`;
}

export function mountSong(el, song, { embedded = false } = {}) {
  let st = songState(song.id);
  let section = Object.keys(song.sections)[0];
  let pr = null, saveT = null;
  const chords = songChords(song);
  const startBpm = song.startBpm || Math.max(50, Math.round(song.bpm * 0.65 / 5) * 5);
  const exId = (sec) => `song-${song.id}-${sec}`;

  function statusSeg() {
    const s = st?.status;
    return `<div class="seg status-seg">
      <button data-s="learning" aria-pressed="${s === 'learning'}">J'apprends</button>
      <button data-s="mastered" aria-pressed="${s === 'mastered'}">${icon('check', 14)} Je maîtrise</button></div>`;
  }

  el.innerHTML = `
  ${embedded ? '' : `<div class="song-hero"><div class="cover" style="background:${STYLE_COLORS[song.style]}">${esc(song.title[0])}</div>
    <div><div class="eyebrow small muted" style="font-weight:700;text-transform:uppercase;letter-spacing:.08em">${esc(song.style)}${song.bonus ? ' · bonus' : ''}</div>
    <h1 style="font-size:28px">${esc(song.title)}</h1><div class="muted">${esc(song.artist)} · ${song.year}</div></div></div>`}
  <div class="facts">
    <span class="chip">${icon('music', 14)} ${esc(song.key)}</span>
    ${song.capo ? `<span class="chip accent">Capo case ${song.capo}</span>` : '<span class="chip">Sans capo</span>'}
    <span class="chip">${icon('metronome', 14)} ${song.bpm} BPM</span>
    <span class="chip">${'●'.repeat(song.level)}${'○'.repeat(5 - song.level)} difficulté</span>
    <span class="chip">${song.free ? '🧸 Pour les enfants' : `Leçon ${song.lesson}`}</span>
  </div>
  ${!st && !song.free ? `<div class="callout warn" style="margin-top:14px">${icon('lock', 20)}<div>Ce morceau se débloque à la <a href="#/lecon/${song.lesson}"><b>leçon ${song.lesson}</b></a>. Tu peux déjà le regarder, mais la leçon te donne les bases pour le réussir.</div></div>` : ''}
  ${!embedded && (st || song.free) ? `<div class="row wrap" style="margin-top:14px">${statusSeg()}</div>` : ''}

  <div class="section"><div class="section-title">${icon('grid', 20)} Les accords</div>
    ${chordsRow(chords, 80)}
    <p class="tiny muted">Touche un schéma pour entendre l'accord. Les chiffres dans les ronds = doigts (1 index, 2 majeur, 3 annulaire, 4 auriculaire, T pouce).</p></div>

  ${song.lyrics ? `<div class="section"><div class="section-title">${icon('heart', 20)} Paroles et accords</div>
    <div class="card">${song.lyrics.map((part) => `<div class="lyr-part"><b class="small muted">${esc(part.name)}</b><pre class="lyr">${part.lines.map(chordLyricLine).join('\n')}</pre></div>`).join('')}
    <p class="tiny muted" style="margin-top:8px">Chanson du domaine public. L'accord en orange se joue sur la syllabe juste en dessous.</p></div></div>` : ''}

  <div class="section"><div class="section-title">${icon('metronome', 20)} Le rythme</div>
    <div class="card flat"><div class="row between wrap"><div><b>${esc(song.patternName)}</b><div class="muted small" style="font-family:ui-monospace,monospace;margin-top:4px">${esc(patternWords(song.pattern))}</div></div>
    ${song.altPattern ? `<span class="chip">Variante : ${esc(patternWords(song.altPattern))}</span>` : ''}</div>
    ${song.bpmNote ? `<p class="small muted" style="margin-top:8px">${esc(song.bpmNote)}</p>` : ''}</div></div>

  <div class="section"><div class="section-title">${icon('list', 20)} Grille et tablature</div>
    <div class="seg sec-seg" style="margin-bottom:12px">${Object.entries(song.sections).map(([k, s]) => `<button data-k="${k}" aria-pressed="${k === section}">${esc(s.name)}</button>`).join('')}</div>
    <div class="grid-host"></div>
    <p class="small muted" style="margin:14px 0 8px">Joue la section en boucle avec l'appli. La tablature montre, pour chaque coup, la case de chaque corde (6 lignes : Mi grave en bas, Mi aigu en haut).</p>
    <div class="pr-host"></div>
    <div style="margin-top:14px"><b class="small">Structure du morceau</b><div class="structure" style="margin-top:6px">${song.structure.map((k) => `<span class="chip">${esc(song.sections[k].name)}</span>`).join('<span class="muted">→</span>')}</div></div>
  </div>

  <div class="section"><div class="section-title">${icon('book', 20)} Le tuto pas à pas</div>
    <div class="card"><ol class="steps-list">${songTutorial(song).map((s, i) => `<li data-i="${i}" class="${st?.steps?.[i] ? 'done' : ''}"><b role="button" tabindex="0">${esc(s.t)}</b><p>${esc(s.p)}</p></li>`).join('')}</ol>
    <p class="tiny muted">Touche le titre d'une étape pour la cocher.</p></div>
    <div class="card tint" style="margin-top:12px"><b>${icon('bulb', 18)} Conseils</b><ul class="prose small" style="margin:8px 0 0">${song.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
  </div>

  ${embedded || !song.video ? '' : `<div class="section"><div class="section-title">${icon('video', 20)} Le tuto vidéo</div>${videoBlock(song.video, song.title)}</div>`}

  ${song.lyrics ? '' : `<div class="section"><div class="section-title">${icon('heart', 20)} Mes paroles</div>
    <p class="small muted">Les paroles sont protégées par le droit d'auteur, l'appli ne les fournit pas. Colle ici la version « accords + paroles » que tu utilises (les espaces sont conservés pour aligner les accords).</p>
    <textarea class="mono lyrics" placeholder="Colle tes paroles ici…">${esc(st?.lyrics || '')}</textarea>
    <div class="tiny muted saved" style="margin-top:4px">&nbsp;</div>
  </div>`}

  ${song.confidence !== 'high' ? `<div class="callout warn" style="margin-top:20px">${icon('info', 20)}<div class="small">Grille vérifiée sur plusieurs tablatures, mais le nombre de mesures par accord est simplifié. Compare avec l'enregistrement et ajuste à l'oreille.</div></div>` : ''}
  `;

  function renderGrid() {
    const sec = song.sections[section];
    el.querySelector('.grid-host').innerHTML = `<div class="grid-section"><div class="bars">${sec.bars.map((b, i) => `<div class="b" data-b="${i}">${b.split(' ').map((c) => `<span>${esc(chordName(c))}</span>`).join('')}</div>`).join('')}</div></div>`;
    pr?.destroy();
    const best = bestTempo(exId(section));
    pr = mountPractice(el.querySelector('.pr-host'), {
      id: exId(section), bars: sec.bars, pattern: song.pattern, beats: song.beats, steps: song.steps,
      bpm: startBpm, target: song.bpm, inc: 5, capo: song.capo,
      patterns: song.altPattern ? [song.pattern, song.altPattern] : null,
      onBar: (bi) => el.querySelectorAll('.bars .b').forEach((x) => x.classList.toggle('on', Number(x.dataset.b) === bi)),
    });
    if (best >= song.bpm && st?.status !== 'mastered') toast('Tu as atteint le tempo du disque sur cette section !');
  }
  renderGrid();

  el.querySelectorAll('.sec-seg button').forEach((b) => b.onclick = () => {
    section = b.dataset.k;
    el.querySelectorAll('.sec-seg button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    renderGrid();
  });
  el.querySelectorAll('.status-seg button').forEach((b) => b.onclick = () => {
    setSong(song.id, { status: b.dataset.s }); st = songState(song.id);
    el.querySelectorAll('.status-seg button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    if (b.dataset.s === 'mastered') { confetti(); toast(`🎸 ${song.title} rejoint tes morceaux maîtrisés !`); }
  });
  el.querySelectorAll('.steps-list li b').forEach((b) => {
    const toggle = () => {
      const li = b.closest('li'); const i = li.dataset.i;
      const steps = { ...(songState(song.id)?.steps || {}) }; steps[i] = !steps[i];
      setSong(song.id, { steps, status: songState(song.id)?.status === 'unlocked' || !songState(song.id) ? 'learning' : songState(song.id).status });
      st = songState(song.id);
      li.classList.toggle('done', !!steps[i]);
    };
    b.onclick = toggle; b.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
  });
  const ta = el.querySelector('.lyrics');
  if (ta) ta.oninput = () => {
    clearTimeout(saveT);
    saveT = setTimeout(() => { setSong(song.id, { lyrics: ta.value, status: songState(song.id)?.status || 'unlocked' }); st = songState(song.id); el.querySelector('.saved').textContent = 'Enregistré ✓'; }, 600);
  };
  return () => { pr?.destroy(); clearTimeout(saveT); };
}
