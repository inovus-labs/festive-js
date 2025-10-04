
# 🤝 Contributing to Festive.js

Thanks for your interest in **Festive.js**!  
This project was started by **Inovus Labs** as an open-source initiative for **Hacktoberfest 2025**.  
By the end of this Hacktoberfest season, we aim to publish a **stable SDK and theme gallery** built by the community.


## 📜 Contribution Streams

You can contribute in two main ways:

### 1. 🎨 Contribute a Theme
- Add a festive/cultural theme (Diwali, Halloween, Christmas, Easter, New Year, etc.)
- **Basic Rules for Themes:**
  - **Scalability**: Themes must be scalable and adjust on all device sizes and resolutions
  - **Performance**: Must not affect the overall purpose and performance of the website
  - **Non-blocking**: Overlay should not be a blocker for the normal user to use the website for which it is intended for
  - **Technical Requirements**:
    - Minimal code, no third-party libraries  
    - Pure Vanilla JS, no CSS frameworks  
    - Must be lightweight (ideally <10KB minified)  
    - Must be non-intrusive and subtle
    - Must not block host site interactivity (`pointer-events: none`)  
    - Must return a cleanup function in `apply()`  
- Structure:
  ```
  /themes/your-theme/
    └── index.js
  ```

### 2. ⚙️ Contribute to Core
- Improve the Festive.js SDK:
  - Performance optimizations
  - Improve docs, playground, demo platform
- Build peripheral tools:
  - Bookmarklet to test on any live site
  - Web playground with sharable configs
  - Showcase gallery auto-indexer


## 🗂️ Theme Structure

### index.js
```js
export default {
  key: "diwali-crackers",
  name: "Diwali Crackers (Fireworks)",
  triggers: [...],
  params: { ...defaults },
  apply(root, common, options) {
    // Theme implementation here
    // Use `root` as container, `common` for shared utils, `options` for params
    // Example: create canvas, start animation loop, etc.
    // Must return a cleanup function in `apply()`
    return () => { /* cleanup */ };
  }
};
```

<!-- 
## 🧪 Testing a Theme

1. Run the playground:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/examples/index.html`.

2. Force your theme:
   ```js
   Festive.init({ forceTheme: "your-theme-key" });
   ```

3. Verify:
   - ✅ Runs smoothly (even on low-end devices)  
   - ✅ Does not block host clicks/scrolls  
   - ✅ Cleans up correctly when `destroy()` is called   -->


## 🛠️ Submitting a PR

1. Fork this repo, create a branch.
2. Add your theme or core changes.
3. Test locally (`npm run build && npm run dev`).
4. Update docs/README if adding a theme.
5. Submit a Pull Request with:
   - Description of changes
   - Screenshots or Video (if applicable)


## 🌍 Hacktoberfest Notes

- This repo is registered for **Hacktoberfest 2025** 🎉  
- Contributions of both types (themes or core improvements) count  
- Please keep PRs **meaningful and minimal** — no spam  


## 🙏 Code of Conduct
We follow a **be kind, be respectful** policy. Contributions should align with the project’s values of open collaboration.

✨ Let’s build a global library of lightweight festive themes together!
