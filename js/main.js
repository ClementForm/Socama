/* ==========================================================================
   SOCAMA – Scripts du site
   ========================================================================== */

/* Indique au CSS que le JS est actif (sinon les éléments animés restent visibles) */
document.documentElement.classList.add('js');


/* --- Menu mobile (burger) ---
   Ajoute/retire la classe "is-open" sur le header.
   Tout l'affichage est géré en CSS (voir section RESPONSIVE). */
const header = document.querySelector('.header');
const burger = document.querySelector('.header__burger');

if (header && burger) {
  burger.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen);
    burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = isOpen ? 'hidden' : ''; // bloque le scroll derrière le menu
  });
}


/* --- Menus déroulants du header ("Nos domaines", "Missions", "Socama") ---
   Sur ordinateur, ils s'ouvrent déjà au survol (CSS). Le clic sur un bouton
   ajoute/retire .is-open : utile au tactile, au clavier et au menu mobile (accordéon).
   Un seul menu ouvert à la fois. Fermeture : clic en dehors ou touche Échap. */
const menuItems = document.querySelectorAll('.nav__item--menu');

const setMenuOpen = (item, open) => {
  item.classList.toggle('is-open', open);
  item.querySelector('.nav__toggle').setAttribute('aria-expanded', open);
};

menuItems.forEach((item) => {
  item.querySelector('.nav__toggle').addEventListener('click', () => {
    const willOpen = !item.classList.contains('is-open');
    menuItems.forEach((other) => setMenuOpen(other, false));
    setMenuOpen(item, willOpen);
  });
});

