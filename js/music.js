// Interprétation des motifs rythmiques
// Grattage : d = bas, u = haut, D/U = accentué, . = main dans le vide, x = étouffé (chuck), p = palm mute (bas)
// Picking : B = basse (fondamentale), A = basse alternée, 1-6 = numéro de corde (1 = Mi aigu, 6 = Mi grave)
// Dans un motif avec basses (B/A), d/u ne grattent que les cordes aiguës.
import { fretsOf, chordDef, rootString } from './data/chords.js';

export const isPicking = (pattern) => /[BA1-6]/.test(pattern);

/** Décompose une mesure "G D" → ['G','D'] ; null/'' → [null] */
export function barChords(bar) { if (!bar) return [null]; return String(bar).trim().split(/\s+/); }

/** Accord joué à un pas donné de la mesure */
export function chordAtStep(bar, inBar, stepsPerBar) {
  const list = barChords(bar);
  const idx = Math.min(list.length - 1, Math.floor((inBar / stepsPerBar) * list.length));
  return list[idx];
}

/** Calcule ce qu'il faut jouer (et afficher) pour un token donné */
export function eventFor(chordId, token, picking) {
  const frets = chordId ? fretsOf(chordId) : [null, null, null, null, null, null];
  const col = [null, null, null, null, null, null];
  if (!token || token === '.' || token === ' ') return { kind: 'air', col };
  if ('dDuUxp'.includes(token)) {
    const dir = token.toLowerCase() === 'u' ? 'u' : 'd';
    let strings = [0, 1, 2, 3, 4, 5].filter((i) => frets[i] != null);
    if (!chordId) strings = [0, 1, 2, 3, 4, 5];
    const root = chordId ? rootString(chordId) : 0;
    if (picking) strings = strings.filter((i) => i >= (dir === 'u' ? 3 : 2));
    else if (dir === 'u') strings = strings.filter((i) => i >= Math.max(2, root + 1));
    else strings = strings.filter((i) => i >= root);
    const mute = token === 'x';
    const palm = token === 'p';
    for (const i of strings) col[i] = mute || !chordId ? 'x' : String(frets[i]);
    return { kind: 'strum', dir, accent: token === 'D' || token === 'U', mute, palm, strings, frets: chordId ? frets : frets.map(() => 0), col };
  }
  if (token === 'B' || token === 'A') {
    const def = chordDef(chordId);
    const pair = def?.bass?.[token === 'B' ? 0 : 1] || [rootString(chordId), frets[rootString(chordId)] ?? 0];
    col[pair[0]] = String(pair[1]);
    return { kind: 'note', string: pair[0], fret: pair[1], col, bass: true };
  }
  if (/[1-6]/.test(token)) {
    const s = 6 - parseInt(token, 10);
    const f = frets[s];
    if (f == null) return { kind: 'air', col };
    col[s] = String(f);
    return { kind: 'note', string: s, fret: f, col };
  }
  return { kind: 'air', col };
}

/** Libellé de comptage d'un pas */
export function countLabel(inBar, steps, beats) {
  const beat = Math.floor(inBar / steps) + 1, sub = inBar % steps;
  if (steps === 1) return String(beat);
  if (steps === 2) return sub === 0 ? String(beat) : '&';
  if (steps === 3) { // 6/8 : on compte 1 2 3 4 5 6
    return String(inBar + 1);
  }
  return sub === 0 ? String(beat) : ['', 'i', '&', 'a'][sub];
}

/** Description lisible d'un token, pour l'affichage dans les cases */
export function tokenView(token, inBar, steps) {
  const pend = inBar % 2 === 0 ? '↓' : '↑';
  switch (token) {
    case 'd': return { a: '↓', cls: 'hit' };
    case 'D': return { a: '↓', cls: 'hit acc' };
    case 'u': return { a: '↑', cls: 'hit' };
    case 'U': return { a: '↑', cls: 'hit acc' };
    case 'x': return { a: '✕', cls: 'hit', lbl: 'étouffé' };
    case 'p': return { a: '↓', cls: 'hit', lbl: 'PM' };
    case 'B': return { a: 'P', cls: 'hit', lbl: 'basse' };
    case 'A': return { a: 'P', cls: 'hit', lbl: 'b. alt' };
    case '1': return { a: 'a', cls: 'hit', lbl: 'c. 1' };
    case '2': return { a: 'm', cls: 'hit', lbl: 'c. 2' };
    case '3': return { a: 'i', cls: 'hit', lbl: 'c. 3' };
    case '4': return { a: 'P', cls: 'hit', lbl: 'c. 4' };
    case '5': return { a: 'P', cls: 'hit', lbl: 'c. 5' };
    case '6': return { a: 'P', cls: 'hit', lbl: 'c. 6' };
    default: return { a: steps === 3 ? '·' : pend, cls: 'air' };
  }
}

/** Texte « Bas – Bas Haut – … » du motif */
export function patternWords(pattern) {
  const W = { d: 'B', D: 'B>', u: 'H', U: 'H>', x: '✕', p: 'PM', '.': '·', B: 'P', A: 'P', 1: 'a', 2: 'm', 3: 'i', 4: 'P', 5: 'P', 6: 'P' };
  return [...pattern].map((t) => W[t] ?? '·').join(' ');
}
