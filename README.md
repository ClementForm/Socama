# SOCAMA Ingénierie – Intégration HTML/CSS

Intégration statique du site SOCAMA (HTML + CSS + un peu de JS, sans framework ni build).
Ouvrir `index.html` dans un navigateur suffit.

## Arborescence

```
Socama/
├── index.html            Page d'accueil
├── socama.html           Page "La société"
├── eau-potable.html, assainissement.html, milieux-aquatiques.html,
│   eaux-pluviales.html, paysages-vrd.html, electrification-eclairage.html
│                         Une page par domaine (même gabarit)
├── maitrise-oeuvre.html, assistance-maitrise-ouvrage.html, etude.html
│                         Une page par mission (même gabarit)
├── references.html       Références (liste filtrable par domaine)
├── realisation-*.html    Une page par référence (même gabarit, 17 pages)
├── nos-agences.html      Liste des agences
├── agence-*.html         Une page par agence (6, même gabarit)
├── ef-etudes.html        Filiale EF Études
├── engagement-rse.html   Engagement / RSE
├── carrieres.html        Carrières (offres + candidature spontanée)
├── socamag.html          Soca'mag : blog (article à la une + liste filtrable)
├── article-*.html        Pages article (modèle : article-reservoir-laveau.html)
├── css/style.css         Styles (un seul fichier, découpé en sections numérotées)
├── js/main.js            Interactions (menu, header, animations, carrousel, schémas)
├── fonts/                Gilroy (Regular 400, Medium 500, SemiBold 600, Bold 700)
├── images/
│   ├── logo-socama.svg   Logo blanc (pour fond bleu)
│   ├── icone-socama.svg  Symbole SOCAMA seul (dans le rond bleu)
│   ├── hero/             Photos de la hero (PNG transparents, déjà découpés en pilules)
│   ├── icones/           Icônes des domaines d'expertise (SVG)
│   └── decor/            Dessins techniques et formes décoratives
└── maquettes/            Maquettes de référence + logos originaux (ne pas mettre en ligne)
```

## Conventions

- **Nommage BEM** : `.bloc`, `.bloc__element`, `.bloc--variante`
  (ex. `.hero__pill--jaune`).
- **Couleurs, police, largeurs** : uniquement via les variables CSS dans `:root`
  (section 2 de `style.css`).
- **Largeur du contenu** : `.container` (1544px max, soit 188px de marge sur un écran de 1920px).
- **Breakpoints** :
  - `≤ 1240px` : le menu passe en burger plein écran
  - `≤ 900px` : la hero s'empile (texte puis photos)

## Hero (page d'accueil)

- Fond bleu avec un grand arrondi en bas à gauche (`border-bottom-left-radius`).
- La mosaïque `.hero__visuals` occupe 58% de la largeur, collée en bas à droite.
  Chaque pilule est placée en **% de ce bloc** : la composition se redimensionne
  avec l'écran sans rien recalculer.
  Repère : sur la maquette 1920px, le bloc fait 1120 × 753px.
- 9 emplacements numérotés `.hero__pill--1` à `--9`, chacun = carte à 2 faces
  (recto : photo ou pilule de couleur `.hero__pill-color` ; verso : `.hero__pill-back`).
  Les pilules de couleur sont des images (`images/hero/pilule-jaune.png`,
  `pilule-verte.png`) générées à partir de la découpe des photos : même forme
  exacte, donc alignement parfait quand photos et couleurs échangent leur place.
  ⚠ Toute nouvelle photo de la hero doit être découpée avec le même gabarit (387 × 216 px).
