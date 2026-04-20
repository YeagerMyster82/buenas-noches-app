const profileContent = {
  es: {
    A: {
      name: "Segunda energía",
      description:
        "Este es el niño que parece enchufarse justo cuando tú ya estás agotada. Muchas veces no es que no tenga sueño. Es que llegó tan cansado a la noche que su cuerpo sacó un segundo aire para sostenerse un poco más.",
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
        "Este es el niño que está agotado pero su cabeza no para. Hace preguntas, recuerda cosas, quiere hablar y procesar. Cuanta más presión siente, más se activa.",
    },
    H: {
      name: "Se duerme, pero no sostiene el sueño",
      description:
        "Aquí la caída al sueño ocurre, pero la transición al sueño profundo no se sostiene. Su sistema nervioso no terminó de regularse completamente antes de dormir.",
    },
  },
  en: {
    A: {
      name: "Second wind",
      description:
        "This is the child who seems to power up right when you are already exhausted. Often it is not that they are not sleepy. They are so tired that the body finds a second wind just to keep going a little longer.",
    },
    B: {
      name: "Awake but still",
      description:
        "This is the child who is already lying down, not crying and not asking for anything, but still not falling asleep. They look tired, but something between body and brain is not fully connecting.",
    },
    C: {
      name: "Negotiator",
      description:
        "This is the child who always has one more thing. They are not trying to be difficult. It is often a way to stretch connection because their nervous system is not ready to let go of the day yet.",
    },
    D: {
      name: "Night collapse",
      description:
        "This is the child who arrives at night completely overwhelmed. It is not bad behavior or manipulation. It is a nervous system that carried too much through the day and has very little left by bedtime.",
    },
    E: {
      name: "Restless body",
      description:
        "This is the child who wants to sleep but whose body does not cooperate. They move, kick, turn and change position again and again. Their body is still searching for input.",
    },
    F: {
      name: "Needs you close",
      description:
        "This is the child who needs to feel you nearby in order to let go. Your presence works like a safety signal for their nervous system. That is not a flaw. That is biology.",
    },
    G: {
      name: "Busy mind",
      description:
        "This is the child who is exhausted but whose mind will not turn off. They ask questions, remember things and want to process. The more pressure they feel, the more activated they become.",
    },
    H: {
      name: "Falls asleep but does not stay asleep",
      description:
        "Here sleep starts, but the transition into deeper sleep does not hold. Their nervous system did not fully regulate before bedtime, so it reactivates more easily during the night.",
    },
  },
};

const localizedQuestions = {
  es: [
    {
      id: 1,
      prompt: "¿Cuándo llega la hora de dormir, qué describe mejor a tu hijo?",
      options: [
        { key: "A", label: "Corre, salta o se activa mucho" },
        { key: "B", label: "Se queda acostado con los ojos abiertos sin dormirse" },
        { key: "C", label: "Empieza a pedir cosas, hablar o negociar" },
        { key: "D", label: "Llora, se frustra o tiene un colapso emocional" },
      ],
    },
    {
      id: 2,
      prompt: "¿Sientes que en la noche tiene más energía de lo normal?",
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
  ],
  en: [
    {
      id: 1,
      prompt: "When bedtime comes, which description fits your child best?",
      options: [
        { key: "A", label: "They run, jump, or get very activated" },
        { key: "B", label: "They lie there with their eyes open and do not fall asleep" },
        { key: "C", label: "They start asking for things, talking, or negotiating" },
        { key: "D", label: "They cry, get frustrated, or have an emotional collapse" },
      ],
    },
    {
      id: 2,
      prompt: "Does your child seem to have more energy than usual at night?",
      options: [
        { key: "A", label: "Yes, a lot more" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 3,
      prompt: "Once they are in bed, what happens most often?",
      options: [
        { key: "A", label: "They move a lot and cannot stay still" },
        { key: "B", label: "They stay still but do not fall asleep" },
        { key: "C", label: "They keep talking, calling you, or asking for things" },
        { key: "D", label: "They fall asleep, but then wake up again" },
      ],
    },
    {
      id: 4,
      prompt: "How often do they ask for one more thing before bed?",
      options: [
        { key: "A", label: "A lot" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "Almost never" },
      ],
    },
    {
      id: 5,
      prompt: "Do they need you close in order to fall asleep?",
      options: [
        { key: "A", label: "Yes, almost always" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 6,
      prompt: "Does it feel hard for them to turn their mind off?",
      options: [
        { key: "A", label: "Yes, very hard" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 7,
      prompt: "At night, do they become more sensitive, cry, or have emotional blowups?",
      options: [
        { key: "A", label: "Yes, often" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 8,
      prompt: "Does your child fall asleep but wake 1 or 2 hours later?",
      options: [
        { key: "A", label: "Yes" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 9,
      prompt: "Do you notice their body seems restless in bed?",
      options: [
        { key: "A", label: "Yes" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 10,
      prompt: "Do they seem to calm better with pressure or physical contact?",
      options: [
        { key: "A", label: "Yes" },
        { key: "B", label: "Not really" },
        { key: "C", label: "Sometimes" },
      ],
    },
  ],
};

export const profileMap = profileContent.es;
export const questions = localizedQuestions.es;

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

export function getProfileMap(language = "es") {
  return profileContent[language] || profileContent.es;
}

export function getQuestions(language = "es") {
  return localizedQuestions[language] || localizedQuestions.es;
}

export function scoreAnswers(answers) {
  const totals = Object.keys(profileContent.es).reduce((acc, code) => ({ ...acc, [code]: 0 }), {});
  const twoPointHits = Object.keys(profileContent.es).reduce((acc, code) => ({ ...acc, [code]: 0 }), {});

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

export function buildResultCopy(result, language = "es") {
  const content = getProfileMap(language);

  if (language === "en") {
    return {
      primaryName: content[result.primary].name,
      primaryDescription: content[result.primary].description,
      reassurance:
        "This is not a discipline problem, and it does not mean you are doing something wrong or that your child is difficult. Their nervous system is just not receiving the right signal yet to let go of the day and rest.",
      framework:
        "This is the key: once you understand your child's pattern, you stop guessing. You stop trying random things. And you start working with their nervous system instead of against it.",
      secondaryName: result.secondary ? content[result.secondary].name : null,
    };
  }

  return {
    primaryName: content[result.primary].name,
    primaryDescription: content[result.primary].description,
    reassurance:
      "Esto no es un problema de disciplina, no es que estés haciendo algo mal, y no es que tu hijo sea difícil. Es que su sistema nervioso todavía no está recibiendo la señal correcta para soltar el día y descansar.",
    framework:
      "Lo importante aquí es esto: cuando entiendes el perfil de tu hijo, dejas de adivinar. Dejas de probar cosas al azar. Y empiezas a trabajar con su sistema nervioso en lugar de contra él.",
    secondaryName: result.secondary ? content[result.secondary].name : null,
  };
}
