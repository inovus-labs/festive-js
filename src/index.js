const _registry = new Map();
let _cleanup = null;
let _container = null;

export function registerTheme(theme) {
  if (!theme || !theme.key) throw new Error("[festive-js] theme must have a unique `key`");
  _registry.set(theme.key, theme);
}
export function unregisterTheme(key) { _registry.delete(key); }
export function clearThemes() { _registry.clear(); }
export function getRegisteredThemes() { return Array.from(_registry.values()); }

function _inRange(date, t) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const cur = m * 100 + d;
  const start = (Number(t.monthStart ?? 1) * 100) + Number(t.dayStart ?? 1);
  const end   = (Number(t.monthEnd   ?? 12) * 100) + Number(t.dayEnd   ?? 31);
  if (start <= end) return cur >= start && cur <= end;
  return cur >= start || cur <= end;
}
function _matches(date, trig) {
  if (!trig || !trig.type) return false;
  if (trig.type === "always") return true;
  if (trig.type === "date")  {
    const m = date.getMonth() + 1, d = date.getDate();
    return m === Number(trig.month) && d === Number(trig.day);
  }
  if (trig.type === "range") return _inRange(date, trig);
  return false;
}

export function pickTheme(date = new Date(), options = {}) {
  if (options.forceTheme && _registry.has(options.forceTheme)) {
    return _registry.get(options.forceTheme);
  }
  for (const theme of _registry.values()) {
    const triggers = theme.triggers || [];
    for (const t of triggers) if (_matches(date, t)) return theme;
  }
  return null;
}

function _ensureContainer() {
  if (_container) return _container;
  const el = document.createElement("div");
  el.id = "festive-js-root";
  el.setAttribute("aria-hidden", "true");
  el.style.position = "fixed";
  el.style.left = "0"; el.style.top = "0";
  el.style.width = "100vw"; el.style.height = "100vh";
  el.style.pointerEvents = "none";
  el.style.zIndex = "2147483647";
  document.documentElement.appendChild(el);
  _container = el;
  return el;
}
export function destroy() {
  if (_cleanup) { try { _cleanup(); } catch {} _cleanup = null; }
  if (_container) { _container.remove(); _container = null; }
}
export function init(options = {}) {
  destroy();
  const root = _ensureContainer();
  const common = {
    primaryColor: options.primaryColor || "#0ea5e9",
    secondaryColor: options.secondaryColor || "#f43f5e",
    primaryFont: options.primaryFont || "system-ui, sans-serif",
    secondaryFont: options.secondaryFont || "serif"
  };
  const theme = pickTheme(new Date(), options);
  if (!theme) return { applied:false, reason:"no-theme" };
  const perTheme = (options.themes && options.themes[theme.key]) || {};
  const maybeCleanup = theme.apply(root, common, perTheme);
  if (typeof maybeCleanup === "function") _cleanup = maybeCleanup;
  return { applied:true, theme: theme.key };
}

const Festive = { init, destroy, registerTheme, unregisterTheme, clearThemes, getRegisteredThemes, pickTheme };
export default Festive;
