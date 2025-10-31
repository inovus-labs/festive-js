/**
 * Independence Day — modular flag-based theme
 *
 * To add a new flag:
 * 1. Create a new file in this directory (e.g., `usa.js`) that exports the flag object.
 * 2. Import it below and add it to the `flags` array.
 */

import india from './india.js';
import bahrain from './bahrain.js';

// Add other flags here when available:
// import usa from './usa.js';
const flags = [india,bahrain]; // e.g., const flags = [india, usa];
import france from './france.js';

// Add other flags here when available:
// import usa from './usa.js';
const flags = [india,france]; // e.g., const flags = [india, usa];
import japan from './japan.js';
// Add other flags here when available:
// import usa from './usa.js';
const flags = [india,japan]; // e.g., const flags = [india, usa];
import usa from './usa.js';

// Add other flags here when available:
// import usa from './usa.js';
const flags = [india,usa]; // e.g., const flags = [india, usa];

const allTriggers = flags.flatMap(f => f.triggers || []);

export default {
  key: 'independence-day',
  name: 'Independence Day',
  triggers: allTriggers,
  apply(root = document.body, common = {}, options = {}) {
    // Determine requested flag: support options.flag or options.themes['independence-day'].flag
    const manualFlagName =
      options.flag ||
      (options.themes && options.themes['independence-day'] && options.themes['independence-day'].flag);

    let flag;

    if (manualFlagName) {
      const wanted = String(manualFlagName).toLowerCase();
      flag = flags.find(f => String(f.name || '').toLowerCase() === wanted);
    } else {
      // Auto-select flag based on today's date and each flag's triggers
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // 1-12
      const currentDay = today.getDate();

      flag = flags.find(f => {
        if (!f.triggers) return false;
        return f.triggers.some(trigger => {
          if (trigger.type !== 'range') return false;

          // Same-month range
          if (trigger.monthStart === trigger.monthEnd) {
            return (
              currentMonth === trigger.monthStart &&
              currentDay >= trigger.dayStart &&
              currentDay <= trigger.dayEnd
            );
          }

          // Range across months (assumes same year)
          const inStartMonth = currentMonth === trigger.monthStart && currentDay >= trigger.dayStart;
          const inEndMonth = currentMonth === trigger.monthEnd && currentDay <= trigger.dayEnd;
          const inBetween = currentMonth > trigger.monthStart && currentMonth < trigger.monthEnd;

          return inStartMonth || inEndMonth || inBetween;
        });
      });
    }

    // Default to first flag if none matched
    flag = flag || flags[0];

    const cfg = {
      palette: flag.palette || options.palette || ['#FF9933', '#FFFFFF', '#138808'],
      speed: options.speed || 0.4,
      amplitude: options.amplitude || 0.08, // relative to height
      alpha: options.alpha ?? 0.15,
      blend: options.blend || 'multiply'
    };

    const overlay = document.createElement('div');
    overlay.className = 'festive-independence-day-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '-1', // keep behind content
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
      const w = Math.max(1, canvas.clientWidth || canvas.offsetWidth);
      const h = Math.max(1, canvas.clientHeight || canvas.offsetHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // Initial sizing
    resize();

    let rafId = null;
    let start = performance.now();

    function getWaveY(x, t, w, h, cfgLocal) {
      const xFactor = x / (w * 0.5);
      const waveAmplitude = h * cfgLocal.amplitude;
      return (
        Math.sin(xFactor * Math.PI + t) * waveAmplitude * Math.cos(t / 3) +
        Math.cos(xFactor * Math.PI * 0.7 + t * 1.2) * waveAmplitude * 0.5
      );
    }

    function draw(now) {
      const t = (now - start) / 4000 * cfg.speed;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const stripeHeight = h / cfg.palette.length;

      for (let i = 0; i < cfg.palette.length; i++) {
        ctx.fillStyle = cfg.palette[i];
        ctx.beginPath();
        const y0 = i * stripeHeight;
        ctx.moveTo(0, y0 + getWaveY(0, t, w, h, cfg));
        for (let x = 1; x <= w; x += 5) {
          ctx.lineTo(x, y0 + getWaveY(x, t, w, h, cfg));
        }
        const y1 = (i + 1) * stripeHeight;
        ctx.lineTo(w, y1 + getWaveY(w, t, w, h, cfg));
        for (let x = w; x >= 0; x -= 5) {
          ctx.lineTo(x, y1 + getWaveY(x, t, w, h, cfg));
        }
        ctx.closePath();
        ctx.fill();
      }

      // Draw custom element (e.g., Ashoka Chakra) if provided by the flag
      if (flag.drawCustomElement) {
        try {
          flag.drawCustomElement(ctx, w, h, stripeHeight, (x, tn) => getWaveY(x, tn, w, h, cfg), t);
        } catch (err) {
          // Fail silently to avoid breaking the animation loop
          console.error('Error drawing custom element for independence-day flag:', err);
        }
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