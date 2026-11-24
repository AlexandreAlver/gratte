# Gratte : les prochaines étapes, pas à pas

Compte environ 30 minutes pour les étapes 1 à 4. L'étape 5 (synchronisation) est facultative et prend environ 20 minutes de plus.

---

## Étape 1 : tester sur l'ordinateur (5 min)

1. Ouvre le Terminal (Cmd + Espace, tape « Terminal », Entrée).
2. Colle cette commande puis appuie sur Entrée :
   ```bash
   cd ~/guitare-app && python3 -m http.server 5173
   ```
3. Ouvre Chrome à l'adresse **http://localhost:5173**.
4. Fais un tour : Accueil, Parcours, un morceau, l'Accordeur (autorise le micro quand Chrome le demande).
5. Pour arrêter : reviens dans le Terminal et fais Ctrl + C.

> Sur l'ordinateur, la progression est enregistrée dans le navigateur. Elle sera **séparée** de celle du téléphone tant que l'étape 5 n'est pas faite.

---

## Étape 2 : mettre l'appli en ligne avec GitHub Pages (10 min, sans ligne de commande)

Le téléphone a besoin d'une adresse en **https** pour installer l'appli et utiliser le micro. GitHub Pages la fournit gratuitement.

1. Va sur **https://github.com** et connecte-toi.
2. En haut à droite, clique sur **+** puis **New repository**.
   - *Repository name* : `gratte`
   - Coche **Public**. Avec un compte gratuit, GitHub Pages ne fonctionne qu'avec un dépôt public. Le code sera visible, mais tes données ne le sont pas : elles restent sur tes appareils et dans ton Supabase.
   - Clique **Create repository**.
3. Sur la page du dépôt vide, clique sur le lien **uploading an existing file**.
4. Dans le Finder, ouvre le dossier `guitare-app` (dans ton dossier personnel), sélectionne **tout son contenu** (Cmd + A) et fais-le glisser dans la page GitHub.
   - Fais bien glisser le contenu du dossier, pas le dossier lui-même : `index.html` doit être à la racine du dépôt.
   - Les dossiers cachés (`.git`, `.claude`) ne sont pas visibles dans le Finder : c'est normal, ils ne doivent pas être envoyés.
5. En bas, clique **Commit changes** et attends la fin de l'envoi.
6. Va dans **Settings** (onglet du dépôt) puis **Pages** (menu de gauche).
   - *Source* : **Deploy from a branch**
   - *Branch* : **main** et dossier **/ (root)**, puis **Save**.
7. Attends 1 à 2 minutes et recharge la page : l'adresse s'affiche en haut, du type
   **`https://<ton-pseudo>.github.io/gratte/`**. Ouvre-la pour vérifier.

---

## Étape 3 : installer l'appli sur ton Android (2 min)

1. Sur le téléphone, ouvre **Chrome** à l'adresse de l'étape 2.
2. Touche le menu **⋮** (en haut à droite), puis **Installer l'application** (ou **Ajouter à l'écran d'accueil**).
3. L'icône orange **Gratte** apparaît avec tes applis. Ouvre-la depuis là : elle s'affiche en plein écran, comme une vraie appli.
4. Après la première ouverture, l'appli marche **hors ligne**. Seules les vidéos YouTube demandent une connexion.

---

## Étape 4 : la première séance sur le téléphone (5 min de réglages)

1. **Outils › Accordeur** : touche « Activer le micro » et **autorise le micro**. Accorde les 6 cordes jusqu'à ce qu'elles passent toutes au vert.
2. **Outils › Calibrer l'écoute du rythme** (30 secondes) :
   - Phase 1 : ne joue pas, l'appli mesure le bruit des clics.
   - Phase 2 : cordes étouffées avec la main gauche, un coup sec **pile sur chaque clic**.
   - Si l'appli affiche « Raté », monte la sensibilité et recommence.
   - Avec des écouteurs filaires, c'est encore plus précis.
