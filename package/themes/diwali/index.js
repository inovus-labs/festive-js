const DEF = {
  fireworkImages: [
    // Colorful SVG bursts (data URIs)
    'data:image/svg+xml;utf8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="8" fill="%23FFD700"/><g stroke="%23FFD700" stroke-width="3"><line x1="32" y1="2" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="62"/><line x1="2" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="62" y2="32"/><line x1="12" y1="12" x2="22" y2="22"/><line x1="42" y1="42" x2="52" y2="52"/><line x1="12" y1="52" x2="22" y2="42"/><line x1="42" y1="22" x2="52" y2="12"/></g></svg>',
    'data:image/svg+xml;utf8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="8" fill="%23FF69B4"/><g stroke="%23FF69B4" stroke-width="3"><line x1="32" y1="2" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="62"/><line x1="2" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="62" y2="32"/><line x1="12" y1="12" x2="22" y2="22"/><line x1="42" y1="42" x2="52" y2="52"/><line x1="12" y1="52" x2="22" y2="42"/><line x1="42" y1="22" x2="52" y2="12"/></g></svg>',
    'data:image/svg+xml;utf8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="8" fill="%2300E5FF"/><g stroke="%2300E5FF" stroke-width="3"><line x1="32" y1="2" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="62"/><line x1="2" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="62" y2="32"/><line x1="12" y1="12" x2="22" y2="22"/><line x1="42" y1="42" x2="52" y2="52"/><line x1="12" y1="52" x2="22" y2="42"/><line x1="42" y1="22" x2="52" y2="12"/></g></svg>',
    'data:image/svg+xml;utf8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="8" fill="%23FF5722"/><g stroke="%23FF5722" stroke-width="3"><line x1="32" y1="2" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="62"/><line x1="2" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="62" y2="32"/><line x1="12" y1="12" x2="22" y2="22"/><line x1="42" y1="42" x2="52" y2="52"/><line x1="12" y1="52" x2="22" y2="42"/><line x1="42" y1="22" x2="52" y2="12"/></g></svg>'
  ],
  count: 14,
  minSize: 32,
  maxSize: 64,
  duration: 1.5
};

function injectCSS() {
  if (document.getElementById("diwali-css")) return;
  const css = `
    .diwali-firework {
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      animation: diwali-burst linear forwards;
      will-change: opacity, transform;
      opacity: 1;
      transition: opacity 0.3s;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      transform: translateZ(0);
      contain: layout paint;
    }
    @keyframes diwali-burst {
      0% { opacity: 1; transform: scale(0.6); }
      100% { opacity: 0; transform: scale(1.6); }
    }
  `;
  const style = document.createElement("style");
  style.id = "diwali-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "diwali",
  name: "Diwali Fireworks",
  triggers: [{
    type: "range",
    monthStart: 10,
    dayStart: 20,
    monthEnd: 11,
    dayEnd: 20
  }],
  params: { ...DEF },
  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const timers = new Set();

    const perSet = Math.max(8, Math.round(cfg.count * 0.7));
    const totalCycleTime = cfg.duration * 1000 + 600; // animation + fade buffer

    function createFireworkSet() {
      if (!alive) return;
      for (let i = 0; i < perSet; i++) {
        const delay = i * 80;
        const t = setTimeout(() => {
          createFirework();
          timers.delete(t);
        }, delay);
        timers.add(t);
      }

      // Schedule the next batch only after the current one finishes
      const next = setTimeout(() => {
        createFireworkSet();
        timers.delete(next);
      }, totalCycleTime);
      timers.add(next);
    }

    function createFirework() {
      const firework = document.createElement("img");
      firework.className = "diwali-firework";
      const images = cfg.fireworkImages;
      firework.src = images[Math.floor(Math.random() * images.length)];
      const size = Math.random() * (cfg.maxSize - cfg.minSize) + cfg.minSize;

      firework.style.left = `${Math.random() * 100}vw`;
      firework.style.top = `${Math.random() * 75 + 5}vh`;
      firework.style.width = `${size}px`;
      firework.style.height = `${size}px`;
      firework.style.animationDuration = `${cfg.duration}s`;
      firework.style.opacity = "0.95";
      root.appendChild(firework);

      const removalTimer = setTimeout(() => {
        if (firework.parentNode) firework.remove();
        timers.delete(removalTimer);
      }, cfg.duration * 1000 + 100);
      timers.add(removalTimer);
    }

    createFireworkSet();

    return () => {
      alive = false;
      for (const t of timers) {
        clearTimeout(t);
      }
      root.querySelectorAll('.diwali-firework').forEach(fw => fw.remove());
      timers.clear();
    };
  }
};
