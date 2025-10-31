export default {
    name: 'Bahrain Flag',
    triggers: [
      {
        type: 'range',
        monthStart: 12,
        dayStart: 16,
        monthEnd: 12,
        dayEnd: 16
      }
    ],
    palette: ['#FFFFFF', '#D71A28'],
  
    drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
      ctx.save();
  
      const whiteWidth = w * 0.25;      // 25% white area
      const triangleCount = 5;          // 5 white triangles
      const triangleBase = h / (triangleCount * 2); // height per half triangle
      const triangleDepth = w * 0.10;   // depth into red (1/10th width, realistic)
  
      // Create waving mask
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = getWaveY(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h + getWaveY(w, t));
      for (let x = w; x >= 0; x -= 3) {
        const y = h + getWaveY(x, t);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.clip();
  
      // Draw red background
      ctx.fillStyle = '#D71A28';
      ctx.fillRect(0, 0, w, h);
  
      // Draw white section + zigzag
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(whiteWidth, 0);
  
      // Zigzag border (5 points)
      for (let i = 0; i < triangleCount * 2; i++) {
        const y = (i + 1) * triangleBase;
        const x = i % 2 === 0 ? whiteWidth + triangleDepth : whiteWidth;
        ctx.lineTo(x, y);
      }
  
      ctx.lineTo(0, h);
      ctx.closePath();
  
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
  
      ctx.restore();
    }
  };
  