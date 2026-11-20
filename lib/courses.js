// Course content — youtubeId = free (YouTube), bunnyId = paid (Bunny library 815157)
// free: true forces a lesson free even without a youtubeId

import { EJERCICIOS_BIBLIOTECA, MUESTRAS_YOUTUBE } from "./exercises.js";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// One exercise module per reflex: free YouTube sample first, then all paid Bunny videos
const EXERCISE_MODULES = EJERCICIOS_BIBLIOTECA.map((group) => {
  const sample = MUESTRAS_YOUTUBE.find((s) => s.reflex === group.reflex);
  const freeSample = sample
    ? [
        {
          slug: `muestra-${slugify(group.reflex)}`,
          title: sample.title,
          youtubeId: sample.youtubeId,
          bunnyId: null,
          free: true,
        },
      ]
    : [];

  const paidLessons = group.exercises.map((ex, i) => ({
    slug: `ejercicio-${slugify(group.reflex)}-${i + 1}`,
    title: ex.title,
    youtubeId: null,
    bunnyId: ex.bunnyId,
  }));

  return {
    id: `ejercicios-${slugify(group.reflex)}`,
    title: `Ejercicios: ${group.reflex}`,
    lessons: [...freeSample, ...paidLessons],
  };
});

export const NEUROESENCIA = {
  id: "neuroesencia",
  title: "NeuroEsencia",
  description: "Reflejos primitivos: qué son, cómo evaluarlos y qué hacer cuando siguen presentes.",
  modules: [
    {
      id: "intro-desarrollo",
      title: "Introducción al desarrollo cerebral",
      lessons: [
        {
          slug: "por-que-reflejos-primitivos",
          title: "¿Por qué los reflejos primitivos son tan importantes en el desarrollo de mi hijo?",
          youtubeId: "8blREqGyD80",
          bunnyId: null,
          free: true,
        },
        {
          slug: "como-se-desarrolla-el-cerebro",
          title: "¿Cómo se desarrolla el cerebro?",
          youtubeId: null,
          bunnyId: "b2548590-266f-4aff-a5ba-e5d037833e01",
        },
        {
          slug: "3-pilares-desarrollo-cerebral",
          title: "3 pilares para el desarrollo cerebral",
          youtubeId: null,
          bunnyId: "7db1de84-c0a5-4664-92ca-97fb877bec7f",
        },
        {
          slug: "por-que-reflejos-activos",
          title: "¿Por qué mi hijo tiene reflejos primitivos activos?",
          youtubeId: null,
          bunnyId: "b9280548-329f-4729-98ca-66edb30b55fe",
        },
      ],
    },
    {
      id: "plantar-palmar-rooting",
      title: "Plantar (Babinski) / Palmar / Rooting",
      lessons: [
        {
          slug: "que-es-babinski-plantar",
          title: "¿Qué es el plantar (Babinski)?",
          youtubeId: null,
          bunnyId: "86374db4-5b88-400f-9d60-97551f35137a",
        },
        {
          slug: "que-es-palmar",
          title: "¿Qué es el palmar?",
          youtubeId: null,
          bunnyId: "9c7dc250-11cb-41fe-8078-d91e1b2c3300",
        },
        {
          slug: "que-es-rooting",
          title: "¿Qué es el Rooting (Búsqueda)?",
          youtubeId: null,
          bunnyId: "87888b23-76b7-440a-9d3a-c663ca2434f4",
        },
        {
          slug: "como-chequear-palmar-babinski-rooting",
          title: "¿Cómo chequear los 3 reflejos sensoriales?",
          youtubeId: "Haaxpj6sk_g",
          bunnyId: null,
          free: true,
        },
      ],
    },
    {
      id: "moro",
      title: "Moro",
      lessons: [
        {
          slug: "que-es-moro",
          title: "¿Qué es el Moro?",
          youtubeId: null,
          bunnyId: "8681c15b-375c-45fd-b1a0-228369838218",
        },
        {
          slug: "como-chequear-moro",
          title: "¿Cómo chequear el Moro?",
          youtubeId: "hQ648-COAMM",
          bunnyId: null,
          free: true,
        },
      ],
    },
    {
      id: "spinal-galant-perez",
      title: "Spinal Galant / Spinal Pérez",
      lessons: [
        {
          slug: "que-es-spinal-galant-perez",
          title: "¿Qué es el Spinal Galant / Spinal Pérez?",
          youtubeId: null,
          bunnyId: "28cbc8f0-ed45-4c13-a67a-3c8a276f14d7",
        },
        {
          slug: "como-chequear-spinal-galant-perez",
          title: "¿Cómo chequear el Spinal Galant / Spinal Pérez?",
          youtubeId: "w2H0ODtRbpA",
          bunnyId: null,
          free: true,
        },
      ],
    },
    {
      id: "atnr-stnr",
      title: "ATNR / STNR",
      lessons: [
        {
          slug: "que-es-stnr",
          title: "¿Qué es el STNR?",
          youtubeId: null,
          bunnyId: "ef2f9eec-bef9-4ce5-9682-bef610ffb85c",
        },
        {
          slug: "que-es-atnr",
          title: "¿Qué es el ATNR?",
          youtubeId: null,
          bunnyId: "93ffd78d-628b-48f1-93e1-827eea183ddc",
        },
        {
          slug: "como-chequear-stnr",
          title: "¿Cómo chequear STNR?",
          youtubeId: "D43RVu0uD34",
          bunnyId: null,
          free: true,
        },
        {
          slug: "como-chequear-atnr",
          title: "¿Cómo chequear ATNR?",
          youtubeId: "3-glqx_pF7Y",
          bunnyId: null,
          free: true,
        },
      ],
    },
    {
      id: "ejercicios-secreto",
      title: "Ejercicios para los reflejos primitivos",
      lessons: [
        {
          slug: "el-secreto-de-los-ejercicios",
          title: "El secreto de los ejercicios para integrar",
          youtubeId: null,
          bunnyId: "f6bf6a56-5890-48d8-9c67-a9b209b23404",
        },
      ],
    },
    // ~20 individual paid exercise videos per reflex, each with a free YouTube sample first
    ...EXERCISE_MODULES,
    {
      id: "simetria-cerebral",
      title: "Simetría cerebral",
      lessons: [
        {
          slug: "importancia-simetria-cerebro",
          title: "La importancia de chequear la simetría del cerebro",
          youtubeId: null,
          bunnyId: "d45d89d2-19d8-4183-9c10-5e05056efbf6",
        },
        {
          slug: "mismo-lado-debilidad-nervios",
          title: "En el mismo lado de la debilidad — nervios craneales, sistema motor, señales posturales",
          youtubeId: null,
          bunnyId: "9cf5854a-2c48-4dc4-9959-d34831e7a614",
        },
        {
          slug: "mismo-lado-debilidad-vestibular",
          title: "En el mismo lado de la debilidad — sistema vestibular",
          youtubeId: null,
          bunnyId: "d122cad4-8b4c-422b-93ef-fe70b98b4f01",
        },
        {
          slug: "lado-opuesto-debilidad",
          title: "En el lado OPUESTO de la debilidad",
          youtubeId: null,
          bunnyId: "5fd562fd-1970-4660-8f1a-bcf7560e2165",
        },
      ],
    },
    {
      id: "plan-accion",
      title: "Armando un plan de acción",
      lessons: [
        {
          slug: "armar-tu-plan-de-accion",
          title: "Armar tu plan de acción",
          youtubeId: null,
          bunnyId: "15123559-e31c-47a9-a17c-6b9c285e767e",
        },
      ],
    },
  ],
};

export const BUENAS_NOCHES_COURSE = {
  id: "buenas-noches",
  title: "Buenas Noches",
  description: "18 actividades para calmar el sistema nervioso antes de dormir.",
  modules: [
    {
      id: "introduccion",
      title: "Introducción",
      lessons: [
        {
          slug: "bienvenida",
          title: "Bienvenida al curso",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "como-funciona-la-app",
          title: "Cómo usar la app",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
  ],
};

// A lesson is free if it has free: true OR has a youtubeId
export function isLessonFree(lesson) {
  return !!(lesson.free || lesson.youtubeId);
}

export function getLessonBySlug(course, slug) {
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (lesson.slug === slug) return { lesson, module: mod };
    }
  }
  return null;
}

export function getAllLessons(course) {
  return course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({ ...lesson, moduleId: mod.id, moduleTitle: mod.title }))
  );
}

export function getAdjacentLessons(course, slug) {
  const all = getAllLessons(course);
  const idx = all.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
