import * as THREE from '../vendor/three/three.module.js';

// Timothy's portfolio avatar, navy suit and gold tie.
export function createTraveler(refresh) {
  const body = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0x243358, roughness: .82 });
  const trousers = new THREE.MeshStandardMaterial({ color: 0x202940 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xf4c661 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0xf4eee0 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x201b1a });
  const skin = new THREE.MeshStandardMaterial({ color: 0xe4ad8b });

  function ellipsoid(parent, material, x, y, z, w, h, d) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), material);
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  const legs = [], arms = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    body.add(leg);
    legs.push(leg);
    leg.position.set(side * .13, .70, 0);
    ellipsoid(leg, trousers, 0, -.29, 0, .115, .35, .13);
    ellipsoid(leg, hair, 0, -.60, .055, .12, .085, .18);

    const arm = new THREE.Group();
    body.add(arm);
    arms.push(arm);
    arm.position.set(side * .27, 1.13, 0);
    ellipsoid(arm, suit, side * .04, -.17, 0, .10, .24, .125);
    ellipsoid(arm, skin, side * .055, -.37, .025, .078, .086, .076);
  }
  ellipsoid(body, suit, 0, .92, 0, .32, .39, .215);
  ellipsoid(body, shirt, 0, 1.095, .153, .155, .20, .06);
  ellipsoid(body, gold, 0, 1.035, .215, .042, .145, .026);
  const head = ellipsoid(body, hair, 0, 1.55, 0, .30, .37, .26);
  const face = new THREE.TextureLoader().load(new URL('./img/logo.png', import.meta.url).href, refresh);
  face.colorSpace = THREE.SRGBColorSpace;
  face.offset.set(.13, .03);
  face.repeat.set(.75, .95);
  const portrait = new THREE.Mesh(
    new THREE.SphereGeometry(1.012, 32, 24, -.045 * Math.PI, 1.09 * Math.PI, .04 * Math.PI, .92 * Math.PI),
    new THREE.MeshBasicMaterial({ map: face, alphaTest: .5 }),
  );
  head.add(portrait);
  return {
    body,
    stride(phase) {
      for (let i = 0; i < 2; i++) {
        legs[i].rotation.x = (i ? 1 : -1) * phase * .42;
        arms[i].rotation.x = -legs[i].rotation.x * .8;
      }
    },
    dispose() { face.dispose(); },
  };
}
