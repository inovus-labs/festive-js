export default {
    name: 'USA Flag',
    // Auto-trigger for Independence Day
    triggers: [
      {
        type: 'range',
        monthStart: 7,
        dayStart: 4,
        monthEnd: 7,
        dayEnd: 4
      }
    ],
    palette: [
      '#B22234', // Red
      '#FFFFFF', // White
      '#3C3B6E'  // Navy Blue (Union)
    ],
  
    drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
      const stripeCount = 13;
      const fullStripeHeight = h / stripeCount;
      const unionHeight = fullStripeHeight * 7; // Top 7 stripes
      const unionWidth = w * 0.4; // 40% width for the union
  
      ctx.save();
  
      // === Draw waving stripes ===
      for (let i = 0; i < stripeCount; i++) {
        const color = i % 2 === 0 ? '#B22234' : '#FFFFFF';
        ctx.fillStyle = color;
        const yStart = i * fullStripeHeight;
  
        // Draw a wavy stripe path
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = yStart + getWaveY(x, t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        for (let x = w; x >= 0; x -= 2) {
          const y = yStart + fullStripeHeight + getWaveY(x, t);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
  
      // === Draw waving union (blue rectangle) ===
      ctx.beginPath();
      for (let x = 0; x <= unionWidth; x += 2) {
        const y = getWaveY(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let x = unionWidth; x >= 0; x -= 2) {
        const y = unionHeight + getWaveY(x, t);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#3C3B6E';
      ctx.fill();
  
      // === Draw stars inside the waving union ===
      const starRows = 9;
      const starsInRow = [6, 5, 6, 5, 6, 5, 6, 5, 6];
      const starRadius = Math.min(fullStripeHeight * 0.3, 5);
      const rowSpacing = unionHeight / (starRows + 1);
      const colSpacing = unionWidth / 12;
  
      ctx.fillStyle = '#FFFFFF';
      for (let r = 0; r < starRows; r++) {
        const count = starsInRow[r];
        const offsetX = count === 5 ? colSpacing * 1.8 : colSpacing;
        const baseY = (r + 1) * rowSpacing;
  
        for (let c = 0; c < count; c++) {
          const x = offsetX + c * colSpacing * 2;
          const y = baseY + getWaveY(x, t); // stars follow the wave
          drawStar(ctx, x, y, starRadius);
        }
      }
  
      ctx.restore();
  
      // === Helper function for stars ===
      function drawStar(ctx, x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outer = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const inner = outer + Math.PI / 5;
          ctx.lineTo(x + r * Math.cos(outer), y + r * Math.sin(outer));
          ctx.lineTo(x + (r * 0.4) * Math.cos(inner), y + (r * 0.4) * Math.sin(inner));
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  };
  