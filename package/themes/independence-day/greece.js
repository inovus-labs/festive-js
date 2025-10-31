export default {
    key: 'greece-independence',
    name: 'Greece Flag',
    // Auto-trigger for Greek Independence Day (March 25)
    triggers: [
      {
        type: 'range',
        monthStart: 3,
        dayStart: 25,
        monthEnd: 3,
        dayEnd: 25
      }
    ],
    palette: [
      '#0D5EAF', // Blue
      '#FFFFFF'  // White
    ],
  
    drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
      // Greek flag has 9 horizontal stripes (5 blue, 4 white)
      // and a blue canton with a white cross in the upper left
      
      const stripeCount = 9;
      const fullStripeHeight = h / stripeCount;
      
      // Canton (blue square with cross) dimensions
      // The canton occupies the first 5 stripes in height and width
      const cantonSize = fullStripeHeight * 5;
  
      ctx.save();
  
      // === Draw 9 alternating blue and white stripes ===
      for (let i = 0; i < stripeCount; i++) {
        // First stripe is blue, then alternate
        const color = i % 2 === 0 ? '#0D5EAF' : '#FFFFFF';
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
  
      // === Draw blue canton (square background for cross) ===
      ctx.beginPath();
      for (let x = 0; x <= cantonSize; x += 2) {
        const y = getWaveY(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let x = cantonSize; x >= 0; x -= 2) {
        const y = cantonSize + getWaveY(x, t);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = '#0D5EAF';
      ctx.fill();
  
      // === Draw white Greek cross in canton ===
      // Cross arms: 1/5 of canton size (centered)
      const crossArmWidth = cantonSize / 5;
      const crossCenter = cantonSize / 2;
  
      ctx.fillStyle = '#FFFFFF';
  
      // Vertical arm of cross
      ctx.beginPath();
      const verticalLeft = crossCenter - crossArmWidth / 2;
      const verticalRight = crossCenter + crossArmWidth / 2;
      
      for (let x = verticalLeft; x <= verticalRight; x += 2) {
        const y = getWaveY(x, t);
        if (x === verticalLeft) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let x = verticalRight; x >= verticalLeft; x -= 2) {
        const y = cantonSize + getWaveY(x, t);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
  
      // Horizontal arm of cross
      ctx.beginPath();
      const horizontalTop = crossCenter - crossArmWidth / 2;
      const horizontalBottom = crossCenter + crossArmWidth / 2;
      
      // Top edge
      for (let x = 0; x <= cantonSize; x += 2) {
        const y = horizontalTop + getWaveY(x, t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // Bottom edge (reverse)
      for (let x = cantonSize; x >= 0; x -= 2) {
        const y = horizontalBottom + getWaveY(x, t);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
  
      ctx.restore();
    }
  };