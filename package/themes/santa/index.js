const DEF = {
  santaImage: "https://maps.gstatic.com/mapfiles/santatracker/v201612140703/images/village_2x.gif",
  unicycleImage: "https://maps.gstatic.com/mapfiles/santatracker/v201612140703/scenes/dorf/img/easteregg-unicycle.svg",
  sledImage: "https://maps.gstatic.com/mapfiles/santatracker/v201612140703/scenes/dorf/img/easteregg-snowmobile2.svg",
  overlayImage: "https://static1.squarespace.com/static/56fe5ba420c64743836b25e3/t/58592c5cf5e23119f38d52f5/1482239070299/snowysceneunderlay1.png",
  santaSize: 120,
  unicycleSize: 66,
  sledSize: 50,
  unicycleDuration: 18,
  sledDuration: 12,
  showOverlay: true,
  santaBottom: -25
};

function injectCSS() {
  if (document.getElementById("santa-css")) return;
  
  const css = `
    .santa-unicycle {
      position: fixed !important;
      bottom: 0px;
      left: 0px;
      z-index: 99999;
      pointer-events: none;
      animation: santa-slide linear infinite;
    }

    .santa-sled {
      position: fixed !important;
      bottom: 0px;
      right: 0px;
      z-index: 99999;
      pointer-events: none;
      animation: santa-slide-right linear infinite;
    }

    .santa-character {
      position: fixed !important;
      bottom: -25px;
      left: 50vw;
      margin-left: -60px;
      z-index: 999999;
      pointer-events: none;
    }

    .santa-overlay {
      position: fixed !important;
      bottom: -10px;
      left: 0px;
      width: 100vw;
      z-index: 2;
      pointer-events: none;
    }

    @keyframes santa-slide {
      from { margin-left: -2vw; }
      to { margin-left: 102vw; }
    }

    @keyframes santa-slide-right {
      from { margin-right: -2vw; }
      to { margin-right: 102vw; }
    }

    @-webkit-keyframes santa-slide {
      from { margin-left: -2vw; }
      to { margin-left: 102vw; }
    }

    @-webkit-keyframes santa-slide-right {
      from { margin-right: -2vw; }
      to { margin-right: 102vw; }
    }

    @-moz-keyframes santa-slide {
      from { margin-left: -2vw; }
      to { margin-left: 102vw; }
    }

    @-moz-keyframes santa-slide-right {
      from { margin-right: -2vw; }
      to { margin-right: 102vw; }
    }

    @-ms-keyframes santa-slide {
      from { margin-left: -2vw; }
      to { margin-left: 102vw; }
    }

    @-ms-keyframes santa-slide-right {
      from { margin-right: -2vw; }
      to { margin-right: 102vw; }
    }
  `;
  
  const style = document.createElement("style");
  style.id = "santa-css";
  style.textContent = css;
  document.head.appendChild(style);
}

export default {
  key: "santa",
  name: "Santa's Journey",
  triggers: [{
    type: "range",
    monthStart: 12,
    dayStart: 15,
    monthEnd: 12,
    dayEnd: 31
  }],
  params: { ...DEF },
  apply(root, common, options) {
    injectCSS();
    const cfg = { ...DEF, ...(options || {}) };
    let alive = true;
    const elements = [];

    // Create unicycle element
    const unicycle = document.createElement('img');
    unicycle.className = 'santa-unicycle';
    unicycle.src = cfg.unicycleImage;
    unicycle.style.height = `${cfg.unicycleSize}px`;
    unicycle.style.animationDuration = `${cfg.unicycleDuration}s`;
    elements.push(unicycle);
    root.appendChild(unicycle);

    // Create sled element
    const sled = document.createElement('img');
    sled.className = 'santa-sled';
    sled.src = cfg.sledImage;
    sled.style.height = `${cfg.sledSize}px`;
    sled.style.animationDuration = `${cfg.sledDuration}s`;
    elements.push(sled);
    root.appendChild(sled);

    // Create Santa element
    const santa = document.createElement('img');
    santa.className = 'santa-character';
    santa.src = cfg.santaImage;
    santa.style.width = `${cfg.santaSize}px`;
    santa.style.bottom = `${cfg.santaBottom}px`;
    santa.style.marginLeft = `-${cfg.santaSize / 2}px`;
    elements.push(santa);
    root.appendChild(santa);

    // Create overlay element (if enabled)
    if (cfg.showOverlay) {
      const overlay = document.createElement('img');
      overlay.className = 'santa-overlay';
      overlay.src = cfg.overlayImage;
      elements.push(overlay);
      root.appendChild(overlay);
    }

    // Handle image loading errors gracefully
    elements.forEach(element => {
      element.addEventListener('error', () => {
        console.warn(`[festive-js] Failed to load Santa theme image: ${element.src}`);
        element.style.display = 'none';
      });
    });

    // Cleanup function
    return () => {
      alive = false;
      elements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });
      elements.length = 0;
    };
  }
};