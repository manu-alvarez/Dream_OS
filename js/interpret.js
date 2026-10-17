/* DreamOS interpret.js v0.2.0 — motor de interpretación multi-perspectiva local y determinista. */
"use strict";
const Interpret = {
  EMOTIONS: ["ira", "tristeza", "miedo", "aprension", "confusion", "felicidad", "alegría", "ansiedad", "calma", "sorpresa"],
  
  run(dream) {
    const fullText = [dream.title, dream.story_original, dream.reflection].join(" ");
    const words = fullText.trim().split(/\s+/).filter(Boolean);
    const hits = KB.extract(dream.story_original, [...(dream.tags || []), dream.title, dream.reflection]);
    const emoDetected = Interpret.EMOTIONS.filter((e) => KB.norm(fullText).includes(KB.norm(e)));
    const activeEmotion = dream.emotion || (emoDetected.length ? emoDetected[0] : null);

    // Si está completamente vacío (menos de 3 palabras, sin símbolos ni emoción)
    if (words.length < 3 && !hits.length && !activeEmotion) {
      return {
        type: "unavailable",
        method: "rule",
        engineVersion: "0.2.0",
        summary: "Relato demasiado breve para extraer patrones.",
        limitations: [
          "Escribe unas líneas de lo que recuerdes (escenarios, personas, objetos o sensaciones).",
          "Dream OS procesa todo en tu dispositivo, sin servidores externos."
        ],
        questions: [
          "¿Dónde te encontrabas al principio del sueño?",
          "¿Había personas conocidas o figuras desconocidas?",
          "¿Cómo te sentiste justo al despertar?"
        ],
        perspectives: [],
        sourceIds: [],
        elements: []
      };
    }

    const perspectives = [];
    const seenPerspectives = new Set();

    // 1. Lecturas de símbolos identificados en la base de conocimiento
    for (const h of hits) {
      for (const it of (h.interpretations || [])) {
        const key = `${it.school}:${h.id}`;
        if (seenPerspectives.has(key)) continue;
        seenPerspectives.add(key);
        perspectives.push({
          school: it.school,
          term: h.term,
          claim: it.text,
          grounds: [h.term],
          sourceId: it.sourceId,
          entryId: h.id
        });
      }
    }

    // 2. Análisis de emoción y estrés previo
    if (activeEmotion) {
      perspectives.push({
        school: "cientifica",
        term: `Emoción: ${activeEmotion}`,
        claim: `Sentir «${activeEmotion}» en el sueño indica que tu mente está procesando vivencias o cambios recientes de tu día a día, integrando esas emociones mientras descansas.`,
        grounds: [activeEmotion],
        sourceId: "emocion",
        entryId: "emocion"
      });
    }

    if (dream.stress && Number(dream.stress) >= 6) {
      perspectives.push({
        school: "cientifica",
        term: `Estrés previo (${dream.stress}/10)`,
        claim: "Acostarse con cansancio o tensión acumulada suele producir sueños más vívidos o con sensación de prisa, ya que la mente aprovecha el descanso para descargar esa sobrecarga.",
        grounds: ["estrés"],
        sourceId: "estres",
        entryId: "estres"
      });
    }

    // 3. Preguntas guiadas de introspección
    const questions = [];
    if (hits.length > 0) {
      const topSymbol = hits[0].term;
      questions.push(`Al pensar en «${topSymbol}», ¿qué recuerdo o persona te viene a la mente de forma espontánea?`);
    }
    if (activeEmotion) {
      questions.push(`Sentiste «${activeEmotion}»: ¿en qué momento reciente de tu vida despierta has tenido una sensación parecida?`);
    } else {
      questions.push("¿Qué emoción o sensación te quedó en el cuerpo durante los primeros segundos tras despertar?");
    }
    questions.push("¿Hay algún detalle curioso o extraño que ahora llame tu atención?");

    const elementsList = hits.map((h) => h.term);
    if (activeEmotion && !elementsList.includes(activeEmotion)) elementsList.push(activeEmotion);

    const summaryText = hits.length > 0
      ? `Claves identificadas: ${hits.slice(0, 4).map((h) => h.term).join(", ")}${activeEmotion ? ` (emoción: «${activeEmotion}»)` : ""}. Estas son las interpretaciones para comprender su mensaje:`
      : `Interpretación basada en la atmósfera emocional${activeEmotion ? ` («${activeEmotion}»)` : ""} de tu sueño:`;

    return {
      type: "hypothesis",
      method: "rule",
      engineVersion: "0.2.0",
      summary: summaryText,
      elements: elementsList,
      emotions: activeEmotion ? [activeEmotion] : [],
      perspectives,
      sourceIds: [...new Set(perspectives.map((p) => p.sourceId))],
      limitations: [
        "Las interpretaciones son guías de reflexión para tu autoconocimiento.",
        "Tu propia intuición y vivencias son las que determinan el verdadero significado de tu sueño."
      ],
      questions
    };
  }
};
if (typeof window !== "undefined") window.Interpret = Interpret;
if (typeof globalThis !== "undefined") globalThis.Interpret = Interpret;
