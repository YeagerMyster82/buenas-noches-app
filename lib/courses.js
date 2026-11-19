// Course content data
// youtubeId: YouTube video ID for free lessons (no access check). Fill in once published.
// bunnyId: Bunny.net "library-id/video-id" for paid lessons. Fill in once uploaded.
// Leave both null for a "próximamente" placeholder.

export const NEUROESENCIA = {
  id: "neuroesencia",
  title: "NeuroEsencia",
  description: "Reflejos primitivos: qué son, cómo evaluarlos y qué hacer cuando siguen presentes.",
  modules: [
    {
      id: "intro",
      title: "Introducción",
      lessons: [
        {
          slug: "el-secreto-de-los-ejercicios",
          title: "El secreto de los ejercicios para los reflejos primitivos",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "reflejo-palmar",
      title: "Reflejo Palmar",
      lessons: [
        {
          slug: "ejercicios-palmar-plantar-rooting",
          title: "Ejercicios para Palmar / Plantar / Rooting",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "14-ejercicios-integrar-reflejo-palmar",
          title: "14 ejercicios para integrar el reflejo Palmar",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "stnr",
      title: "STNR",
      lessons: [
        {
          slug: "15-ejercicios-stnr",
          title: "15+ Ejercicios para STNR",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "ejercicios-atnr-stnr",
          title: "Ejercicios para ATNR / STNR",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "atnr",
      title: "ATNR",
      lessons: [
        {
          slug: "como-chequear-stnr",
          title: "¿Cómo chequear STNR?",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "como-chequear-atnr",
          title: "¿Cómo chequear ATNR?",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "15-ejercicios-integrar-atnr",
          title: "15+ Ejercicios para integrar ATNR",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "moro",
      title: "Reflejo de Moro",
      lessons: [
        {
          slug: "ejercicios-para-el-moro",
          title: "Ejercicios para el Moro",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "20-ejercicios-integrar-moro",
          title: "20+ Ejercicios para integrar MORO",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "spinal-galant",
      title: "Spinal Galant / Spinal Perez",
      lessons: [
        {
          slug: "ejercicios-spinal-galant-perez",
          title: "Ejercicios para Spinal Galant / Spinal Perez",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "20-ejercicios-integrar-spinal-galant",
          title: "20 ejercicios para integrar Spinal Galant",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "reflejo-plantar",
      title: "Reflejo Plantar",
      lessons: [
        {
          slug: "20-ejercicios-babinski-plantar",
          title: "20 ejercicios para integrar Babinski / Plantar",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "reflejo-busqueda",
      title: "Reflejo Búsqueda / Rooting",
      lessons: [
        {
          slug: "20-actividades-reflejo-busqueda",
          title: "20 actividades para integrar el reflejo Búsqueda / Rooting",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "simetria-cerebral",
      title: "Simetría Cerebral",
      lessons: [
        {
          slug: "importancia-simetria-cerebro",
          title: "La importancia de chequear la simetría del cerebro",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "mismo-lado-debilidad-nervios",
          title: "En el mismo lado de la debilidad — nervios craneales, sistema motor, señales posturales",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "mismo-lado-debilidad-vestibular",
          title: "En el mismo lado de la debilidad — sistema vestibular",
          youtubeId: null,
          bunnyId: null,
        },
        {
          slug: "lado-opuesto-debilidad",
          title: "En el lado OPUESTO de la debilidad",
          youtubeId: null,
          bunnyId: null,
        },
      ],
    },
    {
      id: "plan-accion",
      title: "Armando un Plan de Acción",
      lessons: [
        {
          slug: "armar-tu-plan-de-accion",
          title: "Armar tu plan de acción",
          youtubeId: null,
          bunnyId: null,
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
    // More modules to be added once video list is provided
  ],
};

// Helpers
export function getLessonBySlug(course, slug) {
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (lesson.slug === slug) return { lesson, module: mod };
    }
  }
  return null;
}

export function getAllLessons(course) {
  return course.modules.flatMap(mod =>
    mod.lessons.map(lesson => ({ ...lesson, moduleId: mod.id, moduleTitle: mod.title }))
  );
}

export function getAdjacentLessons(course, slug) {
  const all = getAllLessons(course);
  const idx = all.findIndex(l => l.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
