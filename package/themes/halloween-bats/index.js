/**
 * 🎃 Halloween Bats Theme
 * A spooky festive overlay for Halloween.
 * 
 * Adds gently flying bats 🦇 across the screen
 * without affecting page performance or layout.
 */

const DEF = {
  batCount: 15,
  batSize: [15, 30], // min, max
  animationDuration: [8, 15], // min, max seconds
};

export default {
  key: 'halloween-bats',
  name: 'Halloween Bats',
  triggers: [
    {
      type: 'range',
      monthStart: 10,
      dayStart: 1,
      monthEnd: 10,
      dayEnd: 31,
    },
  ],
  params: { ...DEF },
  apply(root, _common, options = {}) {
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;

    const styleId = 'halloween-bats-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes fly-across {
          0% {
            transform: translateX(-10vw) translateY(2vh) rotate(5deg) scale(1);
          }
          25% {
            transform: translateX(25vw) translateY(-8vh) rotate(-10deg) scale(1.1);
          }
          50% {
            transform: translateX(55vw) translateY(5vh) rotate(0deg) scale(1);
          }
          75% {
            transform: translateX(80vw) translateY(-5vh) rotate(10deg) scale(1.1);
          }
          100% {
            transform: translateX(110vw) translateY(0vh) rotate(-5deg) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }

    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1,
    });
    root.appendChild(container);

    const bats = [];
    for (let i = 0; i < cfg.batCount; i++) {
      if (!alive) return;
      const bat = document.createElement('div');
      bat.textContent = '🦇';
      
      const size = Math.random() * (cfg.batSize[1] - cfg.batSize[0]) + cfg.batSize[0];
      const duration = Math.random() * (cfg.animationDuration[1] - cfg.animationDuration[0]) + cfg.animationDuration[0];
      const delay = Math.random() * duration;

      Object.assign(bat.style, {
        position: 'absolute',
        top: `${Math.random() * 90}vh`,
        fontSize: `${size}px`,
        opacity: String(Math.random() * 0.5 + 0.3),
        willChange: 'transform',
        animationName: 'fly-across',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDuration: `${duration}s`,
        animationDelay: `-${delay}s`,
      });
      
      bats.push(bat);
      container.appendChild(bat);
    }

    return () => {
      alive = false;
      if (container.parentNode) container.remove();
      const style = document.getElementById(styleId);
      if (style && style.parentNode) style.remove();
    };
  },
};
