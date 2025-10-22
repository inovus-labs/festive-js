function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const DEF = {
  smileyEmojis: [
    '😊', '😃', '😄', '😁', '🙂', 
    '😀', '🤗', '😺', '😸', '🥰',
    '😍', '🤩', '😇', '☺️', '🌞'
  ],
  count: 45,
  minSize: 20,
  maxSize: 60,
  minDuration: 5,
  maxDuration: 12,
  driftRange: 25,
  minOpacity: 0.7,
  maxOpacity: 1.0,
  bounceIntensity: 15
};

function injectCSS() {
  if (document.getElementById('smile-day-css')) return;
  const css = `
    .smile-emoji {
      position: fixed;
      top: -10vh;
      pointer-events: none;
      z-index: 99999;
      will-change: transform, opacity;
      font-size: 1em;
      animation-name: smile-float;
      animation-timing-function: ease-in-out;
      user-select: none;
    }

    @keyframes smile-float {
      0% { 
        transform: translateY(-10vh) scale(0.3);
        opacity: 0;
      }
      5% { 
        opacity: 1;
        transform: translateY(0vh) scale(1);
      }
      100% { 
        transform: translateY(110vh) scale(0.8);
        opacity: 0;
      }
    }

    @keyframes smile-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    @keyframes smile-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  const style = document.createElement('style');
  style.id = 'smile-day-css';
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: 'emoji',
  name: 'World emoji Day',
  params: { ...DEF },

  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;

    const timeouts = new Set();
    const intervals = new Set();

    const isMobile = window.innerWidth <= 768;
    const emojiCount = isMobile ? Math.max(10, Math.floor(cfg.count * 0.4)) : cfg.count;

    function createSmiley() {
      if (!alive) return;
      
      const span = document.createElement('span');
      span.className = 'smile-emoji';
      
      const emojis = cfg.smileyEmojis || DEF.smileyEmojis;
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const size = Math.floor(rand(cfg.minSize, cfg.maxSize));
      span.style.fontSize = `${size}px`;

      const left = Math.random() * 100;
      span.style.left = `${left}vw`;
      
      const drift = rand(-cfg.driftRange, cfg.driftRange);
      const duration = rand(cfg.minDuration, cfg.maxDuration);
      const opacity = rand(cfg.minOpacity, cfg.maxOpacity);
      const delay = rand(0, 3);

      span.style.opacity = opacity;
      span.style.animationDuration = `${duration}s`;
      span.style.animationDelay = `${delay}s`;

      root.appendChild(span);

      // Animate drift, rotation, and bounce with requestAnimationFrame
      const start = performance.now() + delay * 1000;
      const end = start + duration * 1000;
      const bounceSpeed = rand(1.5, 3.5);
      const shouldSpin = Math.random() > 0.7; // 30% chance to spin
      const spinSpeed = rand(2, 5);

      function frame(now) {
        if (!alive) return;
        if (now < start) {
          requestAnimationFrame(frame);
          return;
        }
        
        const t = Math.min(1, (now - start) / (end - start));
        const elapsed = (now - start) / 1000;
        
        // Horizontal drift
        const x = drift * t;
        
        // Bouncing motion
        const bounce = Math.sin(elapsed * bounceSpeed * Math.PI) * cfg.bounceIntensity * (1 - t * 0.3);
        
        // Optional spinning
        const rotation = shouldSpin ? (elapsed * spinSpeed * 360) % 360 : 0;
        
        span.style.transform = `translateX(${x}vw) translateY(${bounce}px) rotate(${rotation}deg)`;
        
        if (now < end) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      const removeTimer = setTimeout(() => {
        span.remove();
        timeouts.delete(removeTimer);
      }, (duration + delay) * 1000 + 200);
      timeouts.add(removeTimer);
    }

    // Initial emoji burst
    for (let i = 0; i < Math.min(25, Math.floor(emojiCount / 2)); i++) {
      const t = setTimeout(createSmiley, Math.random() * 3000);
      timeouts.add(t);
    }

    // Continuous spawning
    const intervalMs = Math.max(150, 3500 / Math.max(1, emojiCount));
    const spawn = setInterval(() => {
      if (!alive) return;
      const live = root.querySelectorAll('.smile-emoji').length;
      if (live < emojiCount) createSmiley();
    }, intervalMs);
    intervals.add(spawn);

    // Cleanup logic
    return () => {
      alive = false;
      for (const t of timeouts) clearTimeout(t);
      for (const i of intervals) clearInterval(i);
      timeouts.clear();
      intervals.clear();
      root.querySelectorAll('.smile-emoji').forEach(n => n.remove());
    };
  }
};