/* DreamOS app.js v0.1.0 — UI + casos de uso. IndexedDB, base local, voz degradada, PWA. */
"use strict";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let dreams = [], theme = "system", toastTimer;
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = (p) => (p || "d") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
function toast(m) { const e = $("#toast"); e.textContent = m; e.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => e.classList.remove("show"), 2600); }
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function fmtDate(v) { if (!v) return "Sin fecha"; const d = new Date(v + "T12:00:00"); return isNaN(d) ? esc(v) : new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(d); }

/* ---------- tema / offline / PWA ---------- */
function applyTheme() {
  const t = theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]').content = t === "dark" ? "#06040d" : "#f5f5fa";
}
function online() { $("#offline").classList.toggle("show", !navigator.onLine); }
let installPrompt = null;

/* ---------- navegación ---------- */
function nav(view) {
  const apply = () => {
  if (!$("#view-" + view)) view = "inicio";
  $$(".view").forEach((x) => x.classList.toggle("active", x.id === "view-" + view));
  $$("#nav button,.tabbar button").forEach((x) => x.classList.toggle("active", x.dataset.view === view));
  if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  if (view === "diario") renderDreams();
  if (view === "conocimiento") renderKnowledge();
  if (view === "ajustes") storageSummary();
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(apply); else apply();
}

/* ---------- sueños ---------- */
async function refresh() { dreams = await DB.allDreams().catch(() => []); stats(); }
function stats() {
  $("#navDreamCount").textContent = dreams.length;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const days = new Set(dreams.map((d) => (d.date || "").slice(0, 10)).filter(Boolean));
  let streak = 0; const cur = new Date();
  if (!days.has(iso(cur))) cur.setDate(cur.getDate() - 1);
  while (days.has(iso(cur))) { streak++; cur.setDate(cur.getDate() - 1); }
  const month = dreams.filter((d) => (d.date || "").startsWith(today().slice(0, 7))).length;
  const last = [...dreams].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))[0];
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set("#statStreak", streak); set("#statMonth", month); set("#statEmotion", last?.emotion || "—");
  const recent = [...dreams].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")).slice(0, 3);
  $("#recentDreams").innerHTML = recent.length ? recent.map((d) => dreamCard(d, true)).join("") : '<div class="empty">Todavía no hay sueños guardados. <button class="small" data-new>Registrar el primero</button></div>';
}
function dreamCard(d, compact = false) {
  const txt = d.story_original || "Sin relato añadido.";
  const hits = KB.extract(d.story_original, [...(d.tags || []), d.title, d.reflection]);
  const symChips = hits.map((s) => `<button class="tag tag-symbol" data-symbol="${esc(s.term)}" title="Explorar símbolo ${esc(s.term)}">✦ ${esc(s.term)}</button>`).join("");
  const tagChips = [...(d.tags || [])].map((t) => `<button class="tag" data-tag="${esc(t)}" title="Filtrar sueños con #${esc(t)}">#${esc(t)}</button>`).join("");
  return `<article class="dream" data-id="${esc(d.id)}">
    <div style="display:flex;justify-content:space-between;gap:8px;align-items:start">
      <div>
        <h3>${esc(d.title)}</h3>
        <div class="muted" style="font-size:.82rem">${fmtDate(d.date)}${d.emotion ? " · " + esc(d.emotion) : ""}${d.quality ? " · calidad " + d.quality + "/10" : ""}${d.stress ? " · estrés previo " + d.stress + "/10" : ""}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">${symChips}${tagChips}</div>
      </div>
    </div>
    <div style="margin-top:10px">
      ${compact && txt.length > 160 ? `
        <p class="dream-text">${esc(txt.slice(0, 160))}… <button class="link-btn" data-expand="${esc(d.id)}">Leer más</button></p>
        <p class="dream-text-full" hidden>${esc(txt)} <button class="link-btn" data-collapse="${esc(d.id)}">Mostrar menos</button></p>
      ` : `
        <p class="dream-text">${esc(txt)}</p>
      `}
    </div>
    ${!compact && d.reflection ? `<div class="callout" style="margin-top:10px"><b>Asociaciones personales:</b> ${esc(d.reflection)}</div>` : ""}
    <div class="formactions" style="margin-top:12px">
      <button class="small" data-edit="${esc(d.id)}">Editar</button>
      <button class="small" data-interp="${esc(d.id)}">✦ Interpretar</button>
      <button class="small" data-del="${esc(d.id)}" style="color:#fca5a5">Eliminar</button>
    </div>
    <div class="interpSlot"></div>
  </article>`;
}
function renderDreams() {
  const q = ($("#dreamSearch").value || "").trim().toLowerCase(), emo = $("#emotionFilter").value, sort = $("#dreamSort").value;
  let list = dreams.filter((d) => (!q || [d.title, d.story_original, d.reflection, (d.tags || []).join(" "), d.emotion].join(" ").toLowerCase().includes(q)) && (!emo || d.emotion === emo));
  list.sort((a, b) => sort === "oldest" ? (a.date || "").localeCompare(b.date || "") : sort === "title" ? a.title.localeCompare(b.title, "es") : (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  $("#dreamList").innerHTML = list.length ? list.map((d) => dreamCard(d)).join("") : `<div class="empty">${dreams.length ? "Sin coincidencias. Prueba otro término." : "Vacío. Empieza con un fragmento — vale una frase."}</div>`;
}
function renderInterp(box, d) {
  const r = Interpret.run(d);
  const schoolName = { 
    cientifica: "Psicología & Mente", 
    freudiana: "Emociones & Vivencias", 
    junguiana: "Simbología & Arquetipos", 
    historica: "Sabiduría Tradicional", 
    personal: "Reflexión Personal" 
  };
  if (r.type === "unavailable") {
    box.innerHTML = `<div class="interp">
      <div class="interp-head">
        <h4>✦ Interpretación de tu Sueño</h4>
        <button class="icon-btn small" data-close-interp aria-label="Cerrar">✕</button>
      </div>
      <p class="interp-summary">${esc(r.summary)}</p>
      <ul style="padding-left:18px;font-size:0.88rem;color:#d1c8e9;line-height:1.6">${r.limitations.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      <div class="interp-questions">
        <h5>✦ Preguntas para recordar más detalles:</h5>
        <ul>${r.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
      </div>
    </div>`;
    return;
  }
  box.innerHTML = `<div class="interp">
    <div class="interp-head">
      <h4>✦ Interpretación de tu Sueño</h4>
      <button class="icon-btn small" data-close-interp aria-label="Cerrar">✕</button>
    </div>
    <p class="interp-summary">${esc(r.summary)}</p>
    <div class="perspective-grid">
      ${r.perspectives.map((p) => `
        <div class="perspective-card">
          <div class="perspective-meta">
            <span class="tag tag-school-${esc(p.school)}">${esc(schoolName[p.school] || p.school)}</span>
            <b>${esc(p.term)}</b>
          </div>
          <p class="perspective-claim">${esc(p.claim)}</p>
        </div>
      `).join("")}
    </div>
    ${r.questions.length ? `
      <div class="interp-questions">
        <h5>✧ Preguntas para reflexionar:</h5>
        <ul>${r.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
      </div>
    ` : ""}
    <p class="interp-disclaimer">✦ Cada persona es única: la interpretación más acertada es siempre la que mejor resuena con tu vida actual.</p>
  </div>`;
}

/* ---------- conocimiento ---------- */
function renderKnowledge() {
  const q = ($("#symbolSearch")?.value || $("#globalSearch")?.value || "").trim();
  const cat = $("#categoryFilter").value;
  const list = KB.search(q, cat);
  $("#knowledgeCount").textContent = list.length + " símbolos";
  $("#kbMeta").textContent = `Explora el significado de más de ${KB.symbols().length} símbolos oníricos para comprender tus sueños.`;
  $("#knowledgeGrid").innerHTML = list.length ? list.map((e) => `
    <article class="entry" id="entry-${esc(KB.norm(e.term)).replace(/\s+/g, '-')}">
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
        <span class="tag">${esc(e.category)}</span>
        ${(e.tags || []).slice(0, 3).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}
      </div>
      <h3>${esc(e.term)}</h3>
      <p>${esc(e.summary)}</p>
      <details>
        <summary>✦ Ver interpretaciones y reflexiones</summary>
        <p style="margin:10px 0 12px;color:#d1c8e9;font-size:0.9rem">${esc(e.detail)}</p>
        ${(e.interpretations || []).map((i) => `
          <div class="perspective-card" style="margin-bottom:8px">
            <span class="tag tag-school-${esc(i.school)}">${esc(schoolName[i.school] || i.school)}</span>
            <span style="font-size:0.88rem;color:#e2d9f3;margin-left:6px">${esc(i.text)}</span>
          </div>
        `).join("")}
        ${(e.questions || []).map((qq) => `<p style="font-size:0.86rem;color:#f5d0fe;margin-top:6px">✧ ${esc(qq)}</p>`).join("")}
      </details>
    </article>
  `).join("") : '<div class="empty">Sin coincidencias en la biblioteca local. Prueba con otro término.</div>';
}

/* ---------- modal ---------- */
function openModal(id) {
  $("#dreamForm").reset(); $("#dreamId").value = ""; $("#dreamDate").value = today();
  $("#modalTitle").textContent = id ? "Editar sueño" : "Registrar un sueño";
  if (id) { const d = dreams.find((x) => x.id === id); if (!d) return;
    $("#dreamId").value = d.id; $("#dreamTitle").value = d.title; $("#dreamDate").value = d.date || "";
    $("#dreamQuality").value = d.quality ?? ""; $("#dreamStress").value = d.stress ?? "";
    $("#dreamEmotion").value = d.emotion || ""; $("#dreamTags").value = (d.tags || []).join(", ");
    $("#dreamStory").value = d.story_original || ""; $("#dreamReflection").value = d.reflection || ""; }
  $("#modal").classList.add("open"); document.body.style.overflow = "hidden"; setTimeout(() => $("#dreamTitle").focus(), 30);
}
function closeModal() { $("#modal").classList.remove("open"); document.body.style.overflow = ""; }

/* ---------- voz (degradada y honesta) ---------- */
let rec = null;
function voiceSetup() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { $("#voiceNote").textContent = "(dictado no disponible en este navegador: usa el teclado)"; return; }
  $("#voiceBtn").hidden = false;
  $("#voiceNote").textContent = "(el dictado del navegador puede requerir red)";
  $("#voiceBtn").onclick = () => {
    try {
      rec = new SR(); rec.lang = "es-ES"; rec.interimResults = false;
      rec.onresult = (e) => { $("#dreamStory").value += (e.results[0][0].transcript || "") + " "; toast("Dictado añadido al relato"); };
      rec.onerror = () => toast("No se pudo dictar: revisa micro y conexión");
      rec.start(); toast("Escuchando… habla ahora");
    } catch { toast("Dictado no disponible"); }
  };
}

/* ---------- export / import ---------- */
function download(name, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function exportAll() { download("dreamos-copia.json", { app: "DreamOS", version: 1, exportedAt: new Date().toISOString(), data: { dreams, theme } }); toast("Copia exportada"); }
async function importFile(f) {
  if (!f) return;
  try {
    if (f.size > 5 * 1024 * 1024) throw new Error("Supera 5 MB.");
    const p = JSON.parse(await f.text());
    const arr = p?.data?.dreams ?? p?.dreams;
    if (p?.app !== "DreamOS" || !Array.isArray(arr)) throw new Error("No es un JSON DreamOS válido.");
    let n = 0;
    for (const x of arr) {
      if (!x || typeof x.title !== "string" || typeof x.id !== "string") continue;
      await DB.putDream({ id: x.id, title: x.title.slice(0, 120), date: x.date || today(), wakeTime: x.wakeTime || "", story_original: x.story_original || x.story || "", quality: x.quality ?? null, stress: x.stress ?? null, emotion: x.emotion || "", tags: [...new Set(String((x.tags || []).join ? x.tags.join(",") : x.tags || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))], symbols: [], characters: [], settings: [], reflection: x.reflection || "", favorite: false, createdAt: x.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(), status: "complete", synthetic: !!x.synthetic });
      n++;
    }
    await refresh(); renderDreams(); toast(n ? `${n} sueños importados` : "Nada válido que importar");
  } catch (e) { console.warn(e); toast(e.message || "Importación fallida; diario intacto."); }
  finally { $("#importFile").value = ""; }
}
function storageSummary() {
  DB.allDreams().then((all) => {
    $("#storageSummary").textContent = all.length === 1 
      ? "Tienes 1 sueño guardado de forma privada en tu dispositivo." 
      : `Tienes ${all.length} sueños guardados de forma privada en tu dispositivo.`;
  });
}

/* ---------- eventos ---------- */
document.addEventListener("click", async (e) => {
  const nv = e.target.closest("#nav button,.tabbar button"); if (nv && nv.dataset.view) return nav(nv.dataset.view);
  const gt = e.target.closest("[data-goto]"); if (gt) { e.preventDefault(); return nav(gt.dataset.goto); }
  if (e.target.closest("[data-new]")) return openModal();
  const ed = e.target.closest("[data-edit]"); if (ed) return openModal(ed.dataset.edit);
  const it = e.target.closest("[data-interp]");
  if (it) {
    const card = it.closest(".dream");
    const d = dreams.find((x) => x.id === it.dataset.interp);
    const box = card.querySelector(".interpSlot");
    if (box.innerHTML) { box.innerHTML = ""; return; }
    renderInterp(box, d);
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }
  const ci = e.target.closest("[data-close-interp]");
  if (ci) {
    const slot = ci.closest(".interpSlot");
    if (slot) slot.innerHTML = "";
    return;
  }
  const sym = e.target.closest("[data-symbol]");
  if (sym) {
    const term = sym.dataset.symbol;
    nav("conocimiento");
    if ($("#symbolSearch")) $("#symbolSearch").value = term;
    renderKnowledge();
    const entryId = "entry-" + KB.norm(term).replace(/\s+/g, "-");
    const entryEl = document.getElementById(entryId);
    if (entryEl) {
      entryEl.scrollIntoView({ behavior: "smooth", block: "center" });
      entryEl.querySelector("details")?.setAttribute("open", "true");
      entryEl.style.boxShadow = "0 0 35px rgba(217, 70, 239, 0.75)";
      setTimeout(() => { if (entryEl) entryEl.style.boxShadow = ""; }, 2500);
    }
    return;
  }
  const tg = e.target.closest("[data-tag]");
  if (tg) {
    nav("diario");
    if ($("#dreamSearch")) $("#dreamSearch").value = tg.dataset.tag;
    renderDreams();
    return;
  }
  const exp = e.target.closest("[data-expand]");
  if (exp) {
    const art = exp.closest("article");
    if (art) {
      art.querySelector(".dream-text").hidden = true;
      art.querySelector(".dream-text-full").hidden = false;
    }
    return;
  }
  const col = e.target.closest("[data-collapse]");
  if (col) {
    const art = col.closest("article");
    if (art) {
      art.querySelector(".dream-text").hidden = false;
      art.querySelector(".dream-text-full").hidden = true;
    }
    return;
  }
  const del = e.target.closest("[data-del]");
  if (del) {
    const d = dreams.find((x) => x.id === del.dataset.del);
    if (confirm(`¿Eliminar “${d.title}”?`)) {
      await DB.deleteDream(d.id);
      await refresh();
      renderDreams();
      toast("Eliminado");
    }
    return;
  }
  const th = e.target.closest("button[data-theme]");
  if (th) {
    theme = th.dataset.theme;
    try { localStorage.setItem("dreamos.theme", theme); } catch {}
    applyTheme();
    toast("Tema actualizado");
  }
});
$("#dreamForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = $("#dreamTitle").value.trim();
  if (!title) return toast("Añade un título breve.");
  const story = $("#dreamStory").value.trim();
  const tags = $("#dreamTags").value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 20);
  const reflection = $("#dreamReflection").value.trim();
  const id = $("#dreamId").value || uid();
  const old = dreams.find((d) => d.id === id);
  const detectedSymbols = KB.extract(story, [...tags, title, reflection]).map((s) => s.term);
  await DB.putDream({
    id, title: title.slice(0, 120), date: $("#dreamDate").value || today(),
    wakeTime: "", story_original: story, quality: num($("#dreamQuality").value), stress: num($("#dreamStress").value),
    emotion: $("#dreamEmotion").value, tags,
    symbols: detectedSymbols, characters: [], settings: [], reflection,
    createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    status: story ? "complete" : "draft", synthetic: false
  });
  await refresh(); closeModal(); renderDreams(); toast(old ? "Sueño actualizado" : "¡Sueño guardado con éxito!");
  function num(v) { v = Number(v); return v >= 1 && v <= 10 ? v : null; }
});
$("#closeModal").onclick = closeModal; $("#cancelModal").onclick = closeModal;
$("#modal").addEventListener("click", (e) => { if (e.target === $("#modal")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); if (rec) try { rec.stop(); } catch {} } });
$("#dreamSearch").addEventListener("input", renderDreams);
$("#emotionFilter").addEventListener("change", renderDreams);
$("#dreamSort").addEventListener("change", renderDreams);
if ($("#symbolSearch")) $("#symbolSearch").addEventListener("input", renderKnowledge);
$("#categoryFilter").addEventListener("change", renderKnowledge);
$("#globalSearch").addEventListener("input", () => {
  const v = $(".view.active")?.id.replace("view-", "");
  if (v === "conocimiento") {
    if ($("#symbolSearch")) $("#symbolSearch").value = $("#globalSearch").value;
    renderKnowledge();
  }
  if (v === "diario") {
    $("#dreamSearch").value = $("#globalSearch").value;
    renderDreams();
  }
});
$("#globalSearch").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const q = e.target.value.trim().toLowerCase();
  if (!q) return;
  const hitK = KB.entries.some((x) => [x.term, x.summary, x.detail, (x.tags || []).join(" ")].join(" ").toLowerCase().includes(q));
  if (hitK) {
    nav("conocimiento");
    if ($("#symbolSearch")) $("#symbolSearch").value = e.target.value;
    renderKnowledge();
  } else {
    nav("diario");
    $("#dreamSearch").value = e.target.value;
    renderDreams();
  }
});
$("#themeToggle").onclick = () => { theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("dreamos.theme", theme); } catch {} applyTheme(); };
$("#exportBtn").onclick = exportAll;
$("#importFile").addEventListener("change", (e) => importFile(e.target.files?.[0]));
$("#wipeBtn").onclick = async () => { if (!confirm("¿Borrar TODOS los sueños de este dispositivo? Exporta antes si los quieres conservar.")) return; await DB.clearDreams(); await refresh(); renderDreams(); storageSummary(); toast("Diario vaciado"); };
window.addEventListener("online", online); window.addEventListener("offline", online);
if (matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { if (theme === "system") applyTheme(); });
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installPrompt = e; });
function openInstallGuide() {
  const modal = $("#installModal");
  if (!modal) return;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if ($("#installStepApple")) $("#installStepApple").style.display = isIOS ? "flex" : "none";
  if ($("#installStepOther")) $("#installStepOther").style.display = isIOS ? "none" : "block";
  modal.classList.add("open");
}
function closeInstallGuide() {
  const modal = $("#installModal");
  if (modal) modal.classList.remove("open");
}
if ($("#closeInstallModal")) $("#closeInstallModal").onclick = closeInstallGuide;
if ($("#confirmInstallBtn")) $("#confirmInstallBtn").onclick = closeInstallGuide;
if ($("#installBtn")) {
  $("#installBtn").onclick = async () => {
    if (installPrompt) {
      try {
        installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          installPrompt = null;
          toast("¡Dream OS añadido con éxito!");
        }
      } catch {
        openInstallGuide();
      }
    } else {
      openInstallGuide();
    }
  };
}
/* Compartir la app (nunca el diario): Web Share API con fallback a portapapeles. */
$("#shareBtn").onclick = async () => {
  const data = { title: "Dream OS", text: "Dream OS — Explora tus Sueños. Privado y offline. Pruébalo:", url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch {} return; }
  try { await navigator.clipboard.writeText(data.url); toast("Enlace copiado: compártelo donde quieras"); }
  catch { toast("Copia la URL del navegador para compartir"); }
};
/* Ambiente generativo: drone nocturno WebAudio (ondas Theta / 432Hz), solo tras gesto, OFF por defecto. */
let AC = null, drone = null;
function toggleSound() {
  const btnSettings = $("#soundToggle");
  const btnTop = $("#soundToggleTop");
  if (drone) {
    try {
      drone.g.gain.linearRampToValueAtTime(0, AC.currentTime + 0.6);
      setTimeout(() => {
        drone.os.forEach((o) => { try { o.stop(); } catch {} });
        AC.close().catch(() => {});
      }, 700);
    } catch {}
    drone = null; AC = null;
    if (btnSettings) { btnSettings.textContent = "🌙 Activar ambiente sonoro"; btnSettings.setAttribute("aria-pressed", "false"); }
    if (btnTop) { btnTop.classList.remove("playing"); btnTop.setAttribute("aria-pressed", "false"); btnTop.title = "Activar drone nocturno (432Hz)"; }
    toast("🌙 Drone onírico silenciado");
    return;
  }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    const g = AC.createGain(); g.gain.value = 0;
    const f = AC.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 420;
    /* Frecuencias armónicas binaurales en escala Theta para relajación profunda */
    const os = [108, 162, 216].map((fr, i) => {
      const o = AC.createOscillator();
      o.type = i === 2 ? "triangle" : "sine";
      o.frequency.value = fr;
      o.detune.value = i * 4;
      o.connect(f);
      o.start();
      return o;
    });
    f.connect(g); g.connect(AC.destination);
    g.gain.linearRampToValueAtTime(0.045, AC.currentTime + 2.5);
    drone = { os, g };
    if (btnSettings) { btnSettings.textContent = "🌙 Silenciar ambiente sonoro"; btnSettings.setAttribute("aria-pressed", "true"); }
    if (btnTop) { btnTop.classList.add("playing"); btnTop.setAttribute("aria-pressed", "true"); btnTop.title = "Silenciar drone nocturno (432Hz)"; }
    toast("✨ Drone onírico activado (Frecuencia Theta 432Hz)");
  } catch {
    toast("Audio no disponible en este navegador");
  }
}
if ($("#soundToggle")) $("#soundToggle").onclick = toggleSound;
if ($("#soundToggleTop")) $("#soundToggleTop").onclick = toggleSound;
document.addEventListener("visibilitychange", () => { if (document.hidden && drone) toggleSound(); });

/* ---------- init ---------- */
(async function init() {
  try { theme = localStorage.getItem("dreamos.theme") || "system"; } catch {}
  applyTheme(); online(); voiceSetup();
  try { await KB.load(); } catch { toast("No se pudo cargar la base de conocimiento local"); }
  try { await DB.migrateV0(); } catch (e) { console.warn(e); }
  await refresh(); renderKnowledge(); storageSummary();
  nav(location.hash.slice(1) || "inicio");
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    try { await navigator.serviceWorker.register("./sw.js"); } catch (e) { console.warn("SW", e); }
  }
})();
