import * as THREE from '../vendor/three/three.module.js';
import { createPlaque } from './portfolio-3d-plaque.js';

import { addSanctuary, compassRose, makeRelic } from './portfolio-3d-sanctuary.js';

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

function addSky(scene, refresh) {
  const map = new THREE.TextureLoader().load(new URL('./img/scene/title-1600.jpg', import.meta.url).href, refresh);
  map.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(145, 108), new THREE.MeshBasicMaterial({
    map, color: 0x9da9d0, fog: false, depthWrite: false,
  }));
  sky.position.set(0, 12, -67);
  sky.renderOrder = -1;
  scene.add(sky, makeStars());
  return map;
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
  map.repeat.set(6, 6);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

function addPlaza(scene) {
  const map = slateTexture();
  const stone = new THREE.MeshStandardMaterial({ color: 0x67667c, map, bumpMap: map, bumpScale: .055, roughness: .71, metalness: .13 });
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(14, 14.4, 0.34, 80), stone);
  plaza.position.set(0, -0.56, -1);
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
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  }));
}

export function mountPortfolio3D(container, { onNavigate, onError } = {}) {
  const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: 'low-power' });
  const canvas = renderer.domElement;
  canvas.className = 'portfolio-3d-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const textScale = Math.min(3, Math.max(2, Math.ceil(window.devicePixelRatio || 1)),
    Math.floor(renderer.capabilities.maxTextureSize / 780));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090d1b);
  scene.fog = new THREE.FogExp2(0x090d1b, 0.018);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 150);
  scene.add(new THREE.HemisphereLight(0xc8dafe, 0x3b2539, 1.55));
  const key = new THREE.DirectionalLight(0xffdcaf, 2.2);
  key.position.set(-4, 9, 7);
  scene.add(key);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: .1, far: 42 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = .035;
  const rim = new THREE.DirectionalLight(0xa0bcff, .85);
  rim.position.set(7, 6, -9);
  scene.add(rim);
  const skyTexture = addSky(scene, refresh);
  addSanctuary(scene);
  const groundTexture = addPlaza(scene);
  const plaque = createPlaque(textScale, refresh);
  scene.add(plaque.object);
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
  scene.add(pawn);
  let move;
  const tileGeometry = new THREE.BoxGeometry(.74, .19, .74);
  const tileMaterials = [0x9895aa, 0x868aa5, 0xb6a18a, 0x777997].map(color =>
    new THREE.MeshStandardMaterial({ color, roughness: .71 }));
  const tiles = Array.from({ length: 20 }, (_, i) => {
    const tile = new THREE.Mesh(tileGeometry, tileMaterials[i % tileMaterials.length]);
    tile.rotation.y = Math.PI / 4;
    scene.add(tile);
    return tile;
  });
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
  const portals = sections.map(({ id, label, color }) => {
    const stand = new THREE.Group();
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
    stand.add(stone, edge, doorway, inlay, panel, orb, halo, keystone, hit, nameplate);
    for (const mesh of [stone, edge, doorway, inlay, keystone]) mesh.castShadow = true;
    scene.add(stand);

    const link = document.createElement('a');
    link.className = 'portfolio-3d-portal-link';
    link.href = '#' + id;
    link.dataset.section = id;
    link.textContent = label;
    return { id, stand, inlay, panel, orb, hit, link, nameplate };
  });
  const hits = portals.map(({ hit }) => hit);
  const events = new AbortController();
  const { signal } = events;
  const zoomBar = document.querySelector('#world-zoom');
  const [zoomOut, zoomReset, zoomIn] = zoomBar.querySelectorAll('button');
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
  zoomReset.addEventListener('click', () => setZoom(1), { signal });
  container.addEventListener('wheel', event => {
    if (exhibitOpen || event.ctrlKey || !event.deltaY) return;
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
  let nearest = null, roaming = false, lastTime = 0, walked = 0;
  const spawn = new THREE.Vector3();

  function beginRoaming() {
    if (roaming) return;
    roaming = true;
    document.querySelector('#world-map').hidden = false;
    resize();
  }
  function walk(dx, dz, distance) {
    const length = Math.hypot(dx, dz);
    if (!length) return;
    pawn.position.x += distance * dx / length;
    pawn.position.z += distance * dz / length;
    // Keep the traveler on the round stone platform, centered at (0, -1).
    const radius = Math.hypot(pawn.position.x, pawn.position.z + 1);
    if (radius > 12) {
      pawn.position.x *= 12 / radius;
      pawn.position.z = (pawn.position.z + 1) * 12 / radius - 1;
    }
    pawn.position.y = -.38;
    pawn.rotation.y = Math.atan2(dx, dz);
    walked += distance;
  }
  function setDirection(source, dir) {
    beginRoaming();
    if (!held.size) lastTime = performance.now();
    held.set(source, dir);
    refresh();
  }
  function clearInput() {
    held.clear();
    refresh();
  }
  window.addEventListener('blur', clearInput, { signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearInput(); }, { signal });
  window.addEventListener('keydown', event => {
    if (exhibitOpen || move || event.altKey || event.metaKey || event.ctrlKey) return;
    const key = event.key.toLowerCase();
    if (walkKeys.has(key)) {
      event.preventDefault();
      if (!event.repeat) setDirection(key, walkKeys.get(key));
    } else if (key === 'e' && nearest && !event.repeat) navigate(nearest.id);
  }, { signal });
  window.addEventListener('keyup', event => { held.delete(event.key.toLowerCase()); }, { signal });
  for (const button of walkBar.querySelectorAll('[data-dir]')) {
    button.addEventListener('pointerdown', event => {
      if (move || exhibitOpen) return;
      button.setPointerCapture(event.pointerId);
      const dir = button.dataset.dir;
      setDirection(event.pointerId, dir);
      // A quick tap takes one step even between animation frames.
      walk(Number(dir === 'right') - Number(dir === 'left'), Number(dir === 'down') - Number(dir === 'up'), .18);
    }, { signal });
    button.addEventListener('lostpointercapture', event => held.delete(event.pointerId), { signal });
    button.addEventListener('click', event => {
      if (event.detail || move || exhibitOpen) return;
      beginRoaming();
      const dir = button.dataset.dir;
      walk(Number(dir === 'right') - Number(dir === 'left'), Number(dir === 'down') - Number(dir === 'up'), .65);
      refresh();
    }, { signal });
  }
  nearestButton.addEventListener('click', () => { if (nearest) navigate(nearest.id); }, { signal });

  function openDestination(id) {
    if (onNavigate) onNavigate(id);
    else window.location.hash = id;
  }

  function navigate(id) {
    if (move) return;
    held.clear();
    if (motion.matches) {
      openDestination(id);
      return;
    }
    const destination = portals.find(portal => portal.id === id).stand.position;
    move = {
      id, start: performance.now(), from: pawn.position.clone(),
      to: new THREE.Vector3(destination.x, destination.y - .26, destination.z + 1),
    };
  }

  function draw(now) {
    if (disposed || !ready) return;
    if (!move && !exhibitOpen) {
      const dirs = new Set(held.values());
      walk(Number(dirs.has('right')) - Number(dirs.has('left')), Number(dirs.has('down')) - Number(dirs.has('up')),
        Math.min(.08, Math.max(0, (now - lastTime) / 1000)) * 4.2);
      traveler.stride(!motion.matches && dirs.size ? Math.sin(walked * 6) : 0);
      let closest = 2.1;
      nearest = null;
      if (roaming) for (const portal of portals) {
        const pos = portal.stand.position;
        const distance = Math.hypot(pos.x - pawn.position.x, pos.z - pawn.position.z);
        if (distance < closest) { nearest = portal; closest = distance; }
      }
      nearestButton.hidden = !nearest;
      if (nearest && nearestButton.textContent !== 'Enter ' + nearest.link.textContent) {
        nearestButton.textContent = 'Enter ' + nearest.link.textContent;
      }
    }
    lastTime = now;
    if (move) {
      const progress = motion.matches ? 1 : THREE.MathUtils.clamp((now - move.start) / 430, 0, 1);
      pawn.position.lerpVectors(move.from, move.to, progress);
      pawn.position.y += Math.sin(progress * Math.PI * 3) ** 2 * .21;
      if (progress === 1) {
        const id = move.id;
        move = undefined;
        openDestination(id);
      }
    }
    const time = motion.matches ? 0 : (now - start) * 0.001;
    const offsetX = motion.matches ? 0 : aim.x * 0.70;
    const offsetY = motion.matches ? 0 : aim.y * 0.38;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraRest.x + offsetX, 0.075);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraRest.y + offsetY, 0.075);
    look.copy(target);
    if (roaming && !exhibitOpen) {
      look.set(pawn.position.x * .84, 1.1, pawn.position.z - 1.3);
      camera.position.set(look.x + offsetX * .25, 5.4, look.z + (width < height ? 7.8 : 6.8));
    }
    camera.lookAt(look);
    camera.updateMatrixWorld();

    if (!exhibitOpen) portals.forEach(({ id, stand, link, inlay, panel, orb, nameplate }, index) => {
      const active = id === hovered || id === focused || link.hasAttribute('aria-current');
      link.classList.toggle('is-highlighted', active);
      inlay.material.emissiveIntensity = active ? 1.5 : 0.56;
      panel.material.uniforms.time.value = time;
      panel.material.uniforms.highlight.value = active ? 1 : 0;
      orb.rotation.set(.05, .36 * Math.sin(time * .52 + index), .035 * Math.sin(time * .75 + index));
      orb.position.y = 1.70 + 0.13 * Math.sin(time * 1.25 + index);
      orb.scale.setScalar(active ? 1.14 : 1);
      projected.copy(nameplate.position);
      stand.localToWorld(projected).project(camera);
      link.style.visibility = projected.z < -1 || projected.z > 1 ? 'hidden' : '';
      link.style.left = ((projected.x + 1) * 50).toFixed(2) + '%';
      link.style.top = ((1 - projected.y) * 50).toFixed(2) + '%';
    });
    renderer.render(scene, camera);
  }

  function loop(now) {
    frameId = 0;
    draw(now);
    if ((!motion.matches || held.size) && !disposed && ready) frameId = requestAnimationFrame(loop);
  }

  function refresh() {
    if (disposed || !ready) return;
    if (motion.matches && !held.size) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      camera.position.copy(cameraRest);
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
    const portrait = aspect < 1.34;
    const positions = portrait && !roaming
      ? [[-1.6, 5.26, -3.3], [1.6, 5.26, -3.3], [-1.6, 2.78, -0.82], [1.6, 2.78, -0.82], [0, 0.10, 1.66]]
      : [[-5.8, 0, 1.1], [-2.93, 0.15, -0.92], [0, 0.45, -2.05], [2.93, 0.15, -0.92], [5.8, 0, 1.1]];

    portals.forEach(({ stand, nameplate }, index) => {
      stand.position.set(...positions[index]);
      nameplate.position.y = roaming ? 2.94 : .48;
      const w = roaming ? 1.65 : 2.1;
      nameplate.scale.set(w, w / 3, 1);
    });
    const distance = portrait ? Math.max(16.5, 9.3 / aspect) : Math.max(13.4, 23.5 / aspect);
    const pawnZ = portrait ? 3.1 : 3.55;
    spawn.set(portrait ? -1.12 : 0, -.38, pawnZ);
    if (!roaming) pawn.position.copy(spawn);
    const route = portrait ? [4, 2, 3, 1, 0] : [0, 1, 2, 3, 4];
    const trail = [[spawn.x, 0, pawnZ], ...route.map(index => {
      const [x, y, z] = positions[index];
      return [x, y, z + 1.08];
    })];
    tiles.forEach((tile, index) => {
      const segment = Math.floor(index / 4);
      const from = trail[segment];
      const to = trail[segment + 1];
      const step = ((index % 4) + 1) / 5;
      tile.position.set(
        THREE.MathUtils.lerp(from[0], to[0], step),
        THREE.MathUtils.lerp(from[1], to[1], step) - .29,
        THREE.MathUtils.lerp(from[2], to[2], step),
      );
      tile.visible = !exhibitOpen && (index % 2 === 0 || Math.hypot(to[0] - from[0], to[2] - from[2]) > 5);
    });
    if (exhibitOpen) {
      target.set(0, 3.82, -1);
      cameraRest.set(0, 3.82, Math.max(12.6, 13.4 / aspect) - 1);
    } else {
      target.set(0, portrait ? 4.25 : 1.64, -0.46);
      cameraRest.set(0, portrait ? 10.5 : 5.75, distance);
    }
    camera.position.copy(cameraRest);
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
      const intersection = ray.intersectObject(plaque.face, false)[0];
      return intersection ? plaque.actionAt(intersection.uv) : null;
    }
    const hit = ray.intersectObjects(hits, false)[0];
    return hit?.object.userData.id ?? null;
  }

  canvas.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
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
    events.abort();
    observer.disconnect();
    selection.disconnect();
    cancelAnimationFrame(frameId);
    const geometry = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometry.add(object.geometry);
      if (object.material) materials.add(object.material);
      if (object.isSprite) object.material.map.dispose();
    });
    geometry.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    zoomBar.hidden = true;
    walkBar.hidden = true;
    key.shadow.dispose();
    groundTexture.dispose();
    portals.forEach(({ panel }) => panel.material.uniforms.thumbnail.value.dispose());
    traveler.dispose();
    skyTexture.dispose();
    plaque.dispose();
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
    showExhibit(exhibit) {
      move = undefined;
      roaming = false;
      pawn.rotation.y = 0;
      exhibitOpen = Boolean(exhibit);
      held.clear();
      nearest = null;
      nearestButton.hidden = true;
      walkBar.hidden = zoomBar.hidden = exhibitOpen;
      camera.zoom = exhibitOpen ? 1 : mapZoom;
      pawn.visible = !exhibitOpen;
      for (const { stand, link } of portals) {
        stand.visible = !exhibitOpen;
        link.hidden = exhibitOpen;
      }
      plaque.paint(exhibit);
      aim.set(0, 0);
      resize();
    },
  };
}
