/* DreamOS stars.js v0.3.0 — cielo neón procedural. Barato, pausable, respeta reduced-motion. */
"use strict";
(function () {
  const cv = document.getElementById("stars");
  if (!cv) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  let stars = [], meteors = [], running = true, W = 0, H = 0;
  const COLORS = ["#ffffff", "#c4a7ff", "#67e8f9", "#f4d068", "#ff4ecd"];
  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(160, W * H / 4500) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + .3, p: Math.random() * Math.PI * 2,
      s: .4 + Math.random() * 1.2, c: COLORS[Math.random() * COLORS.length | 0],
    }));
  }
  function frame(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = .35 + .65 * Math.abs(Math.sin(t * .001 * s.s + s.p));
      ctx.globalAlpha = a; ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (Math.random() < .006 && meteors.length < 2)
      meteors.push({ x: Math.random() * W * .7 + W * .2, y: -10, vx: -5 - Math.random() * 3, vy: 3 + Math.random() * 2, life: 1 });
    meteors = meteors.filter((m) => m.life > 0);
    for (const m of meteors) {
      m.x += m.vx; m.y += m.vy; m.life -= .02;
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
      g.addColorStop(0, `rgba(196,167,255,${m.life})`); g.addColorStop(1, "transparent");
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12); ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  new ResizeObserver(resize).observe(cv.parentElement);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false;
    else if (!running) { running = true; requestAnimationFrame(frame); }
  });
  new IntersectionObserver((es) => {
    const vis = es[0].isIntersecting && !document.hidden;
    if (vis && !running) { running = true; requestAnimationFrame(frame); }
    if (!vis) running = false;
  }).observe(cv);
  resize(); requestAnimationFrame(frame);
})();
