function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const DEF = {
  petalSvgs: [
    // soft pink petal shapes as data URIs
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23FFC0CB"><path d="M32 6c6 0 12 6 12 12s-6 12-12 20S16 34 16 28 26 6 32 6z"/></g></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23FFB6C1"><path d="M20 20c4-6 12-8 18-6s10 8 8 14c-6 2-10 6-18 6S16 24 20 20z"/></g></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23F8BBD0"><circle cx="32" cy="30" r="4"/><path d="M32 8c5 4 12 4 14 12s-8 12-14 20S18 28 18 22 27 12 32 8z"/></g></svg>'
  ],
  count: 70,
  minSize: 12,
  maxSize: 44,
  minDuration: 6,
  maxDuration: 14,
  driftRange: 20,
  minOpacity: 0.65,
  maxOpacity: 1.0,
  swayIntensity: 14
};

function injectCSS() {
  if (document.getElementById('sakura-css')) return;
  const css = `
    .sakura-petal {
      position: fixed;
      top: -12vh;
      pointer-events: none;
      z-index: 99999;
      will-change: transform, opacity;
      animation-name: sakura-fall;
      animation-timing-function: linear;
      user-select: none;
    }

    @keyframes sakura-fall {
      0% { transform: translateY(-12vh) rotate(0deg); opacity: 0; }
      8% { opacity: 1; }
      100% { transform: translateY(110vh) rotate(360deg); opacity: 0.85; }
    }

    @keyframes sakura-sway {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(6px) rotate(14deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
  `;
  const style = document.createElement('style');
  style.id = 'sakura-css';
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: 'sakura',
  name: 'Sakura Blossom',
  triggers: [{ type: 'range', monthStart: 3, dayStart: 1, monthEnd: 4, dayEnd: 30 }],
  params: { ...DEF },

  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;

    const timeouts = new Set();
    const intervals = new Set();

    const isMobile = window.innerWidth <= 768;
    const petalCount = isMobile ? Math.max(10, Math.floor(cfg.count * 0.35)) : cfg.count;

    function createPetal() {
      if (!alive) return;
      const img = document.createElement('img');
      img.className = 'sakura-petal';
      const svgs = cfg.petalSvgs || DEF.petalSvgs;
      img.src = svgs[Math.floor(Math.random() * svgs.length)];

      const size = Math.floor(rand(cfg.minSize, cfg.maxSize));
      img.style.width = `${size}px`;
      img.style.height = 'auto';

      const left = Math.random() * 100;
      img.style.left = `${left}vw`;
      const drift = rand(-cfg.driftRange, cfg.driftRange);
      const duration = rand(cfg.minDuration, cfg.maxDuration);
      const opacity = rand(cfg.minOpacity, cfg.maxOpacity);
      const delay = rand(0, 4);

      img.style.opacity = opacity;
      img.style.animationDuration = `${duration}s`;
      img.style.animationDelay = `${delay}s`;

      root.appendChild(img);

      // gentle horizontal sway + slow rotation using requestAnimationFrame
      // compute per-petal random multipliers once (avoid recalculating each frame)
      const start = performance.now() + delay * 1000;
      const end = start + duration * 1000;
      const swayFreq = rand(0.6, 1.4);
      const rotMultiplier = rand(0.6, 1.2);

      function frame(now) {
        if (!alive) return;
        if (now < start) {
          requestAnimationFrame(frame);
          return;
        }
        const t = Math.min(1, (now - start) / (end - start));
        // horizontal sway uses a sin curve for gentle side-to-side motion
        const sway = Math.sin(t * Math.PI * 2 * swayFreq) * (cfg.swayIntensity * (1 - t * 0.2));
        const x = drift * t + sway;
        const rot = 360 * t * rotMultiplier;
        img.style.transform = `translateX(${x}vw) rotate(${rot}deg)`;
        if (now < end) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      const removeTimer = setTimeout(() => {
        if (img.parentNode) img.remove();
        timeouts.delete(removeTimer);
      }, (duration + delay) * 1000 + 200);
      timeouts.add(removeTimer);
    }

    // initial burst
    for (let i = 0; i < Math.min(30, Math.floor(petalCount / 2)); i++) {
      const t = setTimeout(createPetal, Math.random() * 2500);
      timeouts.add(t);
    }

    // continuous spawning
    const intervalMs = Math.max(120, 4200 / Math.max(1, petalCount));
    const spawn = setInterval(() => {
      if (!alive) return;
      const live = root.querySelectorAll('.sakura-petal').length;
      if (live < petalCount) createPetal();
    }, intervalMs);
    intervals.add(spawn);

    // cleanup
    return () => {
      alive = false;
      for (const t of timeouts) clearTimeout(t);
      for (const i of intervals) clearInterval(i);
      timeouts.clear();
      intervals.clear();
      root.querySelectorAll('.sakura-petal').forEach(n => n.remove());
    };
  }
};
