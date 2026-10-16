/* DreamOS fx.js v0.3.3 — ripple táctil + tilt 3D sutil. Solo si el sistema no pide movimiento reducido. */
"use strict";
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  /* Ripple en botones, nav y tarjetas */
  document.addEventListener("pointerdown", (e) => {
    const t = e.target.closest(".btn,.small,.icon,.nav button,.dream,.card");
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
  /* Tilt 3D solo con ratón fino */
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  let tick = false;
  document.addEventListener("pointermove", (e) => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const t = e.target.closest?.(".dream,.card");
      document.querySelectorAll(".tilting").forEach((el) => { if (el !== t) { el.classList.remove("tilting"); el.style.transform = ""; } });
      if (!t) return;
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      t.classList.add("tilting");
      t.style.transform = `perspective(800px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
    });
  });
  document.addEventListener("pointerleave", () => {
    document.querySelectorAll(".tilting").forEach((el) => { el.classList.remove("tilting"); el.style.transform = ""; });
  }, true);
})();
