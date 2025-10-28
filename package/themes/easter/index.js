function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const DEF = {
  eggChar: "🥚",
  bunnyChar: "🐇",
  colors: ["#FFB6C1", "#FFD700", "#98FB98", "#87CEFA", "#FFA07A"],
  minSize: 10,
  maxSize: 20,
  density: 80,
  minDuration: 8,
  maxDuration: 15,
  minOpacity: 0.5,
  maxOpacity: 1.0,
  bunnyProbability: 0.2,
};

function injectCSS() {
  if (document.getElementById("easter-css")) return;

  const css = `
    .easter-element {
      position: fixed;
      bottom: -20px;
      line-height: 1;
      pointer-events: none;
    }

    .easter-egg {
      animation: easter-fall linear infinite;
    }

    .easter-bunny {
      animation: easter-hop linear infinite;
    }

    @keyframes easter-fall {
      from {
        transform: translateY(0) rotate(0deg);
      }
      to {
        transform: translateY(-105vh) rotate(360deg);
      }
    }

    @keyframes easter-hop {
      0% {
        transform: translateY(0) scale(1);
      }
      25% {
        transform: translateY(-50px) scale(1.1);
      }
      50% {
        transform: translateY(0) scale(1);
      }
      75% {
        transform: translateY(-25px) scale(1.05);
      }
      100% {
        transform: translateY(0) scale(1);
      }
    }
  `;

  const style = document.createElement("style");
  style.id = "easter-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "easter",
  name: "Easter",
  triggers: [
    {
      type: "range",
      monthStart: 3,
      dayStart: 1,
      monthEnd: 4,
      dayEnd: 30,
    },
  ],
  params: { ...DEF },
  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const timeouts = new Set();
    const intervals = new Set();

    const isMobile = window.innerWidth <= 768;
    const elementCount = isMobile
      ? Math.floor(cfg.density * 0.5)
      : cfg.density;

    function createEasterElement() {
      if (!alive) return;

      const isBunny = Math.random() < cfg.bunnyProbability;
      const element = document.createElement("div");
      element.className = "easter-element";

      if (isBunny) {
        element.classList.add("easter-bunny");
        element.textContent = cfg.bunnyChar;
      } else {
        element.classList.add("easter-egg");
        element.textContent = cfg.eggChar;
        element.style.color =
          cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
      }

      const sizeMultiplier = isMobile ? 0.8 : 1;
      const size = rand(cfg.minSize, cfg.maxSize) * sizeMultiplier;
      const duration = rand(cfg.minDuration, cfg.maxDuration);
      const delay = rand(0, 5);

      element.style.cssText += `
        left: ${Math.random() * 100}%;
        font-size: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      root.appendChild(element);

      const removeTimer = setTimeout(
        () => {
          if (element.parentNode) {
            element.remove();
          }
          timeouts.delete(removeTimer);
        },
        (duration + delay) * 1000 + 100
      );

      timeouts.add(removeTimer);
    }

    for (let i = 0; i < Math.min(20, Math.floor(elementCount / 2)); i++) {
      const initialTimer = setTimeout(
        createEasterElement,
        Math.random() * 3000
      );
      timeouts.add(initialTimer);
    }

    const intervalMs = Math.max(100, 3000 / Math.max(1, elementCount));
    const spawnInterval = setInterval(() => {
      if (alive && root.childElementCount < elementCount) {
        createEasterElement();
      }
    }, intervalMs);

    intervals.add(spawnInterval);

    return () => {
      alive = false;
      for (const timer of timeouts) {
        clearTimeout(timer);
      }
      for (const timer of intervals) {
        clearInterval(timer);
      }
      timeouts.clear();
      intervals.clear();
      root
        .querySelectorAll(".easter-element")
        .forEach((el) => el.remove());
    };
  },
};