document.addEventListener('click', (event) => {
  menuItems.forEach((item) => {
    if (!item.contains(event.target)) setMenuOpen(item, false);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  menuItems.forEach((item) => setMenuOpen(item, false));
  if (document.activeElement) document.activeElement.blur();   // referme aussi l'ouverture "au focus"
});


/* --- Header sticky ---
   À chaque défilement :
   - .is-scrolled dès qu'on a quitté le haut de page -> barre flottante
   - --progress (0 à 1) = avancement dans la page -> barre de progression
   Le header reste toujours visible. */
const SCROLLED_AFTER = 40;    // px défilés avant de passer en barre flottante

if (header) {
  let ticking = false;

  const updateHeader = () => {
    const y = window.scrollY;

    header.classList.toggle('is-scrolled', y > SCROLLED_AFTER);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--progress', maxScroll > 0 ? (y / maxScroll).toFixed(4) : 0);

    ticking = false;
  };

  // requestAnimationFrame : au plus une mise à jour par image (fluide et léger)
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  updateHeader();
}


/* --- Hero : les pilules se retournent et changent de place ---
   Deux animations alternées, en boucle :
   A. ÉCHANGE : 2 emplacements [data-swap] se retournent, échangent leur
      recto (photo OU pilule de couleur) pendant qu'on voit le verso, puis
      reviennent. Une photo peut donc prendre la place d'une pilule de couleur
      et inversement. Chaque emplacement passe à son tour (file d'attente).
   B. RETOURNEMENT SIMPLE : entre 2 échanges, une photo coupée au bord
      de l'écran ([data-flip]) se retourne puis revient (elle ne peut pas
      changer de place car l'image est déjà coupée).
   Les couleurs des versos alternent vert / jaune (et une pilule de couleur
   montre toujours l'autre couleur au verso, pour que ça se voie).
   Désactivé si l'utilisateur a choisi "réduire les animations". */
const FIRST_DELAY   = 600;    // 1re animation peu après l'arrivée sur la page (ms)
const SWAP_INTERVAL = 5000;   // temps entre 2 échanges (ms) — un retournement simple a lieu au milieu
const FLIP_DURATION = 800;    // doit correspondre à la transition CSS de .hero__pill-inner
const COLOR_PAUSE   = 400;    // temps pendant lequel on voit la couleur (ms)
const SECOND_DELAY  = 150;    // petit décalage entre les 2 pilules d'un échange (ms)

const swapPills = Array.from(document.querySelectorAll('.hero__pill[data-swap]'));
const flipPills = Array.from(document.querySelectorAll('.hero__pill[data-flip]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Couleurs des versos, utilisées à tour de rôle */
const BACK_COLORS = ['hero__pill-back--vert', 'hero__pill-back--jaune'];
let colorIndex = 0;

function nextColor() {
  const color = BACK_COLORS[colorIndex];
  colorIndex = (colorIndex + 1) % BACK_COLORS.length;
  return color;
}

/* Recto d'un emplacement = 1er enfant de .hero__pill-inner (img ou .hero__pill-color) */
function getFront(pill) {
  return pill.querySelector('.hero__pill-inner').firstElementChild;
}

/* Couleur du verso : si le recto est une pilule de couleur, on prend l'autre
   couleur ; sinon, la couleur suivante dans l'alternance. */
function backColorFor(pill) {
  const front = getFront(pill);
  if (front.classList.contains('hero__pill-color--vert'))  return 'hero__pill-back--jaune';
  if (front.classList.contains('hero__pill-color--jaune')) return 'hero__pill-back--vert';
  return nextColor();
}

/* Échange les rectos de 2 emplacements (déplace les éléments dans le DOM) */
function swapFronts(pillA, pillB) {
  const frontA = getFront(pillA);
  const frontB = getFront(pillB);
  const marker = document.createElement('span');
  frontA.replaceWith(marker);
  frontB.replaceWith(frontA);
  marker.replaceWith(frontB);
}

/* Retourne une pilule, exécute "whileHidden" quand on voit le verso,
   puis la remet à l'endroit. */
function flip(pill, whileHidden) {
  const back = pill.querySelector('.hero__pill-back');
  const color = backColorFor(pill);
  back.classList.remove(...BACK_COLORS);
  back.classList.add(color);

  pill.classList.add('is-flipped');
  setTimeout(() => {
    if (whileHidden) whileHidden();
    pill.classList.remove('is-flipped');
  }, FLIP_DURATION + COLOR_PAUSE);
}

/* Mélange un tableau (ordre aléatoire) */
function shuffle(list) {
  return list
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

/* A. Échange : file d'attente pour que chaque photo passe à son tour */
let swapQueue = [];
let lastPair = [];

function swapTwoPills() {
  if (swapQueue.length < 2) {
    // Nouveau tour : on remélange, en évitant de reprendre la paire précédente en premier
    do {
      swapQueue = shuffle(swapPills);
    } while (lastPair.includes(swapQueue[0]) && lastPair.includes(swapQueue[1]));
  }

  const pillA = swapQueue.shift();
  const pillB = swapQueue.shift();
  lastPair = [pillA, pillB];

  // L'échange se fait juste avant que la 1re pilule se remette à l'endroit :
  // à ce moment-là, les 2 pilules sont entièrement retournées.
  flip(pillA, () => swapFronts(pillA, pillB));
  setTimeout(() => flip(pillB), SECOND_DELAY);
}

/* B. Retournement simple : les photos coupées passent l'une après l'autre */
let flipIndex = 0;

function flipOnePill() {
  if (!flipPills.length) return;
  flip(flipPills[flipIndex]);
  flipIndex = (flipIndex + 1) % flipPills.length;
}

/* --- À propos : apparition des bulles + compteurs ---
   Quand le château d'eau arrive à l'écran :
   - on ajoute .is-visible -> les bulles apparaissent (animation CSS)
   - les nombres [data-count] défilent de 0 jusqu'à leur valeur */
const COUNT_DURATION = 1600;   // durée du compteur (ms)

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  let start = null;

  function step(now) {
    if (start === null) start = now;                    // départ = 1re image de l'animation
    const progress = Math.min((now - start) / COUNT_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);        // ralentit à la fin
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  el.textContent = 0;
  requestAnimationFrame(step);

  // Sécurité : la valeur finale s'affiche quoi qu'il arrive
  // (ex. onglet en arrière-plan où les animations sont suspendues)
  setTimeout(() => { el.textContent = target; }, COUNT_DURATION + 200);
}

// Toute zone marquée [data-counters] : .is-visible + compteurs quand elle apparaît
const counterZones = document.querySelectorAll('[data-counters]');

if (counterZones.length) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (!reduceMotion) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      }
      observer.unobserve(entry.target);                  // une seule fois par zone
    });
  }, { threshold: 0.3 });

  counterZones.forEach((zone) => counterObserver.observe(zone));
}


