export default {
  key: 'independence-day',
  name: 'Independence Day - Indian Flag',
  triggers: [
    {
      type: 'range',
      monthStart: 8,
      dayStart: 1,
      monthEnd: 8,
      dayEnd: 31,
    },
  ],
  apply(root = document.body, common = {}, options = {}) {
    const cfg = {
      palette: options.palette || [
        '#FF9933', // Saffron
        '#FFFFFF', // White
        '#138808'  // Green
      ],
      speed: options.speed || 0.5,
      waveFrequency: options.waveFrequency || 3,
      waveAmplitude: options.waveAmplitude || 20,
      alpha: options.alpha ?? 0.25,
      blend: options.blend || 'normal'
    };

    const overlay = document.createElement('div');
    overlay.className = 'festive-independence-day-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '0',
      mixBlendMode: cfg.blend,
      opacity: String(cfg.alpha)
    });

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    overlay.appendChild(canvas);
    root.appendChild(overlay);

    const ctx = canvas.getContext('2d', { alpha: true });
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    function resize() {
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    let rafId = null;
    const start = performance.now();

    function draw(now) {
      const t = (now - start) / 1000 * cfg.speed;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      
      ctx.clearRect(0, 0, w, h);

      const stripeHeight = h / 3;
      const step = 3; // Points for smooth curves

      // Wave function - creates horizontal waves
      const getWaveOffset = (x, t) => {
        return Math.sin((x / w) * Math.PI * cfg.waveFrequency - t * 2) * cfg.waveAmplitude;
      };

      // Get brightness for 3D effect
      const getBrightness = (x, t) => {
        const waveDerivative = Math.cos((x / w) * Math.PI * cfg.waveFrequency - t * 2);
        return 1 + (waveDerivative * 0.25); // Subtle shading
      };

      // Draw each stripe with connected waves
      for (let stripeIdx = 0; stripeIdx < 3; stripeIdx++) {
        const baseY = stripeIdx * stripeHeight;
        
        ctx.beginPath();
        
        // Top edge of stripe
        ctx.moveTo(0, baseY + getWaveOffset(0, t));
        for (let x = step; x <= w; x += step) {
          const y = baseY + getWaveOffset(x, t);
          ctx.lineTo(x, y);
        }
        
        // Bottom edge of stripe (reversed direction)
        const nextBaseY = (stripeIdx + 1) * stripeHeight;
        ctx.lineTo(w, nextBaseY + getWaveOffset(w, t));
        for (let x = w - step; x >= 0; x -= step) {
          const y = nextBaseY + getWaveOffset(x, t);
          ctx.lineTo(x, y);
        }
        
        ctx.closePath();

        // Create gradient for 3D shading effect
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        const baseColor = cfg.palette[stripeIdx];
        
        // Parse base color and apply shading across the width
        let r, g, b;
        if (stripeIdx === 0) { // Saffron
          r = 255; g = 153; b = 51;
        } else if (stripeIdx === 1) { // White
          r = 255; g = 255; b = 255;
        } else { // Green
          r = 19; g = 136; b = 8;
        }

        // Add gradient stops with brightness variations
        const stops = 20;
        for (let i = 0; i <= stops; i++) {
          const x = (i / stops) * w;
          const brightness = getBrightness(x, t);
          const shadedR = Math.floor(Math.min(255, r * brightness));
          const shadedG = Math.floor(Math.min(255, g * brightness));
          const shadedB = Math.floor(Math.min(255, b * brightness));
          gradient.addColorStop(i / stops, `rgb(${shadedR}, ${shadedG}, ${shadedB})`);
        }

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw Ashoka Chakra in the center
      const chakraY = h / 2;
      const chakraX = w / 2;
      const chakraRadius = Math.min(stripeHeight / 3.5, 35);
      
      // Position chakra with the wave
      const chakraOffset = getWaveOffset(chakraX, t);
      const finalChakraY = chakraY + chakraOffset;
      const chakraBrightness = getBrightness(chakraX, t);

      ctx.save();
      
      // Apply shading to chakra color
      const navyR = Math.floor(0 * chakraBrightness);
      const navyG = Math.floor(0 * chakraBrightness);
      const navyB = Math.floor(128 * chakraBrightness);
      ctx.strokeStyle = `rgb(${navyR}, ${navyG}, ${navyB})`;
      
      // Outer circle
      ctx.lineWidth = Math.max(2, chakraRadius / 12);
      ctx.beginPath();
      ctx.arc(chakraX, finalChakraY, chakraRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Inner hub
      ctx.lineWidth = Math.max(1.5, chakraRadius / 15);
      ctx.beginPath();
      ctx.arc(chakraX, finalChakraY, chakraRadius * 0.15, 0, 2 * Math.PI);
      ctx.stroke();

      // 24 spokes
      ctx.lineWidth = Math.max(1.2, chakraRadius / 18);
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * 2 * Math.PI;
        const innerRadius = chakraRadius * 0.15;
        const startX = chakraX + innerRadius * Math.cos(angle);
        const startY = finalChakraY + innerRadius * Math.sin(angle);
        const endX = chakraX + chakraRadius * Math.cos(angle);
        const endY = finalChakraY + chakraRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      ctx.restore();

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }
};