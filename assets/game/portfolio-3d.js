import * as THREE from '../vendor/three/three.module.js';
import { createPlaque } from './portfolio-3d-plaque.js';

import { addSanctuary, compassRose, makeRelic } from './portfolio-3d-sanctuary.js';

import { createPassage, dressAirgate, placeAirgate } from './portfolio-3d-airgate.js';
import { createController, readStick, constrainToPlaza, floor, plazaCenterZ } from './portfolio-3d-controller.js';
import { createFlight } from './portfolio-3d-flight.js';
import { createTraveler } from './portfolio-3d-traveler.js';

const sections = [
  { id: 'about', label: 'About', color: 0x67c3f0 },
  { id: 'experience', label: 'Experience', color: 0xe6a77f },
  { id: 'projects', label: 'Projects', color: 0xf0cc83 },
  { id: 'interests', label: 'Interests', color: 0xc0a1f2 },
  { id: 'contact', label: 'Contact', color: 0x8cdbbd },
];

function arch(width, shoulders, bottom = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(-width, bottom);
  shape.lineTo(width, bottom);
  shape.lineTo(width, shoulders);
  shape.absarc(0, shoulders, width, 0, Math.PI, false);
  shape.closePath();
  return shape;
}

function frame(outerWidth, innerWidth, bottom, depth) {
  const shape = arch(outerWidth, 2.15, bottom);
  shape.holes.push(arch(innerWidth, 2.15, bottom + outerWidth - innerWidth));
  return new THREE.ExtrudeGeometry(shape, {
    depth, steps: 1, bevelEnabled: true, bevelThickness: 0.02,
    bevelSize: 0.018, bevelSegments: 2, curveSegments: 28,
  });
}

function makeStars() {
  const vertices = [];
  const colors = [];
  const tint = new THREE.Color();
  for (let i = 0; i < 1800; i++) {
    const radius = 22 + Math.random() * 64;
    const angle = Math.random() * Math.PI * 2;
    vertices.push(Math.cos(angle) * radius, Math.random() * 70 - 27, Math.sin(angle) * radius);
    tint.setHSL(0.50 + Math.random() * 0.19, 0.28, 0.37 + Math.random() * 0.59);
    colors.push(tint.r, tint.g, tint.b);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 0.10, vertexColors: true, opacity: 0.85, transparent: true, fog: false, depthWrite: false,
  }));
}

function boardLabel(text, textScale) {
  const canvas = document.createElement('canvas');
  canvas.width = 384 * textScale;
  canvas.height = 128 * textScale;
  const ctx = canvas.getContext('2d');
  ctx.scale(textScale, textScale);
  ctx.fillStyle = '#131a38';
  ctx.beginPath();
  ctx.moveTo(6, 64);
  ctx.lineTo(33, 12);
  ctx.lineTo(351, 12);
  ctx.lineTo(378, 64);
  ctx.lineTo(351, 116);
  ctx.lineTo(33, 116);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#f9d58c';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = '#fff4d4';
  ctx.textAlign = 'center';
  ctx.font = '54px Georgia';
  ctx.fillText(text, 192, 83, 348);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, depthTest: false }));
  sprite.scale.set(2.1, .70, 1);
  sprite.position.set(0, .48, .68);
  sprite.renderOrder = 2;
  return sprite;
}

// A repeating slate relief keeps the grain continuous across the board.
function slateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const u = x * Math.PI / 128, v = y * Math.PI / 128;
      const stratum = Math.sin(3 * u + 2 * v + 1.5 * Math.sin(v - u));
      const vein = Math.pow(.5 + .5 * Math.cos(5 * u + 4 * v + 2 * stratum), 15);
      const grain = 171 + 13 * stratum + 22 * vein + Math.random() * 13;
      const offset = (y * 256 + x) * 4;
      pixels.data.set([grain, grain + 3, grain + 8, 255], offset);
    }
  }
  ctx.putImageData(pixels, 0, 0);
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(13, 13);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

function addPlaza(scene) {
  const map = slateTexture();
  const stone = new THREE.MeshStandardMaterial({ color: 0x67667c, map, bumpMap: map, bumpScale: .055, roughness: .71, metalness: .13 });
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(14, 14.4, 0.34, 80), stone);
  plaza.position.set(0, floor - plaza.geometry.parameters.height / 2, -1);
  plaza.receiveShadow = true;
  scene.add(plaza);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xb99560, transparent: true, opacity: 0.31, side: THREE.DoubleSide,
  });
  for (const radius of [3.05, 5.2, 7.8, 10.1, 13.7, 13.87]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.038, 100), ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, -0.379, -1);
    scene.add(ring);
  }
  compassRose(scene);
  return map;
}

