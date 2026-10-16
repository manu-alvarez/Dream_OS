# QA — 15 criterios de aceptación (v1.0 final, sin ejemplos)
> Fecha: 2026-10-16. Verificado por script donde es posible; lo que exige hardware real queda marcado para el usuario.

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| 1 | Registrar un sueño y recuperarlo tras recargar | ✅ Verificado (código) | `DB.putDream` → IndexedDB `dreamos` v1; `refresh()` en init; migración v0 con backup |
| 2 | Editar y eliminar | ✅ Verificado (código) | Modal precargado/`putDream`; borrado con confirmación + `deleteDream` |
| 3 | Buscar relatos por texto | ✅ Verificado (código) | Filtro full-text título+relato+reflexión+tags+emoción |
| 4 | Consultar símbolos desde corpus local | ✅ Verificado (datos) | `knowledge_base.json`: 69 entradas / 41 símbolos / 267 sinónimos, 0 errores de validación |
| 5 | Interpretaciones diferenciadas por perspectiva | ✅ Verificado (código) | `interpret.js`: escuelas etiquetadas + abstención si <20 palabras o <2 entidades |
| 6 | Fuentes visibles | ✅ Verificado (código) | Cada lectura muestra `sourceIds`; detalle de entrada lista fuentes + evidencia A–F |
| 7 | Exportar e importar datos válidos | ✅ Verificado (código) | Export JSON `DreamOS v1`; import valida `app/version/dreams[]`, merge por id |
| 8 | Rechazar malformados sin corromper | ✅ Verificado (código) | `try/catch`, límite 5 MB, validación de forma; error → toast, diario intacto |
| 9 | Offline tras preparación inicial | ✅ Implementado / ⓟ dispositivo | SW `dreamos-v1.0.0`: precache 16/16 archivos existentes, `offline.html` de fallback |
| 10 | Móvil utilizable | ✅ Verificado (diseño) | Tabbar fija, stats 3col, hero 62vh, safe-area, touch 44px+, ripple táctil |
| 11 | Vacíos y errores gestionados | ✅ Verificado (código) | Empty states con CTA, toasts `role=status`, banner offline, ESC cierra modal |
| 12 | Control de servicios externos | ✅ Verificado (código) | Cero llamadas obligatorias; fuentes Google Fonts progresivas; voz con aviso de red |
| 13 | No inventar referencias | ✅ Verificado (diseño) | `sourceIds` solo de `sources` conocidas (script: 0 desconocidas); sin IA generativa |
| 14 | Distinguir hechos/hipótesis/personal | ✅ Verificado (diseño) | Observación / hipótesis / asociación separadas; límites y preguntas siempre visibles |
| 15 | Accesibilidad y compatibilidad | ✅ Implementado / ⓟ dispositivo | skip-link, focos, roles, labels, reduced-motion, contraste AA en texto |

ⓟ = pendiente de prueba en dispositivo del usuario (instalación, recarga offline en avión, dictado).
Scripts: `node --check` 6/6 OK · 37/37 ids resueltos · 0 cadenas demo · 0 versiones en UI · SW 16/16.
