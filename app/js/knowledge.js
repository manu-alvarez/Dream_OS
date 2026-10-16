/* DreamOS knowledge.js v0.1.0 — carga base local + búsqueda léxica ES con sinónimos. */
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
  /* Entidades por coincidencia léxica: término + sinónimos contra relato+tags. */
  extract(text, tags) {
    const hay = KB.norm([text, (tags || []).join(" ")].join(" "));
    const hits = [];
    for (const e of KB.entries) {
      if (e.category !== "símbolo") continue;
      const terms = [e.term, ...(e.synonyms || [])];
      for (const t of terms) {
        const n = KB.norm(t);
        if (n.length >= 3 && hay.includes(n)) { hits.push(e); break; }
      }
    }
    return hits;
  },
  search(q, cat) {
    const nq = KB.norm(q);
    return KB.entries.filter((e) => {
      if (cat && e.category !== cat) return false;
      if (!nq) return true;
      return KB.norm([e.term, e.category, e.summary, e.detail, e.perspective, (e.tags || []).join(" "), (e.synonyms || []).join(" ")].join(" ")).includes(nq);
    });
  },
  symbols() { return KB.entries.filter((e) => e.category === "símbolo"); },
};
