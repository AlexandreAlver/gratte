// Dictionnaire d'accords (guitare accordage standard)
// frets : de la corde de Mi grave (6e) à la corde de Mi aigu (1re). x = non jouée.
// fingers : 1 index, 2 majeur, 3 annulaire, 4 auriculaire, T pouce, 0 aucun.
// barre : { fret, from, to } (indices de cordes 0 = Mi grave … 5 = Mi aigu)
// bass : [[corde, case] fondamentale, [corde, case] basse alternée]
export const CHORDS = {
  C:      { frets: 'x32010', fingers: '032010', bass: [[1, 3], [0, 3]], tip: "Le Do : annulaire en case 3 sur la 5e corde, la 6e corde ne sonne pas." },
  Cadd9:  { frets: 'x32033', fingers: '021034', bass: [[1, 3], [0, 3]] },
  C7:     { frets: 'x32310', fingers: '032410', bass: [[1, 3], [0, 3]] },
  Cmaj7:  { frets: 'x32000', fingers: '032000', bass: [[1, 3], [0, 3]] },
  D:      { frets: 'xx0232', fingers: '000132', bass: [[2, 0], [1, 0]], tip: "Le Ré : on ne joue que les 4 cordes aiguës." },
  D7:     { frets: 'xx0212', fingers: '000213', bass: [[2, 0], [1, 0]] },
  Dm:     { frets: 'xx0231', fingers: '000231', bass: [[2, 0], [1, 0]] },
  Dsus4:  { frets: 'xx0233', fingers: '000134', bass: [[2, 0], [1, 0]] },
  Dsus2:  { frets: 'xx0230', fingers: '000130', bass: [[2, 0], [1, 0]] },
  'D/F#': { frets: '2x0232', fingers: 'T00132', bass: [[0, 2], [2, 0]], tip: "Ré avec Fa# à la basse : le pouce passe par-dessus le manche pour la 6e corde (ou joue juste un Ré)." },
  E:      { frets: '022100', fingers: '023100', bass: [[0, 0], [1, 2]] },
  E7:     { frets: '020100', fingers: '020100', bass: [[0, 0], [1, 2]] },
  Em:     { frets: '022000', fingers: '023000', bass: [[0, 0], [1, 2]] },
  Em7:    { frets: '022033', fingers: '012034', bass: [[0, 0], [1, 2]], tip: "Version « Wonderwall » : annulaire et auriculaire restent en case 3 sur les 2 cordes aiguës." },
  F:      { frets: '133211', fingers: '134211', barre: { fret: 1, from: 0, to: 5 }, bass: [[0, 1], [2, 3]], tip: "Le Fa barré : l'index couché sur toute la case 1, le pouce derrière le manche." },
  Fs:     { name: 'F', variant: 'petit barré', frets: 'xx3211', fingers: '003211', barre: { fret: 1, from: 4, to: 5 }, bass: [[2, 3], [3, 2]], tip: "Fa simplifié : l'index ne barre que les 2 cordes aiguës." },
  Fmaj7:  { frets: 'xx3210', fingers: '003210', bass: [[2, 3], [1, 0]], tip: "Fa 7M : la porte d'entrée idéale avant le Fa barré." },
  G:      { frets: '320003', fingers: '210003', bass: [[0, 3], [2, 0]] },
  G7:     { frets: '320001', fingers: '320001', bass: [[0, 3], [2, 0]] },
  Gw:     { name: 'G', variant: 'Wonderwall', frets: '320033', fingers: '210034', bass: [[0, 3], [2, 0]] },
  A:      { frets: 'x02220', fingers: '001230', bass: [[1, 0], [0, 0]] },
  A7:     { frets: 'x02020', fingers: '002030', bass: [[1, 0], [0, 0]] },
  Am:     { frets: 'x02210', fingers: '002310', bass: [[1, 0], [0, 0]], tip: "Le La mineur : même forme que le Mi majeur, décalée d'une corde." },
  Am7:    { frets: 'x02010', fingers: '002010', bass: [[1, 0], [0, 0]] },
  A7sus4: { frets: 'x02033', fingers: '001034', bass: [[1, 0], [0, 0]] },
  B:      { frets: 'x24442', fingers: '013331', barre: { fret: 2, from: 1, to: 5 }, bass: [[1, 2], [2, 4]] },
  B7:     { frets: 'x21202', fingers: '021304', bass: [[1, 2], [0, 2]] },
  Bm:     { frets: 'x24432', fingers: '013421', barre: { fret: 2, from: 1, to: 5 }, bass: [[1, 2], [2, 4]], tip: "Si mineur : forme de La mineur, barrée en case 2." },
  Bm7:    { frets: 'x24232', fingers: '013141', barre: { fret: 2, from: 1, to: 5 }, bass: [[1, 2], [2, 4]] },
  Bb:     { frets: 'x13331', fingers: '013331', barre: { fret: 1, from: 1, to: 5 }, bass: [[1, 1], [2, 3]] },
  Cm:     { frets: 'x35543', fingers: '013421', barre: { fret: 3, from: 1, to: 5 }, bass: [[1, 3], [2, 5]], tip: "Do mineur : la forme du Si mineur, glissée d'une case vers le corps." },
  'F#m':  { frets: '244222', fingers: '134111', barre: { fret: 2, from: 0, to: 5 }, bass: [[0, 2], [2, 4]] },
  'F#m7': { frets: '242222', fingers: '131111', barre: { fret: 2, from: 0, to: 5 }, bass: [[0, 2], [2, 4]] },
  G3:     { name: 'G', variant: 'barré case 3', frets: '355433', fingers: '134211', barre: { fret: 3, from: 0, to: 5 }, bass: [[0, 3], [2, 5]] },
  A5:     { name: 'A', variant: 'barré case 5', frets: '577655', fingers: '134211', barre: { fret: 5, from: 0, to: 5 }, bass: [[0, 5], [2, 7]] },
};

