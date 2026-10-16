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
  document.querySelector('meta[name="theme-color"]').content = t === "dark" ? "#101321" : "#f5f5fa";
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
  const recent = [...dreams].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")).slice(0, 2);
  $("#recentDreams").innerHTML = recent.length ? recent.map((d) => dreamCard(d, true)).join("") : '<div class="empty">Todavía no hay sueños guardados. <button class="small" data-new>Registrar el primero</button></div>';
  const hasDemo = dreams.some((d) => d.synthetic);
  $("#demoBtn").hidden = hasDemo || dreams.length > 0;
}
function dreamCard(d, compact = false) {
  const txt = d.story_original || "Sin relato añadido.";
  const tags = [...(d.tags || [])].map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  return `<article class="dream" data-id="${esc(d.id)}">
    <div style="display:flex;justify-content:space-between;gap:8px;align-items:start"><div>
    <h3>${esc(d.title)} ${d.synthetic ? '<span class="tag gold">ejemplo</span>' : ""}</h3>
    <div class="muted" style="font-size:.82rem">${fmtDate(d.date)}${d.emotion ? " · " + esc(d.emotion) : ""}${d.quality ? " · sueño " + d.quality + "/10" : ""}${d.stress ? " · estrés " + d.stress + "/10" : ""}</div>
    <div>${tags}</div></div></div>
    <p>${esc(compact && txt.length > 160 ? txt.slice(0, 160) + "…" : txt)}</p>
    ${!compact && d.reflection ? `<div class="callout"><b>Asociaciones:</b> ${esc(d.reflection)}</div>` : ""}
    <div class="formactions"><button class="small" data-edit="${esc(d.id)}">Editar</button><button class="small" data-interp="${esc(d.id)}">Interpretar</button><button class="small" data-del="${esc(d.id)}">Eliminar</button></div>
    <div class="interpSlot"></div></article>`;
}
function renderDreams() {
  const q = ($("#dreamSearch").value || "").trim().toLowerCase(), emo = $("#emotionFilter").value, sort = $("#dreamSort").value;
  let list = dreams.filter((d) => (!q || [d.title, d.story_original, d.reflection, (d.tags || []).join(" "), d.emotion].join(" ").toLowerCase().includes(q)) && (!emo || d.emotion === emo));
  list.sort((a, b) => sort === "oldest" ? (a.date || "").localeCompare(b.date || "") : sort === "title" ? a.title.localeCompare(b.title, "es") : (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  $("#dreamList").innerHTML = list.length ? list.map((d) => dreamCard(d)).join("") : `<div class="empty">${dreams.length ? "Sin coincidencias. Prueba otro término." : "Vacío. Empieza con un fragmento — vale una frase."}</div>`;
}
function renderInterp(box, d) {
  const r = Interpret.run(d);
  if (r.type === "unavailable") {
    box.innerHTML = `<div class="interp"><h4>Aún hay poco material <span class="tag">lectura local</span></h4><p class="muted">${esc(r.summary)}</p><ul>${r.limitations.map((l) => `<li>${esc(l)}</li>`).join("")}</ul><p><b>Preguntas para completarlo:</b></p><ul>${r.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div>`;
    return;
  }
  const schoolName = { cientifica: "Científica", freudiana: "Freudiana", junguiana: "Junguiana", historica: "Histórica", personal: "Personal" };
  box.innerHTML = `<div class="interp"><h4>Lecturas posibles <span class="tag">lectura local</span></h4><p class="muted">${esc(r.summary)}</p>
  ${r.perspectives.map((p) => `<div style="margin:8px 0"><span class="tag">${esc(schoolName[p.school] || p.school)}</span> <b>${esc(p.term)}</b><br><span class="muted">${esc(p.claim)}</span></div>`).join("")}
  <p class="muted">Fuentes: ${r.sourceIds.map(esc).join(", ") || "—"}</p>
  <ul>${r.limitations.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
  <p><b>Para reflexionar:</b></p><ul>${r.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></div>`;
}

/* ---------- conocimiento ---------- */
function renderKnowledge() {
  const q = ($("#globalSearch").value || "").trim(), cat = $("#categoryFilter").value;
  const list = KB.search(q, cat);
  $("#knowledgeCount").textContent = list.length + " entradas";
  $("#kbMeta").textContent = `Diccionario vivo: ${KB.symbols().length} símbolos con lecturas de varias escuelas.`;
  $("#knowledgeGrid").innerHTML = list.length ? list.map((e) => `<article class="entry"><span class="tag">${esc(e.category)}</span>${(e.tags || []).slice(0, 3).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}<h3>${esc(e.term)}</h3><p>${esc(e.summary)}</p><details><summary>Contexto, escuelas y límites</summary><p>${esc(e.detail)}</p>${(e.interpretations || []).map((i) => `<p><span class="tag">${esc(i.school)}</span> <span class="muted">${esc(i.text)}</span></p>`).join("")}<p class="muted">Fuentes: ${(e.sourceIds || []).map(esc).join(", ")} · Evidencia ${esc(e.evidence)}</p>${(e.questions || []).map((qq) => `<p>✦ ${esc(qq)}</p>`).join("")}</details></article>`).join("") : '<div class="empty">Sin coincidencias en la base local.</div>';
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

/* ---------- export / import / ejemplos ---------- */
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
async function loadDemos() {
  try {
    const d = await fetch("./data/demo_dreams.json").then((r) => { if (!r.ok) throw new Error(); return r.json(); });
    let n = 0;
    for (const x of d.dreams) {
      if (dreams.some((dd) => dd.id === x.id)) continue;
      await DB.putDream({ ...x, story_original: x.story_original, tags: x.tags, symbols: [], characters: [], settings: [], reflection: x.reflection || "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), synthetic: true });
      n++;
    }
    await refresh(); renderDreams(); toast(n ? `${n} sueños de ejemplo cargados (ficticios)` : "Los ejemplos ya estaban cargados");
  } catch { toast("No se pudieron cargar los ejemplos"); }
}
async function wipeDemos() {
  for (const d of dreams.filter((x) => x.synthetic)) await DB.deleteDream(d.id);
  await refresh(); renderDreams(); toast("Ejemplos eliminados");
}
function storageSummary() {
  DB.allDreams().then(async (all) => {
    let bytes = 0; try { bytes = new Blob([JSON.stringify(all)]).size; } catch {}
    let quota = ""; try { const e = await navigator.storage.estimate(); if (e.quota) quota = ` · cuota aprox ${(e.usage / 1048576).toFixed(1)}/${(e.quota / 1048576).toFixed(0)} MB`; } catch {}
    $("#storageSummary").textContent = `${all.length} sueños · ~${bytes.toLocaleString("es-ES")} bytes${quota}. IndexedDB local, sin nube.`;
  });
}

/* ---------- eventos ---------- */
document.addEventListener("click", async (e) => {
  const nv = e.target.closest("#nav button,.tabbar button"); if (nv && nv.dataset.view) return nav(nv.dataset.view);
  const gt = e.target.closest("[data-goto]"); if (gt) { e.preventDefault(); return nav(gt.dataset.goto); }
  if (e.target.closest("[data-new]")) return openModal();
  const ed = e.target.closest("[data-edit]"); if (ed) return openModal(ed.dataset.edit);
  const it = e.target.closest("[data-interp]");
  if (it) { const card = it.closest(".dream"); const d = dreams.find((x) => x.id === it.dataset.interp); const box = card.querySelector(".interpSlot");
    if (box.innerHTML) { box.innerHTML = ""; return; } renderInterp(box, d); box.scrollIntoView({ block: "nearest" }); return; }
  const del = e.target.closest("[data-del]");
  if (del) { const d = dreams.find((x) => x.id === del.dataset.del);
    if (confirm(`¿Eliminar “${d.title}”?`)) { await DB.deleteDream(d.id); await refresh(); renderDreams(); toast("Eliminado"); } return; }
  const th = e.target.closest("[data-theme]"); if (th) { theme = th.dataset.theme; try { localStorage.setItem("dreamos.theme", theme); } catch {} applyTheme(); toast("Tema actualizado"); }
});
$("#dreamForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = $("#dreamTitle").value.trim();
  if (!title) return toast("Añade un título breve.");
  const id = $("#dreamId").value || uid();
  const old = dreams.find((d) => d.id === id);
  await DB.putDream({ id, title: title.slice(0, 120), date: $("#dreamDate").value || today(),
    wakeTime: "", story_original: $("#dreamStory").value.trim(), quality: num($("#dreamQuality").value), stress: num($("#dreamStress").value),
    emotion: $("#dreamEmotion").value, tags: $("#dreamTags").value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 20),
    symbols: [], characters: [], settings: [], reflection: $("#dreamReflection").value.trim(),
    createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    status: $("#dreamStory").value.trim() ? "complete" : "draft", synthetic: old?.synthetic || false });
  await refresh(); closeModal(); renderDreams(); toast(old ? "Sueño actualizado" : "Sueño guardado en este dispositivo");
  function num(v) { v = Number(v); return v >= 1 && v <= 10 ? v : null; }
});
$("#closeModal").onclick = closeModal; $("#cancelModal").onclick = closeModal;
$("#modal").addEventListener("click", (e) => { if (e.target === $("#modal")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); if (rec) try { rec.stop(); } catch {} } });
$("#dreamSearch").addEventListener("input", renderDreams);
$("#emotionFilter").addEventListener("change", renderDreams);
$("#dreamSort").addEventListener("change", renderDreams);
$("#categoryFilter").addEventListener("change", renderKnowledge);
$("#globalSearch").addEventListener("input", () => { const v = $(".view.active")?.id.replace("view-", ""); if (v === "conocimiento") renderKnowledge(); if (v === "diario") { $("#dreamSearch").value = $("#globalSearch").value; renderDreams(); } });
$("#globalSearch").addEventListener("keydown", (e) => { if (e.key !== "Enter") return; const q = e.target.value.trim().toLowerCase(); if (!q) return;
  const hitK = KB.entries.some((x) => [x.term, x.summary, x.detail, (x.tags || []).join(" ")].join(" ").toLowerCase().includes(q));
  if (hitK) { nav("conocimiento"); renderKnowledge(); } else { nav("diario"); $("#dreamSearch").value = e.target.value; renderDreams(); } });
$("#themeToggle").onclick = () => { theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; try { localStorage.setItem("dreamos.theme", theme); } catch {} applyTheme(); };
$("#exportBtn").onclick = exportAll;
$("#importFile").addEventListener("change", (e) => importFile(e.target.files?.[0]));
$("#demoBtn").onclick = loadDemos; $("#demoBtn2").onclick = loadDemos; $("#demoWipeBtn").onclick = wipeDemos;
$("#wipeBtn").onclick = async () => { if (!confirm("¿Borrar TODOS los sueños de este dispositivo? Exporta antes si los quieres conservar.")) return; await DB.clearDreams(); await refresh(); renderDreams(); storageSummary(); toast("Diario vaciado"); };
window.addEventListener("online", online); window.addEventListener("offline", online);
if (matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { if (theme === "system") applyTheme(); });
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installPrompt = e; $("#installBtn").hidden = false; });
$("#installBtn").onclick = async () => { if (!installPrompt) return toast("Instalación no disponible aquí (requiere HTTPS/localhost)."); try { installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; $("#installBtn").hidden = true; } catch { toast("No se pudo instalar"); } };
/* Compartir la app (nunca el diario): Web Share API con fallback a portapapeles. */
$("#shareBtn").onclick = async () => {
  const data = { title: "DreamOS", text: "Mi laboratorio onírico privado y offline. Pruébalo:", url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch {} return; }
  try { await navigator.clipboard.writeText(data.url); toast("Enlace copiado: compártelo donde quieras"); }
  catch { toast("Copia la URL del navegador para compartir"); }
};
/* Ambiente generativo: drone nocturno WebAudio (sin archivos), solo tras gesto, OFF por defecto. */
let AC = null, drone = null;
$("#soundToggle").onclick = () => {
  const btn = $("#soundToggle");
  if (drone) {
    try { drone.g.gain.linearRampToValueAtTime(0, AC.currentTime + .6); setTimeout(() => { drone.os.forEach((o) => { try { o.stop(); } catch {} }); AC.close().catch(() => {}); }, 700); } catch {}
    drone = null; AC = null; btn.textContent = "🌙 Activar ambiente"; btn.setAttribute("aria-pressed", "false"); return;
  }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    const g = AC.createGain(); g.gain.value = 0;
    const f = AC.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 420;
    const os = [110, 164.81, 220.5].map((fr, i) => { const o = AC.createOscillator(); o.type = i === 2 ? "triangle" : "sine"; o.frequency.value = fr; o.detune.value = i * 3; o.connect(f); o.start(); return o; });
    f.connect(g); g.connect(AC.destination);
    g.gain.linearRampToValueAtTime(.045, AC.currentTime + 2.5);
    drone = { os, g }; btn.textContent = "🌙 Silenciar ambiente"; btn.setAttribute("aria-pressed", "true"); toast("Ambiente activado");
  } catch { toast("Audio no disponible en este navegador"); }
};
document.addEventListener("visibilitychange", () => { if (document.hidden && drone) $("#soundToggle").click(); });

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
