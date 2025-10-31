const DEF = {
  starfishEmoji: "⭐",
  shellEmoji: "🐚",
  helpEmoji: "🛟",
  boatEmoji: "⛵",
  utilEmojis: ["🍹", "🕶️", "🏀"],

  starfishPositions: [
    { top: "10%", left: "15%" },
    { top: "25%", left: "45%" },
    { top: "50%", left: "30%" },
    { top: "40%", left: "70%" },
    { top: "15%", left: "80%" }
  ],
  shellPositions: [
    { top: "42%", left: "18%" },
    { top: "45%", left: "73%" },
    { top: "20%", left: "88%" },
    { top: "34%", left: "32%" },
    { top: "50%", left: "60%" }
  ],
  helpPositions: [
    { top: "50%", right: "16.5%" },
    { top: "50%", right: "15%" },
    { top: "50%", left: "13%" }
  ],
  utilPositions: [
    { top: "30%", left: "5%", emojiIndex: 0 },
    { top: "40%", left: "7%", emojiIndex: 1 },
    { top: "20%", left: "9%", emojiIndex: 2 }
  ],

  boat1Top: "-10%",
  boat2Top: "-5%",
  boat2Left: "-5%",
  boatAnimationDuration: 15, 
  palmRight: "10%",
  palmBottom: "20%",

  showCarpet: true,
  showPalms: true,
  showBoats: true
};

