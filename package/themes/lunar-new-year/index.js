
// Lunar New Year Floating Lanterns (🏮 Emoji - Improved Lifespan & Sway)

const DEF = {
  lanternSize: 60,          // Larger emoji for clarity
  lanternInterval: 600,     // Slightly slower spawn rate
  floatDuration: 16000,     // Longer, smoother ascent
  batchSpawn: 2,            // Number of lanterns per spawn
  swayAmplitude: 40,        // How much they sway side to side (px)
  swayDuration: 4000,       // Duration of one full sway cycle
};

export default {
  key: 'lunar-new-year',
  name: 'Lunar New Year (🏮 Floating Lanterns)',
  triggers: [
    {
      type: 'range',
      monthStart: 1, // Jan
      dayStart: 21,
      monthEnd: 2,   // Feb
      dayEnd: 21,
    },
  ],
  params: { ...DEF },
  apply(root, _common, options = {}) {
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const timers = new Set();

    // Inject CSS keyframes once
    const style = document.createElement('style');
    style.textContent = `
      @keyframes lantern-sway {
        0% { transform: translateX(0); }
        25% { transform: translateX(${cfg.swayAmplitude}px); }
        50% { transform: translateX(0); }
        75% { transform: translateX(-${cfg.swayAmplitude}px); }
        100% { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 9999,
    });
    root.appendChild(container);

    function createLantern() {
      if (!alive) return;

      for (let i = 0; i < cfg.batchSpawn; i++) {
        const lantern = document.createElement('span');
        lantern.textContent = '🏮';

        const left = Math.random() * 100;
        const opacity = (Math.random() * 0.4 + 0.6).toFixed(2);
        const startDelay = Math.random() * cfg.swayDuration;

        Object.assign(lantern.style, {
          position: 'absolute',
          left: `${left}%`,
          bottom: '-80px',
          fontSize: `${cfg.lanternSize}px`,
          opacity,
          filter: `
            drop-shadow(0 0 10px rgba(255, 100, 0, 1))
            drop-shadow(0 0 25px rgba(255, 170, 0, 0.8))
          `,
          // IMPORTANT FIX: Changed opacity transition to 'linear'
          transition: `
            transform ${cfg.floatDuration}ms linear,
            opacity ${cfg.floatDuration}ms linear
          `,
          animation: `lantern-sway ${cfg.swayDuration}ms ease-in-out infinite`,
          animationDelay: `${startDelay}ms`,
        });

        container.appendChild(lantern);

        // Trigger the floating motion
        requestAnimationFrame(() => {
          lantern.style.transform = 'translateY(-130vh)';
          lantern.style.opacity = '0';
        });

        // IMPORTANT FIX: Use 'transitionend' for robust cleanup
        const removeOnEnd = () => {
          lantern.removeEventListener('transitionend', removeOnEnd);
          if (lantern.parentNode) lantern.remove();
        };
        lantern.addEventListener('transitionend', removeOnEnd);
      }
    }

    const lanternTimer = setInterval(createLantern, cfg.lanternInterval);
    timers.add(lanternTimer);

    return () => {
      alive = false;
      timers.forEach(clearInterval);
      timers.clear();
      if (container.parentNode) container.remove();
      if (style.parentNode) style.remove();
    };
  },
};
