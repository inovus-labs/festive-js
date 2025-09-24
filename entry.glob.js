import Festive, { registerTheme } from "./src/index.js";

const modules = import.meta.glob("./themes/**/theme.js", { eager: true });
for (const path in modules) {
  const mod = modules[path];
  const theme = mod?.default;
  if (theme?.key) registerTheme(theme);
}

export default Festive;
