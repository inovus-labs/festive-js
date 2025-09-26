
# 🎉 Festive.js

A **tiny, zero-dependency JavaScript library** that adds seasonal overlays (Christmas snow ❄️, Diwali crackers 🎆, etc.) to websites.

**Lightweight** • **Non-intrusive** • **Zero dependencies** • **Auto-triggering**

## ✨ Features

- 📦 **Drop-in script** - Just include and initialize
- 🎨 **Multiple themes** - Christmas, Diwali, and more
- ⚡ **Tiny footprint** - Under 10KB minified
- 🖼️ **Non-intrusive** - Won't break your site's design
- 🔧 **Configurable** - Customize colors, density, and behavior
- 📅 **Smart activation** - Auto-activates based on dates
- 🌐 **Universal** - Works with any website or framework


## 🚀 Quick Start

### Installation

#### Via npm
```bash
npm install festive-js
```

#### Via CDN (unpkg)
```html
<script src="https://unpkg.com/festive-js/core.min.js"></script>
<script>
  Festive.init(); // auto-pick theme by date
</script>
```

#### Via CDN (jsDelivr)
```html
<script src="https://cdn.jsdelivr.net/npm/festive-js/core.min.js"></script>
<script>
  Festive.init(); // auto-pick theme by date
</script>
```

### Usage

#### ES Modules
```javascript
import Festive from 'festive-js';

// Auto-pick theme by date
Festive.init();

// Or force a specific theme
Festive.init({ forceTheme: 'snowfall' });
```

#### CommonJS
```javascript
const Festive = require('festive-js');
Festive.init();
```

## ⚙️ Configuration

### Force a specific theme
```javascript
Festive.init({ 
  forceTheme: "snowfall" 
});
```

### Customize theme parameters
```javascript
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
```

### Santa theme example
```javascript
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

## � Documentation & Examples

For detailed documentation, theme gallery, playground, and contribution guidelines, visit the [**GitHub repository**](https://github.com/inovus-labs/festive-js).


## 📝 License

MIT License - see [LICENSE](https://github.com/inovus-labs/festive-js/blob/master/LICENSE) for details.

---

**Made with ❤️ by [Inovus Labs](https://github.com/inovus-labs)**