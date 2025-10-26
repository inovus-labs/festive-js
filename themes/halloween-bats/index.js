/**
 * 🎃 Halloween Bats Theme
 * A spooky festive overlay for Halloween.
 * 
 * Adds gently flying bats 🦇 across the screen
 * without affecting page performance or layout.
 */

Festive.registerTheme("halloween-bats", {
  name: "Halloween Bats",
  start: "2025-10-01",
  end: "2025-10-31",

  init(params = {}) {
    const batCount = params.batCount || 10;

    // Create and animate bats
    for (let i = 0; i < batCount; i++) {
      const bat = document.createElement("div");
      bat.textContent = "🦇";
      bat.style.position = "fixed";
      bat.style.left = `${Math.random() * 100}vw`;
      bat.style.top = `${Math.random() * 100}vh`;
      bat.style.fontSize = `${Math.random() * 20 + 16}px`;
      bat.style.opacity = "0.8";
      bat.style.transition = "transform 0.3s ease-in-out";
      bat.style.animation = `fly-${i} 4s infinite alternate ease-in-out`;

      // Append the bat to the page
      document.body.appendChild(bat);

      // Define bat flying animation
      const style = document.createElement("style");
      style.textContent = `
        @keyframes fly-${i} {
          from {
            transform: translateY(0px) rotate(0deg);
          }
          to {
            transform: translateY(${Math.random() * 60 - 30}px)
                       rotate(${Math.random() * 40 - 20}deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
  },
});