- **Animation** (`js/main.js`) : les emplacements `data-swap` se retournent 2 par 2
  et échangent leur recto (une photo peut prendre la place d'une pilule de couleur).
  Les emplacements `data-flip` (photos déjà coupées au bord) se retournent seulement.
  Rythme réglable via les constantes en haut du bloc (`FIRST_DELAY`, `SWAP_INTERVAL`…).
- Les photos `hero-seuil-riviere.png`, `hero-rue.png` et `hero-canalisation.png`
  sont **déjà coupées** (bord droit / bas) : elles restent à leur place.

## Composants réutilisables

- `.section-head` > `.section-title` + `.section-subtitle` : en-tête de section centré.
  Mettre une partie du titre en orange avec `<span class="text-orange">`,
  et les mots importants du sous-titre dans un `<strong>` (bleu semi-gras).
- `.btn.btn--orange` (+ `.btn--large` dans le contenu) : bouton à la forme "penchée"
  (variable `--radius-btn`).
- `.expertise-card` : carte icône + libellé (zone icône de hauteur fixe,
  icônes calées en bas pour aligner les libellés).
- `.metier-card` : carte avec photo en goutte qui dépasse en haut
  (`.metier-card__photo`, PNG transparent), titre et liste à puces orange.
- `.section-cta` : bouton centré sous un groupe de cartes.
- `.carousel__track` + `.carousel__slide` : carrousel horizontal en CSS natif
  (scroll-snap) — trackpad et doigt fonctionnent sans JS ; le JS gère les flèches
  `[data-carousel="prev|next"]` et le cliquer-glisser à la souris (avec calage
  sur la carte la plus proche et blocage du clic après un glisser). Pour ajouter une réalisation,
  dupliquer un `<li class="carousel__slide">`.
- `.realisation-card` : carte photo + étiquette de catégorie + titre/lieu + flèche.
  Photos au format 493 × 269 px (ou plus grand dans le même ratio), dans
  `images/realisations/`. ⚠ Textes des cartes provisoires (repris de la maquette).
- Header sticky (`.header`) : fixé en haut. Le JS ajoute `.is-scrolled`
  (barre flottante en verre dépoli, logo couleur `logo-socama-couleur.svg`) et met
  à jour `--progress` (barre de progression de lecture). Toujours visible.
  Seuil réglable en haut du bloc dans `js/main.js` (`SCROLLED_AFTER`).
- `.btn--outline` : bouton contour blanc, pour fond bleu (pied de page).
- Pied de page (`.footer`) : bandeau d'appel à l'action, logo + badge blanc des
  certifications, 3 colonnes de liens, barre du bas (légal, LinkedIn, retour en haut).
  ⚠ Liens `href="#"` à remplacer, et URL LinkedIn à renseigner.
- `.btn-arrow` : bouton rond orange avec flèche (cartes réalisations et articles),
  pivote au survol de la carte.
- `.article-card` : carte article du Soca'mag (photo, titre, extrait coupé
  automatiquement à 5 lignes, temps de lecture avec icône chrono, flèche).
  Le bas de carte reste aligné quelle que soit la longueur du texte.
- `.rse-photo` : photo du collage RSE avec cadre coloré incliné derrière
  (`::before`, réglé par les variables `--frame-color` et `--frame-transform`)
  et étiquette `.rse-photo__label`. Le collage a une taille fixe (687 × 624 px)
  et est réduit avec `zoom` sur petits écrans.
- `<br class="br-desktop">` : retour à la ligne forcé uniquement sur ordinateur
  (masqué sous 900px pour éviter les mots orphelins sur mobile).
- `.stat` : bulle de chiffre clé (nombre + libellé). Dans la section "À propos",
  les bulles sont placées en % de l'image du château d'eau et dimensionnées en
  `cqw` (container query) : elles restent proportionnelles au dessin.

## Pages intérieures (ex. socama.html)

- Le header et le pied de page sont **copiés à l'identique** dans chaque page :
  à factoriser (include PHP, partial, composant…) lors de l'intégration dans le CMS.
  Le lien de la page en cours porte `class="nav__link is-active" aria-current="page"`.
