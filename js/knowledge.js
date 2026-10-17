/* DreamOS knowledge.js v0.2.0 — carga base local + búsqueda léxica ES con sinónimos. */
"use strict";
const KB = {
  entries: [], synonyms: {}, byId: {}, ready: false,
  async load() {
    const [kb, syn] = await Promise.all([
      fetch("./data/knowledge_base.json").then((r) => { if (!r.ok) throw new Error("kb"); return r.json(); }),
      fetch("./data/synonyms.json").then((r) => (r.ok ? r.json() : {})),
    ]);
    KB.entries = kb.entries || [];
    KB.synonyms = syn || {};
    KB.byId = Object.fromEntries(KB.entries.map((e) => [e.id, e]));
    KB.ready = true;
    return KB.entries.length;
  },
  norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  },
  /* Extracción de entidades por coincidencia léxica: término + sinónimos contra relato+tags. */
  extract(text, tags) {
    const hay = " " + KB.norm([text, (tags || []).join(" ")].join(" ")) + " ";
    const hits = [];
    const seen = new Set();
    for (const e of KB.entries) {
      if (seen.has(e.id)) continue;
      const terms = [e.term, ...(e.synonyms || [])];
      for (const t of terms) {
        const n = KB.norm(t);
        if (n.length >= 3 && hay.includes(n)) {
          hits.push(e);
          seen.add(e.id);
          break;
        }
      }
    }
    return hits;
  },
  search(q, cat) {
    const raw = String(q || "").trim();
    if (!raw) return KB.entries.filter((e) => !cat || e.category === cat);
    const nq = KB.norm(raw);
    const stopWords = new Set(["el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en", "con", "por", "para", "sobre", "que", "y", "o", "al", "mi", "mis", "tu", "tus", "su", "sus", "son", "es", "vi", "habia", "sonar", "sueno", "soñe"]);
    const tokens = nq.split(/[^a-z0-9]+/i).filter((t) => t.length >= 2 && !stopWords.has(t));
    
    const directHitIds = new Set();
    if (KB.synonyms && KB.synonyms[nq]) directHitIds.add(KB.synonyms[nq]);
    tokens.forEach((tok) => {
      if (KB.synonyms && KB.synonyms[tok]) directHitIds.add(KB.synonyms[tok]);
      if (tok.endsWith("es") && tok.length > 4) {
        const s = tok.slice(0, -2);
        if (KB.synonyms && KB.synonyms[s]) directHitIds.add(KB.synonyms[s]);
      } else if (tok.endsWith("s") && tok.length > 3) {
        const s = tok.slice(0, -1);
        if (KB.synonyms && KB.synonyms[s]) directHitIds.add(KB.synonyms[s]);
      }
    });

    const results = [];
    for (const e of KB.entries) {
      if (cat && e.category !== cat) continue;
      if (directHitIds.has(e.id)) {
        results.push({ entry: e, score: 100 });
        continue;
      }
      const termNorm = KB.norm(e.term);
      const synNorms = (e.synonyms || []).map((s) => KB.norm(s));
      const tagsNorms = (e.tags || []).map((t) => KB.norm(t));
      const textCorpus = KB.norm([e.term, e.category, e.summary, e.detail, e.perspective, ...tagsNorms, ...synNorms].join(" "));

      if (termNorm === nq) {
        results.push({ entry: e, score: 95 });
        continue;
      }
      if (termNorm.includes(nq) || nq.includes(termNorm)) {
        results.push({ entry: e, score: 85 });
        continue;
      }

      let hitSyn = false;
      for (const s of synNorms) {
        if (s === nq || nq.includes(s) || s.includes(nq)) {
          results.push({ entry: e, score: 80 });
          hitSyn = true;
          break;
        }
      }
      if (hitSyn) continue;

      let score = 0;
      for (const tok of tokens) {
        const tokSing = tok.endsWith("es") && tok.length > 4 ? tok.slice(0, -2) : (tok.endsWith("s") && tok.length > 3 ? tok.slice(0, -1) : tok);
        if (termNorm.includes(tok) || termNorm.includes(tokSing)) score += 35;
        else if (synNorms.some((s) => s.includes(tok) || s.includes(tokSing))) score += 25;
        else if (tagsNorms.some((t) => t.includes(tok) || t.includes(tokSing))) score += 15;
        else if (textCorpus.includes(tok) || textCorpus.includes(tokSing)) score += 10;
      }
      if (score > 0) results.push({ entry: e, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.map((r) => r.entry);
  },
  symbols() { return KB.entries.filter((e) => e.category === "símbolo"); },
};
if (typeof window !== "undefined") window.KB = KB;
if (typeof globalThis !== "undefined") globalThis.KB = KB;
