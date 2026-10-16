# 04 — INVENTARIO FUENTES VERIFICADO v1.0 (Oct 2026)
> Política: consultar ≠ descargar ≠ redistribuir. Nada se ingiere sin licencia verificada. Todo lo no verificado = evidencia F.
> Campos por fuente: URL, autor/org, tipo, cobertura, tamaño, formatos, acceso, licencia, redistribución, calidad, checkedAt.

## 1. Corpus empíricos (entrenamiento/validación, no redistribuibles por defecto)

| ID | Fuente | URL | Cobertura / Tamaño | Acceso/Licencia | Uso DreamOS | Evidencia |
|---|---|---|---|---|---|---|
| s-dreambank | DreamBank UCSC | https://www.dreambank.net/ | 20k+ relatos EN, codificados Hall/Van de Castle | Consulta web, descarga parcial con cita. No redistribuir bulk sin permiso. checked 2026-10-16 | Inspiración taxonomía + validación. No copiar relatos a repo. | A (existencia), C (utilidad individual) |
| s-hvdc | Hall/Van de Castle System | https://dreams.ucsc.edu/Library/fmid2.html | Manual categorías | Consulta libre académica | Reglas extracción V1 | B |
| s-rsos | Our dreams, our selves (RSOS 2020) | https://royalsocietypublishing.org/rsos/article/7/8/192080/95469/Our-dreams-our-selves-automatic-analysis-of-dream | Paper OA | OA, citar | Fundamento BERTopic+redes sociales | A |
| s-dreamy | DReAMy-lib HuggingFace | https://huggingface.co/DReAMy-lib | Modelos BERT emoción sueños, F1~0.83 reportado | Open weights (ver licencia por modelo) | Solo referencia P2, no vendorizar aún | C (requiere repro) |
| s-bertopic | BERTopic | https://github.com/MaartenGr/BERTopic | Lib clustering temas | Apache-2.0 | P2 analítica, no V1 | D |

## 2. Clásicos dominio público (únicos ingeribles V1 con limpieza)

| ID | Obra | URL | Licencia | Estado |
|---|---|---|---|---|
| s-freud-1899 | Freud Interpretación sueños (1899) ES | https://www.elejandria.com/libro/la-interpretacion-de-los-suenos/sigmund-freud/2094 | Dominio público (verificar edición/traducción) | ✅ Citable, snippet corto OK. No pegar obra completa sin verificar traductor. B |
| s-artemidoro | Artemidoro Oneirocritica s.II | https://archive.org/search?query=oniromancia | Varía por escaneo (muchos PD) | ⚠️ Solo ediciones PD verificadas. Contextualizar época. B |

## 3. Repositorios generales (punto partida, no corpus)
- `s-archive`: https://archive.org/search?query=interpretacion+de+los+sue%C3%B1os — millones escaneos, licencias mixtas. Usar solo filtros `public domain`. No scrapear violando TOS.
- `s-ebiblio`: préstamo bibliotecas ES (ej. Clara Tahoces) — préstamo, no descarga libre. Solo cita.
- `s-scribd` / `s-academia`: https://www.scribd.com/search?query=significado+de+los+sue%C3%B1os+pdf / https://www.academia.edu/search?q=diccionario%20de%20sue%C3%B1os — uploads usuarios, copyright incierto. **Prohibido ingerir a repo.** Solo descubrir + pedir permiso.
- `s-dokumen`: DOKUMEN.PUB copias Artemidoro — procedencia dudosa, no usar como fuente canónica.

## 4. Web Crypto / PWA (técnicas, libres)
- MDN Web Crypto: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API — doc libre.
- MDN PWA + W3C Manifest — estándares abiertos.

## 5. Política adquisición congelada
1. Registrar toda fuente con los 11 campos antes de usar. 2. Semáforo: 🟢 PD/MIT/Apache/OA verificado → ingerible con atribución. 🟡 préstamo/API con TOS → solo consulta/manual. 🔴 upload sin licencia → bloqueado. 3. Snippets ≤90 caracteres con cita, salvo PD. 4. `data/seed/` solo 🟢 + `sourceIds`. 5. Revisión trimestral licencias. 6. Nada de eludir paywalls/CAPTCHA/TOS.

## 6. Qué SÍ entra en V1 (curado, trazable)
17 conceptos heredados prototipo (continuidad, Hall, Freud, Jung, Artemidoro, símbolos, personal, emociones, personajes, RAG, BERTopic, local-first, privacidad, voz, incertidumbre, ontología) con evidencia B/D + 30-50 símbolos Fase 3 solo de 🟢 con variantes culturales y `limitations` explícitas. Nada de “biblioteca total”.

checkedAt global: 2026-10-16. Responsable: Director arquitectura (Agente 0).
