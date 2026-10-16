/* DreamOS stars.js v0.5.0 — Cielo cósmico interactivo con estrellas fugaces frecuentes, estelas de polvo estelar y destellos de diamantes. */
"use strict";
(function () {
  const cv = document.getElementById("stars");
  if (!cv) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  let stars = [], meteors = [], sparks = [], running = true, W = 0, H = 0;
  let lastMeteorTime = 0;

  const STAR_COLORS = ["#ffffff", "#fef3c7", "#e0e7ff", "#f5d0fe", "#a5f3fc", "#fed7aa"];
  const METEOR_THEMES = [
    { head: "#ffffff", glow: "rgba(103, 232, 249, 0.95)", tail: "rgba(56, 189, 248, 0)" }, // Cyan diamante
    { head: "#ffffff", glow: "rgba(244, 208, 104, 0.95)", tail: "rgba(251, 146, 60, 0)" }, // Oro estelar
    { head: "#ffffff", glow: "rgba(244, 114, 182, 0.95)", tail: "rgba(192, 132, 252, 0)" }, // Magenta cósmico
    { head: "#ffffff", glow: "rgba(196, 181, 253, 0.95)", tail: "rgba(139, 92, 246, 0)" }  // Amatista profundo
  ];

  function resize() {
    const r = cv.parentElement ? cv.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width || window.innerWidth;
    H = r.height || window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(260, Math.max(90, Math.floor((W * H) / 5200)));
    stars = Array.from({ length: count }, (_, i) => {
      const isSuperstar = i < 18; // 18 estrellas prominentes con destellos en cruz
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: isSuperstar ? (Math.random() * 1.4 + 1.2) : (Math.random() * 1.1 + 0.25),
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.2,
        c: STAR_COLORS[Math.random() * STAR_COLORS.length | 0],
        glint: isSuperstar
      };
    });
  }

  function spawnMeteor(ox, oy, customAngle) {
    const theme = METEOR_THEMES[Math.random() * METEOR_THEMES.length | 0];
    const angle = (customAngle !== undefined) ? customAngle : (Math.PI * 0.75 + (Math.random() - 0.5) * 0.4);
    const speed = 9 + Math.random() * 7;
    const startX = (ox !== undefined) ? ox : (Math.random() * W * 1.1 - W * 0.05);
    const startY = (oy !== undefined) ? oy : (Math.random() * H * 0.45 - 20);
    const trailMult = 20 + Math.random() * 16;
    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      trailMult,
      life: 1,
      decay: 0.012 + Math.random() * 0.01,
      theme,
      size: 2.2 + Math.random() * 1.2
    });
  }

  function frame(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    // 1. Dibujar estrellas del firmamento
    for (const s of stars) {
      const pulse = Math.sin(t * 0.0012 * s.s + s.p);
      const alpha = 0.35 + 0.65 * Math.abs(pulse);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Destello en cruz (4-point diffraction spike) para estrellas prominentes
      if (s.glint && alpha > 0.6) {
        const glintLen = s.r * (2.8 + pulse * 1.8);
        ctx.strokeStyle = s.c;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(s.x - glintLen, s.y); ctx.lineTo(s.x + glintLen, s.y);
        ctx.moveTo(s.x, s.y - glintLen); ctx.lineTo(s.x, s.y + glintLen);
        ctx.stroke();
      }
    }

    // 2. Frecuencia y generación de estrellas fugaces (cada ~1.2 - 2.5s)
    const now = performance.now();
    if (now - lastMeteorTime > (1400 + Math.random() * 1200) && meteors.length < 4) {
      spawnMeteor();
      lastMeteorTime = now;
      // Probabilidad de lluvia doble
      if (Math.random() < 0.35 && meteors.length < 3) {
        setTimeout(() => spawnMeteor(), 180 + Math.random() * 300);
      }
    }

    // 3. Actualizar y dibujar partículas de polvo estelar (sparks)
    ctx.globalCompositeOperation = "lighter";
    sparks = sparks.filter(sp => sp.life > 0);
    for (const sp of sparks) {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= sp.decay;
      ctx.globalAlpha = Math.max(0, sp.life);
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Actualizar y dibujar estrellas fugaces (meteors)
    meteors = meteors.filter(m => m.life > 0 && m.x > -150 && m.x < W + 150 && m.y < H + 150);
    for (const m of meteors) {
      m.x += m.vx;
      m.y += m.vy;
      m.life -= m.decay;

      const tailX = m.x - m.vx * m.trailMult;
      const tailY = m.y - m.vy * m.trailMult;

      // Desprender chispas de polvo estelar
      if (Math.random() < 0.65 && sparks.length < 60) {
        sparks.push({
          x: m.x + (Math.random() - 0.5) * 4,
          y: m.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          r: Math.random() * 1.5 + 0.5,
          life: 0.8,
          decay: 0.035,
          color: m.theme.glow
        });
      }

      // Estela con degradado suave
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, m.theme.glow.replace("0.95", (m.life * 0.95).toFixed(2)));
      grad.addColorStop(0.35, m.theme.glow.replace("0.95", (m.life * 0.5).toFixed(2)));
      grad.addColorStop(1, m.theme.tail);

      ctx.strokeStyle = grad;
      ctx.lineWidth = m.size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Cabeza resplandeciente con halo
      const headGlow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 4);
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${m.life})`);
      headGlow.addColorStop(0.4, m.theme.glow.replace("0.95", (m.life * 0.8).toFixed(2)));
      headGlow.addColorStop(1, "transparent");

      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  // Interacción: tocar o hacer clic en el cielo invoca una estrella fugaz
  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, input, textarea, select, a, .modal, .toast, .stat-card, .dream")) return;
    const clickX = e.clientX;
    const clickY = e.clientY;
    spawnMeteor(clickX - 60, clickY - 60, Math.PI * 0.72 + (Math.random() - 0.5) * 0.2);
  }, { passive: true });

  new ResizeObserver(resize).observe(cv.parentElement || document.body);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false;
    else if (!running) { running = true; requestAnimationFrame(frame); }
  });
  new IntersectionObserver((es) => {
    const vis = es[0].isIntersecting && !document.hidden;
    if (vis && !running) { running = true; requestAnimationFrame(frame); }
    if (!vis) running = false;
  }).observe(cv);

  resize();
  requestAnimationFrame(frame);
})();
