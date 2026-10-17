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

/* ---------- escuelas y simbología visual ---------- */
const schoolName = { 
  cientifica: "Psicología & Mente", 
  freudiana: "Emociones & Vivencias", 
  junguiana: "Simbología & Arquetipos", 
  historica: "Sabiduría Tradicional", 
  personal: "Reflexión Personal" 
};

const SYMBOL_VISUALS = {
  "agua": { icon: "🌊", badge: "Elemento Natural", color: "#38bdf8" },
  "fuego": { icon: "🔥", badge: "Energía & Pasión", color: "#f97316" },
  "caida": { icon: "🕳️", badge: "Sensación Corporal", color: "#a855f7" },
  "vuelo": { icon: "🕊️", badge: "Libertad & Control", color: "#38bdf8" },
  "persecucion / huida": { icon: "🏃", badge: "Tensión & Huida", color: "#ec4899" },
  "persecucion": { icon: "🏃", badge: "Tensión & Huida", color: "#ec4899" },
  "muerte": { icon: "🥀", badge: "Cierre & Renovación", color: "#94a3b8" },
  "nacimiento / bebe": { icon: "👶", badge: "Nuevo Comienzo", color: "#f472b6" },
  "casa": { icon: "🏡", badge: "Espacio Íntimo", color: "#10b981" },
  "puerta / llave / umbral": { icon: "🗝️", badge: "Decisión & Paso", color: "#f59e0b" },
  "espejo": { icon: "🪞", badge: "Autoimagen & Identidad", color: "#c084fc" },
  "dientes (caida, rotura)": { icon: "🦷", badge: "Seguridad Personal", color: "#e2e8f0" },
  "sangre": { icon: "🩸", badge: "Fuerza Vital", color: "#ef4444" },
  "serpiente": { icon: "🐍", badge: "Transformación", color: "#22c55e" },
  "perro": { icon: "🐕", badge: "Lealtad & Vínculo", color: "#fb923c" },
  "gato": { icon: "🐈", badge: "Independencia", color: "#a855f7" },
  "pajaro / volar (ave)": { icon: "🦅", badge: "Perspectiva Alta", color: "#06b6d4" },
  "pez / pesca": { icon: "🐟", badge: "Mundo Inconsciente", color: "#0284c7" },
  "caballo": { icon: "🐎", badge: "Impulso & Vitalidad", color: "#d97706" },
  "arana / insectos": { icon: "🕷️", badge: "Inquietudes Diurnas", color: "#64748b" },
  "boda / matrimonio": { icon: "💍", badge: "Compromiso & Unión", color: "#f472b6" },
  "dinero / tesoro": { icon: "💰", badge: "Seguridad & Valor", color: "#eab308" },
  "robo / perder algo": { icon: "🧭", badge: "Pérdida & Descontrol", color: "#f43f5e" },
  "examen / escuela (llegar tarde, no preparado)": { icon: "📝", badge: "Autoexigencia", color: "#6366f1" },
  "trabajo / jefe / companeros": { icon: "💼", badge: "Día a Día", color: "#3b82f6" },
  "coche / conducir": { icon: "🚗", badge: "Rumbo de Vida", color: "#14b8a6" },
  "tren / estacion (perderlo)": { icon: "🚆", badge: "Oportunidades & Tiempos", color: "#0ea5e9" },
  "avion / aeropuerto": { icon: "✈️", badge: "Proyectos Altos", color: "#8b5cf6" },
  "mar": { icon: "🌊", badge: "Inmensidad Emocional", color: "#0284c7" },
  "rio / corriente": { icon: "🏞️", badge: "Fluir de la Vida", color: "#06b6d4" },
  "lluvia / tormenta": { icon: "⛈️", badge: "Liberación Emocional", color: "#60a5fa" },
  "bosque": { icon: "🌲", badge: "Exploración Interior", color: "#16a34a" },
  "montana / subir / cima": { icon: "⛰️", badge: "Reto & Aspiración", color: "#78716c" },
  "desierto / sed": { icon: "🏜️", badge: "Necesidad de Pausa", color: "#d97706" },
  "ciudad / calles / laberinto": { icon: "🏙️", badge: "Entorno Social", color: "#818cf8" },
  "iglesia / templo / rezo": { icon: "🏛️", badge: "Búsqueda de Sentido", color: "#f59e0b" },
  "cementerio / difuntos": { icon: "🪦", badge: "Memoria & Duelo", color: "#94a3b8" },
  "ropa / desnudez": { icon: "👘", badge: "Vulnerabilidad", color: "#f472b6" },
  "embarazo": { icon: "🤰", badge: "Proyectos en Gestación", color: "#ec4899" },
  "comida / banquete": { icon: "🍇", badge: "Afecto & Nutrición", color: "#84cc16" },
  "telefono / tecnologia (fallos)": { icon: "📱", badge: "Comunicación Difícil", color: "#38bdf8" },
  "laberinto / perderse": { icon: "🌀", badge: "Búsqueda de Salida", color: "#a855f7" },
  "sueno lucido": { icon: "✨", badge: "Consciencia en el Sueño", color: "#f43f5e" },
  "pesadilla": { icon: "🌑", badge: "Alerta & Tensión", color: "#71717a" },
  "sueno recurrente y repetitivo": { icon: "⏳", badge: "Mensaje Recurrente", color: "#a855f7" },
  "estres y afecto negativo onirico": { icon: "⚡", badge: "Tensión Diurna", color: "#eab308" },
  "hipotesis de continuidad": { icon: "🔗", badge: "Mente Despierta", color: "#38bdf8" },
  "arquetipos e inconsciente colectivo (jung)": { icon: "🧠", badge: "Imágenes Universales", color: "#a855f7" },
  "sombra (jung)": { icon: "👤", badge: "Aspectos Ocultos", color: "#6b7280" },
  "anima y animus (jung)": { icon: "🎭", badge: "Fuerza Interior", color: "#f472b6" },
  "contenido manifiesto y latente (freud)": { icon: "🗝️", badge: "Lo que hay Detrás", color: "#f59e0b" },
  "artemidoro y oneirocritica (s. ii)": { icon: "📜", badge: "Sabiduría Clásica", color: "#d97706" },
  "insomnia y oneiroi (artemidoro)": { icon: "👁️", badge: "Sueño & Realidad", color: "#d97706" },
  "dependencia del contexto (leccion oniromantica)": { icon: "🎯", badge: "Tu Contexto Personal", color: "#d97706" },
  "sistema hall y van de castle": { icon: "📊", badge: "Método Científico", color: "#0ea5e9" },
  "agresion (definicion hvdc a1-a8)": { icon: "⚔️", badge: "Conflicto", color: "#f43f5e" },
  "emociones hvdc (5 clases)": { icon: "🎭", badge: "Espectro Emocional", color: "#a855f7" },
  "personajes hvdc (ratio familiaridad)": { icon: "👥", badge: "Personajes", color: "#06b6d4" },
  "escenarios hvdc (interior/exterior)": { icon: "🗺️", badge: "Escenarios", color: "#10b981" },
  "condensacion y desplazamiento (freud)": { icon: "🧩", badge: "Mecanismo Onírico", color: "#f59e0b" },
  "asociacion libre (metodo freudiano)": { icon: "💭", badge: "Asociación Mental", color: "#f59e0b" },
  "amplificacion (metodo junguiano)": { icon: "🔮", badge: "Símbolos & Mitos", color: "#a855f7" },
  "asociaciones autobiograficas (prioridad)": { icon: "📖", badge: "Tu Historia", color: "#ec4899" },
  "rag (generacion aumentada por recuperacion)": { icon: "🔍", badge: "Búsqueda Onírica", color: "#38bdf8" },
  "bertopic (analisis tematico)": { icon: "📈", badge: "Temas Oníricos", color: "#6366f1" },
  "local-first (arquitectura)": { icon: "🔒", badge: "Privacidad Total", color: "#10b981" },
  "captura por voz (diseno)": { icon: "🎙️", badge: "Voz & Dictado", color: "#ec4899" },
  "cifrado local (diseno p2)": { icon: "🛡️", badge: "Seguridad", color: "#10b981" },
  "privacidad por diseno": { icon: "🔐", badge: "100% Privado", color: "#10b981" },
  "incertidumbre y abstencion": { icon: "⚖️", badge: "Ética & Cuidado", color: "#a855f7" }
};

