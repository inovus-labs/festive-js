
# festive-js

**Plug-and-play Web SDK** for festive overlays. Auto-discovers themes at build time via Vite `import.meta.glob`.
- Themes included: **Diwali Sparkles**, **Christmas Snow**.

## Quick test (prebuilt placeholder)
Open `examples/index.html`. (For full functionality, run a build to regenerate `standalone/festive-js.js` from the themes folder.)

## Build your own standalone (auto-registers all themes)
```bash
npm install
npm run build
# Outputs: standalone/festive-js.js  (global: SeasonalOverlays)
```

## Use on a site
```html
<script src="standalone/festive-js.js"></script>
<script>
  SeasonalOverlays.init(); // auto choose by date
  // SeasonalOverlays.init({ forceTheme: "diwali-sparkles" });
</script>
```

## Add a new theme (no code changes needed)
Create `themes/<your-key>/theme.js` that default-exports:
```js
export default {
  key: "your-key",
  name: "Nice Name",
  triggers: [{ type: "date", month: 1, day: 1 }], // optional, used by your picker if you add one
  params: { /* optional doc of expected options */ },
  apply(root, common, options){
    // mount DOM into root (fixed container). return a cleanup() fn.
    return () => { /* cleanup */ };
  }
};
```
Run `npm run build` again. The new theme will be included automatically.