/* --- Valeurs (page Socama) : accordéon + photo associée ---
   - clic sur un titre : la valeur s'ouvre et sa photo s'affiche ;
   - lecture automatique : la barre de progression de la valeur active se remplit
     (animation CSS, durée --values-duration) ; à la fin, on passe à la suivante ;
   - la lecture ne tourne que lorsque la section est à l'écran (.is-playing). */
const valuesSection = document.querySelector('[data-values]');

if (valuesSection) {
  const items = valuesSection.querySelectorAll('.value-item');
  const visuals = valuesSection.querySelectorAll('.value-visual');

  const activate = (index) => {
    items.forEach((item, i) => {
      const isActive = i === index;
      item.classList.toggle('is-active', isActive);
      item.querySelector('.value-item__head').setAttribute('aria-expanded', isActive);
    });
    visuals.forEach((visual, i) => visual.classList.toggle('is-active', i === index));
  };

  items.forEach((item, i) => {
    item.querySelector('.value-item__head').addEventListener('click', () => activate(i));
    // Fin de la barre de progression -> valeur suivante (retour à la première après la dernière)
    item.querySelector('.value-item__progress').addEventListener('animationend', () => {
      activate((i + 1) % items.length);
    });
  });

  new IntersectionObserver(([entry]) => {
    valuesSection.classList.toggle('is-playing', entry.isIntersecting);
  }, { threshold: 0.4 }).observe(valuesSection);
}


/* --- Cycle de l'eau (pages Eau potable / Assainissement) : schéma à 6 étapes ---
   Tout élément [data-step="n"] du schéma (ouvrage du dessin, pastille) reçoit
   .is-active quand l'étape n est affichée.
   - clic sur une pastille ou sur les flèches de la carte : affichage direct ;
   - lecture automatique toutes les SCENE_INTERVAL ms, en pause au survol,
     uniquement quand le schéma est à l'écran. */
const scene = document.querySelector('[data-scene]');

if (scene) {
  const SCENE_INTERVAL = 5000;
  const panels = scene.querySelectorAll('.water-scene__panel');
  const counter = scene.querySelector('[data-scene-current]');
  const stepCount = panels.length;
  let current = 0;

  const showStep = (index) => {
    current = (index + stepCount) % stepCount;          // boucle : après 06 -> 01, avant 01 -> 06
    scene.querySelectorAll('[data-step]').forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.step) === current);
    });
    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === current));
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
  };

  // Étape de départ : attribut data-scene-start (ex. 4 = collecte sur la page Assainissement)
  showStep(Number(scene.dataset.sceneStart || 0));

  scene.querySelectorAll('button[data-step]').forEach((button) => {
    button.addEventListener('click', () => showStep(Number(button.dataset.step)));
  });

  // Flèches précédent / suivant
  scene.querySelector('[data-scene-prev]')?.addEventListener('click', () => showStep(current - 1));
  scene.querySelector('[data-scene-next]')?.addEventListener('click', () => showStep(current + 1));

  // Lecture automatique
  let timer = null;
  let inView = false;
  let hovered = false;

  const updateTimer = () => {
    const shouldPlay = inView && !hovered && !reduceMotion;
    if (shouldPlay && !timer) {
      timer = setInterval(() => showStep(current + 1), SCENE_INTERVAL);
    } else if (!shouldPlay && timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  scene.addEventListener('mouseenter', () => { hovered = true; updateTimer(); });
  scene.addEventListener('mouseleave', () => { hovered = false; updateTimer(); });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateTimer();
  }, { threshold: 0.4 }).observe(scene);
}


