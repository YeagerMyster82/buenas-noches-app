export const STORAGE_KEY = "ne-ruta-v1";

export const OVERLAP = { a: "stnr-4", b: "galant-3" };

export const SECTIONS = [
  {
    id: "moro",
    heading: "Ruidos, sorpresas y cambios",
    moduleId: "moro",
    moduleLabel: "Moro",
    firstLessonSlug: "ejercicios-para-el-moro",
    observations: [
      { id: "moro-1", text: "Se sobresalta con ruidos inesperados." },
      { id: "moro-2", text: "Le molestan mucho las luces intensas o los lugares ruidosos." },
      { id: "moro-3", text: "Se despierta fácilmente con sonidos." },
      { id: "moro-4", text: "Le cuesta calmarse después de una sorpresa." },
      { id: "moro-5", text: "Se altera cuando hay un cambio de planes inesperado." },
    ],
  },
  {
    id: "atnr",
    heading: "Coordinar ambos lados del cuerpo",
    moduleId: "atnr",
    moduleLabel: "ATNR",
    firstLessonSlug: "como-chequear-stnr",
    observations: [
      { id: "atnr-1", text: "Al girar la cabeza, también gira el tronco durante una tarea." },
      { id: "atnr-2", text: "Le cuesta sostener el papel con una mano mientras dibuja con la otra." },
      { id: "atnr-3", text: "Cambia el objeto de mano para alcanzar algo del lado contrario." },
      { id: "atnr-4", text: "Pierde el renglón con frecuencia al leer." },
      { id: "atnr-5", text: "Le cuesta coordinar las dos manos al recortar." },
    ],
  },
  {
    id: "stnr",
    heading: "Postura al jugar y hacer tareas",
    moduleId: "stnr",
    moduleLabel: "STNR",
    firstLessonSlug: "15-ejercicios-stnr",
    observations: [
      { id: "stnr-1", text: "Se sienta con las piernas en «W»." },
      { id: "stnr-2", text: "Se recuesta sobre la mesa al hacer una tarea." },
      { id: "stnr-3", text: "Apoya la cabeza en la mano mientras trabaja." },
      { id: "stnr-4", text: "Cambia mucho de postura para seguir sentado." },
      { id: "stnr-5", text: "Al mirar hacia arriba o abajo mientras juega en cuatro apoyos, cambia de posición o pierde el apoyo." },
    ],
  },
  {
    id: "galant",
    heading: "Ropa, silla y espalda baja",
    moduleId: "spinal-galant",
    moduleLabel: "Galant",
    firstLessonSlug: "ejercicios-spinal-galant-perez",
    observations: [
      { id: "galant-1", text: "Se acomoda la pretina una y otra vez." },
      { id: "galant-2", text: "Le molestan las etiquetas o costuras cerca de la espalda baja." },
      { id: "galant-3", text: "Se retuerce o se desliza en la silla." },
      { id: "galant-4", text: "Se ladea al sentir un roce en un costado de la espalda baja." },
      { id: "galant-5", text: "Prefiere ponerse de pie durante actividades que suele hacer sentado." },
    ],
  },
  {
    id: "perez",
    heading: "Contacto en el centro de la espalda",
    moduleId: "spinal-galant",
    moduleLabel: "Pérez",
    firstLessonSlug: "ejercicios-spinal-galant-perez",
    observations: [
      { id: "perez-1", text: "Le incomoda el roce en el centro de la espalda al vestirse." },
      { id: "perez-2", text: "Se aparta cuando le secan esa zona con una toalla." },
      { id: "perez-3", text: "Arquea la espalda al sentir un contacto inesperado en esa zona." },
      { id: "perez-4", text: "Le molesta apoyarse contra un respaldo firme." },
      { id: "perez-5", text: "Mantiene la espalda muy rígida al cambiar de postura." },
    ],
  },
  {
    id: "palmar",
    heading: "Manos, lápiz y objetos pequeños",
    moduleId: "reflejo-palmar",
    moduleLabel: "Palmar",
    firstLessonSlug: "ejercicios-palmar-plantar-rooting",
    observations: [
      { id: "palmar-1", text: "Aprieta mucho el lápiz o crayón." },
      { id: "palmar-2", text: "Se le cansa la mano al dibujar o escribir." },
      { id: "palmar-3", text: "Le cuesta manejar botones o cierres." },
      { id: "palmar-4", text: "Le cuesta usar cubiertos con comodidad." },
      { id: "palmar-5", text: "Le cuesta manipular piezas pequeñas en juegos que ya conoce." },
    ],
  },
  {
    id: "babinski",
    heading: "Pies, caminata y equilibrio",
    moduleId: "reflejo-plantar",
    moduleLabel: "Babinski",
    firstLessonSlug: "20-ejercicios-babinski-plantar",
    observations: [
      { id: "babinski-1", text: "Evita caminar descalzo sobre algunas superficies." },
      { id: "babinski-2", text: "Camina de puntitas con frecuencia." },
      { id: "babinski-3", text: "Tropieza a menudo en recorridos que conoce." },
      { id: "babinski-4", text: "Le cuesta mantener el equilibrio en juegos que ya practica." },
      { id: "babinski-5", text: "Se cansa con facilidad al caminar o estar de pie." },
    ],
  },
  {
    id: "busqueda",
    heading: "Cara, boca y comidas",
    moduleId: "reflejo-busqueda",
    moduleLabel: "Búsqueda",
    firstLessonSlug: "20-actividades-reflejo-busqueda",
    observations: [
      { id: "busqueda-1", text: "Le incomoda que le limpien la cara." },
      { id: "busqueda-2", text: "Le molesta el contacto alrededor de la boca al cepillarse los dientes." },
      { id: "busqueda-3", text: "Evita ciertas texturas al comer." },
      { id: "busqueda-4", text: "Se lleva objetos a la boca con frecuencia." },
      { id: "busqueda-5", text: "Le cuesta masticar algunos alimentos que ya forman parte de su dieta." },
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
