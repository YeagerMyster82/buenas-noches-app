const activityLibrary = {
  movement: ["animal walks", "carretilla", "army crawling", "empujar objetos pesados"],
  activation: ["seguir un juguete con los ojos sin mover la cabeza", "arriba / abajo", "lado a lado"],
  connection: ["2 minutos de abrazo y conexión", "una canción abrazados", "mirarlo a los ojos y contarle qué viene"],
  proprioception: ["burrito", "pancake / squeeze", "compresiones articulares", "wall pushups", "empujar objetos pesados"],
  vestibular: ["columpiarse / mecerse / balanceo suave", "posición invertida", "balanceo en tus piernas"],
  vagus: ["tarareo", "gárgaras"],
  breathing: ["belly breaths", "bunny breaths"],
  story: ["cuento corto", "audio corto", "música suave"],
};

const profileSequences = {
  A: ["movement", "proprioception", "vestibular", "vagus", "breathing"],
  B: ["activation", "proprioception", "vestibular", "vagus", "breathing", "story"],
  C: ["connection", "proprioception", "vestibular", "vagus", "breathing"],
  D: ["proprioception", "vestibular", "vagus", "breathing"],
  E: ["movement", "proprioception", "proprioception", "vestibular", "breathing"],
  F: ["connection", "proprioception", "vestibular", "vagus", "breathing"],
  G: ["activation", "proprioception", "vestibular", "vagus", "breathing", "story"],
  H: ["proprioception", "vestibular", "vagus", "breathing"],
};

const profileInstruction = {
  A: "Hoy quiero empezar descargando energía física antes de pedirle al cuerpo que baje.",
  B: "Aquí le damos una activación pequeña y luego el puente correcto hacia la calma.",
  C: "Primero llenamos el vaso de conexión para que no necesite negociar tanto al final.",
  D: "Esta noche no empujamos más activación. Vamos directo a presión, contacto y ritmo.",
  E: "Su cuerpo necesita trabajo pesado antes de poder quedarse quieto de verdad.",
  F: "Tu presencia importa mucho aquí, así que vamos a usarla de forma clara y contenida.",
  G: "Vamos a sacar a la mente del centro y llevarla de regreso al cuerpo.",
  H: "La meta es que llegue mejor regulado al momento de dormir para sostener más el sueño.",
};

const functionDescription = {
  movement: "descargar energía física antes de bajar revoluciones",
  activation: "dar una activación pequeña y dirigida para salir del bloqueo",
  connection: "llenar el vaso de seguridad antes de pedir separación",
  proprioception: "dar al cuerpo presión e input organizado",
  vestibular: "marcar ritmo para ayudar a la transición",
  vagus: "activar una señal de calma más profunda",
  breathing: "cerrar con una salida suave hacia el sueño",
  story: "acompañar el aterrizaje final sin volver a activar de más",
};

const durations = {
  movement: 5,
  activation: 3,
  connection: 4,
  proprioception: 4,
  vestibular: 4,
  vagus: 3,
  breathing: 3,
  story: 4,
};

export function buildPlan({
  primaryProfile,
  secondaryProfile,
  age,
  wakeTime,
  napTaken,
  napWakeTime,
  dislikedByFunction,
}) {
  const bedtime = calculateBedtime({ age, wakeTime, napTaken, napWakeTime });
  const routineStart = addMinutes(bedtime, -25);
  const dinnerTime = addMinutes(bedtime, -110);
  const steps = buildSteps({ primaryProfile, secondaryProfile, bedtime, routineStart, dislikedByFunction });

  return {
    age,
    wakeTime,
    bedtime,
    dinnerTime,
    routineStart,
    primaryProfile,
    secondaryProfile,
    profileInstruction: profileInstruction[primaryProfile],
    steps,
  };
}

function calculateBedtime({ age, wakeTime, napTaken, napWakeTime }) {
  let bedtimeMinutes;

  if (age >= 2 && age <= 5 && napTaken && napWakeTime) {
    bedtimeMinutes = toMinutes(napWakeTime) + 390;
  } else if (age >= 3 && !napTaken) {
    bedtimeMinutes = toMinutes(wakeTime) + 750;
  } else if (napTaken && napWakeTime) {
    bedtimeMinutes = toMinutes(napWakeTime) + 390;
  } else {
    bedtimeMinutes = toMinutes(wakeTime) + 735;
  }

  bedtimeMinutes = Math.max(toMinutes("18:30"), Math.min(toMinutes("21:00"), bedtimeMinutes));
  return fromMinutes(bedtimeMinutes);
}

function buildSteps({ primaryProfile, secondaryProfile, bedtime, routineStart, dislikedByFunction }) {
  let cursor = toMinutes(routineStart);
  const bedtimeMinutes = toMinutes(bedtime);

  return profileSequences[primaryProfile].map((functionKey, index, sequence) => {
    const start = cursor;
    const isLast = index === sequence.length - 1;
    const end = isLast ? bedtimeMinutes : Math.min(start + durations[functionKey], bedtimeMinutes);
    cursor = end;
    const activity = pickActivity(functionKey, dislikedByFunction);

    return {
      functionKey,
      activity,
      purpose: functionDescription[functionKey],
      start: fromMinutes(start),
      end: fromMinutes(end),
      note: buildStepNote(primaryProfile, secondaryProfile, functionKey),
    };
  });
}

function buildStepNote(primaryProfile, secondaryProfile, functionKey) {
  if (functionKey === "connection" && primaryProfile === "C") {
    return "Hazlo con presencia total y después marca un límite claro: hoy seguimos este orden y ya no agregamos cosas nuevas.";
  }
  if (functionKey === "vestibular" && primaryProfile === "F") {
    return "Tu contacto forma parte de la regulación. Quédate cerquita, pero sin abrir una actividad nueva.";
  }
  if (functionKey === "proprioception" && primaryProfile === "H") {
    return "Si se despierta más tarde, vuelve primero a presión y ritmo antes de cambiar de estrategia.";
  }
  if (secondaryProfile === "F" && functionKey === "breathing") {
    return "Si notas que se relaja más contigo cerca, acompáñalo a tu lado mientras hace esta parte.";
  }
  return "Mantén esta parte breve, predecible y sin añadir conversación extra.";
}

function pickActivity(functionKey, dislikedByFunction = {}) {
  const disliked = dislikedByFunction[functionKey] || [];
  return activityLibrary[functionKey].find((activity) => !disliked.includes(activity)) || activityLibrary[functionKey][0];
}

export function calculateLatency(bedTime, sleepTime) {
  let difference = toMinutes(sleepTime) - toMinutes(bedTime);
  if (difference < 0) difference += 24 * 60;
  return difference;
}

export function buildChartPoints(logs) {
  const entries = [...logs].reverse();
  const max = Math.max(...entries.map((entry) => entry.latency), 15);
  const width = 620;
  const inner = 540;

  const circles = entries.map((entry, index) => {
    const x = 40 + (index * inner) / Math.max(entries.length - 1, 1);
    const y = 200 - (entry.latency / max) * 160;
    return { x, y };
  });

  return {
    points: circles.map((circle) => `${circle.x},${circle.y}`).join(" "),
    circles,
    labels: entries.map((entry, index) => ({
      text: entry.date.slice(5),
      x: 40 + (index * inner) / Math.max(entries.length - 1, 1),
    })),
  };
}

function toMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function fromMinutes(total) {
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minute = String(normalized % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function addMinutes(time, minutes) {
  return fromMinutes(toMinutes(time) + minutes);
}
