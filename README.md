# Dream_OS — Laboratorio personal de exploración onírica

PWA local-first para registrar, explorar, interpretar y estudiar sueños desde múltiples perspectivas, sin imponer verdades universales.

## Ejecutar

Desde la raíz del repositorio, con Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abre http://localhost:8000/app/. El service worker requiere localhost o HTTPS. No abras index.html mediante file://.

## Estructura

- `app/`: aplicación PWA, IndexedDB, service worker, corpus y recursos locales.
- `docs/`: especificación, arquitectura, modelo de datos y fuentes.
- `data/seed/`: datos iniciales.
- `research/`: corpus e inventario de investigación.
- `JartOS_de_Dormir.html` y `JartOS_de_Sueño.html`: prototipos históricos conservados.

## Estado y calidad

La PWA multiarchivo está implementada. Consulta los [15 criterios de aceptación](tests/manual/15-criterios.md), que documentan una revisión previa; las pruebas de instalación, offline y dictado en dispositivos reales siguen pendientes. El control automatizado estático se ejecuta con Node.js 22 mediante `node --test tests/static.test.cjs`.

## Privacidad

Local-first, sin backend ni IA remota obligatoria. Exportación e importación JSON. Algunas funciones del navegador, como el dictado, y recursos externos opcionales pueden requerir red.

## Documentación

- [Master Plan](docs/00_MASTER_PLAN_COGNITIVO.md)
- [Especificación](docs/01_ESPECIFICACION_FUNCIONAL.md)
- [Arquitectura](docs/02_ARQUITECTURA_TECNICA.md)
- [Investigación base](investigacion_avanzada_suenos.md)