- Composants communs (fin de `style.css`, bloc "PAGES INTÉRIEURES") :
  - `.page-hero` : hero de page (fil d'Ariane, titre, intro) + visuel.
    Même hauteur que la hero d'accueil (`min-height: max(640px, 44.4vw)`), contenu centré verticalement.
    `.page-hero__visual` : photo en forme de feuille avec aplat incliné,
    photo ronde, points de couleur
  - `.reveal` : apparition en fondu au défilement (JS), en cascade entre voisins
  - `[data-counters]` : zone dont les nombres `[data-count]` s'animent à l'apparition
- Valeurs (`[data-values]`) : accordéon `.value-item` (titre = bouton) + une photo
  `.value-visual` par valeur, dans le même ordre (photos en arche, format 1000 × 1200 px,
  dans `images/valeurs/` ; le rond décoratif `.values__circle` suit la couleur active). Lecture automatique : la barre
  `.value-item__progress` se remplit (`--values-duration`, 6s), puis la valeur suivante
  s'ouvre ; pause au survol, uniquement quand la section est à l'écran.
- Page Socama : chiffres clés, valeurs, frise des étapes (`.timeline` : cartes en
  quinconce reliées par une canalisation SVG `.timeline__pipe` (eau en dégradé, vaguelettes
  déformées par un filtre SVG, bulles `.timeline__bubble` qui suivent le tracé via
  `offset-path` ; tracé recalculé en JS à la largeur réelle), numéros dans une pilule penchée `.timeline__dot` ; frise verticale sous 1100px), cartes agences avec barre de composition d'équipe (`.team-bar`,
  largeurs en `style="--w: 60%"`), équipe de direction (portraits carrés 400 × 400 px
  dans `images/equipe/`, affichés en rond dans `.person__avatar`), certifications.
  ⚠ Coordonnées de l'antenne de Château-Thierry à compléter.
