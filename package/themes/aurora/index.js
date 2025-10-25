export default {
  key: 'aurora',
  /**
   * apply(root, common, options)
   * - root: element to attach into (Festive passes a root)
   * - common: shared utilities (unused here)
   * - options: { palette, speed, intensity, bands, amplitude, alpha }
   */
  apply(root = document.body, common = {}, options = {}) {
    const cfg = {
      palette: options.palette || [
        'rgba(100,220,255,1)',
        'rgba(140,255,180,1)',
        'rgba(200,160,255,1)'
      ],
      bands: options.bands || 4,
      speed: options.speed || 0.6,       // global animation speed
      amplitude: options.amplitude || 0.25, // vertical wave amplitude (fraction of height)
      alpha: options.alpha ?? 0.55,      // overall overlay opacity
      blend: options.blend || 'screen'   // CSS mix-blend-mode
    };

    // container
    const overlay = document.createElement('div');
    overlay.className = 'festive-aurora-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: String(2147483000), // keep above most UI (consistent with other themes)
      mixBlendMode: cfg.blend,
      opacity: String(cfg.alpha),
      overflow: 'hidden'
    });

    // canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    overlay.appendChild(canvas);
    root.appendChild(overlay);

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Band animation speed constants (extracted for clarity)
    // BASE_SPEED_MULTIPLIER: base speed multiplier for each band
    // RANDOM_SPEED_RANGE: random portion added to base for variation
    // BAND_SPEED_INCREMENT: per-band incremental multiplier so later bands move slightly faster
    const BASE_SPEED_MULTIPLIER = 0.4;
    const RANDOM_SPEED_RANGE = 0.8;
    const BAND_SPEED_INCREMENT = 0.12;

    // band state
    const bands = new Array(cfg.bands).fill(0).map((_, i) => ({
      phase: Math.random() * Math.PI * 2,
      // Use named constants instead of magic numbers to improve readability
      speed: (BASE_SPEED_MULTIPLIER + Math.random() * RANDOM_SPEED_RANGE) * (1 + i * BAND_SPEED_INCREMENT),
      offset: (i / cfg.bands) * 0.6, // vertical placement
      // NOTE: `width` was originally added to support potential features such as variable band thickness
      // or horizontal falloff in the aurora rendering. Although it is currently not used in rendering,
      // it has been retained in case such features are implemented in the future. Remove if not needed.
      width: 0.35 + Math.random() * 0.5
    }));

    let rafId = null;
    let start = performance.now();

    function draw(now) {
      const t = (now - start) / 1000 * cfg.speed;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // subtle background to soften edges
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, 'rgba(0,0,0,0.0)');
      bgGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // draw each aurora band
      for (let i = 0; i < bands.length; i++) {
        const b = bands[i];
        const phase = b.phase + t * b.speed;
        const baseY = h * (0.2 + b.offset * 0.6);
        const amplitudePx = h * cfg.amplitude * (0.6 + Math.sin(phase * 0.5) * 0.4);

        // create path for band
        ctx.beginPath();
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const x = (s / steps) * w;
          const noise = Math.sin((s / steps) * Math.PI * 2 * (1 + i * 0.3) + phase) * 0.5;
          const y = baseY + noise * amplitudePx * Math.sin((s / steps) * Math.PI);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        // bottom closure to create a soft filled shape
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        // gradient fill per band using palette
        const grad = ctx.createLinearGradient(0, baseY - amplitudePx, 0, baseY + amplitudePx * 2);
        const colorA = cfg.palette[i % cfg.palette.length];
        const colorB = cfg.palette[(i + 1) % cfg.palette.length];
        // The following replacements assume colors are provided as rgba(...,1)
        // and specifically look for a trailing ",1)" to replace the alpha.
        // This is brittle: if users pass "rgb(...)" (no alpha) or rgba with
        // a different alpha (e.g. ",0.5)"), the replace will fail and produce
        // invalid color strings. A more robust approach would parse the color
        // string (or accept color objects) and reconstruct rgba(...) values
        // with the desired alpha. For now we keep the simple replace but be
        // aware of the limitation.
        grad.addColorStop(0, colorA.replace(/, *1\)$/, ',0.0)'));
        grad.addColorStop(0.45, colorA.replace(/, *1\)$/, ',0.65)'));
        grad.addColorStop(0.7, colorB.replace(/, *1\)$/, ',0.35)'));
        grad.addColorStop(1, colorB.replace(/, *1\)$/, ',0.0)'));
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fill();
      }

      // soft vignette
      ctx.globalCompositeOperation = 'source-over';
      const vig = ctx.createRadialGradient(w / 2, h * 0.3, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h));
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    // Return cleanup function
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }
};