function getSymbolVisual(e) {
  const normTerm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const n = normTerm(e.term || e);
  if (SYMBOL_VISUALS[n]) return SYMBOL_VISUALS[n];
  for (const [key, val] of Object.entries(SYMBOL_VISUALS)) {
    if (n.includes(key) || key.includes(n)) return val;
  }
  const cat = (e.category || "").toLowerCase();
  if (cat === "símbolo") return { icon: "✦", badge: "Símbolo Onírico", color: "#f472b6" };
  if (cat === "psicología") return { icon: "🧠", badge: "Psicología", color: "#a855f7" };
  if (cat === "ciencia") return { icon: "🔬", badge: "Ciencia de la Mente", color: "#38bdf8" };
  if (cat === "historia") return { icon: "📜", badge: "Sabiduría Tradicional", color: "#f59e0b" };
  return { icon: "✦", badge: "Concepto Onírico", color: "#c084fc" };
}

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
  const symChips = hits.map((s) => {
    const vis = getSymbolVisual(s);
    return `<button class="tag tag-symbol" data-symbol="${esc(s.term)}" title="Explorar símbolo ${esc(s.term)}">${vis.icon} ${esc(s.term)}</button>`;
  }).join("");
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
  const cat = $("#categoryFilter")?.value || "";
  const list = KB.search(q, cat);
  if ($("#kbMeta")) $("#kbMeta").textContent = "Busca cualquier elemento, sensación o escenario de tus sueños para descubrir su significado.";

  // Actualizar estado activo en los chips populares
  $$("#quickSymbolChips .quick-chip").forEach((chip) => {
    const val = chip.dataset.chip || "";
    chip.classList.toggle("active", (!val && !q) || (val && q.toLowerCase().includes(val.toLowerCase())));
  });

  if (!list.length) {
    $("#knowledgeGrid").innerHTML = `
      <div class="search-empty-state">
        <div class="empty-icon-orb">🔮</div>
        <h4>No encontramos símbolos para "${esc(q)}"</h4>
        <p>Prueba con términos más cotidianos o pulsa uno de estos símbolos populares:</p>
        <div class="empty-quick-tags">
          <button type="button" class="quick-chip" data-chip="agua">🌊 Agua</button>
          <button type="button" class="quick-chip" data-chip="volar">🕊️ Volar</button>
          <button type="button" class="quick-chip" data-chip="caída">🕳️ Caída</button>
          <button type="button" class="quick-chip" data-chip="dientes">🦷 Dientes</button>
          <button type="button" class="quick-chip" data-chip="casa">🏡 Casa</button>
          <button type="button" class="quick-chip" data-chip="">✦ Ver todos los símbolos</button>
        </div>
      </div>`;
    return;
  }

  $("#knowledgeGrid").innerHTML = list.map((e) => {
    const vis = getSymbolVisual(e);
    return `
      <article class="entry symbol-card" id="entry-${esc(KB.norm(e.term)).replace(/\s+/g, '-')}" style="--sym-color: ${vis.color}">
        <div class="symbol-header">
          <div class="symbol-avatar" aria-hidden="true">${vis.icon}</div>
          <div class="symbol-title-group">
            <div class="symbol-tags-row">
              <span class="tag tag-symbol-badge">${vis.badge}</span>
              ${(e.tags || []).slice(0, 3).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}
            </div>
            <h3 class="symbol-heading">${esc(e.term)}</h3>
          </div>
        </div>

        <p class="symbol-summary">${esc(e.summary)}</p>

        <details class="symbol-details">
          <summary class="symbol-summary-btn">
            <span>✦ Ver interpretaciones y reflexiones</span>
          </summary>
          <div class="symbol-expanded">
            <p class="symbol-detail-lead">${esc(e.detail)}</p>
            ${(e.interpretations || []).map((i) => `
              <div class="perspective-card" style="margin-bottom:8px">
                <div class="perspective-meta">
                  <span class="tag tag-school-${esc(i.school)}">${esc(schoolName[i.school] || i.school)}</span>
                </div>
                <p class="perspective-claim">${esc(i.text)}</p>
              </div>
            `).join("")}
            ${(e.questions || []).length ? `
              <div class="interp-questions">
                <h5>✧ Preguntas para reflexionar:</h5>
                <ul>${e.questions.map((qq) => `<li>${esc(qq)}</li>`).join("")}</ul>
              </div>
            ` : ""}
            <div style="margin-top:14px;display:flex;justify-content:flex-end">
              <button type="button" class="small ghost" data-use-symbol="${esc(e.term)}" title="Registrar un sueño con este símbolo">
                + Escribir un sueño con ${esc(e.term)}
              </button>
            </div>
          </div>
        </details>
      </article>
    `;
  }).join("");
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
  const chip = e.target.closest("[data-chip]");
  if (chip) {
    const val = chip.dataset.chip || "";
    nav("conocimiento");
    if ($("#symbolSearch")) $("#symbolSearch").value = val;
    if ($("#globalSearch")) $("#globalSearch").value = val;
    renderKnowledge();
    return;
  }
  const us = e.target.closest("[data-use-symbol]");
  if (us) {
    const term = us.dataset.useSymbol;
    openModal();
    $("#dreamStory").value = `Soñé con ${term}... `;
    $("#dreamTags").value = term;
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
if ($("#symbolSearch")) {
  $("#symbolSearch").addEventListener("input", (e) => {
    if ($("#globalSearch")) $("#globalSearch").value = e.target.value;
    renderKnowledge();
  });
}
if ($("#categoryFilter")) {
  $("#categoryFilter").addEventListener("change", renderKnowledge);
}
if ($("#globalSearch")) {
  $("#globalSearch").addEventListener("input", (e) => {
    const v = $(".view.active")?.id.replace("view-", "");
    const val = e.target.value;
    if (v === "conocimiento") {
      if ($("#symbolSearch")) $("#symbolSearch").value = val;
      renderKnowledge();
    } else if (v === "diario") {
      if ($("#dreamSearch")) $("#dreamSearch").value = val;
      renderDreams();
    }
  });
  $("#globalSearch").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = e.target.value.trim();
    if (!q) return;
    nav("conocimiento");
    if ($("#symbolSearch")) $("#symbolSearch").value = q;
    renderKnowledge();
  });
}
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
/* Música de fondo: The Ambientalist - In A Better World (2025 Extended Mix) */
const bgMusic = new Audio("./assets/music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.55;
bgMusic.preload = "auto";

function updateMusicUI(isPlaying) {
  const btnSettings = $("#soundToggle");
  const btnTop = $("#soundToggleTop");
  const bannerHero = $("#musicBannerHero");
  const heroIcon = $("#musicHeroIcon");

  if (btnSettings) {
    btnSettings.textContent = isPlaying ? "❚❚ Pausar música" : "▶ Reproducir música";
    btnSettings.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  }
  if (btnTop) {
    btnTop.classList.toggle("playing", isPlaying);
    btnTop.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    btnTop.title = isPlaying 
      ? "Pausar música: In A Better World" 
      : "Reproducir música: In A Better World (The Ambientalist)";
  }
  if (bannerHero) {
    bannerHero.classList.toggle("playing", isPlaying);
  }
  if (heroIcon) {
    heroIcon.textContent = isPlaying ? "❚❚" : "▶";
  }
}

async function playMusic(userInitiated = false) {
  try {
    await bgMusic.play();
    updateMusicUI(true);
    if (userInitiated) toast("🎵 Reproduciendo: In A Better World");
    return true;
  } catch (err) {
    updateMusicUI(false);
    return false;
  }
}

function pauseMusic(userInitiated = false) {
  try { bgMusic.pause(); } catch {}
  updateMusicUI(false);
  if (userInitiated) toast("Música pausada");
}

function toggleSound() {
  if (bgMusic.paused) {
    playMusic(true);
  } else {
    pauseMusic(true);
  }
}

if ($("#soundToggle")) $("#soundToggle").onclick = toggleSound;
if ($("#soundToggleTop")) $("#soundToggleTop").onclick = toggleSound;
if ($("#musicHeroToggle")) $("#musicHeroToggle").onclick = toggleSound;

bgMusic.addEventListener("ended", () => {
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {});
});
bgMusic.addEventListener("play", () => updateMusicUI(true));
bgMusic.addEventListener("pause", () => updateMusicUI(false));

function initBackgroundMusic() {
  // 1. Intentar reproducir directamente al entrar
  playMusic().catch(() => {});

  // 2. Si el navegador bloquea el autoplay sin interacción, iniciarlo con el primer toque en pantalla
  const startOnInteraction = () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => updateMusicUI(true)).catch(() => {});
    }
    ["pointerdown", "touchstart", "click", "keydown"].forEach((evt) => {
      window.removeEventListener(evt, startOnInteraction);
    });
  };

  ["pointerdown", "touchstart", "click", "keydown"].forEach((evt) => {
    window.addEventListener(evt, startOnInteraction, { once: true, passive: true });
  });
}

/* ---------- init ---------- */
(async function init() {
  try { theme = localStorage.getItem("dreamos.theme") || "system"; } catch {}
  applyTheme(); online(); voiceSetup();
  try { await KB.load(); } catch { toast("No se pudo cargar la base de conocimiento local"); }
  try { await DB.migrateV0(); } catch (e) { console.warn(e); }
  await refresh(); renderKnowledge(); storageSummary();
  nav(location.hash.slice(1) || "inicio");
  initBackgroundMusic();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    try { await navigator.serviceWorker.register("./sw.js"); } catch (e) { console.warn("SW", e); }
  }
})();
