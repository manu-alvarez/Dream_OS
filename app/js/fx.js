/* DreamOS fx.js v0.5.0 — Micro-interacciones de lujo: parallax 3D en astrolabio e iluminación líquida */
"use strict";
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Parallax 3D e Iluminación Líquida con ratón fino */
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  let tick = false;
  const relic = document.getElementById("heroRelic");
  const disc = document.getElementById("astrolabeDisc");

  document.addEventListener("pointermove", (e) => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      tick = false;

      /* Reflejo especular en tarjetas */
      const card = e.target.closest?.(".stat-card, .dream, .side-card");
      if (card) {
        const cr = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${(e.clientX - cr.left).toFixed(1)}px`);
        card.style.setProperty("--mouse-y", `${(e.clientY - cr.top).toFixed(1)}px`);
      }

      /* Tilt 3D sutil en astrolabio cósmico */
      if (relic && disc) {
        const hero = relic.closest(".hero");
        if (hero) {
          const hr = hero.getBoundingClientRect();
          const inHero = e.clientX >= hr.left && e.clientX <= hr.right && e.clientY >= hr.top && e.clientY <= hr.bottom;
          if (inHero) {
            const relX = (e.clientX - hr.left) / hr.width - 0.5;
            const relY = (e.clientY - hr.top) / hr.height - 0.5;
            disc.style.transform = `perspective(1000px) rotateX(${(-relY * 18).toFixed(2)}deg) rotateY(${(relX * 22).toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;
          } else {
            disc.style.transform = "";
          }
        }
      }
    });
  });

  document.addEventListener("pointerleave", () => {
    if (disc) disc.style.transform = "";
  }, true);
})();
