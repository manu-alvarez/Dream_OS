# DreamOS — MASTER PLAN COGNITIVO v1.0
> Plataforma PWA universal de exploración, interpretación y conocimiento onírico.
> Nombre provisional: DreamOS / JartOS. Idioma inicial: ES. Arquitectura: local-first, instalable, offline, privada y extensible.

**Principio rector:** cada sueño es una experiencia personal que puede estudiarse desde múltiples perspectivas; ninguna interpretación generada debe confundirse con una verdad universal.
**Regla central:** primero comprender relato + persona → después contrastar marcos → finalmente presentar posibilidades razonadas, no significados impuestos.

---

## 0. COMPRENSIÓN VERIFICADA — Inventario de entrada

Revisados íntegramente en `/Dream_OS`:

1. **`investigacion_avanzada_suenos.md` (Oct 2026, 76 líneas)**
   - Parte 1: Repositorios (DreamBank 20k+ relatos UCSC, Internet Archive, Academia/Scribd, Elejandría).
   - Parte 2: Puente epistemológico Psicológico (Freud manifiesto/latente, condensación/desplazamiento; Jung inconsciente colectivo, arquetipos, amplificación) ↔ Místico-esotérico (Artemidoro Insomnia/Oneiroi, simbología como matriz jeroglífica).
   - Parte 3: Plantilla Diario v1.0 (ID, fecha, hora despertar, calidad 1-10, estrés 1-10, narrativo semántico, checklist símbolos: agua, caída/vuelo, animales, persecución, muerte/nacimiento, tecnología; mapeo psicológico + tradicional; núcleo emocional).

2. **`Datos_PWA_Interpretacion_Sueños.pdf.pdf` (42 citas)**
   - Aporta: correspondencia teoría→computación (Freud=query expansion, Jung=RAG+vector DB, Artemidoro=perfilado contextual), hipótesis continuidad, sistema Hall/Van de Castle (personajes, interacciones agresión/amistad/sexualidad, emociones ira/tristeza/aprensión/confusión/felicidad, escenarios, éxitos/fracasos, fortunas/infortunios, actividades), NLP (BERTopic UMAP+HDBSCAN+c-TF-IDF, DReAMy-lib F1>0.83, T5 seq2seq, JSON estructurado), PWA local-first (IndexedDB + wrapper promesas, Service Worker, CRDT sync), Web Crypto AES-GCM+PBKDF2, captura acústica (Web Speech API vs WASM Whisper local), modo preservación oscuridad + notificaciones diferidas.

3. **`JartOS_de_Sueño.html` (810 líneas, dark glassmorphism)**
   - Estilo: Aurora Glass, círculos concéntricos, radial #20163b→#090614, acento #c4a7ff, gold #f4d068. Nav lateral → bottom-bar móvil. Vistas: Dashboard / Diario estructurado (datetime-local, sliders calidad/estrés, checkboxes 8 símbolos, emoción Hall, análisis) / Conocimiento 7 tarjetas / Arquitectura. Persistencia: `localStorage dreamos_data_v1`. Sin SW real, sin IndexedDB, sin IA.

4. **`JartOS_de_Dormir.html` (167 líneas, light/dark system)**
   - Más maduro funcionalmente: Inicio+stats, Diario con búsqueda/filtro emoción/orden, Conocimiento 17 entradas con categorías Ciencia/Psicología/Historia/Personal/Método/Tecnología/Ética + favoritos, Método pipeline 8 pasos, Plan proyecto 5 tareas persistentes, Favoritos, Ajustes (export/import JSON validado 5MB, tema system/light/dark, storage summary). Persistencia: `localStorage dreamos.demo.v1`. Manifest Data-URI, beforeinstallprompt, offline banner. Sin SW, sin IndexedDB.

5. **Respuestas A/B + Meta Prompt Maestro del chat**
   - Respuesta A/B: foco en descargas (Freud Elejandría, Artemidoro DOKUMEN.PUB/Archive, Sun/Clara Tahoces eBiblio, Scribd/Academia diccionarios A-Z). Útil como semilla, no como corpus verificado.
   - Meta Prompt v1.0 (secciones 0-15): define orquestación 9 agentes, política multicorriente, pipeline 10 fases, módulos A-I, contrato datos, seguridad, plan fases 0-5, contrato entrega 20 artefactos, 15 criterios aceptación.

