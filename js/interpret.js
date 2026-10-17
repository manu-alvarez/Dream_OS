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

    // 2. Análisis cognitivo de emoción y estrés (Hipótesis de Continuidad - Domhoff / Hall)
    if (activeEmotion) {
      perspectives.push({
        school: "cientifica",
        term: `Emoción: ${activeEmotion}`,
        claim: `La presencia de «${activeEmotion}» en el relato sugiere procesamiento de afectos recientes. Según la hipótesis de continuidad cognitiva, las emociones del sueño reflejan y consolidan experiencias de la vigilia de las últimas 24-72 horas.`,
        grounds: [activeEmotion],
        sourceId: "s-continuidad",
        entryId: "k-continuidad"
      });
    }

    if (dream.stress && Number(dream.stress) >= 6) {
      perspectives.push({
        school: "cientifica",
        term: `Nivel de estrés previo (${dream.stress}/10)`,
        claim: "Niveles elevados de estrés diurno correlacionan con mayor fragmentación y vivacidad del sueño REM, generando a menudo metáforas de huida, urgencia o sobrecarga.",
        grounds: ["estrés"],
        sourceId: "s-continuidad-estres",
        entryId: "k-continuidad-estres"
      });
    }

    // 3. Preguntas guiadas de introspección
    const questions = [];
    if (hits.length > 0) {
      const topSymbol = hits[0].term;
      questions.push(`Al pensar en «${topSymbol}», ¿qué recuerdo o persona real te viene a la mente de forma espontánea?`);
    }
    if (activeEmotion) {
      questions.push(`Sentiste «${activeEmotion}»: ¿en qué situación reciente de tu vida despierta has experimentado algo parecido?`);
    } else {
      questions.push("¿Qué emoción o sensación física te quedó en el cuerpo en los primeros segundos tras despertar?");
    }
    questions.push("¿Hay algún detalle que parecía secundario o extraño y que ahora te llame la atención?");

    const elementsList = hits.map((h) => h.term);
    if (activeEmotion && !elementsList.includes(activeEmotion)) elementsList.push(activeEmotion);

    const summaryText = hits.length > 0
      ? `Se detectaron ${hits.length} símbolo${hits.length > 1 ? "s" : ""} clave (${hits.slice(0, 4).map((h) => h.term).join(", ")})${activeEmotion ? ` con tono de «${activeEmotion}»` : ""}. Contrastadas lecturas desde múltiples tradiciones:`
      : `Análisis centrado en la atmósfera emocional${activeEmotion ? ` («${activeEmotion}»)` : ""} y la estructura cognitiva del relato:`;

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
        "Las lecturas son lentes de reflexión, nunca certezas absolutas ni diagnósticos clínicos.",
        "Tu propia intuición y contexto de vida son la verdadera autoridad sobre el significado de tu sueño.",
        "Análisis 100% privado procesado de forma local en tu navegador."
      ],
      questions
    };
  }
};
if (typeof window !== "undefined") window.Interpret = Interpret;
if (typeof globalThis !== "undefined") globalThis.Interpret = Interpret;