function portalWindow(geometry, tint, thumbnail) {
  return new THREE.Mesh(geometry, new THREE.ShaderMaterial({
    uniforms: {
      tint: { value: new THREE.Color(tint) },
      thumbnail: { value: thumbnail },
      photoAspect: { value: 1.5 },
      time: { value: 0 },
      highlight: { value: 0 },
      opening: { value: 0 },
    },
    vertexShader: `
      varying vec2 panel;
      void main() {
        panel = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 tint;
      uniform sampler2D thumbnail;
      uniform float photoAspect;
      uniform float time;
      uniform float highlight;
      uniform float opening;
      varying vec2 panel;
      void main() {
        vec2 p = panel - vec2(0.0, 1.59);
        float radiance = exp(-1.8 * length(vec2(p.x * 1.9, p.y * 0.60)));
        float bands = sin(panel.y * 5.0 - panel.x * 3.5 + time * 0.85) * 0.5 + 0.5;
        float edges = pow(abs(panel.x) / 0.90, 3.0);
        vec3 color = vec3(0.013, 0.020, 0.043)
          + tint * (0.03 + radiance * (0.28 + highlight * 0.30) + bands * 0.06 + edges * 0.09);
        vec2 card = (panel - vec2(0.0, 2.46)) / vec2(1.32, .70);
        float edge = max(abs(card.x), abs(card.y));
        if (edge < .53) {
          float aspect = 1.32 / .70;
          vec2 crop = min(vec2(1.0), vec2(aspect / photoAspect, photoAspect / aspect));
          vec3 photo = texture2D(thumbnail, vec2(.5) + card * crop).rgb;
          color = mix(photo, vec3(.62, .42, .15), smoothstep(.49, .51, edge));
        }
        if (opening > 0.0) {
          float radius = length(p * vec2(1.0, .68));
          float lip = opening * 1.7;
          if (radius < lip) discard;
          color += tint * (1.0 - smoothstep(0.0, .23, radius - lip)) * 3.0;
        }
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  }));
}

export function mountPortfolio3D(container, { onNavigate, onError, cardFor } = {}) {
  const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'low-power' });
  const canvas = renderer.domElement;
  canvas.className = 'portfolio-3d-canvas';
  canvas.tabIndex = -1;
  canvas.setAttribute('aria-label', 'Portfolio camera view');
  const textScale = Math.min(3, Math.max(2, Math.ceil(window.devicePixelRatio || 1)),
    Math.floor(renderer.capabilities.maxTextureSize / 780));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090d1b);
  scene.fog = new THREE.FogExp2(0x090d1b, 0.018);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 150);
  scene.add(new THREE.HemisphereLight(0xc8dafe, 0x3b2539, 1.55));
  const key = new THREE.DirectionalLight(0xffdcaf, 2.2);
  key.position.set(-14, 29, 17);
  scene.add(key);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -41, right: 41, top: 41, bottom: -41, near: .1, far: 95 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = .035;
  const rim = new THREE.DirectionalLight(0xa0bcff, .85);
  rim.position.set(7, 6, -9);
  scene.add(rim);
  scene.add(makeStars());
  const ruins = new THREE.Group();
  ruins.position.z = -31;
  scene.add(ruins);
  addSanctuary(ruins);
  const plaza = new THREE.Group();
  plaza.scale.set(3, 1, 3);
  plaza.position.z = plazaCenterZ + 3;
  scene.add(plaza);
  const groundTexture = addPlaza(plaza);
  let readingPortal, initialized = false, mapOpen = false, transfer, viewBlend;
  let exhibitOpen = false;

  const archGeometry = frame(1.02, 0.9, 0.16, 0.24);
  const inlayGeometry = frame(0.99, 0.96, 0.176, 0.015);
  const windowGeometry = new THREE.ShapeGeometry(arch(0.923, 2.15, 0.24), 28);
  const baseGeometry = new THREE.CylinderGeometry(1.31, 1.47, 0.25, 8, 1);
  const edgeGeometry = new THREE.CylinderGeometry(1.26, 1.32, 0.065, 8, 1);
  const hitGeometry = new THREE.BoxGeometry(2.18, 3.26, 0.55);
  const brass = new THREE.MeshStandardMaterial({ color: 0x9a764a, roughness: 0.4, metalness: 0.61 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a3040, roughness: 0.56, metalness: 0.49 });
  const traveler = createTraveler(refresh);
  const pawn = traveler.body;
  pawn.traverse(part => { if (part.isMesh) part.castShadow = true; });
  const flight = createFlight();
  const controller = createController(pawn);
  scene.add(pawn, flight.stars);
  let move;
  const pathGeometry = new THREE.PlaneGeometry(.45, .88);
  const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xd5b879, transparent: true, opacity: .6 });
  const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const aim = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  const projected = new THREE.Vector3();
  const target = new THREE.Vector3();
  const cameraRest = new THREE.Vector3();
  const start = performance.now();
  let hovered = null;
  let focused = null;
  let frameId = 0;
  let ready = false;
  let disposed = false;
  let width = 1;
  let height = 1;

  const orbit = new THREE.TorusGeometry(.71, .022, 6, 64);
  const crown = new THREE.OctahedronGeometry(.19);
  const landmarkPhotos = {
    about: 'figure.jpg', experience: 'album/simaaihwteam.jpg', projects: 'album/TheDoProGuys.jpg',
    interests: 'album/photography.jpg', contact: 'album/uclagrad.jpg',
  };
  const loader = new THREE.TextureLoader();
  const portals = sections.map(({ id, label, color }, index) => {
    const stand = new THREE.Group();
    placeAirgate(stand, index);
    const stone = new THREE.Mesh(baseGeometry, darkMetal);
    stone.position.y = -0.11;
    stone.rotation.y = Math.PI / 8;
    const edge = new THREE.Mesh(edgeGeometry, brass);
    edge.position.y = 0.037;
    edge.rotation.y = Math.PI / 8;
    const doorway = new THREE.Mesh(archGeometry, brass);
    const inlay = new THREE.Mesh(inlayGeometry, new THREE.MeshStandardMaterial({
      color: 0xffd49a, emissive: color, emissiveIntensity: 0.43, roughness: 0.44, metalness: 0.40,
    }));
    inlay.position.z = 0.251;
    const url = new URL('./img/' + landmarkPhotos[id], import.meta.url);
    const photo = loader.load(url.href, loaded => {
      panel.material.uniforms.photoAspect.value = loaded.image.width / loaded.image.height;
      refresh();
    });
    photo.colorSpace = THREE.SRGBColorSpace;
    const panel = portalWindow(windowGeometry, color, photo);
    panel.position.z = 0.052;
    const orb = makeRelic(id, color, brass);
    orb.position.set(0, 1.65, 0.45);
    const hit = new THREE.Mesh(hitGeometry, hitMaterial);
    hit.position.set(0, 1.65, 0.25);
    hit.userData.id = id;
    const halo = new THREE.Mesh(orbit, brass);
    halo.position.set(0, 1.72, .42);
    halo.rotation.set(.24, .28, .21);
    const keystone = new THREE.Mesh(crown, inlay.material);
    keystone.scale.set(.84, 1.9, .9);
    keystone.position.set(0, 3.15, .32);
    const nameplate = boardLabel(label, textScale);
    const { island, tunnel } = dressAirgate(color);
    stand.add(stone, edge, doorway, inlay, panel, orb, halo, keystone, hit, nameplate, island, tunnel);
    for (const mesh of [stone, edge, doorway, inlay, keystone]) mesh.castShadow = true;
    scene.add(stand);

    island.visible = true;
    nameplate.position.y = 3.84;
    nameplate.scale.set(3.05, 1.02, 1);
    const plaque = createPlaque(Math.min(2, textScale), refresh);
    plaque.object.position.set(0, 1.42, -8);
    plaque.object.scale.setScalar(.34);
    plaque.face.userData.id = id;
    stand.add(plaque.object);
    plaque.paint(cardFor(id));
    // The same inlaid path leads through the arch to its reading station.
    for (let step = 1; step <= 16; step++) {
      const marker = new THREE.Mesh(pathGeometry, pathMaterial);
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(0, -.175, 11 - step * 1.1);
      stand.add(marker);
    }

    const link = document.createElement('a');
    link.className = 'portfolio-3d-portal-link';
    link.href = '#' + id;
    link.dataset.section = id;
    link.textContent = label;
    return { id, stand, inlay, panel, orb, hit, link, nameplate, halo, island, tunnel, color, plaque };
  });
  const hits = portals.map(({ hit }) => hit);
  const selectable = [...hits, ...portals.map(portal => portal.plaque.face)];
  const events = new AbortController();
  const { signal } = events;
  const zoomBar = document.querySelector('#world-zoom');
  const [zoomOut, zoomReset, zoomIn] = zoomBar.querySelectorAll('button');
  const pan = new THREE.Vector3();

  let drag = null;
  let suppressClick = false;
  let flying = false;
  let mapZoom = 1;
  function setZoom(value) {
    mapZoom = THREE.MathUtils.clamp(Math.round(value * 100) / 100, .6, 2);
    camera.zoom = mapZoom;
    camera.updateProjectionMatrix();
    zoomOut.disabled = mapZoom === .6;
    zoomIn.disabled = mapZoom === 2;
    zoomReset.textContent = Math.round(mapZoom * 100) + '%';
    refresh();
  }
  zoomOut.addEventListener('click', () => setZoom(mapZoom / 1.2), { signal });
  zoomIn.addEventListener('click', () => setZoom(mapZoom * 1.2), { signal });
  zoomReset.addEventListener('click', () => { pan.set(0, 0, 0); setZoom(1); }, { signal });
  container.addEventListener('wheel', event => {
    if (!mapOpen || event.ctrlKey || !event.deltaY) return;
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    setZoom(mapZoom * Math.exp(-THREE.MathUtils.clamp(delta, -200, 200) * .002));
  }, { passive: false, signal });
  const walkKeys = new Map(Object.entries({
    w: 'up', arrowup: 'up', s: 'down', arrowdown: 'down',
    a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right',
  }));
  const held = new Map();
  const nearestButton = document.querySelector('#world-interact');
  const walkBar = document.querySelector('#world-walk');
  const look = new THREE.Vector3();
  let nearest = null, lastTime = 0;
  const guide = document.querySelector('#world-guide');

  const flyButton = document.querySelector('#world-flight');
  const walkHint = walkBar.querySelector('.walk-hint');
  const touchHint = walkBar.querySelector('.touch-hint');
  const chart = document.querySelector('#flight-destination');
  const descendButton = document.querySelector('#flight-descend');
  const veil = document.querySelector('#portal-passage');
  const caption = document.querySelector('#portal-caption');
  const lookButton = document.querySelector('#world-look');
  const speedButton = document.querySelector('#world-speed');
  const jumpButton = document.querySelector('#world-jump');
  const padHint = document.querySelector('#pad-hint');
  const leftStick = new THREE.Vector2(), rightStick = new THREE.Vector2();
  function connectedPad() {
    try { return Array.from(navigator.getGamepads?.() || []).find(pad => pad?.mapping === 'standard'); }
    catch { return undefined; }
  }
  let padIndex = connectedPad()?.index;
  let padAction = false, padEnter = false, padFly = false, padFast = false;
  function syncPad() {
    padIndex = connectedPad()?.index;
    padHint.hidden = padIndex === undefined;
    padFast = padEnter = padAction = padFly = false;
    refresh();
  }
  padHint.hidden = padIndex === undefined;
  window.addEventListener('gamepadconnected', syncPad, { signal });
  window.addEventListener('gamepaddisconnected', syncPad, { signal });
  let shiftHeld = false, speedToggled = false;
  let lastSpace = -Infinity;
  const lastMovementTap = new Map();
  const sprintKeys = new Set();
  const fast = () => sprintKeys.size > 0 || speedToggled || padFast;
  function resetSpeed() {
    shiftHeld = speedToggled = false;
    lastSpace = -Infinity;
    lastMovementTap.clear();
    sprintKeys.clear();
    speedButton.setAttribute('aria-pressed', 'false');
  }
  function releaseMouse() {
    if (document.pointerLockElement === canvas) document.exitPointerLock();
  }
  lookButton.addEventListener('click', async () => {
    if (move || exhibitOpen) return;
    try {
      await canvas.requestPointerLock();
    } catch {
      // Browsers can decline capture. Drag-to-look remains available.
      lookButton.focus();
    }
  }, { signal });
  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    lookButton.setAttribute('aria-pressed', String(locked));
    lookButton.textContent = locked ? 'Esc to Release' : 'Mouse Look';
    if (locked) canvas.focus({ preventScroll: true });
    else clearInput();
  }, { signal });
  document.addEventListener('mousemove', event => {
    if (document.pointerLockElement !== canvas || move || exhibitOpen) return;
    controller.orbit(event.movementX, event.movementY);
    refresh();
  }, { signal });
  speedButton.addEventListener('click', () => {
    if (move || exhibitOpen) return;
    speedToggled = !speedToggled;
    speedButton.setAttribute('aria-pressed', String(speedToggled));
    refresh();
  }, { signal });
  function jump() {
    if (flying || move || exhibitOpen) return;
    controller.jump();
    lastTime = performance.now();
    refresh();
  }
  for (const button of [jumpButton, descendButton]) {
    button.addEventListener('pointerdown', event => {
      if (move || exhibitOpen) return;
      if (!flying) { jump(); return; }
      button.setPointerCapture(event.pointerId);
      setDirection(event.pointerId, button.dataset.vertical);
      stepDirection(button.dataset.vertical, .045);
    }, { signal });
    button.addEventListener('lostpointercapture', event => held.delete(event.pointerId), { signal });
    button.addEventListener('click', event => {
      if (event.detail || move || exhibitOpen) return;
      if (!flying) jump();
      else {
        stepDirection(button.dataset.vertical, .15);
        refresh();
      }
    }, { signal });
  }
  const gateLocal = new THREE.Vector3(), previousFlight = new THREE.Vector3();
  for (const { link, id } of portals) chart.add(new Option(link.textContent, id));
  chart.addEventListener('change', () => {
    if (chart.value) navigate(chart.value);
    chart.value = '';
  }, { signal });
  const mapHint = walkHint.textContent;
  const flightHint = 'WASD to Fly · Space to Rise · Shift to Descend · Double-Tap Space to Land';

  function setFlight(active, direction, keepView = false, cameraPitch = 0) {
    controller.reset(keepView ? undefined : direction + Math.PI, cameraPitch);
    flying = active;
    lookButton.hidden = !canvas.requestPointerLock || !matchMedia('(any-pointer: fine)').matches;
    jumpButton.textContent = active ? 'Ascend' : 'Jump';
    padHint.textContent = active ? 'L Stick to Fly · R Stick to Look · A/B Up/Down · X to Land · RT to Boost · Y to Enter'
      : 'L Stick to Move · R Stick to Look · A to Jump · X to Fly · RT to Sprint · Y to Enter';
    speedButton.textContent = active ? 'Boost' : 'Sprint';
    nearest = null;
    nearestButton.hidden = true;
    flyButton.textContent = active ? 'Land' : 'Fly';
    flyButton.title = active ? 'Land on the Plaza' : 'Fly Through Space';
    chart.hidden = false;
    descendButton.hidden = !active;
    chart.disabled = false;
    walkHint.textContent = active ? flightHint : mapHint;
    touchHint.textContent = 'Drag to Look';
    for (const button of walkBar.querySelectorAll('[data-dir]')) {
      const dir = button.dataset.dir;
      button.setAttribute('aria-label', (active ? 'Fly ' : 'Walk ') + ({ up: 'forward', down: 'backward' }[dir] || dir));
    }
    walkBar.querySelector('.walk-pad').setAttribute('aria-label', active ? 'Steer Timothy' : 'Move Timothy');
    if (!keepView || motion.matches) traveler.glide(active);
    if (active) {
      pan.set(0, 0, 0);
      pawn.rotation.y = direction;
      lastTime = performance.now();
    } else {
      pawn.rotation.set(0, direction, 0);
    }
  }

  function faceEntrance(portal, airborne) {
    // Local +Z is the entrance side of every arch, including the rotated ones.
    pawn.position.set(0, 0, 6);
    portal.stand.localToWorld(pawn.position);
    pawn.position.y = airborne ? 2.35 : floor;
    setFlight(airborne, portal.stand.rotation.y + Math.PI, false, airborne ? 0 : -.36);
  }

  const overview = document.querySelector('#world-overview');
  function updateMapControls() {
    overview.setAttribute('aria-pressed', String(mapOpen));
    overview.textContent = mapOpen ? 'Close Map' : 'Map';
    chart.hidden = exhibitOpen || mapOpen;
    zoomBar.hidden = !mapOpen;
    container.toggleAttribute('data-pan', mapOpen);
    camera.zoom = mapOpen ? mapZoom : 1;
    walkHint.textContent = mapOpen ? 'Arrows to Pan · + / − to Zoom · 0 to Reset · M to Resume'
      : flying ? flightHint : mapHint;
    touchHint.textContent = mapOpen ? 'Drag to Pan' : 'Drag to Look';
    for (const button of [descendButton, speedButton, jumpButton, lookButton, ...walkBar.querySelectorAll('[data-dir]')]) {
      button.disabled = mapOpen;
    }
  }
  function easeCamera() {
    viewBlend = motion.matches ? undefined : {
      start: performance.now(), position: camera.position.clone(), rotation: camera.quaternion.clone(),
    };
  }
  function toggleMap() {
    if (exhibitOpen || move) return;
    if (transfer) {
      pawn.position.copy(transfer.to);
      traveler.glide(flying);
    }
    transfer = undefined;
    easeCamera();
    mapOpen = !mapOpen;
    releaseMouse();
    clearInput();
    pan.set(0, 0, 0);
    updateMapControls();
    resize();
  }
  overview.addEventListener('click', toggleMap, { signal });

  flyButton.addEventListener('click', () => {
    if (move || exhibitOpen) return;
    openDestination(flying ? 'board' : 'flight');
  }, { signal });

  function setDirection(source, dir) {
    if (!held.size) lastTime = performance.now();
    held.set(source, dir);
    refresh();
  }
  function clearInput() {
    held.clear();
    resetSpeed();
    refresh();
  }
  window.addEventListener('blur', clearInput, { signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearInput(); }, { signal });
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || guide.open || exhibitOpen || move || event.target.closest('select, input, textarea') || event.altKey || event.metaKey || event.ctrlKey) return;
    const key = event.key.toLowerCase();
    if (key === 'm' && !event.repeat) {
      event.preventDefault();
      toggleMap();
    } else if (/^[1-5]$/.test(key) && !event.repeat) {
      event.preventDefault();
      navigate(portals[Number(key) - 1].id);
    } else if (key === 'f' && !event.repeat) {
      event.preventDefault();
      flyButton.click();
    } else if (mapOpen) {
      if (key === 'escape') toggleMap();
      else if (key === '+' || key === '=') setZoom(mapZoom * 1.2);
      else if (key === '-') setZoom(mapZoom / 1.2);
      else if (key === '0') zoomReset.click();
      else if (key.startsWith('arrow')) panByPixels((Number(key === 'arrowleft') - Number(key === 'arrowright')) * 48,
        (Number(key === 'arrowup') - Number(key === 'arrowdown')) * 48);
      else return;
      event.preventDefault();
    } else if ('ijkl'.includes(key) && key.length === 1) {
      event.preventDefault();
      held.set(key, 'look-' + key);
      refresh();
    } else if (key === 'shift') {
      shiftHeld = true;
      refresh();
    } else if (key === ' ' && !event.target.closest('button, summary, a')) {
      event.preventDefault();
      if (!event.repeat) {
        const now = performance.now();
        if (now - lastSpace <= 320) {
          flyButton.click();
          lastSpace = -Infinity;
        } else {
          lastSpace = now;
          if (!flying) jump();
        }
        if (flying) setDirection(key, 'rise');
      }
    } else if (key === 'c') {
      controller.recenter();
      refresh();
    } else if (walkKeys.has(key)) {
      event.preventDefault();
      if (!event.repeat) {
        const now = performance.now();
        if (now - (lastMovementTap.get(key) ?? -Infinity) <= 320) sprintKeys.add(key);
        lastMovementTap.set(key, now);
        setDirection(key, walkKeys.get(key));
      }
    } else if (key === 'e' && nearest && !event.repeat) navigate(nearest.id);
  }, { signal });
  window.addEventListener('keyup', event => {
    if (event.key === 'Shift') shiftHeld = false;
    sprintKeys.delete(event.key.toLowerCase());
    held.delete(event.key.toLowerCase());
  }, { signal });
  function stepDirection(dir, seconds) {
    const dx = Number(dir === 'right') - Number(dir === 'left');
    const dz = Number(dir === 'down') - Number(dir === 'up');
    if (flying) controller.fly(seconds, dx, -dz, Number(dir === 'rise') - Number(dir === 'lower'), fast());
    else controller.walk(seconds, dx, -dz, fast(), traveler, motion.matches, portals, shiftHeld);
  }
  for (const button of walkBar.querySelectorAll('[data-dir]')) {
    button.addEventListener('pointerdown', event => {
      if (move || exhibitOpen) return;
      button.setPointerCapture(event.pointerId);
      const dir = button.dataset.dir;
      setDirection(event.pointerId, dir);
      // A quick tap takes one step even between animation frames.
      stepDirection(dir, .045);
    }, { signal });
    button.addEventListener('lostpointercapture', event => held.delete(event.pointerId), { signal });
    button.addEventListener('click', event => {
      if (event.detail || move || exhibitOpen) return;
      stepDirection(button.dataset.dir, .15);
      refresh();
    }, { signal });
  }
  nearestButton.addEventListener('click', () => { if (nearest) navigate(nearest.id); }, { signal });

  function openDestination(id) {
    if (onNavigate) onNavigate(id);
    else window.location.hash = id;
  }

  function navigate(id) {
    if (move || exhibitOpen) return;
    viewBlend = transfer = undefined;
    releaseMouse();
    held.clear();
    const portal = portals.find(portal => portal.id === id);
    const atPlaque = portal.plaque.object.getWorldPosition(projected).distanceTo(pawn.position) < 5;
    if (motion.matches || atPlaque) {
      openDestination(id);
      return;
    }
    if (mapOpen) toggleMap();
    const passage = createPassage(portal, pawn, camera);
    move = { id, start: performance.now(), passage };
    nearestButton.hidden = true;
    chart.disabled = true;
    container.classList.add('entering-portal');
    traveler.glide(true);
    caption.textContent = 'Entering ' + portal.link.textContent;
    container.style.setProperty('--gate-color', '#' + portal.color.toString(16).padStart(6, '0'));
    refresh();
  }

  function draw(now) {
    if (disposed || !ready || !initialized) return;
    const dt = Math.min(.08, Math.max(0, (now - lastTime) / 1000));
    const dirs = new Set(held.values());
    const pad = padIndex !== undefined && document.hasFocus() && !guide.open && !mapOpen && !exhibitOpen && !move ? connectedPad() : null;
    readStick(pad, 0, leftStick);
    readStick(pad, 2, rightStick);
    padFast = Boolean(pad?.buttons[7]?.pressed);
    const action = Boolean(pad?.buttons[0]?.pressed), enter = Boolean(pad?.buttons[3]?.pressed);
    const tapped = action && !padAction, interacted = enter && !padEnter;
    padAction = action;
    padEnter = enter;
    const toggle = Boolean(pad?.buttons[2]?.pressed);
    const toggleTapped = toggle && !padFly;
    padFly = toggle;
    if (pad && !transfer) {
      controller.orbit(rightStick.x * dt * 400, -rightStick.y * dt * 300);
      if (toggleTapped) flyButton.click();
      if (tapped && !flying) controller.jump();
      if (interacted && nearest) navigate(nearest.id);
    }
    const sideways = THREE.MathUtils.clamp(Number(dirs.has('right')) - Number(dirs.has('left')) + leftStick.x, -1, 1);
    const forward = THREE.MathUtils.clamp(Number(dirs.has('up')) - Number(dirs.has('down')) - leftStick.y, -1, 1);
    const exploring = !guide.open && !mapOpen && !exhibitOpen && !move && !transfer;
    if (exploring) controller.orbit((Number(dirs.has('look-l')) - Number(dirs.has('look-j'))) * dt * 400,
      (Number(dirs.has('look-k')) - Number(dirs.has('look-i'))) * dt * 300);
    if (flying && exploring) {
      previousFlight.copy(pawn.position);
      const rise = dirs.has('rise') || action;
      const lower = dirs.has('lower') || shiftHeld || Boolean(pad?.buttons[1]?.pressed);
      const climb = Number(rise) - Number(lower);
      controller.fly(dt, sideways, forward, climb, fast());
      traveler.animateFlight(dt, sideways, forward, climb, fast(), motion.matches);
      controller.frame(camera, true);
      nearest = null;
      let nearestDistance = 4.2;
      for (const portal of portals) {
        gateLocal.copy(pawn.position);
        gateLocal.y += .85;
        portal.stand.worldToLocal(gateLocal);
        const { x, y, z } = gateLocal;
        const distance = Math.hypot(x, y - 1.6, z);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = portal;
        }
        // Capture an approaching traveler only inside the arched opening.
        if (Math.abs(z) < .85 && y > .24 && x * x + Math.max(0, y - 2.15) ** 2 < .90 ** 2) {
          gateLocal.copy(previousFlight);
          gateLocal.y += .85;
          portal.stand.worldToLocal(gateLocal);
          if (Math.abs(gateLocal.z) > Math.abs(z)) {
            navigate(portal.id);
            break;
          }
        }
      }
    } else if (exploring && !flying) {
      controller.walk(dt, sideways, forward, fast(), traveler, motion.matches, portals, shiftHeld);
      let closest = 4.5;
      nearest = null;
      for (const portal of portals) {
        const pos = portal.stand.position;
        const distance = Math.min(Math.hypot(pos.x - pawn.position.x, pos.z - pawn.position.z),
          portal.plaque.object.getWorldPosition(projected).distanceTo(pawn.position));
        if (distance < closest) { nearest = portal; closest = distance; }
      }
    }
    nearestButton.hidden = !nearest || mapOpen || exhibitOpen || Boolean(move);
    if (nearest && nearestButton.textContent !== 'Enter ' + nearest.link.textContent) {
      nearestButton.textContent = 'Enter ' + nearest.link.textContent;
    }
    lastTime = now;
    if (move) {
      const progress = motion.matches ? 1 : THREE.MathUtils.clamp((now - move.start) / move.passage.duration, 0, 1);
      move.passage.draw(progress);
      veil.style.opacity = THREE.MathUtils.smoothstep(progress, .80, 1);
      if (progress === 1 && !move.arrived) {
        move.arrived = true;
        openDestination(move.id);
      }
    }
    const time = motion.matches ? 0 : (now - start) * 0.001;
    if (transfer) {
      const t = motion.matches ? 1 : THREE.MathUtils.clamp((now - transfer.start) / transfer.duration, 0, 1);
      let travel, air, bend;
      if (flying) {
        const pushOff = transfer.from.y < floor + .045 ? .23 : 0;
        const jump = THREE.MathUtils.clamp((t - pushOff) / (1 - pushOff), 0, 1);
        travel = 1 - (1 - jump) ** 2;
        air = THREE.MathUtils.smoothstep(jump, .04, .8);
        const crouch = pushOff ? THREE.MathUtils.smoothstep(t, 0, pushOff) : 0;
        bend = .72 * crouch * (1 - THREE.MathUtils.smoothstep(jump, 0, .2)) + .32 * Math.sin(Math.PI * jump);
      } else {
        const contact = 1 - 330 / transfer.duration;
        const descent = Math.min(1, t / contact);
        travel = descent * (.3 + .7 * descent);
        air = 1 - THREE.MathUtils.smoothstep(descent, 0, .85);
        const recovery = Math.max(0, (t - contact) / (1 - contact));
        bend = .13 * air + .76 * Math.sin(Math.PI * recovery ** .65);
      }
      pawn.position.lerpVectors(transfer.from, transfer.to, travel);
      traveler.jumpToFlightPose(air, bend, dt);
      controller.frame(camera, flying);
      if (!flying) camera.position.y += pawn.position.y - floor;
      const blend = THREE.MathUtils.smoothstep(t, 0, 1);
      camera.position.lerp(projected.copy(transfer.eyeOffset).add(pawn.position), 1 - blend);
      camera.quaternion.slerp(transfer.rotation, 1 - blend);
      if (t === 1) {
        if (!flying) traveler.glide(false);
        transfer = undefined;
      }
    } else if (mapOpen || exhibitOpen) {
      camera.position.copy(cameraRest).add(pan);
      camera.lookAt(look.copy(target).add(pan));
    } else if (!flying && !move) {
      controller.frame(camera, false, hits);
    }
    if (viewBlend) {
      const t = THREE.MathUtils.smoothstep(now - viewBlend.start, 0, 420);
      camera.position.lerp(viewBlend.position, 1 - t);
      camera.quaternion.slerp(viewBlend.rotation, 1 - t);
      if (t === 1) viewBlend = undefined;
    }
    flight.updateBackdrop(camera);
    camera.updateMatrixWorld();

    portals.forEach(({ id, stand, link, inlay, panel, orb, nameplate }, index) => {
      const active = id === move?.id || id === nearest?.id || id === hovered || id === focused || link.hasAttribute('aria-current');
      link.classList.toggle('is-highlighted', active);
      inlay.material.emissiveIntensity = active ? 1.5 : 0.56;
      panel.material.uniforms.time.value = time;
      panel.material.uniforms.highlight.value = active ? 1 : 0;
      orb.rotation.set(.05, .36 * Math.sin(time * .52 + index), .035 * Math.sin(time * .75 + index));
      orb.position.y = 1.70 + 0.13 * Math.sin(time * 1.25 + index);
      orb.scale.setScalar(active ? 1.14 : 1);
      projected.copy(nameplate.position);
      stand.localToWorld(projected).project(camera);
      link.style.visibility = exhibitOpen || move || projected.z < -1 || projected.z > 1 ||
        (flying && (Math.abs(projected.x) > 1 || Math.abs(projected.y) > 1)) ? 'hidden' : '';
      link.style.left = ((projected.x + 1) * 50).toFixed(2) + '%';
      link.style.top = ((1 - projected.y) * 50).toFixed(2) + '%';
    });
    renderer.render(scene, camera);
  }

  function needsFrames() {
    return Boolean(transfer || viewBlend) || !motion.matches || held.size || (flying && shiftHeld)
      || (!flying && !exhibitOpen && controller.moving) || (padIndex !== undefined && !exhibitOpen);
  }

  function loop(now) {
    frameId = 0;
    draw(now);
    if (!frameId && needsFrames() && !disposed && ready) frameId = requestAnimationFrame(loop);
  }

  function refresh() {
    if (disposed || !ready) return;
    if (!needsFrames()) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      draw(performance.now());
    } else if (!frameId) {
      frameId = requestAnimationFrame(loop);
    }
  }

  function resize() {
    const bounds = container.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    width = Math.round(bounds.width);
    height = Math.round(bounds.height);
    const aspect = width / height;
    camera.fov = exhibitOpen ? 36 : 47;
    if (exhibitOpen) {
      readingPortal.plaque.object.getWorldPosition(target);
      // Keep the eye between the gate and the plaque on tall screens.
      const fit = Math.max(8, 9.4 / aspect);
      const depth = Math.min(10, fit);
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(Math.PI / 10) * fit / depth));
      cameraRest.set(0, 0, depth).applyQuaternion(readingPortal.stand.quaternion).add(target);
    } else if (mapOpen) {
      target.set(0, 0, -6);
      const distance = Math.max(40, 53 / aspect);
      cameraRest.set(0, distance * .8, -6 + distance * .6);
    }
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // Render at display density, with a pixel budget for large high-DPI windows.
    const budgetRatio = Math.sqrt(6000000 / (width * height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 3, Math.max(1, budgetRatio));
    renderer.setDrawingBufferSize(width, height, pixelRatio);
    ready = true;
    draw(performance.now());
    refresh();
  }

  function portalAt(event) {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    aim.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      1 - ((event.clientY - bounds.top) / bounds.height) * 2,
    );
    ray.setFromCamera(aim, camera);
    if (exhibitOpen) {
      const intersection = ray.intersectObject(readingPortal.plaque.face, false)[0];
      return intersection ? readingPortal.plaque.actionAt(intersection.uv) : null;
    }
    const hit = ray.intersectObjects(selectable, false)[0];
    return hit?.object.userData.id ?? null;
  }

  function panByPixels(dx, dy) {
    const distance = camera.position.distanceTo(look);
    const units = 2 * Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV() / 2)) * distance / height;
    const tilt = Math.max(.24, (camera.position.y - look.y) / distance);
    pan.x = THREE.MathUtils.clamp(pan.x - dx * units, -40, 40);
    pan.z = THREE.MathUtils.clamp(pan.z - dy * units / tilt, -40, 40);
    refresh();
  }

  container.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag || document.pointerLockElement === canvas) return;
    suppressClick = false;
    if (exhibitOpen || move || event.target.closest('#world-zoom, #flight-destination, #world-overview')) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  }, { signal });
  container.addEventListener('dragstart', event => { if (drag) event.preventDefault(); }, { signal });
  container.addEventListener('pointermove', event => {
    if (event.pointerId !== drag?.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved) {
      canvas.focus({ preventScroll: true });
      container.setPointerCapture(event.pointerId);
      drag.moved = true;
      container.classList.add('is-panning');
      canvas.style.cursor = '';
      hovered = null;
    }
    drag.x = event.clientX;
    drag.y = event.clientY;
    if (!mapOpen) {
      controller.orbit(dx, dy);
      refresh();
    } else panByPixels(dx, dy);
  }, { signal });
  function finishDrag(event) {
    if (event && drag?.id !== event.pointerId) return;
    suppressClick = Boolean(drag?.moved);
    drag = null;
    container.classList.remove('is-panning');
  }
  window.addEventListener('pointerup', finishDrag, { signal });
  window.addEventListener('pointercancel', finishDrag, { signal });
  window.addEventListener('blur', () => finishDrag(), { signal });
  container.addEventListener('click', event => {
    if (suppressClick && event.detail) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
    }
  }, { capture: true, signal });

  canvas.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || drag || move) return;
    hovered = portalAt(event);
    canvas.style.cursor = hovered ? 'pointer' : '';
    refresh();
  }, { signal });
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
    aim.set(0, 0);
    refresh();
  }, { signal });
  canvas.addEventListener('click', (event) => {
    if (move || document.pointerLockElement === canvas) return;
    const id = portalAt(event);
    if (exhibitOpen) id?.run();
    else if (id) navigate(id);
  }, { signal });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    ready = false;
    onError?.(new Error('The 3D scene lost its graphics context.'));
  }, { signal });
  motion.addEventListener('change', refresh, { signal });

  for (const { id, link } of portals) {
    link.addEventListener('pointerenter', () => {
      hovered = id;
      refresh();
    }, { signal });
    link.addEventListener('pointerleave', () => {
      if (hovered === id) hovered = null;
      refresh();
    }, { signal });
    link.addEventListener('focus', () => {
      focused = id;
      refresh();
    }, { signal });
    link.addEventListener('blur', () => {
      if (focused === id) focused = null;
      refresh();
    }, { signal });
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigate(id);
    }, { signal });
  }

  const observer = new ResizeObserver(resize);
  const selection = new MutationObserver(refresh);
  function dispose() {
    if (disposed) return;
    disposed = true;
    releaseMouse();
    events.abort();
    observer.disconnect();
    selection.disconnect();
    cancelAnimationFrame(frameId);
    const geometry = new Set();
    const materials = new Set();
    const spriteMaps = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometry.add(object.geometry);
      if (object.material) materials.add(object.material);
      if (object.isSprite && object.material.map) spriteMaps.add(object.material.map);
    });
    geometry.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    spriteMaps.forEach(map => map.dispose());
    container.classList.remove('entering-portal');
    chart.hidden = zoomBar.hidden = true;
    walkBar.hidden = true;
    caption.textContent = '';
    veil.style.opacity = 0;
    key.shadow.dispose();
    groundTexture.dispose();
    portals.forEach(({ panel }) => panel.material.uniforms.thumbnail.value.dispose());
    traveler.dispose();
    portals.forEach(portal => portal.plaque.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    portals.forEach(({ link }) => link.remove());
  }

  try {
    container.append(canvas, ...portals.map(({ link }) => link));
    observer.observe(container);
    selection.observe(container, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
    resize();
  } catch (error) {
    dispose();
    throw error;
  }

  return {
    dispose,
    explorationHash: () => flying ? '#flight' : '#board',
    pauseInput() {
      releaseMouse();
      clearInput();
    },
    showExhibit(exhibit, airborne = false) {
      const previousPortal = readingPortal;
      viewBlend = undefined;
      const reveal = exhibit && move?.arrived && !motion.matches;
      const changingMode = initialized && !exhibit && !previousPortal && airborne !== flying;
      move = undefined;
      transfer = undefined;
      finishDrag();
      if (!changingMode) {
        releaseMouse();
        held.clear();
        resetSpeed();
      }
      pan.set(0, 0, 0);
      mapOpen = false;
      exhibitOpen = Boolean(exhibit);
      readingPortal = exhibit ? portals.find(portal => portal.id === exhibit.id) : null;
      if (!initialized) {
        faceEntrance(portals.find(portal => portal.id === 'projects'), false);
      } else if (changingMode) {
        const from = pawn.position.clone();
        const to = from.clone();
        if (airborne) to.y = Math.max(2.35, from.y + 1.5);
        else {
          constrainToPlaza(to);
          to.y = floor;
        }
        setFlight(airborne, pawn.rotation.y, true);
        if (motion.matches) pawn.position.copy(to);
        else {
          const duration = airborne ? 800 : 330 + THREE.MathUtils.clamp(Math.sqrt(from.distanceTo(to) / 9) * 1000, 450, 2400);
          transfer = { from, to, start: performance.now(), duration,
            eyeOffset: camera.position.clone().sub(from), rotation: camera.quaternion.clone() };
        }
      }
      initialized = true;
      if (readingPortal && readingPortal !== previousPortal) {
        // Stand at the far end of this gate's tunnel while reading.
        pawn.position.set(0, 0, -5);
        readingPortal.stand.localToWorld(pawn.position);
        pawn.position.y = flying ? 2.35 : floor;
        setFlight(flying, readingPortal.stand.rotation.y);
      } else if (previousPortal && !readingPortal) {
        easeCamera();
        faceEntrance(previousPortal, airborne);
      }
      if (readingPortal) readingPortal.plaque.paint(exhibit);
      caption.textContent = '';
      container.classList.remove('entering-portal');
      veil.style.opacity = 0;
      for (const animation of veil.getAnimations()) animation.cancel();
      if (reveal) veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: 'ease-out' });
      nearest = null;
      nearestButton.hidden = true;
      walkBar.hidden = chart.hidden = exhibitOpen;
      chart.disabled = false;
      pawn.visible = !exhibitOpen;
      for (const { link, tunnel, panel, nameplate, orb, halo } of portals) {
        tunnel.visible = false;
        panel.material.uniforms.opening.value = 0;
        nameplate.visible = orb.visible = halo.visible = true;
        link.hidden = exhibitOpen;
      }
      aim.set(0, 0);
      updateMapControls();
      resize();
    },
  };
}
