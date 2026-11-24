// Atelier d'entraînement : motif animé, accords, tablature, métronome, guitare, micro et échelle de tempo
import { Clock } from '../audio/clock.js';
import { strum, note, audio, outputLatency } from '../audio/engine.js';
import { OnsetDetector } from '../audio/mic.js';
import { chordSVG, chordLabel } from './chord.js';
import { tabSVG } from './tab.js';
import { eventFor, isPicking, chordAtStep, countLabel, tokenView, barChords } from '../music.js';
import { getState, bestTempo, logTempo } from '../store.js';
import { icon, esc, toast, confetti, clamp, $ } from '../util.js';

let active = null; // un seul atelier joue à la fois
export function stopAllPractice() { if (active) active.stop(); }

const PATTERN_NAMES = {
  'd.d.d.d.': 'Noires (B B B B)', 'dudududu': 'Croches (BH BH BH BH)', 'd.d.dudu': 'B B BH BH', 'd.dud.du': 'B · BH B · BH',
  'd.du.udu': 'B · BH · HBH (folk)', 'd.Dud.Du': 'Backbeat accentué', 'd.xud.xu': 'B · ✕H B · ✕H (chuck)', 'duxuduxu': 'BH ✕H BH ✕H',
};

export function mountPractice(el, cfg) {
  const c = { beats: 4, steps: 2, inc: 5, target: cfg.bpm + 30, synth: false, mic: false, subClick: false, capo: 0, showTab: true, log: true, ...cfg };
  let pattern = c.pattern;
  const best = c.id ? bestTempo(c.id) : 0;
  let bpm = best ? clamp(best, c.bpm, c.target) : c.bpm;
  const uid = 'p' + Math.random().toString(36).slice(2, 8);
  const noChord = c.bars.every((b) => !b);
  const opts = { click: true, synth: c.synth, mic: false, sub: c.subClick };
  let clock = null, det = null, sched = [], errs = [], extra = 0, lastBar = -1;

  const spb = () => pattern.length;
  const steps = () => c.steps;

  function patternCells() {
    return [...pattern].map((t, i) => {
      const v = tokenView(t, i, steps());
      const beat = i % steps() === 0;
      return `<div class="cell ${beat ? 'beatstart' : ''}"><div class="arr ${v.cls}" data-i="${i}">${v.a}${v.lbl ? `<span class="lbl">${esc(v.lbl)}</span>` : ''}</div><div class="cnt ${beat ? 'beat' : ''}">${countLabel(i, steps(), c.beats)}</div></div>`;
    }).join('');
  }

  function render() {
    const first = c.bars.find(Boolean);
    el.innerHTML = `
    <div class="practice" id="${uid}">
      <div class="pr-chords">
        <div class="pr-now"><div class="diag">${first ? chordSVG(first, 78) : ''}</div>
          <div style="min-width:0"><div class="big">${first ? esc(chordLabel(first).main) : '—'}</div>
          <div class="fr">${first ? esc(chordLabel(first).sub) : 'Cordes étouffées : main gauche posée à plat'}</div></div></div>
        ${c.bars.length > 1 ? `<div class="pr-next"><span>ensuite</span><span class="nm">—</span></div>` : ''}
      </div>
      <div class="pr-count"></div>
      ${c.patterns ? `<div class="row wrap" style="margin-top:12px"><span class="small muted">Motif :</span><div class="seg pat-seg">${c.patterns.map((p) => `<button data-pat="${p}" aria-pressed="${p === pattern}">${esc(PATTERN_NAMES[p] || p)}</button>`).join('')}</div></div>` : ''}
      <div class="pattern" style="grid-template-columns:repeat(${spb()},1fr)">${patternCells()}</div>
      ${c.showTab && !noChord ? `<div class="tab-wrap">${tabSVG(c.bars, pattern, { steps: c.steps, beats: c.beats, idPrefix: uid })}</div>` : ''}
      <div class="pr-controls">
        <button class="icon-btn lg primary play" aria-label="Démarrer">${icon('play', 26)}</button>
        <div class="bpm">
          <button class="icon-btn minus" aria-label="Moins vite">${icon('minus')}</button>
          <div class="val"><b>${bpm}</b><span>BPM</span></div>
          <button class="icon-btn plus" aria-label="Plus vite">${icon('plus')}</button>
        </div>
        <div class="spacer"></div>
      </div>
      <div class="pr-toggles">
        <button class="toggle t-click" aria-pressed="true">${icon('metronome', 18)} Clic</button>
        <button class="toggle t-synth" aria-pressed="${opts.synth}">${icon('guitar', 18)} Guitare</button>
        <button class="toggle t-mic" aria-pressed="false">${icon('mic', 18)} Micro</button>
        ${c.steps === 2 ? `<button class="toggle t-sub" aria-pressed="${opts.sub}">${icon('ear', 18)} Clic sur les &</button>` : ''}
      </div>
      ${c.id && c.log ? `<div class="ladder">
        <div class="row between"><div><b>Échelle de tempo</b><div class="tiny muted">4 passages propres → valide, le tempo monte de ${c.inc}</div></div>
        <button class="btn good sm ok">${icon('check', 18)} Réussi</button></div>
        <div class="track"><i></i><b></b></div>
        <div class="legend"><span>${c.bpm}</span><span class="rec"></span><span>Objectif ${c.target}</span></div>
      </div>` : ''}
      <div class="feedback hidden">
        <div class="row between"><b>${icon('mic', 18)} Écoute de ton rythme</b><span class="tiny muted calib"></span></div>
        <div class="level"><i></i></div>
        <div class="fb-target"></div>
        <div class="fb-legend"><span>← en avance</span><span>pile</span><span>en retard →</span></div>
        <div class="fb-msg">Joue : chaque coup détecté s'affiche ici.</div>
        <div class="fb-stats"></div>
      </div>
    </div>`;
    bind();
    updateLadder();
    if (c.bars.length > 1) { const nx = nextChordAfter(0, 0); showChord(chordAtStep(c.bars[0], 0, spb()), nx.id, false); }
  }

  const q = (s) => el.querySelector(s);

  function setBpm(v) {
    bpm = clamp(Math.round(v), 30, 240);
    q('.bpm .val b').textContent = bpm;
    if (clock) clock.setBpm(bpm);
    updateLadder();
  }

  function updateLadder() {
    const lad = q('.ladder'); if (!lad) return;
    const b = c.id ? bestTempo(c.id) : 0;
    const span = Math.max(1, c.target - c.bpm);
    lad.querySelector('.track i').style.width = clamp(((b - c.bpm) / span) * 100, 0, 100) + '%';
    lad.querySelector('.track b').style.left = clamp(((bpm - c.bpm) / span) * 100, 0, 100) + '%';
    lad.querySelector('.rec').textContent = b ? `Record ${b}` : '';
    lad.querySelector('.ok').innerHTML = `${icon('check', 18)} Réussi à ${bpm}`;
  }

  function showChord(id, nextId, soon) {
    const now = q('.pr-now');
    if (now.dataset.id !== String(id)) {
      now.dataset.id = id;
      now.querySelector('.diag').innerHTML = id ? chordSVG(id, 78) : '';
      now.querySelector('.big').textContent = id ? chordLabel(id).main : '—';
      now.querySelector('.fr').textContent = id ? chordLabel(id).sub : 'Cordes étouffées';
    }
    const nx = q('.pr-next');
    if (nx) { nx.querySelector('.nm').textContent = nextId ? chordLabel(nextId).main : '—'; nx.classList.toggle('soon', !!soon); }
  }

  function nextChordAfter(barIdx, inBar) {
    const cur = chordAtStep(c.bars[barIdx], inBar, spb());
    for (let k = 0; k <= c.bars.length; k++) {
      const bi = (barIdx + k) % c.bars.length;
      const list = barChords(c.bars[bi]);
      for (let j = 0; j < list.length; j++) {
        const pos = (j * spb()) / list.length;
        if (k === 0 && pos <= inBar) continue;
        if (list[j] !== cur) return { id: list[j], stepsAway: k * spb() + pos - inBar };
      }
    }
    return { id: null, stepsAway: 99 };
  }

  function onStep(ev) {
    const cnt = q('.pr-count');
    el.querySelectorAll('.pattern .arr.on').forEach((a) => a.classList.remove('on'));
    el.querySelectorAll('.tab-svg .hl.on').forEach((a) => a.classList.remove('on'));
    if (ev.countIn) {
      if (ev.isBeat) { cnt.textContent = ev.beat + 1; cnt.classList.add('on'); }
      return;
    }
    cnt.classList.remove('on');
    const n = c.bars.length;
    const bi = ((ev.bar % n) + n) % n;
    q(`.pattern .arr[data-i="${ev.inBar}"]`)?.classList.add('on');
    const hl = el.querySelector(`[data-col="${uid}-${bi}-${ev.inBar}"]`);
    if (hl) {
      hl.classList.add('on');
      if (bi !== lastBar) {
        const wrap = q('.tab-wrap'); const x = hl.getBBox ? hl.getBBox().x : 0;
        if (wrap) wrap.scrollTo({ left: Math.max(0, x - 40), behavior: 'smooth' });
      }
    }
    const cur = chordAtStep(c.bars[bi], ev.inBar, spb());
    const nx = nextChordAfter(bi, ev.inBar);
    showChord(cur, nx.id, nx.stepsAway <= c.steps);
    if (bi !== lastBar || ev.inBar === 0) { c.onBar && c.onBar(bi, ev.inBar); lastBar = bi; }
  }

  function onSchedule(ev) {
    if (ev.countIn) return;
    const n = c.bars.length, bi = ((ev.bar % n) + n) % n;
    const tok = pattern[ev.inBar];
    const chord = chordAtStep(c.bars[bi], ev.inBar, spb());
    const e = eventFor(chord, tok, isPicking(pattern));
    sched.push({ time: ev.time, hit: e.kind !== 'air', matched: false });
    if (sched.length > 64) sched.shift();
    if (!opts.synth || !chord) return;
    if (e.kind === 'strum') strum(e.frets, ev.time, e.dir, { accent: e.accent, mute: e.mute, palm: e.palm, strings: e.strings, capo: c.capo });
    else if (e.kind === 'note') note(e.string, e.fret, ev.time, { capo: c.capo });
  }

  function start() {
    stopAllPractice();
    audio();
    clock = new Clock({ bpm, beats: c.beats, steps: c.steps, click: opts.click, subClick: opts.sub, countIn: true, onStep, onSchedule });
    sched = []; lastBar = -1;
    clock.start();
    active = api;
    const b = q('.play'); b.innerHTML = icon('stop', 24); b.setAttribute('aria-label', 'Arrêter');
  }
  function stop() {
    if (clock) { clock.stop(); clock = null; }
    if (active === api) active = null;
    const b = q('.play'); if (b) { b.innerHTML = icon('play', 26); b.setAttribute('aria-label', 'Démarrer'); }
    el.querySelectorAll('.pattern .arr.on, .tab-svg .hl.on').forEach((a) => a.classList.remove('on'));
    q('.pr-count')?.classList.remove('on');
  }

  // ---------- Écoute au micro ----------
  async function micOn() {
    const s = getState().settings;
    det = new OnsetDetector(onOnset, (lv) => { const i = q('.feedback .level i'); if (i) i.style.width = Math.min(100, Math.sqrt(lv) * 600) + '%'; });
    try {
      await det.start({ k: 5 / (s.sensitivity || 1), floor: Math.max(0.00015, (s.clickLevel || 0) * 1.6) });
    } catch (e) {
      det = null; q('.t-mic').setAttribute('aria-pressed', 'false');
      toast(e.name === 'NotAllowedError' ? "Accès au micro refusé : autorise-le dans les réglages du navigateur." : e.message);
      return;
    }
    if (opts.synth) { opts.synth = false; q('.t-synth').setAttribute('aria-pressed', 'false'); toast("Guitare de l'appli coupée pendant l'écoute du micro."); }
    errs = []; extra = 0;
    q('.feedback').classList.remove('hidden');
    q('.calib').textContent = s.latencyMs == null ? 'Non calibré (Outils › Calibrer)' : `Calibré : ${Math.round(s.latencyMs)} ms`;
    if (!clock) start();
  }
  function micOff() { det?.stop(); det = null; q('.feedback')?.classList.add('hidden'); }

  function onOnset(t) {
    if (!clock) return;
    const s = getState().settings;
    const lat = s.latencyMs != null ? s.latencyMs / 1000 : outputLatency() + 0.035;
    const adj = t - lat;
    const sd = 60 / bpm / c.steps;
    let bestEv = null, bestD = 1e9;
    for (const e of sched) { const d = Math.abs(adj - e.time); if (d < bestD) { bestD = d; bestEv = e; } }
    if (!bestEv || bestD > sd / 2) return;
    if (!bestEv.hit || bestEv.matched) { extra++; renderFb(); return; }
    bestEv.matched = true;
    const err = (adj - bestEv.time) * 1000;
    errs.push(err); if (errs.length > 24) errs.shift();
    const tg = q('.fb-target');
    const dot = document.createElement('i');
    dot.style.left = clamp(50 + (err / 120) * 50, 3, 97) + '%';
    dot.style.background = Math.abs(err) <= 35 ? 'var(--good)' : Math.abs(err) <= 70 ? 'var(--warn)' : 'var(--bad)';
    tg.appendChild(dot);
    requestAnimationFrame(() => { dot.style.opacity = '0.15'; });
    while (tg.children.length > 16) tg.firstChild.remove();
    renderFb();
  }
  function renderFb() {
    if (!errs.length) return;
    const mean = errs.reduce((a, b) => a + b, 0) / errs.length;
    const inT = Math.round((errs.filter((e) => Math.abs(e) <= 35).length / errs.length) * 100);
    const msg = errs.length < 6 ? 'Continue…' : mean < -18 ? '⏩ Tu as tendance à presser : pose chaque coup, laisse venir le clic.' : mean > 18 ? '⏪ Tu traînes un peu : anticipe légèrement les coups.' : inT >= 80 ? '🎯 Excellent, tu es dans le temps !' : '👍 Bien centré, encore un peu de régularité.';
    q('.fb-msg').textContent = msg;
    q('.fb-stats').innerHTML = `<span>Dans le temps : <b>${inT}%</b></span><span>Décalage moyen : <b>${mean > 0 ? '+' : ''}${Math.round(mean)} ms</b></span>${extra ? `<span>Coups en trop : <b>${extra}</b></span>` : ''}`;
  }

  function bind() {
    q('.play').onclick = () => (clock ? stop() : start());
    q('.minus').onclick = () => setBpm(bpm - 2);
    q('.plus').onclick = () => setBpm(bpm + 2);
    q('.t-click').onclick = (e) => { opts.click = !opts.click; e.currentTarget.setAttribute('aria-pressed', opts.click); if (clock) clock.click = opts.click; };
    q('.t-synth').onclick = (e) => {
      if (det && !opts.synth) { toast("Coupe le micro pour entendre la guitare de l'appli."); return; }
      opts.synth = !opts.synth; e.currentTarget.setAttribute('aria-pressed', opts.synth);
    };
    q('.t-sub') && (q('.t-sub').onclick = (e) => { opts.sub = !opts.sub; e.currentTarget.setAttribute('aria-pressed', opts.sub); if (clock) clock.subClick = opts.sub; });
    q('.t-mic').onclick = async (e) => {
      const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
      e.currentTarget.setAttribute('aria-pressed', on);
      if (on) await micOn(); else micOff();
    };
    q('.ok') && (q('.ok').onclick = () => {
      const prevBest = bestTempo(c.id);
      logTempo(c.id, bpm);
      if (bpm >= c.target && prevBest < c.target) { confetti(); toast(`🎉 Objectif atteint : ${bpm} BPM !`); }
      else toast(`✓ ${bpm} BPM validé. On monte à ${bpm + c.inc} !`);
      setBpm(bpm + c.inc);
    });
    el.querySelectorAll('.pat-seg button').forEach((b) => b.onclick = () => {
      const wasRunning = !!clock; stop(); micOff();
      pattern = b.dataset.pat; render(); if (wasRunning) start();
    });
  }

  const api = { stop, destroy() { stop(); micOff(); }, start };
  render();
  if (c.mic) setTimeout(() => q('.feedback') && toast('Active « Micro » pour que l’appli écoute ton rythme.'), 400);
  return api;
}
