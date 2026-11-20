import * as THREE from '../vendor/three/three.module.js';

const width = 780;
const height = 650;
const buttonY = 538;
const buttonHeight = 82;
const slots = [[52, 205], [278, 224], [523, 205]];

function paragraph(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? line + ' ' + word : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else {
      line = next;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

export function createPlaque(textScale, refresh) {
  const canvas = document.createElement('canvas');
  canvas.width = width * textScale;
  canvas.height = height * textScale;
  const ctx = canvas.getContext('2d');
  ctx.scale(textScale, textScale);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const object = new THREE.Group();
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(7.8, 6.5),
    new THREE.MeshBasicMaterial({ map: texture, fog: false }),
  );
  face.position.z = .19;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(8, 6.7, .35),
    new THREE.MeshStandardMaterial({ color: 0xb78d49, roughness: .62 }),
  );
  object.add(frame, face);
  object.position.set(0, 3.82, -1);
  object.visible = false;
  let actions = [];
  let revision = 0;

  return {
    object,
    face,
    paint(exhibit) {
      const current = ++revision;
      object.visible = Boolean(exhibit);
      actions = exhibit?.actions ?? [];
      if (!exhibit) return;
      const glass = ctx.createLinearGradient(0, 0, width * .6, height);
      glass.addColorStop(0, '#29375b');
      glass.addColorStop(.5, '#192342');
      glass.addColorStop(1, '#0c1129');
      ctx.fillStyle = glass;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#aa8e5e';
      ctx.lineWidth = 2;
      ctx.strokeRect(17, 17, width - 34, height - 34);
      ctx.fillStyle = '#11182f';
      ctx.fillRect(18, 18, width - 36, 86);
      ctx.fillStyle = '#fff0cd';
      ctx.font = '35px Georgia';
      ctx.fillText(exhibit.section, 52, 73);
      ctx.textAlign = 'right';
      ctx.font = '28px system-ui';
      ctx.fillText(exhibit.counter, width - 52, 72);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#bea06c';
      ctx.fillRect(35, 104, width - 70, 2);
      for (const x of [36, width - 36]) {
        ctx.save();
        ctx.translate(x, 105);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-5, -5, 10, 10);
        ctx.restore();
      }
      ctx.fillStyle = '#ffe2a3';
      ctx.font = 'bold 42px Georgia';
      const bodyY = paragraph(ctx, exhibit.title, 269, 177, width - 320, 46);
      const image = exhibit.image;
      // The browser image is shared with the accessible text view.
      image.decode().then(() => {
        if (current !== revision) return;
        const scale = Math.min(198 / image.naturalWidth, 117 / image.naturalHeight);
        const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
        ctx.fillStyle = '#10162a';
        ctx.fillRect(51, 119, 200, 119);
        ctx.drawImage(image, 52 + (198 - w) / 2, 120 + (117 - h) / 2, w, h);
        ctx.strokeStyle = '#aa8e5e';
        ctx.strokeRect(51, 119, 200, 119);
        texture.needsUpdate = true;
        refresh();
      }).catch(() => {});
      ctx.font = '30px system-ui';
      ctx.fillStyle = '#eff2ff';
      paragraph(ctx, exhibit.description, 52, Math.max(278, bodyY + 12), width - 104, 38);
      actions.forEach((action, index) => {
        if (!action) return;
        const [x, w] = slots[index];
        ctx.fillStyle = index === 1 ? '#e6b655' : '#2a365c';
        ctx.beginPath();
        ctx.moveTo(x, buttonY + buttonHeight / 2);
        ctx.lineTo(x + 12, buttonY);
        ctx.lineTo(x + w - 12, buttonY);
        ctx.lineTo(x + w, buttonY + buttonHeight / 2);
        ctx.lineTo(x + w - 12, buttonY + buttonHeight);
        ctx.lineTo(x + 12, buttonY + buttonHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = index === 1 ? '#241a03' : '#fff2d8';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(action.label, x + w / 2, buttonY + 50, w - 20);
        ctx.textAlign = 'left';
      });
      texture.needsUpdate = true;
    },
    actionAt(uv) {
      const x = uv.x * width;
      const y = (1 - uv.y) * height;
      if (y < buttonY || y > buttonY + buttonHeight) return null;
      return actions[slots.findIndex(([left, w]) => x >= left && x <= left + w)];
    },
    dispose() { revision++; texture.dispose(); },
  };
}