### Clasificación epistemológica obligatoria (A-F)
- **A. Hallazgo empírico:** hipótesis continuidad, prevalencia afecto negativo, decaimiento recuerdo <5min hipnopómpico, límites localStorage (~5MB) vs IndexedDB, Web Speech requiere red en Chrome.
- **B. Modelo teórico/histórico:** Freud, Jung, Artemidoro, Hall/Van de Castle (reglas codificación).
- **C. Hipótesis pendiente:** RAG onírico mejora interpretación, BERTopic revela topografía personal, correlación estrés↔agresión onírica a nivel individual.
- **D. Recomendación arquitectura:** local-first, IndexedDB, SW, Web Crypto, adaptadores IA, JSON Schema.
- **E. Propuesta no implementada:** transcripción offline WASM, cifrado AES-GCM, sync CRDT, embeddings locales, grabación con pantalla bloqueada.
- **F. Necesita corrección:** “biblioteca total/universal” (no existe cobertura verificada), “biometría = clave cripto accesible a PWA” (falso), “single-HTML = PWA full offline/instalable” (falso sin SW+HTTPS), licencias Archive/Scribd/Academia (consultar ≠ descargar ≠ redistribuir).

> No se afirma corpus total, ni descargas ilegales, ni IA real integrada. Todo lo no verificado va como `no disponible / pendiente`.

---

## 1. DIRECCIÓN ESTRATÉGICA — No un diccionario, un laboratorio

**DreamOS = laboratorio personal:** captura ultrarrápida al despertar + motor multicorriente + inteligencia longitudinal + plataforma privada extensible.

4 pilares:
1. **Captura (fricción cero):** texto libre, dictado voz (si navegador permite), captura rápida fragmentos, registro guiado, formulario estructurado, importación JSON. Borrador sin campos obligatorios salvo título. Modo noche una mano, mínima luz.
2. **Motor multicorriente:** científico/neurocognitivo, freudiano, junguiano, histórico/tradicional, personal/autobiográfico + comparador lado a lado. Cada lectura: perspectiva, elementos que la motivan, fuente, asociaciones, incertidumbre, alternativas, preguntas reflexión.
3. **Inteligencia longitudinal:** historial consultable, recurrencias, emociones, símbolos, personajes, estrés autodeclarado (descriptivo, nunca diagnóstico, correlación ≠ causalidad).
4. **Privada y extensible:** PWA instalable, offline-first, IndexedDB, export/import, arquitectura lista para IA (remota/local/determinista), RAG, embeddings.

---

## 2. ALCANCE FUNCIONAL MVP (Módulos A-I)

- **A Inicio:** registrar, último sueño, resumen, recientes, recurrentes, estado storage/offline. Sin sobrecarga stats.
- **B Captura:** 6 entradas seleccionables + metadatos (fecha, hora despertar, calidad, emociones, estrés, contexto opcional). Degradación progresiva voz.
- **C Análisis:** extracción personajes/acciones/lugares/objetos/transformaciones/emociones/secuencia/conflictos/temas/ambigüedad. Inspiración Hall/Van de Castle sin reclamar certificación. Todo corregible.
- **D Interpretación:** informe 13 secciones adaptativas (resumen fiel → elementos → emociones → conexiones vigilia → asociaciones → lecturas psi/cognitiva/freudiana/junguiana/histórica/esotérica etiquetada → alternativas → preguntas → referencias+límites). Secciones sin datos = “no disponible”.
- **E Diccionario:** A-Z, libre, autocomplete, sinónimos, categorías iniciales (personas, animales, agua, fuego, naturaleza, vivienda, vehículos, dinero, muerte, nacimiento, persecución, caída, vuelo, pérdida, transformación, tecnología, escenarios, fenómenos), filtros escuela/cultura/época, relacionados, fuentes, historial, favoritos.
- **F Diario:** CRUD, búsqueda full-text, filtros fecha/emoción/símbolo/categoría, tags, favoritos, comparar, revisiones, export individual/completo.
- **G Patrones:** frecuencia recuerdo, emociones, símbolos/personajes/escenarios, temas por periodo, repetitivos, estrés vs relato. Solo descriptivo.
- **H Laboratorio:** fuentes, conceptos, comparador escuelas, motivos culturales, bibliografía, procedencia, import datasets autorizados, grafo semántico, export investigación. Separado de UX ordinaria.
- **I Ajustes:** tema, idioma (ES primero, i18n-ready), escuelas preferidas, entradas habilitadas, uso IA, consentimiento externos, export/borrado, bloqueo, backup, storage.

V1 prioriza: A+B+F+E-básico+I + D-reglas (sin IA real) + offline. G/H avanzado en Fase 4.

---

## 3. MOTOR COGNITIVO — Pipeline 10 fases

