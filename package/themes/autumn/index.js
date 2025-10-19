function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const DEF = {
  leafSvgs: [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23FF8C00"><path d="M32 4c6 0 18 6 18 18s-12 18-18 30S14 26 14 20 26 4 32 4z"/></g></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23D2691E"><path d="M8 24c8-4 12-12 24-12s16 8 24 12c-8 4-12 12-24 12S16 28 8 24z"/></g></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23A52A2A"><circle cx="32" cy="32" r="6"/><path d="M32 6c5 6 15 6 15 16s-10 16-15 26S17 26 17 22 27 10 32 6z"/></g></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g fill="%23FFD700"><circle cx="32" cy="32" r="5"/><path d="M4 30c10-6 14-14 28-14s18 8 28 14c-10 6-14 14-28 14S14 36 4 30z"/></g></svg>'
  ],
  count: 60,
  minSize: 14,
  maxSize: 48,
  minDuration: 6,
  maxDuration: 14,
  driftRange: 18,
  minOpacity: 0.6,
  maxOpacity: 1.0
};

function injectCSS() {
  if (document.getElementById('autumn-css')) return;
  const css = `
    .autumn-leaf {
      position: fixed;
      top: -10vh;
      pointer-events: none;
      z-index: 99999;
      will-change: transform, opacity;
      animation-name: autumn-fall;
      animation-timing-function: linear;
    }

    @keyframes autumn-fall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateY(110vh) rotate(360deg); opacity: 0.85; }
    }

    @keyframes autumn-wiggle {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(6px) rotate(12deg); }
      100% { transform: translateY(0) rotate(0deg); }
    }
  `;
  const style = document.createElement('style');
  style.id = 'autumn-css';
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: 'autumn',
  name: 'Autumn Leaves',
  // Removed triggers → Manual activation only
  // triggers: [{ type: 'range', monthStart: 9, dayStart: 1, monthEnd: 11, dayEnd: 30 }],
  params: { ...DEF },

  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;

    const timeouts = new Set();
    const intervals = new Set();

    const isMobile = window.innerWidth <= 768;
    const leafCount = isMobile ? Math.max(8, Math.floor(cfg.count * 0.35)) : cfg.count;

    function createLeaf() {
      if (!alive) return;
      const img = document.createElement('img');
      img.className = 'autumn-leaf';
      const svgs = cfg.leafSvgs || DEF.leafSvgs;
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

      // Animate drift & rotation with requestAnimationFrame
      const start = performance.now() + delay * 1000;
      const end = start + duration * 1000;

      function frame(now) {
        if (!alive) return;
        if (now < start) {
          requestAnimationFrame(frame);
          return;
        }
        const t = Math.min(1, (now - start) / (end - start));
        const x = drift * t;
        const rot = 360 * t;
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

    // Initial leaf burst
    for (let i = 0; i < Math.min(30, Math.floor(leafCount / 2)); i++) {
      const t = setTimeout(createLeaf, Math.random() * 2500);
      timeouts.add(t);
    }

    // Continuous spawning
    const intervalMs = Math.max(120, 4000 / Math.max(1, leafCount));
    const spawn = setInterval(() => {
      if (!alive) return;
      const live = root.querySelectorAll('.autumn-leaf').length;
      if (live < leafCount) createLeaf();
    }, intervalMs);
    intervals.add(spawn);

    // Cleanup logic
    return () => {
      alive = false;
      for (const t of timeouts) clearTimeout(t);
      for (const i of intervals) clearInterval(i);
      timeouts.clear();
      intervals.clear();
      root.querySelectorAll('.autumn-leaf').forEach(n => n.remove());
    };
  }
};
