# 01 — ESPECIFICACIÓN FUNCIONAL CONGELADA v1.0
> Fase 0 · Fuente de verdad funcional. Cualquier cambio posterior requiere ADR.
> Base: `00_MASTER_PLAN`, 2 prototipos, `investigacion_avanzada_suenos.md`, PDF base.

## 1. Objetivo y no-objetivos
**Objetivo:** PWA local-first en español que permite registrar sueños en <10s al despertar, consultarlos, explorar símbolos con procedencia y comparar lecturas sin imponer verdad única.
**No-objetivos V1:** diagnóstico clínico, predicción futuro, IA remota obligatoria, red social, sync nube, grabación con pantalla bloqueada, transcripción offline garantizada.

## 2. Actores y principios
- **Soñador (único actor V1):** dueño total de sus datos. Modo privado por defecto.
- Principios: captura antes que interpretación; procedencia obligatoria; abstención si faltan datos; correlación ≠ causalidad; todo inferido es corregible.

## 3. Requisitos funcionales (congelados)

### RF-01 Captura multimodal (Módulo B) — P0
1. Relato libre (textarea autoguardado cada 3s, borrador).
2. Captura rápida (título + 3 tags + emoción en <10s).
3. Registro guiado (wizard 4 pasos: quién/dónde/qué pasó/cómo sentiste).
4. Formulario estructurado (fecha, hora despertar, calidad 1-10, estrés 1-10, emoción Hall, símbolos checklist 8, relato, asociaciones).
5. Dictado voz: Web Speech API si disponible, con degradación a texto + aviso privacidad/red. Nunca prometer offline hasta verificar WASM.
6. Import JSON DreamOS con preview y validación.
- Regla: solo `título` obligatorio. Guardar borrador siempre posible. Modo noche: contraste bajo, botón grande, una mano.

### RF-02 Diario e historial (Módulo F) — P0
CRUD completo, búsqueda full-text (título+relato+reflexión+tags), filtros fecha/emoción/símbolo, orden recientes/antiguos/A-Z, tags coma-separados, favoritos (sueños y conceptos separados por prefijo `dream:`), editar/eliminar con confirmación en 2 pasos, export individual/completo. Eliminar no deja huérfanos en favoritos.

### RF-03 Inicio personal (Módulo A) — P0
CTA Registrar, último sueño, recientes (2), contadores (sueños/favoritos/% plan), estado offline/storage. Sin dashboards recargados.

### RF-04 Diccionario explorador (Módulo E) — P0 V1 curado
Búsqueda libre + alfabética + autocomplete, sinónimos, categorías, filtros perspectiva/cultura, relacionados, fuentes visibles, historial consultas (local), favoritos. V1: 17 entradas conceptuales heredadas de `Dormir` + 30-50 símbolos trazables en Fase 3. Prohibido `símbolo = significado único`.

### RF-05 Interpretación por reglas (Módulo D) — P0 sin IA
Informe por secciones solo si hay datos. Secciones V1:
1 Resumen fiel (extracto, no reescritura) 2 Elementos destacados (entidades detectadas por reglas léxicas) 3 Emociones centrales 4 Conexiones vigilia (solo si usuario aportó contexto) 5 Asociaciones personales 6-10 Lecturas por escuela rotuladas 11 Alternativas 12 Preguntas reflexión 13 Referencias+límites.
Si falta evidencia → “no disponible”, nunca relleno.

### RF-06 Patrones descriptivos (Módulo G) — P1
Recuentos y tendencias: frecuencia, emociones, símbolos/personajes top, repetitivos (título similar o tags overlap >60%). Texto legal siempre: “descriptivo, no diagnóstico”.

### RF-07 Laboratorio (Módulo H) — P1
Solo lectura V1: fuentes, conceptos, comparador escuelas, bibliografía, procedencia. Import datasets separado de UX ordinaria, con cuarentena y revisión.

### RF-08 Ajustes y privacidad (Módulo I) — P0
Tema system/light/dark, idioma ES (i18n-ready), escuelas preferidas (filtra D), entradas habilitadas, uso IA (default OFF local), consentimiento externos explícito, export/borrado total, backup, storage summary bytes, bloqueo PIN (Fase 3, no prometer cripto real en V1 demo).

## 4. Requisitos no funcionales
- **RNF-01 PWA:** instalable vía Manifest + SW cuando se sirva por HTTPS/localhost. Single-file actual es demo, no prod.
- **RNF-02 Offline:** tras primera carga, diario+captura+búsqueda local funcionan sin red. Banner offline.
- **RNF-03 Rendimiento:** first paint <1.5s en móvil medio, búsqueda <100ms con 1000 sueños (índice en memoria + IndexedDB).
- **RNF-04 Accesibilidad WCAG 2.2 AA:** skip-link, focos visibles, nav teclado, lectores pantalla (roles dialog/status/progress), contraste ≥4.5:1 texto, reduced-motion, touch ≥44px, labels en todo input.
- **RNF-05 Privacidad:** cero red por defecto. Sin telemetría V1. Export no incluye claves. Import rechaza >5MB o estructura inválida sin corromper store.
- **RNF-06 Compatibilidad:** Chrome/Edge/Safari/Firefox últimas 2 versiones. Degradación voz y PWA documentada.

## 5. Historias usuario (aceptación mínima)
- HU-01 “Al despertar con fragmento”: abro → +Registrar → escribo título+3 palabras → Guardar → lo veo en recientes tras recargar. <10s.
- HU-02 “Edito sin perder”: edito relato → recargo → persiste + updatedAt cambia, createdAt no.
- HU-03 “Busco agua”: busco “agua” → aparecen sueños y entradas conocimiento con ese tag.
- HU-04 “No me inventes”: pido interpretación con relato de 1 frase → sistema dice “datos insuficientes” + preguntas, no genera 13 secciones rellenas.
- HU-05 “Exporto y recupero”: exporto JSON → borro todo → importo → todo vuelve. Archivo corrupto → toast error, diario intacto.

## 6. Flujos críticos
Captura: Inicio CTA → Modal/Form (autoguardado) → Guardar → Toast → Recientes actualizan → Stats. Edición: mismo modal precargado. Eliminación: pre-confirm inline (no `confirm()` nativo). Búsqueda global: si match conocimiento → vista conocimiento, si solo diario → vista diario, si nada → toast + vista conocimiento vacía. Import: file → parse → validar schema v1 → preview conteos → Confirmar → merge por id (no duplicar uuid).

## 7. Estados y errores (obligatorios)
Vacíos con ilustración+CTA, loading skeleton, error storage lleno, error import (tipo/tamaño/schema), offline banner, foco atrapado en modal + ESC cierra, toast 2.6s con `role=status`.

## 8. Matriz trazabilidad V1
| Módulo | Prototipo base | Estado V1 |
|---|---|---|
| A Inicio | Dormir hero+stats | Implementar fusión |
| B Captura | Sueño form estructurado + Dormir modal rápido | Fusión (rápido + estructurado) |
| F Diario | Dormir (más completo) | Adoptar Dormir |
| E Conocimiento 17 entradas | Dormir KNOWLEDGE | Adoptar + ampliar |
| Método pipeline | Ambos | Adoptar Dormir 8 pasos |
| Visual | Sueño glass | Tokens + atmósfera |

Congelado Oct 2026. Cambios → ADR en `docs/05_ADR/`.
