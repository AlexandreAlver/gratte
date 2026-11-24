// Tablature en SVG : 6 lignes (Mi aigu en haut), numéros de case, flèches de grattage
import { eventFor, barChords, isPicking, countLabel } from '../music.js';
import { chordName } from '../data/chords.js';
import { esc } from '../util.js';

const SN = ['E', 'A', 'D', 'G', 'B', 'e']; // index 0 = Mi grave

/**
 * bars : tableau de mesures ("G", "G D", null)
 * pattern : motif d'une mesure (longueur = beats*steps)
 */
export function tabSVG(bars, pattern, { steps = 2, beats = 4, colW = 26, showCount = true, idPrefix = 't' } = {}) {
  const picking = isPicking(pattern);
  const spb = pattern.length;
  const left = 22, top = showCount ? 62 : 46, gap = 15;
  const barW = spb * colW + 14;
  const W = left + bars.length * barW + 4;
  const H = top + gap * 5 + 22;
  const y = (s) => top + (5 - s) * gap;
  let s = `<svg class="tab-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tablature">`;
  for (let i = 0; i < 6; i++) {
    s += `<text class="sn" x="4" y="${y(i) + 4}">${SN[i]}</text>`;
    s += `<line class="ln" x1="${left}" x2="${W - 4}" y1="${y(i)}" y2="${y(i)}"/>`;
  }
  bars.forEach((bar, b) => {
    const bx = left + b * barW;
    s += `<line class="bar" x1="${bx}" x2="${bx}" y1="${y(5)}" y2="${y(0)}"/>`;
    const chords = barChords(bar);
    chords.forEach((cid, k) => {
      if (!cid) return;
      const cx = bx + 10 + (k * spb * colW) / chords.length;
      s += `<text class="cn" x="${cx}" y="13">${esc(chordName(cid))}</text>`;
    });
    for (let st = 0; st < spb; st++) {
      const cx = bx + 10 + st * colW + colW / 2;
      const cid = chords[Math.min(chords.length - 1, Math.floor((st / spb) * chords.length))];
      const tok = pattern[st];
      const ev = eventFor(cid, tok, picking);
      s += `<rect class="hl" data-col="${idPrefix}-${b}-${st}" x="${cx - colW / 2 + 1}" y="20" width="${colW - 2}" height="${H - 22}" rx="5"/>`;
      if (ev.kind === 'strum') s += `<text class="ar" x="${cx}" y="${top - 12}" text-anchor="middle">${ev.mute ? '✕' : ev.dir === 'u' ? '↑' : '↓'}${ev.accent ? '>' : ''}</text>`;
      if (showCount) s += `<text class="cnt" x="${cx}" y="34" text-anchor="middle">${countLabel(st, steps, beats)}</text>`;
      ev.col.forEach((v, i) => {
        if (v == null) return;
        const cls = v === 'x' ? 'num x' : ev.bass ? 'num b' : 'num';
        const tw = v.length > 1 ? 15 : 10;
        s += `<rect class="num-bg" x="${cx - tw / 2}" y="${y(i) - 7}" width="${tw}" height="14"/>`;
        s += `<text class="${cls}" x="${cx}" y="${y(i) + 4.5}" text-anchor="middle">${esc(v)}</text>`;
      });
      if (ev.palm) s += `<text class="cnt" x="${cx}" y="${y(0) + 16}" text-anchor="middle">PM</text>`;
    }
  });
  s += `<line class="bar" x1="${W - 4}" x2="${W - 4}" y1="${y(5)}" y2="${y(0)}"/>`;
  return s + '</svg>';
}

/** Tablature d'un accord isolé, joué une fois (de la basse vers l'aigu) */
export function chordTab(id) { return tabSVG([id], '6543 21'.replace(' ', ''), { steps: 1, beats: 6, showCount: false }); }