3. **Outils › Réglages** : choisis ton objectif hebdomadaire. 2 h par semaine, c'est environ 20 minutes par jour.
4. **Accueil › C'est parti** : la leçon 1 commence.

**Le bon rythme de travail :** 2 à 3 leçons par semaine. Entre deux leçons, reprends 10 minutes d'exercices de la précédente avec le bouton **Réussi** pour faire monter le tempo. Tes courbes de progression s'en nourrissent.

**Les comptines** sont sur l'accueil, tout en bas. Elles sont disponibles tout de suite, avec les paroles et les accords au-dessus.

---

## Étape 5 (facultative) : la même progression sur le téléphone et l'ordinateur

Sans cette étape, tu peux aussi transférer ta progression à la main : **Outils › Réglages › Exporter**, puis **Importer** sur l'autre appareil.

1. Va sur **https://supabase.com** et crée un compte. Tu peux te connecter avec GitHub.
2. **New project** :
   - Nom : `gratte`.
   - Mot de passe de base de données : choisis-en un et garde-le de côté. Tu n'en auras pas besoin dans l'appli.
   - Région : **Europe (Paris ou Frankfurt)**.
   - Attends environ 2 minutes que le projet soit prêt.
3. Dans le menu de gauche, ouvre **SQL Editor**, colle ce texte puis clique **Run** :
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
   La dernière partie garantit que chaque compte ne voit que sa propre progression.
4. **Authentication › Sign In / Providers › Email** : désactive **Confirm email** (sinon il faut cliquer un lien reçu par e-mail avant la première connexion), puis **Save**.
5. **Project Settings › API** (ou **Data API**) : repère deux valeurs.
   - **Project URL**, du type `https://abcdefgh.supabase.co`
   - La clé **anon public**, une longue suite de caractères qui commence par `eyJ`. Ne prends **pas** la clé `service_role`, qui est secrète.
6. Sur **GitHub**, dans ton dépôt `gratte`, ouvre le fichier `js/config.js` et clique sur le **crayon** (Edit). Remplis les deux lignes :
   ```js
   export const SUPABASE_URL = 'https://abcdefgh.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJ...';
   ```
   Puis clique **Commit changes**. La clé *anon* est faite pour être publique : la sécurité vient de la règle de l'étape 3.
7. Attends 1 minute, puis sur **chaque appareil** : ouvre l'appli, va dans **Outils › Réglages › Synchronisation**.
   - La première fois, clique **Créer un compte**, avec ton e-mail et un mot de passe.
   - Sur l'autre appareil, clique **Se connecter** avec les mêmes identifiants.
   - La progression déjà présente sur chaque appareil est fusionnée, rien n'est perdu.

---

## Quand l'appli évolue

Si on modifie des fichiers plus tard :
1. Sur GitHub, **Add file › Upload files** et dépose les fichiers modifiés (GitHub remplace les anciens).
2. L'appli se met à jour toute seule à la prochaine ouverture. Si le téléphone garde l'ancienne version, ferme complètement l'appli et rouvre-la deux fois.

## En cas de souci

| Problème | Solution |
|---|---|
| Le micro ne s'active pas | Chrome › ⋮ › Paramètres › Paramètres des sites › Micro : autorise ton adresse `github.io`. |
| Pas de son | Vérifie le mode silencieux et le volume média, puis touche un bouton ▶ : le son ne démarre qu'après un premier toucher. |
| L'écoute du rythme compte des coups en trop | Mets des écouteurs, baisse la sensibilité (Outils › Calibrer), refais la calibration. |
| Page 404 sur GitHub Pages | Vérifie que `index.html` est bien à la racine du dépôt et que Pages est réglé sur `main` / `(root)`. |
| La synchro affiche « Erreur » | Vérifie l'URL et la clé dans `js/config.js` et que le texte SQL de l'étape 5.3 a bien été exécuté. |
