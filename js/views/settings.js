import { getState, update, replaceState } from '../store.js';
import { setVolume } from '../audio/engine.js';
import { syncConfigured, status, onSyncStatus, signIn, signUp, signOut, pull } from '../sync.js';
import { icon, esc, toast } from '../util.js';
import { applyTheme } from '../app.js';

export function render(el) {
  const s = getState().settings;
  const seg = (name, opts, val) => `<div class="seg" data-set="${name}">${opts.map(([v, t]) => `<button data-v="${v}" aria-pressed="${String(v) === String(val)}">${t}</button>`).join('')}</div>`;
  el.innerHTML = `<a class="back" href="#/outils">${icon('left', 18)} Outils</a>
  <div class="page-head"><div><div class="eyebrow">Réglages</div><h1>Réglages</h1></div></div>
  <div class="card stack">
    <div><b>Nom des accords</b><div style="margin-top:8px">${seg('notation', [['both', 'Am (La mineur)'], ['en', 'Am'], ['fr', 'La mineur']], s.notation)}</div></div>
    <div><b>Objectif hebdomadaire</b><div style="margin-top:8px">${seg('weeklyGoal', [[60, '1 h'], [120, '2 h'], [180, '3 h'], [300, '5 h']], s.weeklyGoal)}</div>
      <p class="tiny muted" style="margin-top:6px">Conseil : 20 à 30 minutes par jour valent mieux qu'une longue séance par semaine.</p></div>
    <div><b>Thème</b><div style="margin-top:8px">${seg('theme', [['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']], s.theme)}</div></div>
    <div><b>Volume de l'appli</b><input type="range" class="vol" min="0.2" max="1" step="0.05" value="${s.volume}"></div>
  </div>

  <div class="section"><div class="section-title">${icon('cloud', 20)} Synchronisation</div><div class="card sync"></div></div>

  <div class="section"><div class="section-title">${icon('download', 20)} Sauvegarde</div>
    <div class="card"><p class="small muted">Exporte ta progression dans un fichier (pour la garder ou la transférer sans compte).</p>
    <div class="row wrap"><button class="btn exp">${icon('download', 18)} Exporter</button><label class="btn ghost">${icon('upload', 18)} Importer<input type="file" accept="application/json" class="imp" hidden></label></div></div>
  </div>
  <p class="tiny muted center" style="margin-top:24px">Gratte · cours de guitare folk · les vidéos appartiennent à leurs auteurs (YouTube).</p>`;

  el.querySelectorAll('[data-set]').forEach((g) => g.querySelectorAll('button').forEach((b) => b.onclick = () => {
    const k = g.dataset.set; const v = isNaN(Number(b.dataset.v)) ? b.dataset.v : Number(b.dataset.v);
    update((st) => { st.settings[k] = v; });
    g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    if (k === 'theme') applyTheme();
  }));
  el.querySelector('.vol').oninput = (e) => { const v = Number(e.target.value); setVolume(v); update((st) => { st.settings.volume = v; }, { quiet: true }); };
  el.querySelector('.exp').onclick = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 1)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `gratte-progression-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  el.querySelector('.imp').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const data = JSON.parse(await f.text()); if (!data.settings) throw new Error(); replaceState(data); toast('Progression importée ✓'); render(el); }
    catch { toast("Ce fichier n'est pas une sauvegarde Gratte."); }
  };

  const box = el.querySelector('.sync');
  const drawSync = () => {
    const st = status();
    if (!syncConfigured()) {
      box.innerHTML = `<p><b>Pas encore activée.</b> Ta progression est enregistrée sur cet appareil.</p>
      <p class="small muted">Pour retrouver la même progression sur ton téléphone et ton ordinateur, il faut créer un projet Supabase gratuit puis renseigner <code>js/config.js</code>. Les étapes sont dans le fichier README.md du projet.</p>`;
      return;
    }
    if (st.user) {
      box.innerHTML = `<div class="row between wrap"><div><b>${icon('check', 16)} Connecté</b><div class="small muted">${esc(st.user.email)}</div></div>
        <span class="chip ${st.lastError ? 'warn' : 'good'}">${st.busy ? 'Synchro…' : st.lastError ? 'Erreur' : st.lastSync ? 'À jour' : 'Connecté'}</span></div>
        ${st.lastError ? `<p class="small" style="color:var(--bad);margin-top:8px">${esc(st.lastError)}</p>` : ''}
        <div class="row wrap" style="margin-top:12px"><button class="btn now">${icon('refresh', 18)} Synchroniser</button><button class="btn ghost out">Se déconnecter</button></div>`;
      box.querySelector('.now').onclick = () => pull();
      box.querySelector('.out').onclick = () => signOut();
      return;
    }
    box.innerHTML = `<p class="small muted">Connecte-toi pour retrouver ta progression sur tous tes appareils.</p>
      <label class="field"><span>E-mail</span><input type="email" class="em" autocomplete="email"></label>
      <label class="field"><span>Mot de passe (6 caractères min.)</span><input type="password" class="pw" autocomplete="current-password"></label>
      <div class="row wrap"><button class="btn primary in">Se connecter</button><button class="btn ghost up">Créer un compte</button></div>
      <p class="small err" style="color:var(--bad);margin-top:8px"></p>`;
    const go = (fn) => async () => {
      const em = box.querySelector('.em').value.trim(), pw = box.querySelector('.pw').value;
      box.querySelector('.err').textContent = '';
      try { const r = await fn(em, pw); if (fn === signUp && r === false) toast('Compte créé : confirme ton adresse e-mail puis connecte-toi.', 5000); }
      catch (e) { box.querySelector('.err').textContent = e.message; }
    };
    box.querySelector('.in').onclick = go(signIn);
    box.querySelector('.up').onclick = go(signUp);
  };
  drawSync();
  return onSyncStatus(drawSync);
}
