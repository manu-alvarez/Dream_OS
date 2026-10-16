# 02 — ARQUITECTURA TÉCNICA CONGELADA v1.0
> Fuente verdad ingeniería. Stack sin framework en V1. Local-first. Ref: MDN PWA, W3C Manifest, WCAG 2.2 AA.

## 1. Decisión madre (ADR-001): multi-archivo, no single-HTML para prod
Prototipos single-file valen como demo/precursor, pero prod será `app/` multi-archivo. Motivo: SW no puede cachearse a sí mismo desde Data-URI, Manifest Data-URI incompleto (sin icons maskable/screenshots), CSP + mantenibilidad + IndexedDB migraciones. Demo actual se preserva en raíz como referencia.

```
Dream_OS/
  app/
    index.html          # shell semántico, sin lógica inline masiva
    manifest.webmanifest# W3C completo
    sw.js               # app-shell + runtime cache + offline fallback
    offline.html
    css/tokens.css + app.css
    js/db.js (IndexedDB wrapper) + store.js + search.js + interpret.js + ui.js + voice.js + ia-adapter.js
    assets/icons/ (192,512,maskable) + fonts/
  docs/  research/  data/seed/  tests/
```

## 2. Capas (dependencias solo hacia abajo)
1 Presentación (componentes) → 2 Navegación/estado (hash-router, sin lib) → 3 Casos uso (createDream, searchDreams, exportDiary) → 4 Servicios (captura, extracción reglas, retrieval) → 5 Repositorios (DreamRepo, KnowledgeRepo) → 6 Catálogo conocimiento → 7 Adaptadores IA (`IAProvider` interfaz) → 8 Persistencia/cifrado → 9 Instalación/offline → 10 Import/export/migraciones → 11 Telemetría (OFF V1).
UI nunca importa `ia-adapter` directo; pasa por caso uso con `settings.aiMode`.

## 3. Persistencia: IndexedDB (no localStorage en prod)
- DB `dreamos` v1, stores: `dreams (keyPath id, idx date, emotion, updatedAt)`, `knowledge (keyPath id, idx cat)`, `favorites`, `meta (key settings, tasks)`.
- Wrapper promesas tipo `idb` (~1KB, inline permitido para no depender CDN offline). Migraciones versionadas `migrate(v0→v1)`. Cuota: `navigator.storage.estimate()` + aviso >80%. localStorage solo como fallback demo actual (`dreamos.demo.v1` / `dreamos_data_v1`).
- Esquema validado con JSON Schema antes de `put`. `createdAt` inmutable, `updatedAt` auto.

## 4. PWA offline-first
- Manifest: name/short_name, start_url `.`, display `standalone`, bg/theme `#101321`, icons 192/512 + maskable, categories, lang `es`.
- SW: precache app-shell (HTML/CSS/JS/icons/offline.html), estrategia `CacheFirst` shell, `NetworkFirst` con fallback offline para navegaciones, `StaleWhileRevalidate` conocimiento. Update explícito: toast “Nueva versión → Recargar”. `offline.html` propia.
- Instalación: `beforeinstallprompt` capturado → botón Instalar. Requiere HTTPS o localhost. No prometer instalación desde `file://`.
- Sin CDN para arranque: fonts/icons/self-hosted. Google Fonts solo con `display=swap` + fallback system-ui, o mejor system stack en V1 para offline total.

## 5. Búsqueda híbrida V1 (sin embeddings) → extensible
Fase léxica: normalización ES (lowercase, NFD strip, tokenización), índice invertido en memoria, sinónimos iniciales (`agua: [mar,río,lluvia]`, `caída:[precipicio,abismo]`...), filtros cat/emoción/fecha, ranking TF simple + recencia. Fase semántica (P1): embeddings opcionales vía `ia-adapter.embed()` + HNSW local o `sqlite-vec`, con flag `semanticAvailable`. Nunca bloquear si no hay modelo.

## 6. Motor interpretación V1 (reglas, no IA)
`interpret.js`: extractor determinista (regex léxica ES + listas símbolos 8 + emociones Hall 5 + personajes pronombres/nombres) → retrieval conocimiento local por tags → compositor informe 13 secciones con `no_disponible` si <2 entidades o <20 palabras. Todo etiquetado `rule:v1`. IA opcional P2 vía `IAProvider.generate(dream, context, schema)` con validación Zod/JSON Schema, nunca sobrescribe `story_original`.

```js
interface IAProvider { id:string; generate(prompt, schema):Promise<unknown>; embed?(text):Promise<number[]> }
class RuleEngine implements IAProvider // default, offline
class RemoteAdapter / LocalWASMAdapter // P2, tras consentimiento
```

Claves API nunca en cliente. Si se necesita backend → `server/` separado documentado, no en PWA.

## 7. Voz y captura
V1: `webkitSpeechRecognition || SpeechRecognition` si existe + aviso “requiere red, audio sale del dispositivo”. Botón dictado en captura rápida. P2: WASM Whisper tiny (`transformers.js`) tras toggle privacidad máxima, descarga diferida por WiFi, worker separado. Nunca grabar con pantalla bloqueada (límite navegador, documentar).

## 8. Seguridad / privacidad / a11y
- Sanitizar todo render con `esc()` (ya existe en prototipos, mantener). Sin `innerHTML` con datos IA sin DOMPurify. CSP en deploy: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' (tokens); img-src 'self' data:; connect-src 'self'` (+ proveedor IA solo si activado).
- Export JSON incluye `app:"DreamOS", version:1`. Import valida + preview + rechaza sin mutar.
- Cifrado P2: AES-GCM + PBKDF2 210k iteraciones, clave en memoria, nunca localStorage. V1: advertir “depende del dispositivo, no cifrado app-level”.
- A11y: misma checklist RNF-04 de spec. Auditoría con axe + lector + teclado en Fase 5.

## 9. ADRs congelados
- ADR-001 multi-archivo (arriba). ADR-002 IndexedDB sobre localStorage (cuota, async, índices). ADR-003 sin framework V1 (peso, offline, mantenibilidad <50k LOC). ADR-004 IA OFF por defecto. ADR-005 CSS tokens, no UI kit externo (offline + coherencia Oneiric).

## 10. Entornos y despliegue
Dev: `npx serve app/` (localhost). Prod: GitHub Pages / Cloudflare Pages HTTPS + headers CSP. Versionado semver, tags `v0.1.0`. Tests: `tests/manual/15-criterios.md` + unit vitest para db/search/interpret (P2).
