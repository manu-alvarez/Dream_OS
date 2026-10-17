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
  "lagarto / reptil": { icon: "🦎", badge: "Instinto & Adaptación", color: "#10b981" },
  "lagarto": { icon: "🦎", badge: "Instinto & Adaptación", color: "#10b981" },
  "niebla / bruma": { icon: "🌫️", badge: "Incertidumbre & Clima", color: "#94a3b8" },
  "niebla": { icon: "🌫️", badge: "Incertidumbre & Clima", color: "#94a3b8" },
  "ojos / mirada": { icon: "👁️", badge: "Consciencia & Verdad", color: "#38bdf8" },
  "ojos": { icon: "👁️", badge: "Consciencia & Verdad", color: "#38bdf8" },
  "escaleras / subir o bajar": { icon: "🪜", badge: "Evolución & Reto", color: "#a855f7" },
  "escaleras": { icon: "🪜", badge: "Evolución & Reto", color: "#a855f7" },
  "puente / cruzar": { icon: "🌉", badge: "Gran Transición", color: "#06b6d4" },
  "puente": { icon: "🌉", badge: "Gran Transición", color: "#06b6d4" },
  "reloj / el tiempo": { icon: "⏳", badge: "Urgencia & Plazos", color: "#eab308" },
  "reloj": { icon: "⏳", badge: "Urgencia & Plazos", color: "#eab308" },
  "llaves / candados": { icon: "🗝️", badge: "Acceso & Secreto", color: "#f59e0b" },
  "llaves": { icon: "🗝️", badge: "Acceso & Secreto", color: "#f59e0b" },
  "mariposa / metamorfosis": { icon: "🦋", badge: "Renacimiento", color: "#ec4899" },
  "mariposa": { icon: "🦋", badge: "Renacimiento", color: "#ec4899" },
  "lobo / manada": { icon: "🐺", badge: "Lealtad & Tribu", color: "#64748b" },
  "lobo": { icon: "🐺", badge: "Lealtad & Tribu", color: "#64748b" },
  "leon / felinos salvajes": { icon: "🦁", badge: "Poder & Soberanía", color: "#f59e0b" },
  "leon": { icon: "🦁", badge: "Poder & Soberanía", color: "#f59e0b" },
  "oso / cueva": { icon: "🐻", badge: "Fuerza & Descanso", color: "#78716c" },
  "oso": { icon: "🐻", badge: "Fuerza & Descanso", color: "#78716c" },
  "buho / lechuza": { icon: "🦉", badge: "Sabiduría Intuitiva", color: "#6366f1" },
  "buho": { icon: "🦉", badge: "Sabiduría Intuitiva", color: "#6366f1" },
  "tiburon / peligro submarino": { icon: "🦈", badge: "Alerta Profunda", color: "#0284c7" },
  "tiburon": { icon: "🦈", badge: "Alerta Profunda", color: "#0284c7" },
  "delfin / ballena": { icon: "🐬", badge: "Alegría & Armonía", color: "#38bdf8" },
  "delfin": { icon: "🐬", badge: "Alegría & Armonía", color: "#38bdf8" },
  "nieve / hielo / frio": { icon: "❄️", badge: "Distancia & Calma", color: "#bae6fd" },
  "nieve": { icon: "❄️", badge: "Distancia & Calma", color: "#bae6fd" },
  "sol / amanecer": { icon: "☀️", badge: "Claridad & Éxito", color: "#eab308" },
  "sol": { icon: "☀️", badge: "Claridad & Éxito", color: "#eab308" },
  "luna / fases lunares": { icon: "🌙", badge: "Mundo Emocional", color: "#c084fc" },
  "luna": { icon: "🌙", badge: "Mundo Emocional", color: "#c084fc" },
  "estrellas / cielo estrellado": { icon: "⭐", badge: "Guía & Esperanza", color: "#fef08a" },
  "estrellas": { icon: "⭐", badge: "Guía & Esperanza", color: "#fef08a" },
  "volcan / lava": { icon: "🌋", badge: "Pasión Contenida", color: "#ef4444" },
  "volcan": { icon: "🌋", badge: "Pasión Contenida", color: "#ef4444" },
  "barco / navegacion": { icon: "⛵", badge: "Viaje Interior", color: "#0ea5e9" },
  "barco": { icon: "⛵", badge: "Viaje Interior", color: "#0ea5e9" },
  "hospital / curacion": { icon: "🏥", badge: "Autocuidado & Salud", color: "#10b981" },
  "hospital": { icon: "🏥", badge: "Autocuidado & Salud", color: "#10b981" },
  "carcel / prision / atrapado": { icon: "⛓️", badge: "Falta de Libertad", color: "#71717a" },
  "carcel": { icon: "⛓️", badge: "Falta de Libertad", color: "#71717a" },
  "manos / afecto o creacion": { icon: "🤲", badge: "Capacidad & Vínculo", color: "#fb923c" },
  "manos": { icon: "🤲", badge: "Capacidad & Vínculo", color: "#fb923c" },
  "pelo / cabello": { icon: "💇", badge: "Identidad & Fuerza", color: "#f472b6" },
  "pelo": { icon: "💇", badge: "Identidad & Fuerza", color: "#f472b6" },
  "fantasma / aparicion": { icon: "👻", badge: "Asunto del Pasado", color: "#a78bfa" },
  "fantasma": { icon: "👻", badge: "Asunto del Pasado", color: "#a78bfa" },
  "paralisis del sueno / no poder moverse": { icon: "⚡", badge: "Tensión Nocturna", color: "#f43f5e" },
  "paralisis": { icon: "⚡", badge: "Tensión Nocturna", color: "#f43f5e" },
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
  "incertidumbre y abstencion": { icon: "⚖️", badge: "Ética & Cuidado", color: "#a855f7" },
  // Animales adicionales
  "aguila / halcon / ave rapaz": { icon: "🦅", badge: "Visión Panorámica", color: "#0284c7" },
  "aguila": { icon: "🦅", badge: "Visión Panorámica", color: "#0284c7" },
  "halcon": { icon: "🦅", badge: "Agudeza & Foco", color: "#0284c7" },
  "elefante": { icon: "🐘", badge: "Memoria & Sabiduría", color: "#64748b" },
  "toro / vaca": { icon: "🐂", badge: "Fuerza & Nutrición", color: "#d97706" },
  "toro": { icon: "🐂", badge: "Fuerza Indómita", color: "#d97706" },
  "vaca": { icon: "🐄", badge: "Nutrición Materna", color: "#10b981" },
  "tortuga": { icon: "🐢", badge: "Paciencia & Longevidad", color: "#10b981" },
  "rana / sapo": { icon: "🐸", badge: "Metamorfosis & Salto", color: "#22c55e" },
  "rana": { icon: "🐸", badge: "Metamorfosis & Salto", color: "#22c55e" },
  "sapo": { icon: "🐸", badge: "Transformación Oculta", color: "#15803d" },
  "abeja / avispa / colmena": { icon: "🐝", badge: "Comunidad & Dulzura", color: "#eab308" },
  "abeja": { icon: "🐝", badge: "Laboriosidad & Miel", color: "#eab308" },
  "avispa": { icon: "🐝", badge: "Alerta & Pinchazo", color: "#f59e0b" },
  "zorro": { icon: "🦊", badge: "Astucia & Cautela", color: "#f97316" },
  "ciervo / venado": { icon: "🦌", badge: "Nobleza & Gentileza", color: "#d97706" },
  "ciervo": { icon: "🦌", badge: "Nobleza & Gentileza", color: "#d97706" },
  "venado": { icon: "🦌", badge: "Sensibilidad Silvestre", color: "#d97706" },
  "rata / raton": { icon: "🐭", badge: "Inquietud & Recursos", color: "#78716c" },
  "rata": { icon: "🐀", badge: "Preocupación Subterránea", color: "#78716c" },
  "raton": { icon: "🐭", badge: "Detalles Descuidados", color: "#a8a29e" },
  "cuervo": { icon: "🐦‍⬛", badge: "Misterio & Lucidez", color: "#64748b" },
  "murcielago": { icon: "🦇", badge: "Navegación Nocturna", color: "#8b5cf6" },
  "cocodrilo / caiman": { icon: "🐊", badge: "Peligro al Acecho", color: "#059669" },
  "cocodrilo": { icon: "🐊", badge: "Emociones Arcaicas", color: "#059669" },
  "mono / simio": { icon: "🐒", badge: "Curiosidad & Juego", color: "#d97706" },
  "mono": { icon: "🐒", badge: "Espontaneidad", color: "#d97706" },
  "hormiga / plaga de insectos": { icon: "🐜", badge: "Detalles & Disciplina", color: "#78716c" },
  "hormiga": { icon: "🐜", badge: "Trabajo Constante", color: "#78716c" },
  // Plantas, árboles y naturaleza
  "arbol / raices / ramas": { icon: "🌳", badge: "Árbol de la Vida", color: "#16a34a" },
  "arbol": { icon: "🌳", badge: "Estructura & Raíces", color: "#16a34a" },
  "planta": { icon: "🌿", badge: "Crecimiento Vital", color: "#22c55e" },
  "plantas": { icon: "🌿", badge: "Reino Vegetal", color: "#22c55e" },
  "flores / rosa / loto / jardin": { icon: "🌸", badge: "Florecimiento Interior", color: "#f472b6" },
  "flores": { icon: "🌸", badge: "Belleza & Apertura", color: "#f472b6" },
  "rosa": { icon: "🌹", badge: "Amor & Secreto", color: "#f43f5e" },
  "loto": { icon: "🪷", badge: "Pureza Espiritual", color: "#ec4899" },
  "jardin": { icon: "🌺", badge: "Espacio de Paz", color: "#10b981" },
  "semilla / cosecha / frutos": { icon: "🌱", badge: "Potencial & Maduración", color: "#84cc16" },
  "semilla": { icon: "🌱", badge: "Gestación de Proyectos", color: "#84cc16" },
  "espinas / maleza / cactus": { icon: "🌵", badge: "Defensa & Obstáculos", color: "#ca8a04" },
  "espinas": { icon: "🌵", badge: "Límites & Autoprotección", color: "#ca8a04" },
  // Piedras, cristales y tesoros minerales
  "piedras / rocas / penasco": { icon: "🪨", badge: "Firmeza & Peso", color: "#78716c" },
  "piedra": { icon: "🪨", badge: "Fundamento Firme", color: "#78716c" },
  "roca": { icon: "🪨", badge: "Cimiento Inamovible", color: "#78716c" },
  "cristales / cuarzo / minerales": { icon: "🔮", badge: "Claridad & Energía", color: "#38bdf8" },
  "cristales": { icon: "🔮", badge: "Claridad Mental", color: "#38bdf8" },
  "cuarzo": { icon: "💎", badge: "Luz & Geometría", color: "#38bdf8" },
  "joyas / diamante / oro / perlas": { icon: "💎", badge: "Valor Supremo", color: "#eab308" },
  "joyas": { icon: "💎", badge: "Dones del Alma", color: "#eab308" },
  "diamante": { icon: "💎", badge: "Incorruptibilidad", color: "#38bdf8" },
  "oro": { icon: "🪙", badge: "Riqueza Interior", color: "#eab308" },
  "arena / dunas / tierras movedizas": { icon: "⏳", badge: "Tiempo & Fluidez", color: "#f59e0b" },
  "arena": { icon: "🏖️", badge: "Paso del Tiempo", color: "#f59e0b" },
  // Entornos y paisajes
  "playa / costa / orilla": { icon: "🏖️", badge: "Orilla & Sosiego", color: "#06b6d4" },
  "playa": { icon: "🏖️", badge: "Frontera Consciente", color: "#06b6d4" },
  "isla / aislamiento": { icon: "🏝️", badge: "Retiro & Soledad", color: "#10b981" },
  "isla": { icon: "🏝️", badge: "Santuario Propio", color: "#10b981" },
  "cueva / caverna / gruta": { icon: "🕳️", badge: "Introspección Profunda", color: "#6b7280" },
  "cueva": { icon: "🕳️", badge: "Descenso al Origen", color: "#6b7280" },
  "castillo / fortaleza / palacio": { icon: "🏰", badge: "Defensas & Soberanía", color: "#8b5cf6" },
  "castillo": { icon: "🏰", badge: "Murallas Personales", color: "#8b5cf6" },
  "sotano / subsuelo / bodega": { icon: "🗝️", badge: "Inconsciente Oculto", color: "#71717a" },
  "sotano": { icon: "🗝️", badge: "Secretos Reprimidos", color: "#71717a" },
  // Tiempo, clima y fenómenos
  "viento / huracan / tornado": { icon: "🌪️", badge: "Fuerzas de Cambio", color: "#0ea5e9" },
  "viento": { icon: "💨", badge: "Renovación Mental", color: "#0ea5e9" },
  "huracan": { icon: "🌪️", badge: "Giro Drástico", color: "#0284c7" },
  "tornado": { icon: "🌪️", badge: "Transformación Rápida", color: "#0284c7" },
  "arcoiris": { icon: "🌈", badge: "Paz tras la Tempestad", color: "#ec4899" },
  "terremoto / temblor / sismo": { icon: "⚡", badge: "Sacudida Vital", color: "#ef4444" },
  "terremoto": { icon: "⚡", badge: "Ruptura de Esquemas", color: "#ef4444" },
  "inundacion / tsunami / marea alta": { icon: "🌊", badge: "Desbordamiento Emocional", color: "#0284c7" },
  "inundacion": { icon: "🌊", badge: "Llanto o Catarsis", color: "#0284c7" },
  "tsunami": { icon: "🌊", badge: "Emoción Incontenible", color: "#0284c7" },
  // Colores
  "color rojo": { icon: "🔴", badge: "Pasión & Alerta", color: "#ef4444" },
  "rojo": { icon: "🔴", badge: "Fuego & Valentía", color: "#ef4444" },
  "color azul": { icon: "🔵", badge: "Serenidad & Verdad", color: "#3b82f6" },
  "azul": { icon: "🔵", badge: "Profundidad Mental", color: "#3b82f6" },
  "color verde": { icon: "🟢", badge: "Sanación & Esperanza", color: "#22c55e" },
  "verde": { icon: "🟢", badge: "Regeneración Vital", color: "#22c55e" },
  "color blanco": { icon: "⚪", badge: "Pureza & Comienzo", color: "#e2e8f0" },
  "blanco": { icon: "⚪", badge: "Lienzo en Blanco", color: "#e2e8f0" },
  "color negro / oscuridad": { icon: "⚫", badge: "Sombra & Misterio", color: "#64748b" },
  "negro": { icon: "⚫", badge: "Noche Fértil", color: "#64748b" },
  "color amarillo / dorado": { icon: "🟡", badge: "Lucidez & Optimismo", color: "#eab308" },
  "amarillo": { icon: "🟡", badge: "Claridad Solar", color: "#eab308" },
  "color violeta / morado / purpura": { icon: "🟣", badge: "Transformación Espiritual", color: "#a855f7" },
  "violeta": { icon: "🟣", badge: "Transmutación Sabia", color: "#a855f7" },
  // Personas y vínculos
  "personas desconocidas / extranos": { icon: "👤", badge: "Facetas por Descubrir", color: "#94a3b8" },
  "desconocido": { icon: "👤", badge: "La Sombra Ajena", color: "#94a3b8" },
  "madre / figura materna": { icon: "👩‍👧", badge: "Afecto & Nutrición", color: "#f472b6" },
  "madre": { icon: "👩‍👧", badge: "Seguridad & Raíz", color: "#f472b6" },
  "padre / figura paterna": { icon: "👨‍👧", badge: "Ley & Orientación", color: "#3b82f6" },
  "padre": { icon: "👨‍👧", badge: "Estructura & Decisión", color: "#3b82f6" },
  "ex-pareja / amor del pasado": { icon: "💔", badge: "Vínculos & Duelos", color: "#f43f5e" },
  "ex": { icon: "💔", badge: "Ciclos Pendientes", color: "#f43f5e" },
  "nino / infancia / nino interior": { icon: "🧒", badge: "Niño Interior", color: "#f59e0b" },
  "nino": { icon: "🧒", badge: "Inocencia & Juego", color: "#f59e0b" },
  "bebe / nacimiento / lactancia": { icon: "👶", badge: "Nuevo Comienzo", color: "#f472b6" },
  "bebe": { icon: "👶", badge: "Proyecto Frágil", color: "#f472b6" },
  "multitud / masa de gente": { icon: "👥", badge: "Presión Social", color: "#818cf8" },
  "multitud": { icon: "👥", badge: "Pertenencia o Agobio", color: "#818cf8" },
  "anciano sabio / guia / mentor": { icon: "🧙‍♂️", badge: "Voz de la Sabiduría", color: "#a855f7" },
  "anciano sabio": { icon: "🧙‍♂️", badge: "Consejo Íntimo", color: "#a855f7" },
  "amigos / amistades de la infancia": { icon: "🤝", badge: "Apoyo Leal", color: "#10b981" },
  "amigos": { icon: "🤝", badge: "Complicidad & Pasado", color: "#10b981" },
  "fallecido / visita de ser querido": { icon: "🕊️", badge: "Consuelo & Paz", color: "#cbd5e1" },
  "fallecido": { icon: "🕊️", badge: "Memoria Afectiva", color: "#cbd5e1" },
  // Sensaciones y acciones
  "perdida de voz / no poder gritar": { icon: "🔇", badge: "Bloqueo Comunicativo", color: "#f43f5e" },
  "sin voz": { icon: "🔇", badge: "Verdades Calladas", color: "#f43f5e" },
  "buscar algo perdido sin encontrarlo": { icon: "🧭", badge: "Búsqueda de Sentido", color: "#eab308" },
  "buscar": { icon: "🧭", badge: "Rumbo Extraviado", color: "#eab308" },
  "bailar / fiesta / celebracion": { icon: "💃", badge: "Celebración Vital", color: "#ec4899" },
  "bailar": { icon: "💃", badge: "Gozo & Libertad", color: "#ec4899" }
};

