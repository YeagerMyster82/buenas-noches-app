const profileContent = {
  es: {
    EL_INAGOTABLE: {
      name: "El Inagotable",
      description:
        "Este perfil aparece cuando tu hijo ya pasó su ventana de sueño y el cuerpo entra en segunda energía. Parece que tiene batería, pero en realidad está funcionando con cansancio acumulado.",
    },
    EL_DESVELADO: {
      name: "El Desvelado",
      description:
        "Tu hijo está cansado, pero su sistema nervioso o su mente no logran bajar revoluciones. Quiere dormir, pero el cuerpo no encuentra la señal clara para soltar el día.",
    },
    EL_NEGOCIADOR: {
      name: "El Negociador",
      description:
        "Tu hijo necesita conexión y seguridad antes de poder soltar. Las peticiones de una cosa más muchas veces son una forma de buscar cercanía antes de descansar.",
    },
    EL_BERRINCHE: {
      name: "El Berrinche",
      description:
        "La hora de dormir llega con mucha activación emocional. El sistema nervioso está sobrepasado y necesita contención antes de poder recibir instrucciones o calma.",
    },
    EL_SONAMBULO: {
      name: "El Sonámbulo",
      description:
        "Tu hijo puede quedarse dormido, pero no siempre sostiene bien el sueño. Muchas veces cayó por agotamiento antes de completar una bajada real del sistema nervioso.",
    },
  },
  en: {
    EL_INAGOTABLE: {
      name: "The Wired One",
      description:
        "This profile shows up when your child has passed the sleep window and the body goes into second wind. It looks like energy, but it is really overtired activation.",
    },
    EL_DESVELADO: {
      name: "The Wide-Awake One",
      description:
        "Your child is tired, but their nervous system or mind cannot downshift. They want sleep, but the body cannot find a clear signal to let go of the day.",
    },
    EL_NEGOCIADOR: {
      name: "The Negotiator",
      description:
        "Your child needs connection and safety before they can let go. The requests for one more thing are often a way of seeking closeness before rest.",
    },
    EL_BERRINCHE: {
      name: "The Meltdown One",
      description:
        "Bedtime arrives with a lot of emotional activation. The nervous system is overwhelmed and needs containment before it can receive direction or calm.",
    },
    EL_SONAMBULO: {
      name: "The Sleepwalker",
      description:
        "Your child may fall asleep, but does not always sustain sleep well. Often they crash from exhaustion before fully downshifting their nervous system.",
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
        { key: "A", label: "Se mueve mucho o cambia de posición constantemente" },
        { key: "B", label: "Se queda quieto, pero no se duerme" },
        { key: "C", label: "Sigue hablando o pidiendo cosas" },
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
      prompt: "¿Tu hijo se duerme, pero se despierta una o dos horas después?",
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
      prompt: "When bedtime arrives, what best describes your child?",
      options: [
        { key: "A", label: "Runs, jumps, or gets very activated" },
        { key: "B", label: "Lies down with eyes open but cannot sleep" },
        { key: "C", label: "Starts asking for things, talking, or negotiating" },
        { key: "D", label: "Cries, gets frustrated, or melts down" },
      ],
    },
    {
      id: 2,
      prompt: "Do they seem to have more energy than usual at night?",
      options: [
        { key: "A", label: "Yes, a lot" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 3,
      prompt: "Once in bed, what happens most often?",
      options: [
        { key: "A", label: "Moves a lot or changes position constantly" },
        { key: "B", label: "Stays still, but does not fall asleep" },
        { key: "C", label: "Keeps talking or asking for things" },
        { key: "D", label: "Falls asleep, but wakes later" },
      ],
    },
    {
      id: 4,
      prompt: "How often do they ask for one more thing before sleep?",
      options: [
        { key: "A", label: "Very often" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "Almost never" },
      ],
    },
    {
      id: 5,
      prompt: "Do they need you nearby to fall asleep?",
      options: [
        { key: "A", label: "Yes, almost always" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 6,
      prompt: "Does it feel hard for them to turn off their mind?",
      options: [
        { key: "A", label: "Yes, very much" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 7,
      prompt: "At night, do they become more sensitive, cry, or explode emotionally?",
      options: [
        { key: "A", label: "Yes, often" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 8,
      prompt: "Do they fall asleep but wake one or two hours later?",
      options: [
        { key: "A", label: "Yes" },
        { key: "B", label: "Sometimes" },
        { key: "C", label: "No" },
      ],
    },
    {
      id: 9,
      prompt: "Do you notice their body is restless in bed?",
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
        { key: "B", label: "Not much" },
        { key: "C", label: "Sometimes" },
      ],
    },
  ],
};

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

const finalProfileMap = {
  EL_INAGOTABLE: ["A", "E"],
  EL_DESVELADO: ["B", "G"],
  EL_NEGOCIADOR: ["C"],
  EL_BERRINCHE: ["D", "F"],
  EL_SONAMBULO: ["H"],
};

const legacyProfileAliases = {
  A: "EL_INAGOTABLE",
  E: "EL_INAGOTABLE",
  B: "EL_DESVELADO",
  G: "EL_DESVELADO",
  C: "EL_NEGOCIADOR",
  D: "EL_BERRINCHE",
  F: "EL_BERRINCHE",
  H: "EL_SONAMBULO",
};

Object.entries(legacyProfileAliases).forEach(([legacyCode, finalCode]) => {
  profileContent.es[legacyCode] = profileContent.es[finalCode];
  profileContent.en[legacyCode] = profileContent.en[finalCode];
});

const tieBreakers = [
  ["EL_INAGOTABLE", "EL_SONAMBULO", "EL_INAGOTABLE"],
  ["EL_DESVELADO", "EL_NEGOCIADOR", "EL_DESVELADO"],
  ["EL_NEGOCIADOR", "EL_BERRINCHE", "EL_BERRINCHE"],
  ["EL_DESVELADO", "EL_SONAMBULO", "EL_SONAMBULO"],
];

export const profileMap = profileContent.es;
export const questions = getQuestions("es");

export function getProfileMap(language = "es") {
  return profileContent[language] || profileContent.es;
}

export function getQuestions(language = "es") {
  return localizedQuestions[language] || localizedQuestions.es;
}

export function scoreAnswers(answers) {
  const internalTotals = ["A", "B", "C", "D", "E", "F", "G", "H"].reduce((acc, code) => {
    acc[code] = 0;
    return acc;
  }, {});

  answers.forEach((answer) => {
    const additions = scoring[answer.questionId]?.[answer.optionKey] || {};
    Object.entries(additions).forEach(([code, value]) => {
      internalTotals[code] += value;
    });
  });

  const totals = Object.entries(finalProfileMap).reduce((acc, [finalCode, internalCodes]) => {
    acc[finalCode] = internalCodes.reduce((sum, internalCode) => sum + internalTotals[internalCode], 0);
    return acc;
  }, {});

  let ranking = Object.entries(totals).sort((left, right) => right[1] - left[1]);
  ranking = applyTieBreakers(ranking);
  const primary = ranking[0][0];
  const secondary = ranking.find(([code, score]) => code !== primary && ranking[0][1] - score <= 1 && score > 0)?.[0] || null;

  return { primary, secondary, totals, internalTotals, ranking };
}

function applyTieBreakers(ranking) {
  const topScore = ranking[0]?.[1] || 0;
  const tied = ranking.filter(([, score]) => score === topScore).map(([code]) => code);
  if (tied.length < 2) return ranking;

  const matchedTieBreaker = tieBreakers.find(([left, right]) => tied.includes(left) && tied.includes(right));
  if (!matchedTieBreaker) return ranking;

  const winner = matchedTieBreaker[2];
  return [...ranking].sort((left, right) => {
    if (left[0] === winner) return -1;
    if (right[0] === winner) return 1;
    return right[1] - left[1];
  });
}

export function resolveTieCandidates() {
  return null;
}

export function buildResultCopy(result, language = "es") {
  const content = getProfileMap(language);

  if (language === "en") {
    return {
      primaryName: content[result.primary].name,
      primaryDescription: content[result.primary].description,
      reassurance:
        "This is not a discipline problem. It is a nervous-system pattern, and once you understand it, bedtime becomes much easier to guide.",
      framework:
        "The goal is not to complete a long routine. The goal is to find the moment when your child is ready for sleep and stop there.",
      secondaryName: result.secondary ? content[result.secondary].name : null,
    };
  }

  return {
    primaryName: content[result.primary].name,
    primaryDescription: content[result.primary].description,
    reassurance:
      "Esto no es un problema de disciplina. Es un patrón del sistema nervioso, y cuando lo entiendes, la hora de dormir se vuelve mucho más fácil de guiar.",
    framework:
      "La meta no es completar una rutina larga. La meta es encontrar el momento en el que tu hijo ya está listo para dormir y parar ahí.",
    secondaryName: result.secondary ? content[result.secondary].name : null,
  };
}
