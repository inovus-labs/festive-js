

/**
 * 🦇 Halloween Bats Theme — Ultimate Edition (Clean Version)
 * -------------------------------------------------------
 * A complete festive overlay celebrating Halloween with spooky bats,
 * glowing moon, drifting fog, and twinkling stars.
 * 
 * Author: Anjana Rajesh 🎃
 * Version: 3.5 (Clean)
 * -------------------------------------------------------
 */

(function () {
  // 🎃 Utilities
  const random = (min, max) => Math.random() * (max - min) + min;

  // 🧙 Helper: create and style element
  function createElement(tag, style = {}, text = "") {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    Object.assign(el.style, style);
    document.body.appendChild(el);
    return el;
  }

  // 🪄 Helper: inject style sheet text
  function injectStyle(cssText) {
    const s = document.createElement("style");
    s.textContent = cssText;
    document.head.appendChild(s);
    return s;
  }

  // 🕯️ Fade helpers
  function fadeIn(el, duration = 1000) {
    el.style.opacity = 0;
    el.style.transition = `opacity ${duration}ms ease-in-out`;
    setTimeout(() => (el.style.opacity = 1), 50);
  }

  function fadeOut(el, duration = 1000, removeAfter = true) {
    el.style.transition = `opacity ${duration}ms ease-in-out`;
    el.style.opacity = 0;
    if (removeAfter) setTimeout(() => el.remove(), duration + 100);
  }

  // 🧱 Core registry (mock if Festive missing)
  const Festive =
    window.Festive ||
    (window.Festive = {
      registeredThemes: {},
      registerTheme(name, data) {
        this.registeredThemes[name] = data;
      },
    });

  // 🎃 Register the Halloween Bats theme
  Festive.registerTheme("halloween-bats", {
    name: "Halloween Bats (Ultimate)",
    start: "2025-10-01",
    end: "2025-10-31",

    init(params = {}) {
      const config = {
        batCount: params.batCount || 20,
        fogCount: params.fogCount || 4,
        starCount: params.starCount || 100,
        enableMoon: params.enableMoon ?? true,
        enableStars: params.enableStars ?? true,
        enableFog: params.enableFog ?? true,
        enablePumpkins: params.enablePumpkins ?? true,
        enableSound: params.enableSound ?? false,
        zIndex: 9999,
      };

      const elements = {
        bats: [],
        fogs: [],
        stars: [],
        pumpkins: [],
        styles: [],
        overlay: null,
        moon: null,
        sound: null,
      };

      console.log("🎃 Initializing Halloween Bats theme...");

      // 🌑 Overlay
      const overlay = createElement("div", {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle at top, rgba(20,20,40,0.8), rgba(0,0,0,0.95))",
        zIndex: config.zIndex - 1,
        pointerEvents: "none",
        opacity: 0,
      });
      fadeIn(overlay, 1500);
      elements.overlay = overlay;

      // 🌕 Moon
      if (config.enableMoon) {
        const moon = createElement("div", {
          position: "fixed",
          top: "10vh",
          right: "10vw",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #fffde4, #e0c066)",
          boxShadow: "0 0 50px 10px rgba(255, 255, 200, 0.6)",
          opacity: 0.9,
          zIndex: config.zIndex,
          pointerEvents: "none",
        });
        fadeIn(moon, 2000);
        elements.moon = moon;
      }

      // ✨ Stars
      if (config.enableStars) {
        for (let i = 0; i < config.starCount; i++) {
          const star = createElement("div", {
            position: "fixed",
            top: `${random(0, 100)}vh`,
            left: `${random(0, 100)}vw`,
            width: `${random(1, 3)}px`,
            height: `${random(1, 3)}px`,
            background: "white",
            borderRadius: "50%",
            opacity: random(0.2, 0.8),
            zIndex: config.zIndex,
          });

          const twinkle = `
            @keyframes twinkle-${i} {
              0%,100%{opacity:${random(0.3, 0.9)};}
              50%{opacity:${random(0.1, 1)};}
            }
          `;
          const style = injectStyle(twinkle);
          star.style.animation = `twinkle-${i} ${random(2, 5)}s infinite ease-in-out`;

          elements.stars.push(star);
          elements.styles.push(style);
        }
      }

      // 🌫️ Fog
      if (config.enableFog) {
        for (let i = 0; i < config.fogCount; i++) {
          const fog = createElement("div", {
            position: "fixed",
            bottom: "0",
            left: `${random(0, 100)}vw`,
            width: `${random(300, 600)}px`,
            height: `${random(100, 200)}px`,
            background: "rgba(255,255,255,0.07)",
            filter: "blur(40px)",
            borderRadius: "50%",
            zIndex: config.zIndex - 1,
            opacity: 0.5,
          });

          const fogAnim = `
            @keyframes fog-${i} {
              0% { transform: translateX(0px); opacity: 0.4; }
              50% { transform: translateX(${random(-50, 50)}vw); opacity: 0.9; }
              100% { transform: translateX(0px); opacity: 0.4; }
            }
          `;
          const style = injectStyle(fogAnim);
          fog.style.animation = `fog-${i} ${random(20, 40)}s infinite linear`;
          elements.fogs.push(fog);
          elements.styles.push(style);
        }
      }

      // 🦇 Bats
      for (let i = 0; i < config.batCount; i++) {
        const bat = createElement(
          "div",
          {
            position: "fixed",
            left: `${random(0, 100)}vw`,
            top: `${random(0, 100)}vh`,
            fontSize: `${random(18, 36)}px`,
            opacity: random(0.5, 0.9),
            zIndex: config.zIndex,
            pointerEvents: "none",
          },
          "🦇"
        );

        const rotate = random(-15, 15);
        const flyAnim = `
          @keyframes fly-${i} {
            0% { transform: translate(0,0) rotate(${rotate}deg); }
            25% { transform: translate(${random(-25,25)}vw, ${random(-10,10)}vh) rotate(${rotate}deg); }
            50% { transform: translate(${random(-40,40)}vw, ${random(-20,20)}vh) rotate(${rotate}deg); }
            75% { transform: translate(${random(-30,30)}vw, ${random(-5,5)}vh) rotate(${rotate}deg); }
            100% { transform: translate(0,0) rotate(${rotate}deg); }
          }
          @keyframes flap-${i} {
            0% { transform: scaleX(1) rotate(${rotate}deg); }
            100% { transform: scaleX(1.3) rotate(${rotate + random(-5,5)}deg); }
          }
        `;
        const style = injectStyle(flyAnim);
        bat.style.animation = `fly-${i} ${random(8, 14)}s infinite linear, flap-${i} ${random(0.5, 1)}s infinite alternate ease-in-out`;
        elements.bats.push(bat);
        elements.styles.push(style);
      }

      // 🎃 Pumpkins
      if (config.enablePumpkins) {
        for (let i = 0; i < 6; i++) {
          const pumpkin = createElement(
            "div",
            {
              position: "fixed",
              left: `${random(0, 100)}vw`,
              top: `${random(0, 100)}vh`,
              fontSize: `${random(24, 48)}px`,
              opacity: 0.8,
              zIndex: config.zIndex,
            },
            "🎃"
          );

          const floatAnim = `
            @keyframes pumpkin-float-${i} {
              0%,100% { transform: translateY(0); }
              50% { transform: translateY(${random(-10, 15)}px); }
            }
          `;
          const style = injectStyle(floatAnim);
          pumpkin.style.animation = `pumpkin-float-${i} ${random(4, 8)}s infinite ease-in-out`;
          elements.pumpkins.push(pumpkin);
          elements.styles.push(style);
        }
      }

      // 🔊 Optional ambience
      if (config.enableSound) {
        const sound = new Audio("https://cdn.pixabay.com/audio/2022/10/22/audio_2e2e408b15.mp3");
        sound.loop = true;
        sound.volume = 0.2;
        sound.play().catch(() => console.warn("🔇 Autoplay blocked."));
        elements.sound = sound;
      }

      // 🧹 Cleanup
      this.cleanup = () => {
        console.log("🧹 Cleaning up Halloween Bats theme...");
        [...elements.bats, ...elements.fogs, ...elements.stars, ...elements.pumpkins, elements.moon, elements.overlay].forEach(
          (el) => el && fadeOut(el, 1000)
        );
        elements.styles.forEach((style) => style.remove());
        if (elements.sound) elements.sound.pause();
      };
    },
  });

  // 🎃 Auto-run in October
  (function autoActivateHalloween() {
    const now = new Date();
    const month = now.getMonth(); // 0 = Jan, 9 = Oct
    const theme = Festive.registeredThemes["halloween-bats"];
    if (!theme) return;

    if (month === 9) {
      console.log("🦇 Activating Halloween Bats theme for October!");
      theme.init();
    } else {
      console.log("🍂 Not October — skipping Halloween theme.");
      if (theme.cleanup) theme.cleanup();
    }
  })();
})();