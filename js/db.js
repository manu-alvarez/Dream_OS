/* DreamOS db.js v0.1.0 — IndexedDB dreamos v1 + migración localStorage v0. Sin dependencias. */
"use strict";
const DB = {
  name: "dreamos", version: 1, db: null,
  open() {
    return new Promise((resolve, reject) => {
      if (DB.db) return resolve(DB.db);
      const rq = indexedDB.open(DB.name, DB.version);
      rq.onupgradeneeded = () => {
        const d = rq.result;
        if (!d.objectStoreNames.contains("dreams")) {
          const s = d.createObjectStore("dreams", { keyPath: "id" });
          s.createIndex("date", "date", { unique: false });
          s.createIndex("emotion", "emotion", { unique: false });
          s.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        if (!d.objectStoreNames.contains("meta")) d.createObjectStore("meta", { keyPath: "key" });
      };
      rq.onsuccess = () => { DB.db = rq.result; resolve(DB.db); };
      rq.onerror = () => reject(rq.error);
    });
  },
  tx(store, mode, fn) {
    return DB.open().then((db) => new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const st = t.objectStore(store);
      const out = fn(st, t);
      t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
      t.onerror = () => reject(t.error);
    }));
  },
  putDream(d) { return DB.tx("dreams", "readwrite", (s) => s.put(d)); },
  deleteDream(id) { return DB.tx("dreams", "readwrite", (s) => s.delete(id)); },
  allDreams() { return DB.tx("dreams", "readonly", (s) => s.getAll()); },
  clearDreams() { return DB.tx("dreams", "readwrite", (s) => s.clear()); },
  getMeta(key) { return DB.tx("meta", "readonly", (s) => s.get(key)).then((r) => (r ? r.value : null)); },
  setMeta(key, value) { return DB.tx("meta", "readwrite", (s) => s.put({ key, value })); },
  /* Migración v0: dreamos.demo.v1 / dreamos_data_v1 (localStorage) → IndexedDB, idempotente con backup. */
  async migrateV0() {
    if (await DB.getMeta("migratedV0")) return { migrated: false };
    const out = { dreams: [] };
    try {
      for (const k of ["dreamos.demo.v1", "dreamos_data_v1"]) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        localStorage.setItem(k + ".backup", raw);
        const parsed = JSON.parse(raw);
        const arr = Array.isArray(parsed) ? parsed : parsed.dreams || parsed.data?.dreams || [];
        for (const x of arr) {
          if (!x || typeof x.title !== "string") continue;
          out.dreams.push({
            id: String(x.id || ("d-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6))),
            title: x.title.slice(0, 120),
            date: x.date || new Date().toISOString().slice(0, 10),
            wakeTime: x.wakeTime || "", story_original: x.story || x.story_original || x.narrative || "",
            quality: num1to10(x.quality), stress: num1to10(x.stress),
            emotion: x.emotion || "", tags: normTags(x.tags), symbols: [], characters: [], settings: [],
            reflection: x.reflection || x.analysis || "", favorite: false,
            createdAt: x.createdAt || new Date().toISOString(), updatedAt: x.updatedAt || new Date().toISOString(),
            status: (x.story || x.narrative) ? "complete" : "draft", synthetic: false,
          });
        }
      }
    } catch (e) { console.warn("migrateV0", e); }
    const existing = await DB.allDreams().catch(() => []);
    const have = new Set(existing.map((d) => d.id));
    for (const d of out.dreams) if (!have.has(d.id)) await DB.putDream(d);
    await DB.setMeta("migratedV0", true);
    return { migrated: true, count: out.dreams.length };
    function num1to10(v) { v = Number(v); return v >= 1 && v <= 10 ? v : null; }
    function normTags(t) {
      const a = Array.isArray(t) ? t : String(t || "").split(",");
      return [...new Set(a.map((x) => String(x).trim().toLowerCase()).filter(Boolean))].slice(0, 20);
    }
  },
};
