// Rain Theme for festive-js
// This theme adds a rain animation effect with optional thunderstorm

const DEF = {
  dropColor: 'rgba(174,194,224,0.5)',
  minDropHeight: 10,
  maxDropHeight: 30,
  dropWidth: 2,
  dropInterval: 80,
  thunder: false,
};

export default {
  key: 'rain',
  name: 'Rain',
  triggers: [],
  params: { ...DEF },
  apply(root, _common, options = {}) {
    const cfg = { ...DEF, ...(options || {}) };
    const enableThunder = cfg.thunder === true;
    cfg.dropSpeed = 0.7;
    let alive = true;
    const timers = new Set();

    // Rain container
  const rainContainer = document.createElement('div');
  rainContainer.style.position = 'absolute';
  rainContainer.style.top = 0;
  rainContainer.style.left = 0;
  rainContainer.style.width = '100%';
  rainContainer.style.height = '100%';
  rainContainer.style.pointerEvents = 'none';
  rainContainer.style.overflow = 'hidden';
  rainContainer.style.zIndex = 9999;

    // Thunder overlay
    let thunderOverlay;
    if (enableThunder) {
      thunderOverlay = document.getElementById('festive-thunder-overlay');
      if (!thunderOverlay) {
        thunderOverlay = document.createElement('div');
        thunderOverlay.id = 'festive-thunder-overlay';
        thunderOverlay.style.position = 'fixed';
        thunderOverlay.style.top = 0;
        thunderOverlay.style.left = 0;
        thunderOverlay.style.width = '100vw';
        thunderOverlay.style.height = '100vh';
        thunderOverlay.style.pointerEvents = 'none';
        thunderOverlay.style.background = 'rgba(255,255,255,0)';
        thunderOverlay.style.transition = 'background 0.2s';
        thunderOverlay.style.zIndex = 2147483647;
        document.body.appendChild(thunderOverlay);
      }
    }

    function createDrop() {
      if (!alive) return;
  const dropsPerTick = 1;
  for (let i = 0; i < dropsPerTick; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = '-10px';
        drop.style.width = cfg.dropWidth + 'px';
        drop.style.height = (Math.random() * (cfg.maxDropHeight - cfg.minDropHeight) + cfg.minDropHeight) + 'px';
        drop.style.background = cfg.dropColor;
        drop.style.borderRadius = '1px';
        drop.style.opacity = Math.random() * 0.5 + 0.5;
        drop.style.pointerEvents = 'none';
        drop.style.transition = `top ${cfg.dropSpeed}s linear`;
        rainContainer.appendChild(drop);
        setTimeout(() => {
          drop.style.top = '100%';
        }, 10);
        // Remove drop on transition end for robust cleanup
        const removeDrop = () => {
          drop.removeEventListener('transitionend', removeDrop);
          if (drop.parentNode) drop.remove();
        };
        drop.addEventListener('transitionend', removeDrop);
      }
    }

    // Rain interval
  const rainInterval = setInterval(createDrop, cfg.dropInterval);
  timers.add(rainInterval);

    // Thunder effect
  let thunderInterval;
  let thunderOverlayCreated = false;
    function thunderFlash() {
      if (!enableThunder) return;
      thunderOverlay.style.background = 'rgba(255,255,255,0.8)';
      setTimeout(() => {
        thunderOverlay.style.background = 'rgba(255,255,255,0)';
      }, 80 + Math.random() * 120);
    }
    function startThunder() {
      if (!enableThunder) return;
      thunderInterval = setInterval(() => {
        if (!alive) return;
        if (Math.random() < 0.18) {
          thunderFlash();
        }
      }, 1200);
      timers.add(thunderInterval);
    }
  if (enableThunder) startThunder();

  root.appendChild(rainContainer);

    // Cleanup function
    return () => {
      alive = false;
      // Only clear intervals, not timeouts, since we no longer use timeouts for drop cleanup
      for (const timer of timers) {
        if (typeof timer === 'number') clearInterval(timer);
      }
      timers.clear();
      if (rainContainer.parentNode) rainContainer.remove();
      // Remove thunder interval if overlay exists
      if (enableThunder && thunderInterval) {
        clearInterval(thunderInterval);
        thunderInterval = null;
      }
      if (enableThunder && thunderOverlay) {
        thunderOverlay.style.background = 'rgba(255,255,255,0)';
        // Do not remove overlay to avoid flicker if other rain is started
      }
    };
  }
};