- Menu principal (calé sur l'arborescence) : Nos domaines · Missions · Références · Socama ·
  Carrières · Articles · bouton Contact. Identique dans chaque page.
  - `.nav__item--mega` : volet pleine largeur (liste `.mega__list` + encart bleu `.mega__aside`),
    utilisé pour "Nos domaines" (6 icônes), "Missions" (photos rondes `.mega__icon--photo`)
    et "Socama" (pilules `.mega__pill`, liste sur 2 colonnes `.mega__list--2`).
  - Tous portent `.nav__item--menu` : ouverture au survol / focus (CSS) ou au clic
    (`.is-open`, JS bloc "Menus déroulants du header"), un seul ouvert à la fois,
    fermeture au clic extérieur ou Échap. Sur mobile (≤ 1240px) : accordéons.
  - Page en cours : bouton parent `.is-active`, lien `.is-current`.
  - ⚠ Liens `href="#"` pour les pages pas encore créées (Contact).
- Pages domaine (CSS : bloc "PAGE DOMAINES", sections D1 à D7) :
  - 6 pages domaine, même gabarit : hero de page, présentation `.domain` (icône
    `.domain__icon`, prestations `.domain-feature`, badge `.domain-badge`, photo
    `.shape-photo`), bloc spécifique, puis cartes métiers.
  - Blocs spécifiques : schéma du cycle de l'eau (eau potable, assainissement),
    référence en chiffres `.ref-highlight` (assainissement, milieux aquatiques),
    démarche en 3 cartes (eaux pluviales), approche paysagère `.landscape` (paysages).
  - `.shape-photo` : photo de domaine, **une forme par domaine** via un modificateur :
    `--goutte` (eau potable), `--bulles` (assainissement), `--galet` (milieux aquatiques),
    `--pluie` (eaux pluviales), `--feuille` (paysages), `--hexagone` (électrification).
    Forme pleine colorée derrière + détail décoratif (photos 1000 × 1200 px, `images/domaines/`).
  - `[data-scene]` / `.water-scene` : schéma du cycle de l'eau = paysage en coupe dessiné
    en SVG (viewBox 1200 × 560). Les ouvrages `g[data-step]`, les pastilles
    `.water-scene__spot` (placées en % via `--x`/`--y`) et la barre d'étapes partagent
    le même `data-step` ; le JS leur ajoute `.is-active`. Étape de départ :
    `data-scene-start` (4 = collecte sur la page Assainissement). Flèches précédent/suivant
    dans la carte. Lecture auto pilotée par la fin de l'animation de la barre
    (`--scene-duration`). Sous 760px : pastilles masquées, carte sous le dessin.
  - ⚠ Photos issues du site actuel socama.fr (droits à confirmer). Textes de la page
    Eaux pluviales à valider (le site actuel en dit peu sur ce domaine).
- Pages missions (CSS : bloc "PAGES MISSIONS", sections M1 à M5) : même gabarit que les
  pages domaine (hero, présentation `.domain`, bloc `.domain-block--light`), plus :
  - formes de photo `.shape-photo--penchee` (maîtrise d'œuvre), `--bulle` (AMO),
    `--loupe` (étude) ; icône de mission `.domain__icon--photo` ;
  - `.phases` / `.phase` : cartes d'étapes avec sigle dans une pilule penchée
    (`--phase-color`), `.phases--5` pour 5 colonnes ;
  - `.regulatory` : liste des dossiers réglementaires (page Étude) ;
  - `.domain-links` / `.domain-link` : liens vers les 6 domaines en bas de page.
  - Photos issues du site actuel (dont 2 photos libres Pexels sur la page AMO).
- Page Références (CSS : bloc "PAGE RÉFÉRENCES") :
  - Hero : mosaïque `.hero-mosaic` (4 tuiles en quinconce) + pastille du nombre de références
    (⚠ à mettre à jour à la main si on ajoute des références).
  - 17 références issues de socama.fr, photos dans `images/references/` (986 × 538 px).
  - Cartes = composant `.realisation-card` de l'accueil, variante `--detail` (texte,
    puces mission / maître d'ouvrage / montant, étiquette à la couleur du domaine).
  - Filtres `.ref-filter[data-filter]` ↔ cartes `li[data-domain]` (clé = nom de la page
    domaine). Seuls les domaines ayant au moins une référence ont un bouton.
    Lien direct filtré : `references.html?domaine=assainissement` (utilisé par les pages domaine).
  - Chaque carte (page Références et carrousel de l'accueil) est un lien vers sa page
    `realisation-<id>.html`. L'ancre `#ref-…` reste disponible.
- Pages réalisation (`realisation-*.html`, bloc "PAGES RÉALISATION" de `style.css`) :
  - Hero : photo à encoche ronde + pastille `.projet-stamp` (icône du domaine + années),
    ville surlignée dans le titre, étiquette `.projet-tag` (point à la couleur du domaine).
  - `.projet-facts` : fiche (maître d'ouvrage, mission, période, délai, montant) ;
    une info inconnue = la ligne est simplement absente.
  - `.projet` : texte + liste des travaux, et carte `.projet-figures` (chiffres clés,
    couleur du domaine via `--domain-color`).
  - `.projet-gallery__grid--1` à `--4` : galerie selon le nombre de photos
    (`images/references/<id>/1.jpg`, `2.jpg`…). Pas de photo = pas de section.
  - `.projet-others` : 3 autres réalisations (même domaine en priorité).
  - Textes repris et reformulés des fiches de socama.fr.
  - ⚠ À compléter : références pour Eaux pluviales et Électrification ; classement par
    "secteurs" prévu dans l'arborescence (à définir) ; pages détail éventuelles.
- Pages du menu "Socama" (CSS : bloc "PAGES SOCAMA", sections S1 à S6) :
  - `nos-agences.html` : hero photo d'équipe + étiquettes de villes `.hero-pin` qui
    flottent ; section bleue des agences (même composant que socama.html) avec lien
    `.agency-card__link` vers chaque page ; bandeau `.network` vers EF Études.
  - `agence-*.html` : hero portrait de l'interlocuteur (`.agence-portrait`, `.agence-person`),
    3 cartes d'infos `.agence-fact` (adresse + lien itinéraire Google Maps, contact, équipe),
    réalisations du secteur (cartes reprises de references.html), liens `.agence-link`
    vers les autres agences. ⚠ Château-Thierry : coordonnées à compléter.
  - `ef-etudes.html` : contenu issu de ef-etudes.fr (filiale, 22 collaborateurs, 9 sites,
    clients). Hero photo "polaroïd" `.ef-photo` + logo `.ef-logo` ; chiffres `.key-figures`.
  - `engagement-rse.html` : hero = collage RSE de l'accueil ; certifications ;
    index égalité `.equality` (⚠ chiffres 2025 à mettre à jour chaque année).
  - L'arborescence prévoit "Haillan ×9" (10 agences) : seules les 6 du site actuel existent.
- Page Carrières (CSS : bloc "PAGE CARRIÈRES") :
  - Pourquoi nous rejoindre (`.landscape-card`), métiers `.profile` (effectifs = somme
    des équipes d'agences : 32 ingénieurs, 22 techniciens, 5 assistantes).
  - Offres : `.jobs__list` vide pour l'instant -> bloc `.jobs__empty` affiché. Modèle de
    carte `.job-card` en commentaire dans le HTML : dupliquer et supprimer `.jobs__empty`.
  - Formulaire de candidature spontanée `.apply-form` (champs `.field`) :
    ⚠ statique, à brancher (envoi, pièce jointe CV, consentement RGPD).
  - Les boutons "Rejoindre l'équipe" (pied de page) et "Voir nos offres" (accueil, Socama)
    pointent vers cette page.
- Soca'mag (CSS : bloc "SOCA'MAG", sections M1 à M4) — entrée "Soca'mag" du menu
  (l'arborescence l'appelle "Articles") :
  - `socamag.html` : hero "couvertures en éventail" `.mag-cover` ; article à la une
    (composant `.ref-highlight`, variante `--link`) ; liste `.article-card` (composant de
    l'accueil + `.article-card__meta` catégorie · date) filtrable par catégorie avec le même JS
    que les Références (`[data-references]`, `.ref-filter`, `data-domain`) ; lien direct
    `socamag.html?domaine=chantiers`.
  - Articles repris des actualités de socama.fr (2019-2022) + les 3 dossiers de l'accueil.
    ⚠ Seul l'article "Laveau" a sa page ; les autres liens (`href="#"`) sont à créer.
  - `article-reservoir-laveau.html` = **modèle de page article**, volontairement simple :
    hero (catégorie, date, temps de lecture, titre, photo de couverture) puis une colonne de
    lecture `.article__content` qui reçoit **le contenu brut de l'éditeur du CMS** :
    `<p>`, `<h2>`, `<h3>`, `<ul>`/`<ol>`, `<blockquote>`, `<figure><img><figcaption>`, `<a>`.
    Aucune classe à ajouter : le CSS met en forme les balises (le 1er paragraphe sert de chapô,
    puces en pilules orange, images arrondies, citation avec filet vert). Puis "À lire aussi".
## Pour la prod

- Convertir les polices `.ttf` en `.woff2` et mettre à jour les `@font-face`.
- Vérifier la licence web de Gilroy.
- Convertir les PNG de la hero en WebP si besoin (gain de poids).
- Remplacer les liens `href="#"` du menu par les vraies URLs.

## Responsive (fin de `style.css`, bloc « RESPONSIVE – RÉVISION GLOBALE »)

Points de rupture utilisés dans tout le fichier : 1300 px, 1100 px, 900 px (passage mobile : menu burger,
gouttière 20 px, texte 16 px) et 760 px (téléphone).

- **Aucun débordement horizontal** : `overflow-x: clip` sur `html, body` (les formes décoratives
  qui dépassent sont coupées ; `clip` ne casse pas les éléments `sticky`).
- **Listes à faire glisser (≤ 760 px)** : les cartes ne s'empilent plus, elles passent sur une ligne
  qui défile au doigt (scroll-snap), la carte suivante dépasse à droite. Concerne : cartes métiers,
  articles, réalisations d'une agence, autres réalisations, cartes paysage, direction, certifications,
  agences, offres d'emploi, profils, phases de mission. Pour une nouvelle liste : ajouter son
  sélecteur dans le bloc X2.
- **Références et Soca'mag (≤ 760 px)** : lignes compactes (petite photo + titre + lieu/date),
  filtres sur une ligne que l'on fait glisser.
- **Pied de page mobile** : colonnes « Nos domaines » et « Nos missions » masquées (déjà dans le menu),
  liens SOCAMA sur 2 colonnes.
- **Visuels de hero** : réduits par `zoom` (0.8 sur tablette, 0.46 sur téléphone).
- **Image avant le titre** : dès que deux colonnes s'empilent (hero de toutes les pages, accueil,
  recrutement), le visuel passe au-dessus du texte via `order: -1` (bloc X7). Le HTML ne change pas.
- **Menu mobile (≤ 1240 px, bloc X8)** : ouverture en cercle depuis le burger (`clip-path`), liens qui
  apparaissent en cascade, page en cours = pilule jaune, volets en accordéon dans des cartes blanches
  (`grid-template-rows: 0fr → 1fr`), bas de menu avec bouton Contact + coordonnées (`.nav__infos`,
  masqué sur ordinateur) et pilules décoratives verte / jaune.
