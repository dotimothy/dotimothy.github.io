import * as THREE from '../vendor/three/three.module.js';

const launchZ = 16;

// Both walking and flight use these permanent locations on the plaza.
export function placeAirgate(stand, index) {
  const angle = (index - 2) * .32;
  const distance = [27, 30, 33, 30, 27][index];
  stand.scale.setScalar(2);
  stand.rotation.y = -angle;
  stand.position.set(Math.sin(angle) * distance, 0, launchZ - Math.cos(angle) * distance);
}

export function dressAirgate(tint) {
  const island = new THREE.Group();
  const rock = new THREE.MeshStandardMaterial({ color: 0x454255, roughness: .9, flatShading: true });
  const crystal = new THREE.MeshStandardMaterial({ color: tint, emissive: tint, emissiveIntensity: .55, metalness: .35 });
  const shard = new THREE.OctahedronGeometry(1);
  for (const [x, y, z, w, h] of [[0,-.69,0,1.64,1.16],[-.92,-.45,-.28,.61,.79],[.89,-.53,.17,.68,.94]]) {
    const stone = new THREE.Mesh(shard, rock);
    stone.position.set(x, y, z);
    stone.scale.set(w, h, w * .82);
    stone.rotation.y = .45 + x;
    island.add(stone);
  }
  for (const side of [-1, 1]) {
    const gem = new THREE.Mesh(shard, crystal);
    gem.scale.set(.11, .49, .16);
    gem.position.set(side * 1.17, .15, -.2);
    gem.rotation.z = -side * .27;
    island.add(gem);
  }
  const hoop = new THREE.TorusGeometry(1, .022, 6, 72);
  const glow = new THREE.MeshBasicMaterial({ color: tint, fog: false });
  const trail = new THREE.Group();
  for (let i = 1; i <= 4; i++) {
    const rune = new THREE.Mesh(shard, glow);
    rune.position.set(0, .48 - i * .04, 1 + i * 1.18);
    rune.scale.setScalar(.075 + (4 - i) * .018);
    trail.add(rune);
  }
  island.add(trail);

  const tunnel = new THREE.Group();
  tunnel.position.y = 1.6;
  const gold = new THREE.MeshBasicMaterial({ color: 0xffdfa3 });
  for (let i = 0; i < 12; i++) {
    const ring = new THREE.Mesh(hoop, i % 3 === 0 ? gold : glow);
    ring.position.z = -.52 * i;
    ring.scale.set(1.0 + .025 * i, 1.24 + .024 * i, 1);
    tunnel.add(ring);
  }
  const sparks = [];
  for (let i = 0; i < 72; i++) {
    const angle = i * 2.4;
    const x = 1.02 * Math.cos(angle), y = 1.26 * Math.sin(angle);
    const z = -(i % 17) * .38;
    sparks.push(x, y, z, x, y, z - .17 - (i % 4) * .09);
  }
  const streaks = new THREE.BufferGeometry();
  streaks.setAttribute('position', new THREE.Float32BufferAttribute(sparks, 3));
  tunnel.add(new THREE.LineSegments(streaks, new THREE.LineBasicMaterial({ color: tint, fog: false })));
  tunnel.visible = island.visible = false;
  return { island, tunnel };
}

// The approach meets the threshold on its normal, then the chase camera
// overtakes the traveler and passes between the rings of the selected gate.
export function createPassage(portal, pawn, camera) {
  const stand = portal.stand;
  const center = stand.localToWorld(new THREE.Vector3(0, 1.6, .05));
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(stand.quaternion);
  const from = pawn.position.clone().add(new THREE.Vector3(0, .85, 0));
  const behindGate = from.clone().sub(center).dot(normal) < 0;
  portal.tunnel.visible = true;
  portal.nameplate.visible = portal.orb.visible = portal.halo.visible = false;
  const distance = from.distanceTo(center);
  const control = from.clone().lerp(center, .35);
  control.y += Math.min(2, distance * .065);
  if (behindGate) {
    // Loop around the frame so both approaches emerge on the gallery side.
    control.copy(center).addScaledVector(normal, 8);
    control.x += normal.z * 8;
    control.z -= normal.x * 8;
  }
  const approach = new THREE.CubicBezierCurve3(from, control,
    center.clone().addScaledVector(normal, Math.min(8, distance * .36)), center);
  const cameraStart = camera.position.clone(), rotationStart = camera.quaternion.clone();
  const position = new THREE.Vector3(), tangent = new THREE.Vector3(), sight = new THREE.Vector3();
  const duration = 1600 + Math.min(1400, distance * 35);
  return {
    duration,
    draw(t) {
      const u = Math.min(1, t / .64);
      approach.getPoint(u, position);
      approach.getTangent(u, tangent);
      const dive = Math.max(0, (t - .64) / .36);
      if (dive > 0) {
        tangent.copy(normal).negate();
        position.addScaledVector(tangent, 10 * dive);
      }
      pawn.position.copy(position);
      pawn.position.y -= .85;
      pawn.rotation.set(.98, Math.atan2(tangent.x, tangent.z), 0, 'YXZ');
      const chase = 1 - THREE.MathUtils.smoothstep(t, .48, .83);
      camera.position.copy(position).addScaledVector(tangent, -4.8 * chase);
      camera.position.y += 2 * chase;
      const alignment = THREE.MathUtils.smoothstep(t, 0, .32);
      camera.position.lerp(cameraStart, 1 - alignment);
      camera.lookAt(sight.copy(position).addScaledVector(tangent, 5));
      camera.quaternion.slerp(rotationStart, 1 - alignment);
      pawn.visible = chase > .20;
      portal.panel.material.uniforms.opening.value = THREE.MathUtils.smoothstep(t, 0, .50);
    },
  };
}
