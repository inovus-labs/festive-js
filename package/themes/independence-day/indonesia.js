export default {
  name: 'Indonesian Flag',
  // Auto-trigger date range for Indonesian Independence Day 🇮🇩
  // August 17th (Hari Kemerdekaan)
  triggers: [
    {
      type: 'range',
      monthStart: 8,
      dayStart: 17,
      monthEnd: 8,
      dayEnd: 17
    }
  ],
  palette: [
    '#FF0000', // Red (Merah)
    '#FFFFFF'  // White (Putih)
  ],
  drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
    // Indonesian flag: 2 horizontal stripes (red on top, white on bottom)
    const halfHeight = h / 2;

    ctx.save();

    // === Draw Red stripe (top half) ===
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    
    // Top edge with wave
    for (let x = 0; x <= w; x += 2) {
      const y = getWaveY(x, t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    // Middle dividing line with wave (right to left)
    for (let x = w; x >= 0; x -= 2) {
      const y = halfHeight + getWaveY(x, t);
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();

    // === Draw White stripe (bottom half) ===
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    
    // Middle dividing line with wave (left to right)
    for (let x = 0; x <= w; x += 2) {
      const y = halfHeight + getWaveY(x, t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    // Bottom edge with wave (right to left)
    for (let x = w; x >= 0; x -= 2) {
      const y = h + getWaveY(x, t);
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
};