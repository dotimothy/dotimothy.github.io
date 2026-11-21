import * as THREE from '../vendor/three/three.module.js';

export const floor = -.39;
export const plazaRadius = 39;
export const plazaCenterZ = -5;
export function constrainToPlaza(position) {
  const radius = Math.hypot(position.x, position.z - plazaCenterZ);
  if (radius > plazaRadius) {
    position.x *= plazaRadius / radius;
    position.z = plazaCenterZ + (position.z - plazaCenterZ) * plazaRadius / radius;
  }
}

export function createController(pawn) {
  const velocity = new THREE.Vector2();
  const desired = new THREE.Vector2();
  const look = new THREE.Vector3();
  const obstruction = new THREE.Raycaster();
  const intersections = [];
  let yaw = 0, pitch = 0, lift = 0, verticalSpeed = 0, stride = 0;

  function movement(sideways, forward) {
    return desired.set(sideways * Math.cos(yaw) - forward * Math.sin(yaw),
      -sideways * Math.sin(yaw) - forward * Math.cos(yaw)).clampLength(0, 1);
  }

  return {
    get moving() { return velocity.lengthSq() > .0001 || lift > 0 || verticalSpeed > 0; },
    reset(cameraYaw = yaw, cameraPitch = 0) {
      yaw = cameraYaw;
      pitch = cameraPitch;
      lift = verticalSpeed = stride = 0;
      velocity.set(0, 0);
    },
    orbit(dx, dy) {
      yaw -= dx * .005;
      pitch = THREE.MathUtils.clamp(pitch + dy * .004, -.43, .95);
    },
    recenter() { yaw = pitch = 0; },
    jump() {
      if (lift === 0 && verticalSpeed === 0) verticalSpeed = 6.4;
    },
    fly(dt, sideways, forward, climb, fast) {
      const direction = movement(sideways, forward);
      const speed = fast ? 17 : 8;
      pawn.position.x += direction.x * speed * dt;
      pawn.position.z += direction.y * speed * dt;
      pawn.position.y = THREE.MathUtils.clamp(pawn.position.y + climb * dt * 6, .5, 75);
      pawn.rotation.set(0, yaw + Math.PI, 0, 'YXZ');
    },
    walk(dt, sideways, forward, sprint, traveler, reducedMotion, portals, sneak) {
      movement(sideways, forward).multiplyScalar(sneak ? 1.5 : sprint ? 7.4 : 3.7);
      velocity.lerp(desired, 1 - Math.exp(-(desired.lengthSq() ? 10 : 15) * dt));
      if (!desired.lengthSq() && velocity.lengthSq() < .0001) velocity.set(0, 0);
      const speed = velocity.length();
      pawn.position.x += velocity.x * dt;
      pawn.position.z += velocity.y * dt;
      if (speed > 0) for (const { stand } of portals) {
        const x = pawn.position.x - stand.position.x, z = pawn.position.z - stand.position.z;
        const separation = Math.hypot(x, z);
        if (separation > 0 && separation < 1.55) {
          pawn.position.x = stand.position.x + 1.55 * x / separation;
          pawn.position.z = stand.position.z + 1.55 * z / separation;
        }
      }
      constrainToPlaza(pawn.position);
      if (speed > .05) {
        const target = Math.atan2(velocity.x, velocity.y);
        const angle = target - pawn.rotation.y;
        pawn.rotation.y += Math.atan2(Math.sin(angle), Math.cos(angle)) * (1 - Math.exp(-15 * dt));
      }
      if (dt > 0 && (lift > 0 || verticalSpeed > 0)) {
        lift = Math.max(0, lift + verticalSpeed * dt - 9 * dt * dt);
        verticalSpeed = lift ? verticalSpeed - 18 * dt : 0;
      }
      pawn.position.y = floor + lift;
      stride += speed * dt * 3.6;
      traveler.stride(reducedMotion ? 0 : Math.sin(stride) * Math.min(1.55, speed / 3.7),
        Math.min(1, lift * 2));
    },
    frame(camera, airborne, obstacles) {
      const angle = yaw;
      const elevation = THREE.MathUtils.clamp((airborne ? .18 : .29) + pitch, -.30, 1.25);
      const distance = airborne ? 6.9 : 5.8;
      const x = Math.sin(angle), z = Math.cos(angle);
      const baseY = airborne ? pawn.position.y + 1.65 : floor + 1.45 + lift * .45;
      camera.position.set(pawn.position.x + x * Math.cos(elevation) * distance,
        Math.max(floor + .45, baseY + Math.sin(elevation) * distance),
        pawn.position.z + z * Math.cos(elevation) * distance);
      const lead = airborne ? 4.5 : .55;
      look.set(pawn.position.x - x * lead, baseY, pawn.position.z - z * lead);
      if (obstacles) {
        obstruction.ray.origin.copy(look);
        obstruction.ray.direction.copy(camera.position).sub(look);
        obstruction.far = obstruction.ray.direction.length();
        obstruction.ray.direction.normalize();
        intersections.length = 0;
        obstruction.intersectObjects(obstacles, false, intersections);
        if (intersections.length) {
          obstruction.ray.at(Math.max(.35, intersections[0].distance - .18), camera.position);
        }
      }
      camera.lookAt(look);
    },
  };
}

// Values inside the radial dead zone leave both axes at rest.
export function readStick(pad, firstAxis, target) {
  target.set(pad?.axes[firstAxis] || 0, pad?.axes[firstAxis + 1] || 0);
  const length = target.length();
  return length <= .16 ? target.set(0, 0)
    : target.multiplyScalar(Math.min(1, (length - .16) / .84) / length);
}
