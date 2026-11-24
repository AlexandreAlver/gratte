// Parcours de 12 leçons (30 à 60 minutes chacune)
// Types d'étapes : intro, tuner, theory, video, practice, changes, song, review
// practice.pr : { bars, pattern, beats, steps, bpm, target, inc, synth, mic, subClick }

const C = (type, html) => `<div class="callout ${type === 'tip' ? '' : type}">${type === 'tip' ? '💡' : type === 'good' ? '✅' : '⚠️'}<div>${html}</div></div>`;

export const LESSONS = [
  // ============================================================ 1
  {
    id: 1, theme: 'Rythme', title: 'Trouver la pulsation', subtitle: 'Le rythme commence dans le corps, pas dans les doigts.',
    minutes: 45, song: 'knockin', bonus: ['lelion'],
    steps: [
      { kind: 'intro', title: 'Bienvenue dans ton parcours rythme', min: 2,
        body: `<p>Tu arpèges déjà bien, mais le grattage « ne sonne pas » ? C'est presque toujours un problème de <b>pulsation</b> : la main droite suit les accords au lieu de suivre le temps.</p>
<p>Dans cette première leçon, on remet les choses dans l'ordre : <b>d'abord le temps, ensuite les accords</b>. Ça paraît simple, mais c'est la base de tout ce qui suit.</p>`,
        objectives: ['Sentir et compter la pulsation à 4 temps', 'Gratter en noires parfaitement régulières', 'Changer d\'accord sans jamais arrêter la main droite', "Jouer Knockin' on Heaven's Door en entier"] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 3 },
      { kind: 'theory', title: 'La pulsation et la mesure', min: 5,
        body: `<p>La <b>pulsation</b>, c'est le battement régulier sur lequel tu tapes du pied quand tu écoutes une chanson. Chaque battement est un <b>temps</b>.</p>
<p>La plupart des chansons regroupent les temps par 4 : c'est une <b>mesure à 4 temps</b>. On compte <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>, <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>… Le <b>1</b> est le temps le plus fort : c'est souvent là que l'accord change.</p>
<h3>La méthode qui marche : le corps d'abord</h3>
<ol><li><b>Tape du pied</b> sur chaque temps : ton pied devient ton métronome intérieur.</li>
<li><b>Compte à voix haute</b> : ça paraît bête, mais c'est la technique la plus efficace. Les profs de rythme insistent tous dessus.</li>
<li><b>Joue lentement</b> : un rythme lent et parfaitement régulier vaut mieux qu'un rythme rapide et bancal.</li></ol>
${C('tip', "Le <b>BPM</b> (battements par minute) mesure la vitesse. 60 BPM = un temps par seconde.")}`,
      },
      { kind: 'video', title: 'Les bases du rythme en vidéo', min: 8, video: 'l1',
        body: '<p>Regarde ces notions fondamentales. Pas besoin de tout retenir : on va les pratiquer pas à pas.</p>' },
      { kind: 'practice', id: 'l1-pied', title: 'Le pied et la voix', min: 4,
        body: `<p>Sans guitare (ou cordes étouffées avec la main gauche), <b>tape du pied</b> sur chaque clic et <b>compte à voix haute</b> « 1, 2, 3, 4 ». Le clic aigu marque le 1.</p>
${C('tip', "Ferme les yeux pendant quelques mesures : tu dois sentir quand arrive le prochain clic.")}`,
        pr: { bars: [null], pattern: 'd.d.d.d.', bpm: 60, target: 80, inc: 5 } },
      { kind: 'practice', id: 'l1-noires', title: 'Grattage en noires sur Sol', min: 7,
        body: `<p>Un seul coup <b>vers le bas</b> par temps sur l'accord de <b>G</b>. Le coup tombe en même temps que le pied et le clic.</p>
<p>Quand tu joues 4 mesures parfaitement régulières, appuie sur <b>Réussi</b> : le tempo monte de 5 BPM.</p>
${C('tip', "Active <b>Micro</b> pour que l'appli écoute ton jeu et te dise si tu es en avance ou en retard.")}`,
        pr: { bars: ['G'], pattern: 'd.d.d.d.', bpm: 60, target: 90, inc: 5 } },
      { kind: 'practice', id: 'l1-chgt', title: 'Changer sans s\'arrêter', min: 7,
        body: `<p>Maintenant <b>G → D → Am</b>, une mesure chacun. La règle d'or : <b>la main droite ne s'arrête jamais</b>, même si l'accord n'est pas prêt.</p>
<p>Astuce de pro : lâche l'accord sur le <b>4</b> pour avoir le temps de poser le suivant sur le <b>1</b>. Si ça frotte un peu sur le 4, ce n'est pas grave : l'oreille retient surtout le 1.</p>`,
        pr: { bars: ['G', 'D', 'Am', 'Am'], pattern: 'd.d.d.d.', bpm: 55, target: 75, inc: 5 } },
      { kind: 'song', song: 'knockin', min: 12,
        body: `<p>Ton premier morceau complet ! La grille tient en 8 mesures et se répète. Commence à 55 BPM en noires, puis monte jusqu'à 69 (le tempo du disque).</p>` },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 2
  {
    id: 2, theme: 'Rythme', title: 'Le pendule : la main qui ne s\'arrête jamais', subtitle: 'Le secret n°1 d\'un grattage fluide.',
    minutes: 45, song: 'standbyme',
    steps: [
      { kind: 'intro', title: 'Pourquoi ta main doit faire le pendule', min: 2,
        body: `<p>La plupart des guitaristes autodidactes grattent « à la demande » : la main bouge quand il faut jouer, puis s'arrête. Résultat : le rythme flotte.</p>
<p>La solution utilisée par tous les bons rythmiciens : <b>la main droite oscille en permanence</b>, comme le balancier d'une horloge. Elle descend sur les temps, remonte sur les « et ». Tu choisis seulement <b>quand toucher les cordes</b>.</p>`,
        objectives: ['Installer un mouvement de pendule régulier', 'Compter « 1 & 2 & 3 & 4 & »', 'Gratter en croches bas-haut', 'Jouer Stand By Me'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'practice', id: 'l1-noires', title: 'Échauffement : les noires', min: 3,
        body: '<p>On reprend la leçon 1 : un coup vers le bas par temps sur G. Repars de ton dernier tempo réussi.</p>',
        pr: { bars: ['G'], pattern: 'd.d.d.d.', bpm: 70, target: 90, inc: 5 } },
      { kind: 'theory', title: 'Le pendule et les croches', min: 5,
        body: `<p>Divise chaque temps en deux : <b>« 1 & 2 & 3 & 4 & »</b> (prononce « un et deux et… »). Ces demi-temps s'appellent des <b>croches</b>.</p>
<ul><li>Sur les chiffres (1, 2, 3, 4), la main <b>descend</b> ↓</li>
<li>Sur les « & », la main <b>remonte</b> ↑</li></ul>
<p>Toujours. Même quand tu ne joues pas : la main passe alors <b>au-dessus des cordes</b> sans les toucher (cases en pointillé dans l'appli).</p>
${C('tip', "Le mouvement part du <b>poignet</b>, souple, comme pour secouer de l'eau de ta main. L'avant-bras accompagne à peine.")}
${C('tip', "En remontant, ne touche que les 3-4 cordes aiguës : le coup vers le haut est naturellement plus léger.")}`,
      },
      { kind: 'video', title: 'Le mouvement de balancier', min: 7, video: 'l2', body: '<p>Observe bien le poignet : il ne s\'arrête jamais.</p>' },
      { kind: 'practice', id: 'l2-vide', title: 'Pendule avec coups dans le vide', min: 5,
        body: `<p>Joue seulement les coups <b>vers le bas</b> (sur les chiffres), mais fais <b>aussi la remontée</b> dans le vide, au-dessus des cordes. Dis « 1 & 2 & » à voix haute.</p>`,
        pr: { bars: ['Em'], pattern: 'd.d.d.d.', bpm: 60, target: 90, inc: 5, subClick: true } },
      { kind: 'practice', id: 'l2-croches', title: 'Croches bas-haut', min: 6,
        body: `<p>Maintenant, la remontée touche les cordes : <b>Bas Haut Bas Haut…</b> Le coup bas un peu plus fort, le coup haut plus léger.</p>`,
        pr: { bars: ['Em'], pattern: 'dudududu', bpm: 60, target: 90, inc: 5 } },
      { kind: 'practice', id: 'l2-mix', title: 'Noire, noire, croches', min: 6,
        body: `<p>Le motif de Stand By Me : <b>B · B · BH BH</b>. Les cases en pointillé sont des remontées dans le vide. Le pendule ne change pas, seul le contact avec les cordes change !</p>
${C('tip', "Active <b>Guitare</b> pour entendre le motif joué par l'appli avant de le jouer toi-même.")}`,
        pr: { bars: ['G', 'G', 'Em', 'Em'], pattern: 'd.d.dudu', bpm: 60, target: 100, inc: 5 } },
      { kind: 'song', song: 'standbyme', min: 10, body: '<p>Stand By Me tourne sur 4 accords. Commence vers 70 BPM et monte petit à petit jusqu\'à 118.</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 3
  {
    id: 3, theme: 'Rythme', title: 'Les croches et ta première vraie rythmique', subtitle: 'B · BH B · BH : le motif passe-partout.',
    minutes: 45, song: 'badmoon', bonus: ['santiano'],
    steps: [
      { kind: 'intro', title: 'Un motif qui sert partout', min: 2,
        body: `<p>Avec le pendule installé, tu peux jouer presque toutes les rythmiques. On commence par la plus utile : <b>B · BH B · BH</b> (bas, bas-haut, bas, bas-haut).</p>`,
        objectives: ['Lire une rythmique dans une grille de croches', 'Jouer B · BH B · BH sans réfléchir', 'Le garder pendant les changements d\'accords', 'Jouer Bad Moon Rising'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'practice', id: 'l2-croches', title: 'Échauffement : pendule en croches', min: 3,
        body: '<p>Bas-haut continu sur Em, pour lancer la machine.</p>', pr: { bars: ['Em'], pattern: 'dudududu', bpm: 70, target: 100, inc: 5 } },
      { kind: 'theory', title: 'Lire une rythmique', min: 5,
        body: `<p>Une mesure = 8 cases (1 & 2 & 3 & 4 &). Dans chaque case : <b>↓</b> on touche en descendant, <b>↑</b> en remontant, <b>pointillé</b> = la main passe dans le vide.</p>
<p>B · BH B · BH donne : <kbd>1</kbd> ↓ · <kbd>&</kbd> vide · <kbd>2</kbd> ↓ · <kbd>&</kbd> ↑ · <kbd>3</kbd> ↓ · <kbd>&</kbd> vide · <kbd>4</kbd> ↓ · <kbd>&</kbd> ↑</p>
<h3>La méthode : dire avant de jouer</h3>
<ol><li><b>Dis</b> le rythme à voix haute (« Bas… Bas-Haut… Bas… Bas-Haut »).</li><li><b>Tape-le</b> sur ta cuisse.</li><li><b>Joue-le</b> cordes étouffées (main gauche posée à plat sur les cordes).</li><li>Puis seulement sur un accord.</li></ol>
${C('tip', 'Cette progression « voix → corps → guitare » est la méthode la plus fiable pour mémoriser un rythme.')}`,
      },
      { kind: 'video', title: 'Les rythmes faciles indispensables', min: 8, video: 'l3', body: '<p>Repère le motif B · BH B · BH dans la vidéo.</p>' },
      { kind: 'practice', id: 'l3-motif', title: 'Le motif sur un accord', min: 6,
        body: '<p>Sur <b>D</b>, joue B · BH B · BH en boucle. Étape 1 : cordes étouffées (main gauche à plat). Étape 2 : accord de Ré.</p>',
        pr: { bars: ['D'], pattern: 'd.dud.du', bpm: 60, target: 100, inc: 5 } },
      { kind: 'practice', id: 'l3-chgt', title: 'Avec les changements', min: 7,
        body: `<p>D → A → G. La mesure « A G » fait changer d'accord <b>au milieu</b> de la mesure (sur le 3) : c'est le défi de Bad Moon Rising.</p>
${C('tip', "Coupe le problème en deux : boucle uniquement la mesure « A G » jusqu'à ce qu'elle soit facile.")}`,
        pr: { bars: ['D', 'A G', 'D', 'D'], pattern: 'd.dud.du', bpm: 55, target: 90, inc: 5 } },
      { kind: 'song', song: 'badmoon', min: 10, body: '<p>Un classique du feu de camp. Si tu veux un bonus en français, essaie <b>Santiano</b> avec le même motif.</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 4
  {
    id: 4, theme: 'Accords', title: 'Changer d\'accord sans casser le rythme', subtitle: 'La technique « une minute » et les doigts pivots.',
    minutes: 50, song: 'zombie', bonus: ['bellaciao'],
    steps: [
      { kind: 'intro', title: 'Le vrai problème, c\'est le changement', min: 2,
        body: `<p>Souvent, le rythme ne casse pas à cause de la main droite, mais parce que la main gauche <b>n'est pas prête à temps</b>. On va donc entraîner les changements comme un sportif : courts, intenses, et mesurés.</p>`,
        objectives: ['Mesurer et améliorer ta vitesse de changement', 'Utiliser les doigts pivots et les doigts guides', 'Anticiper le prochain accord', 'Jouer Zombie'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'theory', title: '4 techniques de changement', min: 6,
        body: `<ol><li><b>Le « one-minute change »</b> : pendant 60 secondes, passe d'un accord à l'autre le plus de fois possible (un coup par accord, pas de rythme). Note ton score. Cette méthode est utilisée par beaucoup de profs : tes scores vont grimper vite.</li>
<li><b>Le doigt pivot</b> : un doigt qui ne bouge pas entre deux accords (ex. C → Am : l'index reste en case 1 sur la 2e corde).</li>
<li><b>Le doigt guide</b> : un doigt qui glisse sur sa corde sans la quitter (ex. Em → C, ou G → Em).</li>
<li><b>Poser en bloc</b> : visualise la forme de l'accord dans les airs et pose tous les doigts en même temps, pas un par un.</li></ol>
${C('tip', "Regarde le prochain accord <b>pendant</b> que tu joues le précédent : c'est l'anticipation.")}`,
      },
      { kind: 'video', title: 'Changer d\'accord plus vite', min: 7, video: 'l4', body: '' },
      { kind: 'changes', title: 'Une minute de changements', min: 8,
        body: '<p>Pour chaque paire : lance le chrono, change le plus de fois possible <b>proprement</b> pendant 60 secondes, puis note ton score.</p>',
        pairs: [['Em', 'C'], ['C', 'G'], ['G', 'D'], ['D', 'Em']] },
      { kind: 'practice', id: 'l4-grille', title: 'La grille avec le rythme', min: 8,
        body: '<p>Em → C → G → D, une mesure chacun, avec le motif B · BH B · BH. Garde le pendule pendant les changements !</p>',
        pr: { bars: ['Em', 'C', 'G', 'D'], pattern: 'd.dud.du', bpm: 55, target: 84, inc: 4 } },
      { kind: 'song', song: 'zombie', min: 12, body: '<p>Zombie répète la même grille du début à la fin : parfait pour automatiser. En bonus : <b>Bella Ciao</b> (Am, Dm, E7).</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 5
  {
    id: 5, theme: 'Rythme', title: 'La syncope : la rythmique folk universelle', subtitle: 'B · BH · HBH, la reine des rythmiques.',
    minutes: 50, song: 'riptide', bonus: ['ventsoufflera'],
    steps: [
      { kind: 'intro', title: 'Le motif qui fait « sonner » la guitare', min: 2,
        body: `<p>Si tu ne devais apprendre qu'une rythmique, ce serait celle-ci : <b>Bas · Bas-Haut · Haut-Bas-Haut</b>. Elle est dans des centaines de chansons, de la variété française à la pop actuelle.</p>
<p>Sa particularité : un <b>trou sur le 3</b>. C'est ce qu'on appelle une <b>syncope</b>, et c'est elle qui donne le groove.</p>`,
        objectives: ['Comprendre la syncope', 'Jouer B · BH · HBH sans y penser', 'Le garder pendant les changements', 'Jouer Riptide'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'practice', id: 'l3-motif', title: 'Échauffement : B · BH B · BH', min: 3, body: '<p>On reprend le motif de la leçon 3.</p>', pr: { bars: ['Am'], pattern: 'd.dud.du', bpm: 70, target: 100, inc: 5 } },
      { kind: 'theory', title: 'Le piège de la syncope', min: 6,
        body: `<p>Compte : <kbd>1</kbd> ↓ · <kbd>&</kbd> vide · <kbd>2</kbd> ↓ · <kbd>&</kbd> ↑ · <kbd>3</kbd> <b>vide</b> · <kbd>&</kbd> ↑ · <kbd>4</kbd> ↓ · <kbd>&</kbd> ↑</p>
<p>Le piège classique : sur le <b>3</b>, la main s'arrête. Et là, tout le rythme se décale. La solution, tu la connais : <b>le pendule</b>. Sur le 3, la main descend quand même, mais <b>au-dessus des cordes</b>.</p>
<h3>Le mot magique</h3><p>Dis-le en jouant : « <b>Bas, Bas-Haut, … Haut-Bas-Haut</b> ». Certains profs le chantent « Tam, Tam-Ta, … Ta-Tam-Ta ».</p>
${C('warn', "Si tu sens que tu te « rattrapes » après le trou, ralentis de 10 BPM. La vitesse viendra toute seule.")}`,
      },
      { kind: 'video', title: 'Le rythme feu de camp', min: 8, video: 'l5', body: '' },
      { kind: 'practice', id: 'l5-motif', title: 'Le motif seul', min: 7,
        body: '<p>Sur Am, en boucle. Écoute d\'abord le motif avec <b>Guitare</b> activé, puis joue par-dessus.</p>',
        pr: { bars: ['Am'], pattern: 'd.du.udu', bpm: 55, target: 100, inc: 5, synth: true } },
      { kind: 'practice', id: 'l5-ecoute', title: 'Contrôle au micro', min: 5,
        body: `<p>Active le <b>Micro</b> et joue le motif 8 mesures de suite. L'appli te montre chaque coup : à gauche tu es en avance, à droite en retard.</p>
${C('tip', "Vise plus de 80 % des coups « dans le temps ». Si tu as tendance à presser (points à gauche), pense à « poser » chaque coup.")}`,
        pr: { bars: ['Am'], pattern: 'd.du.udu', bpm: 70, target: 100, inc: 5, mic: true } },
      { kind: 'practice', id: 'l5-grille', title: 'Avec les changements', min: 6,
        body: '<p>Am → G → C → C. Le changement se fait pendant le dernier « & » : la remontée peut être jouée cordes à vide, c\'est normal.</p>',
        pr: { bars: ['Am', 'G', 'C', 'C'], pattern: 'd.du.udu', bpm: 60, target: 102, inc: 5 } },
      { kind: 'song', song: 'riptide', min: 10, body: '<p>Bonus français avec le même motif : <b>Dès que le vent soufflera</b> de Renaud.</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 6
  {
    id: 6, theme: 'Rythme', title: 'Accents et mesure à 6/8', subtitle: 'Faire respirer ton rythme.',
    minutes: 45, song: 'perfect',
    steps: [
      { kind: 'intro', title: 'Du métronome à la musique', min: 2,
        body: `<p>Un rythme régulier, c'est bien. Un rythme <b>vivant</b>, c'est mieux. La différence ? Les <b>accents</b> : certains coups plus forts que d'autres.</p>
<p>On découvre aussi la <b>mesure ternaire</b> (6/8), celle des ballades et des valses lentes.</p>`,
        objectives: ['Accentuer les temps 2 et 4 (backbeat)', 'Compter et sentir une mesure à 6/8', 'Doser la force de la main droite', 'Jouer Perfect'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'practice', id: 'l5-motif', title: 'Échauffement : la syncope', min: 3, body: '<p>Le motif de la leçon 5, pour garder la main chaude.</p>', pr: { bars: ['G'], pattern: 'd.du.udu', bpm: 75, target: 100, inc: 5 } },
      { kind: 'theory', title: 'Les accents', min: 5,
        body: `<p>Dans la pop et le rock, la batterie frappe la caisse claire sur les temps <b>2 et 4</b>. Si ta guitare accentue aussi ces temps, ça « groove » immédiatement.</p>
<p>Dans l'appli, un accent est marqué <b>›</b>. Joue l'accent plus fort et plus ample, les autres coups plus légers. La main ne doit pas accélérer pour autant !</p>
<h3>Le 6/8</h3><p>Une mesure de 6/8 contient 6 croches groupées par 3 : <kbd>1</kbd> 2 3 <kbd>4</kbd> 5 6. On sent <b>deux grands temps</b> (1 et 4) qui se balancent, comme une berceuse.</p>
${C('tip', 'Compte « UN deux trois QUATRE cinq six » en appuyant la voix sur 1 et 4.')}`,
      },
      { kind: 'video', title: 'La technique des accents', min: 6, video: 'l6', body: '' },
      { kind: 'practice', id: 'l6-backbeat', title: 'Backbeat : accent sur 2 et 4', min: 6,
        body: '<p>Le motif B · BH B · BH, avec un accent sur 2 et 4. Exagère au début !</p>', pr: { bars: ['C', 'G'], pattern: 'd.Dud.Du', bpm: 65, target: 100, inc: 5 } },
      { kind: 'practice', id: 'l6-68', title: 'Le 6/8 en coups vers le bas', min: 6,
        body: '<p>6 coups vers le bas, accent sur le 1 et le 4. Le tempo affiché correspond aux 2 grands temps de la mesure.</p>', pr: { bars: ['G', 'Em'], pattern: 'DddDdd', beats: 2, steps: 3, bpm: 45, target: 63, inc: 3 } },
      { kind: 'practice', id: 'l6-68b', title: 'Le 6/8 de Perfect', min: 6,
        body: '<p>Accent bas, bas, haut, accent bas, bas, haut : la remontée sur le 3 et le 6 donne le balancement.</p>', pr: { bars: ['G', 'Em', 'C', 'D'], pattern: 'DduDdu', beats: 2, steps: 3, bpm: 45, target: 63, inc: 3 } },
      { kind: 'song', song: 'perfect', min: 10, body: '<p>Ballade en 6/8, capo en case 1 pour jouer avec le disque.</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 7
  {
    id: 7, theme: 'Arpège', title: 'Arpèges en rythme : pouce, index, majeur, annulaire', subtitle: 'Mettre ton point fort au service du tempo.',
    minutes: 45, song: 'someonelikeyou',
    steps: [
      { kind: 'intro', title: 'Tu arpèges déjà : maintenant, en rythme', min: 2,
        body: `<p>Tu es à l'aise avec les arpèges : on va les rendre <b>réguliers et en place</b> avec le métronome, en utilisant la technique des doigts <b>p-i-m-a</b>.</p>`,
        objectives: ['Attribuer un doigt à chaque corde (p-i-m-a)', 'Trouver la basse de chaque accord', 'Arpéger en croches parfaitement égales', 'Jouer Someone Like You'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'theory', title: 'La main droite p-i-m-a', min: 6,
        body: `<ul><li><b>P</b> (pouce) : les basses, cordes 6, 5 et 4</li><li><b>i</b> (index) : corde 3 (Sol)</li><li><b>m</b> (majeur) : corde 2 (Si)</li><li><b>a</b> (annulaire) : corde 1 (Mi aigu)</li></ul>
<p>Le pouce joue toujours la <b>basse de l'accord</b> (la fondamentale) : corde 6 pour G et Em, corde 5 pour C et Am, corde 4 pour D. Dans les tablatures de l'appli, elle est en <b>orange</b>.</p>
${C('tip', "Pose la main au-dessus des cordes, chaque doigt « devant » sa corde. Ce sont les doigts qui bougent, pas la main.")}
${C('tip', "L'arpège est aussi du rythme : chaque note tombe sur une croche. Compte « 1 & 2 & » comme pour le grattage.")}`,
      },
      { kind: 'video', title: 'Des arpèges faciles', min: 7, video: 'l7', body: '' },
      { kind: 'practice', id: 'l7-pima', title: 'P-i-m-a en noires', min: 6,
        body: '<p>Pouce, index, majeur, annulaire : une note par temps, sur C puis Am.</p>', pr: { bars: ['C', 'Am'], pattern: 'B.3.2.1.', bpm: 60, target: 100, inc: 5 } },
      { kind: 'practice', id: 'l7-croches', title: 'Arpège en croches', min: 7,
        body: '<p>Le motif de Someone Like You : P i m a m i m i. Toutes les notes doivent avoir le même volume.</p>', pr: { bars: ['G', 'Em', 'C', 'D'], pattern: 'B3212321', bpm: 50, target: 68, inc: 3 } },
      { kind: 'practice', id: 'l7-ecoute', title: 'Contrôle au micro', min: 5,
        body: '<p>Active le micro : l\'arpège est un excellent test de régularité, chaque note est un coup à placer.</p>', pr: { bars: ['G', 'Em'], pattern: 'B3212321', bpm: 60, target: 80, inc: 4, mic: true } },
      { kind: 'song', song: 'someonelikeyou', min: 10, body: '<p>Capo en case 2. Laisse sonner les notes, ne coupe pas entre les accords.</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 8
  {
    id: 8, theme: 'Accords', title: 'Le Fa barré, sans douleur', subtitle: 'Le passage obligé, en trois paliers.',
    minutes: 55, song: 'nowoman', bonus: ['champs'],
    steps: [
      { kind: 'intro', title: 'Le Fa barré, étape par étape', min: 2,
        body: `<p>Le Fa barré fait peur à tout le monde. La bonne nouvelle : c'est surtout une question de <b>position</b>, pas de force. On y va en 3 paliers : <b>Fmaj7 → Fa petit barré → Fa barré complet</b>.</p>`,
        objectives: ['Comprendre la mécanique du barré', 'Jouer Fmaj7 et le Fa petit barré', 'Faire sonner le Fa barré complet', 'Jouer No Woman, No Cry'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'theory', title: 'La mécanique du barré', min: 7,
        body: `<ol><li><b>L'index sur le côté</b> : tourne-le légèrement vers la tête de la guitare pour utiliser son côté osseux, plus dur.</li>
<li><b>Tout près de la frette</b> : l'index se place juste derrière la barrette métallique, pas au milieu de la case.</li>
<li><b>Le pouce derrière</b> le manche, en face du majeur, pas au-dessus.</li>
<li><b>Le poids du bras</b> : tire légèrement le coude vers toi au lieu de serrer avec le pouce. C'est le geste clé.</li>
<li><b>Vérifie corde par corde</b> : joue chaque corde séparément et corrige celle qui frise.</li></ol>
${C('warn', "Si ta main fatigue, relâche ! Des sessions courtes (2-3 minutes) tous les jours valent mieux qu'une longue séance douloureuse.")}`,
      },
      { kind: 'video', title: "Apprendre l'accord de Fa", min: 8, video: 'l8', body: '' },
      { kind: 'practice', id: 'l8-palier', title: 'Palier 1 et 2 : Fmaj7 puis F simplifié', min: 6,
        body: '<p>C → Fmaj7, puis C → F (petit barré, 2 cordes aiguës). Les deux te permettent déjà de jouer les morceaux pendant que le grand barré progresse.</p>', pr: { bars: ['C', 'Fmaj7', 'C', 'Fs'], pattern: 'd.dud.du', bpm: 60, target: 90, inc: 5 } },
      { kind: 'practice', id: 'l8-test', title: 'Palier 3 : le test corde par corde', min: 6,
        body: '<p>Pose le Fa barré et joue les cordes une par une, de la 6e à la 1re. Chaque note doit sonner. Corrige ce qui frise, puis recommence.</p>', pr: { bars: ['F'], pattern: '6.5.4.3.2.1.', beats: 6, steps: 2, bpm: 50, target: 80, inc: 5 } },
      { kind: 'changes', title: 'Une minute de changements', min: 6, body: '<p>Le changement vers le Fa est le vrai défi : entraîne-le avec le chrono.</p>', pairs: [['C', 'F'], ['Am', 'F'], ['F', 'G']] },
      { kind: 'practice', id: 'l8-grille', title: 'La grille complète', min: 6,
        body: '<p>C G Am F : la progression la plus jouée au monde. Si le Fa barré n\'est pas encore prêt, prends le Fa simplifié, sans t\'arrêter.</p>', pr: { bars: ['C', 'G', 'Am', 'F'], pattern: 'd.dud.du', bpm: 55, target: 80, inc: 5 } },
      { kind: 'song', song: 'nowoman', min: 10, body: '<p>Bonus français plein de Fa : <b>Les Champs-Élysées</b>.</p>' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 9
  {
    id: 9, theme: 'Accords', title: 'Les accords barrés mobiles', subtitle: 'Une forme, douze accords.',
    minutes: 50, song: 'creep',
    steps: [
      { kind: 'intro', title: 'La magie des formes mobiles', min: 2,
        body: `<p>Un accord barré n'a <b>pas de cordes à vide</b> : tu peux donc le faire glisser sur le manche pour obtenir n'importe quel accord. Deux formes suffisent pour jouer presque tout.</p>`,
        objectives: ['Comprendre les formes « Mi » et « La » barrées', 'Trouver un accord sur le manche', 'Jouer Bm, B et Cm', 'Jouer Creep'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'theory', title: 'Forme Mi et forme La', min: 7,
        body: `<p><b>Forme Mi (comme le Fa)</b> : la basse est sur la <b>6e corde</b>. Case 1 = F, case 3 = G, case 5 = A, case 7 = B.</p>
<p><b>Forme La (comme le Si mineur)</b> : la basse est sur la <b>5e corde</b>. Case 2 = B / Bm, case 3 = C / Cm, case 5 = D / Dm.</p>
<p>Majeur ou mineur ? Il suffit de changer un doigt : compare la forme de Mi et de Mi mineur, de La et de La mineur.</p>
${C('tip', "Les notes de la 6e corde : F (1), G (3), A (5), B (7), C (8). Sur la 5e corde : B (2), C (3), D (5), E (7).")}`,
      },
      { kind: 'video', title: 'Les accords barrés pour débutants', min: 8, video: 'l9', body: '' },
      { kind: 'practice', id: 'l9-glisse', title: 'Faire glisser la forme', min: 5,
        body: '<p>Forme Mi barrée : F (case 1) → G (case 3) → A (case 5). Garde la forme serrée en glissant, relâche à peine la pression.</p>', pr: { bars: ['F', 'G3', 'A5', 'G3'], pattern: 'd.d.d.d.', bpm: 55, target: 80, inc: 5 } },
      { kind: 'changes', title: 'Une minute de changements', min: 6, body: '', pairs: [['G', 'B'], ['C', 'Cm'], ['Am', 'Bm']] },
      { kind: 'practice', id: 'l9-grille', title: 'La grille de Creep', min: 8,
        body: '<p>G → B → C → Cm, deux mesures chacun. Le passage C → Cm (ouvert → barré case 3) est le plus délicat.</p>', pr: { bars: ['G', 'G', 'B', 'B', 'C', 'C', 'Cm', 'Cm'], pattern: 'd.dud.du', bpm: 60, target: 92, inc: 4 } },
      { kind: 'song', song: 'creep', min: 10, body: '' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 10
  {
    id: 10, theme: 'Technique', title: 'La basse alternée (boom-chick)', subtitle: 'Le son folk et country.',
    minutes: 45, song: 'countryroads',
    steps: [
      { kind: 'intro', title: 'Une guitare qui sonne comme un groupe', min: 2,
        body: `<p>La basse alternée, c'est jouer <b>la basse et l'accord séparément</b> : le pouce fait la basse sur les temps 1 et 3, le médiator (ou les doigts) gratte les aigus sur 2 et 4. Ta guitare sonne d'un coup comme basse + guitare.</p>`,
        objectives: ['Trouver basse et basse alternée de chaque accord', 'Jouer le boom-chick en rythme', 'Ajouter des remontées', 'Jouer Country Roads'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'theory', title: 'Basse et basse alternée', min: 6,
        body: `<p>Pour chaque accord : une <b>basse</b> (fondamentale) sur le 1, une <b>basse alternée</b> sur le 3.</p>
<ul><li><b>G</b> : corde 6 (case 3), puis corde 4 à vide</li><li><b>C</b> : corde 5 (case 3), puis corde 6 (case 3) en déplaçant l'annulaire</li><li><b>D</b> : corde 4 à vide, puis corde 5 à vide</li><li><b>Em</b> : corde 6 à vide, puis corde 5 (case 2)</li></ul>
<p>Les tablatures de l'appli montrent chaque basse en orange.</p>
${C('tip', 'Commence par « boom-chick » simple (basse, accord, basse alt., accord) avant d\'ajouter les remontées.')}`,
      },
      { kind: 'video', title: 'Les basses alternées', min: 7, video: 'l10', body: '' },
      { kind: 'practice', id: 'l10-boom', title: 'Boom-chick simple', min: 6,
        body: '<p>Basse – accord – basse alt. – accord, une note par temps.</p>', pr: { bars: ['G', 'C'], pattern: 'B.d.A.d.', bpm: 60, target: 100, inc: 5 } },
      { kind: 'practice', id: 'l10-full', title: 'Avec les remontées', min: 8,
        body: '<p>Basse, (vide), bas-haut, basse alt., (vide), bas-haut. Le pendule continue !</p>', pr: { bars: ['G', 'Em', 'D', 'C'], pattern: 'B.duA.du', bpm: 55, target: 82, inc: 4 } },
      { kind: 'song', song: 'countryroads', min: 12, body: '' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 11
  {
    id: 11, theme: 'Technique', title: 'Étouffé, palm mute et chuck', subtitle: 'Le relief et le groove.',
    minutes: 45, song: 'getlucky',
    steps: [
      { kind: 'intro', title: 'Jouer avec le silence', min: 2,
        body: `<p>Les rythmiciens qui groovent jouent autant avec les <b>sons étouffés</b> qu'avec les accords. Deux techniques : le <b>palm mute</b> (son feutré) et le <b>chuck</b> (coup percussif sec).</p>`,
        objectives: ['Jouer en palm mute', 'Faire un chuck propre sur 2 et 4', 'Combiner accords et coups étouffés', 'Jouer Get Lucky'] },
      { kind: 'tuner', title: 'Accorde ta guitare', min: 2 },
      { kind: 'theory', title: 'Palm mute et chuck', min: 6,
        body: `<p><b>Palm mute (PM)</b> : le tranchant de la main droite repose légèrement sur les cordes, juste devant le chevalet. Le son devient sourd et rond. Trop loin du chevalet = plus de note ; trop près = pas d'effet.</p>
<p><b>Chuck (✕)</b> : en grattant vers le bas, la paume vient frapper et étouffer les cordes en même temps. Résultat : un « tchk » percussif, comme une caisse claire. On le place souvent sur les temps 2 et 4.</p>
${C('tip', "Variante main gauche : relâche la pression des doigts (sans les décoller) pour étouffer. Pratique avec les barrés comme dans Get Lucky.")}`,
      },
      { kind: 'video', title: 'Étouffer les cordes en rythme', min: 7, video: 'l11', body: '' },
      { kind: 'practice', id: 'l11-pm', title: 'Palm mute en croches', min: 5,
        body: '<p>Croches vers le bas en palm mute sur Em, puis on relâche la paume sur le 4 (accent ouvert).</p>', pr: { bars: ['Em'], pattern: 'ppppppDu', bpm: 70, target: 110, inc: 5 } },
      { kind: 'practice', id: 'l11-chuck', title: 'Le chuck sur 2 et 4', min: 7,
        body: '<p>B · ✕H B · ✕H : le chuck remplace le coup bas sur 2 et 4.</p>', pr: { bars: ['Am', 'G'], pattern: 'd.xud.xu', bpm: 60, target: 100, inc: 5 } },
      { kind: 'practice', id: 'l11-lucky', title: 'La boucle de Get Lucky', min: 7,
        body: '<p>Bm7 D F#m7 E avec le chuck. Laisse la main très souple.</p>', pr: { bars: ['Bm7', 'D', 'F#m7', 'E'], pattern: 'd.xud.xu', bpm: 70, target: 116, inc: 5 } },
      { kind: 'song', song: 'getlucky', min: 10, body: '' },
      { kind: 'review', min: 2 },
    ],
  },
  // ============================================================ 12
  {
    id: 12, theme: 'Bilan', title: 'Un morceau de A à Z', subtitle: 'Tout mettre ensemble, comme un vrai musicien.',
    minutes: 60, song: 'wonderwall',
    steps: [
      { kind: 'intro', title: 'La leçon bilan', min: 2,
        body: `<p>Tu as tous les outils : pulsation, pendule, syncope, accents, changements rapides. Aujourd'hui, on apprend un morceau <b>complet</b> avec la méthode des musiciens professionnels.</p>`,
        objectives: ['Découper un morceau en sections', 'Travailler en boucles lentes', 'Monter au tempo réel', "S'enregistrer pour s'écouter"] },
      { kind: 'tuner', title: 'Accorde ta guitare (capo en case 2)', min: 2 },
      { kind: 'theory', title: 'La méthode pour apprendre un morceau', min: 6,
        body: `<ol><li><b>Écouter</b> le morceau 2-3 fois en comptant les temps et en repérant les sections.</li>
<li><b>Découper</b> : intro, couplet, refrain… on apprend chaque section séparément.</li>
<li><b>Boucler lentement</b> : chaque section en boucle à 60-70 % du tempo, jusqu'à 3 passages parfaits.</li>
<li><b>Coudre</b> : enchaîner deux sections, en soignant la transition.</li>
<li><b>Monter le tempo</b> : +5 BPM à chaque réussite.</li>
<li><b>S'enregistrer</b> avec ton téléphone : on entend des choses qu'on ne remarque pas en jouant.</li></ol>`,
      },
      { kind: 'practice', id: 'l12-echauffement', title: 'Échauffement : revue des rythmiques', min: 5,
        body: '<p>Enchaîne les motifs appris : noires, B · BH B · BH, puis la syncope. Change de motif toutes les 4 mesures en modifiant le menu « Motif ».</p>', pr: { bars: ['Em7', 'Gw', 'Dsus4', 'A7sus4'], pattern: 'd.du.udu', bpm: 65, target: 87, inc: 4, patterns: ['d.d.d.d.', 'd.dud.du', 'd.du.udu'] } },
      { kind: 'changes', title: 'Les changements de Wonderwall', min: 5, body: '<p>Annulaire et auriculaire restent ancrés en case 3 : seuls l\'index et le majeur bougent.</p>', pairs: [['Em7', 'Gw'], ['Dsus4', 'A7sus4'], ['Cadd9', 'Dsus4']] },
      { kind: 'video', title: 'Wonderwall en vidéo', min: 10, video: 'wonderwall', body: '' },
      { kind: 'song', song: 'wonderwall', min: 25, body: '<p>Section par section : couplet, puis pré-refrain, puis refrain. Utilise « Jouer avec l\'appli » sur chaque section avant d\'enchaîner.</p>' },
      { kind: 'review', min: 3 },
    ],
  },
];

export const lessonById = (id) => LESSONS.find((l) => l.id === Number(id));
export const REVIEW_QUESTIONS = [
  { k: 'tempo', q: 'Je garde le tempo sans accélérer ni ralentir' },
  { k: 'changes', q: "Mes changements d'accords tombent à temps" },
  { k: 'song', q: 'Je joue le morceau du début à la fin' },
];
