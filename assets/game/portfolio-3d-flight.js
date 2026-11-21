import * as THREE from '../vendor/three/three.module.js';

// Wrap a volume of stars around the camera. Each point stays fixed in world
// space until it leaves the visible radius, even on long flights.
export function createFlight() {
  const seeds = new Float32Array(1800 * 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random() * 80;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(seeds, 3));
  const stars = new THREE.Points(geometry, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      varying float glow;
      varying float tint;
      void main() {
        vec3 offset = mod(position - cameraPosition + 40.0, 80.0) - 40.0;
        vec4 view = viewMatrix * vec4(cameraPosition + offset, 1.0);
        glow = (1.0 - smoothstep(28.0, 39.0, length(offset))) * smoothstep(0.5, 3.0, -view.z);
        tint = fract(position.x);
        gl_Position = projectionMatrix * view;
        gl_PointSize = clamp((28.0 + 24.0 * tint) / max(1.0, -view.z), 1.4, 7.0);
      }`,
    fragmentShader: `
      varying float glow;
      varying float tint;
      void main() {
        vec3 color = mix(vec3(0.62, 0.81, 1.0), vec3(1.0, 0.86, 0.60), tint);
        gl_FragColor = vec4(color, glow * (1.0 - smoothstep(0.15, 0.5, length(gl_PointCoord - 0.5))));
        #include <colorspace_fragment>
      }`,
  }));
  stars.frustumCulled = false;
  stars.visible = true;

  // Distant clouds turn with the view while nearby stars pass the traveler.
  const dome = new THREE.SphereGeometry(95, 128, 80);
  const normals = dome.getAttribute('normal');
  const colors = [];
  const night = new THREE.Color(0x080c1d), violet = new THREE.Color(0x56466c);
  const blue = new THREE.Color(0x2e516c), color = new THREE.Color();
  for (let i = 0; i < normals.count; i++) {
    const x = normals.getX(i), y = normals.getY(i), z = normals.getZ(i);
    const wave = Math.sin(11 * x + 6 * z) * Math.cos(9 * z - 2 * y);
    const latitude = y + .29 * x - .18 * z + .04 * wave;
    const band = Math.exp(-24 * latitude * latitude);
    const cloud = .48 + .20 * wave + .15 * Math.cos(23 * x + 15 * z + 4 * wave)
      + .08 * Math.sin(39 * z + 6 * wave);
    color.copy(violet).lerp(blue, .5 + .5 * Math.sin(4 * z - 2 * x));
    color.lerp(night, 1 - band * cloud);
    colors.push(color.r, color.g, color.b);
  }
  dome.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const galaxy = new THREE.Mesh(dome, new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false,
  }));
  galaxy.renderOrder = -2;
  stars.add(galaxy);
  // Cloud banks lie below the routes and give the islands a visible horizon
  // that moves independently of the far galaxy as the traveler banks.
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const x = 38 + 178 * t;
    const y = 54 - 16 * Math.sin(Math.PI * t) + 9 * Math.sin(i * 2.3);
    const radius = 19 + 15 * Math.sin(Math.PI * t);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, 'rgba(207,197,219,.29)');
    glow.addColorStop(.54, 'rgba(143,154,199,.20)');
    glow.addColorStop(1, 'rgba(127,141,185,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  const cloudMap = new THREE.CanvasTexture(canvas);
  cloudMap.colorSpace = THREE.SRGBColorSpace;
  const vapor = new THREE.SpriteMaterial({ map: cloudMap, transparent: true, opacity: .64, depthWrite: false });
  for (let i = 0; i < 32; i++) {
    const angle = i * 2.4, radius = 32 + (i % 5) * 9;
    const cloud = new THREE.Sprite(vapor);
    cloud.position.set(Math.cos(angle) * radius, -7 + 4 * Math.sin(i * 1.7), Math.sin(angle) * radius - 8);
    cloud.scale.set(17 + i % 11, 4 + i % 4, 1);
    stars.add(cloud);
  }
  return {
    stars,
    updateBackdrop(camera) {
      galaxy.position.copy(camera.position);
    },
  };
}