function getSymbolVisual(e) {
  const normTerm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const n = normTerm(e.term || e);
  if (SYMBOL_VISUALS[n]) return SYMBOL_VISUALS[n];
  for (const [key, val] of Object.entries(SYMBOL_VISUALS)) {
    if (n.includes(key) || key.includes(n)) return val;
  }
  const cat = (e.category || "").toLowerCase();
  if (cat === "animal") return { icon: "🐾", badge: "Fauna & Instinto", color: "#10b981" };
  if (cat === "lugar") return { icon: "📍", badge: "Lugar & Paisaje", color: "#06b6d4" };
  if (cat === "clima") return { icon: "⛅", badge: "Tiempo & Atmósfera", color: "#38bdf8" };
  if (cat === "naturaleza") return { icon: "🌿", badge: "Reino Vegetal", color: "#22c55e" };
  if (cat === "mineral") return { icon: "💎", badge: "Piedras & Tesoros", color: "#eab308" };
  if (cat === "color") return { icon: "🎨", badge: "Cromatismo Onírico", color: "#f472b6" };
  if (cat === "persona") return { icon: "👤", badge: "Vínculo & Encuentros", color: "#a855f7" };
  if (cat === "sensación") return { icon: "💫", badge: "Sensación Corporal", color: "#f59e0b" };
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
  const hits = KB.ready ? KB.extract(txt, [...(d.tags || []), d.title, d.reflection || ""]) : [];
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
const TECHNICAL_IDS = new Set([
  "k-continuidad", "k-hall", "k-hall-agresion", "k-hall-emociones", "k-hall-personajes", "k-hall-escenarios",
  "k-freud-manifiesto", "k-freud-condensacion", "k-freud-asociacion", "k-jung-amplificacion",
  "k-rag", "k-bertopic", "k-localfirst", "k-voice", "k-crypto", "k-privacidad", "k-incertidumbre"
]);

function renderKnowledge() {
  const q = ($("#symbolSearch")?.value || $("#globalSearch")?.value || "").trim();
  const cat = $("#categoryFilter")?.value || "";

  if ($("#kbMeta")) {
    $("#kbMeta").textContent = "Busca cualquier elemento, sensación o escenario de tus sueños para descubrir su significado.";
  }

  // No mostrar nada hasta que el usuario pregunte o consulte
  if (!q && !cat) {
    $("#knowledgeGrid").innerHTML = `
      <div class="search-empty-state" style="padding: 60px 20px; text-align: center;">
        <div class="empty-icon-orb" style="font-size: 2.4rem; margin-bottom: 12px; filter: drop-shadow(0 0 16px rgba(224,86,253,0.35));">✦</div>
        <h4 style="font-size: 1.18rem; color: #f5f5fa; font-weight: 500; margin-bottom: 8px;">Consulta cualquier símbolo o elemento</h4>
        <p style="color: var(--text-muted); max-width: 440px; margin: 0 auto; font-size: 0.94rem; line-height: 1.6;">
          Escribe en el buscador o selecciona una categoría para ver su significado e interpretaciones oníricas.
        </p>
      </div>`;
    return;
  }

  const list = KB.search(q, cat).filter((e) => !TECHNICAL_IDS.has(e.id));

  if (!list.length) {
    $("#knowledgeGrid").innerHTML = `
      <div class="search-empty-state" style="padding: 40px 20px; text-align: center;">
        <div class="empty-icon-orb" style="font-size: 2rem; margin-bottom: 10px;">🔮</div>
        <h4 style="font-size: 1.1rem; color: #f5f5fa; margin-bottom: 6px;">No encontramos resultados para "${esc(q)}"</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Prueba con otra palabra o selecciona una categoría diferente en el menú.</p>
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
