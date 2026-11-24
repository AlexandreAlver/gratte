// Synchronisation de la progression via Supabase (si configuré dans config.js)
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { getState, replaceState, subscribe } from './store.js';

let sb = null, user = null, pushTimer = null, lastPushed = 0, busy = false, lastError = null, lastSync = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(status()));
export const onSyncStatus = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const syncConfigured = () => !!(SUPABASE_URL && SUPABASE_ANON_KEY);
export const status = () => ({ configured: syncConfigured(), user, busy, lastError, lastSync });

async function client() {
  if (!syncConfigured()) return null;
  if (!sb) {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  return sb;
}

export async function initSync() {
  const c = await client();
  if (!c) return;
  const { data } = await c.auth.getSession();
  user = data.session?.user || null;
  c.auth.onAuthStateChange((_e, session) => {
    const was = user?.id; user = session?.user || null;
    if (user && user.id !== was) pull();
    emit();
  });
  if (user) await pull();
  subscribe(() => schedulePush());
  setInterval(() => { if (user && getState().updatedAt > lastPushed) push(); }, 60000);
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && user && getState().updatedAt > lastPushed) push(); });
  emit();
}

function schedulePush() { if (!user) return; clearTimeout(pushTimer); pushTimer = setTimeout(push, 4000); }

export async function push() {
  const c = await client(); if (!c || !user) return;
  try {
    busy = true; emit();
    const s = getState();
    const { error } = await c.from('progress').upsert({ user_id: user.id, data: s, updated_at: new Date().toISOString() });
    if (error) throw error;
    lastPushed = s.updatedAt; lastSync = new Date(); lastError = null;
  } catch (e) { lastError = e.message || String(e); }
  busy = false; emit();
}

export async function pull() {
  const c = await client(); if (!c || !user) return;
  try {
    busy = true; emit();
    const { data, error } = await c.from('progress').select('data').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    if (data?.data) replaceState(merge(getState(), data.data));
    lastError = null;
  } catch (e) { lastError = e.message || String(e); }
  busy = false; emit();
  await push();
}

export async function signIn(email, password) {
  const c = await client();
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
export async function signUp(email, password) {
  const c = await client();
  const { data, error } = await c.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
  if (error) throw error;
  return !!data.session; // false = confirmation par e-mail nécessaire
}
export async function signOut() { const c = await client(); await c.auth.signOut(); user = null; emit(); }

// ---------- Fusion de deux états (local + distant) ----------
const later = (a, b) => ((a?.updatedAt || 0) >= (b?.updatedAt || 0) ? a : b);
function mergeHistory(a = [], b = []) {
  const seen = new Set(); const out = [];
  for (const h of [...a, ...b]) { const k = JSON.stringify(h); if (!seen.has(k)) { seen.add(k); out.push(h); } }
  return out.sort((x, y) => (x.d < y.d ? -1 : x.d > y.d ? 1 : 0));
}
export function merge(a, b) {
  const out = { ...a, updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0) };
  out.settings = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a.settings : { ...b.settings, latencyMs: a.settings.latencyMs, clickLevel: a.settings.clickLevel };
  out.lessons = {};
  for (const id of new Set([...Object.keys(a.lessons || {}), ...Object.keys(b.lessons || {})])) {
    const x = a.lessons?.[id], y = b.lessons?.[id];
    if (x?.status === 'done' && y?.status !== 'done') out.lessons[id] = x;
    else if (y?.status === 'done' && x?.status !== 'done') out.lessons[id] = y;
    else out.lessons[id] = later(x, y) || x || y;
  }
  out.exercises = {};
  for (const id of new Set([...Object.keys(a.exercises || {}), ...Object.keys(b.exercises || {})])) {
    const x = a.exercises?.[id] || { best: 0, history: [] }, y = b.exercises?.[id] || { best: 0, history: [] };
    out.exercises[id] = { best: Math.max(x.best || 0, y.best || 0), history: mergeHistory(x.history, y.history).slice(-200) };
  }
  out.changes = {};
  for (const p of new Set([...Object.keys(a.changes || {}), ...Object.keys(b.changes || {})])) out.changes[p] = mergeHistory(a.changes?.[p], b.changes?.[p]);
  out.practice = { ...(b.practice || {}) };
  for (const [k, v] of Object.entries(a.practice || {})) out.practice[k] = Math.max(v, out.practice[k] || 0);
  out.songs = {};
  for (const id of new Set([...Object.keys(a.songs || {}), ...Object.keys(b.songs || {})])) out.songs[id] = later(a.songs?.[id], b.songs?.[id]) || a.songs?.[id] || b.songs?.[id];
  return out;
}
