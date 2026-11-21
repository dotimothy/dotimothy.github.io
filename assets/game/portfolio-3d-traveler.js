import * as THREE from '../vendor/three/three.module.js';
import { createHead } from './portfolio-3d-head.js';

// Paint one seamless UV tile per surface. Mipmaps soften the fine detail as the camera pulls back.
function surfaceTexture(sample) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const shade = sample(x * 2 * Math.PI / size, y * 2 * Math.PI / size);
      const offset = (y * size + x) * 4;
      pixels.data[offset] = pixels.data[offset + 1] = pixels.data[offset + 2] = shade;
      pixels.data[offset + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Timothy's portfolio avatar, navy suit and gold tie.
export function createTraveler(refresh) {
  const body = new THREE.Group();
  const twill = surfaceTexture((u, v) => {
    const fold = Math.cos(7 * u + .8 * Math.sin(v));
    const pinstripe = Math.pow(.5 + .5 * Math.cos(24 * u), 9);
    const thread = Math.sin(64 * u + 48 * v);
    return 212 + 9 * fold + 25 * pinstripe + 8 * thread;
  });
  const cloth = { map: twill, bumpMap: twill, bumpScale: .0025, roughness: .84 };
  const suit = new THREE.MeshStandardMaterial({ ...cloth, color: 0x364973 });
  const trousers = new THREE.MeshStandardMaterial({ ...cloth, color: 0x29354e });
  const gold = new THREE.MeshStandardMaterial({ color: 0xf4c661, bumpMap: twill, bumpScale: .001, roughness: .46 });
  const shirt = new THREE.MeshStandardMaterial({ color: 0xf4eee0 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x211d1a, roughness: .40 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc38c73 });

  function ellipsoid(parent, material, x, y, z, w, h, d) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), material);
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  // Horizontal rings give the jacket a shoulder line and let the sleeves and
  // trouser legs taper to their cuffs. Each profile is listed from hem to top.
  function tailored(parent, material, profile, depth) {
    const points = profile.map(([y, radius]) => new THREE.Vector2(radius, y));
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(points, 28), material);
    mesh.scale.z = depth;
    parent.add(mesh);
    return mesh;
  }
  function joint(parent, x, y, z) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    parent.add(pivot);
    return pivot;
  }
  const jacket = [[.87,.195],[.89,.202],[1.12,.184],[1.30,.195],
    [1.51,.214],[1.585,.208],[1.615,.183],[1.65,.075]];
  const jacketDepth = .72;

  // Follow the jacket cross-section up to the collar, including at the
  // shoulder break. Each row spans its left and right edges.
  function panel(material, rows, clearance) {
    const positions = [], indices = [], uvs = [];
    const columns = 8;
    for (const [y, left, right] of rows) {
      const i = jacket.findIndex(([height]) => height >= y);
      const [y0, r0] = jacket[i - 1], [y1, r1] = jacket[i];
      const radius = THREE.MathUtils.lerp(r0, r1, (y - y0) / (y1 - y0));
      for (let col = 0; col <= columns; col++) {
        const x = THREE.MathUtils.lerp(left, right, col / columns);
        const z = jacketDepth * Math.sqrt(Math.max(0, radius * radius - x * x));
        const n = positions.length / 3;
        positions.push(x, y, z + clearance);
        uvs.push(x, y);
        if (col && n > columns) {
          indices.push(n - columns - 2, n - columns - 1, n, n - columns - 2, n, n - 1);
        }
      }
    }
    const shape = new THREE.BufferGeometry();
    shape.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    shape.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    shape.setIndex(indices);
    shape.computeVertexNormals();
    body.add(new THREE.Mesh(shape, material));
  }

  const legs = [], knees = [], ankles = [], arms = [];
  for (const side of [-1, 1]) {
    const hip = joint(body, side * .103, .97, 0);
    legs.push(hip);
    tailored(hip, trousers, [[-.46,.076],[-.35,.087],[-.11,.104],[.015,.098]], 1.08);
    const knee = joint(hip, 0, -.44, 0);
    knees.push(knee);
    tailored(knee, trousers, [[-.435,.073],[-.29,.075],[-.13,.085],[0,.076]], 1.08);
    const ankle = joint(knee, 0, -.468, 0);
    ankles.push(ankle);
    ellipsoid(ankle, leather, 0, 0, .043, .085, .062, .151);

    const arm = joint(body, side * .185, 1.56, 0);
    arms.push(arm);
    arm.rotation.z = side * .075;
    ellipsoid(arm, suit, 0, -.042, 0, .073, .093, .088);
    tailored(arm, suit, [[-.55,.053],[-.32,.064],[-.21,.068],[-.045,.073]], 1.04);
    tailored(arm, shirt, [[-.569,.049],[-.549,.051]], 1);
    ellipsoid(arm, skin, 0, -.627, .012, .047, .081, .051);
  }
  tailored(body, suit, jacket, jacketDepth);
  tailored(body, skin, [[1.61,.066],[1.68,.057],[1.72,.061],[1.765,.067]], .94);
  tailored(body, shirt, [[1.627,.082],[1.652,.066],[1.667,.060]], .98);
  shirt.side = gold.side = THREE.DoubleSide;
  panel(shirt, [[1.295,0,0],[1.51,-.055,.055],[1.585,-.076,.076],
    [1.615,-.083,.083],[1.648,-.057,.057]], .001);
  panel(gold, [[1.351,0,0],[1.391,-.021,.021],[1.51,-.015,.015],
    [1.578,-.010,.010],[1.585,-.014,.014],[1.615,-.020,.020]], .003);
  const lapel = new THREE.MeshStandardMaterial({ ...cloth, color: 0x435679, side: THREE.DoubleSide });
  for (const side of [-1, 1]) {
    const rows = [[1.274,0,0],[1.51,.052,.125],[1.519,.055,.129],
      [1.536,.059,.102],[1.585,.074,.145],[1.615,.082,.121],[1.643,.071,.075]];
    panel(lapel, rows.map(([y, inner, outer]) => side < 0 ? [y,-outer,-inner] : [y,inner,outer]), .002);
  }
  for (const y of [1.21, 1.09]) ellipsoid(body, leather, .014, y, .140, .013, .013, .009);

  const head = createHead(refresh);
  const traveler = new THREE.Group();
  const pose = new THREE.Group();
  let flightPhase = 0;
  body.scale.set(.90, 1, .93);
  head.mesh.scale.setScalar(1.08);
  pose.add(body, head.mesh);
  traveler.add(pose);
  traveler.scale.setScalar(1.22);
  return {
    body: traveler,
    glide(active) {
      flightPhase = 0;
      pose.rotation.set(0, 0, 0);
      pose.position.y = 0;
      for (const [i, side] of [-1, 1].entries()) {
        arms[i].rotation.set(active ? -.32 : 0, 0, side * (active ? .90 : .075));
        legs[i].rotation.set(active ? side * .07 : 0, 0, 0);
        knees[i].rotation.x = active ? .16 : 0;
        ankles[i].rotation.x = 0;
      }
    },
    jumpToFlightPose(air, bend, dt) {
      const blend = 1 - Math.exp(-24 * dt);
      pose.rotation.x = THREE.MathUtils.lerp(pose.rotation.x, .2 * air, blend);
      pose.rotation.z *= 1 - blend;
      let shortening = Infinity;
      for (let i = 0; i < 2; i++) {
        const side = i ? 1 : -1;
        legs[i].rotation.x = THREE.MathUtils.lerp(legs[i].rotation.x, -bend, blend);
        knees[i].rotation.x = THREE.MathUtils.lerp(knees[i].rotation.x, 2 * bend + .16 * air, blend);
        const shin = legs[i].rotation.x + knees[i].rotation.x;
        ankles[i].rotation.x = -shin * (1 - air);
        arms[i].rotation.x = THREE.MathUtils.lerp(arms[i].rotation.x, -.25 * air - bend, blend);
        arms[i].rotation.z = THREE.MathUtils.lerp(arms[i].rotation.z, side * (.075 + .62 * air + .2 * bend), blend);
        // Lower the hips by the height lost at the knees so the soles stay planted.
        shortening = Math.min(shortening, .44 * (1 - Math.cos(legs[i].rotation.x)) + .468 * (1 - Math.cos(shin)));
      }
      pose.position.y = -shortening * (1 - air);
    },
    animateFlight(dt, sideways, forward, climb, boost, reducedMotion) {
      const reach = Math.min(1, Math.hypot(sideways, forward));
      const blend = reducedMotion ? 1 : 1 - Math.exp(-7 * dt);
      const lean = .2 + .66 * forward + .14 * reach - .19 * climb;
      pose.rotation.x = THREE.MathUtils.lerp(pose.rotation.x, lean, blend);
      pose.rotation.z = THREE.MathUtils.lerp(pose.rotation.z, reducedMotion ? 0 : .24 * sideways, blend);
      flightPhase += dt * (2.2 + reach * (boost ? 2.4 : 1.3));
      const drift = reducedMotion ? 0 : Math.sin(flightPhase);
      pose.position.y = drift * (.035 - .019 * reach);
      for (let i = 0; i < 2; i++) {
        const side = i ? 1 : -1;
        const spread = .68 + .40 * reach - .13 * climb + .055 * drift;
        arms[i].rotation.z = THREE.MathUtils.lerp(arms[i].rotation.z, side * spread, blend);
        arms[i].rotation.x = THREE.MathUtils.lerp(arms[i].rotation.x, -.25 - .23 * climb + .08 * side * drift, blend);
        knees[i].rotation.x = THREE.MathUtils.lerp(knees[i].rotation.x, .16 + .23 * (1 - reach) + .08 * side * drift, blend);
      }
    },
    stride(phase, jump = 0) {
      for (let i = 0; i < 2; i++) {
        const swing = (i ? 1 : -1) * phase;
        legs[i].rotation.x = swing * .34 - jump * (i ? .42 : .22);
        knees[i].rotation.x = Math.max(0, -swing) * .44 + jump * .72;
        arms[i].rotation.x = -swing * .38 - jump * .45;
      }
    },
    dispose() {
      head.dispose();
      twill.dispose();
    },
  };
}
