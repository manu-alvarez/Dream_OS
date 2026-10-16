# 06 — VÍAS ALTERNATIVAS (soluciones autónomas a los bloqueos) v1.0
> Problema → vía legal → prueba descargada → estado. Nada queda bloqueado sin alternativa.

## 1. Scribd / Academia / DOKUMEN (copyright incierto) → NO copiar; sustituir por OA + síntesis propia
- **OpenAlex API (CC0, sin clave):** descargado `research/vias_alternativas/openalex_rsos.json` — 5 trabajos OA verificados: RSOS 2020 (doi:10.1098/rsos.192080, OA True), Zenodo 3997866, clocks&sleep 2020 OA, arXiv:2302.14828 (emoción con LLMs, OA), RSOS epidemic-dreams OA. + `openalex_hvdc.json` (12 trabajos HVDC para bibliografía, 1 OA).
- **Regla 90/90:** resúmenes propios ≤90 palabras + ≤90ch por cita, con DOI. Sin PDFs ajenos en el repo.
- **Diccionario A-Z propio:** ya construido (`knowledge_base.json`, 41 símbolos multicorriente) en vez de copiar diccionarios ajenos. Ampliable con Wiktionary (CC BY-SA, con atribución) y WordNet (licencia Princeton) en P2.
- **Contacto autores:** plantillas en `research/solicitudes/PERMISOS_templates.md` (T2). Sin respuesta → metadatos + enlace.

## 2. DreamBank bulk (requiere permiso) → hechos + normas + n=1 local
- **Hechos no protegibles:** porcentajes e índices publicados (Friends%, F/C, A/F%...) se citan como datos con fuente, sin copiar relatos. Norma: ningún relato DreamBank en el repo.
- **Corpus longitudinal propio:** el usuario es su propio corpus (n=1). Para demo sin datos reales: `data/seed/demo_dreams.json` — 12 relatos CC0 inventados (río recurrente demo-01→07, examen, vuelo lúcido...), válidos contra el schema.
- **Permiso formal:** plantilla T1 (EN) lista para UCSC. Hasta entonces: enlace + cita, cero bulk.

## 3. Domhoff 1996 completo (protegido) → páginas abiertas + guía eBiblio
- **Páginas UCSC abiertas** (fmid2/fmid8) como referencia enlazada + síntesis propia ya en base (k-hall*). Sin copiar capítulos.
- **eBiblio (préstamo ES):** guía en app (P2): el usuario toma prestado, anota con sus palabras (uso personal) y el app solo guarda sus notas. La app nunca distribuye el libro.
- **Ediciones PD reales descargables:** `archive_freud_editions.json` prueba 20 ediciones; PD seguros por fecha: 1797 Mother Shipton, 1865 Grant, Freud 1900/1913 (Gutenberg), Artemidoro 1539/1755/1805. Solo esos se enlazan como descarga; Stekel 1943 y Lewis 1996 quedan como consulta.

## 4. Archivos prueba (todos en repo, KBs)
- `research/vias_alternativas/openalex_hvdc.json`, `openalex_rsos.json`, `archive_pd_dreams.json`, `archive_freud_editions.json` — metadatos, no obras. Verificados hoy por script (conteos impresos en log).
- Próximo nivel (P2): job que revalida OA/licencias trimestralmente + importador Zotero/BibTeX + donación voluntaria de sueños anonimizada (opt-in, consentimiento granular).

Nivel subido: de 17 conceptos demo → 69 entradas + 12 demos + bibliografía OA viva, todo legal y offline.
