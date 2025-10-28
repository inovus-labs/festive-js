export default {
  name: 'Indian Flag',
  // The date range when this flag's theme should be auto-triggered.
  triggers: [
    {
      type: 'range',
      monthStart: 8,
      dayStart: 15,
      monthEnd: 8,
      dayEnd: 15,
    }
  ],
  palette: [
    '#FF9933', // Saffron
    '#FFFFFF', // White
    '#138808'  // Green
  ],
  drawCustomElement: (ctx, w, h, stripeHeight, getWaveY, t) => {
    const chakraRadius = Math.min(stripeHeight / 2.5, 30);
    const chakraX = w / 2;
    const yOffsetChakra = getWaveY(chakraX, t);
    const chakraY = h / 2 + yOffsetChakra;

    ctx.strokeStyle = '#000080';
    ctx.lineWidth = Math.max(1.5, chakraRadius/12);
    ctx.beginPath();
    ctx.arc(chakraX, chakraY, chakraRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = Math.max(1, chakraRadius/20);
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * 2 * Math.PI;
      const startX = chakraX;
      const startY = chakraY;
      const endX = chakraX + chakraRadius * Math.cos(angle);
      const endY = chakraY + chakraRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
};
