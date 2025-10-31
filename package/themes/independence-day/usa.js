export default {
  key: 'usa-independence',
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
    // === Helper function for drawing 5-pointed stars ===
    function drawStar(ctx, cx, cy, radius) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        // Outer point angle
        const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        // Inner point angle
        const innerAngle = outerAngle + Math.PI / 5;
        
        // Outer point
        const outerX = cx + radius * Math.cos(outerAngle);
        const outerY = cy + radius * Math.sin(outerAngle);
        
        // Inner point (scaled to 0.38 for proper star shape)
        const innerX = cx + (radius * 0.38) * Math.cos(innerAngle);
        const innerY = cy + (radius * 0.38) * Math.sin(innerAngle);
        
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
    }

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

    // === Draw 50 stars in proper pattern (9 rows, alternating 6-5-6-5...) ===
    // American flag has:
    // Row 1: 6 stars
    // Row 2: 5 stars (offset)
    // Row 3: 6 stars
    // Row 4: 5 stars (offset)
    // Row 5: 6 stars
    // Row 6: 5 stars (offset)
    // Row 7: 6 stars
    // Row 8: 5 stars (offset)
    // Row 9: 6 stars
    // Total: (6×5) + (5×4) = 30 + 20 = 50 stars ✓
    
    const starRows = 9;
    const starsPerRow = [6, 5, 6, 5, 6, 5, 6, 5, 6]; // This equals 50 total
    
    // Calculate star sizing and spacing (significantly reduced size)
    const starRadius = Math.min(unionWidth / 30, unionHeight / 28);
    
    // Vertical spacing: divide union height into 10 sections (9 rows + margins)
    const verticalSpacing = unionHeight / 10;
    
    // Horizontal spacing for 6-star rows
    const horizontalSpacing6 = unionWidth / 7;
    // Horizontal spacing for 5-star rows
    const horizontalSpacing5 = unionWidth / 6;

    ctx.fillStyle = '#FFFFFF';
    
    for (let row = 0; row < starRows; row++) {
      const starCount = starsPerRow[row];
      const is6StarRow = starCount === 6;
      
      // Calculate row's base Y position
      const rowY = verticalSpacing * (row + 1);
      
      // Calculate spacing and offset for this row
      const horizontalSpacing = is6StarRow ? horizontalSpacing6 : horizontalSpacing5;
      const startX = horizontalSpacing; // Start from first spacing unit
      
      for (let col = 0; col < starCount; col++) {
        // Calculate star position
        const starX = startX + (col * horizontalSpacing);
        const starY = rowY + getWaveY(starX, t); // Follow the wave
        
        drawStar(ctx, starX, starY, starRadius);
      }
    }

    ctx.restore();
  }
};