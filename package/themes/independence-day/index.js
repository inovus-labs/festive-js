/**
 * To add a new flag:
 * 1. Create a new file in this directory (e.g., `usa.js`).
 * 2. Define the flag's properties in the new file, following the structure of `india.js`.
 * 3. Import the new flag file below.
 * 4. Add the imported flag object to the `flags` array.
 */

import india from './india.js';

// To add a new flag, import its file and add it to this array.
const flags = [india]; // e.g., import usa from './usa.js'; flags.push(usa);

// Combine all triggers from all flags into one array for the theme.
const allTriggers = flags.flatMap(flag => flag.triggers || []);

export default {
  key: 'independence-day',
  name: 'Independence Day',
  triggers: allTriggers,
  apply(root = document.body, common = {}, options = {}) {
    let flag;

    // If manually triggered with a specific flag name, find that flag.
    if (options.flag) {
        flag = flags.find(f => f.name === options.flag);
    } else {
        // If auto-triggered, find the flag whose trigger matches the current date.
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
        const currentDay = today.getDate();

        flag = flags.find(f => {
            if (!f.triggers) return false;
            return f.triggers.some(trigger => {
                if (trigger.type !== 'range') return false;

                // Handle date ranges that are within the same month.
                if (trigger.monthStart === trigger.monthEnd) {
                    return currentMonth === trigger.monthStart && currentDay >= trigger.dayStart && currentDay <= trigger.dayEnd;
                }

                // Handle date ranges that span across multiple months (assumes within the same year).
                const inStartMonth = currentMonth === trigger.monthStart && currentDay >= trigger.dayStart;
                const inEndMonth = currentMonth === trigger.monthEnd && currentDay <= trigger.dayEnd;
                const inBetweenMonth = currentMonth > trigger.monthStart && currentMonth < trigger.monthEnd;
                
                return inStartMonth || inEndMonth || inBetweenMonth;
            });
        });
    }

    // Default to the first flag in the array if no specific flag is found.
    flag = flag || flags[0];

    const cfg = {
      palette: flag.palette,
      speed: options.speed || 0.4,
      amplitude: options.amplitude || 0.08,
      alpha: options.alpha ?? 0.15, // Reduced opacity for better visibility
      blend: options.blend || 'multiply' // Changed blend mode for better background effect
    };

    const overlay = document.createElement('div');
    overlay.className = 'festive-independence-day-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '-1', // Keeps it behind all content
      mixBlendMode: cfg.blend,
      opacity: String(cfg.alpha),
      overflow: 'hidden'
    });

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    overlay.appendChild(canvas);
    root.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    let rafId = null;
    let start = performance.now();

    function draw(now) {
      const t = (now - start) / 4000 * cfg.speed;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const stripeHeight = h / cfg.palette.length;
      const waveAmplitude = h * cfg.amplitude;

      const getWaveY = (x, t) => {
        const xFactor = x / (w * 0.5);
        return Math.sin(xFactor * Math.PI + t) * waveAmplitude * Math.cos(t / 3) +
               Math.cos(xFactor * Math.PI * 0.7 + t * 1.2) * waveAmplitude * 0.5;
      };

      for (let i = 0; i < cfg.palette.length; i++) {
        ctx.fillStyle = cfg.palette[i];
        ctx.beginPath();
        const y0 = i * stripeHeight;
        ctx.moveTo(0, y0 + getWaveY(0, t));
        for (let x = 1; x <= w; x += 5) {
          ctx.lineTo(x, y0 + getWaveY(x, t));
        }
        const y1 = (i + 1) * stripeHeight;
        ctx.lineTo(w, y1 + getWaveY(w, t));
        for (let x = w; x >= 0; x -= 5) {
          ctx.lineTo(x, y1 + getWaveY(x, t));
        }
        ctx.closePath();
        ctx.fill();
      }

      // If the flag has a custom element (like the Ashoka Chakra), draw it.
      if (flag.drawCustomElement) {
        flag.drawCustomElement(ctx, w, h, stripeHeight, getWaveY, t);
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }
};