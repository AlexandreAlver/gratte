// Schéma d'accord en SVG (manche vertical, Mi grave à gauche)
import { CHORDS, parseFrets, chordName, frenchName } from '../data/chords.js';
import { esc } from '../util.js';
import { getState } from '../store.js';

export function chordSVG(id, w = 96) {
  const c = CHORDS[id];
  if (!c) return `<div class="tiny muted">${esc(id)} ?</div>`;
  const frets = parseFrets(c.frets);
  const fingers = [...(c.fingers || '000000')];
  const played = frets.filter((f) => f != null && f > 0);
  const max = played.length ? Math.max(...played) : 0;
  const base = max > 4 ? Math.min(...played) : 1;
  const nF = 4;
  const x0 = 20, dx = 13, y0 = 24, dy = 19;
  const W = x0 + dx * 5 + 16, H = y0 + dy * nF + 8;
  const xs = (i) => x0 + i * dx;
  let s = `<svg class="chord-svg" width="${w}" height="${(w * H) / W}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Schéma de l'accord ${esc(chordName(id))}">`;
  // cases
  for (let f = 0; f <= nF; f++) s += `<line class="fret" x1="${x0}" x2="${xs(5)}" y1="${y0 + f * dy}" y2="${y0 + f * dy}" stroke-width="1.4"/>`;
  if (base === 1) s += `<rect class="nut" x="${x0 - 1}" y="${y0 - 4}" width="${dx * 5 + 2}" height="5" rx="1.5"/>`;
  else s += `<text class="basefret" x="${x0 - 6}" y="${y0 + dy * 0.62}" text-anchor="end">${base}</text>`;
  // cordes
  for (let i = 0; i < 6; i++) s += `<line class="str" x1="${xs(i)}" x2="${xs(i)}" y1="${y0}" y2="${y0 + nF * dy}" stroke-width="${1.6 - i * 0.12}"/>`;
  // cordes à vide / étouffées
  frets.forEach((f, i) => {
    const x = xs(i), y = y0 - 12;
    if (f == null) s += `<path class="mute" d="M${x - 3.5} ${y - 3.5}l7 7M${x + 3.5} ${y - 3.5}l-7 7"/>`;
    else if (f === 0) s += `<circle class="open" cx="${x}" cy="${y}" r="4"/>`;
  });
  // barré
  if (c.barre) {
    const y = y0 + (c.barre.fret - base + 0.5) * dy;
    s += `<rect class="dot" x="${xs(c.barre.from) - 6.5}" y="${y - 6.5}" width="${xs(c.barre.to) - xs(c.barre.from) + 13}" height="13" rx="6.5"/>`;
    s += `<text class="dot-t" x="${(xs(c.barre.from) + xs(c.barre.to)) / 2}" y="${y + 3.6}" text-anchor="middle">1</text>`;
  }
  // doigts
  frets.forEach((f, i) => {
    if (f == null || f === 0) return;
    if (c.barre && f === c.barre.fret && i >= c.barre.from && i <= c.barre.to && fingers[i] === '1') return;
    const y = y0 + (f - base + 0.5) * dy;
    s += `<circle class="dot" cx="${xs(i)}" cy="${y}" r="6.5"/>`;
    if (fingers[i] && fingers[i] !== '0') s += `<text class="dot-t" x="${xs(i)}" y="${y + 3.6}" text-anchor="middle">${fingers[i]}</text>`;
  });
  return s + '</svg>';
}

export function chordLabel(id) {
  const n = getState().settings.notation;
  const en = chordName(id), fr = frenchName(id);
  if (n === 'fr') return { main: fr.replace(' majeur', ''), sub: '' };
  if (n === 'en') return { main: en, sub: CHORDS[id]?.variant || '' };
  return { main: en, sub: fr };
}

export function chordCard(id, w = 84) {
  const l = chordLabel(id);
  return `<div class="chord-card" data-chord="${esc(id)}" title="Écouter l'accord">
    <div class="name">${esc(l.main)}</div><div class="fr">${esc(l.sub) || '&nbsp;'}</div>${chordSVG(id, w)}</div>`;
}

export function chordsRow(ids, w = 84) {
  const uniq = [...new Set(ids.filter(Boolean))];
  return `<div class="chords-row">${uniq.map((id) => chordCard(id, w)).join('')}</div>`;
}
