export default {
    name: 'Japan Flag',
    // Auto-trigger for National Foundation Day (Feb 11)
    triggers: [
      {
        type: 'range',
        monthStart: 2,
        dayStart: 11,
        monthEnd: 2,
        dayEnd: 11
      }
    ],
    palette: [
      '#FFFFFF', // White background
      '#BC002D'  // Red circle (Hinomaru)
    ],
  
    drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
      ctx.save();
  
      // === Draw waving white background ===
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = getWaveY(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= 2) {
        const y = h + getWaveY(x, t);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
  
      // === Draw the red circle (Hinomaru) ===
      const circleRadius = Math.min(w, h) * 0.18; // official proportions ≈ 3/5 height
      const circleX = w / 2;
      const baseY = h / 2;
  
      // Draw circle as small vertical wave segments for natural ripple
      ctx.fillStyle = '#BC002D';
      const segments = 60; // smoother wave
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const x = circleX + circleRadius * Math.cos(angle);
        const y = baseY + circleRadius * Math.sin(angle) + getWaveY(x, t) * 0.5; // subtle ripple
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
  
      ctx.restore();
    }
  };
  