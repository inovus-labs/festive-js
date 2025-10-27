function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const DEF = {
  heartChar: ["❤️", "💖", "💕", "💓", "💝"],
  minSize: 12,
  maxSize: 24,
  density: 50,
  minDuration: 5,
  maxDuration: 10,
  driftRange: 20,
  minOpacity: 0.5,
  maxOpacity: 1.0,
};

function injectCSS() {
  if (document.getElementById("valentine-css")) return;

  const css = `
    .valentine-heart {
      position: fixed;
      line-height: 1;
      pointer-events: none;
      animation: valentine-float linear infinite;
    }

    @keyframes valentine-float {
      0% {
        transform: translateY(0) rotate(0deg);
      }
      100% {
        transform: translateY(-105vh) rotate(360deg);
      }
    }
  `;

  const style = document.createElement("style");
  style.id = "valentine-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "valentine",
  name: "Valentine's Day",
  triggers: [
    {
      type: "range",
      monthStart: 2,
      dayStart: 1,
      monthEnd: 2,
      dayEnd: 28,
    },
  ],
  params: { ...DEF },
  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const timers = new Set();

    const isMobile = window.innerWidth <= 768;
    const heartCount = isMobile ? Math.floor(cfg.density * 0.5) : cfg.density;

    function createHeart() {
      if (!alive) return;

      const heart = document.createElement("div");
      heart.className = "valentine-heart";
      heart.textContent = cfg.heartChar[Math.floor(Math.random() * cfg.heartChar.length)];

      const sizeMultiplier = isMobile ? 0.8 : 1;
      const size = rand(cfg.minSize, cfg.maxSize) * sizeMultiplier;
      const duration = rand(cfg.minDuration, cfg.maxDuration);
      const delay = rand(0, 5);
      const opacity = rand(cfg.minOpacity, cfg.maxOpacity);

      heart.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: -20px;
        font-size: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${opacity};
      `;

      root.appendChild(heart);

      const removeTimer = setTimeout(
        () => {
          if (heart.parentNode) {
            heart.remove();
          }
          timers.delete(removeTimer);
        },
        (duration + delay) * 1000 + 100
      );

      timers.add(removeTimer);
    }

    for (let i = 0; i < Math.min(20, Math.floor(heartCount / 2)); i++) {
      const initialTimer = setTimeout(createHeart, Math.random() * 3000);
      timers.add(initialTimer);
    }

    const intervalMs = Math.max(100, 3000 / Math.max(1, heartCount));
    const spawnInterval = setInterval(() => {
      if (alive && root.childElementCount < heartCount) {
        createHeart();
      }
    }, intervalMs);

    timers.add(spawnInterval);

    return () => {
      alive = false;
      for (const timer of timers) {
        clearTimeout(timer);
        clearInterval(timer);
      }
      timers.clear();
      root.querySelectorAll(".valentine-heart").forEach((el) => el.remove());
    };
  },
};