# Gratte — cours de guitare folk

Appli web installable (PWA) pour progresser à la guitare : 12 leçons de 30 à 60 min centrées sur le rythme, un morceau célèbre par leçon, un accordeur, un métronome, l'écoute du rythme au micro et le suivi de la progression.

Aucune étape de compilation : ce sont des fichiers HTML/CSS/JS statiques.

## Lancer en local

```bash
cd ~/guitare-app
python3 -m http.server 5173
```

Puis ouvrir http://localhost:5173. Le micro ne marche qu'en `localhost` ou en HTTPS.

## Mettre en ligne (GitHub Pages) et installer sur Android

1. Crée un dépôt sur GitHub (par exemple `gratte`) et pousse ce dossier dessus.
2. Dans le dépôt : **Settings › Pages › Build and deployment** : source « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. L'appli est en ligne au bout d'une minute sur `https://<ton-pseudo>.github.io/gratte/`.
4. Sur ton téléphone Android, ouvre cette adresse dans Chrome, puis **⋮ › Ajouter à l'écran d'accueil** (ou « Installer l'application »).

Après une mise à jour, l'appli se met à jour toute seule à l'ouverture suivante. Si un vieux fichier reste en cache, change `VERSION` dans `sw.js`.

## Synchronisation entre appareils (Supabase, gratuit)

Sans cette étape, la progression est sauvegardée sur chaque appareil (avec export/import dans Outils › Réglages).

1. Crée un compte sur https://supabase.com et un nouveau projet.
2. Dans **SQL Editor**, exécute :

```sql
create table public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table public.progress enable row level security;
create policy "chacun sa progression" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

3. Dans **Authentication › Sign In / Providers › Email** : tu peux désactiver « Confirm email » pour ne pas avoir à confirmer l'adresse.
4. Dans **Project Settings › API**, copie la *Project URL* et la clé *anon public* dans `js/config.js`.
5. Republie l'appli, puis connecte-toi dans **Outils › Réglages** avec le même compte sur le téléphone et l'ordinateur.

## Organisation du code

- `js/data/lessons.js` : les 12 leçons (étapes, textes, exercices)
- `js/data/songs.js` : les morceaux (grilles mesure par mesure, rythmes, conseils). Pas de paroles, pour respecter le droit d'auteur.
- `js/data/chords.js` : le dictionnaire d'accords (positions, doigtés, basses)
- `js/data/videos.js` : les vidéos YouTube (identifiants vérifiés)
- `js/ui/practice.js` : l'atelier d'entraînement (motif animé, tablature, métronome, guitare de synthèse, micro)
- `js/audio/` : horloge précise, synthèse de guitare (Karplus-Strong), accordeur (YIN) et détection des attaques
- `research/research.json` : notes de recherche (vidéos, grilles des chansons françaises)

### Notation des motifs rythmiques

Un caractère par croche : `d` bas, `u` haut, `D`/`U` accentué, `.` main dans le vide, `x` étouffé (chuck), `p` palm mute,
`B` basse, `A` basse alternée, `1`–`6` corde à pincer (1 = Mi aigu).