function injectCSS() {
  if (document.getElementById("beach-css")) return;

  const css = `
.beach {
  position: fixed !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  width: 100vw !important;
  height: 20vh !important;
  bottom: 0 !important;
  left: 0 !important;
  background-color: transparent !important;
  border: none !important;
  z-index: 99989 !important;
  pointer-events: none !important;
}

.beach, .beach * {
  pointer-events: none !important;
}

.beach-ocean {
  position: absolute;
  background-color: #529ff8;
  width: 100%;
  height: 40%;
  left: 0;
  top : 0;
  z-index: 99991;
}

.beach-sand {
  position: absolute;
  background-color: #e2ca76;
  width: 100%;
  height: 60%;
  left: 0;
  bottom: 0;
  z-index: 99990;
}

.ocean-blue {
  width: 100%;
  height: 50%;
  position: absolute;
  background-color: #529ff8;
  left: 0;
  bottom: 0;
  animation: waves 4s ease-in-out infinite;
}

.ocean-white {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.5vh;
  background: linear-gradient(to bottom, #ffffff 0%, #ffffffcc 40%, transparent 100%);
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}

.palm1{
  width: 9vw;
  height: auto;
  animation: sway1 1.5s ease-in-out infinite alternate;
  transform-origin: center bottom;
}
.palm2 {
  width: 9vw;
  height: auto;
  animation: sway2 2s ease-in-out infinite alternate;
  transform-origin: center bottom;
}

.beach-palm {
  position: absolute;
  right: 10%;
  bottom: 20%;
  z-index: 99999;
}

.beach-boat {
  position: absolute;
  font-size: 2rem;
  z-index: 99998;
}

.boat1{
  top: -10%;
  animation: boat-motion 15s linear infinite;
}

.boat2{
  top: -5%;
  left: -5%;
  animation: boat-motion 15s linear 1.5s infinite;  
}

.beach-starfish {
  position: absolute;
  font-size: 1.1rem;
  animation: star-wiggle 4s ease-in-out infinite alternate;
  z-index: 99992;
}

.beach-shell {
  position: absolute;
  font-size: 1.2rem;
  animation: star-wiggle 4s ease-in-out infinite alternate;
  z-index: 99992;
}

.beach-help{
  position: absolute;
  font-size: 1.7rem;
  animation: bob 3s ease-in-out infinite alternate;
  z-index: 99993;
}

.beach-carpet{
  position: absolute;
  top: 30%;
  left: 5%;
  transform: rotate(-10deg);
  z-index: 99992;
}

.beach-util{
  position: absolute;
  font-size: 1.8rem;
  animation: star-wiggle 4s ease-in-out infinite alternate;
  z-index: 99993;
}

/* Animations */
@keyframes star-wiggle {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(20deg) scale(1.1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

@keyframes sway1 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(10deg); }
}
@keyframes sway2 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-10deg); }
}

@keyframes waves {
  0% { margin-bottom: 0vh; }
  50% { margin-bottom: -3vh; }
  100% { margin-bottom: 0vh; }
}

@keyframes boat-motion {
  0%{
    transform: translateX(-2vw);
  }
  100%{
    transform: translateX(102vw);
  }
}

@keyframes bob {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ocean-blue, .palm1, .palm2, .beach-starfish, .beach-shell, .beach-help, .beach-util, .boat1, .boat2 {
    animation: none !important;
  }
}
  `;

  const style = document.createElement("style");
  style.id = "beach-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "beach-day",
  name: "Beach Scene",
  triggers: [],
  params: { ...DEF },

  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const elements = [];

    function createAndTrack(tag, className, parent = null) {
      const el = document.createElement(tag);
      if (className) el.className = className;
      // defensive inline non-blocking
      el.style.pointerEvents = "none";
      elements.push(el);
      (parent || container).appendChild(el);
      return el;
    }

    const container = document.createElement("div");
    container.className = "beach";
    container.style.pointerEvents = "none";
    container.setAttribute("aria-hidden", "true");
    root.appendChild(container);
    elements.push(container);

    const beachOcean = createAndTrack("div", "beach-ocean", container);
    const oceanBlue = createAndTrack("div", "ocean-blue", beachOcean);
    const oceanWhite = createAndTrack("div", "ocean-white", oceanBlue);
    const beachSand = createAndTrack("div", "beach-sand", container);
    cfg.starfishPositions.forEach(pos => {
      const el = createAndTrack("div", "beach-starfish", beachSand);
      el.style.position = "absolute";
      if (pos.top) el.style.top = pos.top;
      if (pos.left) el.style.left = pos.left;
      if (pos.right) el.style.right = pos.right;
      el.innerText = cfg.starfishEmoji;
    });
    cfg.shellPositions.forEach(pos => {
      const el = createAndTrack("div", "beach-shell", beachSand);
      el.style.position = "absolute";
      if (pos.top) el.style.top = pos.top;
      if (pos.left) el.style.left = pos.left;
      if (pos.right) el.style.right = pos.right;
      el.innerText = cfg.shellEmoji;
    });
    cfg.helpPositions.forEach(pos => {
      const el = createAndTrack("div", "beach-help", beachSand);
      el.style.position = "absolute";
      if (pos.top) el.style.top = pos.top;
      if (pos.left) el.style.left = pos.left;
      if (pos.right) el.style.right = pos.right;
      el.innerText = cfg.helpEmoji;
    });

    if (cfg.showCarpet) {
      const carpetWrap = createAndTrack("div", "beach-carpet", beachSand);
      carpetWrap.style.position = "absolute";
      carpetWrap.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="54" viewBox="0 0 120 54" style="width: 7vw; height: auto">
          <rect x="0" y="0" width="120" height="9" fill="#ff7043" />
          <rect x="0" y="9" width="120" height="9" fill="#fff3e0" />
          <rect x="0" y="18" width="120" height="9" fill="#ff7043" />
          <rect x="0" y="27" width="120" height="9" fill="#fff3e0" />
          <rect x="0" y="36" width="120" height="9" fill="#ff7043" />
          <rect x="0" y="45" width="120" height="9" fill="#fff3e0" />
          <rect x="0" y="0" width="120" height="54" fill="none" stroke="#e64a19" stroke-width="2.4" rx="10" ry="10" />
        </svg>
      `;
    }

    cfg.utilPositions.forEach((p, idx) => {
      const el = createAndTrack("div", "beach-util", beachSand);
      el.style.position = "absolute";
      if (p.top) el.style.top = p.top;
      if (p.left) el.style.left = p.left;
      const emoji = cfg.utilEmojis[p.emojiIndex ?? idx] ?? cfg.utilEmojis[0];
      el.innerText = emoji;
    });

    if (cfg.showPalms) {
      const palmWrap = createAndTrack("div", "beach-palm", container);
      palmWrap.style.position = "absolute";
      palmWrap.style.right = cfg.palmRight;
      palmWrap.style.bottom = cfg.palmBottom;
      palmWrap.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.1 122.88" class="palm1">
          <path fill="#9a5d26" d="M55.38,47.51C63.81,73,60,97.61,51.86,122.88H68.29c6.22-40.21.87-57.57-5.35-73.26l-7.56-2.11Z"/>
          <path fill="#3e9c2a" d="M30.15,103.09c2.21-25.86,6.71-47.15,25.23-55.58l7.56,2.11C74.36,56.8,84.54,72.29,94.26,96.9c13.68-25.47,5-44.21-27.47-56.37,18.55-5.76,35.95,1.61,52.31,16-8.73-33-33.66-40.93-55.94-22.11C66.19,10.87,56.47,5.2,43.43,0,49.56,9.35,54.2,19.08,53.51,30.28,33.4,11.82,16.61,18.65,1.16,34.92,16,31.46,31.37,30,44.33,38.68,21.06,35.74,8,48.85,0,66.06c9.73-8.92,18.91-14.7,28.63-15.75-10.21,18.52-5.7,34.86,1.56,52.82Z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.1 122.88" class="palm2">
          <path fill="#9a5d26" d="M55.38,47.51C63.81,73,60,97.61,51.86,122.88H68.29c6.22-40.21.87-57.57-5.35-73.26l-7.56-2.11Z"/>
          <path fill="#3e9c2a" d="M30.15,103.09c2.21-25.86,6.71-47.15,25.23-55.58l7.56,2.11C74.36,56.8,84.54,72.29,94.26,96.9c13.68-25.47,5-44.21-27.47-56.37,18.55-5.76,35.95,1.61,52.31,16-8.73-33-33.66-40.93-55.94-22.11C66.19,10.87,56.47,5.2,43.43,0,49.56,9.35,54.2,19.08,53.51,30.28,33.4,11.82,16.61,18.65,1.16,34.92,16,31.46,31.37,30,44.33,38.68,21.06,35.74,8,48.85,0,66.06c9.73-8.92,18.91-14.7,28.63-15.75-10.21,18.52-5.7,34.86,1.56,52.82Z"/>
        </svg>
      `;
    }

    if (cfg.showBoats) {
      const boat1 = createAndTrack("div", "beach-boat boat1", container);
      boat1.style.top = cfg.boat1Top;
      boat1.innerText = cfg.boatEmoji;

      const boat2 = createAndTrack("div", "beach-boat boat2", container);
      boat2.style.top = cfg.boat2Top;
      boat2.style.left = cfg.boat2Left;
      boat2.innerText = cfg.boatEmoji;
    }

    return () => {
      alive = false;
      elements.slice().forEach(element => {
        if (element && element.parentNode) element.remove();
      });
      elements.length = 0;
    };
  }
};