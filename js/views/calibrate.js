import { OnsetDetector } from '../audio/mic.js';
import { audio, click } from '../audio/engine.js';
import { getState, update } from '../store.js';
import { icon, toast } from '../util.js';

export function render(el) {
  let det = null, timers = [];
  const s = getState().settings;
  el.innerHTML = `<a class="back" href="#/outils">${icon('left', 18)} Outils</a>
  <div class="page-head"><div><div class="eyebrow">Écoute du rythme</div><h1>Calibrer le micro</h1>
  <p class="muted" style="margin-top:8px">Chaque téléphone met quelques millisecondes à jouer un son et à capter le micro. On mesure ce délai pour que l'appli juge ton timing de façon juste. Ça prend 30 secondes.</p></div></div>
  <div class="card">
    <div class="row between"><b>État</b><span class="chip ${s.latencyMs != null ? 'good' : 'warn'} st">${s.latencyMs != null ? `Calibré : ${Math.round(s.latencyMs)} ms` : 'Non calibré'}</span></div>
    <hr class="sep">
    <ol class="steps-list">
      <li><b>Silence</b><p>Pose ta guitare. L'appli joue 6 clics et mesure le bruit qu'ils font dans le micro.</p></li>
      <li><b>Coups sur le clic</b><p>Étouffe les cordes avec la main gauche et donne un coup sec vers le bas <b>pile sur chaque clic</b> (12 clics).</p></li>
    </ol>
    <div class="changes-timer phase" style="font-size:40px">Prêt ?</div>
    <div class="level"><i></i></div>
    <div class="row" style="justify-content:center;margin-top:16px"><button class="btn primary big go">${icon('mic', 20)} Lancer la calibration</button></div>
    <p class="tiny muted center" style="margin-top:10px">Avec des écouteurs filaires, la mesure est encore plus fiable.</p>
  </div>
  <div class="card" style="margin-top:16px">
    <b>Sensibilité du micro</b><p class="small muted">Augmente si des coups ne sont pas détectés, baisse si des bruits parasites sont comptés.</p>
    <input type="range" class="sens" min="0.5" max="2" step="0.1" value="${s.sensitivity || 1}">
    <div class="row between tiny muted"><span>Peu sensible</span><span>Très sensible</span></div>
  </div>`;
  const q = (x) => el.querySelector(x);
  const phase = (t) => { q('.phase').textContent = t; };
  q('.sens').oninput = (e) => update((st) => { st.settings.sensitivity = Number(e.target.value); }, { quiet: true });

  q('.go').onclick = async () => {
    q('.go').disabled = true;
    const c = audio();
    const energies = [], onsets = [];
    let mode = 'silence';
    det = new OnsetDetector((t, e) => { if (mode === 'silence') energies.push(e); else onsets.push(t); },
      (lv) => { q('.level i').style.width = Math.min(100, Math.sqrt(lv) * 600) + '%'; });
    try { await det.start({ k: 3, floor: 0.00003 }); }
    catch (e) { toast(e.name === 'NotAllowedError' ? 'Accès au micro refusé.' : e.message); q('.go').disabled = false; return; }

    // Phase 1 : silence
    phase('🤫 Silence…');
    const iv = 60 / 80;
    let t0 = c.currentTime + 0.4;
    for (let i = 0; i < 6; i++) click(t0 + i * iv, i === 0 ? 'accent' : 'beat');
    await wait((0.4 + 6 * iv + 0.4) * 1000);
    const clickLevel = energies.length ? Math.max(...energies) : 0;
    det.set({ k: 4, floor: Math.max(0.00015, clickLevel * 1.6) });

    // Phase 2 : coups sur le clic
    mode = 'play';
    phase('🎸 Prépare-toi…');
    await wait(1200);
    t0 = c.currentTime + 0.3;
    const clicks = [];
    for (let i = 0; i < 12; i++) { click(t0 + i * iv, i % 4 === 0 ? 'accent' : 'beat'); clicks.push(t0 + i * iv); }
    for (let i = 0; i < 12; i++) timers.push(setTimeout(() => phase(`${i + 1} / 12`), (0.3 + i * iv) * 1000));
    await wait((0.3 + 12 * iv + 0.5) * 1000);
    det.stop(); det = null;

    const offs = [];
    for (const t of onsets) {
      let best = null; for (const k of clicks.slice(2)) if (best == null || Math.abs(t - k) < Math.abs(t - best)) best = k;
      const d = t - best; if (Math.abs(d) < 0.3) offs.push(d);
    }
    if (offs.length < 5) {
      phase('Raté 😕'); toast(`Seulement ${offs.length} coups détectés : joue plus fort ou augmente la sensibilité, puis recommence.`, 4000);
    } else {
      offs.sort((a, b) => a - b);
      const med = offs[offs.length >> 1] * 1000;
      update((st) => { st.settings.latencyMs = med; st.settings.clickLevel = clickLevel; });
      phase(`✓ ${Math.round(med)} ms`);
      q('.st').textContent = `Calibré : ${Math.round(med)} ms`; q('.st').className = 'chip good st';
      toast('Calibration enregistrée !');
    }
    q('.go').disabled = false;
  };
  return () => { det?.stop(); timers.forEach(clearTimeout); };
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
