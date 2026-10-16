/* DreamOS fx.js v0.4.0 — Micro-interacciones de lujo: parallax 3D en astrolabio, reflejo líquido y ripples */
"use strict";
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Ondulación de luz táctil (Ripple) */
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest(".btn, .small, .icon-btn, .nav button, .tabbar button, .dream, .stat-card, .side-card");
    if (!t) return;
    const r = t.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const rip = document.createElement("span");
    rip.className = "ripple";
    rip.style.width = rip.style.height = s * 2 + "px";
    rip.style.left = (e.clientX - r.left - s) + "px";
    rip.style.top = (e.clientY - r.top - s) + "px";
    t.appendChild(rip);
    setTimeout(() => rip.remove(), 650);
  });

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
