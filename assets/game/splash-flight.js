export function animateStarflight(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const scale = Math.min(devicePixelRatio || 1, 1.5);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.scale(scale, scale);

  const centerX = width / 2;
  const centerY = height * .46;
  const reach = Math.hypot(centerX, height - centerY);
  const stars = Array.from({ length: 180 }, () => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
      offset: Math.random(),
      size: .6 + Math.random() * 1.25,
      speed: .7 + Math.random() * .55,
      color: Math.random() > .78 ? '#ffe6b8' : '#c9dcff',
    };
  });

  const started = performance.now();
  let frame;
  function draw(now) {
    const elapsed = now - started;
    const flight = Math.min(elapsed / 1350, 1);
    const distance = flight * flight * 1.55;
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';

    for (const star of stars) {
      const depth = (star.offset + distance * star.speed) % 1;
      const radius = depth * depth * reach;
      const tail = Math.max(0, radius - (.8 + flight * 46) * depth);
      ctx.globalAlpha = Math.min(.9, depth * 2);
      ctx.strokeStyle = star.color;
      ctx.lineWidth = star.size;
      ctx.beginPath();
      ctx.moveTo(centerX + star.x * tail, centerY + star.y * tail);
      ctx.lineTo(centerX + star.x * radius, centerY + star.y * radius);
      ctx.stroke();
    }

    if (elapsed < 1350) frame = requestAnimationFrame(draw);
  }
  frame = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(frame);
}
