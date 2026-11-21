import { exhibits } from './portfolio-3d-content.js';

const stage = document.querySelector('#world-stage');
const menu = document.querySelector('#world-menu');
const textExhibit = document.querySelector('#world-exhibit');
const heading = textExhibit.querySelector('h2');
const description = textExhibit.querySelector('p');
const controls = textExhibit.querySelector('nav');
const status = document.querySelector('#world-status');
const map = document.querySelector('#world-map');
const exit = document.querySelector('#world-exit');
let scene;

function route() {
  const [id, page] = location.hash.slice(1).split('/');
  const items = Object.hasOwn(exhibits, id) ? exhibits[id] : [];
  const index = Math.max(0, Math.min(items.length - 1, (Number.parseInt(page, 10) || 1) - 1));
  return items.length ? { id, items, index } : {};
}

function cardFor(id, index = 0, image = new Image()) {
  const items = exhibits[id];
  const [title, description, href, label, thumbnail] = items[index];
  image.src = thumbnail;
  const options = [
    index > 0 && ['Previous', '#' + id + '/' + index],
    href && [label, href],
    index + 1 < items.length && ['Next', '#' + id + '/' + (index + 2)],
  ];
  return {
    id, section: id[0].toUpperCase() + id.slice(1), title, description, image,
    counter: (index + 1) + ' / ' + items.length,
    actions: options.map(option => option && {
      label: option[0], href: option[1], run: () => option[1].startsWith('#') ? go(option[1]) : location.assign(option[1]),
    }),
  };
}

const guide = document.querySelector('#world-guide');
const readingKeys = document.querySelector('#reading-keys');
let currentCard, renderedHash;
function go(hash) {
  location.hash = hash;
  if (renderedHash !== location.hash) show(true);
}
function show(focus = false) {
  renderedHash = location.hash;
  const { id, index } = route();
  map.hidden = !id;
  textExhibit.hidden = !id;
  readingKeys.hidden = !id || !scene;
  exit.href = id ? '../#' + id : '../';
  currentCard = id ? cardFor(id, index, document.querySelector('#world-thumbnail')) : null;
  if (currentCard) {
    heading.textContent = currentCard.section + ' · ' + currentCard.title;
    description.textContent = currentCard.description;
    controls.replaceChildren(...currentCard.actions.filter(Boolean).map(action => {
      const link = document.createElement('a');
      link.href = action.href;
      link.textContent = action.label;
      return link;
    }));
    readingKeys.textContent = [currentCard.actions[0] || currentCard.actions[2] ? '← / → Browse' : '',
      currentCard.actions[1] ? 'Enter to Open Link' : '', 'Esc to Resume Exploring'].filter(Boolean).join(' · ');
    map.href = scene?.explorationHash() || '#board';
    map.textContent = 'Resume Exploring';
  }
  scene?.showExhibit(currentCard, location.hash === '#flight');
  if (scene) {
    const canvas = stage.querySelector('canvas');
    canvas.setAttribute('aria-label', currentCard ? heading.textContent : 'Portfolio camera view');
    if (focus) {
      menu.open = false;
      canvas.focus({ preventScroll: true });
    }
  } else if (focus) {
    if (id) menu.open = true;
    (id ? heading : document.querySelector('#world-destinations a')).focus({ preventScroll: true });
  }
}

function fallback() {
  scene?.dispose();
  scene = undefined;
  document.body.classList.remove('world-enhanced');
  document.body.classList.add('world-unavailable');
  menu.open = true;
  status.textContent = '3D graphics are unavailable. You can browse the exhibits using these links.';
  show();
}

map.addEventListener('click', event => {
  if (map.hash !== location.hash) return;
  event.preventDefault();
  show(true);
});
window.addEventListener('hashchange', () => { if (renderedHash !== location.hash) show(true); });
const help = document.querySelector('#world-help');
function openGuide() {
  scene?.pauseInput();
  guide.showModal();
}
help.addEventListener('click', openGuide);
document.addEventListener('pointerdown', event => {
  if (event.isPrimary && scene && menu.open && !menu.contains(event.target) && !guide.open) menu.open = false;
});
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement) menu.open = false;
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented || guide.open) return;
  if (scene && ((event.key.toLowerCase() === 'p' && !event.repeat && !event.target.closest('select'))
    || (menu.open && event.key === 'Escape'))) {
    event.preventDefault();
    menu.open = !menu.open;
    (menu.open ? menu.querySelector('summary') : stage.querySelector('canvas')).focus({ preventScroll: true });
    return;
  }
  if (event.key === '?' && !event.repeat) {
    event.preventDefault();
    openGuide();
    return;
  }
  if (!currentCard || event.repeat) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    go(map.hash);
    return;
  }
  if (event.target.closest('a, button, summary, select, input, textarea')) return;
  const slot = { ArrowLeft: 0, Enter: 1, ArrowRight: 2 }[event.key];
  if (slot !== undefined) {
    event.preventDefault();
    currentCard.actions[slot]?.run();
  }
});
// Flight is an in-session action. A fresh visit always starts on the plaza.
if (location.hash === '#flight') history.replaceState(history.state, '', '#board');
show();
try {
  const { mountPortfolio3D } = await import('./portfolio-3d.js');
  scene = mountPortfolio3D(stage, {
    onNavigate: go,
    onError: fallback,
    cardFor,
  });
  document.body.classList.add('world-enhanced');
  status.textContent = '';
  show();
} catch {
  fallback();
}