1 Captura → 2 Normalización (copia trabajo, original intacto) → 3 Extracción → 4 Validación humana → 5 Recuperación conocimiento → 6 Análisis por perspectivas (solo seleccionadas) → 7 Síntesis comparativa → 8 Validación salida (estructura, refs, no-invención) → 9 Presentación (desplegables, niveles) → 10 Persistencia (versión, fecha, método, refs, privacidad).

Tipos salida: `observación | asociación_usuario | concepto_fuente | hipótesis | síntesis_IA | no_disponible`. Abstención obligatoria si faltan datos. Sueño+docs = datos no confiables, nunca instrucciones. JSON Schema por entidad.

---

## 4. ARQUITECTURA TÉCNICA (estándares oficiales)

**Stack referencia:** HTML5 semántico, CSS tokens + responsive, JS modular ES, IndexedDB (idb wrapper), Service Worker + Web App Manifest (W3C/MDN), Web Crypto API, JSON import/export validado, adaptadores IA explícitos. Multi-archivo (no single-HTML para prod). Sin framework obligatorio en V1.

**Capas 11:** 1 Presentación 2 Navegación/estado 3 Casos uso/dominio 4 Captura/análisis 5 Repositorios 6 Catálogo conocimiento 7 Adaptadores IA 8 Persistencia/cifrado 9 Instalación/caché/offline 10 Import/export/migraciones 11 Telemetría opcional consentida. UI nunca llama directo a proveedor modelo.

**Persistencia:** IndexedDB + versionado + migraciones + cuota handling + backup + export JSON + import con preview + borrado. Cifrado opcional AES-GCM + PBKDF2/Argon2, clave nunca en plain, explicar límites. Nada de “biometría = clave PWA”.

**Offline:** caché app-shell, página offline, diario local, captura/edición sin red, corpus precargado, cola pendientes, update explícito, recovery. Sin CDN para arranque.

**IA:** interfaz común proveedores (remoto API, local server-compatible, WASM navegador, determinista fallback). RAG corpus autorizado + embeddings opcional + validación estructurada. Claves nunca en cliente. Sin backend = “pendiente configuración”. Prohibido simular IA.

Ref: MDN PWA, W3C Manifest, WCAG 2.2 AA, JSON Schema, Hall/Van de Castle UCSC.

---

## 5. MODELO DATOS (contrato versionado)

Entidades: `Dream, DreamSegment, DreamCharacter, DreamEvent, DreamEmotion, DreamSymbol, DreamSetting, DreamInterpretation, InterpretationPerspective, KnowledgeEntry, KnowledgeSource, BibliographicReference, UserAssociation, AnalysisRun, AppSettings`.

- Dream: uuid, createdAt/updatedAt, date, wakeTime?, title, story_original (inmutable), story_work?, quality?, stress?, emotions[], tags[], reflection?, status.
- Interpretation: method+version, perspectives[], sources[], confidence documental (no score psi numérico sin validación), limitations[], alternatives[].
- KnowledgeEntry: id estable, término, sinónimos, categoría, descripción neutral, contextos, asociaciones sugeridas, interpretaciones por escuela, variantes culturales, refs, sourceId, snippet (si licencia), evidencia (A-F), versión, relaciones, revisión, confianza documental.

Relaciones y cardinalidades + ejemplos JSON + migraciones en `docs/03_MODELO_DATOS.md`.

---

## 6. DISEÑO UX/UI — Oneiric Intelligence (premium, no plantilla)

Investigación visual + comparativa multi-asistente con misma ficha evaluación. Dirección: editorial digital + astronomía + cartografía mental + abstracción orgánica + tech discreta. Sensación: profundidad, calma, intimidad, descubrimiento, rigor.

- Paleta tokens: azul noche profundo, índigo, grafito, petróleo mineral, lavanda/violeta acento, marfil lectura, dorado tenue detalles. Contraste verificado, no asumir degradado/transparencia accesible.
- Tipo: editorial serif títulos (ej. Instrument Serif) + sans UI (DM Sans/Manrope) + lectura prolongada. Verificar licencia/carga/ES.
- Recursos selectivos: degradados atmosféricos, glass, sombras suaves, capas, grafo relaciones, mapa símbolos, timelines, ilustración abstracta original, microtransiciones, skeleton loading. Prohibido: brillo gratuito, partículas distractoras, esoterismo cliché.
- Móvil: CTA única, bottom-nav, touch 44px+, forms progresivos, áreas lectura, safe-area, teclado virtual, reduced-motion, modo captura nocturna.
- Desktop: side-nav, comparador perspectivas, consulta fuentes, analítica.
- Componentes: tarjetas, buscadores, selectores, diálogos, forms, gráficos, tags, paneles, empty/error. Estados: rest/hover/focus/loading/success/error/disabled.