/* --- Frise (page Socama) : tracé du tuyau à la largeur réelle ---
   Le SVG est redessiné en pixels réels (viewBox = taille affichée) pour que
   les bulles restent rondes et suivent exactement le tuyau (offset-path). */
const timeline = document.querySelector('.timeline');
const pipe = timeline && timeline.querySelector('.timeline__pipe');

if (pipe) {
  const CENTERS = [0.092, 0.296, 0.5, 0.704, 0.908];   // centre des 5 cartes (en % de la largeur)
  const TOP = 32;                                      // hauteur des pastilles hautes
  const BOTTOM = 152;                                  // hauteur des pastilles basses
  const paths = pipe.querySelectorAll('[data-pipe-path]');

  const drawPipe = () => {
    const width = pipe.clientWidth;
    if (!width) return;                                // tuyau masqué (mobile)

    const x = CENTERS.map((ratio) => Math.round(ratio * width));
    const curve = (x[1] - x[0]) / 2;                   // tension des courbes
    const d = `M${x[0]} ${TOP} C${x[0] + curve} ${TOP} ${x[1] - curve} ${BOTTOM} ${x[1]} ${BOTTOM}`
      + ` S${x[2] - curve} ${TOP} ${x[2]} ${TOP}`
      + ` S${x[3] - curve} ${BOTTOM} ${x[3]} ${BOTTOM}`
      + ` S${x[4] - curve} ${TOP} ${x[4]} ${TOP}`;

    pipe.setAttribute('viewBox', `0 0 ${width} 184`);
    paths.forEach((path) => path.setAttribute('d', d));
    timeline.style.setProperty('--pipe-path', `path("${d}")`);
    timeline.classList.add('is-ready');
  };

  drawPipe();
  new ResizeObserver(drawPipe).observe(pipe);
}


/* --- Filtres des références (page Références) ---
   Boutons [data-filter] : "all" ou la clé d'un domaine (= data-domain des cartes).
   Le filtre choisi est reporté dans l'URL (?domaine=…), ce qui permet aux pages
   domaine de renvoyer directement vers leurs références. */
const refsSection = document.querySelector('[data-references]');

if (refsSection) {
  const filterButtons = refsSection.querySelectorAll('[data-filter]');
  const refItems = refsSection.querySelectorAll('.references__item');
  const refCount = refsSection.querySelector('[data-ref-count]');

  const applyFilter = (filter, updateUrl) => {
    let visible = 0;

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive);
    });

    refItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.domain === filter;
      item.classList.toggle('is-hidden', !show);
      item.classList.remove('is-entering');
      if (show) {
        visible += 1;
        void item.offsetWidth;                          // relance l'animation d'apparition
        item.classList.add('is-entering');
      }
    });

    if (refCount) refCount.textContent = visible;

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (filter === 'all') url.searchParams.delete('domaine');
      else url.searchParams.set('domaine', filter);
      history.replaceState(null, '', url);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter, true));
  });

  // Filtre demandé dans l'URL (ex. depuis une page domaine)
  const requested = new URLSearchParams(window.location.search).get('domaine');
  if (requested && refsSection.querySelector(`[data-filter="${requested}"]`)) {
    applyFilter(requested, false);
  }
}


/* --- Apparition au défilement (.reveal) ---
   Les éléments .reveal apparaissent en fondu quand ils entrent à l'écran.
   Les éléments voisins (même parent) apparaissent les uns après les autres. */
const REVEAL_STAGGER = 90;    // décalage entre 2 éléments voisins (ms)

