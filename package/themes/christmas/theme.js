
function rand(min, max){ return Math.random()*(max-min)+min; }

const DEF = {
  color: "#ffffff",
  minSize: 4,
  maxSize: 10,
  density: 100,
  speedMin: 0.8,
  speedMax: 2.5,
  randomness: 0.5
};

function injectCSS(){
  if (document.getElementById("christmas-snow-css")) return;
  const css = `@keyframes flake-fall {
    0% { transform: translate3d(var(--x,0), -10vh, 0); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translate3d(var(--xEnd,0), 110vh, 0); opacity: 0.9; }
  }`;
  const style = document.createElement("style");
  style.id = "christmas-snow-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "christmas-snow",
  name: "Christmas Snowfall",
  triggers: [{type:"date", month:12, day:25}],
  params: {...DEF},
  apply(root, common, options){
    injectCSS();
    const cfg = { ...DEF, ...(options||{}) };
    let alive = true;
    const timers = new Set();

    function spawn(){
      if (!alive) return;
      const flake = document.createElement("div");
      const size = rand(cfg.minSize, cfg.maxSize);
      const startX = rand(0, window.innerWidth);
      const drift = (Math.random()-0.5) * 200 * cfg.randomness;
      const endX = startX + drift;
      const duration = rand(8 / cfg.speedMax, 14 / cfg.speedMin);
      flake.style.position="fixed";
      flake.style.left=`${startX}px`;
      flake.style.top="-10vh";
      flake.style.width=`${size}px`;
      flake.style.height=`${size}px`;
      flake.style.borderRadius="50%";
      flake.style.background=cfg.color;
      flake.style.filter="drop-shadow(0 0 6px rgba(255,255,255,0.6))";
      flake.style.pointerEvents="none";
      flake.style.animation=`flake-fall ${duration}s linear forwards`;
      flake.style.setProperty("--x","0px");
      flake.style.setProperty("--xEnd", `${endX - startX}px`);
      flake.className="christmas-snowflake";
      root.appendChild(flake);
      const t = setTimeout(()=>{ flake.remove(); timers.delete(t); }, duration*1000+50);
      timers.add(t);
    }

    const intervalMs = Math.max(16, 2000 / Math.max(1, cfg.density));
    const interval = setInterval(spawn, intervalMs);
    timers.add(interval);
    for (let i=0; i<Math.min(50, Math.floor(cfg.density/2)); i++) spawn();

    return () => {
      alive = false;
      for (const t of timers) clearTimeout(t);
      timers.clear();
      root.querySelectorAll(".christmas-snowflake").forEach(n => n.remove());
    };
  }
};
