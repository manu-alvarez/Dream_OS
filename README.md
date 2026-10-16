# Dream_OS — Laboratorio personal de exploración onírica

PWA local-first, privada y extensible para registrar, explorar, interpretar y estudiar sueños desde múltiples perspectivas, sin imponer verdades universales.

**Principio:** primero comprender relato + persona → contrastar marcos → presentar posibilidades razonadas.

- 📖 Master Plan: [`docs/00_MASTER_PLAN_COGNITIVO.md`](docs/00_MASTER_PLAN_COGNITIVO.md)
- 🔬 Investigación base: `investigacion_avanzada_suenos.md` + `Datos_PWA_Interpretacion_Sueños.pdf.pdf`
- 🧪 Prototipos: `JartOS_de_Dormir.html` (funcional) + `JartOS_de_Sueño.html` (glass premium)

## Estado
Fase 0 — Auditoría y especificación. Repo recién creado, plan v1.0 commiteado.

## Estructura objetivo (Fase 2+)
```
app/ → PWA multi-archivo (index.html, manifest.webmanifest, sw.js, css/, js/, assets/)
docs/ → spec, arquitectura, modelo datos, fuentes
prototypes/ → históricos preservados
research/ → corpus e inventario (licencias verificadas)
```

## Privacidad
Local-first. Sin backend. Sin IA remota por defecto. Export/import JSON validado.

## Siguiente paso
Congelar `docs/01_ESPECIFICACION`, `02_ARQUITECTURA`, `03_MODELO_DATOS`, `04_FUENTES` → luego fusión prototipos a `app/` con IndexedDB + SW.

Repo: https://github.com/manu-alvarez/Dream_OS