const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length) {
  revealItems.forEach((item) => {
    const siblings = Array.from(item.parentElement.children).filter((el) => el.classList.contains('reveal'));
    item.style.transitionDelay = `${siblings.indexOf(item) * REVEAL_STAGGER}ms`;
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      item.classList.add('is-visible');
      observer.unobserve(item);
      // Une fois apparu, on retire le décalage (sinon il ralentirait les effets de survol)
      setTimeout(() => { item.style.transitionDelay = ''; }, 800 + parseInt(item.style.transitionDelay || 0, 10));
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}


/* --- Carrousel "Réalisations" ---
   Le défilement est natif (CSS scroll-snap) : souris, trackpad et doigt
   fonctionnent sans JS. Le JS gère seulement les flèches précédent/suivant
   et les grise quand on est au début ou à la fin. */
const track = document.querySelector('.carousel__track');
const prevBtn = document.querySelector('[data-carousel="prev"]');
const nextBtn = document.querySelector('[data-carousel="next"]');

if (track && prevBtn && nextBtn) {
  // Distance d'un "pas" = largeur d'une carte + espace entre 2 cartes
  const stepSize = () => {
    const slide = track.querySelector('.carousel__slide');
    return slide.offsetWidth + parseFloat(getComputedStyle(track).columnGap);
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
  };

  prevBtn.addEventListener('click', () => track.scrollBy({ left: -stepSize() }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: stepSize() }));
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();


  /* --- Cliquer-glisser à la souris ---
     (au doigt, le défilement est déjà natif)
     1. on appuie : on mémorise la position, on coupe l'aimantation CSS
     2. on glisse : la piste suit la souris
     3. on relâche : on se cale sur la carte la plus proche
        (ou la suivante/précédente si on a glissé franchement)
     Un glisser ne déclenche pas le lien de la carte. */
  const DRAG_THRESHOLD = 5;     // px avant de considérer que c'est un glisser (et pas un clic)
  const SWIPE_DISTANCE = 60;    // px glissés pour passer à la carte suivante/précédente

  let isDown = false;
  let hasDragged = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    isDown = true;
    hasDragged = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
  });

  track.addEventListener('pointermove', (event) => {
    if (!isDown) return;
    const delta = event.clientX - startX;

    if (!hasDragged && Math.abs(delta) > DRAG_THRESHOLD) {
      hasDragged = true;
      track.classList.add('is-dragging');           // coupe aimantation + défilement doux (CSS)
      track.setPointerCapture(event.pointerId);
    }
    if (hasDragged) {
      track.scrollLeft = startScroll - delta;
    }
  });

  const endDrag = (event) => {
    if (!isDown) return;
    isDown = false;
    if (!hasDragged) return;

    // Carte cible : la plus proche, ou la suivante/précédente si on a glissé franchement
    const step = stepSize();
    const delta = event.clientX - startX;
    const startIndex = Math.round(startScroll / step);
    let index = Math.round(track.scrollLeft / step);
    if (index === startIndex && Math.abs(delta) > SWIPE_DISTANCE) {
      index += delta < 0 ? 1 : -1;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.max(0, Math.min(index * step, maxScroll));

    // On garde l'aimantation coupée pendant le calage (.is-settling),
    // sinon le navigateur se recalerait tout seul sur une autre carte
    track.classList.remove('is-dragging');
    track.classList.add('is-settling');
    track.scrollTo({ left: target, behavior: 'smooth' });

    const stopSettling = () => track.classList.remove('is-settling');
    if ('onscrollend' in window) {
      track.addEventListener('scrollend', stopSettling, { once: true });
    } else {
      setTimeout(stopSettling, 600);
    }
  };

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Après un glisser, on bloque le clic qui suit (sinon le lien s'ouvrirait)
  track.addEventListener('click', (event) => {
    if (hasDragged) {
      event.preventDefault();
      hasDragged = false;
    }
  }, true);

  // Empêche le "glisser-déposer" natif des images et des liens
  track.addEventListener('dragstart', (event) => event.preventDefault());
}


/* Lancement de l'animation de la hero */
if (swapPills.length >= 2 && !reduceMotion) {
  setTimeout(() => {
    swapTwoPills();
    setTimeout(flipOnePill, SWAP_INTERVAL / 2);

    setInterval(() => {
      swapTwoPills();
      setTimeout(flipOnePill, SWAP_INTERVAL / 2);   // au milieu de 2 échanges
    }, SWAP_INTERVAL);
  }, FIRST_DELAY);
}
