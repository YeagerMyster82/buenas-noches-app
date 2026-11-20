export const STORAGE_KEY = "ne-ruta-v1";

export const OVERLAP = { a: "stnr-4", b: "galant-3" };

export const SECTIONS = [
  {
    id: "moro",
    heading: "Ruidos, sustos y cambios",
    moduleId: "moro",
    moduleLabel: "Moro",
    firstLessonSlug: "ejercicios-para-el-moro",
    observations: [
      { id: "moro-1", text: "Se sobresalta con ruidos como la licuadora, una moto o una puerta que se cierra de golpe." },
      { id: "moro-2", text: "En una fiesta o reunión, se tapa los oídos o me pide salir porque hay mucho ruido." },
      { id: "moro-3", text: "Se despierta con ruidos de la casa, aunque estemos hablando bajito." },
      { id: "moro-4", text: "Después de un susto, le cuesta volver al juego que estaba disfrutando." },
      { id: "moro-5", text: "Si cambia un plan que ya le habíamos contado, le cuesta pasar al plan nuevo." },
    ],
  },
  {
    id: "atnr",
    heading: "En el colegio y al hacer la tarea",
    moduleId: "atnr",
    moduleLabel: "ATNR",
    firstLessonSlug: "como-chequear-stnr",
    observations: [
      { id: "atnr-1", text: "Mientras hace la tarea, tengo que decirle varias veces «vuelve a lo que estabas haciendo»." },
      { id: "atnr-2", text: "Empieza a escribir o dibujar sentado y al rato tiene la cabeza apoyada sobre la mesa." },
      { id: "atnr-3", text: "Se levanta varias veces antes de terminar una tarea corta, incluso cuando sabe cómo hacerla." },
      { id: "atnr-4", text: "Su profe me dice que necesita varios recordatorios para seguir trabajando en clase." },
      { id: "atnr-5", text: "Trae a casa trabajos que dejó a medias, aunque cuando los hacemos juntos entiende qué hay que hacer." },
    ],
  },
  {
    id: "stnr",
    heading: "Cómo se sienta y se mueve al jugar",
    moduleId: "stnr",
    moduleLabel: "STNR",
    firstLessonSlug: "15-ejercicios-stnr",
    observations: [
      { id: "stnr-1", text: "Cuando juega en el piso, se sienta en «W», con las rodillas hacia adelante y los pies a los lados de la cadera." },
      { id: "stnr-2", text: "Varias veces al día le digo «siéntate derecho» porque termina encorvado al comer, dibujar o hacer la tarea." },
      { id: "stnr-3", text: "Cuando corre o juega, se tropieza o se choca con cosas, incluso en lugares que conoce." },
      { id: "stnr-4", text: "En juegos con pelota, le cuesta atraparla, patearla hacia donde quiere o seguir el ritmo del juego." },
      { id: "stnr-5", text: "Cuando otros niños empiezan a jugar fútbol, a saltar la cuerda o a hacer una carrera, suele quedarse mirando o buscar otra cosa que hacer." },
    ],
  },
  {
    id: "galant",
    heading: "La ropa en la cintura y la silla",
    moduleId: "spinal-galant",
    moduleLabel: "Galant",
    firstLessonSlug: "ejercicios-spinal-galant-perez",
    observations: [
      { id: "galant-1", text: "Apenas se viste, se jala o se baja la pretina porque le molesta." },
      { id: "galant-2", text: "Me pide que le quite la etiqueta del pantalón porque le pica justo en la espalda baja." },
      { id: "galant-3", text: "Deja de ponerse ciertos pantalones o pijamas porque dice que le aprietan o le rozan en la cintura." },
      { id: "galant-4", text: "Durante la comida, se retuerce o se va deslizando en la silla." },
      { id: "galant-5", text: "Cuando le acomodo la camiseta por detrás del pantalón, se ladea o se aparta." },
    ],
  },
  {
    id: "perez",
    heading: "El contacto en la espalda",
    moduleId: "spinal-galant",
    moduleLabel: "Pérez",
    firstLessonSlug: "ejercicios-spinal-galant-perez",
    observations: [
      { id: "perez-1", text: "Cuando salimos del baño, me pide que no le frote la espalda con la toalla." },
      { id: "perez-2", text: "Cuando le enjabono la espalda, se aparta al pasarle la mano por el centro." },
      { id: "perez-3", text: "Se queja si la costura o el cierre de una prenda le queda justo en medio de la espalda." },
      { id: "perez-4", text: "En una silla con respaldo duro, se sienta hacia adelante para que el respaldo no le toque la espalda." },
      { id: "perez-5", text: "Si le acaricio la espalda para darle cariño o ayudarle a relajarse, me pide que pare." },
    ],
  },
  {
    id: "palmar",
    heading: "Lápiz, ropa y cubiertos",
    moduleId: "reflejo-palmar",
    moduleLabel: "Palmar",
    firstLessonSlug: "ejercicios-palmar-plantar-rooting",
    observations: [
      { id: "palmar-1", text: "Aprieta tanto el lápiz que deja la marca en la hoja de abajo o rompe la punta." },
      { id: "palmar-2", text: "A mitad de un dibujo o una tarea, me dice «ya se me cansó la mano»." },
      { id: "palmar-3", text: "Me pide que le ayude a abrocharse los botones o a enganchar el cierre de la casaca." },
      { id: "palmar-4", text: "Cuando algo se le cae del tenedor varias veces, termina agarrándolo con la mano o me pide ayuda." },
      { id: "palmar-5", text: "Cuando juega con piezas pequeñas, me pide que las junte o las separe porque le cuesta hacerlo con los dedos." },
    ],
  },
  {
    id: "babinski",
    heading: "Pies, zapatos y caminatas",
    moduleId: "reflejo-plantar",
    moduleLabel: "Babinski",
    firstLessonSlug: "20-ejercicios-babinski-plantar",
    observations: [
      { id: "babinski-1", text: "En la playa o en el parque, me pide sus zapatos para caminar sobre la arena o el pasto." },
      { id: "babinski-2", text: "Lo veo caminar de puntitas por la casa, incluso cuando va de un cuarto a otro." },
      { id: "babinski-3", text: "Se quita ciertos zapatos o medias al llegar a casa y me dice que le molestan los pies." },
      { id: "babinski-4", text: "Cuando se pone un zapato estando de pie, busca una pared o me agarra la mano para no perder el equilibrio." },
      { id: "babinski-5", text: "En caminatas que hacemos seguido, me pide sentarse o que lo cargue porque se le cansan los pies o las piernas." },
    ],
  },
  {
    id: "busqueda",
    heading: "Cara, dientes y comida",
    moduleId: "reflejo-busqueda",
    moduleLabel: "Búsqueda",
    firstLessonSlug: "20-actividades-reflejo-busqueda",
    observations: [
      { id: "busqueda-1", text: "Cuando le limpio la boca después de comer, gira la cara o me quita la servilleta." },
      { id: "busqueda-2", text: "A la hora de cepillarse los dientes, cierra la boca o gira la cabeza cuando intento ayudarle." },
      { id: "busqueda-3", text: "Puede comer un yogur liso sin problema, pero lo deja si encuentra grumos o trocitos." },
      { id: "busqueda-4", text: "Mientras mira una pantalla, dibuja o juega, lo encuentro masticando la manga, el cuello del polo o el lápiz." },
      { id: "busqueda-5", text: "Con algunos alimentos que ya conoce, sigue masticando mucho después de que el resto terminó ese bocado." },
    ],
  },
];

