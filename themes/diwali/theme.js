
function rand(min, max){ return Math.random()*(max-min)+min; }

const DEF = {
  color: "#ffd54f",
  trail: true,
  density: 80,
  sizeMin: 2,
  sizeMax: 5,
  riseMin: 4.0,
  riseMax: 7.5,
  randomness: 0.5
};

function injectCSS(){
  if (document.getElementById("diwali-sparkles-css")) return;
  const css = `@keyframes spark-rise {
    0%   { transform: translate3d(var(--x,0), 10vh, 0); opacity: 0; }
    10%  { opacity: 1; }
    100% { transform: translate3d(var(--xEnd,0), -15vh, 0); opacity: 0; }
  }`;
  const style = document.createElement("style");
  style.id = "diwali-sparkles-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "diwali-sparkles",
  name: "Diwali Sparkles",
  triggers: [{ type: "range", monthStart: 10, dayStart: 20, monthEnd: 11, dayEnd: 20 }],
  params: { ...DEF },
  apply(root, common, options){
    injectCSS();
    const cfg = { ...DEF, ...(options||{}) };
    let alive = true;
    const timers = new Set();

    function spawn(){
      if (!alive) return;
      const s = document.createElement("div");
      const size = rand(cfg.sizeMin, cfg.sizeMax);
      const startX = rand(0, window.innerWidth);
      const sway = (Math.random()-0.5) * 120 * cfg.randomness;
      const endX = startX + sway;
      const duration = rand(cfg.riseMin, cfg.riseMax);
      s.style.position = "fixed";
      s.style.left = `${startX}px`;
      s.style.bottom = `-10vh`;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.borderRadius = "50%";
      s.style.background = cfg.color;
      s.style.boxShadow = cfg.trail ? `0 0 10px ${cfg.color}, 0 0 20px ${cfg.color}` : "none";
      s.style.pointerEvents = "none";
      s.style.animation = `spark-rise ${duration}s linear forwards`;
      s.style.setProperty("--x", "0px");
      s.style.setProperty("--xEnd", `${endX - startX}px`);
      s.className = "diwali-spark";

      root.appendChild(s);
      const t = setTimeout(()=>{ s.remove(); timers.delete(t); }, duration*1000+50);
      timers.add(t);
    }

    const intervalMs = Math.max(16, 2000 / Math.max(1, cfg.density));
    const interval = setInterval(spawn, intervalMs);
    timers.add(interval);
    for (let i=0; i<Math.min(60, Math.floor(cfg.density/2)); i++) spawn();

    return () => {
      alive = false;
      for (const t of timers) clearTimeout(t);
      timers.clear();
      root.querySelectorAll(".diwali-spark").forEach(n => n.remove());
    };
  }
};
