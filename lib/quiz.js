export const profileMap = {
  A: {
    name: "Segunda energía",
    description:
      "Este es el niño que parece enchufarse justo cuando tú ya estás agotada. Muchas veces no es que no tenga sueño. Es que llegó TAN cansado a la noche que su cuerpo sacó un segundo aire para sostenerse un poco más.",
  },
  B: {
    name: "Despierto pero quieto",
    description:
      "Este es el niño que ya está acostado, no está llorando, no está pidiendo nada, pero tampoco se duerme. Se ve cansado, pero algo entre el cuerpo y el cerebro no termina de conectar.",
  },
  C: {
    name: "Negociador",
    description:
      "Este es el niño que siempre tiene una cosa más. No lo hace para molestarte. Es una forma de estirar el tiempo de conexión porque su sistema nervioso todavía no está listo para soltar el día.",
  },
  D: {
    name: "Colapso nocturno",
    description:
      "Este es el niño que llega a la noche completamente sobrepasado. No es mala conducta. No es manipulación. Es un sistema nervioso que acumuló demasiado durante el día y llegó a la noche sin recursos.",
  },
  E: {
    name: "Cuerpo inquieto",
    description:
      "Este es el niño que quiere dormir pero su cuerpo no coopera. Se mueve, gira, patea, cambia de posición una y otra vez. Su cuerpo literalmente sigue buscando algo.",
  },
  F: {
    name: "Necesita cerquita",
    description:
      "Este es el niño que necesita sentirte para poder soltar. Tu presencia le funciona como señal de seguridad. Eso no es un defecto. Es biología.",
  },
  G: {
    name: "Mente encendida",
    description:
      "Este es el niño que está agotado pero su cabeza no para. Hace preguntas, recuerda cosas, quiere hablar y procesar. Cuanto más presión siente, más se activa.",
  },
  H: {
    name: "Se duerme, pero no sostiene el sueño",
    description:
      "Aquí la caída al sueño ocurre, pero la transición al sueño profundo no se sostiene. Su sistema nervioso no terminó de regularse completamente antes de dormir.",
  },
};

export const questions = [
  {
    id: 1,
    prompt: "Cuando llega la hora de dormir, ¿qué describe mejor a tu hijo?",
    options: [
      { key: "A", label: "Corre, salta o se activa mucho" },
      { key: "B", label: "Se queda acostado con los ojos abiertos sin dormirse" },
      { key: "C", label: "Empieza a pedir cosas, hablar o negociar" },
      { key: "D", label: "Llora, se frustra o tiene un colapso emocional" },
    ],
  },
  {
    id: 2,
    prompt: "¿Sientes que en la noche tiene más energía de la normal?",
    options: [
      { key: "A", label: "Sí, muchísimo" },
      { key: "B", label: "A veces" },
      { key: "C", label: "No" },
    ],
  },
  {
    id: 3,
    prompt: "Ya en la cama, ¿qué pasa más seguido?",
    options: [
      { key: "A", label: "Se mueve mucho y no se queda quieto" },
      { key: "B", label: "Se queda quieto pero no se duerme" },
      { key: "C", label: "Sigue hablando, llamándote o pidiendo cosas" },
      { key: "D", label: "Se duerme, pero luego se despierta" },
    ],
  },
  {
    id: 4,
    prompt: "¿Con qué frecuencia te pide una cosa más antes de dormir?",
    options: [
      { key: "A", label: "Muchísimo" },
      { key: "B", label: "A veces" },
      { key: "C", label: "Casi nunca" },
    ],
  },
  {
    id: 5,
    prompt: "¿Necesita que estés cerca para poder dormirse?",
    options: [
      { key: "A", label: "Sí, casi siempre" },
      { key: "B", label: "A veces" },
      { key: "C", label: "No" },
    ],
  },
  {
    id: 6,
    prompt: "¿Sientes que le cuesta apagar la mente?",
    options: [
      { key: "A", label: "Sí, mucho" },
      { key: "B", label: "A veces" },
      { key: "C", label: "No" },
    ],
  },
  {
    id: 7,
    prompt: "¿En la noche se pone más sensible, llora o explota emocionalmente?",
    options: [
      { key: "A", label: "Sí, seguido" },
      { key: "B", label: "A veces" },
      { key: "C", label: "No" },
    ],
  },
  {
    id: 8,
    prompt: "¿Tu hijo se duerme pero se despierta 1 o 2 horas después?",
    options: [
      { key: "A", label: "Sí" },
      { key: "B", label: "A veces" },
      { key: "C", label: "No" },
    ],
  },
  {
    id: 9,
    prompt: "¿Notas que su cuerpo está inquieto en la cama?",
    options: [
      { key: "A", label: "Sí" },
      { key: "B", label: "A veces" },
      { key: "C", label: "No" },
    ],
  },
  {
    id: 10,
    prompt: "¿Parece calmarse mejor con presión o contacto físico?",
    options: [
      { key: "A", label: "Sí" },
      { key: "B", label: "No mucho" },
      { key: "C", label: "A veces" },
    ],
  },
];