function sectionFor(obsId) {
  return SECTIONS.find(s => s.observations.some(o => o.id === obsId));
}

export function computeResult(selections, skipped, priority) {
  // selections: Set<string>, skipped: Set<string>, priority: string|null
  const selArr = [...selections];

  // Zero selections
  if (selArr.length === 0) {
    return { first: null, second: null, tieOptions: [] };
  }

  // Special overlap-only case
  const onlyOverlap =
    selArr.length === 2 &&
    selArr.includes(OVERLAP.a) &&
    selArr.includes(OVERLAP.b);
  if (onlyOverlap) {
    const stnrSec = SECTIONS.find(s => s.id === "stnr");
    const galantSec = SECTIONS.find(s => s.id === "galant");
    return { first: null, second: null, tieOptions: [stnrSec, galantSec] };
  }

  // Raw counts per section
  const rawCounts = {};
  for (const sec of SECTIONS) {
    rawCounts[sec.id] = sec.observations.filter(o => selections.has(o.id)).length;
  }

  // Adjusted counts for ranking (subtract overlap point from both if both selected)
  const bothOverlap = selections.has(OVERLAP.a) && selections.has(OVERLAP.b);
  const adjCounts = { ...rawCounts };
  if (bothOverlap) {
    adjCounts["stnr"] = Math.max(0, adjCounts["stnr"] - 1);
    adjCounts["galant"] = Math.max(0, adjCounts["galant"] - 1);
  }

  function toResult(sec) {
    return {
      sectionId: sec.id,
      moduleId: sec.moduleId,
      moduleLabel: sec.moduleLabel,
      heading: sec.heading,
      firstLessonSlug: sec.firstLessonSlug,
    };
  }

  // --- Priority path ---
  if (priority) {
    const prioritySec = sectionFor(priority);
    if (!prioritySec) return { first: null, second: null, tieOptions: [] };
    const first = toResult(prioritySec);

    // Find best second: different moduleId, count >= 1
    const candidates = SECTIONS.filter(
      s => s.moduleId !== prioritySec.moduleId && adjCounts[s.id] >= 1
    );

    if (candidates.length === 0) {
      return { first, second: null, tieOptions: [] };
    }

    // Check galant/perez same moduleId conflict among candidates
    const second = pickBest(candidates, adjCounts);
    if (second && second.tieOptions) {
      return { first, second: null, tieOptions: second.tieOptions };
    }
    return { first, second: second ? toResult(second) : null, tieOptions: [] };
  }

  // --- No priority path ---
  // All sections with count >= 1
  const eligible = SECTIONS.filter(s => adjCounts[s.id] >= 1);

  if (eligible.length === 0) {
    return { first: null, second: null, tieOptions: [] };
  }

  const firstResult = pickBest(eligible, adjCounts);
  if (firstResult && firstResult.tieOptions) {
    return { first: null, second: null, tieOptions: firstResult.tieOptions };
  }
  if (!firstResult) {
    return { first: null, second: null, tieOptions: [] };
  }

  const first = toResult(firstResult);

  // Second: different moduleId, count >= 1
  const remaining = eligible.filter(s => s.moduleId !== firstResult.moduleId);
  if (remaining.length === 0) {
    // Check if only galant/perez remain (same moduleId as first) — no second
    return { first, second: null, tieOptions: [] };
  }

  const secondResult = pickBest(remaining, adjCounts);
  if (secondResult && secondResult.tieOptions) {
    return { first, second: null, tieOptions: secondResult.tieOptions };
  }
  return { first, second: secondResult ? toResult(secondResult) : null, tieOptions: [] };
}

// Returns the highest-count section from candidates, or { tieOptions } if tie
function pickBest(candidates, adjCounts) {
  if (candidates.length === 0) return null;

  const maxCount = Math.max(...candidates.map(s => adjCounts[s.id]));
  const tied = candidates.filter(s => adjCounts[s.id] === maxCount);

  if (tied.length === 1) return tied[0];

  // Multiple tied — check if they all share the same moduleId (galant/perez case)
  const moduleIds = [...new Set(tied.map(s => s.moduleId))];
  if (moduleIds.length === 1) {
    // All same module (e.g. galant vs perez both spinal-galant) — tie needs resolution
    return { tieOptions: tied };
  }

  // Different modules tied — needs resolution
  return { tieOptions: tied.slice(0, 2) };
}

export function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
