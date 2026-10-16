# 03 — MODELO DE DATOS + CONTRATO JSON v1.0
> Versionado. `createdAt` inmutable. `story_original` nunca se reescribe. Todo inferido es corregible y lleva `method+version`.

## 1. Diagrama relaciones (texto)
`Dream 1—* DreamSegment, DreamCharacter, DreamEvent, DreamEmotion | Dream 1—* DreamSymbol (vía segmentos) | Dream 1—* DreamInterpretation (cada run) | DreamInterpretation *—* InterpretationPerspective + KnowledgeEntry | KnowledgeEntry *—* KnowledgeSource via BibliographicReference | Dream 1—* UserAssociation | AnalysisRun registra cada pipeline | AppSettings singleton`

## 2. Schemas (resumen congelado, validación completa en `data/schemas/*.json` P2)

### Dream v1 (principal)
```json
{
  "id": "d-uuid7",
  "title": "Casa desconocida (max 120)",
  "date": "2026-10-16",
  "wakeTime": "07:20",
  "story_original": "texto literal intacto",
  "story_work": "copia normalizada (opcional)",
  "quality": 7, "stress": 5,
  "emotion": "Miedo|Alegría|Tristeza|Confusión|Calma|Sorpresa|Otra|",
  "tags": ["agua","vuelo"],
  "symbols": [{"term":"agua","variant":"turbulenta","span":[12,16]}],
  "characters": [{"name":"madre","relation":"familia","familiar":true}],
  "settings": [{"place":"casa","familiar":false}],
  "reflection": "asociaciones usuario",
  "favorite": false,
  "createdAt": "ISO", "updatedAt": "ISO", "status": "draft|complete|analyzed"
}
```
Reglas: `id` uuid/nanoid único, `title` required 1-120, `date` YYYY-MM-DD, quality/stress 1-10 o null, emotion enum Hall extendido, tags lower-trim-dedup.

### DreamInterpretation v1
```json
{
  "id": "i-uuid", "dreamId": "d-uuid", "method": "rule",
  "engineVersion": "1.0.0", "createdAt": "ISO",
  "summary": "resumen fiel <=280ch",
  "elements": ["agua turbulenta","madre"],
  "perspectives": [{"school":"cientifica|freudiana|junguiana|historica|personal","claim":"...","grounds":["span o elemento"],"sourceIds":["k-agua"],"uncertainty":"alta|media|baja","alternatives":["..."]}],
  "questions": ["¿Qué te evoca el agua aquí?"],
  "sourceIds": ["k-agua","k-continuidad"],
  "limitations": ["relato <20 palabras"],
  "type": "observation|hypothesis|unavailable"
}
```
Prohibido scores psi numéricos sin validación. `unavailable` obligatorio si insuficiente.

### KnowledgeEntry v1
```json
{
  "id": "k-agua", "term": "agua", "synonyms": ["mar","río"],
  "category": "símbolo|ciencia|psicología|historia|método|tecnología|ética|personal",
  "summary": "neutral 1 línea", "detail": "contexto + límites",
  "perspective": "marco al que pertenece",
  "interpretations": [{"school":"...","text":"...","sourceId":"s-artemidoro"}],
  "sourceIds": ["s-freud-1899"], "evidence": "A|B|C|D|E|F",
  "version": 1, "review": "curado|borrador|pendiente"
}
```

### KnowledgeSource + BibliographicReference
`{id, name, url, author, org, year, type:corpus|libro|paper|repo, lang, formats, access:consulta|descarga|api, license, redistribution:boolean, quality, checkedAt}` + cita APA.

### AppSettings v1
`{theme:system|light|dark, lang:es, schools: string[], voiceEnabled:bool, aiMode:off|local|remote, consentExternal:bool, aiProviderId:string|null}` — `aiMode:off` por defecto.

## 3. Ejemplos válidos
- Sueño mínimo válido: `{"id":"d-abc","title":"Vuelo","date":"2026-10-16","story_original":"","tags":[],"createdAt":"...","updatedAt":"..."}` → status draft, interpretación `unavailable`.
- Export archivo: `{"app":"DreamOS","version":1,"exportedAt":"ISO","data":{"dreams":[...],"favorites":[],"tasks":{},"theme":"system"}}` — import rechaza si `app!=DreamOS` o `version!=1` o `dreams` no array o falta `id/title`.

## 4. Migraciones
- v0 (prototipos localStorage `dreamos.demo.v1`/`dreamos_data_v1`) → v1 IndexedDB: mapear `story→story_original`, `tags string→array`, `emotion→emotion`, añadir `createdAt/updatedAt/status`, prefijar favs sueños `dream:`. Script `migrateV0toV1()` idempotente con backup `dreamos.backup.v0`.
- Regla: nunca migración destructiva sin export previo + confirmación.

## 5. Índices y rendimiento
IndexedDB idx: dreams(date, emotion, updatedAt), knowledge(cat, term). Búsqueda full-text vía índice memoria construido al boot (<100ms/1000). Validar con JSON Schema antes de cada `put`; fallo → toast + log, sin corromper store.
