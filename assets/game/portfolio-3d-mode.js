import { exhibits } from './portfolio-3d-content.js';

const stage = document.querySelector('#world-stage');
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

function show(focus = false) {
  const { id, items, index } = route();
  map.hidden = !id;
  textExhibit.hidden = !id;
  exit.href = id ? '../#' + id : '../';
  if (!id) {
    scene?.showExhibit(null);
    if (focus) {
      const link = stage.querySelector('.portfolio-3d-portal-link') ?? document.querySelector('#world-destinations a');
      link?.focus();
    }
    return;
  }

  const [title, detail, href, label, thumbnail] = items[index];
  const section = id[0].toUpperCase() + id.slice(1);
  const previous = index > 0 ? '#' + id + '/' + index : null;
  const next = index < items.length - 1 ? '#' + id + '/' + (index + 2) : null;
  const options = [
    previous && ['Previous', previous],
    href && [label, href],
    next && ['Next', next],
  ];
  heading.textContent = section + ' · ' + title;
  description.textContent = detail;
  const image = document.querySelector('#world-thumbnail');
  image.src = thumbnail;
  controls.replaceChildren(...options.filter(Boolean).map(([name, url]) => {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = name;
    return link;
  }));
  scene?.showExhibit({
    section, title, image, description: detail, counter: (index + 1) + ' / ' + items.length,
    actions: options.map(option => option && {
      label: option[0],
      run: () => location.assign(option[1]),
    }),
  });
  if (focus) heading.focus({ preventScroll: true });
}

function fallback() {
  scene?.dispose();
  scene = undefined;
  document.body.classList.remove('world-enhanced');
  document.body.classList.add('world-unavailable');
  status.textContent = '3D graphics are unavailable. You can browse the exhibits using these links.';
  show();
}

map.addEventListener('click', event => {
  if (location.hash !== '#board') return;
  event.preventDefault();
  show(true);
});
window.addEventListener('hashchange', () => show(true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && route().id) location.hash = 'board';
});
show();
try {
  const { mountPortfolio3D } = await import('./portfolio-3d.js');
  scene = mountPortfolio3D(stage, {
    onNavigate: id => { location.hash = id; },
    onError: fallback,
  });
  document.body.classList.add('world-enhanced');
  status.textContent = '';
  show();
} catch {
  fallback();
}