// Nom affiché (anglais) et nom français
const ROOT_FR = { C: 'Do', D: 'Ré', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
const QUAL_FR = [
  ['maj7', ' 7M'], ['m7', ' mineur 7'], ['m', ' mineur'], ['add9', ' add9'], ['sus4', ' sus4'], ['sus2', ' sus2'],
  ['7sus4', ' 7sus4'], ['7', ' 7'], ['', ' majeur'],
];
export function chordDef(id) { return CHORDS[id] || null; }
export function chordName(id) { const c = CHORDS[id]; return (c && c.name) || id; }
export function frenchName(id) {
  const name = chordName(id);
  const [main, bass] = name.split('/');
  const m = main.match(/^([A-G])([#b]?)(.*)$/);
  if (!m) return name;
  let fr = ROOT_FR[m[1]] + (m[2] === '#' ? ' dièse' : m[2] === 'b' ? ' bémol' : '');
  const q = m[3];
  const found = q === '7sus4' ? ' 7sus4' : (QUAL_FR.find(([k]) => k === q) || [null, ' ' + q])[1];
  fr += found;
  if (bass) { const b = bass.match(/^([A-G])([#b]?)/); fr += ' / basse ' + ROOT_FR[b[1]] + (b[2] === '#' ? '#' : b[2] === 'b' ? 'b' : ''); }
  const c = CHORDS[id];
  if (c?.variant) fr += ` (${c.variant})`;
  return fr;
}
export function parseFrets(s) { return [...s].map((ch) => (ch === 'x' ? null : parseInt(ch, 10))); }
export function fretsOf(id) { const c = CHORDS[id]; return c ? parseFrets(c.frets) : [null, null, null, null, null, null]; }
/** Corde la plus grave jouée (fondamentale) */
export function rootString(id) { const c = CHORDS[id]; if (c?.bass) return c.bass[0][0]; return fretsOf(id).findIndex((f) => f != null); }
