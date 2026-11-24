// État de l'application, sauvegardé localement (et synchronisé si Supabase est configuré)
import { dayKey, parseDay, addDays, mondayOf } from './util.js';

const KEY = 'gratte:v1';
const listeners = new Set();

export function defaults() {
  return {
    version: 1,
    updatedAt: 0,
    settings: { notation: 'both', weeklyGoal: 120, latencyMs: null, clickLevel: null, theme: 'auto', volume: 0.85, sensitivity: 1 },
    lessons: {},     // id -> { status, step, startedAt, completedAt, ratings, updatedAt }
    exercises: {},   // id -> { best, history: [{ d, bpm }] }
    changes: {},     // 'G>D' -> [{ d, n }]
    practice: {},    // 'YYYY-MM-DD' -> secondes
    songs: {},       // id -> { status: 'unlocked'|'learning'|'mastered', lyrics, steps: {}, best, updatedAt }
  };
}

function normalize(s) {
  const d = defaults();
  s = s && typeof s === 'object' ? s : {};
  return {
    ...d, ...s,
    settings: { ...d.settings, ...(s.settings || {}) },
    lessons: s.lessons || {}, exercises: s.exercises || {}, changes: s.changes || {},
    practice: s.practice || {}, songs: s.songs || {},
  };
}

function load() {
  try { return normalize(JSON.parse(localStorage.getItem(KEY))); } catch { return defaults(); }
}

let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* stockage indisponible */ }
}

export const getState = () => state;
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function update(fn, { quiet = false } = {}) {
  fn(state);
  state.updatedAt = Date.now();
  save();
  if (!quiet) listeners.forEach((l) => l(state));
}
export function replaceState(s) { state = normalize(s); save(); listeners.forEach((l) => l(state)); }

// ---------- Leçons ----------
export function lessonState(id) { return state.lessons[id] || { status: 'new', step: 0 }; }
export function setLessonStep(id, step) {
  update((s) => {
    const l = s.lessons[id] || { status: 'new', step: 0 };
    l.step = step;
    if (l.status === 'new') { l.status = 'progress'; l.startedAt = Date.now(); }
    l.updatedAt = Date.now();
    s.lessons[id] = l;
  }, { quiet: true });
}
export function completeLesson(id, ratings, songIds = []) {
  update((s) => {
    const l = s.lessons[id] || {};
    l.status = 'done'; l.completedAt = l.completedAt || Date.now(); l.ratings = ratings; l.step = 0; l.updatedAt = Date.now();
    s.lessons[id] = l;
    for (const sid of songIds) unlockSongIn(s, sid);
  });
}
export function nextLessonId(lessons) {
  const firstOpen = lessons.find((l) => lessonState(l.id).status !== 'done');
  return firstOpen ? firstOpen.id : null;
}

// ---------- Exercices / tempo ----------
export function logTempo(exId, bpm) {
  update((s) => {
    const e = s.exercises[exId] || { best: 0, history: [] };
    e.history.push({ d: dayKey(), bpm });
    if (e.history.length > 200) e.history = e.history.slice(-200);
    e.best = Math.max(e.best || 0, bpm);
    s.exercises[exId] = e;
  });
}
export const bestTempo = (exId) => state.exercises[exId]?.best || 0;
export function logChanges(pair, n) {
  update((s) => { (s.changes[pair] ||= []).push({ d: dayKey(), n }); });
}

// ---------- Morceaux ----------
function unlockSongIn(s, id) {
  if (!s.songs[id]) s.songs[id] = { status: 'unlocked', steps: {}, updatedAt: Date.now() };
}
export function songState(id) { return state.songs[id] || null; }
export function setSong(id, patch) {
  update((s) => { s.songs[id] = { status: 'unlocked', steps: {}, ...(s.songs[id] || {}), ...patch, updatedAt: Date.now() }; });
}

// ---------- Temps de pratique ----------
export function addPractice(sec) {
  update((s) => { const k = dayKey(); s.practice[k] = (s.practice[k] || 0) + sec; }, { quiet: true });
}
const MIN_DAY = 5 * 60; // 5 minutes = un jour de pratique
export function streak() {
  let d = new Date();
  if ((state.practice[dayKey(d)] || 0) < MIN_DAY) d = addDays(d, -1);
  let n = 0;
  while ((state.practice[dayKey(d)] || 0) >= MIN_DAY) { n++; d = addDays(d, -1); }
  return n;
}
export function bestStreak() {
  const days = Object.keys(state.practice).filter((k) => state.practice[k] >= MIN_DAY).sort();
  let best = 0, cur = 0, prev = null;
  for (const k of days) {
    const d = parseDay(k);
    cur = prev && dayKey(addDays(prev, 1)) === k ? cur + 1 : 1;
    best = Math.max(best, cur); prev = d;
  }
  return best;
}
export function weekSeconds(offset = 0) {
  const mon = addDays(mondayOf(), -7 * offset);
  let t = 0;
  for (let i = 0; i < 7; i++) t += state.practice[dayKey(addDays(mon, i))] || 0;
  return t;
}
export function weekDays() {
  const mon = mondayOf();
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(mon, i); const k = dayKey(d);
    return { k, sec: state.practice[k] || 0, today: k === dayKey(), future: d > new Date() };
  });
}
export const totalSeconds = () => Object.values(state.practice).reduce((a, b) => a + b, 0);
