/* DreamOS fx.js v0.6.0 — Micro-interacciones de lujo: iluminación líquida especular */
"use strict";
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Iluminación Líquida con ratón fino */
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  let tick = false;

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
    });
  });
})();
