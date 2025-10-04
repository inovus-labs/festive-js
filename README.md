
# 🎉 Festive.js

Festive.js is a **tiny, zero-dependency Web SDK** that adds seasonal overlays (Diwali crackers 🎆, Christmas snow ❄️, etc.) to websites.  

It is designed to be **minimal, lightweight, and non-intrusive** — overlays should *celebrate*, not interfere. They must never harm the aesthetics, performance, or functionality of the host site.


## 🌱 The Story

This project was born at **Inovus Labs** — a student innovation hub where we experiment, build, and open-source our learnings.  
We noticed that during festivals and events, websites often add heavy, distracting animations that ruin UX. We asked:  

👉 *Can we make festive websites truly festive, without compromising their design or performance?*  

That’s how **Festive.js** was started:  
- A lightweight overlay SDK
- Vanilla JS, no third-party libraries, no CSS frameworks  
- Subtle, configurable, celebratory effects  

Now we are opening this project up for the community, starting with **Hacktoberfest 2025**.


## 🎯 Why We’re Doing This

- To create an **open gallery of lightweight festive themes** anyone can drop into their site.  
- To show how **community contributions** can make a project vibrant.  
- To give new developers a chance to contribute to a real open-source SDK.  
- To demonstrate **clean, non-intrusive design principles** in frontend/web SDK development.


## 🗺️ Roadmap

We are running this project as an **Inovus Labs Hacktoberfest Initiative**:

1. **October 2025 (Hacktoberfest Season)**
   - Kick off project as open source  
   - Accept community contributions (themes + core improvements)  
   - Build showcase, docs site, and demo platform  

2. **End of October**
   - Finalize and merge contributions
   - Publish **v1.0.0** with a stable SDK + official theme gallery

3. **Beyond Hacktoberfest**
   - Add more seasonal/cultural themes
   - Expand SDK capabilities (mount targets, presets, mobile-first optimizations)
   - Build peripheral platforms (bookmarklets, theme generator, gallery site)


<!-- ## 🍂 Hacktoberfest & How to Contribute

### What is Hacktoberfest?
[Hacktoberfest](https://hacktoberfest.com/) is an annual celebration of open source.  
Every October, developers from around the world contribute to open projects, improve codebases, and grow as a community.  
Submitting **4 pull requests** during Hacktoberfest makes you eligible for rewards (like digital badges, swag, or trees planted 🌱). -->


## 🚀 Contribution Streams

You can contribute to Festive.js in **two ways**:

### 1. 🎨 Contribute a Theme
- Add a new festive theme (Diwali, Halloween, Independence Day, New Year, Easter, local cultural festivals, etc.)
- Keep it **lightweight, minimal, and non-intrusive**
- Each theme has:
  - `index.js` → theme implementation with metadata, params, auto-trigger rules, and effect implementation

### 2. ⚙️ Contribute to Core
- Improve SDK internals (performance optimizations, cleanup improvements)
- Add new **capabilities**:
  - Mount overlays inside a target container  
  - Theme parameter presets  
  - Mobile-friendly rendering tweaks  
- Build **peripheral platforms**:
  - Bookmarklet for testing on any site
  - Docs & showcase website improvements
  - Playground for parameter tweaking

## ✨ Features (Current)

- 📦 **Drop-in script** via CDN
- 🎨 **Themes** auto-activate by date or can be forced
- ⚡ **Lightweight** — no libraries, no CSS frameworks
- 🖼️ **Non-intrusive** overlays (no DOM breakage)
- 🔧 **Configurable** params per theme
- 📅 **Auto-trigger** (e.g. Diwali Oct 20–Nov 20)


## 🚀 Getting Started

> **Note**: During Hacktoberfest 2025, the `themes` branch is the default branch. All theme contributions should be made to this branch.

### Using CDN
To quickly add Festive.js to your site, include the script from the CDN and initialize:
```html
<script src="https://unpkg.com/festive-js"></script>
<script>
  Festive.init(); // auto-pick theme by date
</script>
```

### Force a theme
To force a specific theme (e.g. for testing), use:
```html
Festive.init({ forceTheme: "christmas-snow" });
// or
Festive.init({ forceTheme: "snowfall" });
// or
Festive.init({ forceTheme: "santa" });
```

### Customize theme params
To customize parameters for a theme, pass them in the `themes` option:
```html
Festive.init({
  forceTheme: "snowfall",
  themes: {
    "snowfall": { 
      density: 150, 
      snowflakeChar: "✦", 
      color: "#87ceeb",
      driftRange: 30 
    }
  }
});

// Santa theme example
Festive.init({
  forceTheme: "santa",
  themes: {
    "santa": {
      santaSize: 200,
      unicycleDuration: 10,
      sledDuration: 8,
      showOverlay: true
    }
  }
});
```


<!-- ## 📖 Docs & Showcase
👉 Visit [festive-js demo](https://inovus-labs.github.io/festive-js) for:
- Usage docs  
- Theme gallery  
- Playground to tweak params  
- Demo page to preview on your own site   -->


## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines. Also check out our amazing contributors in [CONTRIBUTORS.md](./CONTRIBUTORS.md).

## 📝 License
This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.