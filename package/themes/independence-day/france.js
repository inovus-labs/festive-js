export default {
    name: 'France Flag',
    // Auto-trigger date range for Bastille Day 🇫🇷
    triggers: [
      {
        type: 'range',
        monthStart: 7,
        dayStart: 14,
        monthEnd: 7,
        dayEnd: 14
      }
    ],
    palette: [
      '#0055A4', // Blue
      '#FFFFFF', // White
      '#EF4135'  // Red
    ],
    drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
      const stripeWidth = w / 3;
  
      ctx.save();
  
      // Draw each vertical color stripe
      for (let i = 0; i < 3; i++) {
        const color = ['#0055A4', '#FFFFFF', '#EF4135'][i];
        const xStart = i * stripeWidth;
        const xEnd = (i + 1) * stripeWidth;
  
        ctx.beginPath();
        ctx.moveTo(xStart, 0);
  
        // Top waving edge
        for (let x = xStart; x <= xEnd; x += 3) {
          const y = getWaveY(x, t);
          ctx.lineTo(x, y);
        }
  
        // Right edge down
        ctx.lineTo(xEnd, h);
  
        // Bottom waving edge
        for (let x = xEnd; x >= xStart; x -= 3) {
          const y = h + getWaveY(x, t);
          ctx.lineTo(x, y);
        }
  
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }
  
      ctx.restore();
    }
  };
  