Fusión prototipos: tomar madurez funcional de `Dormir` + atmósfera glass de `Sueño`.

---

## 7. SEGURIDAD, ÉTICA, CONFIANZA

Privacidad por diseño, minimización. Sueños = datos íntimos (usuario + terceros).
Prohibido: transmitir sin consentimiento, enviar a IA si modo local, loggear contenido personal, diagnosticar/predecir/inferir traumas/enfermedades/infidelidades, alarmismo símbolos negativos, dependencia emocional, ocultar límites, impedir export/borrado. XSS/prompt-injection/docs maliciosos: sanitizar, CSP, no HTML no-confiable de modelos. Ayuda a reflexionar, no sustituye juicio ni profesional.

---

## 8. PLAN IMPLEMENTACIÓN + ORQUESTACIÓN MULTIAGENTE

**Líneas (una spec fuente verdad, no 4 apps paralelas):**
- A Investigación/conocimiento: corpus, biblio, taxonomía, esquemas.
- B Diseño/XD: visual, prototipos, tokens, componentes, a11y.
- C Ingeniería: PWA, persistencia, búsqueda, interpretación, import/export.
- D Auditoría: pruebas, privacidad, a11y, calidad científica, funcional.

Agentes 0-8 (director, científico, historiador, conocimiento, IA, creativo, frontend PWA, seguridad/a11y, QA) — si no hay subagentes, fases diferenciadas. Documentar discrepancias, resolver por evidencia.

**Fases:**
- 0 Auditoría/spec: inventario, matriz requisitos, fuentes, riesgos, casos uso, aceptación, ADRs, alcance V1. ← ESTAMOS AQUÍ
- 1 Diseño: IA, mapa nav, flujos, wireframes, design system, tokens, componentes, móvil/desktop, errores/a11y.
- 2 Núcleo: navegable, diario, captura, IndexedDB, búsqueda, diccionario curado, export/import, manifest+SW, offline básico.
- 3 Interpretación: extracción, catálogo perspectivas, retrieval, reglas+fuentes, adaptador IA opcional, validación, comparador.
- 4 Analítica/lab: historial avanzado, temporal, recurrentes, gráficos, explorador fuentes, grafo, herramientas.
- 5 Auditoría: funcional, seguridad, a11y, rendimiento, compat. No marcar done solo por generar código.

---

## 9. CONTRATO ENTREGA (20) + ACEPTACIÓN (15)

Entrega: 1 resumen ejecutivo 2 spec funcional 3 arquitectura 4 design system 5 modelo datos 6 inventario fuentes 7 código 8 manifest 9 SW 10 persistencia 11 búsqueda 12 motor inicial 13 dataset inicial doc 14 adaptadores IA+ejemplo 15 tests auto/manuales 16 guía instalación 17 despliegue 18 seguridad/privacidad 19 limitaciones 20 roadmap. Si ZIP / multi-archivo / single-HTML autónomo honesto (límites declarados). Demo data ficticia marcada.

Aceptación: No implementado / Parcial / Implementado / Verificado / Bloqueado externo. Solo verificado con evidencia reproducible.
V1 debe pasar: 1 registrar→recargar 2 editar/eliminar 3 buscar 4 consultar símbolos local 5 perspectivas diferenciadas 6 fuentes visibles 7 export/import válido 8 rechazar malformado sin corromper 9 offline tras setup 10 móvil usable 11 vacíos/errores 12 control externos 13 no inventar refs 14 distinguir hechos/hipótesis/personal 15 a11y+compat flujos críticos.

---

## 10. RITMO PROPUESTO (paso a paso, a tu ritmo)

1. ✅ Repo `Dream_OS` creado + este Master Plan commiteado.
2. Siguiente: `docs/01-04` (spec, arquitectura, modelo, fuentes) para congelar contratos.
3. Luego: Design tokens + fusión prototipos → `app/` PWA multi-archivo con IndexedDB+SW.
4. Después: diccionario curado inicial (30-50 símbolos trazables) + motor reglas.
5. QA 15 pruebas + release v0.1.0 + deploy GitHub Pages / HTTPS.
¿Seguimos con paso 2 a tu señal? Puedo ir a tu ritmo, confirmas cada fase.

---
*Generado Oct 2026. Fuentes punto partida (noafirman descarga libre total): DreamBank, Archive, Elejandría, UCSC HVDC, Royal Society RSOS, BERTopic, DReAMy-lib. Licencias por verificar por fuente en inventario.*
