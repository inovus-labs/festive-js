function rand(min, max) { 
  return Math.random() * (max - min) + min; 
}

const DEF = {
  snowflakeChar: "❄",
  color: "white",
  minSize: 6,
  maxSize: 14,
  density: 100,
  minDuration: 10,
  maxDuration: 15,
  driftRange: 20,
  minOpacity: 0.4,
  maxOpacity: 1.0
};

function injectCSS() {
  if (document.getElementById("snowfall-css")) return;
  
  const css = `
    .snowfall-flake {
      position: fixed;
      top: -10px;
      line-height: 1;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
      pointer-events: none;
      animation: snowfall-fall linear infinite;
    }

    @keyframes snowfall-fall {
      0% {
        transform: translateY(-10vh) translateX(0);
      }
      25% {
        transform: translateY(25vh) translateX(calc(var(--drift) * 0.5));
      }
      50% {
        transform: translateY(50vh) translateX(calc(var(--drift) * -0.5));
      }
      75% {
        transform: translateY(75vh) translateX(calc(var(--drift) * 0.5));
      }
      100% {
        transform: translateY(100vh) translateX(calc(var(--drift) * -0.5));
      }
    }
  `;
  
  const style = document.createElement("style");
  style.id = "snowfall-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "snowfall",
  name: "Snowfall",
  triggers: [{
    type: "range",
    monthStart: 12,
    dayStart: 1,
    monthEnd: 2,
    dayEnd: 28
  }],
  params: { ...DEF },
  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const timers = new Set();
    
    // Adjust density based on screen size
    const isMobile = window.innerWidth <= 768;
    const snowflakeCount = isMobile ? Math.floor(cfg.density * 0.5) : cfg.density;

    function createSnowflake() {
      if (!alive) return;
      
      const snowflake = document.createElement('div');
      snowflake.className = 'snowfall-flake';
      snowflake.textContent = cfg.snowflakeChar;

      // Size adjustment for mobile
      const sizeMultiplier = isMobile ? 0.8 : 1;
      const size = rand(cfg.minSize, cfg.maxSize) * sizeMultiplier;
      const drift = rand(-cfg.driftRange, cfg.driftRange);
      const duration = rand(cfg.minDuration, cfg.maxDuration);
      const opacity = rand(cfg.minOpacity, cfg.maxOpacity);
      const delay = rand(0, 5);

      // Apply styles
      snowflake.style.cssText = `
        left: ${Math.random() * 100}%;
        opacity: ${opacity};
        color: ${cfg.color};
        font-size: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --drift: ${drift}vw;
      `;

      root.appendChild(snowflake);

      // Remove snowflake after animation ends
      const removeTimer = setTimeout(() => {
        if (snowflake.parentNode) {
          snowflake.remove();
        }
        timers.delete(removeTimer);
      }, (duration + delay) * 1000 + 100);
      
      timers.add(removeTimer);
    }

    // Initial batch of snowflakes with staggered timing
    for (let i = 0; i < Math.min(50, Math.floor(snowflakeCount / 2)); i++) {
      const initialTimer = setTimeout(createSnowflake, Math.random() * 3000);
      timers.add(initialTimer);
    }

    // Continuously generate snowflakes
    const intervalMs = Math.max(100, 3000 / Math.max(1, snowflakeCount));
    const spawnInterval = setInterval(() => {
      if (alive && root.childElementCount < snowflakeCount) {
        createSnowflake();
      }
    }, intervalMs);
    
    timers.add(spawnInterval);

    // Cleanup function
    return () => {
      alive = false;
      for (const timer of timers) {
        clearTimeout(timer);
        clearInterval(timer);
      }
      timers.clear();
      root.querySelectorAll('.snowfall-flake').forEach(flake => flake.remove());
    };
  }
};