import * as THREE from '../vendor/three/three.module.js';

// Repeated pieces share geometry and materials across the sky islands.
export function addSanctuary(scene) {
  const marble = new THREE.MeshStandardMaterial({ color: 0xaab1c7, roughness: .89, flatShading: true });
  const slate = new THREE.MeshStandardMaterial({ color: 0x393d62, roughness: .96, flatShading: true });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc7a163, metalness: .42, roughness: .4 });
  const moss = new THREE.MeshStandardMaterial({ color: 0x586f72, roughness: .9 });
  const rock = new THREE.IcosahedronGeometry(1, 0);
  const drum = new THREE.CylinderGeometry(1, 1, 1, 10);
  const shaft = new THREE.CylinderGeometry(.82, 1, 1, 10);
  const leaf = new THREE.ConeGeometry(1, 1, 7);
  function piece(parent, geometry, material, x, y, z, sx, sy, sz) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  }
  const arch = new THREE.TorusGeometry(1.7, .22, 6, 28, Math.PI);
  for (const [x, y, z, size, angle] of [
    [-10, -1.5, -14, .95, .32], [10, -2.4, -16, 1.02, -.48],
    [-4, -4, -25, .90, -.32], [18, -1, -7, .86, -.6],
  ]) {
    const isle = new THREE.Group();
    isle.position.set(x, y, z);
    isle.scale.setScalar(size);
    isle.rotation.y = angle;
    scene.add(isle);
    piece(isle, rock, slate, 0, -2.1, 0, 4, 3.5, 2.6);
    piece(isle, drum, moss, 0, -.55, 0, 3.25, .45, 2.15);
    piece(isle, drum, marble, 0, -.17, 0, 2.65, .32, 1.65);
    for (const side of [-1, 1]) {
      const px = 1.7 * side;
      piece(isle, drum, marble, px, .17, 0, .48, .34, .48);
      piece(isle, shaft, marble, px, 1.92, 0, .32, 3.22, .32);
      piece(isle, drum, gold, px, 3.46, 0, .36, .13, .36);
      piece(isle, drum, marble, px, 3.65, 0, .46, .26, .46);
      piece(isle, leaf, moss, px * 1.58, .58, -.56, .42, 1.74, .42);
    }
    piece(isle, arch, marble, 0, 3.72, 0, 1, 1, 1);
    piece(isle, rock, gold, 0, 5.43, .04, .25, .51, .29);
  }
}

export function compassRose(scene) {
  const vertices = [];
  const colors = [];
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8;
    const length = i % 4 === 0 ? 8.3 : i % 2 === 0 ? 6.3 : 4.4;
    const dx = Math.cos(angle), dz = Math.sin(angle);
    for (const side of [-1, 1]) {
      vertices.push(dx * 1.25, 0, dz * 1.25, dx * length, 0, dz * length,
        dx * 2.8 - side * dz * .24, 0, dz * 2.8 + side * dx * .24);
      const tint = new THREE.Color(side > 0 ? 0xbf995a : 0x776a59);
      for (let j = 0; j < 3; j++) colors.push(tint.r, tint.g, tint.b);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  mesh.position.set(0, -.372, -1);
  scene.add(mesh);
}

export function makeRelic(id, color, gold) {
  const group = new THREE.Group();
  const enamel = new THREE.MeshStandardMaterial({
    color, roughness: .30, metalness: .22, emissive: color, emissiveIntensity: .16,
  });
  function part(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }
  if (id === 'about') {
    part(new THREE.SphereGeometry(.26, 18, 12), enamel, 0, 0, 0);
    const orbit = new THREE.TorusGeometry(.49, .035, 8, 40);
    part(orbit, gold, 0, 0, 0).rotation.x = .75;
    part(orbit, gold, 0, 0, 0).rotation.y = .93;
    part(new THREE.OctahedronGeometry(.085), enamel, .46, .13, 0);
  } else if (id === 'experience') {
    const glass = new THREE.ConeGeometry(.27, .42, 8);
    part(glass, enamel, 0, .21, 0).rotation.z = Math.PI;
    part(glass, enamel, 0, -.21, 0);
    const rim = new THREE.CylinderGeometry(.36, .36, .07, 12);
    for (const y of [-.45, .45]) part(rim, gold, 0, y, 0);
    const rod = new THREE.CylinderGeometry(.028, .028, .88, 6);
    for (const x of [-.32, .32]) part(rod, gold, x, 0, 0);
  } else if (id === 'projects') {
    // An open field notebook, with gilded covers and ruled leaves.
    for (const side of [-1, 1]) {
      const leaf = part(new THREE.BoxGeometry(.46, .69, .075), enamel, side * .22, 0, 0);
      leaf.rotation.y = side * .28;
      const cover = part(new THREE.BoxGeometry(.50, .75, .055), gold, side * .23, -.01, -.07);
      cover.rotation.y = leaf.rotation.y;
      for (const y of [.18, .04, -.10]) {
        const line = part(new THREE.BoxGeometry(.26, .018, .016), gold, side * .22, y, .048);
        line.rotation.y = leaf.rotation.y;
      }
    }
  } else if (id === 'interests') {
    const barrel = part(new THREE.CylinderGeometry(.21, .13, .91, 16), enamel, 0, .13, 0);
    barrel.rotation.z = -1.00;
    part(new THREE.CylinderGeometry(.235, .235, .12, 16), gold, .38, .38, 0).rotation.z = -1.00;
    for (const side of [-1, 1]) {
      part(new THREE.CylinderGeometry(.029, .045, .54, 6), gold, side * .13, -.27, 0).rotation.z = side * .52;
    }
  } else {
    part(new THREE.BoxGeometry(.94, .62, .12), enamel, 0, 0, 0);
    for (const side of [-1, 1]) {
      part(new THREE.BoxGeometry(.57, .042, .036), gold, side * .23, .09, .085).rotation.z = side * .59;
    }
    part(new THREE.OctahedronGeometry(.10), gold, 0, -.035, .106);
  }
  return group;
}
