const profileContent = {
  es: {
    EL_INAGOTABLE: {
      name: "El Inagotable",
      description:
        "Este perfil aparece cuando tu hijo perdió su ventana de sueño y el cortisol lo mantiene como si todavía tuviera batería. No es falta de sueño; es cansancio pasado de hora.",
    },
    EL_DESVELADO: {
      name: "El Desvelado",
      description:
        "Tu hijo está cansado, pero su sistema nervioso se queda atorado y no logra entrar en sueño. Parece que quiere dormir, pero el cuerpo o la mente no encuentran la bajada.",
    },
    EL_NEGOCIADOR: {
      name: "El Negociador",
      description:
        "Tu hijo necesita conexión antes de poder soltar. Las peticiones no siempre son manipulación; muchas veces son una búsqueda de seguridad antes de descansar.",
    },
    EL_BERRINCHE: {
      name: "El Berrinche",
      description:
        "Aquí el sistema nervioso llega en activación simpática completa: llanto, berrinche o desregulación. Primero necesita contención, no más demanda.",
    },
    EL_SONAMBULO: {
      name: "El Sonámbulo",
      description:
        "Tu hijo puede caer dormido por agotamiento, pero no terminó de bajar revoluciones. Por eso el sueño puede ser más frágil o interrumpido.",
    },
  },
  en: {
    EL_INAGOTABLE: {
      name: "The Wired One",
      description:
        "This profile shows up when your child has missed the sleep window and cortisol is keeping them wired. It is not true energy; it is overtired activation.",
    },
    EL_DESVELADO: {
      name: "The Wide-Awake One",
      description:
        "Your child is tired, but their nervous system is stuck and cannot drift into sleep. They want sleep, but body or mind cannot find the downshift.",
    },
    EL_NEGOCIADOR: {
      name: "The Negotiator",
      description:
        "Your child needs connection before they can let go. The requests are not always manipulation; often they are seeking safety before rest.",
    },
    EL_BERRINCHE: {
      name: "The Meltdown One",
      description:
        "Here the nervous system reaches bedtime in full sympathetic activation: crying, meltdowns, or dysregulation. First they need containment, not more demand.",
    },
    EL_SONAMBULO: {
      name: "The Sleepwalker",
      description:
        "Your child can crash into sleep from exhaustion, but never fully came down first. That can make sleep more fragile or interrupted.",
    },
  },
};

const answerOptions = {
  es: [
    { key: "never", label: "Nunca" },
    { key: "sometimes", label: "A veces" },
    { key: "always", label: "Siempre" },
  ],
  en: [
    { key: "never", label: "Never" },
    { key: "sometimes", label: "Sometimes" },
    { key: "always", label: "Always" },
  ],
};

const questionDefinitions = [
  { id: 1, promptEs: "Mi hijo se activa más en la noche, justo cuando debería dormir.", promptEn: "My child gets more activated at night, right when they should sleep.", primary: "A" },
  { id: 2, promptEs: "Mi hijo está acostado, cansado… pero no logra dormirse.", promptEn: "My child is lying down, tired... but cannot fall asleep.", primary: "B" },
  { id: 3, promptEs: "Mi hijo pide cosas constantemente para no dormirse.", promptEn: "My child constantly asks for things to avoid falling asleep.", primary: "C" },
  { id: 4, promptEs: "La hora de dormir termina en llanto, berrinche o desregulación.", promptEn: "Bedtime ends in crying, meltdowns, or dysregulation.", primary: "D" },
  { id: 5, promptEs: "Mi hijo no puede quedarse quieto, se mueve mucho en la cama.", promptEn: "My child cannot stay still and moves a lot in bed.", primary: "E" },
  { id: 6, promptEs: "Mi hijo necesita que esté con él para poder calmarse o dormirse.", promptEn: "My child needs me nearby to calm down or fall asleep.", primary: "F" },
  { id: 7, promptEs: "Mi hijo sigue hablando, pensando o preguntando cuando debería dormir.", promptEn: "My child keeps talking, thinking, or asking questions when they should sleep.", primary: "G" },
  { id: 8, promptEs: "Mi hijo se duerme, pero se despierta en la noche o no descansa bien.", promptEn: "My child falls asleep, but wakes at night or does not rest well.", primary: "H" },
  { id: 9, promptEs: "Aunque está cansado, parece que su cuerpo no puede bajar revoluciones.", promptEn: "Even when tired, it feels like their body cannot slow down.", primary: "A", secondary: "G" },
  { id: 10, promptEs: "Mi hijo parece sobrepasado o acumulando mucho estrés al final del día.", promptEn: "My child seems overwhelmed or carrying a lot of stress by the end of the day.", primary: "D", secondary: "F" },
];

const finalProfileMap = {
  EL_INAGOTABLE: ["A", "E"],
  EL_DESVELADO: ["B", "G"],
  EL_NEGOCIADOR: ["C"],
  EL_BERRINCHE: ["D", "F"],
  EL_SONAMBULO: ["H"],
};

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
  const options = answerOptions[language] || answerOptions.es;
  return questionDefinitions.map((question) => ({
    id: question.id,
    prompt: language === "en" ? question.promptEn : question.promptEs,
    options,
  }));
}

export function scoreAnswers(answers) {
  const internalTotals = ["A", "B", "C", "D", "E", "F", "G", "H"].reduce((acc, code) => ({ ...acc, [code]: 0 }), {});
  const answerValues = { never: 0, sometimes: 1, always: 2 };

  answers.forEach((answer) => {
    const definition = questionDefinitions.find((question) => question.id === answer.questionId);
    if (!definition) return;
    const value = answerValues[answer.optionKey] ?? 0;
    internalTotals[definition.primary] += value;
    if (definition.secondary) {
      internalTotals[definition.secondary] += value / 2;
    }
  });

  const totals = Object.entries(finalProfileMap).reduce((acc, [finalCode, internalCodes]) => {
    acc[finalCode] = internalCodes.reduce((sum, internalCode) => sum + internalTotals[internalCode], 0);
    return acc;
  }, {});

  let ranking = Object.entries(totals).sort((left, right) => right[1] - left[1]);
  ranking = applyTieBreakers(ranking);
  const primary = ranking[0][0];
  const secondary = ranking.find(([code, score]) => code !== primary && ranking[0][1] - score <= 1 && score > 0)?.[0] || null;

  return { primary, secondary, totals, internalTotals, ranking, twoPointHits: {} };
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
