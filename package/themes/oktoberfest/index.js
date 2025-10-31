
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const DEF = {
  emojis: ['🥨', '🍺', '🍻'],
  count: 30,
  minSize: 20,
  maxSize: 50,
  minDuration: 6,
  maxDuration: 15,
  driftRange: 20,
  minOpacity: 0.7,
  maxOpacity: 1.0,
  bounceIntensity: 10
};

function injectCSS() {
  if (document.getElementById('oktoberfest-css')) return;
  const css = `
    .oktoberfest-emoji {
      position: fixed;
      top: -10vh;
      pointer-events: none;
      z-index: 99999;
      will-change: transform, opacity;
      font-size: 1em;
      animation-name: oktoberfest-float;
      animation-timing-function: linear;
      user-select: none;
    }

    @keyframes oktoberfest-float {
      0% { 
        transform: translateY(-10vh) scale(0.5);
        opacity: 0;
      }
      10% { 
        opacity: 1;
        transform: translateY(0vh) scale(1);
      }
      100% { 
        transform: translateY(110vh) scale(0.8);
        opacity: 0;
      }
    }
  `;
  const style = document.createElement('style');
  style.id = 'oktoberfest-css';
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * @type {import('../../../index').Theme}
 */
export default {
  name: 'Oktoberfest',
  meta: {
    name: 'Oktoberfest',
    author: 'Festive.js',
    author_url: 'https://festive.js.org',
    description: 'A theme for Oktoberfest with pretzels and beer mugs.',
    preview_url: 'https://festive.js.org/themes/oktoberfest.gif'
  },
  // Auto-trigger on last 2 weeks of September and first week of October
  // Oktoberfest is typically the 16 days up to and including the first Sunday in October.
  // This is a simplified rule.
  activation: [
    (now) => now.getMonth() === 8 && now.getDate() >= 15, // September 15-30
    (now) => now.getMonth() === 9 && now.getDate() <= 7   // October 1-7
  ],
  params: { ...DEF },
  init: (root, common, options) => {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;

    const timeouts = new Set();
    const intervals = new Set();

    const isMobile = window.innerWidth <= 768;
    const emojiCount = isMobile ? Math.max(10, Math.floor(cfg.count * 0.4)) : cfg.count;

    function createEmoji() {
      if (!alive) return;
      
      const span = document.createElement('span');
      span.className = 'oktoberfest-emoji';
      
      const emojis = cfg.emojis || DEF.emojis;
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const size = Math.floor(rand(cfg.minSize, cfg.maxSize));
      span.style.fontSize = `${size}px`;

      const left = Math.random() * 100;
      span.style.left = `${left}vw`;
      
      const drift = rand(-cfg.driftRange, cfg.driftRange);
      const duration = rand(cfg.minDuration, cfg.maxDuration);
      const opacity = rand(cfg.minOpacity, cfg.maxOpacity);
      const delay = rand(0, 4);

      span.style.opacity = opacity;
      span.style.animationDuration = `${duration}s`;
      span.style.animationDelay = `${delay}s`;

      root.appendChild(span);

      const start = performance.now() + delay * 1000;
      const end = start + duration * 1000;
      const bounceSpeed = rand(1.5, 2.5);

      function frame(now) {
        if (!alive) return;
        if (now < start) {
          requestAnimationFrame(frame);
          return;
        }
        
        const t = Math.min(1, (now - start) / (end - start));
        const elapsed = (now - start) / 1000;
        
        const x = drift * t;
        const bounce = Math.sin(elapsed * bounceSpeed * Math.PI) * cfg.bounceIntensity * (1 - t * 0.3);
        
        span.style.transform = `translateX(${x}vw) translateY(${bounce}px) rotate(0deg)`;
        
        if (now < end) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      const removeTimer = setTimeout(() => {
        span.remove();
        timeouts.delete(removeTimer);
      }, (duration + delay) * 1000 + 200);
      timeouts.add(removeTimer);
    }

    for (let i = 0; i < Math.min(25, Math.floor(emojiCount / 2)); i++) {
      const t = setTimeout(createEmoji, Math.random() * 3000);
      timeouts.add(t);
    }

    const intervalMs = Math.max(200, 4000 / Math.max(1, emojiCount));
    const spawn = setInterval(() => {
      if (!alive) return;
      const live = root.querySelectorAll('.oktoberfest-emoji').length;
      if (live < emojiCount) createEmoji();
    }, intervalMs);
    intervals.add(spawn);

    return () => {
      alive = false;
      for (const t of timeouts) clearTimeout(t);
      for (const i of intervals) clearInterval(i);
      timeouts.clear();
      intervals.clear();
      root.querySelectorAll('.oktoberfest-emoji').forEach(n => n.remove());
    };
  }
};
