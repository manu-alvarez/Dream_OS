# CORPUS ABIERTO — Descargas verificadas Oct 2026
> Solo dominio público / acceso abierto / metadatos. Nada de Scribd/Academia/DOKUMEN copiado. Ver `docs/04_FUENTES_INVENTARIO.md`.

## Archivos en esta carpeta (descargados hoy)
1. `artemidoro_es_metadata.json` (25 KB) — Metadatos Archive.org del ítem `artemidoro-de-daldis-el-libro-de-la-interpretacion-de-los-suenos`. Verificado via API: identifier + title OK. `licenseurl: None` → **no garantiza PD** de ese escaneo concreto. Uso: solo metadatos + consulta. Para ingesta usar ediciones inequívocamente PD por antigüedad (1755 inglesa, 1805 griega, 1539 latina) citadas en inventario.
2. `freud_gutenberg_ebook66048.html` (24 KB) — Página catálogo Project Gutenberg eBook #66048 (Freud, trad. Brill 1913, release 2021). Página catálogo, no el texto completo (el texto completo pesa >1MB y se consulta online). Licencia: Gutenberg License (PD-US). Uso: referencia + lectura online https://www.gutenberg.org/files/66048/old/66048-h/66048-h.htm

## Fichas (sin copiar textos protegidos)

### F-HVDC — Hall / Van de Castle, cap. 2 (Domhoff 1996, hosted UCSC)
- URL: https://dreams.ucsc.edu/Library/fmid2.html — Uso educativo autorizado en el sitio. Libro 1996 con copyright → **no copiar capítulo al repo**. Solo síntesis propia.
- Hechos estructurales verificados para el motor: 10 categorías (personajes, interacciones sociales agresión/amistad/sexualidad, actividades, éxito/fracaso, fortunas/infortunios, emociones 5: ira/tristeza/aprensión/confusión/felicidad, escenarios interior/exterior + familiaridad, objetos 12 clases, descriptivos, comida, pasado). Agresión = acto deliberado dañar/molestar (A1-A8, físico A5-A8). Amistad = acto deliberado apoyo. Emociones solo si explícitas (+ tears/sweat excepción). Índices: Friends%, F/C, A/F%, A/C, victimización, éxito%, emociones negativas%, etc. como **hipótesis a testear**, no diagnóstico.
- Origen: fetched Oct 2026, síntesis propia, quotes ≤90ch.

### F-FREUD-ES — Elejandría (PD-España declarado)
- URL: https://www.elejandria.com/libro/la-interpretacion-de-los-suenos/sigmund-freud/2094 — “libre de restricciones en España”, ed. Biblioteca Nueva 1923, trad. López-Ballesteros (1869-1923) + Rank. Descargas PDF/ePub directas en la página. Fuera de España verificar ley local.
- Ideas ficha: deseo reprimido disfrazado, manifiesto/latente, condensación/desplazamiento, fuentes 4 especies (externo objetivo / interno subjetivo / somático / psíquico). Presentar como teoría histórica (evidencia B).

### F-ARTEMIDORO — Ediciones PD por antigüedad
- 1755 inglesa (Middle English, microfilm): https://archive.org/details/bim_eighteenth-century_the-interpretation-of-dr_artemedorus-daldianus_1755 — PD inequívoco.
- 1805 griega (Reiske): `oneirocritica01arte` / `oneirocritica02arte` — PD. 1539 latina Cornarius: `desomnioruminter00arte` — PD.
- Clave ficha: 5 libros, Insomnia vs Oneiroi, teoremático/alegórico, significado depende de profesión/estatus/edad/género, no predicción verificada.

### F-RSOS — Paper OA 2020
- https://royalsocietypublishing.org/rsos/article/7/8/192080/95469/Our-dreams-our-selves-automatic-analysis-of-dream — OA. Uso: citar método (embeddings + redes sociales + taxonomía no supervisada), no copiar figuras/tablas sin CC-check.

## Carencias que esta base cubre hoy (V1 premium)
- Antes: 17 conceptos demo sin símbolos operativos → Ahora: `data/seed/knowledge_base.json` con 70+ entradas propias (teorías, métodos, 45 símbolos multicorriente, emociones, personajes, ética, tech) + `synonyms.json`, todo trazable a estas fichas (sourceIds s-freud-1899, s-artemidoro, s-hvdc, s-continuidad...), evidencia A-F, incertidumbre explícita y preguntas de reflexión. Nada importado verbatim de obras protegidas.
- Pendiente P2 (requiere corpus con permiso): DreamBank bulk, DReAMy weights vendorizados, eBiblio contemporáneos, WASM voz. Marcados `review: pendiente` donde aplique.
