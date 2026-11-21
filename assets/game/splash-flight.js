(() => {
  'use strict';

  function animateStarflight(canvas) {
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

  const splash = document.querySelector('#site-splash');
  const entryKey = 'timothydo-entered';
  let hasEntered = false;
  try {
    hasEntered = sessionStorage.getItem(entryKey) === 'yes';
  } catch {
    // The splash still works when storage is blocked.
  }

  if (typeof splash.showModal === 'function') {
    let replayButton;
    let stopFlight;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    function openSplash(button) {
      replayButton = button;
      splash.classList.remove('is-opening');
      splash.showModal();
      if (!reducedMotion.matches) {
        stopFlight = animateStarflight(splash.querySelector('.splash-flight canvas'));
      }
    }

    // Replay controls are parsed after this script and the splash dialog.
    document.addEventListener('DOMContentLoaded', () => {
      for (const button of document.querySelectorAll('[data-splash-replay]')) {
        button.hidden = false;
        button.addEventListener('click', () => openSplash(button));
      }
    }, { once: true });
    splash.addEventListener('keydown', (event) => event.stopPropagation());
    if (!hasEntered && !location.hash && new URLSearchParams(location.search).get('view') !== '3d') openSplash();
    const rememberEntry = () => {
      try {
        sessionStorage.setItem(entryKey, 'yes');
      } catch {
        // Private browsing settings can block storage.
      }
    };
    splash.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      if (splash.classList.contains('is-opening')) return;
      rememberEntry();
      splash.classList.add('is-opening');
      stopFlight?.();
      if (!reducedMotion.matches && typeof splash.getAnimations === 'function') {
        const animations = splash.getAnimations({ subtree: true })
          .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime));
        await Promise.allSettled(animations.map((animation) => animation.finished));
      }
      if (splash.open) splash.close();
    });
    splash.addEventListener('cancel', (event) => {
      if (splash.classList.contains('is-opening')) event.preventDefault();
      else rememberEntry();
    });
    splash.addEventListener('close', () => {
      stopFlight?.();
      (replayButton || document.querySelector('.title-menu a'))?.focus({ preventScroll: true });
    });
  }
})();