const scoring = {
  1: { A: { A: 2 }, B: { B: 2 }, C: { C: 2 }, D: { D: 2 } },
  2: { A: { A: 2 }, B: { A: 1 }, C: {} },
  3: { A: { E: 2 }, B: { B: 2 }, C: { C: 2 }, D: { H: 2 } },
  4: { A: { C: 2 }, B: { C: 1 }, C: {} },
  5: { A: { F: 2 }, B: { F: 1 }, C: {} },
  6: { A: { G: 2 }, B: { G: 1 }, C: {} },
  7: { A: { D: 2 }, B: { D: 1 }, C: {} },
  8: { A: { H: 2 }, B: { H: 1 }, C: {} },
  9: { A: { E: 2 }, B: { E: 1 }, C: {} },
  10: { A: { E: 1, D: 1 }, B: { B: 1, G: 1 }, C: {} },
};

export function scoreAnswers(answers) {
  const totals = Object.keys(profileMap).reduce((acc, code) => ({ ...acc, [code]: 0 }), {});
  const twoPointHits = Object.keys(profileMap).reduce((acc, code) => ({ ...acc, [code]: 0 }), {});

  answers.forEach((answer) => {
    const mapped = scoring[answer.questionId][answer.optionKey] || {};
    Object.entries(mapped).forEach(([code, points]) => {
      totals[code] += points;
      if (points === 2) twoPointHits[code] += 1;
    });
  });

  const ranking = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const primary = ranking[0][0];
  const secondary = ranking.find(([code, score]) => code !== primary && ranking[0][1] - score <= 1 && score > 0)?.[0] || null;

  return { primary, secondary, totals, twoPointHits, ranking };
}

export function resolveTieCandidates(scored) {
  const topScore = scored.ranking[0][1];
  const tied = scored.ranking.filter(([, score]) => score === topScore).map(([code]) => code);
  if (tied.length < 2) return null;

  const sortedByHits = [...tied].sort((a, b) => scored.twoPointHits[b] - scored.twoPointHits[a]);
  if (scored.twoPointHits[sortedByHits[0]] !== scored.twoPointHits[sortedByHits[1]]) {
    return null;
  }

  return sortedByHits.slice(0, 2);
}

export function buildResultCopy(result) {
  return {
    primaryName: profileMap[result.primary].name,
    primaryDescription: profileMap[result.primary].description,
    reassurance:
      "Esto no es un problema de disciplina, no es que estés haciendo algo mal, y no es que tu hijo sea difícil. Es que su sistema nervioso todavía no está recibiendo la señal correcta para soltar el día y descansar.",
    framework:
      "Lo importante aquí es esto: cuando entiendes el perfil de tu hijo, dejas de adivinar. Dejas de probar cosas al azar. Y empiezas a trabajar CON su sistema nervioso en lugar de contra él.",
    secondaryName: result.secondary ? profileMap[result.secondary].name : null,
  };
}
