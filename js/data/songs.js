// Répertoire : grilles d'accords (mesure par mesure), rythme et conseils.
// Les paroles ne sont pas incluses (droits d'auteur) : tu peux coller les tiennes dans l'appli.
// bars : une chaîne par mesure ; "G D" = deux accords dans la même mesure.
export const SONGS = [
  {
    id: 'knockin', title: "Knockin' on Heaven's Door", artist: 'Bob Dylan', year: 1973, style: 'Folk', lesson: 1, level: 1,
    key: 'Sol', capo: 0, bpm: 69, beats: 4, steps: 2, pattern: 'd.d.d.d.', patternName: 'Noires : 4 coups vers le bas',
    altPattern: 'd.dud.du', video: 'knockin', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['G', 'D', 'Am', 'Am', 'G', 'D', 'C', 'C'] },
      refrain: { name: 'Refrain', bars: ['G', 'D', 'Am', 'Am', 'G', 'D', 'C', 'C'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain', 'refrain'],
    hard: [['D', 'Am'], ['D', 'C']],
    tips: [
      "Toute la chanson tourne sur la même grille de 8 mesures : une fois qu'elle est en place, tu connais le morceau.",
      "Compte « 1 2 3 4 » à voix haute et change d'accord pile sur le « 1 ».",
      "Le Am et le C durent 2 mesures : profites-en pour respirer et préparer le G.",
    ],
  },
  {
    id: 'standbyme', title: 'Stand By Me', artist: 'Ben E. King', year: 1961, style: 'Pop / rock', lesson: 2, level: 1,
    key: 'Sol (original en La : capo 2)', capo: 0, bpm: 118, beats: 4, steps: 2, pattern: 'd.d.dudu', patternName: 'Noire, noire, croches',
    video: 'standbyme', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['G', 'G', 'Em', 'Em', 'C', 'D', 'G', 'G'] },
      refrain: { name: 'Refrain', bars: ['G', 'G', 'Em', 'Em', 'C', 'D', 'G', 'G'] },
    },
    structure: ['couplet', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['G', 'Em'], ['C', 'D']],
    tips: [
      "C'est la progression « I – vi – IV – V », la plus célèbre de la pop : tu la retrouveras partout.",
      "Pour jouer avec le disque, place un capodastre en case 2 (les formes d'accords restent les mêmes).",
      "Le C et le D ne durent qu'une mesure chacun : prépare le D dès le « 4 & » du C.",
    ],
  },
  {
    id: 'badmoon', title: 'Bad Moon Rising', artist: 'Creedence Clearwater Revival', year: 1969, style: 'Pop / rock', lesson: 3, level: 2,
    key: 'Ré', capo: 0, bpm: 90, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH', bpmNote: "Le morceau est à 180 en noires : on le compte ici « à moitié » (90) avec des croches.",
    video: 'badmoon', confidence: 'medium',
    sections: {
      couplet: { name: 'Couplet', bars: ['D', 'A G', 'D', 'D', 'D', 'A G', 'D', 'D'] },
      refrain: { name: 'Refrain', bars: ['G', 'G', 'D', 'D', 'A', 'G', 'D', 'D'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain', 'refrain'],
    hard: [['A', 'G'], ['D', 'A']],
    tips: [
      "La mesure « A G » est la plus piégeuse : 2 temps de La, 2 temps de Sol. Entraîne-la seule en boucle.",
      "Garde la main droite en mouvement constant même pendant les changements rapides.",
    ],
  },
  {
    id: 'zombie', title: 'Zombie', artist: 'The Cranberries', year: 1994, style: 'Pop / rock', lesson: 4, level: 2,
    key: 'Mi mineur', capo: 0, bpm: 84, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH',
    altPattern: 'd.du.udu', video: 'zombie', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'] },
      refrain: { name: 'Refrain', bars: ['Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['Em', 'C'], ['G', 'D']],
    tips: [
      "4 accords en boucle du début à la fin : c'est l'entraînement idéal pour les changements.",
      "Em → C : l'annulaire et le majeur glissent ensemble d'une corde vers le bas, garde-les « collés ».",
      "Version plus fidèle : remplace le D par un D/F# (pouce sur la 6e corde, case 2).",
    ],
  },
  {
    id: 'riptide', title: 'Riptide', artist: 'Vance Joy', year: 2013, style: 'Chanson récente', lesson: 5, level: 2,
    key: 'La mineur (capo 1 pour jouer avec le disque)', capo: 1, bpm: 102, beats: 4, steps: 2, pattern: 'd.du.udu', patternName: 'B · BH · HBH (folk)',
    video: 'riptide', confidence: 'medium',
    sections: {
      couplet: { name: 'Couplet', bars: ['Am', 'G', 'C', 'C', 'Am', 'G', 'C', 'C'] },
      refrain: { name: 'Refrain', bars: ['Am', 'G', 'C', 'C', 'Am', 'G', 'C', 'C'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['Am', 'G'], ['C', 'Am']],
    tips: [
      "Composé au ukulélé, ce morceau ne demande que 3 accords à la guitare. Un passage avec F existe dans le pont : remplace-le par Fmaj7.",
      "Le « trou » du motif (pas de coup sur le 3) est ce qui donne le côté dansant : la main descend quand même, dans le vide.",
    ],
  },
  {
    id: 'perfect', title: 'Perfect', artist: 'Ed Sheeran', year: 2017, style: 'Chanson récente', lesson: 6, level: 2,
    key: 'Sol (capo 1)', capo: 1, bpm: 63, beats: 2, steps: 3, pattern: 'DduDdu', patternName: '6/8 : B> B H  B> B H',
    bpmNote: 'Tempo en noires pointées (2 grands temps par mesure de 6/8).', video: 'perfect', confidence: 'medium',
    sections: {
      couplet: { name: 'Couplet', bars: ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'D'] },
      pre: { name: 'Pré-refrain', bars: ['Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'] },
      refrain: { name: 'Refrain', bars: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'D'] },
    },
    structure: ['couplet', 'pre', 'refrain', 'couplet', 'pre', 'refrain'],
    hard: [['Em', 'C'], ['C', 'D']],
    tips: [
      "Compte « 1 2 3 4 5 6 » en appuyant la voix sur 1 et 4 : c'est la valse lente du 6/8.",
      "Les accents donnent tout le balancement : joue le 1 et le 4 nettement plus fort.",
      "Le découpage exact des parties varie selon les tablatures : écoute le disque pour caler la structure.",
    ],
  },
  {
    id: 'someonelikeyou', title: 'Someone Like You', artist: 'Adele', year: 2011, style: 'Chanson récente', lesson: 7, level: 3,
    key: 'Sol (capo 2 = La)', capo: 2, bpm: 68, beats: 4, steps: 2, pattern: 'B3212321', patternName: 'Arpège p-i-m-a-m-i-m-i',
    video: 'someonelikeyou', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['G', 'D/F#', 'Em', 'C', 'G', 'D/F#', 'Em', 'C'] },
      refrain: { name: 'Refrain', bars: ['G', 'D/F#', 'Em', 'C', 'G', 'D/F#', 'Em', 'C'] },
    },
    structure: ['couplet', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['G', 'D/F#'], ['Em', 'C']],
    tips: [
      "Le pouce (P) joue toujours la basse de l'accord, indiquée en orange dans la tablature.",
      "Si le D/F# te gêne, joue un simple D : le pouce prend alors la 4e corde.",
      "Garde un son égal : aucune note ne doit dépasser des autres.",
    ],
  },
  {
    id: 'nowoman', title: 'No Woman, No Cry', artist: 'Bob Marley', year: 1974, style: 'Pop / rock', lesson: 8, level: 3,
    key: 'Do', capo: 0, bpm: 78, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH',
    altPattern: '.x.x.x.x', video: 'nowoman', confidence: 'medium',
    sections: {
      refrain: { name: 'Refrain', bars: ['C', 'G', 'Am', 'F', 'C', 'F', 'C', 'G'] },
      couplet: { name: 'Couplet', bars: ['C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F'] },
    },
    structure: ['refrain', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['Am', 'F'], ['F', 'C']],
    tips: [
      "Le Fa arrive souvent : commence avec Fmaj7 ou le Fa petit barré, puis passe au barré complet.",
      "Variante reggae : coups étouffés sur les « & » (motif · ✕ · ✕).",
      "Le découpage en mesures est simplifié : compare avec l'enregistrement.",
    ],
  },
  {
    id: 'creep', title: 'Creep', artist: 'Radiohead', year: 1992, style: 'Pop / rock', lesson: 9, level: 4,
    key: 'Sol', capo: 0, bpm: 92, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH',
    video: 'creep', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['G', 'G', 'B', 'B', 'C', 'C', 'Cm', 'Cm'] },
      refrain: { name: 'Refrain', bars: ['G', 'G', 'B', 'B', 'C', 'C', 'Cm', 'Cm'] },
    },
    structure: ['couplet', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['G', 'B'], ['C', 'Cm']],
    tips: [
      "Deux barrés (B et Cm) : c'est le morceau parfait pour les accords mobiles.",
      "C → Cm : passe du Do ouvert à la forme barrée en case 3. Vise d'abord l'index, le reste suit.",
      "Variante : joue le G aussi en barré (case 3) pour ne garder qu'une seule forme qui glisse.",
    ],
  },
  {
    id: 'countryroads', title: 'Take Me Home, Country Roads', artist: 'John Denver', year: 1971, style: 'Folk', lesson: 10, level: 3,
    key: 'Sol', capo: 0, bpm: 82, beats: 4, steps: 2, pattern: 'B.duA.du', patternName: 'Basse – BH – basse alt. – BH',
    video: 'countryroads', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['G', 'Em', 'D', 'C', 'G', 'Em', 'D', 'C'] },
      refrain: { name: 'Refrain', bars: ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'G'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain', 'refrain'],
    hard: [['D', 'Em'], ['C', 'G']],
    tips: [
      "La basse alternée fait tout le style : basse grave sur 1, basse alternée sur 3.",
      "Pour le C, l'annulaire saute de la 5e à la 6e corde (case 3) pour la basse alternée.",
    ],
  },
  {
    id: 'getlucky', title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell Williams', year: 2013, style: 'Chanson récente', lesson: 11, level: 4,
    key: 'Si mineur', capo: 0, bpm: 116, beats: 4, steps: 2, pattern: 'd.xud.xu', patternName: 'B · ✕H B · ✕H (chuck sur 2 et 4)',
    altPattern: 'duxuduxu', video: 'getlucky', confidence: 'high',
    sections: {
      boucle: { name: 'Boucle (tout le morceau)', bars: ['Bm7', 'D', 'F#m7', 'E'] },
    },
    structure: ['boucle', 'boucle', 'boucle', 'boucle'],
    hard: [['F#m7', 'E'], ['E', 'Bm7']],
    tips: [
      "Une seule boucle de 4 accords pendant tout le morceau : tout se joue dans la main droite.",
      "Le « chuck » : pose le plat de la main droite sur les cordes en grattant, pour un son sec de percussion.",
      "Le vrai morceau est joué en double-croches très légères : commence par cette version en croches.",
    ],
  },
  {
    id: 'wonderwall', title: 'Wonderwall', artist: 'Oasis', year: 1995, style: 'Pop / rock', lesson: 12, level: 4,
    key: 'Mi mineur (capo 2)', capo: 2, bpm: 87, beats: 4, steps: 2, pattern: 'd.du.udu', patternName: 'B · BH · HBH',
    video: 'wonderwall', confidence: 'medium',
    sections: {
      couplet: { name: 'Couplet', bars: ['Em7', 'Gw', 'Dsus4', 'A7sus4', 'Em7', 'Gw', 'Dsus4', 'A7sus4'] },
      pre: { name: 'Pré-refrain', bars: ['Cadd9', 'Dsus4', 'Em7', 'Em7', 'Cadd9', 'Dsus4', 'Em7', 'Em7', 'Cadd9', 'Dsus4', 'A7sus4', 'A7sus4'] },
      refrain: { name: 'Refrain', bars: ['Cadd9', 'Em7', 'Gw', 'Em7', 'Cadd9', 'Em7', 'Gw', 'Em7', 'Cadd9', 'Em7', 'Gw', 'A7sus4'] },
    },
    structure: ['couplet', 'couplet', 'pre', 'couplet', 'pre', 'refrain', 'refrain'],
    hard: [['Dsus4', 'A7sus4'], ['Cadd9', 'Dsus4']],
    tips: [
      "Annulaire et auriculaire ne quittent jamais les cases 3 des deux cordes aiguës : ils servent d'ancre à tous les accords.",
      "Le capo en case 2 est indispensable pour sonner comme le disque.",
      "Le découpage pré-refrain/refrain est simplifié : écoute le disque pour le nombre de répétitions.",
    ],
  },
  // ---------- Bonus : chansons françaises et folk ----------
  {
    id: 'lelion', title: 'Le lion est mort ce soir', artist: 'Henri Salvador / Pow Wow', year: 1962, style: 'Variété française', lesson: 1, level: 1, bonus: true,
    key: 'Sol', capo: 0, bpm: 123, startBpm: 60, beats: 4, steps: 2, pattern: 'd.d.d.d.', patternName: 'Noires', altPattern: 'd.dud.du',
    video: 'lelion', confidence: 'high',
    sections: {
      intro: { name: 'Intro', bars: ['G', 'C', 'G', 'D'] },
      couplet: { name: 'Couplet', bars: ['G', 'C', 'G', 'D', 'G', 'C', 'G', 'D'] },
      refrain: { name: 'Refrain', bars: ['G', 'C', 'G', 'D', 'G', 'C', 'G', 'D7'] },
    },
    structure: ['intro', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['G', 'C'], ['G', 'D']],
    tips: ["Trois accords qui tournent tout le morceau : parfait pour travailler la régularité.", "Commence en noires, puis passe au motif B · BH B · BH de la leçon 3."],
  },
  {
    id: 'santiano', title: 'Santiano', artist: 'Hugues Aufray', year: 1961, style: 'Variété française', lesson: 3, level: 2, bonus: true,
    key: 'Mi mineur', capo: 0, bpm: 129, startBpm: 70, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH',
    video: 'santiano', confidence: 'medium',
    sections: {
      intro: { name: 'Intro', bars: ['Em', 'Em', 'Em', 'Em'] },
      couplet: { name: 'Couplet', bars: ['Em', 'Em', 'G', 'D', 'Em', 'Em', 'D', 'D', 'Am', 'Am', 'D', 'D', 'Em', 'D', 'Em', 'Em'] },
      refrain: { name: 'Refrain', bars: ['Em', 'Em', 'G', 'D', 'Em', 'Em', 'D', 'D', 'Am', 'Am', 'D', 'D', 'Em', 'D', 'Em', 'Em'] },
    },
    structure: ['intro', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['Em', 'G'], ['Am', 'D']],
    tips: ["Certaines tablatures ajoutent un Si mineur (Bm) de passage : on le remplace ici par un Ré.", "Accentue le « 1 » de chaque mesure pour le côté chant de marins."],
  },
  {
    id: 'bellaciao', title: 'Bella Ciao', artist: 'Chant traditionnel italien', year: 1944, style: 'Folk', lesson: 4, level: 1, bonus: true,
    key: 'La mineur', capo: 0, bpm: 110, startBpm: 70, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH',
    video: 'bellaciao', confidence: 'medium',
    sections: {
      couplet: { name: 'Couplet / refrain', bars: ['Am', 'Am', 'Am', 'Am', 'Dm', 'Dm', 'Am', 'Am', 'E7', 'E7', 'Am', 'Am'] },
    },
    structure: ['couplet', 'couplet', 'couplet', 'couplet'],
    hard: [['Am', 'Dm'], ['E7', 'Am']],
    tips: ["Am → E7 : l'index reste en case 1 sur la 3e corde, garde-le comme pivot.", "Le nombre de mesures par accord est approximatif : chante en jouant pour le caler."],
  },
  {
    id: 'ventsoufflera', title: 'Dès que le vent soufflera', artist: 'Renaud', year: 1983, style: 'Variété française', lesson: 5, level: 2, bonus: true,
    key: 'Mi mineur', capo: 0, bpm: 125, startBpm: 70, beats: 4, steps: 2, pattern: 'd.du.udu', patternName: 'B · BH · HBH',
    video: 'ventsoufflera', confidence: 'medium',
    sections: {
      couplet: { name: 'Couplet', bars: ['Em', 'Em', 'D', 'Em', 'D', 'D', 'Em', 'Em', 'D', 'Em', 'D', 'D', 'Em', 'Em'] },
      refrain: { name: 'Refrain', bars: ['D', 'D', 'Em', 'Em', 'G', 'D', 'B7', 'Em', 'G', 'D', 'B7', 'Em'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['B7', 'Em'], ['G', 'D']],
    tips: ["L'original monte d'un demi-ton deux fois : reste en Mi mineur, ou avance ton capo d'une case à chaque montée.", "B7 → Em : le majeur reste presque au même endroit, glisse sans le soulever."],
  },
  {
    id: 'champs', title: 'Les Champs-Élysées', artist: 'Joe Dassin', year: 1969, style: 'Variété française', lesson: 8, level: 3, bonus: true,
    key: 'Do (capo 4 = Mi)', capo: 4, bpm: 112, startBpm: 70, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH',
    video: 'champs', confidence: 'high',
    sections: {
      couplet: { name: 'Couplet', bars: ['C', 'G', 'Am', 'C7', 'F', 'C', 'D7', 'G', 'C', 'G', 'Am', 'C7', 'F', 'C', 'F G', 'C'] },
      refrain: { name: 'Refrain', bars: ['C', 'E7', 'Am', 'C7', 'F', 'C', 'D7', 'G', 'C', 'E7', 'Am', 'C7', 'F', 'C', 'F G', 'C'] },
    },
    structure: ['couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['C7', 'F'], ['D7', 'G']],
    tips: ["Le Fa barré arrive deux fois par ligne : idéal pour l'automatiser. Fmaj7 en dépannage.", "Version simplifiée : les tablatures complètes ajoutent des basses descendantes (G/B, C/Bb)."],
  },
  // ---------- Comptines (domaine public : paroles incluses) ----------
  // Dans les paroles, [G] place l'accord juste au-dessus de la syllabe qui suit.
  {
    id: 'frerejacques', title: 'Frère Jacques', artist: 'Comptine traditionnelle', year: 1780, style: 'Comptines', lesson: 1, level: 1, free: true,
    key: 'Sol', capo: 0, bpm: 100, startBpm: 60, beats: 4, steps: 2, pattern: 'd.d.d.d.', patternName: 'Noires (B B B B)', altPattern: 'd.dud.du',
    video: null, confidence: 'high',
    sections: { tout: { name: 'Comptine', bars: ['G', 'G', 'G', 'G', 'G', 'G', 'D G', 'D G'] } },
    structure: ['tout', 'tout', 'tout'],
    hard: [['G', 'D']],
    lyrics: [{ name: 'Comptine (à chanter en canon)', lines: [
      '[G]Frère Jacques, [G]frère Jacques,', '[G]Dormez-vous ? [G]Dormez-vous ?',
      '[G]Sonnez les matines, [G]sonnez les matines,', '[D]Ding, daing, [G]dong ! [D]Ding, daing, [G]dong !',
    ] }],
    tips: [
      "Un seul accord presque tout du long : idéal pour chanter avec les enfants sans regarder ta main gauche.",
      "Joue-la en canon : tu commences, un enfant démarre quand tu arrives au 2e « Dormez-vous ».",
      "Les noires régulières de la leçon 1 suffisent. Garde un tempo calme pour que les petits puissent suivre.",
    ],
  },
  {
    id: 'viedirai', title: 'Ah ! vous dirai-je, maman', artist: 'Comptine traditionnelle', year: 1761, style: 'Comptines', lesson: 1, level: 1, free: true,
    key: 'Sol', capo: 0, bpm: 90, startBpm: 60, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH', altPattern: 'd.d.d.d.',
    video: null, confidence: 'high',
    sections: {
      a: { name: 'Début et fin', bars: ['G', 'C G', 'C G', 'D G'] },
      b: { name: 'Milieu', bars: ['G C', 'G D', 'G C', 'G D'] },
    },
    structure: ['a', 'b', 'a'],
    hard: [['G', 'C'], ['D', 'G']],
    lyrics: [{ name: 'Couplet', lines: [
      '[G]Ah ! vous dirai-[C]je, ma[G]man,', '[C]Ce qui cause [G]mon tour[D]ment ? [G]',
      '[G]Papa veut [C]que je rai[G]son[D]ne', '[G]Comme une [C]grande per[G]son[D]ne.',
      '[G]Moi je dis [C]que les bon[G]bons', '[C]Valent mieux [G]que la rai[D]son. [G]',
    ] }],
    tips: [
      "C'est la mélodie de « Twinkle Twinkle Little Star » : les enfants la reconnaissent tout de suite.",
      "Deux accords par mesure : change sur le 3, la main droite continue son pendule.",
      "Commence en noires si le motif complet est trop chargé en chantant.",
    ],
  },
  {
    id: 'clairdelune', title: 'Au clair de la lune', artist: 'Comptine traditionnelle', year: 1750, style: 'Comptines', lesson: 7, level: 2, free: true,
    key: 'Sol', capo: 0, bpm: 72, startBpm: 50, beats: 4, steps: 2, pattern: 'B3212321', patternName: 'Arpège doux p-i-m-a-m-i-m-i', altPattern: 'd.d.d.d.',
    video: null, confidence: 'medium',
    sections: {
      a: { name: 'Phrase A', bars: ['G', 'G D', 'G D', 'G'] },
      b: { name: 'Phrase B', bars: ['D', 'A7', 'D A7', 'D'] },
    },
    structure: ['a', 'a', 'b', 'a'],
    hard: [['G', 'D'], ['D', 'A7']],
    lyrics: [{ name: 'Couplet', lines: [
      '[G]Au clair de la [G]lu[D]ne, [G]mon a[D]mi Pier[G]rot,', '[G]Prête-moi ta [G]plu[D]me [G]pour é[D]crire un [G]mot.',
      '[D]Ma chandelle est [A7]morte, [D]je n\'ai [A7]plus de [D]feu,', '[G]Ouvre-moi ta [G]por[D]te [G]pour l\'a[D]mour de [G]Dieu.',
    ] }],
    tips: [
      "Parfaite pour le coucher : joue-la en arpège, doucement, et ralentis à la fin.",
      "Si l'arpège est trop chargé en chantant, gratte un seul coup par temps avec le pouce.",
      "La phrase B passe par Ré et La7 : prépare le La7 (deux doigts) pendant que tu chantes « chandelle ».",
    ],
  },
  {
    id: 'pontavignon', title: "Sur le pont d'Avignon", artist: 'Chanson traditionnelle', year: 1850, style: 'Comptines', lesson: 3, level: 1, free: true,
    key: 'Sol', capo: 0, bpm: 110, startBpm: 70, beats: 4, steps: 2, pattern: 'd.dud.du', patternName: 'B · BH B · BH', altPattern: 'd.d.d.d.',
    video: null, confidence: 'high',
    sections: {
      refrain: { name: 'Refrain', bars: ['G', 'D7', 'G', 'D7 G'] },
      couplet: { name: 'Couplet', bars: ['G', 'D7', 'G', 'D7 G'] },
    },
    structure: ['refrain', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['G', 'D7']],
    lyrics: [
      { name: 'Refrain', lines: ["[G]Sur le pont d'Avignon, [D7]l'on y danse, l'on y danse,", "[G]Sur le pont d'Avignon, [D7]l'on y danse [G]tous en rond."] },
      { name: 'Couplets', lines: ['[G]Les beaux messieurs font [D7]comme ça,', '[G]Et puis encore [D7]comme [G]ça.', '(puis : les belles dames, les militaires, les musiciens…)'] },
    ],
    tips: [
      "Deux accords seulement, Sol et Ré7 : l'enchaînement le plus utile pour les chansons d'enfants.",
      "À chaque couplet, les enfants inventent un geste (révérence, salut militaire…) : c'est toi qui tiens le rythme !",
    ],
  },
  {
    id: 'alouette', title: 'Alouette', artist: 'Chanson traditionnelle', year: 1879, style: 'Comptines', lesson: 2, level: 1, free: true,
    key: 'Sol', capo: 0, bpm: 110, startBpm: 70, beats: 4, steps: 2, pattern: 'd.d.dudu', patternName: 'B B BH BH',
    video: null, confidence: 'medium',
    sections: {
      refrain: { name: 'Refrain', bars: ['G', 'D G', 'G', 'D G'] },
      couplet: { name: 'Couplet', bars: ['G', 'D', 'G', 'D', 'G', 'D', 'G', 'G'] },
    },
    structure: ['refrain', 'couplet', 'refrain', 'couplet', 'refrain'],
    hard: [['G', 'D']],
    lyrics: [
      { name: 'Refrain', lines: ['[G]Alouette, [D]gentille a[G]louette,', '[G]Alouette, [D]je te plu[G]merai.'] },
      { name: 'Couplet', lines: ['[G]Je te plumerai la [D]tête, [G]je te plumerai la [D]tête,', '[G]Et la tête ! [D]Et la tête !', '[G]Alouette ! Alouette ! [G]Aaah…', '(puis : le bec, le cou, les ailes… on ajoute un mot à chaque couplet)'] },
    ],
    tips: [
      "Chanson à accumulation : à chaque couplet on ajoute une partie, les enfants adorent la liste qui s'allonge.",
      "Sur le « Aaah… » final, ralentis et laisse sonner l'accord avant de repartir dans le refrain.",
    ],
  },
];

export const songById = (id) => SONGS.find((s) => s.id === id);
export const STYLE_COLORS = { Folk: '#B5835A', 'Pop / rock': '#2B78BD', 'Chanson récente': '#7357D9', 'Variété française': '#1F8F6A', Comptines: '#E0A21B' };

/** Liste des accords d'un morceau, dans l'ordre d'apparition */
export function songChords(song) {
  const out = [];
  for (const k of song.structure.concat(Object.keys(song.sections))) {
    for (const bar of song.sections[k].bars) for (const c of bar.split(' ')) if (!out.includes(c)) out.push(c);
  }
  return out;
}

/** Tuto pas à pas, construit à partir des données du morceau */
export function songTutorial(song) {
  const chords = songChords(song);
  const sections = Object.values(song.sections);
  const steps = [
    { t: 'Les accords, un par un', p: `Pose chaque accord (${chords.join(', ')}), gratte-le lentement corde par corde et vérifie que chaque note sonne clair. Touche un schéma pour l'entendre.` },
    { t: 'Les changements difficiles', p: `Entraîne ${song.hard.map(([a, b]) => `${a} ↔ ${b}`).join(' et ')} : une minute chacun, sans rythme, en comptant combien de changements propres tu fais.` },
    { t: 'Le rythme seul', p: `Sur un seul accord, joue le motif « ${song.patternName} » avec le métronome à ${song.startBpm || Math.max(50, Math.round(song.bpm * 0.6))} BPM jusqu'à ce qu'il devienne automatique.` },
  ];
  sections.forEach((s) => steps.push({ t: s.name, p: `Joue la grille du ${s.name.toLowerCase()} en boucle avec « Jouer avec l'appli », d'abord lentement. Ne t'arrête jamais : si un accord n'est pas prêt, gratte les cordes à vide et retombe sur le temps suivant.` }));
  if (song.free) {
    steps.push({ t: 'Chanter en jouant', p: "Joue la grille en fredonnant la mélodie, puis avec les paroles. Si la main droite se bloque quand tu chantes, reviens aux noires (un coup par temps) : le plus important est de ne jamais t'arrêter." });
    steps.push({ t: 'Avec les enfants', p: `Lance le décompte « 1, 2, 3, 4 » à voix haute pour que tout le monde démarre ensemble. Un tempo autour de ${Math.round(song.bpm * 0.85)} BPM est confortable pour les petits.` });
    return steps;
  }
  steps.push({ t: 'Le morceau entier', p: `Enchaîne la structure (${song.structure.map((k) => song.sections[k].name).join(' → ')}). Monte le tempo de 5 BPM à chaque passage réussi jusqu'à ${song.bpm} BPM, puis joue avec l'enregistrement original${song.capo ? ` (capo en case ${song.capo})` : ''}.` });
  return steps;
}
