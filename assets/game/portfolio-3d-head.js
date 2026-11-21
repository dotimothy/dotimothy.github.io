import * as THREE from '../vendor/three/three.module.js';

// Horizontal sections of the head, traced in a 308-unit-wide reference portrait.
// Each ring gives the image row, center, half width, front and rear depth,
// and the depth at the sides. The lowest rings converge under the chin.
const rings = [
  [9, 153, 0, -3, -3, -3], [14, 153, 17, 14, -25, -5], [21, 154, 31, 27, -39, -6],
  [32, 154, 42, 36, -50, -7], [49, 155, 49, 40, -56, -8], [65, 155, 52, 39, -58, -8],
  [78, 155, 49, 36, -56, -8], [91, 155, 45, 36, -49, -7], [104, 155, 42, 38, -38, -4],
  [117, 155, 38, 38, -23, 1], [127, 155, 30, 36, -9, 7], [135, 155, 19, 35, 8, 17],
  [139, 155, 9, 31, 19, 24], [141, 155, 0, 26, 26, 26],
];
const top = rings[0][0], bottom = rings[rings.length - 1][0];
// Scale all three axes together so the portrait keeps its aspect ratio.
const unitsPerPixel = .257 / (bottom - top);
const tau = Math.PI * 2;

function section(row) {
  let i = 1;
  while (i < rings.length - 1 && rings[i][0] < row) i++;
  const a = rings[i - 1], b = rings[i];
  const t = (row - a[0]) / (b[0] - a[0]);
  return a.map((n, k) => n + (b[k] - n) * t);
}

function mound(x, y, cx, cy, rx, ry) {
  return Math.exp(-(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2));
}

function headGeometry() {
  const positions = [], uv = [], indices = [];
  const slices = 72, rows = 56;
  for (let j = 0; j <= rows; j++) {
    const y = top + (bottom - top) * j / rows;
    const [, cx, radius, front, back, side] = section(y);
    const cheekPlane = Math.exp(-(((y - 90) / 40) ** 2));
    for (let i = 0; i <= slices; i++) {
      const angle = tau * (i / slices - .5);
      const x = cx + radius * Math.sin(angle), facing = Math.cos(angle);
      let z = facing > 0
        ? side + (front - side) * facing ** (1 - .38 * cheekPlane)
        : side + (side - back) * facing;
      if (facing > 0) {
        // Model the bridge, nose tip, cheekbones, sockets and chin in depth.
        z += facing * (6 * mound(x,y,155,82,8,18) + 8 * mound(x,y,155,94,10,7)
          + 2 * mound(x,y,155,111,16,8)
          + 3 * mound(x,y,130,91,13,12) + 3 * mound(x,y,179,91,13,12)
          - 2 * mound(x,y,138,77,10,6) - 2 * mound(x,y,174,77,10,6)
          + 2 * mound(x,y,155,131,14,6));
      }
      positions.push((x - 155) * unitsPerPixel, (75 - y) * unitsPerPixel, z * unitsPerPixel);
      uv.push(i / slices, 1 - j / rows);
      if (j && i) {
        const d = j * (slices + 1) + i, c = d - 1, b = d - slices - 1, a = b - 1;
        indices.push(a,c,b, b,c,d);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

// Bake a continuous head atlas. The portrait supplies the face; the unseen
// temples, hair and nape are approximated, with the UV seam behind the head.
function portraitAtlas(image) {
  const source = document.createElement('canvas');
  source.width = 616;
  source.height = Math.round(image.naturalHeight * source.width / image.naturalWidth);
  const src = source.getContext('2d');
  src.drawImage(image, 0, 0, source.width, source.height);
  const photo = src.getImageData(0, 0, source.width, source.height).data;
  const atlas = document.createElement('canvas');
  atlas.width = 768;
  atlas.height = 384;
  const ctx = atlas.getContext('2d');
  const output = ctx.createImageData(atlas.width, atlas.height);
  for (let j = 0; j < atlas.height; j++) {
    const y = top + (bottom - top) * (j + .5) / atlas.height;
    const [, center, radius] = section(y);
    for (let i = 0; i < atlas.width; i++) {
      const angle = tau * ((i + .5) / atlas.width - .5);
      const facing = Math.cos(angle);
      const x = center + radius * Math.sin(angle);
      const k = 4 * (Math.floor(2 * y) * source.width + Math.floor(2 * x));
      const blend = THREE.MathUtils.smoothstep(facing, .08, .57) * photo[k + 3] / 255;
      const hairline = 84 - 28 * facing + 2 * Math.sin(angle * 7);
      const hair = 1 - THREE.MathUtils.smoothstep(y, hairline - 3, hairline + 3);
      const grain = 4 * Math.sin(61 * angle + y * .045) + 2 * Math.cos(29 * angle - y * .055);
      const dest = 4 * (j * atlas.width + i);
      for (let c = 0; c < 3; c++) {
        const base = THREE.MathUtils.lerp(skinTone[c], hairTone[c] + grain, hair);
        output.data[dest+c] = THREE.MathUtils.lerp(base, photo[k+c], blend);
      }
      output.data[dest+3] = 255;
    }
  }
  ctx.putImageData(output, 0, 0);
  const map = new THREE.CanvasTexture(atlas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  return map;
}

const skinTone = [195, 140, 115];
const hairTone = [36, 30, 30];

export function createHead(refresh) {
  const material = new THREE.MeshStandardMaterial({color: 0xc38c73, roughness: .87});
  const mesh = new THREE.Mesh(headGeometry(), material);
  mesh.position.set(0, 1.816, .009);
  const earMaterial = new THREE.MeshStandardMaterial({ color: 0xc38c73, roughness: .85 });
  const earShape = new THREE.SphereGeometry(1, 16, 12);
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(earShape, earMaterial);
    ear.position.set(side * 46 * unitsPerPixel, -12 * unitsPerPixel, -.010);
    ear.scale.set(.012, .025, .015);
    ear.rotation.x = -.17;
    mesh.add(ear);
  }
  const image = new Image();
  image.onload = () => {
    material.map = portraitAtlas(image);
    material.color.set(0xffffff);
    material.needsUpdate = true;
    refresh();
  };
  image.src = new URL('./img/bust-cutout.webp', import.meta.url).href;
  return { mesh, dispose() { image.onload = null; material.map?.dispose(); } };
}
