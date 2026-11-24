import { icon } from '../util.js';

export function render(el) {
  const item = (href, ic, t, s) => `<a class="li" href="${href}"><div class="ico">${icon(ic)}</div><div class="t"><b>${t}</b><span>${s}</span></div>${icon('right', 18)}</a>`;
  el.innerHTML = `<div class="page-head"><div><div class="eyebrow">Boîte à outils</div><h1>Outils</h1></div></div>
  <div class="list">
    ${item('#/accordeur', 'tuner', 'Accordeur', 'Accordage standard, avec le micro du téléphone')}
    ${item('#/metronome', 'metronome', 'Métronome', 'Tempo réglable, accent sur le 1, taper le tempo')}
    ${item('#/accords', 'grid', 'Dictionnaire d\'accords', 'Schémas, tablatures, sons')}
    ${item('#/calibrer', 'mic', 'Calibrer l\'écoute du rythme', 'Pour que le micro mesure ton timing avec précision')}
  </div>
  <div class="list" style="margin-top:16px">
    ${item('#/reglages', 'settings', 'Réglages et synchronisation', 'Notation, objectif, compte, sauvegarde')}
  </div>`;
}
