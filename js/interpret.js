/* DreamOS interpret.js v0.1.0 — motor de reglas determinista. Sin IA. Honesto por diseño. */
"use strict";
const Interpret = {
  EMOTIONS: ["ira", "tristeza", "miedo", "aprension", "confusion", "felicidad", "alegría", "ansiedad", "calma", "sorpresa"],
  run(dream) {
    const text = [dream.title, dream.story_original, dream.reflection].join(" ");
    const words = text.trim().split(/\s+/).filter(Boolean);
    const hits = KB.extract(dream.story_original, [...(dream.tags || []), dream.title]);
    const emo = Interpret.EMOTIONS.filter((e) => KB.norm(text).includes(KB.norm(e)));
    if (words.length < 20 || hits.length < 2) {
      return {
        type: "unavailable", method: "rule", engineVersion: "0.1.0",
        summary: "Datos insuficientes para una lectura con base.",
        limitations: [words.length < 20 ? `Relato breve (${words.length} palabras, mínimo orientativo 20).` : "Menos de 2 símbolos reconocidos en la base local.",
          "El motor v0.1.0 solo usa reglas léxicas y la base local; no hay IA."],
        questions: [
          "¿Quiénes aparecen y dónde ocurre?",
          "¿Qué emoción nombra literalmente el relato?",
          hits[0] ? `«${hits[0].term}»: ¿qué te evoca a ti, aunque no salga en ningún libro?` : "¿Qué elemento te impactó más y qué te recuerda de estos días?",
        ],
        perspectives: [], sourceIds: [], elements: hits.map((h) => h.term),
      };
    }
    const perspectives = [];
    const seenSchools = new Set();
    for (const h of hits.slice(0, 6)) {
      for (const it of (h.interpretations || []).slice(0, 2)) {
        const key = it.school + ":" + h.id;
        if (seenSchools.has(key)) continue;
        seenSchools.add(key);
        perspectives.push({ school: it.school, term: h.term, claim: it.text, grounds: [h.term], sourceId: it.sourceId, entryId: h.id });
      }
    }
    return {
      type: "hypothesis", method: "rule", engineVersion: "0.1.0",
      summary: `Relato con ${hits.length} símbolos reconocidos (${hits.slice(0, 4).map((h) => h.term).join(", ")})${emo.length ? ` y tono ${emo.slice(0, 2).join("/")} explícito` : ""}. Lecturas posibles con procedencia, no significados impuestos.`,
      elements: hits.map((h) => h.term),
      emotions: emo,
      perspectives,
      sourceIds: [...new Set(perspectives.map((p) => p.sourceId))],
      limitations: ["Motor de reglas léxicas v0.1.0: no comprende contexto, ironía ni metáforas nuevas.", "Toda lectura es hipótesis a contrastar con tus asociaciones; correlación con tu semana no es causalidad.", "Nada de esto es diagnóstico ni presagio."],
      questions: [
        hits[0] ? `«${hits[0].term}»: ¿qué representa para ti en este momento de tu vida?` : "¿Qué elemento te llevas al despertar?",
        dream.emotion ? `Registraste «${dream.emotion}»: ¿dónde la sentías en el cuerpo del sueño?` : "¿Qué emoción pondrías hoy al releerlo?",
        "¿Qué de los últimos 2-3 días podría estar continuando esta escena?",
      ],
    };
  },
};
