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
      animation: diwali-burst linear;
      will-change: opacity, transform;
      opacity: 1;
      transition: opacity 0.3s;
    }
    @keyframes diwali-burst {
      from { opacity: 1; transform: scale(0.5); }
      to { opacity: 0; transform: scale(1.5); }
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

    function createFirework() {
      if (!alive) return;
      const firework = document.createElement("img");
      firework.className = "diwali-firework";
      // Pick a random SVG burst
      const images = cfg.fireworkImages || DEF.fireworkImages;
      firework.src = images[Math.floor(Math.random() * images.length)];
      const size = Math.random() * (cfg.maxSize - cfg.minSize) + cfg.minSize;
      firework.style.left = `${Math.random() * 100}vw`;
      firework.style.top = `${Math.random() * 80}vh`;
      firework.style.width = `${size}px`;
      firework.style.height = `${size}px`;
      firework.style.animationDuration = `${cfg.duration}s`;
      firework.style.opacity = "0.95";
      root.appendChild(firework);

      const removeTimer = setTimeout(() => {
        firework.remove();
        timers.delete(removeTimer);
      }, cfg.duration * 1000);
      timers.add(removeTimer);
    }

    const interval = setInterval(() => {
      for (let i = 0; i < cfg.count; i++) createFirework();
    }, 1200);

    timers.add(interval);

    return () => {
      alive = false;
      for (const t of timers) clearTimeout(t), clearInterval(t);
      root.querySelectorAll('.diwali-firework').forEach(fw => fw.remove());
      timers.clear();
    };
  }
};