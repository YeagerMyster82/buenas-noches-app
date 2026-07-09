"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getProfileMap,
  getQuestions,
  scoreAnswers,
  resolveTieCandidates,
  buildResultCopy,
} from "../lib/quiz";
import {
  buildPlan,
  buildProgressSummary,
  calculateAgeFromBirthday,
  calculateLatency,
  formatAgeLabel,
  getChildSlots,
  getSleepAreaResult,
  normalizeNightWakings,
} from "../lib/routine";

const storageKey = "buenas-noches-webapp-v3";
const SALES_FUNNEL_URL = "https://buenasnoches.quirokids.com/buenas-noches-app-424830";
const SUPPORT_WHATSAPP_URL = "https://wa.link/10n15d";
const SUPPORT_EMAIL = "BuenasNochesApp@quirokids.com";
const AMAZON_STORE_URL = "https://www.amazon.com/shop/quirokids";
const FREE_PROFILE_EXPIRY_MS = 14 * 24 * 60 * 60 * 1000;
const TRANSITION_SOUND_URL = "/audio/transition-bell.mp3";

function toYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
  } catch {
    return url;
  }

  return url;
}

const SUPABASE_MUSIC_BASE = "https://wcmpbgcrglduwguxytui.supabase.co/storage/v1/object/public/music";

// Profile-specific 10-min tracks (play once, then chain to lullaby)
const profileMusicTracks = {
  incansable: `${SUPABASE_MUSIC_BASE}/music_2026-07-09T14-45-36-104Z.mp3`,
  vigilante: `${SUPABASE_MUSIC_BASE}/music_2026-07-09T14-46-30-638Z.mp3`,
  negociador: `${SUPABASE_MUSIC_BASE}/music_2026-07-09T14-47-39-131Z.mp3`,
  volcan: `${SUPABASE_MUSIC_BASE}/music_2026-07-09T14-48-30-509Z.mp3`,
  explorador: `${SUPABASE_MUSIC_BASE}/music_2026-07-09T14-49-22-147Z.mp3`,
};
const LULLABY_URL = `${SUPABASE_MUSIC_BASE}/music_2026-07-09T14-49-50-432Z.mp3`;

// Map primaryProfile slug → profileMusicTracks key
const PROFILE_MUSIC_MAP = {
  incansable: "incansable",
  "el-incansable": "incansable",
  vigilante: "vigilante",
  "el-vigilante-nocturno": "vigilante",
  "vigilante-nocturno": "vigilante",
  negociador: "negociador",
  "el-negociador": "negociador",
  volcan: "volcan",
  "volcan-emocional": "volcan",
  "el-volcan-emocional": "volcan",
  explorador: "explorador",
  "el-explorador-nocturno": "explorador",
  "explorador-nocturno": "explorador",
};

const routineMusicTracks = {
  calm: {
    label: "Música 1",
    audioUrl: "https://player.mediadelivery.net/play/640174/942dad41-06cb-4aef-8e10-1a97619b3bc2",
  },
  nature: {
    label: "Música 2",
    audioUrl: "https://player.mediadelivery.net/play/640174/b98b4bfe-87b5-4682-9687-d1e5080c754f",
  },
  track3: {
    label: "Música 3",
    audioUrl: "https://player.mediadelivery.net/play/640174/306bc86b-b6c1-4dcd-8097-44cf87351538",
  },
  profile: {
    label: "Música del perfil",
    audioUrl: null, // resolved dynamically from child's primaryProfile
  },
};

const routineVideoResources = {
  descarga: {
    title: "Descarga",
    embedUrl: "https://player.mediadelivery.net/embed/640174/24082507-a357-46d1-8d8d-fe2c9bc7becd?autoplay=false&preload=false&responsive=true",
  },
  activacion_ligera: {
    title: "Activación ligera",
    embedUrl: "https://player.mediadelivery.net/embed/640174/cfaffd3e-15ea-48f5-acfa-ae49f6cabde1?autoplay=false&preload=false&responsive=true",
  },
  conexion: {
    title: "Conexión",
    embedUrl: "https://player.mediadelivery.net/embed/640174/f4699082-c82e-42ba-9fda-70b6de648b17?autoplay=false&preload=false&responsive=true",
  },
  berrinches_coregulacion: {
    title: "Berrinches / coregulación",
    embedUrl: "https://player.mediadelivery.net/embed/640174/4df00984-616e-49c5-8606-49d95c8df1bf?autoplay=false&preload=false&responsive=true",
  },
  compresiones_articulares: {
    title: "Compresiones articulares",
    embedUrl: "https://player.mediadelivery.net/embed/640174/9b2d2cc7-2121-4890-b5b5-e6faa5b54ac9?autoplay=false&preload=false&responsive=true",
  },
  presion_profunda: {
    title: "Presión profunda",
    embedUrl: "https://player.mediadelivery.net/embed/640174/39b6780f-ea8d-4506-922e-0e58aa5bdcac?autoplay=false&preload=false&responsive=true",
  },
  mecerse_presion: {
    title: "Mecerse + presión profunda",
    embedUrl: "https://player.mediadelivery.net/embed/640174/c5890def-ca84-4a0f-9865-eb2a3da7faac?autoplay=false&preload=false&responsive=true",
  },
  gargaras_tarareo_mmm: {
    title: "Gárgaras / tarareo / sonido mmm",
    embedUrl: "https://player.mediadelivery.net/embed/640174/a2076f69-4634-473c-bde3-dc7e36dc2647?autoplay=false&preload=false&responsive=true",
  },
  ponerse_de_cabeza: {
    title: "Ponerse de cabeza",
    embedUrl: "https://player.mediadelivery.net/embed/640174/eb07e87f-74e8-41f3-8bd7-ee1a0b5352db?autoplay=false&preload=false&responsive=true",
  },
  respiracion_conejo: {
    title: "Respiración de conejo",
    embedUrl: "https://player.mediadelivery.net/embed/640174/3073b08a-8154-42eb-a46d-7e2ea0fd69e0?autoplay=false&preload=false&responsive=true",
  },
  oler_la_flor: {
    title: "Oler la flor",
    embedUrl: "https://player.mediadelivery.net/embed/640174/edfdd25c-33da-42ab-a7f2-b8ba566d7b82?autoplay=false&preload=false&responsive=true",
  },
  movimientos_oculares: {
    title: "Movimientos oculares",
    embedUrl: "https://player.mediadelivery.net/embed/640174/74d90717-a573-4782-bd96-3a59e5ea5d95?autoplay=false&preload=false&responsive=true",
  },
  frase_final: {
    title: "La frase final",
    embedUrl: "https://player.mediadelivery.net/embed/640174/6f05fc06-0479-45e4-a60b-ba15d2f2ca30?autoplay=false&preload=false&responsive=true",
  },
  audios_cortos: {
    title: "Audios cortos",
    embedUrl: "https://player.mediadelivery.net/embed/640174/ec5a4b10-ddca-47d8-b359-b1acad6cfc39?autoplay=false&preload=false&responsive=true",
  },
  pesadilla: {
    title: "Si tiene pesadilla",
    embedUrl: "https://player.mediadelivery.net/embed/640174/739af802-75e4-4c76-9df7-a06d6142d739?autoplay=false&preload=false&responsive=true",
  },
  sistema_nervioso: {
    title: "Sistema nervioso y sueño",
    embedUrl: "https://player.mediadelivery.net/embed/640174/ce4fdb77-61eb-49fd-ba3f-69a13790051d?autoplay=false&preload=false&responsive=true",
  },
  perfiles_sueno: {
    title: "Los 5 perfiles y por qué no logran dormir",
    embedUrl: "https://player.mediadelivery.net/embed/640174/8d254f44-f6c1-48db-9abf-cb988338763d?autoplay=false&preload=false&responsive=true",
  },
  homescreen: {
    title: "Cómo agregar la app a tu pantalla de inicio",
    embedUrl: "https://player.mediadelivery.net/embed/640174/e7b6c36f-b38b-43bd-9654-e74ea7a4e79c?autoplay=false&preload=false&responsive=true",
  },
  como_usar_app: {
    title: "Cómo usar el app",
    embedUrl: "https://player.mediadelivery.net/embed/640174/19cc5e2a-13cf-4fcf-94fd-a9a8ef3f30f6?autoplay=false&preload=false&responsive=true",
  },
};

function getRoutineVideosForStep(step, profileCode) {
  if (!step) return [];

  if (step.phaseKey === "mover") {
    if (profileCode === "EL_INAGOTABLE") return [routineVideoResources.descarga];
    if (profileCode === "EL_DESVELADO") return [routineVideoResources.activacion_ligera];
  }

  if (step.phaseKey === "conectar") {
    return [routineVideoResources.conexion];
  }

  if (step.phaseKey === "gargaras_tarareo_mmm") {
    return [routineVideoResources.gargaras_tarareo_mmm, routineVideoResources.ponerse_de_cabeza];
  }

  if (step.phaseKey === "dormir") {
    return [routineVideoResources.frase_final];
  }

  const activityId = step.selectedActivityId;
  if (!activityId) return [];

  if (["presion_cuento", "presion_cancion", "presion_susurro", "presion_contar", "sandwich_almohadas", "rodillo_almohada", "peluche_pesado"].includes(activityId)) {
    return [routineVideoResources.presion_profunda, routineVideoResources.compresiones_articulares];
  }

  if (["mecer_tararear", "mecerse_abrazados", "mecerse_suave"].includes(activityId)) {
    return [routineVideoResources.mecerse_presion];
  }

  if (activityId === "ojos_soplar_respirar") {
    return [routineVideoResources.movimientos_oculares, routineVideoResources.oler_la_flor, routineVideoResources.respiracion_conejo];
  }

  if (["respiracion_abdominal", "exhalacion_larga", "respirar_juntos"].includes(activityId)) {
    return [routineVideoResources.oler_la_flor, routineVideoResources.respiracion_conejo];
  }

  if (["audio_calmado", "historia_corta_repetitiva", "historia_corta_opcional"].includes(activityId)) {
    return [routineVideoResources.audios_cortos];
  }

  if (["contacto_y_ritmo", "tarareo_suave", "respirar_juntos", "voz_suave"].includes(activityId)) {
    return [routineVideoResources.berrinches_coregulacion];
  }

  return [];
}

const activityVideoLibrary = [
  routineVideoResources.descarga,
  routineVideoResources.activacion_ligera,
  routineVideoResources.conexion,
  routineVideoResources.berrinches_coregulacion,
  routineVideoResources.compresiones_articulares,
  routineVideoResources.presion_profunda,
  routineVideoResources.mecerse_presion,
  routineVideoResources.gargaras_tarareo_mmm,
  routineVideoResources.ponerse_de_cabeza,
  routineVideoResources.respiracion_conejo,
  routineVideoResources.oler_la_flor,
  routineVideoResources.movimientos_oculares,
  routineVideoResources.frase_final,
  routineVideoResources.audios_cortos,
  routineVideoResources.pesadilla,
];

const freeProfileVideoLibrary = [routineVideoResources.perfiles_sueno, routineVideoResources.homescreen];

const educationVideoLibrary = [
  routineVideoResources.sistema_nervioso,
  routineVideoResources.como_usar_app,
  routineVideoResources.berrinches_coregulacion,
  routineVideoResources.pesadilla,
];

const profileAvatarMap = {
  EL_INAGOTABLE: {
    src: "/brand/profile-avatars/Fondo%20de%20Conejo%20eliminado.png",
    alt: "Conejo de Buenas Noches",
  },
  EL_DESVELADO: {
    src: "/brand/profile-avatars/Fondo%20de%20Buho%20eliminado.png",
    alt: "Búho de Buenas Noches",
  },
  EL_NEGOCIADOR: {
    src: "/brand/profile-avatars/Fondo%20de%20Zorro%20eliminado.png",
    alt: "Zorro de Buenas Noches",
  },
  EL_BERRINCHE: {
    src: "/brand/profile-avatars/Fondo%20de%20Oso%20eliminado.png",
    alt: "Oso de Buenas Noches",
  },
  EL_SONAMBULO: {
    src: "/brand/profile-avatars/Fondo%20de%20Gato%20eliminado.png",
    alt: "Gato de Buenas Noches",
  },
};

function getProfileAvatar(profileCode) {
  return profileAvatarMap[profileCode] || null;
}

function isVerifiedPremiumState(state) {
  return (
    state.accessStatus === "granted" &&
    Boolean(state.verifiedEmail) &&
    Boolean(state.premiumAccess?.hasAccess)
  );
}

const copy = {
  es: {
    sections: {
      home: "Inicio",
      reports: "Reportes",
      routine: "Rutina",
      child: "Niño",
      tips: "Tips",
      videos: "Video",
      reviews: "Reseñas",
      "sleep-area": "Área de sueño",
      avoid: "Qué evitar",
      wins: "Reseñas",
      admin: "Admin",
    },
    menuLabel: "Menú",
    readyRoom: "Alista su cuarto",
    contactUs: "Contáctanos",
    mySubscription: "Mi Suscripción",
    editProfile: "Editar perfil",
    editChildProfile: "Editar perfil de",
    saveProfile: "Guardar cambios",
    close: "Cerrar",
    backToChildren: "Volver a perfiles",
    alreadyHaveAccount: "Ya tengo cuenta",
    accountSetupTitle: "Vamos a crear tu cuenta gratis",
    accountSetupCopy: "Primero guarda tu nombre y correo para que podamos recordar tu progreso y el perfil de tu hijo.",
    welcomeBackTitle: "¡Bienvenida de vuelta!",
    welcomeBackCopy: "Entra con el correo que usaste para registrarte.",
    childNextStep: "Ahora ve a Niño para determinar su perfil neurológico de sueño y su horario ideal.",
    childTabPrompt: "Determina el perfil neurológico de sueño de tu hijo y su horario ideal.",
    accountEmail: "Correo de tu cuenta",
    restoreAccount: "Entrar a mi cuenta",
    restoringAccount: "Buscando perfil...",
    noSavedProfiles: "No encontré perfiles guardados con ese correo.",
    verifyEmailTitle: "Verificar email",
    deleteProfile: "Eliminar perfil",
    deleteProfileConfirm: "¿Seguro que quieres eliminar este perfil? Esta acción no se puede deshacer y perderás todos los datos.",
    cancel: "Cancelar",
    consistencyEncouragement: "¡Vas muy bien! La consistencia es lo que va a dar los mejores resultados.",
    sleepImprovedCongrats: "¡Qué alegría! Tu hijo está empezando a dormir mejor. Sigue así.",
    rateAppPrompt: "Tu hijo lleva 3 noches quedándose dormido en 15 minutos o menos. ¿Nos ayudas calificando la app?",
    rateApp: "Calificar la app",
    addChild: "Agregar perfil",
    addAnotherChild: "Agregar otro niño",
    unlockPremium: "Comprar premium",
    needHelp: "¿Necesitas ayuda?",
    contactCopy: "En QuiroKids estamos siempre disponibles para ti. Contáctanos por el medio que prefieras.",
    whatsapp: "WhatsApp",
    emailSupport: "Email",
    productsWeLove: "Productos que amamos",
    sleepWindow: "Ventana de sueño",
    sleepWindowIntro: "Muchos problemas de sueño se pueden resolver simplemente asegurando que tu hijo no se pase de su ventana de sueño.",
    calculateNow: "Calcular ahora",
    calculate: "Calcular",
    napsCount: "¿Cuántas siestas hace?",
    sleepWindowResult: "Según esta información, estos son sus mejores horarios:",
    firstNapWindow: "Primera siesta",
    nightSleepWindow: "Dormir de noche",
    sleepTracker: "Sleep Timer",
    startSleepTimer: "Empezar timer",
    stopSleepTimer: "Se durmió",
    premiumDashboard: "Dashboard premium",
    gateTitle: "Tu espacio para dejar de adivinar",
    verifyPurchase: "Verifica tu compra",
    usedPurchaseEmail: "Correo que usaste al comprar",
    enterApp: "Entrar a mi app",
    verifying: "Verificando...",
    newChild: "Nuevo niño",
    createProfileFirst: "Las noches difíciles tienen una explicación.",
    createProfileIntro: "Responde estas 10 preguntas y descubre cuál de los 5 perfiles de sueño tiene tu hijo, y exactamente cómo ayudarlo a descansar.",
    childName: "Nombre del niño",
    birthday: "Fecha de nacimiento",
    gender: "Género",
    boy: "Niño",
    girl: "Niña",
    parentName: "Primer nombre (de mamá o papá)",
    parentLastName: "Tu apellido (opcional)",
    parentEmail: "Correo electrónico",
    parentSettings: "Datos de mamá o papá",
    saveAccountSettings: "Guardar datos",
    sleepNeed: "Sueño recomendado",
    sleepGoal: "¿A qué hora te gustaría que tu hijo duerma cada noche?",
    seeChildProfile: "Ver el perfil de mi hijo",
    freeAccountTitle: "¡Ya identificamos el perfil de tu hijo!",
    freeAccountCopy: "Crea tu cuenta gratis para ver el resultado y guardar su perfil de sueño para siempre.",
    freeAccountMemory: "Así la app recuerda a tu hijo cada vez que la abres.",
    freeAccountNoSpam: "Sin spam. Solo lo que necesitas para ayudar a tu hijo a dormir mejor.",
    previousQuestion: "Pregunta anterior",
    startQuiz: "Descubre su perfil",
    question: "Pregunta",
    of: "de",
    childFitsProfile: "encaja principalmente en el perfil:",
    enterDashboard: "Entrar al dashboard de",
    tonightRoutine: "Rutina de esta noche",
    mapNight: "Mapear la noche de",
    wakeTime: "¿A qué hora se despertó hoy?",
    targetBedtime: "¿A qué hora te gustaría que tu hijo esté dormido hoy?",
    dinnerTime: "¿A qué hora cenan hoy? (opcional)",
    dinnerShared: "Puedes usar la misma hora para todos tus hijos si cenan juntos.",
    prepareDuration: "¿Cuántos minutos suele tardar en prepararse para dormir? (baño, pijama, etc.)",
    prepareDurationHelp: "Usaremos este tiempo para calcular a qué hora deben empezar.",
    napQuestion: "¿Duerme siesta?",
    napWakeTime: "¿A qué hora se despertó de la siesta?",
    generateRoutine: "Generar rutina",
    createTonightRoutine: "Crear rutina para esta noche",
    changeActivity: "Cambiar esta actividad",
    samePhaseOptions: "Opciones dentro de la misma fase",
    logTitle: "¿Cómo les fue?",
    date: "Fecha",
    bedTime: "¿A qué hora se metió a la cama?",
    sleepTime: "¿A qué hora se quedó dormido?",
    nightWakings: "Despertares nocturnos",
    notes: "Notas",
    saveResults: "Guardar resultados",
    progress: "Progreso",
    age: "Edad",
    averageToSleep: "Promedio para dormir",
    nightWakingsShort: "Despertares",
    consistency: "Consistencia",
    noLogsYet: "Todavía no has guardado noches. Apenas registres una, aquí vas a ver su progreso.",
    videoLibrary: "Biblioteca de videos",
    readyForBunny: "Videos para acompañarte",
    sleepArea: "Área de sueño",
    quickChecklist: "Checklist rápido",
    avoidBeforeBed: "Antes de dormir",
    yes: "Sí",
    no: "No",
    sometimes: "A veces",
    routinePreviewTitle: "Tu rutina de esta noche",
    routinePreviewCopy: "Esta es la idea general. Cuando estén listos, empieza la guía y la app registrará los tiempos importantes.",
    beginRoutine: "Comenzar rutina",
    openGuidedRoutine: "Abrir rutina guiada",
    routineStarted: "Rutina iniciada",
    pauseRoutine: "Pausar",
    resumeRoutine: "Continuar",
    extendActivity: "Extender 2 minutos",
    timerMode: "Modo de rutina",
    timerModeTimed: "Con timer",
    timerModeManual: "Sin timer",
    transitionSound: "Sonido de transición",
    soundMode: "Modo de sonido",
    soundSilent: "Silencio",
    soundTransition: "Campana",
    soundCalm: "Música 1",
    soundNature: "Música 2",
    soundTrackThree: "Música 3",
    markInBed: "Ya está en cama",
    fellAsleepNow: "Se durmió ahora",
    routineStartTime: "Hora de inicio de rutina",
    editTimesHelp: "Puedes ajustar las horas si no tenías el teléfono contigo.",
    wakingPromptTitle: "Registro de anoche",
    wakingPromptCopy: "¿Tu hijo se despertó durante la noche?",
    saveWakings: "Guardar despertares",
    publicWinsWall: "Muro de logros",
    publicWinsCopy: "Aquí celebramos las historias que otras familias quieren compartir.",
    sharePrivateWin: "Comparte tu logro o mensaje",
    privateMessageHelp: "Este mensaje llega privado a QuiroKids. No se publica en el muro.",
    messageTopic: "Tipo de mensaje",
    topicWin: "Logro",
    topicQuestion: "Pregunta",
    topicSupport: "Soporte",
    messagePlaceholder: "Cuéntanos qué pasó o en qué necesitas apoyo.",
    sendMessage: "Enviar mensaje",
    messageSent: "Mensaje enviado. Te responderemos lo antes posible.",
    reviewPublicNote: "Las reseñas de 5 estrellas pueden aparecer en el muro de logros.",
    reviewPrivateQuestion: "¿Qué necesitarías ver para que esta experiencia sea de 5 estrellas?",
    reviewSavedPublic: "¡Gracias! Tu logro quedó guardado para el muro.",
    reviewSavedPrivate: "Gracias por contarnos. Esto nos llega privado para poder mejorar.",
    adminLogin: "Entrar como admin",
    adminCode: "Código de admin",
    loadAdmin: "Ver resultados",
    adminOverview: "Panel de familias",
    adminHint: "Entra con tu código para ver perfiles, noches guardadas, mensajes y reseñas.",
    supportMessages: "Mensajes privados",
    privateReviews: "Comentarios para mejorar",
    users: "Usuarios",
    messages: "Mensajes",
    reviews: "Reseñas",
    tipsTitle: "Tips para dormir mejor",
    facilitateSleep: "Facilitar el sueño",
    whatToAvoid: "Qué evitar",
    foods: "Alimentos",
    products: "Productos",
    foodsToAvoid: "Alimentos a evitar",
    foodsForSleep: "Alimentos para dormir",
    education: "Educación",
    activities: "Actividades",
  },
  en: {
    sections: {
      home: "Home",
      reports: "Reports",
      routine: "Routine",
      child: "Child",
      tips: "Tips",
      videos: "Video",
      reviews: "Reviews",
      "sleep-area": "Sleep space",
      avoid: "Avoid",
      wins: "Reviews",
      admin: "Admin",
    },
    menuLabel: "Menu",
    readyRoom: "Prep their room",
    contactUs: "Contact us",
    mySubscription: "My Subscription",
    editProfile: "Edit profile",
    editChildProfile: "Edit profile for",
    saveProfile: "Save changes",
    close: "Close",
    backToChildren: "Back to profiles",
    alreadyHaveAccount: "I already have an account",
    accountSetupTitle: "Let's get your free account set up",
    accountSetupCopy: "First save your name and email so we can remember your progress and your child's profile.",
    welcomeBackTitle: "Welcome back!",
    welcomeBackCopy: "Please enter with the email that you used to sign up.",
    childNextStep: "Now go to Child to determine their neurological sleep profile and ideal sleep schedule.",
    childTabPrompt: "Determine your child's neurological sleep profile and ideal sleep schedule.",
    accountEmail: "Account email",
    restoreAccount: "Open my account",
    restoringAccount: "Finding profile...",
    noSavedProfiles: "I could not find saved profiles with that email.",
    verifyEmailTitle: "Verify email",
    deleteProfile: "Delete profile",
    deleteProfileConfirm: "Are you sure you want to delete this profile? This action cannot be undone and you will lose all data.",
    cancel: "Cancel",
    consistencyEncouragement: "You're doing great! Consistency is what will get the best results.",
    sleepImprovedCongrats: "Amazing. Your child is starting to sleep better. Keep going.",
    rateAppPrompt: "Your child has fallen asleep in 15 minutes or less for 3 nights in a row. Would you rate the app?",
    rateApp: "Rate the app",
    addChild: "Add child",
    addAnotherChild: "Add another child",
    unlockPremium: "Unlock premium",
    needHelp: "Need help?",
    contactCopy: "At QuiroKids, we are always available for you. Contact us through whichever option you prefer.",
    whatsapp: "WhatsApp",
    emailSupport: "Email",
    productsWeLove: "Products we love",
    sleepWindow: "Sleep window",
    sleepWindowIntro: "Many sleep problems can be solved simply by making sure your child does not pass their sleep window.",
    calculateNow: "Calculate now",
    calculate: "Calculate",
    napsCount: "How many naps?",
    sleepWindowResult: "Based on this information, these are their best windows:",
    firstNapWindow: "First nap",
    nightSleepWindow: "Night sleep",
    sleepTracker: "Sleep Timer",
    startSleepTimer: "Start timer",
    stopSleepTimer: "Fell asleep",
    slotsFull: "All profiles used",
    premiumDashboard: "Premium dashboard",
    gateTitle: "Your place to stop guessing",
    verifyPurchase: "Verify your purchase",
    usedPurchaseEmail: "Email used at checkout",
    enterApp: "Purchase premium",
    verifying: "Verifying...",
    newChild: "New child",
    createProfileFirst: "Difficult nights have an explanation.",
    createProfileIntro: "Answer these 10 questions to discover which of the 5 sleep profiles your child has, and exactly how to help them rest.",
    childName: "Child's name",
    birthday: "Birthday",
    gender: "Gender",
    boy: "Boy",
    girl: "Girl",
    parentName: "Your first name (parent or caregiver)",
    parentLastName: "Your last name (optional)",
    parentEmail: "Your email",
    parentSettings: "Parent settings",
    saveAccountSettings: "Save settings",
    sleepNeed: "Recommended sleep",
    sleepGoal: "What time would you like your child to go to sleep nightly?",
    seeChildProfile: "See my child's profile",
    freeAccountTitle: "We identified your child's sleep profile!",
    freeAccountCopy: "Create your free account to see the result and save their sleep profile forever.",
    freeAccountMemory: "That way the app remembers your child every time you open it.",
    freeAccountNoSpam: "No spam. Only what you need to help your child sleep better.",
    previousQuestion: "Previous question",
    startQuiz: "Discover their profile",
    question: "Question",
    of: "of",
    childFitsProfile: "fits mainly into this profile:",
    enterDashboard: "Enter dashboard for",
    tonightRoutine: "Tonight's routine",
    mapNight: "Map tonight for",
    wakeTime: "What time did they wake up today?",
    targetBedtime: "What time would you like your child to fall asleep at night?",
    dinnerTime: "What time is dinner tonight? (optional)",
    dinnerShared: "You can keep the same dinner time for all your children if they eat together.",
    prepareDuration: "How long does getting ready for bed take? (bath, pajamas, dim lights)",
    prepareDurationHelp: "We will use this to calculate when they should start.",
    napQuestion: "Do they nap?",
    napWakeTime: "What time did they wake from the nap?",
    generateRoutine: "Generate routine",
    createTonightRoutine: "Create tonight's routine",
    changeActivity: "Change this activity",
    samePhaseOptions: "Options within the same phase",
    logTitle: "How did tonight go?",
    date: "Date",
    bedTime: "What time did they get into bed?",
    sleepTime: "What time did they fall asleep?",
    nightWakings: "Night wakings",
    notes: "Notes",
    saveResults: "Save results",
    progress: "Progress",
    age: "Age",
    averageToSleep: "Average to fall asleep",
    nightWakingsShort: "Wakings",
    consistency: "Consistency",
    noLogsYet: "You have not saved any nights yet. As soon as you log one, their progress will show here.",
    videoLibrary: "Video library",
    readyForBunny: "Videos to support you",
    sleepArea: "Sleep space",
    quickChecklist: "Quick checklist",
    avoidBeforeBed: "Before bed",
    yes: "Yes",
    no: "No",
    sometimes: "Sometimes",
    routinePreviewTitle: "Tonight's routine",
    routinePreviewCopy: "This is the general idea. When you are ready, start the guide and the app will log the key times.",
    beginRoutine: "Begin routine",
    openGuidedRoutine: "Open guided routine",
    routineStarted: "Routine started",
    pauseRoutine: "Pause",
    resumeRoutine: "Resume",
    extendActivity: "Extend 2 minutes",
    timerMode: "Routine mode",
    timerModeTimed: "With timer",
    timerModeManual: "No timer",
    transitionSound: "Transition sound",
    soundMode: "Sound mode",
    soundSilent: "Silent",
    soundTransition: "Bell only",
    soundCalm: "Music 1",
    soundNature: "Music 2",
    soundTrackThree: "Music 3",
    markInBed: "They are in bed",
    fellAsleepNow: "They fell asleep now",
    routineStartTime: "Routine start time",
    editTimesHelp: "You can adjust the times if you did not have your phone with you.",
    wakingPromptTitle: "Last night's log",
    wakingPromptCopy: "Did your child wake during the night?",
    saveWakings: "Save wakings",
    publicWinsWall: "Wins wall",
    publicWinsCopy: "Here we celebrate the stories families choose to share.",
    sharePrivateWin: "Share your win or message",
    privateMessageHelp: "This message goes privately to QuiroKids. It is not posted on the wall.",
    messageTopic: "Message type",
    topicWin: "Win",
    topicQuestion: "Question",
    topicSupport: "Support",
    messagePlaceholder: "Tell us what happened or what support you need.",
    sendMessage: "Send message",
    messageSent: "Message sent. We will reply as soon as possible.",
    reviewPublicNote: "5-star reviews may appear on the wins wall.",
    reviewPrivateQuestion: "What would you need to see to make this a 5-star experience?",
    reviewSavedPublic: "Thank you. Your win was saved for the wall.",
    reviewSavedPrivate: "Thank you for telling us. This goes privately to help us improve.",
    adminLogin: "Admin login",
    adminCode: "Admin code",
    loadAdmin: "View results",
    adminOverview: "Family dashboard",
    adminHint: "Enter your code to see profiles, saved nights, messages, and reviews.",
    supportMessages: "Private messages",
    privateReviews: "Improvement comments",
    users: "Users",
    messages: "Messages",
    reviews: "Reviews",
    tipsTitle: "Tips for better sleep",
    facilitateSleep: "Support sleep",
    whatToAvoid: "What to avoid",
    foods: "Foods",
    products: "Products",
    foodsToAvoid: "Foods to avoid",
    foodsForSleep: "Foods for sleep",
    education: "Education",
    activities: "Activities",
  },
};

const sleepAreaChecklist = [
  { id: "dark", title: "Oscuridad", copy: "El cuarto está oscuro (sin luz visible)" },
  { id: "warm-light", title: "Luz antes de dormir", copy: "Uso luz cálida y baja antes de dormir" },
  { id: "cool-room", title: "Temperatura", copy: "El cuarto está fresco (no caliente)" },
  { id: "sound", title: "Sonido", copy: "Hay silencio o sonido constante (sin ruidos bruscos)" },
  { id: "screens", title: "Pantallas", copy: "No hay pantallas antes de dormir" },
  { id: "consistent", title: "Consistencia", copy: "El ambiente es igual cada noche" },
];

const avoidItems = [
  {
    title: "Pantallas (especialmente cerca de dormir)",
    avoid: ["Tablet, celular o TV", "Videos estimulantes", "Juegos electrónicos"],
    why: "La luz azul y el contenido activo mantienen el cerebro en modo alerta y retrasan la melatonina.",
    source:
      "American Academy of Pediatrics y Harvard Medical School: las pantallas antes de dormir se asocian con peor calidad de sueño y menor melatonina.",
  },
  {
    title: "Luz blanca brillante",
    avoid: ["Luces LED blancas intensas", "Iluminación de techo muy brillante"],
    why: "Le dice al cerebro que todavía es de día.",
    source:
      "Harvard Health Publishing y National Sleep Foundation: la luz brillante en la noche altera el ritmo circadiano.",
  },
  {
    title: "Juego muy activo justo antes de dormir",
    avoid: ["Correr", "Saltar", "Juegos competitivos", "Actividades intensas"],
    why: "Sube cortisol y adrenalina, y activa el sistema nervioso cuando queremos que baje.",
    source:
      "Sleep Foundation y American Academy of Sleep Medicine: la activación intensa cerca de dormir puede dificultar conciliar el sueño.",
  },
  {
    title: "Azúcar y alimentos estimulantes",
    avoid: ["Dulces", "Postres", "Bebidas azucaradas", "Chocolate en niños sensibles"],
    why: "Puede subir energía y dificultar la regulación.",
    source: "Sleep Foundation: dietas altas en azúcar pueden afectar la calidad del sueño.",
  },
  {
    title: "Cafeína aunque sea poquita",
    avoid: ["Chocolate oscuro en exceso", "Gaseosas", "Té con cafeína"],
    why: "Bloquea la sensación de sueño.",
    source: "American Academy of Sleep Medicine: la cafeína interfiere con la capacidad de conciliar el sueño.",
  },
  {
    title: "Comer muy tarde o pesado",
    avoid: ["Cenas muy grandes justo antes de dormir", "Comer inmediatamente antes de acostarse"],
    why: "El cuerpo sigue en modo digestión y no entra en modo descanso.",
    source: "Sleep Foundation: comer tarde puede afectar el inicio del sueño.",
  },
  {
    title: "Conversaciones estimulantes o emociones intensas",
    avoid: ["Discusiones", "Temas que activan emociones fuertes", "Sobreestimulación verbal"],
    why: "Activa el cerebro y el sistema nervioso.",
    source: "National Sleep Foundation: la activación emocional dificulta el inicio del sueño.",
  },
  {
    title: "Actividades mentales muy activas",
    avoid: ["Juegos competitivos", "Resolver problemas complejos", "Juegos que generan excitación"],
    why: "Mantienen la mente encendida.",
    source: "American Academy of Sleep Medicine: la activación cognitiva retrasa el sueño.",
  },
  {
    title: "Rutinas inconsistentes",
    avoid: ["Cambiar todo cada noche", "Horarios totalmente variables"],
    why: "El cerebro no logra anticipar el sueño.",
    source: "National Sleep Foundation: la consistencia mejora la latencia del sueño.",
  },
];

const facilitateSleepItems = [
  {
    title: "Tener una rutina predecible",
    copy: "El cerebro ama la repetición. Cuando haces lo mismo todas las noches, el cuerpo entiende: 'Ah, viene la hora de dormir'.",
  },
  {
    title: "Usar luz suave y cálida",
    copy: "Lámparas tenues, luz amarilla y cero focos fuertes ayudan a activar la melatonina y bajar la energía.",
  },
  {
    title: "Crear un ambiente tranquilo",
    copy: "Menos ruido, menos corridas y menos estímulos. Puede incluir música suave o sonidos calmantes.",
  },
  {
    title: "Una ducha caliente o tibia",
    copy: "Ayuda a relajar el cuerpo antes de dormir y marca una transición clara hacia la noche.",
  },
  {
    title: "NeuroHacks del programa",
    copy: "Implementar la rutina según el perfil neurológico de tu hijo ayuda a que su sistema nervioso se sienta seguro y listo para dormir.",
  },
];

const foodAvoidItems = [
  ["Azúcar y postres", "Galletas, chocolate, helado y pan dulce pueden disparar energía y hacer que el cuerpo despierte fácilmente."],
  ["Comidas muy pesadas o grasosas", "Pizza, hamburguesas y frituras mantienen al cuerpo digiriendo cuando debería entrar en modo descanso."],
  ["Alimentos muy picantes", "Pueden causar acidez, calor corporal y activar el sistema nervioso."],
  ["Cafeína", "Café, té negro, té verde, chocolate oscuro y refrescos con cafeína interfieren con el sueño."],
  ["Bebidas con gas", "La distensión abdominal puede dificultar que algunos niños se relajen."],
  ["Alimentos muy salados", "Chips, snacks y embutidos aumentan la sed y pueden provocar despertares."],
  ["Mucha fruta o jugos", "Aunque sean naturales, aportan azúcar rápida y pueden dar un mini subidón antes de dormir."],
];

const foodSleepItems = [
  ["Plátano", "Rico en magnesio, potasio y triptófano. Mejor no después de la cena por sus azúcares naturales."],
  ["Avena tibia", "Suave, cálida y útil para estabilizar el azúcar en sangre."],
  ["Yogur natural o kéfir", "El triptófano y el calcio ayudan a producir melatonina."],
  ["Mantequilla de almendra o nueces", "Grasas buenas que estabilizan energía y nutren el cerebro."],
  ["Manzanilla o té de hierbas sin cafeína", "Calma el sistema nervioso y relaja el abdomen."],
  ["Huevos", "Fuente natural de triptófano y proteína suave."],
  ["Pavo o pollo", "Ricos en triptófano, apoyan la producción de serotonina."],
  ["Cereza natural", "Tiene melatonina natural. Mejor no después de la cena por sus azúcares naturales."],
  ["Kiwi", "Puede ayudar a dormir más rápido. Mejor no después de la cena por sus azúcares naturales."],
  ["Leche tibia", "Aporta triptófano y una sensación emocionalmente reconfortante."],
];

const initialState = {
  language: "es",
  purchaseEmail: "",
  verifiedEmail: "",
  accessStatus: "idle",
  accessMessage: "",
  premiumAccess: null,
  persistenceMessage: "",
  ratingPromptShown: false,
  showRatingPrompt: false,
  cancelFeedbackCount: 0,
  showCancellationModal: false,
  parentName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhotoUrl: "",
  parentProfileSaved: false,
  accountCreatedAt: "",
  freeLeadBasicSent: false,
  freeLeadProfileSent: false,
  accountLookupOpen: false,
  accountLookupEmail: "",
  accountLookupStatus: "idle",
  accountLookupMessage: "",
  children: [],
  activeChildId: "",
  expandedChildId: "",
  activeSection: "home",
  childDraft: {
    name: "",
    birthday: "",
    gender: "boy",
    sleepGoal: "",
    takesNap: "no",
  },
  onboardingMode: "",
  quizIndex: -1,
  answers: [],
  tieCandidates: null,
  quizResult: null,
  revealedResult: null,
  hasSeenWelcome: false,
  routineForm: {
    wakeTime: "",
    targetBedtime: "",
    dinnerTime: "",
    prepareDuration: "25",
    napTaken: "no",
    napWakeTime: "",
  },
  currentPlan: null,
  routinePreviewOpen: false,
  routineSession: {
    startedAt: "",
    inBedAt: "",
    routineEndTime: "",
    fellAsleepAt: "",
    timerMode: "timed",
    soundMode: "transition",
  },
  expandedSwapStep: "",
  editingChildId: "",
  savedLogDate: "",
  routineSubTab: "tonight",
  wakingPromptLogDate: "",
  sleepWindowOpen: false,
  sleepWindowCompleted: false,
  premiumRoutineGateOpen: false,
  showPaywall: false,
  quickSleepTimer: {
    startedAt: "",
    running: false,
    type: "night",
  },
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function getCurrentTimeValue() {
  return new Date().toTimeString().slice(0, 5);
}

function getYesterdayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

function timeToMinutes(value) {
  const [hours = 0, minutes = 0] = String(value || "00:00").split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value) {
  const day = 24 * 60;
  const safeValue = ((Math.round(value) % day) + day) % day;
  const hours = Math.floor(safeValue / 60);
  const minutes = safeValue % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function normalizeChildSleepGoal(value) {
  if (!value) return "";
  const minutes = timeToMinutes(value);
  if (minutes >= 12 * 60) return value;
  // 6:00–11:59 entered without PM — almost certainly means evening (e.g. 8:00 → 20:00)
  if (minutes >= 6 * 60 && minutes < 12 * 60) {
    const corrected = minutes + 12 * 60;
    const h = String(Math.floor(corrected / 60)).padStart(2, "0");
    const m = String(corrected % 60).padStart(2, "0");
    return `${h}:${m}`;
  }
  return "";
}

function calculateSleepWindow({ birthday, wakeTime, napsCount }) {
  const ageYears = calculateAgeFromBirthday(birthday);
  const wakeMinutes = timeToMinutes(wakeTime);
  const napCount = Number(napsCount || 0);
  const awakeMinutes =
    ageYears < 1 ? 180 :
      ageYears < 2 ? 240 :
        ageYears < 3 ? 330 :
          ageYears < 5 ? 720 :
            750;
  const [nightAwakeMin, nightAwakeMax] =
    ageYears < 2 ? [600, 660] :
      ageYears < 3 ? [660, 720] :
        ageYears < 5 ? (napCount > 0 ? [690, 750] : [720, 780]) :
          ageYears < 8 ? [720, 780] :
            [750, 810];
  const firstNapStart = wakeMinutes + Math.min(awakeMinutes, ageYears < 3 ? awakeMinutes : 330);
  const firstNapEnd = firstNapStart + 30;
  const bedtimeStart = Math.max(timeToMinutes("17:30"), Math.min(timeToMinutes("21:00"), wakeMinutes + nightAwakeMin));
  const bedtimeEnd = Math.max(bedtimeStart + 30, Math.min(timeToMinutes("21:30"), wakeMinutes + nightAwakeMax));

  return {
    ageYears,
    firstNap: napCount > 0 ? `${minutesToTime(firstNapStart)} - ${minutesToTime(firstNapEnd)}` : "",
    nightSleep: `${minutesToTime(bedtimeStart)} - ${minutesToTime(bedtimeEnd)}`,
  };
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

async function subscribeToPushNotifications({ email, role }) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    throw new Error("Este navegador no permite notificaciones push.");
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("Falta configurar NEXT_PUBLIC_VAPID_PUBLIC_KEY en Vercel.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(
      "No se activaron las notificaciones. Safari suele bloquearlas en ventana privada; prueba en una ventana normal y permite las notificaciones del sitio."
    );
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription =
    existingSubscription ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  const response = await fetch("/api/push-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, role, subscription }),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No pude guardar la suscripción.");
  }

  return payload;
}

function genderize(value, gender) {
  if (gender !== "girl" || !value) return value;
  return value
    .replaceAll(" con él", " con ella")
    .replaceAll(" para él", " para ella")
    .replaceAll(" de él", " de ella")
    .replaceAll(" él ", " ella ")
    .replaceAll(" Él ", " Ella ")
    .replaceAll("dormido", "dormida")
    .replaceAll("Dormido", "Dormida")
    .replaceAll("acostado", "acostada")
    .replaceAll("Acostado", "Acostada")
    .replaceAll("cansado", "cansada")
    .replaceAll("Cansado", "Cansada")
    .replaceAll("quieto", "quieta")
    .replaceAll("Quieto", "Quieta")
    .replaceAll("inquieto", "inquieta")
    .replaceAll("Inquieto", "Inquieta")
    .replaceAll("listo", "lista")
    .replaceAll("Listo", "Lista")
    .replaceAll("tu hijo", "tu hija")
    .replaceAll("Tu hijo", "Tu hija")
    .replaceAll("su hijo", "su hija")
    .replaceAll("Su hijo", "Su hija")
    .replaceAll("el niño", "la niña")
    .replaceAll("El niño", "La niña")
    .replaceAll("un niño", "una niña")
    .replaceAll("Un niño", "Una niña")
    .replaceAll("niño", "niña")
    .replaceAll("Niño", "Niña")
    .replaceAll("hijo", "hija")
    .replaceAll("Hijo", "Hija");
}

function childNoun(gender) {
  return gender === "girl" ? "hija" : "hijo";
}

function childPronoun(gender) {
  return gender === "girl" ? "ella" : "él";
}

function childArticle(gender) {
  return gender === "girl" ? "la" : "lo";
}

function childGenderLabel(gender, language = "es") {
  if (language === "en") return gender === "girl" ? "Girl" : "Boy";
  return gender === "girl" ? "Niña" : "Niño";
}

function getRecommendedSleepHours(birthday, language = "es") {
  const age = calculateAgeFromBirthday(birthday);
  let range = "9-12";
  if (age < 1) range = "12-16";
  else if (age < 2) range = "11-14";
  else if (age < 3) range = "11-14";
  else if (age <= 5) range = "10-13";
  else if (age <= 12) range = "9-12";
  else range = "8-10";

  return language === "en" ? `${range} hours` : `${range} horas`;
}

function getRecommendedSleepMinimumHours(birthday) {
  const age = calculateAgeFromBirthday(birthday);
  if (age < 1) return 12;
  if (age < 3) return 11;
  if (age <= 5) return 10;
  if (age <= 12) return 9;
  return 8;
}

function calculateTotalSleepHours(sleepTime, wakeTime, napDuration = 0) {
  if (!sleepTime || !wakeTime) return null;
  let nightMinutes = timeToMinutes(wakeTime) - timeToMinutes(sleepTime);
  if (nightMinutes <= 0) nightMinutes += 24 * 60;
  const totalMinutes = nightMinutes + Number(napDuration || 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
}

function calculateSleepDebt(totalSleepHours, birthday) {
  if (totalSleepHours === null || !birthday) return 0;
  return Math.max(0, getRecommendedSleepMinimumHours(birthday) - Number(totalSleepHours || 0));
}

function formatSleepDebt(hours, language = "es") {
  if (!hours || hours <= 0) return language === "en" ? "On target" : "Al día";
  const totalMinutes = Math.round(hours * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (wholeHours && minutes) {
    return language === "en" ? `${wholeHours}h ${minutes}m` : `${wholeHours} h ${minutes} min`;
  }
  if (wholeHours) {
    return language === "en" ? `${wholeHours}h` : `${wholeHours} h`;
  }
  return language === "en" ? `${minutes}m` : `${minutes} min`;
}

function makeEmptyChild(childDraft) {
  return {
    id: generateId(),
    name: childDraft.name.trim(),
    birthday: childDraft.birthday,
    gender: childDraft.gender || "boy",
    createdAt: childDraft.createdAt || new Date().toISOString(),
    isFreeProfile: childDraft.isFreeProfile ?? true,
    primaryProfile: "",
    secondaryProfile: "",
    answers: [],
    lastPlan: null,
    logs: [],
    selectedActivities: {},
    dislikedCounts: {},
    sleepAreaChecks: {},
    sleepGoal: "",
    takesNap: "no",
  };
}

function makeChildFromSavedQuiz(result) {
  const metadata = Array.isArray(result.answers) ? {} : result.answers || {};
  const responses = Array.isArray(result.answers) ? result.answers : metadata.responses || [];
  const childName = metadata.childName || "";
  const childBirthday = metadata.childBirthday || "";

  return {
    ...makeEmptyChild({
      name: childName || "Perfil guardado",
      birthday: childBirthday,
      gender: metadata.childGender || "boy",
    }),
    id: result.child_id || result.id || generateId(),
    quizResultId: result.id || "",
    primaryProfile: result.primary_profile || "",
    secondaryProfile: result.secondary_profile || "",
    sleepGoal: metadata.sleepGoal || "",
    takesNap: metadata.takesNap || metadata.napTaken || "no",
    createdAt: result.created_at || metadata.createdAt || new Date().toISOString(),
    isFreeProfile: metadata.isFreeProfile ?? true,
    answers: responses,
    isLegacyProfile: !childName || !childBirthday,
  };
}

function isExpiredFreeProfile(child, now = Date.now()) {
  if (child?.isFreeProfile === false) return false;
  const createdAt = child.createdAt ? new Date(child.createdAt).getTime() : 0;
  return Boolean(createdAt && now - createdAt >= FREE_PROFILE_EXPIRY_MS);
}

function collapseLegacySavedChildren(children) {
  const namedChildren = children.filter((child) => !child.isLegacyProfile);
  const legacyChildren = children.filter((child) => child.isLegacyProfile);
  return legacyChildren.length ? [...namedChildren, legacyChildren[0]] : namedChildren;
}

function makeLogsFromSavedData(logs = []) {
  return logs.map((log) => ({
    ...(log.ratings || []).find((rating) => rating?.type === "nap_log") || {},
    ...(log.ratings || []).find((rating) => rating?.type === "morning_report") || {},
    ...(log.ratings || []).find((rating) => rating?.type === "routine_timing") || {},
    date: log.log_date,
    routineStartTime: log.routine_start_time || "",
    bedTime: log.in_bed_at,
    sleepTime: log.fell_asleep_at,
    latency: log.sleep_latency_minutes,
    nightWakings: log.night_wakings || "0",
    notes: log.notes || "",
    ratings: log.ratings || [],
  }));
}

export default function BuenasNochesApp() {
  const [state, setState] = useState(initialState);
  const [autoVerifyAttempted, setAutoVerifyAttempted] = useState(false);
  const lastPremiumRefreshAttemptRef = useRef(0);
  const [adminVisible, setAdminVisible] = useState(false);
  const [unreadReplies, setUnreadReplies] = useState(0);
  const lastSeenContactRef = useRef(0);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      setState(initialState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") {
      setAdminVisible(true);
      setState((current) => ({ ...current, activeSection: "admin" }));
    }
  }, []);

  useEffect(() => {
    if (!state.children.length) return;
    if (state.activeChildId && state.children.some((child) => child.id === state.activeChildId)) return;

    setState((current) => ({
      ...current,
      activeChildId: current.children[0]?.id || "",
    }));
  }, [state.children, state.activeChildId]);

  useEffect(() => {
    if (!state.expandedChildId) return;
    if (state.children.some((child) => child.id === state.expandedChildId)) return;

    setState((current) => ({
      ...current,
      expandedChildId: "",
    }));
  }, [state.children, state.expandedChildId]);

  useEffect(() => {
    if (!state.activeChildId) return;
    const child = state.children.find((entry) => entry.id === state.activeChildId);
    if (!child) return;

    setState((current) => ({
      ...current,
      currentPlan: child.lastPlan || null,
    }));
  }, [state.activeChildId, state.children]);

  useEffect(() => {
    if (!state.activeChildId || state.wakingPromptLogDate) return;
    const child = state.children.find((entry) => entry.id === state.activeChildId);
    if (!child) return;
    const yesterdayKey = getYesterdayKey();
    const needsWakingCheck = child.logs?.find(
      (log) => log.date === yesterdayKey && log.nightWakings === "pending"
    );
    if (!needsWakingCheck) return;

    setState((current) => ({
      ...current,
      wakingPromptLogDate: yesterdayKey,
    }));
  }, [state.activeChildId, state.children, state.wakingPromptLogDate]);

  useEffect(() => {
    const knownEmail = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    if (autoVerifyAttempted || !knownEmail || state.accessStatus === "loading") return;
    setAutoVerifyAttempted(true);
    checkPremiumAccessForEmail(knownEmail, { silent: true });
  }, [autoVerifyAttempted, state.verifiedEmail, state.parentEmail, state.purchaseEmail, state.accessStatus]);

  useEffect(() => {
    function maybeRefreshPremiumAccess() {
      const knownEmail = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
      if (!knownEmail || isVerifiedPremiumState(state) || state.accessStatus === "loading") return;
      if (document.visibilityState && document.visibilityState !== "visible") return;

      const now = Date.now();
      if (now - lastPremiumRefreshAttemptRef.current < 5000) return;
      lastPremiumRefreshAttemptRef.current = now;
      checkPremiumAccessForEmail(knownEmail, { silent: true });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        maybeRefreshPremiumAccess();
      }
    }

    function handleFocus() {
      maybeRefreshPremiumAccess();
    }

    function handlePageShow() {
      maybeRefreshPremiumAccess();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [state.verifiedEmail, state.parentEmail, state.purchaseEmail, state.accessStatus, state.premiumAccess]);

  // Poll for unread admin replies every 60s
  useEffect(() => {
    const email = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    if (!email) return;

    function checkUnread() {
      fetch(`/api/support-message?email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((payload) => {
          const messages = payload.messages || [];
          const count = messages.reduce((n, thread) => {
            const adminReplies = (thread.replies || []).filter((r) => r.sender === "admin");
            const latestAdmin = adminReplies[adminReplies.length - 1];
            if (!latestAdmin) return n;
            const replyTime = new Date(latestAdmin.created_at).getTime();
            return replyTime > lastSeenContactRef.current ? n + 1 : n;
          }, 0);
          setUnreadReplies(count);
        })
        .catch(() => {});
    }

    checkUnread();
    const interval = window.setInterval(checkUnread, 60000);
    return () => window.clearInterval(interval);
  }, [state.verifiedEmail, state.parentEmail, state.purchaseEmail]);

  const childSlots = useMemo(() => getChildSlots(state.premiumAccess), [state.premiumAccess]);
  const strings = copy[state.language] || copy.es;
  const bottomMenuOptions = [
    { id: "home", label: strings.sections.home },
    { id: "reports", label: strings.sections.reports },
    { id: "routine", label: strings.sections.routine },
    { id: "child", label: strings.sections.child },
    { id: "videos", label: strings.sections.videos },
    ...(!isVerifiedPremiumState(state) ? [{ id: "purchase", label: strings.unlockPremium }] : []),
  ];
  const mainMenuOptions = [
    { id: "home", label: strings.sections.home },
    { id: "reports", label: strings.sections.reports },
    { id: "routine", label: strings.sections.routine },
    { id: "child", label: strings.sections.child },
    { id: "videos", label: strings.sections.videos },
    { id: "wins", label: strings.sections.reviews },
    { id: "contact", label: strings.contactUs, badge: unreadReplies },
    ...(isVerifiedPremiumState(state) ? [{ id: "subscription", label: strings.mySubscription }] : []),
    ...(adminVisible ? [{ id: "admin", label: strings.sections.admin }] : []),
  ];
  const profileMap = getProfileMap(state.language);
  const questions = getQuestions(state.language);
  const activeChild = state.children.find((child) => child.id === state.activeChildId) || null;
  const editingChild = state.children.find((child) => child.id === state.editingChildId) || null;
  const resultCopy = state.quizResult ? buildResultCopy(state.quizResult, state.language) : null;
  const revealedResultCopy = state.revealedResult ? buildResultCopy(state.revealedResult, state.language) : null;
  const canAddChild = state.children.length < childSlots.total;
  const hasPremiumAccess = isVerifiedPremiumState(state);
  const progressSummary = activeChild ? buildProgressSummary(activeChild.logs) : null;
  const checkedCount = activeChild ? Object.values(activeChild.sleepAreaChecks || {}).filter(Boolean).length : 0;
  const sleepAreaResult = getSleepAreaResult(checkedCount);

  useEffect(() => {
    if (hasPremiumAccess || !state.children.length) return;
    const knownEmail = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    if (knownEmail && state.accessStatus !== "denied") return;
    const remainingChildren = state.children.filter((child) => !isExpiredFreeProfile(child));
    if (remainingChildren.length === state.children.length) return;

    setState((current) => ({
      ...current,
      children: remainingChildren,
      activeChildId: remainingChildren.some((child) => child.id === current.activeChildId)
        ? current.activeChildId
        : remainingChildren[0]?.id || "",
      expandedChildId: remainingChildren.some((child) => child.id === current.expandedChildId)
        ? current.expandedChildId
        : "",
      persistenceMessage:
        current.language === "es"
          ? "Los perfiles gratuitos expiran después de 14 días si no se desbloquea premium. Puedes crear otro perfil gratis cuando quieras."
          : "Free profiles expire after 14 days if premium is not unlocked. You can create another free profile anytime.",
    }));
  }, [hasPremiumAccess, state.accessStatus, state.children, state.parentEmail, state.purchaseEmail, state.verifiedEmail]);

  useEffect(() => {
    const createdAt = state.accountCreatedAt ? new Date(state.accountCreatedAt).getTime() : 0;
    const shouldSendBasicLead =
      state.parentProfileSaved &&
      state.parentEmail &&
      createdAt &&
      !state.freeLeadBasicSent &&
      !state.freeLeadProfileSent &&
      !state.children.length &&
      Date.now() - createdAt >= 24 * 60 * 60 * 1000;

    if (!shouldSendBasicLead) return;

    fetch("/api/free-profile-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentName: state.parentName,
        email: state.parentEmail,
        source: "buenas_noches_free_account_incomplete",
      }),
    })
      .then(() => {
        setState((current) => ({ ...current, freeLeadBasicSent: true }));
      })
      .catch(() => undefined);
  }, [
    state.accountCreatedAt,
    state.children.length,
    state.freeLeadBasicSent,
    state.freeLeadProfileSent,
    state.parentEmail,
    state.parentName,
    state.parentProfileSaved,
  ]);

  // Auto-dismiss persistence message after 5 seconds
  useEffect(() => {
    if (!state.persistenceMessage) return;
    const t = setTimeout(() => setState((cur) => ({ ...cur, persistenceMessage: "" })), 5000);
    return () => clearTimeout(t);
  }, [state.persistenceMessage]);

  // Show NPS rating prompt after 7 logged nights
  useEffect(() => {
    if (state.ratingPromptShown || state.showRatingPrompt) return;
    const totalLogs = (state.children || []).reduce((sum, c) => sum + (c.logs?.length || 0), 0);
    if (totalLogs >= 7) {
      setState((cur) => ({ ...cur, showRatingPrompt: true, ratingPromptShown: true }));
    }
  }, [state.children, state.ratingPromptShown, state.showRatingPrompt]);

  function updateChild(childId, updater) {
    setState((current) => ({
      ...current,
      children: current.children.map((child) =>
        child.id === childId ? { ...child, ...updater(child) } : child
      ),
    }));
  }

  function handleMainMenu(value) {
    if (value === "amazon") {
      window.location.href = AMAZON_STORE_URL;
      return;
    }

    if (value === "purchase") {
      setState((current) => ({ ...current, showPaywall: true }));
      return;
    }

    if (value === "contact") {
      lastSeenContactRef.current = Date.now();
      setUnreadReplies(0);
    }
    setState((current) => ({ ...current, activeSection: value }));
  }

  function saveFreeAccount(event) {
    event.preventDefault();
    const parentName = state.parentName.trim();
    const parentEmail = state.parentEmail.trim().toLowerCase();
    if (!parentName || !parentEmail) return;

    setState((current) => ({
      ...current,
      parentName,
      parentEmail,
      purchaseEmail: current.purchaseEmail || parentEmail,
      parentProfileSaved: true,
      accountCreatedAt: current.accountCreatedAt || new Date().toISOString(),
      activeSection: "child",
      persistenceMessage: strings.childNextStep,
    }));
  }

  function openAccountLookup() {
    setState((current) => ({
      ...current,
      accountLookupOpen: true,
      accountLookupMessage: "",
      accountLookupStatus: "idle",
      onboardingMode: "",
    }));
  }

  function startAddChild() {
    setState((current) => ({
      ...current,
      onboardingMode: "new-child",
      childDraft: { name: "", birthday: "", gender: "boy", sleepGoal: "", takesNap: "no" },
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
      revealedResult: null,
      activeSection: "home",
      currentPlan: null,
    }));
  }

  function closeAddChildFlow() {
    setState((current) => ({
      ...current,
      onboardingMode: "",
      childDraft: { name: "", birthday: "", gender: "boy", sleepGoal: "", takesNap: "no" },
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
      revealedResult: null,
      activeSection: current.children.length ? "home" : "child",
    }));
  }

  function requestRoutine(childId = state.activeChildId) {
    if (childId) {
      setState((current) => ({ ...current, activeChildId: childId }));
    }

    if (!hasPremiumAccess) {
      setState((current) => ({ ...current, premiumRoutineGateOpen: true }));
      return;
    }

    setState((current) => ({ ...current, activeChildId: childId || current.activeChildId, activeSection: "routine" }));
  }

  function goToSalesFunnelFromRoutineGate(event) {
    event?.preventDefault();
    const nextState = {
      ...state,
      activeSection: "home",
      premiumRoutineGateOpen: false,
      routinePreviewOpen: false,
      sleepWindowOpen: false,
      accountLookupOpen: false,
      onboardingMode: "",
      revealedResult: null,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
    setState({ ...nextState, showPaywall: true });
  }

  function saveParentSettings(event) {
    event.preventDefault();
    setState((current) => ({
      ...current,
      parentName: current.parentName.trim(),
      parentLastName: current.parentLastName.trim(),
      parentEmail: current.parentEmail.trim().toLowerCase(),
      purchaseEmail: current.purchaseEmail || current.parentEmail.trim().toLowerCase(),
      parentProfileSaved: true,
      persistenceMessage: "Datos guardados.",
      activeSection: "home",
    }));
  }

  function beginQuiz(event) {
    event.preventDefault();
    if (!state.childDraft.name.trim() || !state.childDraft.birthday || !state.childDraft.gender) return;
    setState((current) => ({
      ...current,
      quizIndex: 0,
      answers: [],
      tieCandidates: null,
      quizResult: null,
      revealedResult: null,
    }));
  }

  function answerQuestion(option) {
    const nextAnswers = [...state.answers, { questionId: questions[state.quizIndex].id, optionKey: option.key }];
    const nextIndex = state.quizIndex + 1;

    if (nextIndex >= questions.length) {
      const scored = scoreAnswers(nextAnswers);
      const tieCandidates = resolveTieCandidates(scored);

      if (tieCandidates) {
        setState((current) => ({ ...current, answers: nextAnswers, quizIndex: nextIndex, tieCandidates }));
        return;
      }

      setState((current) => ({
        ...current,
        answers: nextAnswers,
        quizIndex: nextIndex,
        tieCandidates: null,
        quizResult: scored,
      }));
      return;
    }

    setState((current) => ({ ...current, answers: nextAnswers, quizIndex: nextIndex }));
  }

  function goBackQuestion() {
    setState((current) => {
      if (current.quizIndex <= 0) return current;
      return {
        ...current,
        quizIndex: current.quizIndex - 1,
        answers: current.answers.slice(0, -1),
        tieCandidates: null,
      };
    });
  }

  function chooseTieWinner(code) {
    const scored = scoreAnswers(state.answers);
    const secondary = state.tieCandidates.find((candidate) => candidate !== code) || null;
    setState((current) => ({
      ...current,
      tieCandidates: null,
      quizResult: { ...scored, primary: code, secondary },
    }));
  }

  async function checkPremiumAccessForEmail(email, options = {}) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) return null;

    if (!options.silent) {
      setState((current) => ({
        ...current,
        purchaseEmail: normalizedEmail,
        accessStatus: "loading",
        accessMessage: "",
      }));
    }

    try {
      const response = await fetch("/api/premium-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude verificar tu compra en este momento.");
      }

      if (!payload.hasAccess) {
        setState((current) => ({
          ...current,
          verifiedEmail: "",
          accessStatus: "not_found",
          premiumAccess: null,
          accessMessage: options.silent
            ? current.accessMessage
            : "Todavía no encuentro una compra activa con ese correo. Revisa si usaste otro email o vuelve en un momento si acabas de comprar.",
        }));
        return { hasAccess: false, payload };
      }

      setState((current) => ({
        ...current,
        purchaseEmail: normalizedEmail,
        parentEmail: current.parentEmail || normalizedEmail,
        verifiedEmail: normalizedEmail,
        accessStatus: "granted",
        premiumAccess: payload,
        accessMessage: options.silent ? "" : "Compra verificada. Ya puedes usar el dashboard completo.",
      }));

      return { hasAccess: true, payload };
    } catch (error) {
      setState((current) => ({
        ...current,
        verifiedEmail: options.silent ? current.verifiedEmail : "",
        accessStatus: options.silent ? current.accessStatus : "error",
        premiumAccess: options.silent ? current.premiumAccess : null,
        accessMessage: options.silent ? current.accessMessage : error.message || "No pude verificar tu compra en este momento.",
      }));
      return null;
    }
  }

  async function restoreSavedAccount(event) {
    event?.preventDefault();
    const email = state.accountLookupEmail.trim().toLowerCase();
    if (!email) return;

    if (state.children.length && state.parentEmail.trim().toLowerCase() === email) {
      setState((current) => ({
        ...current,
        parentProfileSaved: true,
        accountLookupOpen: false,
        accountLookupStatus: "success",
        accountLookupMessage: "",
        activeSection: "home",
        expandedChildId: current.children[0]?.id || "",
      }));
      return;
    }

    setState((current) => ({
      ...current,
      accountLookupStatus: "loading",
      accountLookupMessage: "",
    }));

    try {
      const response = await fetch(`/api/member-data?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No pude buscar tu cuenta en este momento.");
      }

      const rawNightlyLogs = data.nightlyLogs || [];
      const hasChildScopedLogs = rawNightlyLogs.some((log) => log.child_id);
      const logsByChildId = new Map();
      rawNightlyLogs.forEach((log) => {
        const key = log.child_id || "";
        if (!logsByChildId.has(key)) {
          logsByChildId.set(key, []);
        }
        logsByChildId.get(key).push(log);
      });
      const legacySavedLogs = makeLogsFromSavedData(hasChildScopedLogs ? logsByChildId.get("") || [] : rawNightlyLogs);
      const savedChildren = collapseLegacySavedChildren((data.quizResults || [])
        .map(makeChildFromSavedQuiz)
        .filter((child) => child.primaryProfile));

      if (!savedChildren.length) {
        setState((current) => ({
          ...current,
          accountLookupStatus: "not_found",
          accountLookupMessage: strings.noSavedProfiles,
        }));
        return;
      }

      const premiumCheck = await checkPremiumAccessForEmail(email, { silent: true });
      const restoredChildren = savedChildren.map((child, index) => ({
        ...child,
        logs: makeLogsFromSavedData(logsByChildId.get(child.id) || (index === 0 ? legacySavedLogs : [])),
      }));
      const savedParentName =
        (data.quizResults || []).map((result) => (Array.isArray(result.answers) ? "" : result.answers?.parentName || "")).find(Boolean) || "";

      setState((current) => ({
        ...current,
        parentName: current.parentName || savedParentName,
        parentEmail: email,
        purchaseEmail: email,
        verifiedEmail: premiumCheck?.hasAccess ? email : current.verifiedEmail,
        accessStatus: premiumCheck?.hasAccess ? "granted" : "not_found",
        premiumAccess: premiumCheck?.hasAccess ? premiumCheck.payload : null,
        accessMessage: premiumCheck?.hasAccess ? "" : current.accessMessage,
        parentProfileSaved: true,
        children: restoredChildren,
        activeChildId: restoredChildren[0]?.id || "",
        expandedChildId: restoredChildren[0]?.id || "",
        activeSection: "home",
        onboardingMode: "",
        accountLookupOpen: false,
        accountLookupStatus: "success",
        accountLookupMessage: "",
        quizIndex: -1,
        answers: [],
        tieCandidates: null,
        quizResult: null,
        revealedResult: null,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        accountLookupStatus: "error",
        accountLookupMessage: error.message || "No pude buscar tu cuenta en este momento.",
      }));
    }
  }

  async function saveChildProfile(event) {
    event?.preventDefault();
    if (!state.quizResult) return;
    const needsParentInfo = !state.parentProfileSaved;
    const parentName = state.parentName.trim();
    const parentEmail = state.parentEmail.trim().toLowerCase();
    if (needsParentInfo && (!parentName || !parentEmail)) return;

    const child = {
      ...makeEmptyChild(state.childDraft),
      primaryProfile: state.quizResult.primary,
      secondaryProfile: state.quizResult.secondary || "",
      answers: state.answers,
      sleepGoal: normalizeChildSleepGoal(state.childDraft.sleepGoal),
      takesNap: state.childDraft.takesNap || "no",
      createdAt: new Date().toISOString(),
      isFreeProfile: !hasPremiumAccess,
    };

    setState((current) => ({
      ...current,
      children: [...current.children, child],
      activeChildId: child.id,
      expandedChildId: child.id,
      activeSection: "child",
      onboardingMode: "reveal",
      childDraft: { name: "", birthday: "", gender: "boy", sleepGoal: "", takesNap: "no" },
      parentName: parentName || current.parentName,
      parentEmail: parentEmail || current.parentEmail,
      parentProfileSaved: true,
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
      revealedResult: current.quizResult,
    }));

    const leadPayload = {
      parentName: parentName || state.parentName,
      email: parentEmail || state.parentEmail,
      childName: child.name,
      childBirthday: child.birthday,
      childGender: child.gender,
      childAge: formatAgeLabel(child.birthday, "es"),
      sleepProfile: profileMap[child.primaryProfile]?.name || child.primaryProfile,
      primaryProfile: child.primaryProfile,
      secondaryProfile: child.secondaryProfile || null,
    };

    const premiumCheck = await checkPremiumAccessForEmail(parentEmail || state.parentEmail, { silent: true });
    const isPremiumLead = premiumCheck?.hasAccess === true || (premiumCheck === null && hasPremiumAccess);
    if (isPremiumLead) {
      child.isFreeProfile = false;
      setState((current) => ({
        ...current,
        children: current.children.map((entry) => (entry.id === child.id ? { ...entry, isFreeProfile: false } : entry)),
      }));
    }

    if (!isPremiumLead) {
      try {
        await fetch("/api/free-profile-lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadPayload),
        });
        setState((current) => ({ ...current, freeLeadProfileSent: true }));
      } catch {
        // The profile is saved locally even if the external lead webhook is unavailable.
      }
    }

    const profileSaveEmail = state.verifiedEmail || parentEmail || state.parentEmail;
    if (profileSaveEmail) {
      try {
        const saveResponse = await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "quiz_result",
            email: profileSaveEmail,
            childId: child.id,
            childName: child.name,
            childBirthday: child.birthday,
            childGender: child.gender,
            parentName: parentName || state.parentName,
            sleepGoal: child.sleepGoal,
            takesNap: child.takesNap,
            createdAt: child.createdAt,
            isFreeProfile: child.isFreeProfile,
            answers: {
              responses: child.answers,
              parentName: parentName || state.parentName,
              childName: child.name,
              childBirthday: child.birthday,
              childGender: child.gender,
              sleepGoal: child.sleepGoal,
              takesNap: child.takesNap,
              createdAt: child.createdAt,
              isFreeProfile: child.isFreeProfile,
            },
            primaryProfile: child.primaryProfile,
            secondaryProfile: child.secondaryProfile || null,
          }),
        });
        const savePayload = await saveResponse.json();
        if (!saveResponse.ok) {
          throw new Error(savePayload.error || "No pude guardar el perfil.");
        }
        const savedChildId = savePayload?.result?.child_id || savePayload?.result?.id;

        setState((current) => ({
          ...current,
          children: savedChildId
            ? current.children.map((entry) => (entry.id === child.id ? { ...entry, id: savedChildId } : entry))
            : current.children,
          activeChildId: savedChildId || current.activeChildId,
          expandedChildId: savedChildId || current.expandedChildId,
          persistenceMessage: "Perfil guardado. Ya puedes entrar al dashboard de tu hijo.",
        }));
      } catch {
        return;
      }
    }
  }

  async function verifyPremiumAccess(event) {
    event.preventDefault();
    const email = state.purchaseEmail.trim().toLowerCase();
    if (!email) return;
    await checkPremiumAccessForEmail(email);
  }

  async function saveChildBasics(event, childId) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("childName") || "").trim();
    const birthday = String(formData.get("birthday") || "");
    const gender = String(formData.get("gender") || "boy");
    const sleepGoal = String(formData.get("sleepGoal") || "");
    const takesNap = String(formData.get("takesNap") || "no");
    if (!name || !birthday) return;

    updateChild(childId, () => ({
      name,
      birthday,
      gender,
      sleepGoal,
      takesNap,
    }));

    setState((current) => ({
      ...current,
      editingChildId: "",
      persistenceMessage: "Perfil actualizado.",
    }));

    const email = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    if (email) {
      try {
        await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_child_profile",
            email,
            childId,
            childName: name,
            childBirthday: birthday,
            childGender: gender,
            sleepGoal,
            takesNap,
          }),
        });
      } catch {
        return;
      }
    }
  }

  async function deleteChildProfile(childId) {
    const email = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    const childToDelete = state.children.find((child) => child.id === childId);

    if (email) {
      try {
        const response = await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "delete_child_profile",
            email,
            childId,
            quizResultId: childToDelete?.quizResultId || childId,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "No pude eliminar el perfil.");
        }
      } catch (error) {
        setState((current) => ({
          ...current,
          persistenceMessage: error.message || "No pude eliminar el perfil en el sistema.",
        }));
        return;
      }
    }

    setState((current) => {
      const remainingChildren = current.children.filter((child) => child.id !== childId);
      const nextActiveChildId = current.activeChildId === childId ? remainingChildren[0]?.id || "" : current.activeChildId;
      return {
        ...current,
        children: remainingChildren,
        activeChildId: nextActiveChildId,
        expandedChildId: current.expandedChildId === childId ? "" : current.expandedChildId,
        editingChildId: "",
        currentPlan: current.activeChildId === childId ? null : current.currentPlan,
        persistenceMessage: "Perfil eliminado.",
      };
    });
  }

  function updateRoutineField(field, value) {
    setState((current) => ({
      ...current,
      routineForm: {
        ...current.routineForm,
        [field]: value,
      },
    }));
  }

  async function generateRoutine(event) {
    event.preventDefault();
    if (!activeChild) return;

    const plan = buildPlan({
      profile: activeChild.primaryProfile,
      birthday: activeChild.birthday,
      wakeTime: state.routineForm.wakeTime,
      targetBedtime: state.routineForm.targetBedtime,
      dinnerTime: state.routineForm.dinnerTime,
      prepareDuration: Number(state.routineForm.prepareDuration) || 25,
      napTaken: activeChild.takesNap === "yes" && state.routineForm.napTaken === "yes",
      napWakeTime: activeChild.takesNap === "yes" ? state.routineForm.napWakeTime : "",
      priorLogs: activeChild.logs,
      selectedActivities: activeChild.selectedActivities,
      dislikedCounts: activeChild.dislikedCounts,
    });

    updateChild(activeChild.id, () => ({ lastPlan: plan }));
    setState((current) => ({
      ...current,
      currentPlan: plan,
      routinePreviewOpen: true,
      routineSession: {
        startedAt: "",
        inBedAt: "",
        routineEndTime: "",
        fellAsleepAt: "",
        timerMode: current.routineSession?.timerMode || "timed",
        soundMode: current.routineSession?.soundMode || "transition",
      },
      expandedSwapStep: "",
      savedLogDate: "",
    }));

    if (hasPremiumAccess && state.verifiedEmail) {
      try {
        const response = await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "daily_plan",
            email: state.verifiedEmail,
            childId: activeChild.id,
            childName: activeChild.name,
            wakeTime: plan.wakeTime,
            targetBedtime: plan.targetBedtime,
            napTaken: activeChild.takesNap === "yes" && state.routineForm.napTaken === "yes",
            napWakeTime: activeChild.takesNap === "yes" ? state.routineForm.napWakeTime || null : null,
            dinnerTime: plan.dinnerTime,
            routineStart: plan.routineStart,
            bedtime: plan.bedtime,
            steps: plan.steps.map((step) => ({
              phaseKey: step.phaseKey,
              label: step.label,
              activity:
                step.selectedActivity?.displayName ||
                step.guidance?.title ||
                step.preparationItems?.map((item) => item.displayName).join(", ") ||
                "",
            })),
          }),
        });
      } catch {
        return;
      }
    }
  }

  function changeActivity(stepId, activityId) {
    if (!activeChild || !state.currentPlan) return;

    setState((current) => {
      const child = current.children.find((entry) => entry.id === current.activeChildId);
      if (!child) return current;

      const nextSelectedActivities = {
        ...(child.selectedActivities || {}),
        [stepId]: activityId,
      };

      const rebuiltPlan = buildPlan({
        profile: child.primaryProfile,
        birthday: child.birthday,
        wakeTime: current.routineForm.wakeTime,
        targetBedtime: current.routineForm.targetBedtime,
        dinnerTime: current.routineForm.dinnerTime,
        prepareDuration: Number(current.routineForm.prepareDuration) || 25,
        napTaken: child.takesNap === "yes" && current.routineForm.napTaken === "yes",
        napWakeTime: child.takesNap === "yes" ? current.routineForm.napWakeTime : "",
        priorLogs: child.logs,
        selectedActivities: nextSelectedActivities,
        dislikedCounts: child.dislikedCounts,
      });

      return {
        ...current,
        children: current.children.map((entry) =>
          entry.id === child.id
            ? {
                ...entry,
                selectedActivities: nextSelectedActivities,
                lastPlan: rebuiltPlan,
              }
            : entry
        ),
        currentPlan: rebuiltPlan,
        routinePreviewOpen: true,
        expandedSwapStep: "",
        persistenceMessage:
          current.language === "es"
            ? "Actividad cambiada. Ya actualicé la rutina de esta noche."
            : "Activity updated. Tonight's routine has been refreshed.",
      };
    });
  }

  async function saveGuidedRoutineLog(sessionPatch = {}) {
    if (!activeChild || !state.currentPlan) return;

    const session = { ...state.routineSession, ...sessionPatch };
    const bedTime = session.inBedAt || getCurrentTimeValue();
    const routineEndTime = session.routineEndTime || bedTime;
    const sleepTime = session.fellAsleepAt || getCurrentTimeValue();
    const nextLog = {
      date: new Date().toISOString().slice(0, 10),
      routineStartTime: session.startedAt || state.currentPlan.routineStart || "",
      bedTime,
      routineEndTime,
      sleepTime,
      latency: calculateLatency(routineEndTime, sleepTime),
      nightWakings: "pending",
      notes: "Registrado desde la rutina guiada.",
      ratings: [
        {
          type: "routine_timing",
          routineEndTime,
        },
        ...state.currentPlan.steps
          .filter((step) => step.selectedActivity)
          .map((step) => ({
            stepId: step.id,
            phaseKey: step.phaseKey,
            stepLabel: step.label,
            start: step.start,
            end: step.end,
            activityId: step.selectedActivityId,
            activity: step.selectedActivity.displayName,
            rating: 3,
            disliked: false,
          })),
      ],
    };

    const updatedLogs = [nextLog, ...activeChild.logs.filter((entry) => entry.date !== nextLog.date)].sort((left, right) =>
      left.date < right.date ? 1 : -1
    );

    updateChild(activeChild.id, () => ({
      logs: updatedLogs,
    }));

    setState((current) => ({
      ...current,
      routineSession: session,
      savedLogDate: nextLog.date,
      currentPlan: null,
      routinePreviewOpen: false,
      persistenceMessage:
        nextLog.latency <= 15
          ? "¡Qué alegría! Rutina registrada exitosamente y se durmió dentro de 15 minutos."
          : "Rutina registrada exitosamente.",
    }));

    if (hasPremiumAccess && state.verifiedEmail) {
      try {
        const response = await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "nightly_log",
            email: state.verifiedEmail,
            childId: activeChild.id,
            childName: activeChild.name,
            logDate: nextLog.date,
            routineStartTime: nextLog.routineStartTime,
            inBedAt: nextLog.bedTime,
            fellAsleepAt: nextLog.sleepTime,
            sleepLatencyMinutes: nextLog.latency,
            nightWakings: nextLog.nightWakings,
            notes: nextLog.notes,
            ratings: nextLog.ratings,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "No pude guardar la noche en el sistema.");
        }
      } catch {
        return;
      }
    }
  }

  function startQuickSleepTimer(type = "night") {
    setState((current) => ({
      ...current,
      quickSleepTimer: {
        startedAt: getCurrentTimeValue(),
        running: true,
        type,
      },
    }));
  }

  async function stopQuickSleepTimer() {
    if (!activeChild || !state.quickSleepTimer.startedAt) return;
    const sleepTime = getCurrentTimeValue();
    const dateKey = new Date().toISOString().slice(0, 10);
    const existingLog = activeChild.logs.find((entry) => entry.date === dateKey);
    const isNapLog = state.quickSleepTimer.type === "nap";
    const napDuration = calculateLatency(state.quickSleepTimer.startedAt, sleepTime);
    const existingRatings = existingLog?.ratings || [];
    const napRating = {
      type: "nap_log",
      napStart: state.quickSleepTimer.startedAt,
      napEnd: sleepTime,
      napDuration,
    };
    const nextLog = isNapLog
      ? {
          ...(existingLog || {}),
          date: dateKey,
          routineStartTime: existingLog?.routineStartTime || "",
          bedTime: existingLog?.bedTime || "",
          sleepTime: existingLog?.sleepTime || "",
          latency: existingLog?.latency || 0,
          nightWakings: existingLog?.nightWakings || "pending",
          notes: existingLog?.notes || "Siesta registrada.",
          napStart: state.quickSleepTimer.startedAt,
          napEnd: sleepTime,
          napDuration,
          ratings: [...existingRatings.filter((rating) => rating?.type !== "nap_log"), napRating],
          source: existingLog?.source || "quick_sleep_tracker",
        }
      : {
          ...(existingLog || {}),
          date: dateKey,
          routineStartTime: existingLog?.routineStartTime || "",
          bedTime: state.quickSleepTimer.startedAt,
          sleepTime,
          latency: calculateLatency(state.quickSleepTimer.startedAt, sleepTime),
          nightWakings: existingLog?.nightWakings || "pending",
          notes: existingLog?.notes || "Registrado con el tracker rápido de sueño.",
          ratings: existingRatings,
          napStart: existingLog?.napStart || "",
          napEnd: existingLog?.napEnd || "",
          napDuration: existingLog?.napDuration || 0,
          source: "quick_sleep_tracker",
        };

    const updatedLogs = [nextLog, ...activeChild.logs.filter((entry) => entry.date !== nextLog.date)].sort((left, right) =>
      left.date < right.date ? 1 : -1
    );

    updateChild(activeChild.id, () => ({
      logs: updatedLogs,
    }));

    setState((current) => ({
      ...current,
      quickSleepTimer: { startedAt: "", running: false, type: "night" },
      activeSection: "reports",
      expandedChildId: activeChild.id,
      persistenceMessage: isNapLog ? "Siesta registrada exitosamente." : "Sueño registrado exitosamente.",
    }));

    const email = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    if (email && !isNapLog) {
      try {
        await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "nightly_log",
            email,
            childId: activeChild.id,
            childName: activeChild.name,
            logDate: nextLog.date,
            routineStartTime: nextLog.routineStartTime,
            inBedAt: nextLog.bedTime,
            fellAsleepAt: nextLog.sleepTime,
            sleepLatencyMinutes: nextLog.latency,
            nightWakings: nextLog.nightWakings,
            notes: nextLog.notes,
            ratings: nextLog.ratings,
          }),
        });
      } catch {
        return;
      }
    }
  }

  async function submitNightLog(event) {
    event.preventDefault();
    if (!activeChild || !state.currentPlan) return;

    const formData = new FormData(event.currentTarget);
    const routineStartTime = String(formData.get("routineStartTime") || state.routineSession.startedAt || "");
    const bedTime = String(formData.get("bedTime"));
    const sleepTime = String(formData.get("sleepTime"));
    const notes = String(formData.get("notes") || "");
    const nightWakings = String(formData.get("nightWakings") || "pending");

    const ratings = state.currentPlan.steps
      .filter((step) => step.selectedActivity)
      .map((step) => {
        const enjoyed = formData.get(`enjoyed-${step.id}`) !== "no";
        const disliked = !enjoyed;
        return {
          stepId: step.id,
          phaseKey: step.phaseKey,
          stepLabel: step.label,
          start: step.start,
          end: step.end,
          activityId: step.selectedActivityId,
          activity: step.selectedActivity.displayName,
          rating: enjoyed ? 3 : 1,
          disliked,
          dislikeReason: String(formData.get(`dislike-reason-${step.id}`) || ""),
        };
      });

    const dislikedCounts = JSON.parse(JSON.stringify(activeChild.dislikedCounts || {}));
    ratings.forEach((rating) => {
      if (!rating.disliked || !rating.activityId) return;
      dislikedCounts[rating.phaseKey] = dislikedCounts[rating.phaseKey] || {};
      dislikedCounts[rating.phaseKey][rating.activityId] = (dislikedCounts[rating.phaseKey][rating.activityId] || 0) + 1;
    });

    const nextLog = {
      date: String(formData.get("date")),
      routineStartTime,
      bedTime,
      sleepTime,
      latency: calculateLatency(bedTime, sleepTime),
      nightWakings,
      notes,
      ratings,
    };

    const updatedLogs = [nextLog, ...activeChild.logs.filter((entry) => entry.date !== nextLog.date)].sort((left, right) =>
      left.date < right.date ? 1 : -1
    );
    const recentLatencies = activeChild.logs
      .filter((entry) => Number.isFinite(Number(entry.latency)))
      .sort((left, right) => (left.date < right.date ? 1 : -1))
      .slice(0, 3)
      .map((entry) => Number(entry.latency));
    const averageLatency =
      recentLatencies.length > 0
        ? Math.round(recentLatencies.reduce((sum, latency) => sum + latency, 0) / recentLatencies.length)
        : null;
    const sleepNote =
      nextLog.latency <= 15
        ? "¡Qué alegría! Se durmió dentro de 15 minutos de entrar a la cama."
        : averageLatency !== null && nextLog.latency > averageLatency + 20
            ? "Recordatorio suave: la consistencia del sueño es importante para cerebros en crecimiento."
          : averageLatency !== null && nextLog.latency > averageLatency + 10
            ? "Parece que hoy tardó más de lo usual en dormirse. Puedes dejar una nota sobre cambios en su día para entender el patrón."
            : "";

    updateChild(activeChild.id, () => ({
      logs: updatedLogs,
      dislikedCounts,
    }));

    event.currentTarget.reset();
    setState((current) => ({
      ...current,
      savedLogDate: nextLog.date,
      persistenceMessage:
        current.language === "es"
          ? sleepNote || "Rutina registrada exitosamente."
          : "Saved. Tonight was registered successfully.",
    }));

    if (hasPremiumAccess && state.verifiedEmail) {
      try {
        const response = await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "nightly_log",
            email: state.verifiedEmail,
            childId: activeChild.id,
            childName: activeChild.name,
            logDate: nextLog.date,
            routineStartTime: nextLog.routineStartTime,
            inBedAt: nextLog.bedTime,
            fellAsleepAt: nextLog.sleepTime,
            sleepLatencyMinutes: nextLog.latency,
            nightWakings: nextLog.nightWakings,
            notes: nextLog.notes,
            ratings: nextLog.ratings,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "No pude guardar la noche en el sistema.");
        }

        setState((current) => ({
          ...current,
          savedLogDate: nextLog.date,
          persistenceMessage: "Guardado. Esta noche quedó registrada exitosamente.",
        }));
      } catch {
        return;
      }
    }
  }

  async function updateSavedNightLog(event, childId, originalDate) {
    event.preventDefault();
    const child = state.children.find((entry) => entry.id === childId);
    if (!child) return;

    const formData = new FormData(event.currentTarget);
    const existingLog = child.logs.find((log) => log.date === originalDate) || {};
    const bedTime = String(formData.get("bedTime") || "");
    const sleepTime = String(formData.get("sleepTime") || "");
    const wakeTime = String(formData.get("wakeTime") || existingLog.wakeTime || "");
    const updatedLog = {
      date: String(formData.get("date") || originalDate),
      routineStartTime: String(formData.get("routineStartTime") || ""),
      routineEndTime: String(formData.get("routineEndTime") || existingLog.routineEndTime || ""),
      bedTime,
      sleepTime,
      wakeTime,
      latency: calculateLatency(bedTime, sleepTime),
      nightWakings: String(formData.get("nightWakings") || "0"),
      notes: String(formData.get("notes") || ""),
      napStart: existingLog.napStart || "",
      napEnd: existingLog.napEnd || "",
      napDuration: Number(existingLog.napDuration || 0),
      totalSleepHours: calculateTotalSleepHours(sleepTime, wakeTime, existingLog.napDuration),
      ratings: existingLog.ratings || [],
    };

    updateChild(childId, (currentChild) => ({
      logs: [updatedLog, ...(currentChild.logs || []).filter((log) => log.date !== originalDate)].sort((left, right) =>
        left.date < right.date ? 1 : -1
      ),
    }));

    const email = state.verifiedEmail || state.parentEmail || state.purchaseEmail;
    if (email) {
      try {
        const response = await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "nightly_log",
            email,
            childId,
            logDate: updatedLog.date,
            routineStartTime: updatedLog.routineStartTime,
            lightsOutAt: updatedLog.routineEndTime,
            inBedAt: updatedLog.bedTime,
            fellAsleepAt: updatedLog.sleepTime,
            wakeTime: updatedLog.wakeTime,
            sleepLatencyMinutes: updatedLog.latency,
            nightWakings: updatedLog.nightWakings,
            notes: updatedLog.notes,
            ratings: updatedLog.ratings,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "No pude actualizar la noche.");
        }
        setState((current) => ({ ...current, persistenceMessage: "Noche actualizada." }));
      } catch (error) {
        setState((current) => ({ ...current, persistenceMessage: error.message || "No pude actualizar la noche." }));
      }
    }
  }

  function updateActivityEnjoyment(childId, logDate, rating, enjoyedValue) {
    const child = state.children.find((entry) => entry.id === childId);
    if (!child || !rating?.activityId) return;

    const enjoyed = enjoyedValue !== "no";
    const dislikedCounts = JSON.parse(JSON.stringify(child.dislikedCounts || {}));
    if (!enjoyed) {
      dislikedCounts[rating.phaseKey] = dislikedCounts[rating.phaseKey] || {};
      dislikedCounts[rating.phaseKey][rating.activityId] = Math.max(1, dislikedCounts[rating.phaseKey][rating.activityId] || 0);
    }

    updateChild(childId, (currentChild) => {
      const selectedActivities = { ...(currentChild.selectedActivities || {}) };
      if (!enjoyed) {
        Object.entries(selectedActivities).forEach(([stepId, activityId]) => {
          if (activityId === rating.activityId || stepId === rating.stepId) {
            delete selectedActivities[stepId];
          }
        });
      }

      return {
      dislikedCounts,
      selectedActivities,
      logs: (currentChild.logs || []).map((log) => {
        if (log.date !== logDate) return log;
        return {
          ...log,
          ratings: (log.ratings || []).map((entry) =>
            entry.stepId === rating.stepId
              ? {
                  ...entry,
                  rating: enjoyed ? 3 : 1,
                  disliked: !enjoyed,
                }
              : entry
          ),
        };
      }),
      };
    });
  }

  async function updateNightWakingsForPrompt(event) {
    event.preventDefault();
    if (!activeChild || !state.wakingPromptLogDate) return;

    const formData = new FormData(event.currentTarget);
    const nightWakings = String(formData.get("nightWakings") || "0");
    const wakeTime = String(formData.get("wakeTime") || "");
    const logDate = state.wakingPromptLogDate;

    updateChild(activeChild.id, (child) => ({
      logs: (child.logs || []).map((log) =>
        log.date === logDate
          ? {
              ...log,
              nightWakings,
              wakeTime,
              totalSleepHours: calculateTotalSleepHours(log.sleepTime, wakeTime, log.napDuration),
              ratings: [
                ...(log.ratings || []).filter((rating) => rating?.type !== "morning_report"),
                {
                  type: "morning_report",
                  wakeTime,
                  totalSleepHours: calculateTotalSleepHours(log.sleepTime, wakeTime, log.napDuration),
                },
              ],
            }
          : log
      ),
    }));

    setState((current) => ({
      ...current,
      wakingPromptLogDate: "",
      persistenceMessage: current.language === "es" ? "Despertares guardados." : "Night wakings saved.",
    }));

    if (hasPremiumAccess && state.verifiedEmail) {
      try {
        await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "update_night_wakings",
            email: state.verifiedEmail,
            childId: activeChild.id,
            logDate,
            nightWakings,
            wakeTime,
          }),
        });
      } catch {
        return;
      }
    }
  }

  const safetyTriggered = activeChild?.logs?.[0]?.notes
    ? /ronquidos|respirar|convuls|dolor|regresi|insomnio|autoles/i.test(activeChild.logs[0].notes)
    : false;

  const userEmail = state.verifiedEmail || state.parentEmail || state.purchaseEmail || "";

  return (
    <main className="shell app-shell">
      {state.showPaywall ? (
        <PaywallScreen
          language={state.language}
          userEmail={userEmail}
          onClose={() => setState((current) => ({ ...current, showPaywall: false }))}
          onPurchaseSuccess={() => {
            setState((current) => ({ ...current, showPaywall: false }));
            checkPremiumAccessForEmail(userEmail, { silent: false });
          }}
        />
      ) : null}

      {editingChild ? (
        <EditProfileModal
          activeChild={editingChild}
          strings={strings}
          onSave={(event) => saveChildBasics(event, editingChild.id)}
          onDelete={() => deleteChildProfile(editingChild.id)}
          onClose={() => setState((current) => ({ ...current, editingChildId: "" }))}
        />
      ) : null}

      {state.accountLookupOpen ? (
        <AccountLookupModal
          strings={strings}
          email={state.accountLookupEmail}
          status={state.accountLookupStatus}
          message={state.accountLookupMessage}
          onEmailChange={(value) => setState((current) => ({ ...current, accountLookupEmail: value }))}
          onSubmit={restoreSavedAccount}
          onClose={() =>
            setState((current) => ({
              ...current,
              accountLookupOpen: false,
              accountLookupMessage: "",
            }))
          }
        />
      ) : null}

      {state.sleepWindowOpen ? (
        <SleepWindowModal
          strings={strings}
          activeChild={activeChild}
          onCalculated={() => setState((current) => ({ ...current, sleepWindowCompleted: true }))}
          onClose={() => setState((current) => ({ ...current, sleepWindowOpen: false }))}
        />
      ) : null}

      {state.premiumRoutineGateOpen ? (
        <PremiumRoutineGate
          strings={strings}
          hasProfile={Boolean(activeChild?.primaryProfile)}
          hasSleepWindow={Boolean(state.sleepWindowCompleted)}
          onGoProfile={() => setState((current) => ({ ...current, premiumRoutineGateOpen: false, activeSection: "child" }))}
          onGoSleepWindow={() => setState((current) => ({ ...current, premiumRoutineGateOpen: false, sleepWindowOpen: true }))}
          onClose={() => setState((current) => ({ ...current, premiumRoutineGateOpen: false }))}
          onPurchaseClick={goToSalesFunnelFromRoutineGate}
        />
      ) : null}

      {state.wakingPromptLogDate ? (
        <NightWakingPrompt
          strings={strings}
          logDate={state.wakingPromptLogDate}
          onSubmit={updateNightWakingsForPrompt}
          onClose={() => setState((current) => ({ ...current, wakingPromptLogDate: "" }))}
        />
      ) : null}

      {state.showRatingPrompt ? (
        <RatingPromptModal
          onClose={() => setState((cur) => ({ ...cur, showRatingPrompt: false }))}
        />
      ) : null}

      {state.showCancellationModal ? (
        <CancellationModal
          isFirstCancel={state.cancelFeedbackCount === 0}
          userEmail={state.verifiedEmail || state.parentEmail}
          onClose={() => setState((cur) => ({ ...cur, showCancellationModal: false }))}
          onCancelComplete={(acceptedFreeMonth) => {
            setState((cur) => ({
              ...cur,
              showCancellationModal: false,
              cancelFeedbackCount: cur.cancelFeedbackCount + 1,
            }));
          }}
        />
      ) : null}

      {!hasPremiumAccess ? (
        <section className="gate-shell">
          <AppTopBar
            activeChild={activeChild}
            children={state.children}
            strings={strings}
            onSelectChild={(childId) => setState((current) => ({ ...current, activeChildId: childId }))}
            onAddChild={startAddChild}
            onOpenMessages={() => setState((current) => ({ ...current, activeSection: "contact" }))}
            onOpenSettings={() => setState((current) => ({ ...current, activeSection: "settings" }))}
          />

          {state.activeSection !== "admin" &&
          !state.accountLookupOpen &&
          (state.onboardingMode === "new-child" ||
            state.onboardingMode === "reveal") ? (
            <>
              <article className="card card--soft card--quiz">
            {state.children.length > 0 ? (
              <button className="routine-modal__close" type="button" onClick={closeAddChildFlow} aria-label={strings.close}>
                ×
              </button>
            ) : null}
            <div className="card-header">
              <span className="section-label">{strings.newChild}</span>
              <h2>{strings.createProfileFirst}</h2>
            </div>

            {state.quizIndex === -1 && !state.quizResult && !state.revealedResult ? (
              <form className="stack" onSubmit={beginQuiz}>
                <p className="lead-copy">
                  {strings.createProfileIntro}
                </p>
                <label className="stack compact">
                  <span>{strings.childName}</span>
                  <input
                    type="text"
                    value={state.childDraft.name}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        childDraft: { ...current.childDraft, name: event.target.value },
                      }))
                    }
                    required
                  />
                </label>
                <label className="stack compact">
                  <span>{strings.birthday}</span>
                  <input
                    type="date"
                    value={state.childDraft.birthday}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        childDraft: { ...current.childDraft, birthday: event.target.value },
                      }))
                    }
                    required
                  />
                </label>
                <label className="stack compact">
                  <span>{strings.gender}</span>
                  <select
                    value={state.childDraft.gender}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        childDraft: { ...current.childDraft, gender: event.target.value },
                      }))
                    }
                    required
                  >
                    <option value="boy">{strings.boy}</option>
                    <option value="girl">{strings.girl}</option>
                  </select>
                </label>
                <label className="stack compact">
                  <span>{strings.sleepGoal}</span>
                  <input
                    type="time"
                    value={state.childDraft.sleepGoal}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        childDraft: { ...current.childDraft, sleepGoal: event.target.value },
                      }))
                    }
                  />
                  <small className="field-help">{state.language === "es" ? "Ej: 20:00 para las 8 PM. Si usas reloj de 12 horas, suma 12 a las horas de la tarde." : "E.g. 20:00 for 8 PM."}</small>
                </label>
                <label className="stack compact">
                  <span>{strings.napQuestion}</span>
                  <select
                    value={state.childDraft.takesNap}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        childDraft: { ...current.childDraft, takesNap: event.target.value },
                      }))
                    }
                  >
                    <option value="no">{strings.no}</option>
                    <option value="yes">{strings.yes}</option>
                  </select>
                </label>
                <button className="button button-primary" type="submit">
                  {strings.startQuiz}
                </button>
                {state.children.length === 0 ? (
                  <AccountLookup
                    strings={strings}
                    onToggle={openAccountLookup}
                  />
                ) : null}
              </form>
            ) : null}

            {state.quizIndex >= 0 && state.quizIndex < questions.length ? (
              <div className="stack">
                <div className="progress-row">
                  <strong>
                    {strings.question} {state.quizIndex + 1} {strings.of} {questions.length}
                  </strong>
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{ width: `${((state.quizIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <h3>{genderize(questions[state.quizIndex].prompt, state.childDraft.gender)}</h3>
                <div className="stack">
                  {questions[state.quizIndex].options.map((option) => (
                    <button
                      key={`${questions[state.quizIndex].id}-${option.key}`}
                      className="answer"
                      type="button"
                      onClick={() => answerQuestion(option)}
                    >
                      <span className="answer__badge">{option.key}</span>
                      <span className="answer__text">{genderize(option.label, state.childDraft.gender)}</span>
                    </button>
                  ))}
                </div>
                {state.quizIndex > 0 ? (
                  <button className="button button-ghost" type="button" onClick={goBackQuestion}>
                    {strings.previousQuestion}
                  </button>
                ) : null}
              </div>
            ) : null}

            {state.tieCandidates ? (
              <div className="stack">
                <p>
                  {state.language === "es"
                    ? "Estoy viendo una mezcla entre dos patrones."
                    : "I am seeing a mix of two patterns."}
                </p>
                <p>
                  <strong>
                    {state.language === "es"
                      ? "De estas dos opciones, ¿cuál sientes que describe más a tu hijo en este momento?"
                      : "Out of these two options, which one feels more true for your child right now?"}
                  </strong>
                </p>
                {state.tieCandidates.map((code) => (
                  <button key={code} className="button button-secondary" type="button" onClick={() => chooseTieWinner(code)}>
                    {profileMap[code].name}
                  </button>
                ))}
              </div>
            ) : null}

            {resultCopy && !state.revealedResult ? (
              <form className="stack account-capture" onSubmit={saveChildProfile}>
                <div className="result-banner result-banner--light">
                  <p>{genderize(strings.freeAccountTitle, state.childDraft.gender)}</p>
                </div>
                <div className="content-block content-block--light">
                  <p>{genderize(strings.freeAccountCopy, state.childDraft.gender)}</p>
                  <p>{genderize(strings.freeAccountMemory, state.childDraft.gender)}</p>
                </div>
                <label className="stack compact">
                  <span>{strings.parentName}</span>
                  <input
                    type="text"
                    value={state.parentName}
                    onChange={(event) => setState((current) => ({ ...current, parentName: event.target.value }))}
                    required
                  />
                </label>
                <label className="stack compact">
                  <span>{strings.parentEmail}</span>
                  <input
                    type="email"
                    value={state.parentEmail}
                    onChange={(event) => setState((current) => ({ ...current, parentEmail: event.target.value }))}
                    required
                  />
                </label>
                <button className="button button-primary" type="submit">
                  {genderize(strings.seeChildProfile, state.childDraft.gender)} →
                </button>
                <p className="muted">{genderize(strings.freeAccountNoSpam, state.childDraft.gender)}</p>
              </form>
            ) : null}

            {revealedResultCopy ? (
              <div className="stack">
                <div className="result-banner result-banner--light">
                  <p>
                    {state.language === "es"
                      ? `${activeChild?.name || state.childDraft.name} tiene el perfil de sueño:`
                      : `${activeChild?.name || state.childDraft.name}'s sleep profile is:`}
                  </p>
                  <h3>👉 {revealedResultCopy.primaryName}</h3>
                </div>
                <div className="content-block content-block--light">
                  <p>{genderize(revealedResultCopy.primaryDescription, activeChild?.gender || state.childDraft.gender)}</p>
                </div>
                {revealedResultCopy.secondaryName ? (
                  <p className="content-note">
                    {state.language === "es"
                      ? `También veo rasgos de ${revealedResultCopy.secondaryName}, así que puede haber una mezcla de patrones.`
                      : `I also see traits of ${revealedResultCopy.secondaryName}, so there may be a mixed pattern.`}
                  </p>
                ) : null}
                <button className="button button-primary" type="button" onClick={goToSalesFunnelFromRoutineGate}>
                  {state.language === "es"
                    ? `Desbloquear la rutina de ${activeChild?.name || state.childDraft.name}`
                    : `Unlock ${activeChild?.name || state.childDraft.name}'s routine`}
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      activeSection: "home",
                      onboardingMode: "",
                      revealedResult: null,
                    }))
                  }
                >
                  {state.language === "es" ? "Explorar la app" : "Explore the app"}
                </button>
              </div>
            ) : null}
              </article>
            </>
          ) : !state.parentProfileSaved && state.children.length > 0 && state.activeSection !== "admin" ? (
            <FreeAccountSetup
              strings={strings}
              parentName={state.parentName}
              parentEmail={state.parentEmail}
              onChange={(field, value) => setState((current) => ({ ...current, [field]: value }))}
              onSubmit={saveFreeAccount}
              onAlreadyHaveAccount={openAccountLookup}
            />
          ) : state.activeSection === "home" ? (
            <>
              {/* Hero cards — one per child */}
              {state.children.length > 0 ? state.children.map((child) => {
                const lastLog = [...(child.logs || [])].filter(l => l.date).sort((a,b) => a.date < b.date ? 1 : -1)[0];
                const lastNightHours = lastLog ? calculateTotalSleepHours(lastLog.sleepTime, lastLog.wakeTime, lastLog.napDuration) : null;
                const sleepDebt = lastNightHours !== null ? calculateSleepDebt(lastNightHours, child.birthday) : 0;
                const debtLabel = sleepDebt <= 0 ? "Al día" : sleepDebt < 1 ? "Baja" : sleepDebt < 3 ? "Moderada" : "Alta";
                const debtColor = sleepDebt <= 0 ? "var(--green)" : sleepDebt < 1 ? "var(--moon)" : "var(--coral)";
                const displayTime = child.sleepGoal || null;
                return (
                  <article key={child.id} style={{
                    background: "linear-gradient(150deg, #2B2342 0%, #1F2A47 55%, #1A2C3D 100%)",
                    border: "1px solid var(--border)", borderRadius: 22, padding: "22px 22px 20px",
                    position: "relative", overflow: "hidden", color: "var(--ink)"
                  }}>
                    <div style={{ position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,231,178,.2), transparent 70%)" }} />
                    <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--moon)", fontWeight: 700, marginBottom: 4 }}>
                      Hora ideal para dormir hoy
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,248,239,.5)", marginBottom: 4, fontWeight: 600 }}>{child.name}</div>
                    {displayTime ? (
                      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "clamp(2.4rem,12vw,3.6rem)", fontWeight: 600, lineHeight: 1, marginBottom: 6 }}>
                        {displayTime}
                      </div>
                    ) : (
                      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "clamp(1.4rem,6vw,2rem)", fontWeight: 600, lineHeight: 1.2, marginBottom: 6, color: "var(--ink-soft)" }}>
                        Configura la hora en el perfil
                      </div>
                    )}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${debtColor}22`, color: debtColor, border: `1px solid ${debtColor}44`, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: debtColor, display: "inline-block" }} />
                      Deuda de sueño: {debtLabel}
                    </div>
                  </article>
                );
              }) : null}

              {/* Welcome card for new users */}
              {!activeChild && !state.children.length ? (
                <article style={{ background: "linear-gradient(150deg, #2B2342 0%, #1F2A47 55%, #1A2C3D 100%)", border: "1px solid var(--border)", borderRadius: 22, padding: "28px 22px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🌙</div>
                  <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, color: "var(--cream)", margin: "0 0 10px" }}>
                    {state.language === "en" ? "Welcome to Buenas Noches" : "Bienvenida a Buenas Noches"}
                  </h2>
                  <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>
                    {state.language === "en"
                      ? "Create your child's sleep profile to get a personalized bedtime routine."
                      : "Crea el perfil de sueño de tu hijo para obtener una rutina personalizada."}
                  </p>
                  <button className="button button-primary" type="button" onClick={startAddChild} style={{ width: "100%", fontSize: 15 }}>
                    {state.language === "en" ? "➕ Add a child" : "➕ Agregar a mi hijo"}
                  </button>
                </article>
              ) : null}

              {/* Upsell card */}
              {activeChild && !state.premiumRoutineGateOpen ? (
                <article className="card" style={{ display: "flex", gap: 13, alignItems: "center", background: "linear-gradient(150deg, rgba(244,231,178,.12), rgba(244,231,178,.04))", border: "1px solid rgba(244,231,178,.22)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(244,231,178,.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--moon)" }}>
                    <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.4.3.6.8.6 1.3V16h6v-.8c0-.5.2-1 .6-1.3A6 6 0 0 0 12 3Z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 13, display: "block", marginBottom: 6, lineHeight: 1.4 }}>
                      Quieres una rutina paso a paso para que {activeChild?.name || "tu hijo"} se duerma mas rapido?
                    </strong>
                    <button className="button button-primary" style={{ minHeight: 36, padding: "0 14px", fontSize: 12 }} type="button"
                      onClick={() => requestRoutine(activeChild?.id)}>
                      Ver rutina premium
                    </button>
                  </div>
                </article>
              ) : null}

              {state.persistenceMessage && (state.activeSection === "home" || state.activeSection === "reports" || state.activeSection === "routine") ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}
            </>
          ) : state.activeSection === "reports" || state.activeSection === "child" ? (
            <>
              {state.activeSection === "child" && !state.onboardingMode ? (
                <p className="status-message status-success">{strings.childTabPrompt}</p>
              ) : null}
              <ChildHomeGrid
                children={state.children}
                activeChildId={state.activeChildId}
                expandedChildId={state.expandedChildId}
                canAddChild={canAddChild}
                strings={strings}
                language={state.language}
                profileMap={profileMap}
                parentName={state.parentName}
                parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
                mode={state.activeSection === "reports" ? "reports" : "child"}
                onToggleChild={(childId) =>
                  setState((current) => ({
                    ...current,
                    activeChildId: childId,
                    expandedChildId: current.expandedChildId === childId ? "" : childId,
                  }))
                }
                onCreateRoutine={(childId) => requestRoutine(childId)}
                onEditProfile={(childId) => setState((current) => ({ ...current, editingChildId: childId }))}
                onUpdateLog={updateSavedNightLog}
                onUpdateActivityEnjoyment={updateActivityEnjoyment}
                onAddChild={startAddChild}
              />
              {state.persistenceMessage && (state.activeSection === "home" || state.activeSection === "reports" || state.activeSection === "routine") ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}
            </>
          ) : state.activeSection === "sleep" ? (
            <SleepTrackerSection
              strings={strings}
              activeChild={activeChild}
              timer={state.quickSleepTimer}
              onStart={startQuickSleepTimer}
              onStop={stopQuickSleepTimer}
            />
          ) : state.activeSection === "settings" ? (
            <ParentSettingsSection
              strings={strings}
              parentName={state.parentName}
              parentLastName={state.parentLastName}
              parentEmail={state.parentEmail}
              parentPhotoUrl={state.parentPhotoUrl}
              hasPremiumAccess={hasPremiumAccess}
              language={state.language}
              userEmail={state.verifiedEmail || state.parentEmail}
              cancelFeedbackCount={state.cancelFeedbackCount}
              onChange={(field, value) => setState((current) => ({ ...current, [field]: value }))}
              onSave={saveParentSettings}
              onUpgrade={() => setState((current) => ({ ...current, showPaywall: true }))}
              onCancelSubscription={() => setState((current) => ({ ...current, showCancellationModal: true }))}
            />
          ) : state.activeSection === "tips" ? (
            <TipsSection strings={strings} language={state.language} onOpen={handleMainMenu} locked />
          ) : state.activeSection === "videos" ? (
            <VideoSection activeChild={activeChild} strings={strings} locked />
          ) : state.activeSection === "sleep-area" ? (
            <LockedPreviewCard activeSection="sleep-area" language={state.language} />
          ) : state.activeSection === "avoid" ? (
            <LockedPreviewCard activeSection="avoid" language={state.language} />
          ) : state.activeSection === "foods" ? (
            <LockedPreviewCard activeSection="foods" language={state.language} />
          ) : state.activeSection === "wins" ? (
            <WinsSection
              activeChild={activeChild}
              strings={strings}
              language={state.language}
              parentName={state.parentName}
              parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
              parentPhotoUrl={state.parentPhotoUrl}
            />
          ) : state.activeSection === "contact" ? (
            <ContactSection
              strings={strings}
              language={state.language}
              activeChild={activeChild}
              parentName={state.parentName}
              parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
            />
          ) : state.activeSection === "subscription" ? (
            <SubscriptionScreen
              language={state.language}
              strings={strings}
              userEmail={userEmail}
              hasPremiumAccess={hasPremiumAccess}
              onUpgrade={() => setState((current) => ({ ...current, showPaywall: true }))}
              onClose={() => setState((current) => ({ ...current, activeSection: "home" }))}
            />
          ) : state.activeSection === "admin" ? (
            <AdminSection strings={strings} language={state.language} onHome={() => setState((current) => ({ ...current, activeSection: "home" }))} />
          ) : (
            <LockedPreviewCard activeSection={state.activeSection} language={state.language} />
          )}

          <BottomAppNav options={bottomMenuOptions} activeSection={state.activeSection} onSelect={handleMainMenu} />
        </section>
      ) : (
        <>
          <AppTopBar
            activeChild={activeChild}
            children={state.children}
            strings={strings}
            onSelectChild={(childId) => setState((current) => ({ ...current, activeChildId: childId }))}
            onAddChild={startAddChild}
            onOpenMessages={() => setState((current) => ({ ...current, activeSection: "contact" }))}
            onOpenSettings={() => setState((current) => ({ ...current, activeSection: "settings" }))}
          />

          {state.activeSection !== "admin" && state.onboardingMode === "new-child" && !state.accountLookupOpen ? (
            <section className="app-panel">
              <article className="card card--soft card--quiz">
                {state.children.length > 0 ? (
                  <button className="routine-modal__close" type="button" onClick={closeAddChildFlow} aria-label={strings.close}>
                    ×
                  </button>
                ) : null}
                <div className="card-header">
                  <span className="section-label">Nuevo niño</span>
                  <h2>{strings.createProfileFirst}</h2>
                </div>

                {state.quizIndex === -1 && !state.quizResult ? (
                  <form className="stack" onSubmit={beginQuiz}>
                    <p className="lead-copy">
                      Vamos a guardar su nombre y fecha de nacimiento para que la app siempre sepa su edad,
                      incluso muchos meses después.
                    </p>
                    <label className="stack compact">
                      <span>{strings.childName}</span>
                      <input
                        type="text"
                        value={state.childDraft.name}
                        onChange={(event) =>
                          setState((current) => ({
                            ...current,
                            childDraft: { ...current.childDraft, name: event.target.value },
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="stack compact">
                      <span>{strings.birthday}</span>
                      <input
                        type="date"
                        value={state.childDraft.birthday}
                        onChange={(event) =>
                          setState((current) => ({
                            ...current,
                            childDraft: { ...current.childDraft, birthday: event.target.value },
                          }))
                        }
                        required
                      />
                    </label>
                    <label className="stack compact">
                      <span>{strings.gender}</span>
                      <select
                        value={state.childDraft.gender}
                        onChange={(event) =>
                          setState((current) => ({
                            ...current,
                            childDraft: { ...current.childDraft, gender: event.target.value },
                          }))
                        }
                        required
                      >
                        <option value="boy">{strings.boy}</option>
                        <option value="girl">{strings.girl}</option>
                      </select>
                    </label>
                    <label className="stack compact">
                      <span>{strings.sleepGoal}</span>
                      <input
                        type="time"
                        value={state.childDraft.sleepGoal}
                        onChange={(event) =>
                          setState((current) => ({
                            ...current,
                            childDraft: { ...current.childDraft, sleepGoal: event.target.value },
                          }))
                        }
                      />
                    </label>
                    <label className="stack compact">
                      <span>{strings.napQuestion}</span>
                      <select
                        value={state.childDraft.takesNap}
                        onChange={(event) =>
                          setState((current) => ({
                            ...current,
                            childDraft: { ...current.childDraft, takesNap: event.target.value },
                          }))
                        }
                      >
                        <option value="no">{strings.no}</option>
                        <option value="yes">{strings.yes}</option>
                      </select>
                    </label>
                    <button className="button button-primary" type="submit">
                      {strings.startQuiz}
                    </button>
                    {state.children.length === 0 ? (
                      <AccountLookup
                        strings={strings}
                        onToggle={openAccountLookup}
                      />
                    ) : null}
                  </form>
                ) : null}

                {state.quizIndex >= 0 && state.quizIndex < questions.length ? (
                  <div className="stack">
                    <div className="progress-row">
                      <strong>
                        {strings.question} {state.quizIndex + 1} {strings.of} {questions.length}
                      </strong>
                      <div className="progress-track">
                        <div
                          className="progress-bar"
                          style={{ width: `${((state.quizIndex + 1) / questions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <h3>{genderize(questions[state.quizIndex].prompt, state.childDraft.gender)}</h3>
                    <div className="stack">
                      {questions[state.quizIndex].options.map((option) => (
                        <button
                          key={`${questions[state.quizIndex].id}-${option.key}`}
                          className="answer"
                          type="button"
                          onClick={() => answerQuestion(option)}
                        >
                          <span className="answer__badge">{option.key}</span>
                          <span className="answer__text">{genderize(option.label, state.childDraft.gender)}</span>
                        </button>
                      ))}
                    </div>
                    {state.quizIndex > 0 ? (
                      <button className="button button-ghost" type="button" onClick={goBackQuestion}>
                        {strings.previousQuestion}
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {state.tieCandidates ? (
                  <div className="stack">
                    <p>Estoy viendo una mezcla entre dos patrones.</p>
                    <p>
                      <strong>De estas dos opciones, ¿cuál sientes que describe más a tu hijo en este momento?</strong>
                    </p>
                    {state.tieCandidates.map((code) => (
                      <button key={code} className="button button-secondary" type="button" onClick={() => chooseTieWinner(code)}>
                        {profileMap[code].name}
                      </button>
                    ))}
                  </div>
                ) : null}

                {resultCopy ? (
                  <div className="stack">
                    <div className="result-banner">
                      <p>Listo 💛</p>
                      <p>
                        {state.childDraft.name} {strings.childFitsProfile}
                      </p>
                      <h3>👉 {resultCopy.primaryName}</h3>
                      <p>{resultCopy.reassurance}</p>
                    </div>
                    <div className="content-block">
                      <p>{resultCopy.primaryDescription}</p>
                      <p>{resultCopy.framework}</p>
                    </div>
                    <button className="button button-primary" type="button" onClick={saveChildProfile}>
                      {strings.enterDashboard} {state.childDraft.name}
                    </button>
                  </div>
                ) : null}
              </article>
            </section>
          ) : (
            <section className="app-panel">

              {state.persistenceMessage && (state.activeSection === "home" || state.activeSection === "reports" || state.activeSection === "routine") ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}

              {state.activeSection === "home" ? (
                <>
                  {/* Hero cards — one per child */}
                  {state.children.map((child) => {
                    const sortedLogs = [...(child.logs || [])].filter(l => l.date).sort((a,b) => a.date < b.date ? 1 : -1);
                    const lastLog = sortedLogs[0];
                    const lastNightHours = lastLog ? calculateTotalSleepHours(lastLog.sleepTime, lastLog.wakeTime, lastLog.napDuration) : null;
                    const sleepDebt = lastNightHours !== null ? calculateSleepDebt(lastNightHours, child.birthday) : 0;
                    const debtLabel = sleepDebt <= 0 ? "Al día" : sleepDebt < 1 ? "Baja" : sleepDebt < 3 ? "Moderada" : "Alta";
                    const debtColor = sleepDebt <= 0 ? "var(--green)" : sleepDebt < 1 ? "var(--moon)" : "var(--coral)";
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                    const recentLogs = sortedLogs.filter(l => l.date >= weekAgo);
                    const avgLatency = recentLogs.length ? Math.round(recentLogs.reduce((s, l) => s + (l.latency || 0), 0) / recentLogs.length) : null;
                    const highDebtNights = sortedLogs.slice(0, 3).filter(l => calculateSleepDebt(calculateTotalSleepHours(l.sleepTime, l.wakeTime, l.napDuration), child.birthday) >= 1).length;
                    return (
                      <article key={child.id} style={{ background: "linear-gradient(150deg, #2B2342 0%, #1F2A47 55%, #1A2C3D 100%)", border: "1px solid var(--border)", borderRadius: 22, padding: "22px 22px 20px", position: "relative", overflow: "hidden", color: "var(--ink)" }}>
                        <div style={{ position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,231,178,.2), transparent 70%)" }} />
                        <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--moon)", fontWeight: 700, marginBottom: 4 }}>Hora ideal para dormir hoy</div>
                        <div style={{ fontSize: 12, color: "rgba(255,248,239,.5)", marginBottom: 4, fontWeight: 600 }}>{child.name}</div>
                        {child.sleepGoal ? (
                          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "clamp(2.4rem,12vw,3.6rem)", fontWeight: 600, lineHeight: 1, marginBottom: 6 }}>{child.sleepGoal}</div>
                        ) : (
                          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "clamp(1.2rem,5vw,1.6rem)", fontWeight: 600, lineHeight: 1.2, marginBottom: 6, color: "var(--ink-soft)" }}>Configura la hora en el perfil</div>
                        )}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${debtColor}22`, color: debtColor, border: `1px solid ${debtColor}44`, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: debtColor, display: "inline-block" }} />
                            Deuda de sueño: {debtLabel}
                          </div>
                          {recentLogs.length > 0 ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,248,239,.08)", color: "rgba(255,248,239,.7)", border: "1px solid rgba(255,248,239,.15)", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                              🌙 {recentLogs.length} noche{recentLogs.length !== 1 ? "s" : ""} esta semana
                            </div>
                          ) : null}
                          {avgLatency !== null ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,248,239,.08)", color: "rgba(255,248,239,.7)", border: "1px solid rgba(255,248,239,.15)", padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                              ⏱ Latencia prom: {avgLatency} min
                            </div>
                          ) : null}
                        </div>
                        {highDebtNights >= 2 ? (
                          <div style={{ background: "rgba(255,107,107,.15)", border: "1px solid rgba(255,107,107,.3)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "var(--coral)", marginBottom: 14 }}>
                            ⚠️ {child.name} acumula deuda de sueño. Adelanta la hora de dormir 15–20 min esta semana.
                          </div>
                        ) : null}
                        <button className="button button-primary" type="button" style={{ width: "100%" }} onClick={() => requestRoutine(child.id)}>
                          🌙 Generar Rutina personalizada
                        </button>
                      </article>
                    );
                  })}
                </>
              ) : null}

              {state.activeSection === "reports" ? (
                <ChildHomeGrid
                  children={state.children}
                  activeChildId={state.activeChildId}
                  expandedChildId={state.expandedChildId}
                  canAddChild={canAddChild}
                  strings={strings}
                  language={state.language}
                  profileMap={profileMap}
                  parentName={state.parentName}
                  parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
                  mode="reports"
                  onToggleChild={(childId) =>
                    setState((current) => ({
                      ...current,
                      activeChildId: childId,
                      expandedChildId: current.expandedChildId === childId ? "" : childId,
                    }))
                  }
                  onCreateRoutine={(childId) =>
                    setState((current) => ({ ...current, activeChildId: childId, activeSection: "routine" }))
                  }
                  onEditProfile={(childId) => setState((current) => ({ ...current, editingChildId: childId }))}
                  onUpdateLog={updateSavedNightLog}
                  onUpdateActivityEnjoyment={updateActivityEnjoyment}
                  onAddChild={startAddChild}
                />
              ) : null}

              {state.activeSection === "child" ? (
                <ChildHomeGrid
                  children={state.children}
                  activeChildId={state.activeChildId}
                  expandedChildId={state.expandedChildId}
                  canAddChild={canAddChild}
                  strings={strings}
                  language={state.language}
                  profileMap={profileMap}
                  parentName={state.parentName}
                  parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
                  mode="child"
                  onToggleChild={(childId) =>
                    setState((current) => ({
                      ...current,
                      activeChildId: childId,
                      expandedChildId: current.expandedChildId === childId ? "" : childId,
                    }))
                  }
                  onCreateRoutine={(childId) => requestRoutine(childId)}
                  onEditProfile={(childId) => setState((current) => ({ ...current, editingChildId: childId }))}
                  onUpdateLog={updateSavedNightLog}
                  onUpdateActivityEnjoyment={updateActivityEnjoyment}
                  onAddChild={startAddChild}
                />
              ) : null}

              {state.activeSection === "routine" ? (
                <>
                  {/* Segmented control — Esta noche is primary, rest are secondary */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    <button type="button" onClick={() => setState(cur => ({ ...cur, routineSubTab: "tonight" }))}
                      style={{ width: "100%", textAlign: "center", padding: "12px", borderRadius: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none",
                        background: state.routineSubTab === "tonight" ? "var(--moon)" : "var(--navy-800)",
                        color: state.routineSubTab === "tonight" ? "var(--navy-950)" : "var(--ink-soft)",
                        borderColor: "var(--border)", borderWidth: 1, borderStyle: "solid" }}>
                      🌙 Generar Rutina personalizada
                    </button>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[["facilitar", "Facilitar"], ["evitar", "Evitar"], ["alimentos", "Alimentos"]].map(([id, label]) => (
                        <button key={id} type="button" onClick={() => setState(cur => ({ ...cur, routineSubTab: id }))}
                          style={{ flex: 1, textAlign: "center", padding: "7px 4px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)",
                            background: state.routineSubTab === id ? "var(--navy-700)" : "transparent",
                            color: state.routineSubTab === id ? "var(--cream)" : "var(--ink-soft)" }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {state.routineSubTab === "tonight" ? <RoutineErrorBoundary onReset={() => setState((c) => ({ ...c, currentPlan: null, routinePreviewOpen: false }))}><RoutineSection
                  activeChild={activeChild}
                  allChildren={state.children.filter(c => c.primaryProfile)}
                  onSelectRoutineChild={(childId) => requestRoutine(childId)}
                  strings={strings}
                  profileMap={profileMap}
                  routineForm={state.routineForm}
                  currentPlan={state.currentPlan}
                  routinePreviewOpen={state.routinePreviewOpen}
                  routineSession={state.routineSession}
                  onRoutineFieldChange={updateRoutineField}
                  onGenerateRoutine={generateRoutine}
                  onClose={() =>
                    setState((current) => ({
                      ...current,
                      activeSection: "reports",
                      expandedChildId: activeChild?.id || current.expandedChildId,
                      savedLogDate: "",
                    }))
                  }
                  onClosePreview={() => setState((current) => ({ ...current, routinePreviewOpen: false }))}
                  onRoutineSessionChange={(patch) =>
                    setState((current) => ({
                      ...current,
                      routineSession: { ...current.routineSession, ...patch },
                    }))
                  }
                  onChangeActivity={changeActivity}
                  expandedSwapStep={state.expandedSwapStep}
                  onToggleSwapStep={(stepId) =>
                    setState((current) => ({
                      ...current,
                      expandedSwapStep: current.expandedSwapStep === stepId ? "" : stepId,
                    }))
                  }
                  onSubmitNightLog={submitNightLog}
                  onSaveGuidedRoutine={saveGuidedRoutineLog}
                  safetyTriggered={safetyTriggered}
                  savedLogDate={state.savedLogDate}
                  /></RoutineErrorBoundary> : null}
                  {state.routineSubTab === "facilitar" ? <SleepAreaSection activeChild={activeChild} strings={strings} onBack={null} checkedCount={checkedCount} sleepAreaResult={sleepAreaResult} onToggleCheck={(checkId) => updateChild(activeChild?.id, (child) => ({ sleepAreaChecks: { ...child.sleepAreaChecks, [checkId]: !child.sleepAreaChecks?.[checkId] } }))} /> : null}
                  {state.routineSubTab === "evitar" ? <AvoidSection strings={strings} language={state.language} onBack={null} /> : null}
                  {state.routineSubTab === "alimentos" ? <FoodsSection strings={strings} onBack={null} /> : null}
                </>
              ) : null}

              {state.activeSection === "sleep" ? (
                <SleepTrackerSection
                  strings={strings}
                  activeChild={activeChild}
                  timer={state.quickSleepTimer}
                  onStart={startQuickSleepTimer}
                  onStop={stopQuickSleepTimer}
                />
              ) : null}

              {state.activeSection === "settings" ? (
                <ParentSettingsSection
                  strings={strings}
                  parentName={state.parentName}
                  parentLastName={state.parentLastName}
                  parentEmail={state.parentEmail}
                  parentPhotoUrl={state.parentPhotoUrl}
                  hasPremiumAccess={hasPremiumAccess}
                  language={state.language}
                  userEmail={state.verifiedEmail || state.parentEmail}
                  cancelFeedbackCount={state.cancelFeedbackCount}
                  onChange={(field, value) => setState((current) => ({ ...current, [field]: value }))}
                  onSave={saveParentSettings}
                  onUpgrade={() => setState((current) => ({ ...current, showPaywall: true }))}
                  onCancelSubscription={() => setState((current) => ({ ...current, showCancellationModal: true }))}
                />
              ) : null}

              {state.activeSection === "videos" ? <VideoSection activeChild={activeChild} strings={strings} locked={!hasPremiumAccess} /> : null}

              {state.activeSection === "tips" ? (
                <TipsSection
                  strings={strings}
                  language={state.language}
                  onOpen={handleMainMenu}
                  locked={!hasPremiumAccess}
                />
              ) : null}

              {state.activeSection === "sleep-area" ? (
                <SleepAreaSection
                  activeChild={activeChild}
                  strings={strings}
                  onBack={() => setState((current) => ({ ...current, activeSection: "tips" }))}
                  checkedCount={checkedCount}
                  sleepAreaResult={sleepAreaResult}
                  onToggleCheck={(checkId) =>
                    updateChild(activeChild.id, (child) => ({
                      sleepAreaChecks: {
                        ...child.sleepAreaChecks,
                        [checkId]: !child.sleepAreaChecks?.[checkId],
                      },
                    }))
                  }
                />
              ) : null}

              {state.activeSection === "avoid" ? (
                <AvoidSection strings={strings} language={state.language} onBack={() => setState((current) => ({ ...current, activeSection: "tips" }))} />
              ) : null}

              {state.activeSection === "foods" ? (
                <FoodsSection strings={strings} onBack={() => setState((current) => ({ ...current, activeSection: "tips" }))} />
              ) : null}

              {state.activeSection === "wins" ? (
                <WinsSection
                  activeChild={activeChild}
                  strings={strings}
                  language={state.language}
                  parentName={state.parentName}
                  parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
                  parentPhotoUrl={state.parentPhotoUrl}
                />
              ) : null}

              {state.activeSection === "contact" ? (
                <ContactSection
                  strings={strings}
                  language={state.language}
                  activeChild={activeChild}
                  parentName={state.parentName}
                  parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
                />
              ) : null}

              {state.activeSection === "admin" ? (
                <AdminSection
                  strings={strings}
                  language={state.language}
                  onHome={() => setState((current) => ({ ...current, activeSection: "home" }))}
                />
              ) : null}
            </section>
          )}

          <BottomAppNav options={bottomMenuOptions} activeSection={state.activeSection} onSelect={handleMainMenu} />
        </>
      )}
    </main>
  );
}

function TopActions({ strings, showPremium }) {
  return (
    <div className="top-actions">
      <span className="support-label">{strings.needHelp}</span>
      {showPremium ? (
        <a className="button button-primary button-link top-action" href={SALES_FUNNEL_URL}>
          {strings.unlockPremium}
        </a>
      ) : null}
      {AMAZON_STORE_URL ? (
        <a className="button button-secondary button-link top-action" href={AMAZON_STORE_URL}>
          {strings.productsWeLove}
        </a>
      ) : (
        <button className="button button-secondary top-action" type="button" disabled title="Add your Amazon storefront URL here">
          {strings.productsWeLove}
        </button>
      )}
      <a className="button button-ghost button-link top-action" href={SUPPORT_WHATSAPP_URL}>
        {strings.whatsapp}
      </a>
      <a className="button button-ghost button-link top-action" href={`mailto:${SUPPORT_EMAIL}`}>
        {strings.emailSupport}
      </a>
    </div>
  );
}

function SectionNav({ options, activeSection, onSelect }) {
  return (
    <nav className="section-tabs app-section-tabs" aria-label="Secciones principales">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={activeSection === option.id ? "section-tab is-active" : "section-tab"}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </button>
      ))}
    </nav>
  );
}

function AppTopBar({
  activeChild,
  children,
  strings,
  onSelectChild,
  onAddChild,
  onOpenMessages,
  onOpenSettings,
}) {
  const avatarMap = { owl: "🦉", fox: "🦊", bear: "🐻", cat: "🐱", bunny: "🐰" };
  const avatar = activeChild?.avatar ? avatarMap[activeChild.avatar] : null;

  return (
    <header style={{ background: "var(--navy-950)", borderBottom: "1px solid var(--border)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Main bar */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", alignItems: "center", gap: 8, padding: "10px 14px" }}>

        {/* Child switcher pill */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--navy-800)", border: "1px solid var(--border)",
            padding: "6px 12px", borderRadius: 30, pointerEvents: "none",
            position: "absolute", inset: 0, zIndex: 1
          }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
              {activeChild?.name || "Niño"}
            </span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "rgba(255,248,239,.5)", flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <select
            value={activeChild?.id || ""}
            onChange={(e) => e.target.value === "add" ? onAddChild() : onSelectChild(e.target.value)}
            aria-label="Seleccionar niño"
            style={{ opacity: 0, position: "relative", zIndex: 2, width: "100%", minHeight: 44, cursor: "pointer" }}
          >
            {children.length ? children.map((c) => (
              <option key={c.id} value={c.id}>{c.name || "Niño"}</option>
            )) : <option value="">Niño</option>}
            <option value="add">+ Agregar niño</option>
          </select>
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: ".02em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--moon)" }}>BUENAS</span>
            {" "}
            <span style={{ color: "var(--aqua)" }}>NOCHES</span>
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
          <button onClick={onAddChild} aria-label="Agregar niño" style={{
            width: 32, height: 32, borderRadius: "50%", background: "var(--navy-800)",
            border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--ink-soft)", fontSize: 16, cursor: "pointer"
          }}>+</button>
          <button onClick={onOpenMessages} aria-label="Mensajes" style={{
            width: 32, height: 32, borderRadius: "50%", background: "var(--navy-800)",
            border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--ink-soft)", fontSize: 14, cursor: "pointer"
          }}>✉</button>
          <button onClick={onOpenSettings} aria-label="Configuración" style={{
            width: 32, height: 32, borderRadius: "50%", background: "var(--navy-800)",
            border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--ink-soft)", fontSize: 14, cursor: "pointer"
          }}>⚙</button>
        </div>
      </div>

    </header>
  );
}

function NavIcon({ id }) {
  const s = { width: 20, height: 20, display: "block" };
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "home") return <svg viewBox="0 0 24 24" style={s}><path {...p} d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" /></svg>;
  if (id === "reports") return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M3 13h2v8H3v-8Zm5-5h2v13H8V8Zm5-4h2v17h-2V4Zm5 6h2v11h-2v-11Z" /></svg>;
  if (id === "routine") return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>;
  if (id === "child") return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="7" r="4" {...p} /><path {...p} d="M5.5 21c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" /></svg>;
  if (id === "videos") return <svg viewBox="0 0 24 24" style={s}><path {...p} d="m15 10 4.55-2.55A1 1 0 0 1 21 8.39v7.22a1 1 0 0 1-1.45.9L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" /></svg>;
  if (id === "purchase") return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>;
  return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>;
}

function BottomAppNav({ options, activeSection, onSelect }) {
  return (
    <nav className="bottom-app-nav" aria-label="Navegación principal">
      {options.map((option) => {
        const active = activeSection === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={active ? "bottom-app-nav__item is-active" : "bottom-app-nav__item"}
            onClick={() => onSelect(option.id)}
          >
            <span style={{ position: "relative", display: "inline-flex" }}>
              <NavIcon id={option.id} />
              {option.badge > 0 && (
                <span style={{
                  position: "absolute", top: -3, right: -5,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--coral)", border: "1.5px solid var(--navy-950)",
                }} />
              )}
            </span>
            <small>{option.label}</small>
          </button>
        );
      })}
    </nav>
  );
}

function AccountLookup({ strings, onToggle }) {
  return (
    <div className="account-lookup">
      <button className="link-button" type="button" onClick={onToggle}>
        {strings.alreadyHaveAccount}
      </button>
    </div>
  );
}

function FreeAccountSetup({ strings, parentName, parentEmail, onChange, onSubmit, onAlreadyHaveAccount }) {
  return (
    <article className="card card--soft account-start-card">
      <div className="card-header">
        <span className="section-label">Buenas Noches</span>
        <h2>{strings.accountSetupTitle}</h2>
      </div>
      <form className="stack" onSubmit={onSubmit}>
        <label className="stack compact">
          <span>{strings.parentName}</span>
          <input
            type="text"
            value={parentName}
            onChange={(event) => onChange("parentName", event.target.value)}
            required
          />
        </label>
        <label className="stack compact">
          <span>{strings.parentEmail}</span>
          <input
            type="email"
            value={parentEmail}
            onChange={(event) => onChange("parentEmail", event.target.value)}
            required
          />
        </label>
        <button className="button button-primary" type="submit">
          Crear mi cuenta gratis
        </button>
        <button className="link-button account-start-link" type="button" onClick={onAlreadyHaveAccount}>
          {strings.alreadyHaveAccount}
        </button>
      </form>
    </article>
  );
}

function AccountLookupModal({ strings, email, status, message, onEmailChange, onSubmit, onClose }) {
  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label={strings.verifyEmailTitle}>
      <article className="profile-modal__panel card card--soft">
        <button className="routine-modal__close" type="button" onClick={onClose} aria-label={strings.close}>
          ×
        </button>
        <div className="card-header">
          <span className="section-label">{strings.alreadyHaveAccount}</span>
          <h2>{strings.welcomeBackTitle}</h2>
          <p className="muted">{strings.welcomeBackCopy}</p>
        </div>
        <div className="stack compact account-lookup__form">
          <label className="stack compact">
            <span>{strings.accountEmail}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSubmit(event);
                }
              }}
              placeholder="tuemail@ejemplo.com"
              required
              autoFocus
            />
          </label>
          {message ? (
            <p className={status === "not_found" || status === "error" ? "status-message status-warning" : "status-message status-success"}>
              {message}
            </p>
          ) : null}
          <button className="button button-primary" type="button" onClick={onSubmit} disabled={status === "loading"}>
            {status === "loading" ? strings.restoringAccount : strings.restoreAccount}
          </button>
        </div>
      </article>
    </div>
  );
}

function RatingPromptModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    fetch("/api/app-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, feedback }),
    }).catch(() => {});
    setSubmitted(true);
    if (rating >= 5) {
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.href.includes("app.quirokids.com")) {
          window.open("https://apps.apple.com/app/id/buenas-noches", "_blank");
        }
        onClose();
      }, 1500);
    } else {
      setTimeout(onClose, 2000);
    }
  }

  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Califica la app">
      <div className="profile-modal__panel card card--soft" style={{ maxWidth: 360 }}>
        <button className="routine-modal__close" type="button" onClick={onClose}>×</button>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{rating >= 5 ? "🌟" : "💙"}</div>
            <p style={{ fontWeight: 700 }}>{rating >= 5 ? "¡Gracias! Te llevamos a calificarnos." : "Gracias por tu honestidad. Lo tenemos en cuenta."}</p>
          </div>
        ) : (
          <form className="stack" onSubmit={handleSubmit}>
            <div className="card-header">
              <span className="section-label">¿Cómo vamos?</span>
              <h2>Llevas 7 noches usando Buenas Noches</h2>
            </div>
            <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>¿Cuántas estrellas le darías a la app?</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", fontSize: 36 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 36, padding: 0, color: (hovered || rating) >= star ? "var(--moon)" : "var(--border)" }}
                >★</button>
              ))}
            </div>
            {rating > 0 && rating < 5 ? (
              <label className="stack compact">
                <span>¿Qué necesitarías ver para darte 5 estrellas?</span>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tu opinión nos ayuda mucho..." style={{ minHeight: 80 }} />
              </label>
            ) : null}
            {rating > 0 ? (
              <button className="button button-primary" type="submit">
                {rating >= 5 ? "Calificar en el App Store ★" : "Enviar opinión"}
              </button>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

function NightWakingPrompt({ strings, logDate, onSubmit, onClose }) {
  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label={strings.wakingPromptTitle}>
      <article className="profile-modal__panel card card--soft">
        <button className="routine-modal__close" type="button" onClick={onClose} aria-label={strings.close}>
          ×
        </button>
        <div className="card-header">
          <span className="section-label">{logDate}</span>
          <h2>{strings.wakingPromptTitle}</h2>
          <p className="muted">{strings.wakingPromptCopy}</p>
        </div>
        <form className="stack" onSubmit={onSubmit}>
          <label className="stack compact">
            <span>{strings.wakeTime}</span>
            <input name="wakeTime" type="time" required />
          </label>
          <label className="stack compact">
            <span>{strings.nightWakings}</span>
            <select name="nightWakings" defaultValue="0">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3+">3+</option>
            </select>
          </label>
          <button className="button button-primary" type="submit">
            {strings.saveWakings}
          </button>
        </form>
      </article>
    </div>
  );
}

function getProfilePopupCopy(child, profileName) {
  const name = child.name || "Tu hijo";
  const gender = child.gender || "boy";
  const pronoun = childPronoun(gender);
  const article = childArticle(gender);
  const masculine = gender !== "girl";
  const tired = masculine ? "cansado" : "cansada";
  const asleep = masculine ? "dormido" : "dormida";
  const calm = masculine ? "calmarlo" : "calmarla";
  const difficult = masculine ? "difícil" : "difícil";

  const sharedCta = {
    cta: `Desbloquear la rutina de ${name} para ESTA NOCHE →`,
    price: "Precio fundador $147 USD · Pago único · Sin suscripción · Acceso de por vida",
  };

  const copyByProfile = {
    "El Incansable": {
      title: `${name} tiene el perfil de sueño: El Incansable`,
      paragraphs: [
        `A ${name} le cuesta apagar. No es terquedad, no es que no quiera dormir. Su sistema nervioso genuinamente no sabe cómo hacer la transición de la activación al descanso sin ayuda.`,
        `Por eso las noches se ven así: está ${tired} pero no para. Cuanto más ${article} intentas, más se activa. Y tú llevas horas intentando que se calme mientras sientes que estás haciendo algo mal, aunque no sabes exactamente qué.`,
        `No estás haciendo nada mal. Su sistema nervioso necesita una secuencia específica para bajar. Una que ninguna rutina genérica de internet puede darte, porque esa secuencia depende de ${name} específicamente.`,
        `Buenas Noches Premium calcula esa secuencia para esta noche. Basada en su perfil, su ventana de sueño, y la hora a la que quieres que esté ${asleep}.`,
      ],
      ...sharedCta,
    },
    "El Vigilante Nocturno": {
      title: `${name} tiene el perfil de sueño: El Vigilante Nocturno`,
      paragraphs: [
        `${name} se ve ${tired}. Tú sabes que está ${tired}. ${pronoun === "él" ? "Él" : "Ella"} probablemente también lo sabe. Y aun así, el sueño no llega.`,
        `No es que no quiera dormir. Es que su sistema nervioso está atrapado en un estado de alerta que no puede soltar solo. El cuerpo dice "descansa" pero algo más profundo dice "todavía no es seguro."`,
        `Por eso puedes apagar las luces, hacer silencio, hacer todo "bien", y seguir ahí cuarenta minutos después esperando que finalmente cierre los ojos.`,
        `Lo que ${name} necesita no es más calma en el ambiente. Necesita una secuencia que le indique a su sistema nervioso que es seguro soltar. Paso a paso, en el orden correcto, sin saltarse nada.`,
        "Buenas Noches Premium genera esa secuencia para esta noche.",
      ],
      ...sharedCta,
    },
    "El Negociador": {
      title: `${name} tiene el perfil de sueño: El Negociador`,
      paragraphs: [
        `Un cuento más. Agua. Un abrazo. La puerta entreabierta exactamente así. Revisar que el osito está en su lugar. Otra pregunta. Otro cuento.`,
        `${name} no está siendo ${difficult}. Está buscando conexión, porque su sistema nervioso no puede descansar hasta que ese vaso esté lleno. Y el problema es que a las 9 de la noche, después de un día entero, tú ya no tienes mucho que dar.`,
        `Así que negocias. Cedes. O te frustras. Y ninguna de las dos opciones termina bien la noche.`,
        `Lo que ${name} necesita es que la conexión llegue en el momento correcto de la rutina, en la dosis correcta, antes de que empiece a pedirla. Cuando eso sucede, el resto de la noche cambia completamente.`,
        "Buenas Noches Premium sabe exactamente cuándo y cómo dársela esta noche.",
      ],
      ...sharedCta,
    },
    "El Volcán Emocional": {
      title: `${name} tiene el perfil de sueño: El Volcán Emocional`,
      paragraphs: [
        `La hora de dormir desata algo. Llanto, rabietas, resistencia intensa, a veces sin razón aparente. Y cuanto más intentas ${calm}, más escala.`,
        `No es manipulación. No es mala conducta. Es un sistema nervioso con demasiada activación acumulada que no tiene manera de descargarse, y la hora de dormir es cuando ese límite explota.`,
        `El problema es que lo que instintivamente queremos hacer, calmar, contener, apresurar el proceso, es exactamente lo contrario de lo que su sistema nervioso necesita en ese momento.`,
        `${name} necesita descargar antes de poder descansar. Hay una secuencia precisa para hacer eso sin escalar la situación ni alargar la noche. Una que su cuerpo pueda seguir aunque esté en el pico de la activación.`,
        "Buenas Noches Premium la calcula para esta noche.",
      ],
      ...sharedCta,
    },
    "El Explorador Nocturno": {
      title: `${name} tiene el perfil de sueño: El Explorador Nocturno`,
      paragraphs: [
        `Se duerme fácil. Demasiado fácil a veces, en el sofá, en el coche, en cualquier lugar menos en su cama a la hora correcta. Y luego se despierta en mitad de la noche, o muy temprano, o simplemente no descansa aunque haya dormido las horas.`,
        `El sueño de ${name} parece ligero. Interrumpido. Como si nunca terminara de llegar a un descanso profundo.`,
        `Lo que está pasando es que su sistema nervioso está llegando al sueño sin haber completado el proceso de transición. Se desploma en lugar de descansar. Y eso tiene consecuencias en la calidad de lo que viene después.`,
        `La rutina de ${name} necesita preparar activamente ese descenso, no solo apagar las luces y esperar. Cuando el sistema nervioso llega al sueño habiendo completado cada paso, la calidad de esa noche cambia completamente.`,
        "Buenas Noches Premium genera esa secuencia para esta noche.",
      ],
      ...sharedCta,
    },
  };

  return copyByProfile[profileName] || {
    title: `${name} tiene el perfil de sueño: ${profileName}`,
    paragraphs: [
      `Este resultado te ayuda a entender qué necesita el sistema nervioso de ${name} para bajar revoluciones antes de dormir.`,
      `Buenas Noches Premium calcula una rutina para esta noche basada en su perfil, su ventana de sueño y tu meta de horario.`,
    ],
    ...sharedCta,
  };
}

function ProfileIntroModal({ child, profileMap, language, onClose }) {
  if (!child) return null;
  const profile = profileMap[child.primaryProfile];
  const profileName = profile?.name || child.primaryProfile;
  const popupCopy = getProfilePopupCopy(child, profileName);

  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Perfil de sueño">
      <article className="profile-modal__panel card card--feature profile-intro-card">
        <button className="routine-modal__close" type="button" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <span className="section-label">{language === "es" ? "Perfil de sueño" : "Sleep profile"}</span>
        <h2>{popupCopy.title}</h2>
        <div className="profile-intro-copy">
          {popupCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="profile-intro-cta">
          <a className="button button-primary button-link" href={SALES_FUNNEL_URL}>
            {popupCopy.cta}
          </a>
          <p>{popupCopy.price}</p>
        </div>
        <button className="button button-ghost" type="button" onClick={onClose}>
          {language === "es" ? "Explorar la app" : "Explore the app"}
        </button>
      </article>
    </div>
  );
}

function HomeQuickCards({ strings, activeChild, onOpenRoutine, onOpenSleep, onOpenTips, onOpenWins }) {
  const cards = [
    {
      onClick: onOpenRoutine,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ),
      iconBg: "rgba(244,231,178,.15)",
      iconColor: "var(--moon)",
      label: strings.sections.routine,
      sub: "Generar rutina para hoy",
      accent: "var(--moon)",
      featured: true,
    },
    {
      onClick: onOpenSleep,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      iconBg: "rgba(158,207,210,.15)",
      iconColor: "var(--aqua)",
      label: strings.sleepTracker,
      sub: "Registrar cuánto tarda en dormir",
      accent: "var(--aqua)",
    },
    {
      onClick: onOpenTips,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
        </svg>
      ),
      iconBg: "rgba(143,190,158,.15)",
      iconColor: "var(--green)",
      label: strings.sections.tips,
      sub: "Ideas rápidas para mejorar la noche",
      accent: "var(--green)",
    },
    {
      onClick: onOpenWins,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
      iconBg: "rgba(217,150,140,.15)",
      iconColor: "var(--coral)",
      label: strings.publicWinsWall,
      sub: "Celebrar avances",
      accent: "var(--coral)",
    },
  ];

  return (
    <section>
      {activeChild && (
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 14 }}>
          Buenas noches · <strong style={{ color: "var(--ink)" }}>{activeChild.name}</strong>
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
        {cards.map((card, i) => (
          <button
            key={i}
            type="button"
            onClick={card.onClick}
            style={{
              minHeight: card.featured ? 170 : 150,
              display: "grid",
              alignContent: "end",
              gap: 8,
              padding: 18,
              textAlign: "left",
              borderRadius: 22,
              background: card.featured
                ? `linear-gradient(145deg, rgba(40,57,78,.98), rgba(45,65,90,.96))`
                : "var(--navy-800)",
              border: card.featured
                ? `1px solid rgba(244,231,178,.2)`
                : "1px solid var(--border)",
              color: "var(--ink)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {card.featured && (
              <div style={{
                position: "absolute", right: -20, top: -20,
                width: 100, height: 100, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(244,231,178,.18), transparent 70%)`
              }} />
            )}
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: card.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: card.iconColor, position: "relative"
            }}>
              {card.icon}
            </div>
            <strong style={{ fontSize: "1.05rem", fontFamily: "'Baloo 2', sans-serif", color: card.featured ? "var(--ink)" : "var(--ink)" }}>
              {card.label}
            </strong>
            <small style={{ color: "var(--ink-soft)", fontWeight: 600, fontSize: "0.78rem", lineHeight: 1.4 }}>
              {card.sub}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

function SleepTrackerSection({ strings, activeChild, timer, onStart, onStop }) {
  const [now, setNow] = useState(Date.now());
  const timerType = timer.type || "night";
  const isNapMode = timerType === "nap";

  useEffect(() => {
    if (!timer.running) return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [timer.running]);

  function getElapsedSeconds() {
    if (!timer.startedAt) return 0;
    const [hours = 0, minutes = 0] = timer.startedAt.split(":").map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    if (start.getTime() > now) start.setDate(start.getDate() - 1);
    return Math.max(0, Math.floor((now - start.getTime()) / 1000));
  }

  if (!activeChild) {
    return (
      <article className="card card--soft">
        <h2>{strings.sleepTracker}</h2>
        <p className="muted">Primero crea el perfil de tu hijo para registrar sus noches.</p>
      </article>
    );
  }

  return (
    <article className="sleep-timer-panel">
      <header className="sleep-timer-topbar">
        <span>{isNapMode ? "Registrar siesta" : "Registrar sueño"}</span>
        <strong>{activeChild.name}</strong>
      </header>
      <div className="sleep-timer-row">
        <span>{isNapMode ? "Inicio siesta" : "Inicio"}</span>
        <strong>{timer.startedAt ? `Hoy, ${timer.startedAt}` : "--:--"}</strong>
      </div>
      <div className="sleep-timer-row">
        <span>{isNapMode ? "Fin siesta" : "Se durmió"}</span>
        <strong>{timer.running ? "En curso" : "--:--"}</strong>
      </div>
      <div className="sleep-timer-clock" aria-live="polite">
        <strong>{formatElapsedTimer(getElapsedSeconds())}</strong>
        <span>
          <i>HORAS</i>
          <i>MIN</i>
          <i>SEG</i>
        </span>
      </div>
      <div className="sleep-timer-actions">
        <button
          className="sleep-timer-orb"
          type="button"
          onClick={() => (timer.running ? onStop() : onStart("night"))}
          aria-label={timer.running ? "Guardar sueño" : "Iniciar sueño"}
        >
          <span>{timer.running ? "Guardar" : "▶"}</span>
          <strong>{timer.running ? "SAVE" : "START"}</strong>
        </button>
      </div>
      {activeChild.takesNap === "yes" ? (
        <div className="sleep-timer-secondary-actions">
          <button className="button button-ghost" type="button" onClick={() => onStart("nap")} disabled={timer.running}>
            Registrar siesta
          </button>
        </div>
      ) : null}
      <p className="muted">
        {isNapMode
          ? "La siesta se guardará en el mismo día que el sueño nocturno."
          : "Presiona iniciar cuando esté en cama y guardar cuando se quede dormido."}
      </p>
    </article>
  );
}

const CANCEL_REASONS = [
  "No lo uso",
  "No funcionó",
  "No me gusta la app",
  "Muy caro",
  "Otro",
];

function CancellationModal({ isFirstCancel, userEmail, onClose, onCancelComplete }) {
  const [step, setStep] = useState("feedback"); // "feedback" | "offer" | "thankyou"
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const finalReason = reason === "Otro" ? `Otro: ${otherText}` : reason;
    try {
      await fetch("/api/cancellation-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, reason: finalReason, suggestions, isFirstCancel }),
      });
    } catch {
      // non-blocking
    }
    setSubmitting(false);

    if (isFirstCancel && suggestions.trim()) {
      setStep("offer");
    } else {
      setStep("thankyou");
    }
  }

  function openAppStoreSubscriptions() {
    const url = "https://apps.apple.com/account/subscriptions";
    if (typeof window !== "undefined") window.open(url, "_blank");
  }

  const overlay = { position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10,8,20,.85)", display: "flex", alignItems: "flex-end", justifyContent: "center" };
  const sheet = { background: "var(--navy-800)", borderRadius: "20px 20px 0 0", padding: "28px 20px 40px", width: "100%", maxWidth: 480 };

  if (step === "offer") {
    return (
      <div style={overlay}>
        <div style={sheet}>
          <div style={{ fontSize: 40, marginBottom: 12, textAlign: "center" }}>🎁</div>
          <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 18, color: "var(--cream)" }}>¡Gracias por tus sugerencias!</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
            Nos ayudan a mejorar la app. Como agradecimiento, te regalamos un mes gratis.
          </p>
          <button className="button button-primary" type="button" style={{ width: "100%", marginBottom: 14 }}
            onClick={() => { onCancelComplete(true); onClose(); }}>
            Aceptar mi mes gratis
          </button>
          <div style={{ textAlign: "center" }}>
            <button type="button"
              style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { openAppStoreSubscriptions(); onCancelComplete(false); onClose(); }}>
              No, gracias — cancelar igual
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "thankyou") {
    return (
      <div style={overlay}>
        <div style={sheet}>
          <div style={{ fontSize: 40, marginBottom: 12, textAlign: "center" }}>💜</div>
          <h2 style={{ textAlign: "center", marginBottom: 8, fontSize: 18, color: "var(--cream)" }}>Gracias por tu tiempo con nosotros</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
            {isFirstCancel
              ? "Gracias por tus comentarios. Si cambias de opinión, aquí estaremos."
              : "Gracias por tu retroalimentación. Estamos aquí si nos necesitas en el futuro."}
          </p>
          <button className="button button-secondary" type="button" style={{ width: "100%", marginBottom: 14 }}
            onClick={() => { openAppStoreSubscriptions(); onCancelComplete(false); onClose(); }}>
            Ir al App Store para cancelar
          </button>
          <button type="button" className="button" style={{ width: "100%", background: "transparent", color: "var(--ink-soft)", fontSize: 13 }}
            onClick={onClose}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <div style={{ ...sheet, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, color: "var(--cream)", margin: 0 }}>Cancelar suscripción</h2>
          <button type="button" onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: 14, marginBottom: 16 }}>
          Nos apena verte ir. ¿Puedes contarnos por qué?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {CANCEL_REASONS.map((r) => (
            <button key={r} type="button"
              onClick={() => setReason(r)}
              style={{
                textAlign: "left", padding: "12px 14px", borderRadius: 10, cursor: "pointer", fontSize: 14,
                background: reason === r ? "rgba(244,231,178,.15)" : "var(--navy-900)",
                border: reason === r ? "1px solid rgba(244,231,178,.4)" : "1px solid var(--border)",
                color: reason === r ? "var(--moon)" : "var(--cream)",
              }}>
              {r}
            </button>
          ))}
        </div>
        {reason === "Otro" && (
          <textarea
            placeholder="Cuéntanos más..."
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            rows={2}
            style={{ width: "100%", marginBottom: 16, borderRadius: 10, padding: "10px 12px", background: "var(--navy-900)", border: "1px solid var(--border)", color: "var(--cream)", fontSize: 14, resize: "none", boxSizing: "border-box" }}
          />
        )}
        <label style={{ display: "block", fontSize: 13, color: "var(--ink-soft)", marginBottom: 6 }}>
          ¿Cómo podríamos mejorar la app? (opcional)
        </label>
        <textarea
          placeholder="Tus sugerencias nos ayudan a mejorar..."
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          rows={3}
          style={{ width: "100%", marginBottom: 20, borderRadius: 10, padding: "10px 12px", background: "var(--navy-900)", border: "1px solid var(--border)", color: "var(--cream)", fontSize: 14, resize: "none", boxSizing: "border-box" }}
        />
        <button className="button button-primary" type="button" style={{ width: "100%", marginBottom: 10 }}
          disabled={!reason || submitting}
          onClick={handleSubmit}>
          {submitting ? "Enviando..." : "Continuar"}
        </button>
        <button type="button" className="button" style={{ width: "100%", background: "transparent", color: "var(--ink-soft)", fontSize: 13 }}
          onClick={onClose}>
          Volver — mantener mi suscripción
        </button>
      </div>
    </div>
  );
}

function SubscriptionStatusCard({ hasPremiumAccess, language, userEmail, cancelFeedbackCount, onUpgrade, onCancelClick }) {
  const [subInfo, setSubInfo] = useState(undefined);

  useEffect(() => {
    if (!userEmail) return;
    if (typeof window === "undefined" || !window.Purchases) {
      setSubInfo(null);
      return;
    }
    window.Purchases.getSharedInstance()
      .getCustomerInfo()
      .then(({ customerInfo }) => {
        const active = customerInfo?.entitlements?.active?.["Premium Buenas Noches"];
        const product = customerInfo?.activeSubscriptions?.[0] || null;
        setSubInfo({ active: !!active, product, expirationDate: active?.expirationDate || null });
      })
      .catch(() => setSubInfo(null));
  }, [userEmail]);

  const isAnnual = subInfo?.product?.includes("anual");
  const expiresAt = subInfo?.expirationDate
    ? new Date(subInfo.expirationDate).toLocaleDateString(language === "en" ? "en-US" : "es-PE", { year: "numeric", month: "long", day: "numeric" })
    : null;

  if (!hasPremiumAccess) {
    return (
      <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🔓</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--cream)" }}>Plan Gratuito</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>Perfil de sueño + tips básicos</div>
          </div>
        </div>
        <button className="button button-primary" type="button" style={{ width: "100%", fontSize: 13 }} onClick={onUpgrade}>
          Desbloquear Premium
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, rgba(244,231,178,.12), rgba(244,231,178,.04))", border: "1px solid rgba(244,231,178,.3)", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>⭐</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--moon)" }}>
            {subInfo === undefined
              ? "Cargando..."
              : subInfo?.active
                ? (isAnnual ? "Plan Anual · Premium" : "Plan Mensual · Premium")
                : "Acceso Premium"}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            {expiresAt ? `Renueva: ${expiresAt}` : "Activo"}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 8, flexDirection: "column" }}>
        {!isAnnual ? (
          <button className="button button-primary" type="button" style={{ width: "100%", fontSize: 13 }} onClick={onUpgrade}>
            Cambiar a Plan Anual · Ahorra 30%
          </button>
        ) : null}
        <button type="button" onClick={onCancelClick}
          style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 12, cursor: "pointer", textDecoration: "underline", alignSelf: "center" }}>
          Cancelar suscripción
        </button>
      </div>
    </div>
  );
}

function ParentSettingsSection({ strings, parentName, parentLastName, parentEmail, parentPhotoUrl, hasPremiumAccess, language, userEmail, cancelFeedbackCount, onChange, onSave, onUpgrade, onCancelSubscription }) {
  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 420;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
        onChange("parentPhotoUrl", canvas.toDataURL("image/jpeg", 0.78));
      };
      image.onerror = () => onChange("parentPhotoUrl", String(reader.result || ""));
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  }

  return (
    <article className="card card--feature parent-settings-card">
      <div className="card-header">
        <span className="section-label">Cuenta</span>
        <h2>{strings.parentSettings}</h2>
      </div>
      <SubscriptionStatusCard
        hasPremiumAccess={hasPremiumAccess}
        language={language}
        userEmail={userEmail}
        cancelFeedbackCount={cancelFeedbackCount}
        onUpgrade={onUpgrade}
        onCancelClick={onCancelSubscription}
      />
      <form className="stack" onSubmit={onSave} style={{ marginTop: 20 }}>
        <label className="stack compact">
          <span>{strings.parentName}</span>
          <input type="text" value={parentName} onChange={(event) => onChange("parentName", event.target.value)} required />
        </label>
        <label className="stack compact">
          <span>{strings.parentLastName}</span>
          <input type="text" value={parentLastName} onChange={(event) => onChange("parentLastName", event.target.value)} required />
        </label>
        <label className="stack compact">
          <span>{strings.parentEmail}</span>
          <input type="email" value={parentEmail} onChange={(event) => onChange("parentEmail", event.target.value)} required />
        </label>
        <button className="button button-primary" type="submit">
          {strings.saveAccountSettings}
        </button>
      </form>
    </article>
  );
}

function SleepWindowModal({ strings, activeChild, onCalculated, onClose }) {
  const [wakeTime, setWakeTime] = useState("");
  const [napsCount, setNapsCount] = useState(activeChild?.takesNap === "yes" ? "1" : "0");
  const [result, setResult] = useState(null);
  const takesNap = activeChild?.takesNap === "yes";

  if (!activeChild) return null;

  function calculateWindow(event) {
    event.preventDefault();
    if (!wakeTime) return;
    setResult(calculateSleepWindow({ birthday: activeChild.birthday, wakeTime, napsCount: takesNap ? napsCount : "0" }));
    onCalculated?.();
  }

  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label={strings.sleepWindow}>
      <article className="profile-modal__panel card card--soft">
        <button className="routine-modal__close" type="button" onClick={onClose} aria-label={strings.close}>
          ×
        </button>
        <div className="card-header">
          <span className="section-label">{strings.sleepWindow}</span>
          <h2>{activeChild.name}</h2>
          <p className="muted">{strings.sleepWindowIntro}</p>
        </div>
        <form className="stack" onSubmit={calculateWindow}>
          <Stat label={strings.age} value={formatAgeLabel(activeChild.birthday, "es")} />
          <label className="stack compact">
            <span>{strings.wakeTime}</span>
            <input type="time" value={wakeTime} onChange={(event) => setWakeTime(event.target.value)} required />
          </label>
          {takesNap ? (
            <label className="stack compact">
              <span>{strings.napsCount}</span>
              <select value={napsCount} onChange={(event) => setNapsCount(event.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </label>
          ) : null}
          <button className="button button-primary" type="submit">
            {strings.calculate}
          </button>
        </form>
        {result ? (
          <div className="result-banner result-banner--light">
            <p>{strings.sleepWindowResult}</p>
            {result.firstNap ? <Stat label={strings.firstNapWindow} value={result.firstNap} /> : null}
            <Stat label={strings.nightSleepWindow} value={result.nightSleep} />
          </div>
        ) : null}
      </article>
    </div>
  );
}

function PremiumRoutineGate({ strings, hasProfile, hasSleepWindow, onGoProfile, onGoSleepWindow, onClose, onPurchaseClick }) {
  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Premium">
      <article className="profile-modal__panel card card--soft premium-steps-card">
        <button className="routine-modal__close" type="button" onClick={onClose} aria-label={strings.close}>
          ×
        </button>
        <span className="section-label">Premium</span>
        <h2>3 pasos para generar tu rutina y dormir más rápido hoy</h2>
        <button className={hasProfile ? "premium-step is-complete" : "premium-step"} type="button" onClick={onGoProfile}>
          <strong>1. Determinar el perfil de sueño de tu hijo</strong>
          <span>{hasProfile ? "Completado" : "Completar ahora"}</span>
        </button>
        <span className="premium-step-arrow">↓</span>
        <button className={hasSleepWindow ? "premium-step is-complete" : "premium-step"} type="button" onClick={onGoSleepWindow}>
          <strong>2. Calcular ventana de sueño hoy</strong>
          <span>{hasSleepWindow ? "Completado" : "Completar ahora"}</span>
        </button>
        <span className="premium-step-arrow">↓</span>
        <div className="premium-step is-locked">
          <strong>3. Generar rutina</strong>
          <span>Disponible solo para premium</span>
        </div>
        <a className="button button-primary button-link" href={SALES_FUNNEL_URL} onClick={onPurchaseClick}>
          {strings.unlockPremium}
        </a>
      </article>
    </div>
  );
}

function ChildHomeGrid({
  children,
  activeChildId,
  expandedChildId,
  canAddChild,
  strings,
  language,
  profileMap,
  parentName,
  parentEmail,
  mode = "child",
  onToggleChild,
  onCreateRoutine,
  onEditProfile,
  onUpdateLog,
  onUpdateActivityEnjoyment,
  onAddChild,
}) {
  return (
    <div className="child-strip child-strip--home">
      {children.map((child) => {
        const summary = buildProgressSummary(child.logs);
        const isExpanded = expandedChildId === child.id;
        const avatar = getProfileAvatar(child.primaryProfile);
        return (
          <div key={child.id} className={isExpanded ? "child-profile-shell is-expanded" : "child-profile-shell"}>
            {isExpanded ? (
              <HomeSection
                activeChild={child}
                progressSummary={summary}
                strings={strings}
                profileMap={profileMap}
                parentName={parentName}
                parentEmail={parentEmail}
                mode={mode}
                onCreateRoutine={() => onCreateRoutine(child.id)}
                onEditProfile={() => onEditProfile(child.id)}
                onUpdateLog={(event, originalDate) => onUpdateLog(event, child.id, originalDate)}
                onUpdateActivityEnjoyment={(logDate, rating, enjoyedValue) =>
                  onUpdateActivityEnjoyment?.(child.id, logDate, rating, enjoyedValue)
                }
                onCollapse={() => onToggleChild(child.id)}
                compact
              />
            ) : (
              <button
                type="button"
                className={activeChildId === child.id ? "child-card child-card--hero is-active" : "child-card child-card--hero"}
                onClick={() => onToggleChild(child.id)}
              >
                {avatar ? (
                  <img className="profile-animal profile-animal--card" src={avatar.src} alt={avatar.alt} />
                ) : null}
                <span className="section-label">{profileMap[child.primaryProfile]?.name || "Sin perfil"}</span>
                <strong>{child.name}</strong>
                <div className="child-card-meta">
                  <span>{formatAgeLabel(child.birthday, language)}</span>
                  <span>{childGenderLabel(child.gender, language)}</span>
                  <span>
                    {strings.sleepGoal}: {child.sleepGoal || "--:--"}
                  </span>
                </div>
                <small>
                  {summary.averageLatency
                    ? `${summary.averageLatency} min promedio`
                    : language === "es"
                      ? "Abrir perfil"
                      : "Open profile"}
                </small>
                <span className="expand-cue" aria-hidden="true">⌄</span>
              </button>
            )}
          </div>
        );
      })}

      {canAddChild ? (
        <button type="button" className="child-card child-card--ghost" onClick={onAddChild}>
          <strong>{strings.addAnotherChild}</strong>
          <span>{language === "es" ? "Crear otro perfil de sueño" : "Create another sleep profile"}</span>
        </button>
      ) : null}
    </div>
  );
}

function EditProfileModal({ activeChild, strings, onSave, onDelete, onClose }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!activeChild) return null;

  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label={`${strings.editProfile} ${activeChild.name}`}>
      <article className="profile-modal__panel card card--soft">
        <button className="routine-modal__close" type="button" onClick={onClose} aria-label={strings.close}>
          ×
        </button>
        <div className="card-header">
          <span className="section-label">{strings.editProfile}</span>
          <h2>
            {strings.editChildProfile} {activeChild.name}
          </h2>
        </div>
        <form className="stack" onSubmit={onSave}>
          <label className="stack compact">
            <span>{strings.childName}</span>
            <input name="childName" type="text" defaultValue={activeChild.name} required />
          </label>
          <label className="stack compact">
            <span>{strings.birthday}</span>
            <input name="birthday" type="date" defaultValue={activeChild.birthday} required />
          </label>
          <label className="stack compact">
            <span>{strings.gender}</span>
            <select name="gender" defaultValue={activeChild.gender || "boy"}>
              <option value="boy">{strings.boy}</option>
              <option value="girl">{strings.girl}</option>
            </select>
          </label>
          <label className="stack compact">
            <span>{strings.sleepGoal}</span>
            <input name="sleepGoal" type="time" defaultValue={activeChild.sleepGoal || ""} />
            <small className="field-help">{strings.language === "en" ? "E.g. 20:00 for 8 PM." : "Ej: 20:00 para las 8 PM. Si tu dispositivo usa 12 horas, ingresa la hora en formato 24 h."}</small>
          </label>
          <label className="stack compact">
            <span>{strings.napQuestion}</span>
            <select name="takesNap" defaultValue={activeChild.takesNap || "no"}>
              <option value="no">{strings.no}</option>
              <option value="yes">{strings.yes}</option>
            </select>
          </label>
          <div className="inline-actions">
            <button className="button button-primary" type="submit">
              {strings.saveProfile}
            </button>
            <button className="button button-ghost" type="button" onClick={onClose}>
              {strings.close}
            </button>
          </div>
        </form>
        <div className="delete-profile-zone">
          {!confirmDelete ? (
            <button className="button button-danger" type="button" onClick={() => setConfirmDelete(true)}>
              {strings.deleteProfile}
            </button>
          ) : (
            <div className="stack compact">
              <p className="status-message status-warning">{strings.deleteProfileConfirm}</p>
              <div className="inline-actions">
                <button className="button button-danger" type="button" onClick={onDelete}>
                  {strings.deleteProfile}
                </button>
                <button className="button button-ghost" type="button" onClick={() => setConfirmDelete(false)}>
                  {strings.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function addDateDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getSleepProgressMessage(logs, strings) {
  const recent = [...(logs || [])]
    .filter((log) => Number.isFinite(Number(log.latency)))
    .sort((left, right) => (left.date < right.date ? 1 : -1));

  if (recent.length >= 3 && recent.slice(0, 3).every((log) => Number(log.latency) <= 15)) {
    return { type: "review", text: strings.rateAppPrompt };
  }

  if (recent.length >= 4) {
    const latestTwo = recent.slice(0, 2);
    const previousTwo = recent.slice(2, 4);
    const latestAverage = latestTwo.reduce((sum, log) => sum + Number(log.latency), 0) / latestTwo.length;
    const previousAverage = previousTwo.reduce((sum, log) => sum + Number(log.latency), 0) / previousTwo.length;
    if (latestAverage <= previousAverage - 8) {
      return { type: "improved", text: strings.sleepImprovedCongrats };
    }
  }

  if (recent.length >= 3) {
    return { type: "consistent", text: strings.consistencyEncouragement };
  }

  return null;
}

function buildWeeklyProgressChart(logs, weekOffset = 0, child = null) {
  const today = new Date();
  const sortedLogs = [...(logs || [])].filter((log) => log.date).sort((left, right) => (left.date > right.date ? 1 : -1));
  const firstLogDate = sortedLogs[0]?.date ? new Date(`${sortedLogs[0].date}T00:00:00`) : today;
  const minimumSleepHours = child?.birthday ? getRecommendedSleepMinimumHours(child.birthday) : 9;
  const startDate = addDateDays(firstLogDate, weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDateDays(startDate, index);
    const dateKey = getDateKey(date);
    const log = logs.find((entry) => entry.date === dateKey);
    const totalSleepHours =
      Number.isFinite(Number(log?.totalSleepHours)) && Number(log?.totalSleepHours) > 0
        ? Number(log.totalSleepHours)
        : calculateTotalSleepHours(log?.sleepTime, log?.wakeTime, log?.napDuration);
    const sleepDebt = calculateSleepDebt(totalSleepHours, child?.birthday);
    return {
      dateKey,
      label: date.toLocaleDateString("es", { month: "numeric", day: "numeric" }),
      bedTime: log?.bedTime || "",
      routineEndTime: log?.routineEndTime || "",
      sleepTime: log?.sleepTime || "",
      latency: log ? Number(log.latency || 0) : null,
      wakings: log ? normalizeNightWakings(log.nightWakings) : 0,
      wakeTime: log?.wakeTime || "",
      napStart: log?.napStart || "",
      napEnd: log?.napEnd || "",
      napDuration: Number(log?.napDuration || 0),
      totalSleepHours,
      sleepDebt,
      meetsMinimumSleep: totalSleepHours !== null && totalSleepHours >= minimumSleepHours,
    };
  });

  const maxLatency = Math.max(45, ...days.map((day) => day.latency || 0));

  return {
    days,
    maxLatency,
    minimumSleepHours,
    empty: !logs.length,
    canGoForward: weekOffset < Math.max(0, Math.ceil((today - firstLogDate) / (7 * 24 * 60 * 60 * 1000))),
  };
}

function NightSleepTimelineChart({ days, onEditDay }) {
  const startMinute = timeToMinutes("00:00");
  const endMinute = timeToMinutes("23:59");
  const range = endMinute - startMinute;
  const hourLabels = ["23:59", "20:00", "16:00", "12:00", "08:00", "04:00", "00:00"];

  function getSegmentStyle(startValue, endValue) {
    if (!startValue || !endValue) return {};
    const start = Math.max(startMinute, Math.min(endMinute, timeToMinutes(startValue)));
    const end = Math.max(startMinute, Math.min(endMinute, timeToMinutes(endValue)));
    const top = 100 - ((Math.max(start, end) - startMinute) / range) * 100;
    const height = Math.max(3, (Math.abs(end - start) / range) * 100);
    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  }

  return (
    <div className="night-timeline-chart" aria-label="Tiempo en cama hasta quedarse dormido">
      <div className="night-timeline-axis">
        {hourLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="night-timeline-grid">
        {days.map((day) => (
          <div className="night-timeline-day" key={day.dateKey}>
            <div className="night-timeline-track">
              {day.bedTime && day.sleepTime ? (
                <button className="night-timeline-bar-stack" type="button" onClick={() => onEditDay?.(day.dateKey)}>
                  {day.routineEndTime ? (
                    <span
                      className="night-timeline-segment night-timeline-segment--routine"
                      style={getSegmentStyle(day.bedTime, day.routineEndTime)}
                    />
                  ) : null}
                  <span
                    className="night-timeline-segment night-timeline-segment--sleep"
                    style={getSegmentStyle(day.routineEndTime || day.bedTime, day.sleepTime)}
                  />
                  <span className="sr-only">{day.bedTime} → {day.routineEndTime || day.bedTime} → {day.sleepTime}</span>
                </button>
              ) : (
                <span className="night-timeline-empty" />
              )}
            </div>
            <strong>{day.label}</strong>
            <span className={day.totalSleepHours === null ? "sleep-hours-badge" : day.meetsMinimumSleep ? "sleep-hours-badge is-good" : "sleep-hours-badge is-low"}>
              {day.totalSleepHours === null ? "--h" : `${day.totalSleepHours}h`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeSection({
  activeChild,
  progressSummary,
  strings,
  profileMap,
  parentName,
  parentEmail,
  onCreateRoutine,
  onEditProfile,
  onUpdateLog,
  onUpdateActivityEnjoyment,
  onCollapse,
  mode = "child",
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImprovement, setReviewImprovement] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [editingLogDate, setEditingLogDate] = useState("");
  if (!activeChild) return null;
  const weeklyChart = buildWeeklyProgressChart(activeChild.logs || [], weekOffset, activeChild);
  const progressMessage = getSleepProgressMessage(activeChild.logs || [], strings);
  const profileName = profileMap[activeChild.primaryProfile]?.name || "Sin perfil";
  const profileDescription = profileMap[activeChild.primaryProfile]?.description || "";
  const avatar = getProfileAvatar(activeChild.primaryProfile);
  const editingLog = activeChild.logs?.find((log) => log.date === editingLogDate);
  const isReportsMode = mode === "reports";
  const lastLog = [...(activeChild.logs || [])].filter((log) => log.date).sort((left, right) => (left.date < right.date ? 1 : -1))[0] || null;
  const lastActivityRatings = (lastLog?.ratings || []).filter((rating) => rating?.activityId && rating?.activity);
  const lastNightHours =
    Number.isFinite(Number(lastLog?.totalSleepHours)) && Number(lastLog?.totalSleepHours) > 0
      ? Number(lastLog.totalSleepHours)
      : calculateTotalSleepHours(lastLog?.sleepTime, lastLog?.wakeTime, lastLog?.napDuration);
  const lastNightDebt = calculateSleepDebt(lastNightHours, activeChild.birthday);

  async function submitReview(event) {
    event.preventDefault();
    if (!reviewRating) return;

    setReviewStatus("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName,
          email: parentEmail,
          childName: activeChild.name,
          rating: reviewRating,
          comment: reviewComment,
          improvementFeedback: reviewImprovement,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude guardar la reseña.");
      }

      setReviewStatus(payload.public ? strings.reviewSavedPublic : strings.reviewSavedPrivate);
      setReviewComment("");
      setReviewImprovement("");
    } catch (error) {
      setReviewStatus(error.message || "No pude guardar la reseña.");
    }
  }

  const avgLatency = activeChild.logs?.length
    ? Math.round(activeChild.logs.filter(l => Number.isFinite(Number(l.latency))).reduce((s,l) => s + Number(l.latency), 0) / Math.max(activeChild.logs.filter(l => Number.isFinite(Number(l.latency))).length, 1))
    : null;
  const sortedLogs = [...(activeChild.logs || [])].filter(l => l.date).sort((a,b) => a.date < b.date ? 1 : -1);
  let streak = 0;
  for (let i = 0; i < sortedLogs.length; i++) {
    const d = new Date(sortedLogs[i].date);
    const expected = new Date(); expected.setDate(expected.getDate() - i);
    if (d.toISOString().slice(0,10) === expected.toISOString().slice(0,10)) streak++; else break;
  }

  return (
    <div className="dashboard-grid dashboard-grid--single">
      <article className="card card--feature dashboard-card dashboard-profile-card">
        {onCollapse ? (
          <button className="icon-button dashboard-collapse-button" type="button" onClick={onCollapse} aria-label="Cerrar dashboard">
            ⌃
          </button>
        ) : null}

        {/* Non-reports mode: profile-hero matching mockup */}
        {!isReportsMode ? (
          <>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}><b style={{ color: "var(--ink)", fontWeight: 600 }}>Nino</b> — perfil de sueno</p>
            <div style={{ textAlign: "center", padding: "6px 0 16px" }}>
              {/* Animated circular avatar */}
              <div style={{
                width: 128, height: 128, margin: "0 auto 14px", borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.4), rgba(244,231,178,.15) 70%)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                animation: "popIn .6s cubic-bezier(.2,.9,.3,1.3) both",
                boxShadow: "0 0 0 1.5px rgba(244,231,178,.3)",
              }}>
                <style>{`@keyframes popIn { 0%{transform:scale(.4);opacity:0} 70%{transform:scale(1.08);opacity:1} 100%{transform:scale(1)} }`}</style>
                {avatar ? (
                  <img src={avatar.src} alt={avatar.alt} style={{ width: "88%", height: "88%", objectFit: "contain", marginTop: "8%" }} />
                ) : (
                  <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 42, fontWeight: 700, color: "var(--moon)" }}>{activeChild.name?.[0] || "?"}</span>
                )}
              </div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 21, fontWeight: 600 }}>{activeChild.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 2 }}>{formatAgeLabel(activeChild.birthday, "es")}</div>
              <div style={{ display: "inline-block", marginTop: 10, background: "rgba(158,207,210,.16)", color: "var(--aqua)", fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 18 }}>
                {profileName}
              </div>
            </div>
            {/* 2-box stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 14px" }}>
              <div style={{ background: "var(--navy-700)", borderRadius: 12, padding: 13 }}>
                <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>Tiempo prom. en dormir</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600 }}>{avgLatency !== null && !isNaN(avgLatency) ? `${avgLatency} min` : "--"}</div>
              </div>
              <div style={{ background: "var(--navy-700)", borderRadius: 12, padding: 13 }}>
                <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>Racha de rutina</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600 }}>{streak} dias</div>
              </div>
            </div>
            {profileDescription ? <p style={{ fontSize: 12.5, color: "rgba(255,248,239,.75)", lineHeight: 1.65, marginBottom: 14 }}>{profileDescription}</p> : null}
            <button className="button button-ghost" type="button" onClick={onEditProfile} style={{ width: "100%", marginBottom: 8 }}>{strings.editProfile}</button>
          </>
        ) : (
          <>
            <header className="dashboard-profile-header">
              {avatar ? <img className="profile-animal profile-animal--dashboard" src={avatar.src} alt={avatar.alt} /> : null}
              <div className="dashboard-name-row">
                <h1>{activeChild.name}</h1>
              </div>
              <p>Perfil: {profileName}</p>
            </header>
            <div className="summary-grid">
              <Stat label={strings.age} value={formatAgeLabel(activeChild.birthday, strings.age === "Age" ? "en" : "es")} />
              <Stat label="Ultima noche" value={lastLog?.date || "--"} />
              <Stat label="A la cama" value={lastLog?.bedTime || "--:--"} />
              <Stat label="Tiempo para dormir" value={lastLog ? `${lastLog.latency || 0} min` : "--"} />
            </div>
          </>
        )}


        {isReportsMode ? (
        <section style={{ display: "grid", gap: 18 }}>
          {/* Sleep debt gauge */}
          {(() => {
            const weekDebt = weeklyChart.days.reduce((sum, d) => sum + (d.sleepDebt || 0), 0);
            const debtLevel = weekDebt <= 0 ? 0 : weekDebt < 2 ? 1 : weekDebt < 5 ? 2 : 3;
            const debtColors = ["var(--green)", "var(--moon)", "var(--coral)", "var(--coral)"];
            const debtLabels = ["Al día", "Baja", "Moderada", "Alta"];
            const debtMessages = [
              `${activeChild.name} debería estar regulada emocionalmente hoy.`,
              `Algo de deuda acumulada. Prioriza una noche completa esta semana.`,
              `Deuda moderada. El sueño de ${activeChild.name} merece atención esta semana.`,
              `Deuda alta. Considera ajustar horarios para recuperar el sueño.`,
            ];
            const markerPct = Math.min(96, debtLevel * 33);
            return (
              <article className="card card--feature" style={{ gap: 14 }}>
                <div className="card-header">
                  <h2>Deuda de sueño acumulada</h2>
                  <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                    {weeklyChart.empty ? "Guarda noches para ver tu deuda acumulada" : `Esta semana · ${weekDebt > 0 ? formatSleepDebt(weekDebt, "es") + " menos de lo recomendado" : "al día"}`}
                  </p>
                </div>
                <div style={{ height: 12, borderRadius: 8, background: "linear-gradient(90deg, var(--green), var(--moon), var(--coral))", position: "relative", margin: "8px 0 4px" }}>
                  <div style={{ position: "absolute", top: -5, left: `${markerPct}%`, width: 3, height: 22, background: "var(--ink)", borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--ink-soft)" }}>
                  <span>Al día</span><span>Moderada</span><span>Alta</span>
                </div>
                <div style={{ background: `${debtColors[debtLevel]}22`, color: debtColors[debtLevel], border: `1px solid ${debtColors[debtLevel]}44`, borderRadius: 10, padding: "10px 12px", fontSize: 12.5, lineHeight: 1.5, marginTop: 4 }}>
                  <strong>{debtLabels[debtLevel]}</strong> — {debtMessages[debtLevel]}
                </div>
              </article>
            );
          })()}

          {/* Sleep latency line chart — matches mockup: smooth curve, no dots, no x-labels, y-ticks only */}
          {(() => {
            const recentLogs = [...(activeChild.logs || [])]
              .filter(l => l.date && Number.isFinite(Number(l.latency)))
              .sort((a, b) => a.date < b.date ? -1 : 1)
              .slice(-14);
            const avg = recentLogs.length ? Math.round(recentLogs.reduce((s, l) => s + Number(l.latency), 0) / recentLogs.length) : null;
            const maxVal = recentLogs.length ? Math.max(...recentLogs.map(l => Number(l.latency)), 30) : 60;
            const W = 580, H = 130, PADL = 32, PADR = 8, PADT = 10, PADB = 10;
            const chartW = W - PADL - PADR;
            const chartH = H - PADT - PADB;

            const pts = recentLogs.map((l, i) => ({
              x: PADL + (i / Math.max(recentLogs.length - 1, 1)) * chartW,
              y: PADT + chartH - ((Number(l.latency) / maxVal) * chartH),
              v: Number(l.latency),
            }));

            // Smooth bezier path (tension ~0.35, matching Chart.js default)
            function smoothPath(points) {
              if (points.length < 2) return "";
              let d = `M${points[0].x},${points[0].y}`;
              for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i], p1 = points[i + 1];
                const cp1x = p0.x + (p1.x - p0.x) * 0.35;
                const cp2x = p1.x - (p1.x - p0.x) * 0.35;
                d += ` C${cp1x},${p0.y} ${cp2x},${p1.y} ${p1.x},${p1.y}`;
              }
              return d;
            }

            const linePath = pts.length > 1 ? smoothPath(pts) : null;
            const areaPath = linePath ? `${linePath} L${pts[pts.length-1].x},${PADT + chartH} L${pts[0].x},${PADT + chartH} Z` : null;

            // Y-axis ticks
            const yTicks = [0, 0.5, 1].map(t => ({
              y: PADT + chartH * (1 - t),
              label: Math.round(maxVal * t),
            }));

            return (
              <article className="card card--feature" style={{ gap: 14 }}>
                <div className="card-header">
                  <h2>Tiempo para dormir</h2>
                  <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                    {recentLogs.length > 0 ? `Ultimos ${recentLogs.length} registros · promedio ${avg} min` : "Aun no hay noches registradas"}
                  </p>
                </div>
                {recentLogs.length > 1 ? (
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
                    {/* Y-axis grid lines + tick labels */}
                    {yTicks.map((t, i) => (
                      <g key={i}>
                        <line x1={PADL} x2={W - PADR} y1={t.y} y2={t.y} stroke="rgba(247,244,238,.08)" strokeWidth="1" />
                        <text x={PADL - 5} y={t.y + 3} textAnchor="end" fill="rgba(247,244,238,.4)" fontSize="9" fontFamily="JetBrains Mono, monospace">{t.label}</text>
                      </g>
                    ))}
                    {/* Area fill */}
                    {areaPath && <path d={areaPath} fill="rgba(214,168,92,.14)" />}
                    {/* Smooth line — gold #D6A85C, no dots */}
                    {linePath && <path d={linePath} fill="none" stroke="#D6A85C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                ) : (
                  <p className="muted" style={{ textAlign: "center", padding: "20px 0" }}>
                    Guarda al menos 2 noches para ver el grafico de progreso.
                  </p>
                )}
                {/* Stat boxes */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "var(--navy-700)", borderRadius: 12, padding: 13 }}>
                    <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>Promedio</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 600 }}>{avg !== null ? `${avg} min` : "--"}</div>
                  </div>
                  <div style={{ background: "var(--navy-700)", borderRadius: 12, padding: 13 }}>
                    <div style={{ fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5 }}>Ultima noche</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 600 }}>{lastLog ? `${lastLog.latency} min` : "--"}</div>
                  </div>
                </div>
              </article>
            );
          })()}

          {/* Edit log if open */}
          {editingLog ? (
            <form
              className="edit-log-card"
              onSubmit={(event) => {
                onUpdateLog(event, editingLog.date);
                setEditingLogDate("");
              }}
            >
              <h3>Editar {editingLog.date}</h3>
              <label className="stack compact">
                <span>{strings.date}</span>
                <input name="date" type="date" defaultValue={editingLog.date} required />
              </label>
              <label className="stack compact">
                <span>{strings.routineStartTime}</span>
                <input name="routineStartTime" type="time" defaultValue={editingLog.routineStartTime || ""} />
              </label>
              <label className="stack compact">
                <span>Luces apagadas</span>
                <input name="routineEndTime" type="time" defaultValue={editingLog.routineEndTime || ""} />
              </label>
              <label className="stack compact">
                <span>{strings.bedTime}</span>
                <input name="bedTime" type="time" defaultValue={editingLog.bedTime} required />
              </label>
              <label className="stack compact">
                <span>{strings.sleepTime}</span>
                <input name="sleepTime" type="time" defaultValue={editingLog.sleepTime} required />
              </label>
              <label className="stack compact">
                <span>Hora de despertar</span>
                <input name="wakeTime" type="time" defaultValue={editingLog.wakeTime || ""} />
              </label>
              <label className="stack compact">
                <span>{strings.nightWakings}</span>
                <select name="nightWakings" defaultValue={editingLog.nightWakings || "0"}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </label>
              <label className="stack compact">
                <span>{strings.notes}</span>
                <textarea name="notes" defaultValue={editingLog.notes || ""} />
              </label>
              <div className="inline-actions">
                <button className="button button-primary" type="submit">
                  {strings.saveResults}
                </button>
                <button className="button button-ghost" type="button" onClick={() => setEditingLogDate("")}>
                  {strings.cancel}
                </button>
              </div>
            </form>
          ) : null}
        </section>
        ) : null}

        {isReportsMode && progressMessage ? (
          <div className={`progress-message progress-message--${progressMessage.type}`}>
            <p>{progressMessage.text}</p>
            {progressMessage.type === "review" ? (
              <button className="button button-secondary" type="button" onClick={() => setReviewOpen((open) => !open)}>
                {strings.rateApp}
              </button>
            ) : null}
            {reviewOpen ? (
              <form className="review-box" onSubmit={submitReview}>
                <div className="star-rating" aria-label="Calificación de la app">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={reviewRating >= star ? "is-selected" : ""}
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} estrellas`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Cuéntanos qué cambió para tu familia."
                />
                {reviewRating > 0 && reviewRating < 5 ? (
                  <label className="stack compact">
                    <span>{strings.reviewPrivateQuestion}</span>
                    <textarea
                      value={reviewImprovement}
                      onChange={(event) => setReviewImprovement(event.target.value)}
                      placeholder={strings.messagePlaceholder}
                    />
                  </label>
                ) : (
                  <p className="muted">{strings.reviewPublicNote}</p>
                )}
                {reviewStatus ? <p className="status-message status-success">{reviewStatus}</p> : null}
                <button className="button button-secondary" type="submit">
                  {strings.sendMessage}
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}

function getStepDurationSeconds(step) {
  if (!step?.start || !step?.end) return 180;
  const [startHour, startMinute] = step.start.split(":").map(Number);
  const [endHour, endMinute] = step.end.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  return Math.max(60, (end - start) * 60);
}

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatElapsedTimer(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(remainingSeconds).padStart(2, "0")}`;
}

function playTransitionTone(soundMode) {
  if (soundMode === "silent") return;
  try {
    const audio = new Audio(TRANSITION_SOUND_URL);
    audio.volume = 0.32;
    audio.play().catch(() => undefined);
  } catch {
    // Browsers may block audio until interaction; the routine still works silently.
  }
}

function startAmbientSound(soundMode, childProfile) {
  if (!soundMode || soundMode === "silent" || soundMode === "transition") return null;

  // Profile mode: play the child's 10-min track once, then loop the lullaby
  if (soundMode === "profile") {
    const profileKey = PROFILE_MUSIC_MAP[childProfile?.toLowerCase?.()];
    const profileUrl = profileKey ? profileMusicTracks[profileKey] : null;
    if (!profileUrl) return null;
    try {
      const profileAudio = new Audio(profileUrl);
      profileAudio.loop = false;
      profileAudio.volume = 0.34;
      let lullabyAudio = null;
      profileAudio.addEventListener("ended", () => {
        try {
          lullabyAudio = new Audio(LULLABY_URL);
          lullabyAudio.loop = true;
          lullabyAudio.volume = 0.34;
          lullabyAudio.play().catch(() => undefined);
        } catch {}
      });
      profileAudio.play().catch(() => undefined);
      return {
        stop() {
          profileAudio.pause();
          profileAudio.currentTime = 0;
          if (lullabyAudio) { lullabyAudio.pause(); lullabyAudio.currentTime = 0; }
        },
      };
    } catch {
      return null;
    }
  }

  const track = routineMusicTracks[soundMode];
  if (!track?.audioUrl) return null;

  try {
    const audio = new Audio(track.audioUrl);
    audio.loop = true;
    audio.volume = 0.34;
    audio.play().catch(() => undefined);
    return {
      stop() {
        audio.pause();
        audio.currentTime = 0;
      },
    };
  } catch {
    return null;
  }
}

class RoutineErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          <p style={{ color: "var(--ink-soft)", marginBottom: 16 }}>Ocurrió un error al cargar la rutina.</p>
          <button className="button button-primary" type="button"
            onClick={() => { this.setState({ error: null }); this.props.onReset?.(); }}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function RoutineSection({
  activeChild,
  allChildren = [],
  onSelectRoutineChild,
  strings,
  profileMap,
  routineForm,
  currentPlan,
  routinePreviewOpen,
  routineSession,
  onRoutineFieldChange,
  onGenerateRoutine,
  onClose,
  onClosePreview,
  onRoutineSessionChange,
  onChangeActivity,
  expandedSwapStep,
  onToggleSwapStep,
  onSubmitNightLog,
  onSaveGuidedRoutine,
  safetyTriggered,
  savedLogDate,
}) {
  const [routinePlayerOpen, setRoutinePlayerOpen] = useState(false);
  const [routineStepIndex, setRoutineStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [stepStartedAt, setStepStartedAt] = useState(0);
  const [pausedAt, setPausedAt] = useState(0);
  const [pausedTotalMs, setPausedTotalMs] = useState(0);
  const [extendedSeconds, setExtendedSeconds] = useState(0);
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [manualStartMs, setManualStartMs] = useState(0);
  const [manualInBedMs, setManualInBedMs] = useState(0);
  const hasPlayedEndToneRef = useRef(false);
  const ambientSoundRef = useRef(null);
  const wakeLockRef = useRef(null);
  const playerStep = currentPlan?.steps?.[routineStepIndex] || null;
  const playerStepVideos = getRoutineVideosForStep(playerStep, currentPlan?.profile);
  const activeMusicTrack = routineSession.soundMode === "profile"
    ? { label: "Música del perfil" }
    : (routineMusicTracks[routineSession.soundMode] || null);
  const isLastRoutineStep = currentPlan?.steps ? routineStepIndex >= currentPlan.steps.length - 1 : false;
  const untimedRoutinePhases = [
    "banarse_y_pijamas",
    "bano_tibio",
    "ponerse_pijama",
    "cepillarse_los_dientes",
    "ir_al_bano",
    "a_la_cama",
    "dormir",
    "limite_claro",
  ];
  const isManualRoutine = routineSession.timerMode === "manual";
  const isUntimedPlayerStep = playerStep ? isManualRoutine || untimedRoutinePhases.includes(playerStep.phaseKey) : false;
  const stepDurationSeconds = playerStep ? getStepDurationSeconds(playerStep) + extendedSeconds : 0;
  const livePausedMs = isPaused && pausedAt ? Math.max(0, timerNow - pausedAt) : 0;
  const elapsedSeconds =
    routinePlayerOpen && playerStep && stepStartedAt
      ? Math.max(0, Math.floor((timerNow - stepStartedAt - pausedTotalMs - livePausedMs) / 1000))
      : 0;
  const secondsLeft = playerStep ? Math.max(0, stepDurationSeconds - elapsedSeconds) : 0;

  useEffect(() => {
    if (!playerStep) return;
    setStepStartedAt(Date.now());
    setPausedAt(0);
    setPausedTotalMs(0);
    setExtendedSeconds(0);
    hasPlayedEndToneRef.current = false;
  }, [playerStep?.id]);

  useEffect(() => {
    const isManualActive = isManualRoutine && routinePlayerOpen && manualStartMs > 0 && !routineSession.fellAsleepAt;
    const isGuidedTimed = routinePlayerOpen && playerStep && !isUntimedPlayerStep;
    if (!isGuidedTimed && !isManualActive) return undefined;
    const timer = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [routinePlayerOpen, playerStep, isUntimedPlayerStep, isManualRoutine, manualStartMs, routineSession.fellAsleepAt]);

  useEffect(() => {
    function handleVisibilityChange() {
      setTimerNow(Date.now());
    }

    function handleFocus() {
      setTimerNow(Date.now());
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!routinePlayerOpen || isPaused || !playerStep || isUntimedPlayerStep) return;
    if (secondsLeft <= 0 && !hasPlayedEndToneRef.current) {
      playTransitionTone(routineSession.soundMode);
      hasPlayedEndToneRef.current = true;
    }
  }, [routinePlayerOpen, isPaused, playerStep, isUntimedPlayerStep, secondsLeft, routineSession.soundMode]);

  useEffect(() => {
    if (!savedLogDate) return undefined;
    const timer = window.setTimeout(() => {
      onClose();
    }, 2 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, [savedLogDate, onClose]);

  useEffect(() => {
    return () => {
      ambientSoundRef.current?.stop();
      ambientSoundRef.current = null;
      wakeLockRef.current?.release?.().catch?.(() => undefined);
      wakeLockRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncWakeLock() {
      const wakeLockApi = navigator?.wakeLock;
      if (!wakeLockApi?.request) return;

      if (routinePlayerOpen && !isPaused) {
        try {
          if (!wakeLockRef.current) {
            wakeLockRef.current = await wakeLockApi.request("screen");
            if (cancelled) {
              await wakeLockRef.current?.release?.();
              wakeLockRef.current = null;
            }
          }
        } catch {
          wakeLockRef.current = null;
        }
      } else if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch {
          // ignore release failures
        }
        wakeLockRef.current = null;
      }
    }

    syncWakeLock();
    return () => {
      cancelled = true;
    };
  }, [routinePlayerOpen, isPaused]);

  function stopAmbientSound() {
    ambientSoundRef.current?.stop();
    ambientSoundRef.current = null;
  }

  function restartAmbientSound(soundMode = routineSession.soundMode) {
    stopAmbientSound();
    ambientSoundRef.current = startAmbientSound(soundMode, activeChild?.primaryProfile);
  }

  if (!activeChild) return null;
  const idealSleepWindow =
    routineForm.wakeTime && activeChild.birthday
      ? calculateSleepWindow({
          birthday: activeChild.birthday,
          wakeTime: routineForm.wakeTime,
          napsCount: activeChild.takesNap === "yes" && routineForm.napTaken === "yes" ? "1" : "0",
        }).nightSleep
      : "";
  if (savedLogDate) {
    return (
      <article className="card card--feature routine-saved-card">
        <div className="card-header">
          <span className="section-label">Rutina</span>
          <h2>Rutina registrada exitosamente</h2>
        </div>
        <div className="save-confirmation">
          <strong>Guardado. Esta noche quedó registrada exitosamente.</strong>
          <p>El resumen quedó guardado y el gráfico de progreso se actualizará con esta noche.</p>
          <button className="button button-primary" type="button" onClick={onClose}>
            {strings.backToChildren}
          </button>
        </div>
      </article>
    );
  }

  function beginGuidedRoutine() {
    const startedAt = routineSession.startedAt || getCurrentTimeValue();
    onRoutineSessionChange({ startedAt, timerMode: "timed" });
    setRoutineStepIndex(0);
    setIsPaused(false);
    setPausedAt(0);
    setPausedTotalMs(0);
    setExtendedSeconds(0);
    setStepStartedAt(Date.now());
    setTimerNow(Date.now());
    setManualStartMs(0);
    setManualInBedMs(0);
    setRoutinePlayerOpen(true);
    restartAmbientSound(routineSession.soundMode);
    onClosePreview();
  }

  function finishGuidedRoutine() {
    const inBedAt = routineSession.inBedAt || getCurrentTimeValue();
    onRoutineSessionChange({ inBedAt });
    setRoutinePlayerOpen(false);
    setPausedAt(0);
    stopAmbientSound();
  }

  function saveChildAsleep() {
    const sessionPatch = {
      inBedAt: routineSession.inBedAt || getCurrentTimeValue(),
      routineEndTime: routineSession.routineEndTime || getCurrentTimeValue(),
      fellAsleepAt: routineSession.fellAsleepAt || getCurrentTimeValue(),
    };
    onRoutineSessionChange(sessionPatch);
    onSaveGuidedRoutine?.(sessionPatch);
    setRoutinePlayerOpen(false);
    setPausedAt(0);
    stopAmbientSound();
  }

  // 12-hour display helper
  const fmt12 = (t) => {
    if (!t) return "--";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${ampm}`;
  };

  // Format window as "7:00 PM – 8:00 PM"
  const fmtWindow = (w) => w ? w.split(" - ").map(fmt12).join(" – ") : "";
  const fmtWindowFull = idealSleepWindow ? fmtWindow(idealSleepWindow) : "";

  // Sleep window check
  const windowWarning = routineForm.targetBedtime && idealSleepWindow ? (() => {
    const [ws, we] = idealSleepWindow.split(" - ");
    const t = timeToMinutes(routineForm.targetBedtime);
    const isOutside = t < timeToMinutes(ws) || t > timeToMinutes(we);
    return { isOutside, windowStr: fmtWindowFull };
  })() : null;

  // Avatar helper
  const getChildAvatar = (child) => {
    const av = getProfileAvatar(child?.primaryProfile);
    return av ? <img src={av.src} alt="" style={{ width: "140%", objectFit: "contain", marginTop: "14%" }} /> : <span style={{ fontWeight: 700 }}>{child?.name?.[0]}</span>;
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>

      {/* ── STATE 1: Form ── */}
      {!currentPlan ? (
        <>
          {/* Child toggle */}
          {allChildren.length > 1 ? (
            <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 18, padding: 18 }}>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 12 }}>Para quien es la rutina de hoy?</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {allChildren.map((child) => {
                  const av = getProfileAvatar(child.primaryProfile);
                  const isActive = child.id === activeChild?.id;
                  return (
                    <button key={child.id} type="button" onClick={() => onSelectRoutineChild?.(child.id)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 14,
                      background: isActive ? "rgba(244,231,178,.12)" : "var(--navy-700)",
                      border: `1.5px solid ${isActive ? "var(--moon)" : "transparent"}`,
                      color: "var(--ink)", cursor: "pointer", textAlign: "left",
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--navy-600)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {av ? <img src={av.src} alt="" style={{ width: "140%", objectFit: "contain", marginTop: "14%" }} /> : <span style={{ fontWeight: 700, fontSize: 14 }}>{child.name?.[0]}</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{child.name}</div>
                        <div style={{ fontSize: 11, color: isActive ? "var(--moon)" : "var(--ink-soft)" }}>{profileMap?.[child.primaryProfile]?.name || child.primaryProfile}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Form card */}
          <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 18, padding: 18 }}>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Mapear la noche de {activeChild.name}</h3>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 18 }}>Estos datos calculan su rutina y horario ideal de hoy.</p>
            <form onSubmit={onGenerateRoutine} style={{ display: "grid", gap: 14 }}>
              {/* Side-by-side time inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>A que hora se desperto hoy?</span>
                  <input type="time" value={routineForm.wakeTime} onChange={e => onRoutineFieldChange("wakeTime", e.target.value)} required style={{ fontFamily: "'JetBrains Mono', monospace", colorScheme: "dark" }} />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>A que hora te gustaria que se duerma?</span>
                  <input type="time" value={routineForm.targetBedtime} onChange={e => onRoutineFieldChange("targetBedtime", e.target.value)} required style={{ fontFamily: "'JetBrains Mono', monospace", colorScheme: "dark" }} />
                </label>
              </div>
              {/* Sleep window warning/confirmation */}
              {windowWarning ? (
                <div style={{
                  fontSize: 12, lineHeight: 1.55, padding: "11px 13px", borderRadius: 12,
                  background: windowWarning.isOutside ? "rgba(217,150,140,.14)" : "rgba(143,190,158,.14)",
                  color: windowWarning.isOutside ? "var(--coral)" : "var(--green)",
                  border: `1px solid ${windowWarning.isOutside ? "rgba(217,150,140,.3)" : "rgba(143,190,158,.3)"}`,
                }}>
                  {windowWarning.isOutside
                    ? <><b>{fmt12(routineForm.targetBedtime)} esta fuera de la ventana ideal de {activeChild.name}.</b> Segun su edad y la hora en que desperto, lo ideal es entre <b>{fmtWindowFull}</b>. Dormir fuera de esta ventana puede hacer que le cueste mas conciliar el sueno.</>
                    : <><b>{fmt12(routineForm.targetBedtime)} esta dentro de la ventana ideal</b> ({fmtWindowFull}). Perfecto!</>}
                </div>
              ) : null}
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>A que hora cenan hoy?</span>
                <input type="time" value={routineForm.dinnerTime} onChange={e => onRoutineFieldChange("dinnerTime", e.target.value)} style={{ fontFamily: "'JetBrains Mono', monospace", colorScheme: "dark" }} />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Cuantos minutos suele tardar en prepararse? (bano, pijama, etc.)</span>
                <input type="number" min="5" max="90" step="5" value={routineForm.prepareDuration} onChange={e => onRoutineFieldChange("prepareDuration", e.target.value)} required />
              </label>
              {activeChild.takesNap === "yes" ? (
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{strings.napQuestion}</span>
                  <select value={routineForm.napTaken} onChange={e => onRoutineFieldChange("napTaken", e.target.value)}>
                    <option value="no">{strings.no}</option>
                    <option value="yes">{strings.yes}</option>
                  </select>
                </label>
              ) : null}
              {activeChild.takesNap === "yes" && routineForm.napTaken === "yes" ? (
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{strings.napWakeTime}</span>
                  <input type="time" value={routineForm.napWakeTime} onChange={e => onRoutineFieldChange("napWakeTime", e.target.value)} required style={{ fontFamily: "'JetBrains Mono', monospace", colorScheme: "dark" }} />
                </label>
              ) : null}
              <button className="button button-primary" type="submit">Generar rutina</button>
            </form>
          </div>
        </>
      ) : (
        <>
          {/* ── STATE 2: Plan ── */}
          <button type="button" onClick={() => { onClose(); onRoutineFieldChange && null; }} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--ink-soft)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
            Editar horarios
          </button>

          {/* Plan header card */}
          <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 18, padding: 18 }}>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 3 }}>Rutina de {activeChild.name}</h3>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 14 }}>
              Desperto {fmt12(currentPlan.wakeTime)} · cena {fmt12(currentPlan.dinnerTime)} · meta dormido {fmt12(currentPlan.targetBedtime)}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "var(--ink-soft)", fontWeight: 600 }}>
                <i style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--moon)", display: "inline-block" }} />Elegido para su perfil
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "var(--ink-soft)", fontWeight: 600 }}>
                <i style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--aqua)", display: "inline-block" }} />Igual para todos los perfiles
              </span>
            </div>
          </div>

          {/* Dinner conflict warning */}
          {currentPlan.dinnerConflict ? (
            <div style={{ background: "rgba(244,231,178,.12)", border: "1px solid rgba(244,231,178,.35)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--moon)", marginBottom: 6 }}>
                🍽️ La cena cae dentro de la rutina
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, margin: 0 }}>
                Haz el baño y el pijama <strong>antes de cenar</strong>. Después de la cena, continúa con los dientes, gárgaras y lo que sigue. La hora de dormir se ajustó automáticamente.
              </p>
            </div>
          ) : null}

          {/* Step cards */}
          {currentPlan.steps.map((step, stepIdx) => {
            const isPersonalized = !!step.selectedActivity;
            const videos = getRoutineVideosForStep(step, currentPlan.profile);
            const beforeDinnerPhases = ["mover", "conectar", "bano_tibio", "ponerse_pijama", "banarse_y_pijamas", "preparar_para_dormir"];
            const prevStep = currentPlan.steps[stepIdx - 1];
            const showDinnerDivider = currentPlan.dinnerConflict
              && prevStep && beforeDinnerPhases.includes(prevStep.phaseKey)
              && !beforeDinnerPhases.includes(step.phaseKey);
            const accentColor = isPersonalized ? "var(--moon)" : "var(--aqua)";
            return (
              <React.Fragment key={step.id}>
              {showDinnerDivider ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(244,231,178,.25)" }} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--moon)", whiteSpace: "nowrap" }}>
                    🍽️ Cena · {fmt12(currentPlan.dinnerTime)}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(244,231,178,.25)" }} />
                </div>
              ) : null}
              <div style={{
                background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 16,
                padding: "15px 16px", borderLeft: `3px solid ${accentColor}`,
              }}>
                {/* Phase tag + time */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 7 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700, color: accentColor }}>{step.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--ink-soft)", whiteSpace: "nowrap" }}>
                    {fmt12(step.start)}{step.end && step.end !== step.start ? ` – ${fmt12(step.end)}` : ""}
                  </span>
                </div>
                {/* Activity title */}
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  {step.selectedActivity?.displayName || step.guidance?.title || step.preparationItems?.map(i => i.displayName).join(" + ")}
                </div>
                {/* Instructions */}
                <div style={{ fontSize: 12.5, color: "rgba(255,248,239,.75)", lineHeight: 1.55, marginBottom: 6 }}>
                  {step.selectedActivity?.instructions || step.guidance?.guidance || step.preparationItems?.map(i => i.instructions).join(" ")}
                </div>
                {/* Purpose italic */}
                {step.purpose ? <div style={{ fontSize: 11.5, color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.5 }}>{step.purpose}</div> : null}
                {/* Video chips */}
                {videos.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {videos.map(v => (
                      <button key={v.title} type="button" onClick={() => setVideoModal(v)} style={{
                        display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px",
                        borderRadius: 20, background: "rgba(158,207,210,.16)", color: "var(--aqua)",
                        fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
                      }}>
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        {v.title}
                      </button>
                    ))}
                  </div>
                ) : null}
                {/* Personalized tag */}
                {isPersonalized ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: "var(--moon)", marginTop: 9 }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
                    Elegido para {activeChild.name}
                  </div>
                ) : null}
                {/* Alternative activity chips */}
                {step.alternatives?.length > 1 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {step.alternatives.filter(a => a.id !== step.selectedActivityId).slice(0, 4).map(a => (
                      <button key={a.id} type="button" onClick={() => onChangeActivity(step.id, a.id)} style={{
                        fontSize: 10.5, padding: "5px 10px", borderRadius: 20,
                        background: "var(--navy-700)", color: "rgba(255,248,239,.72)",
                        border: "1px solid var(--border)", cursor: "pointer",
                      }}>{a.displayName}</button>
                    ))}
                  </div>
                ) : null}
              </div>
              </React.Fragment>
            );
          })}

          {/* Sound mode picker */}
          <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Música de fondo</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {activeChild?.primaryProfile && PROFILE_MUSIC_MAP[activeChild.primaryProfile?.toLowerCase?.()] ? (
                <button type="button" onClick={() => onRoutineSessionChange({ soundMode: "profile" })}
                  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, cursor: "pointer", transition: "all .15s",
                    background: routineSession.soundMode === "profile" ? "var(--moon)" : "var(--navy-700)",
                    color: routineSession.soundMode === "profile" ? "#1a1333" : "var(--ink)",
                    border: routineSession.soundMode === "profile" ? "1px solid var(--moon)" : "1px solid var(--border)",
                    fontWeight: routineSession.soundMode === "profile" ? 700 : 400 }}>
                  🎵 Música del perfil
                </button>
              ) : null}
              {[
                { key: "calm", label: "Música 1" },
                { key: "nature", label: "Música 2" },
                { key: "track3", label: "Música 3" },
                { key: "silent", label: "Silencio" },
              ].map(({ key, label }) => (
                <button key={key} type="button" onClick={() => onRoutineSessionChange({ soundMode: key })}
                  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, cursor: "pointer", transition: "all .15s",
                    background: routineSession.soundMode === key ? "var(--moon)" : "var(--navy-700)",
                    color: routineSession.soundMode === key ? "#1a1333" : "var(--ink)",
                    border: routineSession.soundMode === key ? "1px solid var(--moon)" : "1px solid var(--border)",
                    fontWeight: routineSession.soundMode === key ? 700 : 400 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Launch buttons */}
          <div style={{ display: "grid", gap: 8 }}>
            <button className="button button-primary" type="button" onClick={beginGuidedRoutine}>
              Comenzar rutina guiada →
            </button>
            <button className="button button-ghost" type="button" onClick={() => { onRoutineSessionChange({ timerMode: "manual" }); beginGuidedRoutine(); }}>
              Solo lista, con inicio/fin manual
            </button>
          </div>
        </>
      )}

      {currentPlan ? (
        <>
          {routinePlayerOpen && isManualRoutine ? (() => {
            const totalElapsedSec = manualStartMs > 0 ? Math.max(0, Math.floor((timerNow - manualStartMs) / 1000)) : 0;
            const bedElapsedSec = manualInBedMs > 0 ? Math.max(0, Math.floor((timerNow - manualInBedMs) / 1000)) : 0;
            const fmtSec = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
            const phase = !manualStartMs ? "idle" : !routineSession.inBedAt ? "running" : !routineSession.fellAsleepAt ? "inBed" : "done";

            return (
              <div className="routine-modal" role="dialog" aria-modal="true" aria-label="Rutina manual">
                <div className="routine-modal__panel">
                  <button className="routine-modal__close" type="button" onClick={() => { setRoutinePlayerOpen(false); stopAmbientSound(); }}>×</button>
                  <span className="section-label">Modo manual</span>
                  <h2>Controla el tiempo tú</h2>

                  <div className="routine-timer">
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(248,243,234,.6)", marginBottom: 4 }}>Tiempo total</div>
                        <div className="routine-countdown routine-countdown--manual" style={{ color: "inherit" }}>{manualStartMs ? fmtSec(totalElapsedSec) : "--:--"}</div>
                      </div>
                      {routineSession.inBedAt ? (
                        <div style={{ flex: 1, background: "rgba(244,231,178,.14)", borderRadius: 12, padding: "8px 12px", border: "1px solid rgba(244,231,178,.3)" }}>
                          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(244,231,178,.7)", marginBottom: 4 }}>Latencia de sueño</div>
                          <div className="routine-countdown routine-countdown--manual" style={{ color: "var(--moon)" }}>{manualInBedMs ? fmtSec(bedElapsedSec) : "--:--"}</div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {phase === "idle" ? (
                    <button className="button button-primary" type="button" onClick={() => {
                      const now = Date.now();
                      setManualStartMs(now);
                      onRoutineSessionChange({ startedAt: getCurrentTimeValue() });
                      restartAmbientSound(routineSession.soundMode);
                    }}>
                      Iniciar rutina
                    </button>
                  ) : phase === "running" ? (
                    <div className="stack compact">
                      <div className="content-block content-block--light">
                        <strong>Rutina iniciada a las {routineSession.startedAt}</strong>
                        <p className="muted">Sigue los pasos de la rutina. Cuando termines el último paso y apagues las luces, toca el botón.</p>
                      </div>
                      <button className="button button-primary" type="button" onClick={() => {
                        const now = Date.now();
                        setManualInBedMs(now);
                        onRoutineSessionChange({ inBedAt: getCurrentTimeValue(), routineEndTime: getCurrentTimeValue() });
                      }}>
                        ✓ Rutina hecha
                      </button>
                    </div>
                  ) : phase === "inBed" ? (
                    <div className="sleep-readiness-card sleep-readiness-card--blue">
                      <strong>Luces apagadas a las {routineSession.inBedAt}</strong>
                      <p>El cronómetro de arriba muestra el tiempo desde que terminó la rutina. Cuando se duerma, toca el botón.</p>
                      <button className="button button-primary" type="button" onClick={() => {
                        const sessionPatch = {
                          inBedAt: routineSession.inBedAt,
                          routineEndTime: routineSession.routineEndTime,
                          fellAsleepAt: getCurrentTimeValue(),
                        };
                        onRoutineSessionChange(sessionPatch);
                        onSaveGuidedRoutine?.(sessionPatch);
                        setRoutinePlayerOpen(false);
                        stopAmbientSound();
                      }}>
                        Se durmió
                      </button>
                    </div>
                  ) : null}

                  <div className="stack compact" style={{ marginTop: 8 }}>
                    <strong style={{ fontSize: "0.86rem", color: "rgba(31,48,68,.6)" }}>Pasos de la rutina de esta noche</strong>
                    {currentPlan.steps.map((step, index) => (
                      <div className="routine-preview-step" key={step.id}>
                        <strong>{index + 1}. {step.label}</strong>
                        <span>{step.selectedActivity?.displayName || step.guidance?.title || step.preparationItems?.map((item) => item.displayName).join(", ")}</span>
                        <small>{step.start} - {step.end}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })() : null}

          {routinePlayerOpen && !isManualRoutine && playerStep ? (
            <div className="routine-modal" role="dialog" aria-modal="true" aria-label="Rutina guiada">
              <div className="routine-modal__panel" style={{ textAlign: "center" }}>
                <button
                  className="routine-modal__close"
                  type="button"
                  onClick={() => { setRoutinePlayerOpen(false); stopAmbientSound(); }}
                >
                  ×
                </button>

                {/* Progress + phase */}
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-soft)", marginBottom: 6 }}>
                  PASO {routineStepIndex + 1} DE {currentPlan.steps.length}
                </div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700, color: "var(--moon)", marginBottom: 6 }}>
                  {playerStep.label}
                </div>
                <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "clamp(1.3rem,5vw,1.6rem)", marginBottom: 6 }}>
                  {playerStep.selectedActivity?.displayName || playerStep.guidance?.title || "Preparar para dormir"}
                </h2>
                <div style={{ fontSize: "11px", color: "var(--ink-soft)", fontFamily: "'JetBrains Mono',monospace", marginBottom: 18 }}>
                  {playerStep.start} – {playerStep.end}
                </div>

                {/* Circular timer or "a tu ritmo" pill */}
                {!isUntimedPlayerStep ? (
                  <div style={{
                    width: 128, height: 128, borderRadius: "50%",
                    background: "var(--navy-700)", border: "3px solid var(--moon)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 18px"
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: secondsLeft <= 30 ? "var(--coral)" : "var(--ink)" }}>
                      {formatTimer(secondsLeft)}
                    </span>
                    <span style={{ fontSize: "9.5px", color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 2 }}>
                      restante
                    </span>
                  </div>
                ) : (
                  <div style={{
                    display: "inline-block", padding: "8px 18px", borderRadius: 999,
                    background: "rgba(255,248,239,.08)", color: "var(--ink-soft)",
                    fontSize: 12, fontWeight: 700, marginBottom: 18
                  }}>
                    A tu ritmo
                  </div>
                )}

                {/* Instructions */}
                {playerStep.phaseKey !== "dormir" ? (
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 6 }}>
                      {playerStep.selectedActivity?.instructions || playerStep.guidance?.guidance}
                    </p>
                    {playerStep.purpose ? (
                      <p style={{ fontSize: 11.5, color: "var(--ink-soft)", fontStyle: "italic", lineHeight: 1.5 }}>
                        {playerStep.purpose}
                      </p>
                    ) : null}
                    {playerStep.preparationItems?.length ? (
                      <ul className="mini-list" style={{ marginTop: 10 }}>
                        {playerStep.preparationItems.map((item) => (
                          <li key={item.id}><strong>{item.displayName}:</strong> {item.instructions}</li>
                        ))}
                      </ul>
                    ) : null}
                    {playerStep.guidance?.examples?.length ? (
                      <ul className="mini-list" style={{ marginTop: 10 }}>
                        {playerStep.guidance.examples.map((ex) => <li key={ex}>{ex}</li>)}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                {/* Video chips */}
                {playerStepVideos.length ? (
                  <div className="video-resource-row" style={{ justifyContent: "center", margin: "10px 0" }}>
                    {playerStepVideos.map((video) => (
                      <button key={`${playerStep.id}-${video.title}`} className="button button-ghost" type="button" onClick={() => setVideoModal(video)}
                        style={{ fontSize: 11, padding: "6px 12px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
                        ▶ {video.title}
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* Change activity — chips instead of dropdown */}
                {playerStep.phaseKey !== "dormir" && playerStep.alternatives?.length > 1 ? (
                  <div style={{ textAlign: "left", marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700, marginBottom: 8 }}>
                      {strings.changeActivity}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {playerStep.alternatives.map((activity) => {
                        const isSelected = activity.id === playerStep.selectedActivityId;
                        return (
                          <button
                            key={activity.id}
                            type="button"
                            onClick={() => onChangeActivity(playerStep.id, activity.id)}
                            style={{
                              padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                              background: isSelected ? "var(--moon)" : "var(--navy-700)",
                              color: isSelected ? "var(--navy-950)" : "var(--ink-soft)",
                              border: isSelected ? "none" : "1px solid var(--border)",
                              cursor: "pointer",
                            }}
                          >
                            {activity.displayName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {/* Sleep readiness — calmar: single shortcut button, no "No todavia" */}
                {playerStep.phaseKey === "calmar_el_cuerpo" ? (
                  <div className="sleep-readiness-card" style={{ marginTop: 12, textAlign: "left" }}>
                    <strong>Senales de sueno</strong>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "4px 0 10px" }}>Ojos pesados, cuerpo relajado, menos movimiento, respiracion mas lenta.</p>
                    <button className="button button-primary" style={{ width: "100%" }} type="button" onClick={() => {
                      const dormirIndex = currentPlan.steps.findIndex((s) => s.phaseKey === "dormir");
                      playTransitionTone(routineSession.soundMode);
                      setRoutineStepIndex(dormirIndex >= 0 ? dormirIndex : currentPlan.steps.length - 1);
                    }}>Ya esta listo — ir al final</button>
                  </div>
                ) : null}

                {/* Dormir state */}
                {playerStep.phaseKey === "dormir" ? (
                  <div className="sleep-readiness-card sleep-readiness-card--blue" style={{ textAlign: "left", marginTop: 12 }}>
                    <strong>Tiempo en cama</strong>
                    <p>Cuando tu hijo se duerma, toca <strong>Siguiente paso</strong> para registrar esta noche.</p>
                    <div className="summary-grid" style={{ marginTop: 10 }}>
                      <Stat label={strings.bedTime} value={routineSession.inBedAt || "--:--"} />
                      <div className="stat-card">
                        <span>{strings.sleepTime}</span>
                        <strong>{routineSession.fellAsleepAt || "--:--"}</strong>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Nav controls */}
                {!isLastRoutineStep ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 18, alignItems: "center" }}>
                    <button className="button button-ghost" type="button" disabled={routineStepIndex === 0}
                      onClick={() => setRoutineStepIndex((i) => Math.max(0, i - 1))} style={{ minWidth: 44, padding: "0 12px" }}>
                      ←
                    </button>
                    {!isUntimedPlayerStep ? (
                      <button className="button button-ghost" type="button" style={{ minWidth: 44, padding: "0 12px" }}
                        onClick={() => {
                          setIsPaused((paused) => {
                            if (paused) {
                              const resumedAt = Date.now();
                              setPausedTotalMs((cur) => cur + (pausedAt ? Math.max(0, resumedAt - pausedAt) : 0));
                              setPausedAt(0);
                              restartAmbientSound(routineSession.soundMode);
                            } else {
                              setPausedAt(Date.now());
                              stopAmbientSound();
                            }
                            setTimerNow(Date.now());
                            return !paused;
                          });
                        }}>{isPaused ? "▶" : "⏸"}</button>
                    ) : null}
                    <button className="button button-primary" type="button" style={{ flex: 1 }}
                      onClick={() => {
                        playTransitionTone(routineSession.soundMode);
                        if (playerStep.phaseKey === "a_la_cama") onRoutineSessionChange({ inBedAt: routineSession.inBedAt || getCurrentTimeValue() });
                        if (currentPlan.steps[routineStepIndex + 1]?.phaseKey === "dormir") onRoutineSessionChange({ routineEndTime: routineSession.routineEndTime || getCurrentTimeValue() });
                        if (playerStep.phaseKey === "dormir") onRoutineSessionChange({ fellAsleepAt: routineSession.fellAsleepAt || getCurrentTimeValue() });
                        setStepStartedAt(Date.now());
                        setPausedAt(0); setPausedTotalMs(0); setExtendedSeconds(0);
                        setTimerNow(Date.now()); setIsPaused(false);
                        setRoutineStepIndex((i) => i + 1);
                      }}>
                      Siguiente paso →
                    </button>
                  </div>
                ) : null}
                {/* In-player sound picker */}
                <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
                    🎵 {activeMusicTrack ? `Reproduciendo: ${activeMusicTrack.label}` : "Música de fondo"}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {activeChild?.primaryProfile && PROFILE_MUSIC_MAP[activeChild.primaryProfile?.toLowerCase?.()] ? (
                      <button type="button"
                        onClick={() => { onRoutineSessionChange({ soundMode: "profile" }); restartAmbientSound("profile"); }}
                        style={{ fontSize: 11, padding: "5px 10px", borderRadius: 20, cursor: "pointer",
                          background: routineSession.soundMode === "profile" ? "var(--moon)" : "var(--navy-700)",
                          color: routineSession.soundMode === "profile" ? "#1a1333" : "var(--ink)",
                          border: routineSession.soundMode === "profile" ? "1px solid var(--moon)" : "1px solid var(--border)",
                          fontWeight: routineSession.soundMode === "profile" ? 700 : 400 }}>
                        Perfil
                      </button>
                    ) : null}
                    {[
                      { key: "calm", label: "M1" },
                      { key: "nature", label: "M2" },
                      { key: "track3", label: "M3" },
                      { key: "silent", label: "🔇" },
                    ].map(({ key, label }) => (
                      <button key={key} type="button"
                        onClick={() => { onRoutineSessionChange({ soundMode: key }); restartAmbientSound(key); }}
                        style={{ fontSize: 11, padding: "5px 10px", borderRadius: 20, cursor: "pointer",
                          background: routineSession.soundMode === key ? "var(--moon)" : "var(--navy-700)",
                          color: routineSession.soundMode === key ? "#1a1333" : "var(--ink)",
                          border: routineSession.soundMode === key ? "1px solid var(--moon)" : "1px solid var(--border)",
                          fontWeight: routineSession.soundMode === key ? 700 : 400 }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {videoModal ? (
            <div className="profile-modal" role="dialog" aria-modal="true" aria-label={videoModal.title}>
              <article className="profile-modal__panel card card--soft">
                <button className="routine-modal__close" type="button" onClick={() => setVideoModal(null)} aria-label="Cerrar">
                  ×
                </button>
                <span className="section-label">Video</span>
                <h2>{videoModal.title}</h2>
                <div className="embedded-video embedded-video--portrait">
                  <iframe
                    src={videoModal.embedUrl}
                    title={videoModal.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </article>
            </div>
          ) : null}

          {savedLogDate ? (
            <div className="card card--soft save-confirmation">
              <strong>Rutina registrada exitosamente.</strong>
              <p>{strings.age === "Age" ? "Your progress graph has been updated." : "El gráfico de progreso ya fue actualizado."}</p>
              <button className="button button-primary" type="button" onClick={onClose}>
                Ver reportes
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function VideoThumb({ video, isLocked, lockLabel }) {
  const [playing, setPlaying] = useState(false);
  if (isLocked) {
    return (
      <div className="video-library-placeholder">
        <span className="video-library-lock">🔒</span>
        <p>{lockLabel || "Disponible con premium"}</p>
      </div>
    );
  }
  if (playing) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column" }}>
        <button onClick={() => setPlaying(false)} style={{ position: "absolute", top: "max(54px, calc(env(safe-area-inset-top, 16px) + 16px))", right: 16, zIndex: 10000, background: "rgba(0,0,0,.6)", border: "none", color: "#fff", fontSize: 22, width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        <iframe
          src={video.embedUrl.replace("autoplay=false", "autoplay=true")}
          title={video.title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} style={{
      width: "100%", aspectRatio: "16/9", borderRadius: 14, border: "none",
      background: "linear-gradient(135deg, var(--navy-700), var(--navy-600))",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 8, cursor: "pointer",
    }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(244,231,178,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--moon)", marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)" }}>Reproducir</span>
    </button>
  );
}

function VideoSection({ activeChild, strings, locked = false }) {
  if (!activeChild) return null;
  const [videoFilter, setVideoFilter] = useState("todos");
  const allVideos = [
    ...freeProfileVideoLibrary.map(v => ({ ...v, isFree: true, type: "education" })),
    ...educationVideoLibrary.map(v => ({ ...v, isFree: false, type: "education" })),
    ...activityVideoLibrary.map(v => ({ ...v, isFree: false, type: "neurohack" })),
  ];
  const filtered = allVideos.filter(v => {
    if (videoFilter === "gratis") return v.isFree;
    if (videoFilter === "premium") return !v.isFree;
    return true;
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 14 }}><b style={{ color: "var(--ink)" }}>Video</b> — ejercicios guiados</p>
        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {[["todos", "Todos"], ["gratis", "Gratis"], ["premium", "Premium"]].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setVideoFilter(id)} style={{
              padding: "7px 14px", borderRadius: 18, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: videoFilter === id ? "var(--moon)" : "var(--navy-800)",
              color: videoFilter === id ? "var(--navy-950)" : "var(--ink-soft)",
              border: `1px solid ${videoFilter === id ? "var(--moon)" : "var(--border)"}`,
            }}>{label}</button>
          ))}
        </div>
      </div>
      {/* 2-column video grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {filtered.map((video, i) => (
          <div key={`${video.title}-${i}`} style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 12px 6px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: video.isFree ? "rgba(158,207,210,.2)" : "rgba(244,231,178,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
                {video.isFree ? "🆓" : "★"}
              </div>
              <strong style={{ fontSize: 12, lineHeight: 1.3 }}>{video.title}</strong>
            </div>
            <VideoThumb video={video} isLocked={locked && !video.isFree} lockLabel="Premium" /></div>
        ))}
      </div>
      {locked ? (
        <article className="card" style={{ display: "flex", gap: 13, alignItems: "center", background: "linear-gradient(150deg, rgba(244,231,178,.12), rgba(244,231,178,.04))", border: "1px solid rgba(244,231,178,.22)" }}>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Desbloquea todos los videos con premium</strong>
            <a className="button button-primary button-link" href={SALES_FUNNEL_URL} style={{ fontSize: 12, minHeight: 36, padding: "0 14px" }}>{strings.unlockPremium}</a>
          </div>
        </article>
      ) : null}

    </div>
  );
}

function TipsSection({ strings, onOpen, locked = false }) {
  const cards = [
    { id: "sleep-area", title: strings.facilitateSleep, copy: "Luz, ambiente, rutina y señales que ayudan al sistema nervioso a bajar.", icon: "bear" },
    { id: "avoid", title: strings.whatToAvoid, copy: "Lo que más activa el cerebro y el cuerpo antes de dormir.", icon: "cat-no" },
    { id: "foods", title: strings.foods, copy: "Alimentos que conviene evitar y alimentos que pueden apoyar el sueño.", icon: "bunny" },
    { id: "amazon", title: strings.products, copy: "Productos que amamos para crear un ambiente más regulador.", icon: "amazon" },
  ];

  return (
    <article className="card card--feature tips-hub">
      <img className="brand-animals-corner" src="/brand/animales-buenas-noches.png" alt="" />
      <div className="card-header">
        <span className="section-label">Tips</span>
        <h2>{strings.tipsTitle}</h2>
      </div>
      <div className="tip-card-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={locked && card.id !== "amazon" ? "tip-card tip-card--locked" : "tip-card"}
            onClick={() => (locked && card.id !== "amazon" ? undefined : onOpen(card.id))}
          >
            <BrandIcon type={card.icon} />
            <strong>
              {card.title} {locked && card.id !== "amazon" ? "🔒" : ""}
            </strong>
            <p>{card.copy}</p>
          </button>
        ))}
      </div>
      {locked ? (
        <div className="preview-lock preview-lock--inline">
          <strong>Contenido premium</strong>
          <p>Puedes ver las áreas disponibles. El contenido completo se abre cuando compras premium.</p>
          <a className="button button-primary button-link" href={SALES_FUNNEL_URL}>
            {strings.unlockPremium}
          </a>
        </div>
      ) : null}
    </article>
  );
}

function BrandIcon({ type }) {
  const icons = {
    bear: "🐻",
    "cat-no": "🙅‍♀️",
    bunny: "🥕",
    amazon: "a",
    child: "👧",
    books: "📚",
    brain: "🧠",
  };

  return (
    <span className={`brand-mini-icon brand-mini-icon--${type}`} aria-hidden="true">
      {icons[type] || "✦"}
    </span>
  );
}

function FoodsSection({ strings, onBack }) {
  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.foods}</span>
        <h2>{strings.foods}</h2>
        {onBack ? (
          <button className="button button-ghost" type="button" onClick={onBack}>
            Volver a tips
          </button>
        ) : null}
      </div>
      <div className="tip-detail-grid">
        <FoodList title={strings.foodsForSleep} items={foodSleepItems} />
      </div>
    </article>
  );
}

function FoodList({ title, items }) {
  return (
    <section className="tip-detail-card">
      <h3>{title}</h3>
      {items.map(([itemTitle, copy]) => (
        <div className="tip-detail-item" key={itemTitle}>
          <strong>{itemTitle}</strong>
          <p>{copy}</p>
        </div>
      ))}
    </section>
  );
}

function SleepAreaSection({ activeChild, strings, checkedCount, sleepAreaResult, onToggleCheck, onBack }) {
  if (!activeChild) return null;

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.sleepArea}</span>
        <h2>{strings.facilitateSleep}</h2>
        {onBack ? (
          <button className="button button-ghost" type="button" onClick={onBack}>
            Volver a tips
          </button>
        ) : null}
      </div>
      <div className="tip-detail-grid">
        {facilitateSleepItems.map((item) => (
          <div className="tip-detail-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </div>
      <h3>{strings.quickChecklist}</h3>
      <p className="lead-copy">Esto le da una ventaja inmediata al sistema nervioso de tu hijo.</p>
      <div className="stack">
        {sleepAreaChecklist.map((item) => (
          <button key={item.id} type="button" className="check-row" onClick={() => onToggleCheck(item.id)}>
            <span className="check-ring" aria-hidden="true" />
            <span className={activeChild.sleepAreaChecks?.[item.id] ? "check-dot is-active" : "check-dot"} />
            <div>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </div>
          </button>
        ))}
      </div>
      <div className={`result-strip result-strip--${sleepAreaResult.tone}`}>
        <strong>{checkedCount} checks</strong>
        <span>{sleepAreaResult.label}</span>
      </div>
      <p className="muted">Primero el ambiente... luego la rutina.</p>
    </article>
  );
}

function AvoidSection({ strings, language, onBack }) {
  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.sections.avoid}</span>
        <h2>{strings.avoidBeforeBed}</h2>
        {onBack ? (
          <button className="button button-ghost" type="button" onClick={onBack}>
            Volver a tips
          </button>
        ) : null}
      </div>
      <div className="stack">
        {avoidItems.map((item) => (
          <details className="avoid-card" key={item.title}>
            <summary>{language === "en" ? translateAvoidTitle(item.title) : item.title}</summary>
            <div className="avoid-card__body">
              <strong>{language === "en" ? "Avoid:" : "Evitar:"}</strong>
              <ul className="mini-list">
                {item.avoid.map((entry) => (
                  <li key={entry}>{language === "en" ? translateAvoidEntry(entry) : entry}</li>
                ))}
              </ul>
              <p>
                <strong>{language === "en" ? "Why:" : "Por qué:"}</strong> {language === "en" ? translateAvoidWhy(item.why) : item.why}
              </p>
              <p className="muted">{language === "en" ? translateAvoidSource(item.source) : item.source}</p>
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}

function WinsSection({ activeChild, strings, language, parentName, parentEmail, parentPhotoUrl, allowReview = true }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [improvementFeedback, setImprovementFeedback] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/reviews")
      .then((response) => response.json())
      .then((payload) => {
        if (active) {
          setReviews(payload.reviews || []);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  async function submitReview(event) {
    event.preventDefault();
    if (!rating) return;

    setStatus("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName,
          email: parentEmail,
          childName: activeChild?.name || "",
          photoUrl: parentPhotoUrl || "",
          rating,
          comment,
          improvementFeedback,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude guardar la reseña.");
      }
      setComment("");
      setImprovementFeedback("");
      setRating(0);
      setStatus(payload.public ? strings.reviewSavedPublic : strings.reviewSavedPrivate);
      if (payload.public) {
        setReviews((current) => [{ ...payload.review, photo_url: parentPhotoUrl || "" }, ...current]);
      }
    } catch (error) {
      setStatus(error.message || "No pude guardar la reseña.");
    }
  }

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.sections.wins}</span>
        <h2>{strings.reviews}</h2>
      </div>
      <p className="lead-copy">
        {language === "es"
          ? "Tu reseña nos ayuda muchísimo. Si quieres dejar 5 estrellas, eso nos ayuda a llegar a más familias; y si tienes sugerencias para mejorar la app, también nos ayuda."
          : "Your review helps us so much. If you want to leave 5 stars, that helps us reach more families; and if you have suggestions to improve the app, that helps too."}
      </p>

      {allowReview ? (
        <form className="win-card review-submit-card" onSubmit={submitReview}>
          <div className="star-rating star-rating--large" aria-label="Calificación de la app">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={rating >= star ? "is-selected" : ""}
                onClick={() => setRating(star)}
                aria-label={`${star} estrellas`}
              >
                ★
              </button>
            ))}
          </div>
          {rating === 5 ? (
            <label className="stack compact">
              <span>
                {language === "es"
                  ? "¡Qué alegría! Cuéntanos qué te gusta más y qué impacto ha tenido en su rutina."
                  : "Amazing! Tell us what you like best and what impact it has made in your night-time routine."}
              </span>
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} required />
            </label>
          ) : null}
          {rating === 4 ? (
            <label className="stack compact">
              <span>
                {language === "es"
                  ? "Nos alegra que estés disfrutando la app. ¿Qué haría que esta experiencia sea de 5 estrellas para ti?"
                  : "We are happy you are enjoying the app. What would make this a 5-star experience for you?"}
              </span>
              <textarea value={improvementFeedback} onChange={(event) => setImprovementFeedback(event.target.value)} required />
            </label>
          ) : null}
          {rating > 0 && rating <= 3 ? (
            <label className="stack compact">
              <span>
                {language === "es"
                  ? "Sentimos que la app no esté cumpliendo tus expectativas. ¿Cómo podemos hacer que esta sea una experiencia de 5 estrellas?"
                  : "We are sorry the app is not meeting your expectations. How can we make this a 5-star experience for you?"}
              </span>
              <textarea value={improvementFeedback} onChange={(event) => setImprovementFeedback(event.target.value)} required />
            </label>
          ) : null}
          {status ? <p className="status-message status-success">{status}</p> : null}
          <button className="button button-primary" type="submit" disabled={!rating}>
            {language === "es" ? "Enviar" : "Submit"}
          </button>
        </form>
      ) : (
        <div className="preview-lock preview-lock--inline">
          <strong>{language === "es" ? "Reseñas premium" : "Premium reviews"}</strong>
          <p>
            {language === "es"
              ? "Puedes leer el muro de logros. Para dejar una reseña, primero tienes que haber usado la rutina premium."
              : "You can read the wins wall. To leave a review, you first need to have used the premium routine."}
          </p>
          <a className="button button-primary button-link" href={SALES_FUNNEL_URL}>
            {strings.unlockPremium}
          </a>
        </div>
      )}

      <div className="card-header">
        <span className="section-label">{strings.publicWinsWall}</span>
        <h2>El muro de los logros</h2>
      </div>

      <div className="review-wall">
        {reviews.length ? (
          reviews.map((review) => (
            <div className="review-wall-card" key={review.id}>
              <div className="review-wall-person">
                <span className="review-wall-avatar">
                  {review.photo_url ? (
                    <img src={review.photo_url} alt="" />
                  ) : (
                    (formatPublicParentName(review.parent_name) || "F").slice(0, 1)
                  )}
                </span>
                <strong>
                  {formatPublicParentName(review.parent_name) || (language === "es" ? "Familia Buenas Noches" : "Buenas Noches family")}
                </strong>
              </div>
              <div className="star-line" aria-label={`${review.rating} estrellas`}>
                {"★".repeat(review.rating)}
              </div>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="review-wall-card review-wall-card--empty">
            <p>
              {language === "es"
                ? "El primer logro público aparecerá aquí pronto."
                : "The first public win will appear here soon."}
            </p>
          </div>
        )}
      </div>

    </article>
  );
}

function formatPublicParentName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  return parts[0];
}

function ContactSection({ strings, language, activeChild, parentName, parentEmail }) {
  const [topic, setTopic] = useState("support");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState(parentEmail || "");
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [status, setStatus] = useState("");
  const [pushStatus, setPushStatus] = useState("");

  const emailForInbox = (parentEmail || contactEmail).trim().toLowerCase();

  useEffect(() => {
    let active = true;
    if (!emailForInbox) return undefined;

    async function loadMessages() {
      fetch(`/api/support-message?email=${encodeURIComponent(emailForInbox)}`)
        .then((response) => response.json())
        .then((payload) => {
          if (active) setMessages(payload.messages || []);
        })
        .catch(() => undefined);
    }

    loadMessages();
    const interval = window.setInterval(loadMessages, 20000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [emailForInbox]);

  async function sendPrivateMessage(event) {
    event.preventDefault();
    const emailToSend = parentEmail || contactEmail;
    if (!message.trim() || !emailToSend.trim()) return;

    setStatus("");
    try {
      const response = await fetch("/api/support-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName,
          email: emailToSend.trim().toLowerCase(),
          childName: activeChild?.name || "",
          topic,
          message,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude enviar el mensaje.");
      }
      setMessage("");
      setMessages((current) => [payload.message, ...current]);
      setStatus(strings.messageSent);
    } catch (error) {
      setStatus(error.message || "No pude enviar el mensaje.");
    }
  }

  async function sendUserReply(event, messageId) {
    event.preventDefault();
    const reply = String(replyDrafts[messageId] || "").trim();
    if (!reply) return;

    setStatus("");
    try {
      const response = await fetch("/api/support-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "reply",
          messageId,
          message: reply,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude enviar la respuesta.");
      }

      setReplyDrafts((current) => ({ ...current, [messageId]: "" }));
      setMessages((current) =>
        current.map((thread) =>
          thread.id === messageId
            ? {
                ...thread,
                status: "new",
                replies: [...(thread.replies || []), payload.reply],
              }
            : thread
        )
      );
      setStatus(strings.messageSent);
    } catch (error) {
      setStatus(error.message || "No pude enviar la respuesta.");
    }
  }

  async function enablePush() {
    setPushStatus("");
    try {
      await subscribeToPushNotifications({ email: emailForInbox, role: "user" });
      setPushStatus("Listo. Te avisaremos cuando tengas una respuesta.");
    } catch (error) {
      setPushStatus(error.message || "No pude activar las notificaciones.");
    }
  }

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.contactUs}</span>
        <h2>{strings.needHelp}</h2>
      </div>
      <p className="lead-copy">{strings.contactCopy}</p>
      <button className="button button-secondary" type="button" onClick={enablePush} disabled={!emailForInbox}>
        Activar notificaciones de respuestas
      </button>
      {pushStatus ? <p className="status-message status-success">{pushStatus}</p> : null}
      <form className="win-card" onSubmit={sendPrivateMessage}>
        {!parentEmail ? (
          <label className="stack compact">
            <span>{strings.parentEmail}</span>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="tuemail@ejemplo.com"
              required
            />
          </label>
        ) : null}
        <label className="stack compact">
          <span>{strings.messageTopic}</span>
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value="support">{strings.topicSupport}</option>
            <option value="question">{strings.topicQuestion}</option>
            <option value="win">{strings.topicWin}</option>
          </select>
        </label>
        <label className="stack compact">
          <span>{strings.sharePrivateWin}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={strings.messagePlaceholder}
            required
          />
        </label>
        {status ? <p className="status-message status-success">{status}</p> : null}
        <button className="icon-button message-icon-action" type="submit" aria-label={strings.sendMessage}>
          ➤
        </button>
      </form>
      <section className="message-thread-list">
        <div className="card-header">
          <span className="section-label">Mensajes</span>
          <h3>Tu conversación con Buenas Noches</h3>
        </div>
        {messages.length ? (
          messages.map((thread) => (
            <div className="message-thread" key={thread.id}>
              <div className="message-bubble message-bubble--user">
                <strong>Tú</strong>
                <p>{thread.message}</p>
                <small>{thread.created_at?.slice(0, 10)}</small>
              </div>
              {(thread.replies || []).map((reply) => (
                <div
                  className={reply.sender === "admin" ? "message-bubble message-bubble--admin" : "message-bubble message-bubble--user"}
                  key={reply.id}
                >
                  <strong>{reply.sender === "admin" ? "Joline" : "Tú"}</strong>
                  <p>{reply.message}</p>
                  <small>{reply.created_at?.slice(0, 10)}</small>
                </div>
              ))}
              <form className="message-reply-form" onSubmit={(event) => sendUserReply(event, thread.id)}>
                <textarea
                  value={replyDrafts[thread.id] || ""}
                  onChange={(event) => setReplyDrafts((current) => ({ ...current, [thread.id]: event.target.value }))}
                  placeholder="Responder a este mensaje..."
                />
                <button className="icon-button message-icon-action" type="submit" aria-label="Responder">
                  ➤
                </button>
              </form>
            </div>
          ))
        ) : (
          <p className="muted">Aún no hay mensajes guardados.</p>
        )}
      </section>
    </article>
  );
}

function AdminSection({ strings, language, onHome }) {
  const [adminCode, setAdminCode] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [pushStatus, setPushStatus] = useState("");
  const [expandedUserEmail, setExpandedUserEmail] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("todos");
  const [reviewToggles, setReviewToggles] = useState({});

  async function loadAdminData(event) {
    event.preventDefault();
    setStatus("");

    try {
      const response = await fetch("/api/admin-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminCode }),
      });
      const payload = await response.json().catch(() => ({
        error: "La respuesta del servidor no fue JSON. Revisa si el deploy terminó correctamente.",
      }));
      if (!response.ok) {
        throw new Error(payload.error || "No pude abrir el panel.");
      }
      setData(payload);
    } catch (error) {
      const message = error.message || "";
      setStatus(
        message === "The string did not match the expected pattern."
          ? "El código fue aceptado, pero el panel no pudo cargar datos. Sube los archivos actualizados y vuelve a desplegar."
          : message || "No pude abrir el panel."
      );
    }
  }

  async function deleteAdminMessage(messageId) {
    setStatus("");
    try {
      const response = await fetch("/api/admin-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminCode, type: "delete_message", messageId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude borrar el mensaje.");
      }
      setData((current) => ({
        ...current,
        messages: current.messages.filter((message) => message.id !== messageId),
      }));
    } catch (error) {
      setStatus(error.message || "No pude borrar el mensaje.");
    }
  }

  async function replyToMessage(event, messageItem) {
    event.preventDefault();
    const reply = String(replyDrafts[messageItem.id] || "").trim();
    if (!reply) return;

    setStatus("");
    try {
      const response = await fetch("/api/admin-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminCode,
          type: "reply_message",
          messageId: messageItem.id,
          email: messageItem.parent_email,
          message: reply,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude enviar la respuesta.");
      }

      setReplyDrafts((current) => ({ ...current, [messageItem.id]: "" }));
      setData((current) => ({
        ...current,
        messages: current.messages.map((message) =>
          message.id === messageItem.id
            ? {
                ...message,
                status: "answered",
                replies: [...(message.replies || []), payload.reply],
              }
            : message
        ),
      }));
    } catch (error) {
      setStatus(error.message || "No pude enviar la respuesta.");
    }
  }

  async function enableAdminPush() {
    setPushStatus("");
    try {
      await subscribeToPushNotifications({ email: "admin@buenasnoches.local", role: "admin" });
      setPushStatus("Listo. Este dispositivo recibirá notificaciones de mensajes y reseñas.");
    } catch (error) {
      setPushStatus(error.message || "No pude activar las notificaciones.");
    }
  }

  const userGroups = data ? buildAdminUserGroups(data) : [];
  const premiumCount = userGroups.filter(u => u.isPremium).length;
  const freeCount = userGroups.filter(u => !u.isPremium).length;
  const totalCount = userGroups.length;
  const pendingMessages = (data?.messages || []).filter(m => m.status !== "answered").length;
  const today = new Date().toISOString().slice(0, 7);
  const newThisMonth = userGroups.filter(u => u.children.some(c => c.created_at?.startsWith(today))).length;

  const filteredUsers = userGroups.filter(u => {
    const matchesSearch = !userSearch || u.email.toLowerCase().includes(userSearch.toLowerCase()) || (u.parentName || "").toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter = userFilter === "todos" || (userFilter === "premium" && u.isPremium) || (userFilter === "gratis" && !u.isPremium);
    return matchesSearch && matchesFilter;
  });

  const topicBadgeStyle = (topic) => {
    const t = (topic || "").toLowerCase();
    if (t.includes("soporte") || t.includes("support")) return { background: "rgba(217,150,140,.2)", color: "var(--coral)", border: "1px solid rgba(217,150,140,.3)" };
    if (t.includes("sugerencia") || t.includes("suggestion")) return { background: "rgba(244,231,178,.2)", color: "var(--moon)", border: "1px solid rgba(244,231,178,.3)" };
    return { background: "rgba(158,207,210,.2)", color: "var(--aqua)", border: "1px solid rgba(158,207,210,.3)" };
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3v-8Zm5-5h2v13H8V8Zm5-4h2v17h-2V4Zm5 6h2v11h-2v-11Z" /> },
    { id: "usuarios", label: "Usuarios", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m5-3.13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /> },
    { id: "mensajes", label: "Mensajes", icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />, badge: pendingMessages },
    { id: "resenas", label: "Resenas", icon: <path strokeLinecap="round" strokeLinejoin="round" d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21Z" /> },
  ];

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 360, background: "var(--navy-900)", border: "1px solid var(--border)", borderRadius: 24, padding: 32 }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--moon)", marginBottom: 4 }}>QuiroKids</div>
          <h2 style={{ marginBottom: 4 }}>Panel Admin</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 13, marginBottom: 24 }}>Ingresa el codigo de acceso para continuar.</p>
          <form onSubmit={loadAdminData} style={{ display: "grid", gap: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>Codigo de acceso</span>
              <input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} required />
            </label>
            {status ? <p style={{ color: "var(--coral)", fontSize: 13 }}>{status}</p> : null}
            <button className="button button-primary" type="submit">Entrar al panel</button>
            <button className="button button-ghost" type="button" onClick={onHome}>Volver a la app</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--navy-950)", color: "var(--ink)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "var(--navy-900)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--moon)", fontWeight: 700, marginBottom: 2 }}>QuiroKids</div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 600 }}>Panel Admin</div>
        </div>
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {sidebarItems.map(item => (
            <button key={item.id} type="button" onClick={() => setAdminTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
              borderRadius: 10, marginBottom: 2, background: adminTab === item.id ? "var(--navy-800)" : "transparent",
              color: adminTab === item.id ? "var(--ink)" : "rgba(255,248,239,.55)", fontWeight: 600, fontSize: 13.5,
              border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{item.icon}</svg>
              {item.label}
              {item.badge > 0 ? <span style={{ marginLeft: "auto", background: "var(--coral)", color: "white", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--moon)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>J</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>Joline</div>
              <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>joline.yeager@yahoo.com</div>
            </div>
          </div>
          <button className="button button-ghost" type="button" onClick={onHome} style={{ width: "100%", marginTop: 12, fontSize: 12, minHeight: 36 }}>Volver a la app</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "40px 36px 60px", maxWidth: 1000, overflowY: "auto" }}>

        {/* ── DASHBOARD ── */}
        {adminTab === "dashboard" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontSize: 28 }}>Dashboard</h1>
                <p style={{ margin: "4px 0 0", color: "var(--ink-soft)", fontSize: 14 }}>Resumen de usuarios y suscripciones</p>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: "var(--navy-800)", border: "1px solid var(--border)", padding: "7px 14px", borderRadius: 20, color: "var(--ink-soft)" }}>
                {new Date().toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { label: "Usuarios totales", value: totalCount, delta: `+${newThisMonth} este mes`, color: "var(--aqua)" },
                { label: "Premium activos", value: premiumCount, delta: premiumCount > 0 ? `${Math.round(premiumCount/Math.max(totalCount,1)*100)}% del total` : "0%", color: "var(--moon)" },
                { label: "Gratis", value: freeCount, delta: "sin suscripcion", color: "var(--aqua)" },
                { label: "Mensajes pendientes", value: pendingMessages, delta: "sin respuesta", color: pendingMessages > 0 ? "var(--coral)" : "var(--green)" },
              ].map((kpi, i) => (
                <div key={i} style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: kpi.color }} />
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-soft)", fontWeight: 600 }}>{kpi.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 600, color: "var(--ink)", margin: "10px 0 6px" }}>{kpi.value}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{kpi.delta}</div>
                </div>
              ))}
            </div>
            {/* User breakdown */}
            <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontFamily: "'Baloo 2', sans-serif" }}>Desglose de usuarios</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { label: "Premium", count: premiumCount, color: "var(--moon)", pct: totalCount > 0 ? premiumCount/totalCount : 0 },
                  { label: "Gratis", count: freeCount, color: "var(--aqua)", pct: totalCount > 0 ? freeCount/totalCount : 0 },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, minWidth: 70 }}>{row.label}</span>
                    <div style={{ flex: 1, height: 8, background: "rgba(255,248,239,.08)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: row.color, width: `${Math.round(row.pct * 100)}%`, borderRadius: 999 }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14, minWidth: 28, textAlign: "right" }}>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* ── USUARIOS ── */}
        {adminTab === "usuarios" ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ margin: "0 0 4px", fontFamily: "'Baloo 2', sans-serif", fontSize: 28 }}>Usuarios</h1>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>{totalCount} familias registradas</p>
            </div>
            {/* Search + filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                </svg>
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Buscar por nombre o correo..." style={{ paddingLeft: 34, minHeight: 42 }} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["todos", "premium", "gratis"].map(f => (
                  <button key={f} type="button" onClick={() => setUserFilter(f)} style={{
                    padding: "8px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                    background: userFilter === f ? "var(--navy-950)" : "var(--navy-800)",
                    color: userFilter === f ? "var(--ink)" : "var(--ink-soft)",
                    border: `1px solid ${userFilter === f ? "var(--moon)" : "var(--border)"}`,
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* User table */}
            <div style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,248,239,.04)" }}>
                    {["", "Usuario", "Estado", "Perfiles", "Ultima actividad"].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-soft)", fontWeight: 600, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const isExpanded = expandedUserEmail === user.email;
                    const lastLog = user.children.flatMap(c => Array.from(user.logsByChild.get(c.id) || [])).sort((a,b) => a.log_date < b.log_date ? 1 : -1)[0];
                    return (
                      <>
                        <tr key={user.email} onClick={() => setExpandedUserEmail(isExpanded ? "" : user.email)}
                          style={{ cursor: "pointer", borderBottom: "1px solid var(--border)", background: isExpanded ? "rgba(255,248,239,.04)" : "transparent" }}>
                          <td style={{ padding: "14px 16px", width: 28 }}>
                            <span style={{ color: "var(--ink-soft)", fontSize: 12, transition: "transform .15s", display: "inline-block", transform: isExpanded ? "rotate(90deg)" : "none" }}>▶</span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: 600, color: "var(--ink)" }}>{user.parentName || "Sin nombre"}</div>
                            <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{user.email}</div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
                              background: user.isPremium ? "rgba(244,231,178,.15)" : "rgba(255,248,239,.08)",
                              color: user.isPremium ? "var(--moon)" : "var(--ink-soft)",
                              border: `1px solid ${user.isPremium ? "rgba(244,231,178,.3)" : "var(--border)"}` }}>
                              {user.isPremium ? "PREMIUM" : "GRATIS"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "var(--ink-soft)", fontSize: 13.5 }}>{user.children.length}</td>
                          <td style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "var(--ink-soft)" }}>
                            {lastLog ? lastLog.log_date : "Sin registros"}
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr key={`${user.email}-detail`} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td colSpan={5} style={{ padding: 0 }}>
                              <div style={{ background: "rgba(255,248,239,.03)", padding: "20px 20px 20px 50px" }}>
                                {user.children.map(child => {
                                  const childLogs = [...(user.logsByChild.get(child.id) || [])]
                                    .filter(l => l.log_date && Number.isFinite(Number(l.sleep_latency_minutes)))
                                    .sort((a,b) => a.log_date < b.log_date ? -1 : 1)
                                    .slice(-14);
                                  const avg = childLogs.length ? Math.round(childLogs.reduce((s,l) => s + Number(l.sleep_latency_minutes), 0) / childLogs.length) : null;
                                  const maxVal = childLogs.length ? Math.max(...childLogs.map(l => Number(l.sleep_latency_minutes)), 15) : 60;
                                  const W = 400, H = 90, PL = 28, PR = 8, PT = 8, PB = 8;
                                  const cW = W - PL - PR, cH = H - PT - PB;
                                  const pts = childLogs.map((l,i) => ({
                                    x: PL + (i / Math.max(childLogs.length - 1, 1)) * cW,
                                    y: PT + cH - (Number(l.sleep_latency_minutes) / maxVal) * cH,
                                  }));
                                  const linePath = pts.length > 1 ? pts.map((p,i) => {
                                    if (i === 0) return `M${p.x},${p.y}`;
                                    const prev = pts[i-1];
                                    const cpx = prev.x + (p.x - prev.x) * 0.35;
                                    return `C${cpx},${prev.y} ${p.x - (p.x - prev.x)*0.35},${p.y} ${p.x},${p.y}`;
                                  }).join(" ") : null;
                                  const areaPath = linePath ? `${linePath} L${pts[pts.length-1].x},${PT+cH} L${pts[0].x},${PT+cH} Z` : null;
                                  const yTicks = [0, 0.5, 1].map(t => ({ y: PT + cH*(1-t), v: Math.round(maxVal*t) }));
                                  const lastLog = childLogs[childLogs.length - 1];

                                  return (
                                    <div key={child.id} style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
                                      {/* Header */}
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                        <div>
                                          <div style={{ fontWeight: 700, fontSize: 14 }}>{child.child_name || "Sin nombre"}</div>
                                          <div style={{ fontSize: 11.5, color: "var(--aqua)", fontWeight: 600, marginTop: 2 }}>{child.primary_profile || "Sin perfil"} · {child.age_years ?? "?"} anos</div>
                                        </div>
                                        <div style={{ display: "flex", gap: 10 }}>
                                          {[
                                            { label: "Promedio", value: avg !== null ? `${avg} min` : "--" },
                                            { label: "Ultima noche", value: lastLog ? `${lastLog.sleep_latency_minutes} min` : "--" },
                                            { label: "Registros", value: String(childLogs.length) },
                                          ].map((s,i) => (
                                            <div key={i} style={{ background: "var(--navy-700)", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                                              <div style={{ fontSize: 9.5, color: "var(--ink-soft)", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</div>
                                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600 }}>{s.value}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      {/* Chart */}
                                      {childLogs.length > 1 ? (
                                        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
                                          {yTicks.map((t,i) => (
                                            <g key={i}>
                                              <line x1={PL} x2={W-PR} y1={t.y} y2={t.y} stroke="rgba(255,248,239,.06)" strokeWidth="1" />
                                              <text x={PL-4} y={t.y+3} textAnchor="end" fill="rgba(255,248,239,.35)" fontSize="8" fontFamily="JetBrains Mono, monospace">{t.v}</text>
                                            </g>
                                          ))}
                                          {areaPath && <path d={areaPath} fill="rgba(214,168,92,.1)" />}
                                          {linePath && <path d={linePath} fill="none" stroke="#D6A85C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
                                          {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D6A85C" />)}
                                        </svg>
                                      ) : (
                                        <p style={{ fontSize: 12, color: "var(--ink-soft)", textAlign: "center", padding: "10px 0" }}>
                                          {childLogs.length === 0 ? "Sin noches registradas aun." : "Necesita al menos 2 registros para el grafico."}
                                        </p>
                                      )}
                                      {/* Recent nights list */}
                                      {childLogs.length > 0 ? (
                                        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 6 }}>
                                          {[...childLogs].reverse().slice(0, 7).map((log, i) => (
                                            <div key={i} style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                                              <span style={{ color: "var(--ink-soft)" }}>{log.log_date?.slice(5)}</span>
                                              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--ink)", marginLeft: 6, fontWeight: 600 }}>{log.sleep_latency_minutes} min</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </>
                    );
                  })}
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "var(--ink-soft)" }}>No hay usuarios que coincidan.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {/* ── MENSAJES ── */}
        {adminTab === "mensajes" ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ margin: "0 0 4px", fontFamily: "'Baloo 2', sans-serif", fontSize: 28 }}>Mensajes</h1>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>{pendingMessages} conversaciones esperando respuesta</p>
            </div>
            {(data.messages || []).length === 0 ? <p style={{ color: "var(--ink-soft)" }}>No hay mensajes.</p> : null}
            {(data.messages || []).map(msg => {
              const isSupport = (msg.topic || "").toLowerCase().includes("soporte") || (msg.topic || "").toLowerCase().includes("support");
              const badgeStyle = topicBadgeStyle(msg.topic);
              return (
                <div key={msg.id} style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <span style={{ ...badgeStyle, display: "inline-block", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, marginBottom: 6 }}>
                        {(msg.topic || "MENSAJE").toUpperCase()}
                      </span>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{msg.parent_email || "Sin email"}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "var(--ink-soft)" }}>{msg.created_at?.slice(0, 10)}</div>
                  </div>
                  <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.55, marginBottom: 14 }}>{msg.message}</p>
                  {/* Previous replies */}
                  {(msg.replies || []).map(reply => (
                    <div key={reply.id} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 8, background: reply.sender === "admin" ? "rgba(244,231,178,.1)" : "rgba(158,207,210,.1)" }}>
                      <strong style={{ fontSize: 12, color: reply.sender === "admin" ? "var(--moon)" : "var(--aqua)" }}>{reply.sender === "admin" ? "Tu" : "Usuario"}</strong>
                      <p style={{ margin: "2px 0 0", fontSize: 13 }}>{reply.message}</p>
                    </div>
                  ))}
                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                    {isSupport ? (
                      <>
                        <a href={`https://wa.me/?text=${encodeURIComponent(`Hola, te escribo de Buenas Noches re: tu mensaje`)}`} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: "#3FA66B", color: "white", textDecoration: "none" }}>
                          <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.35C8.52 21.5 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Z" /></svg>
                          WhatsApp
                        </a>
                        <a href={`mailto:${msg.parent_email}?subject=Buenas Noches — Tu consulta`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: "var(--navy-700)", color: "var(--ink)", border: "1px solid var(--border)", textDecoration: "none" }}>
                          Correo
                        </a>
                      </>
                    ) : null}
                  </div>
                  {/* Reply form */}
                  <form onSubmit={e => replyToMessage(e, msg)} style={{ display: "grid", gap: 8 }}>
                    <textarea value={replyDrafts[msg.id] || ""} onChange={e => setReplyDrafts(cur => ({ ...cur, [msg.id]: e.target.value }))}
                      placeholder="Responder a este usuario..." style={{ minHeight: 60 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="button button-primary" type="submit" style={{ flex: 1, minHeight: 40 }}>Enviar respuesta</button>
                      <button type="button" onClick={() => deleteAdminMessage(msg.id)} style={{
                        padding: "0 14px", borderRadius: 9, background: "var(--navy-700)", color: "var(--coral)",
                        border: "1px solid rgba(217,150,140,.3)", cursor: "pointer", fontSize: 14,
                      }} aria-label="Borrar">🗑</button>
                    </div>
                  </form>
                </div>
              );
            })}
          </>
        ) : null}

        {/* ── RESENAS ── */}
        {adminTab === "resenas" ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ margin: "0 0 4px", fontFamily: "'Baloo 2', sans-serif", fontSize: 28 }}>Resenas y comentarios</h1>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>De la encuesta periodica dentro de la app</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {/* Private <5★ */}
              <div>
                <h3 style={{ fontFamily: "'Baloo 2', sans-serif", marginBottom: 3 }}>Comentarios privados (&lt;5★)</h3>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14 }}>Solo visibles para ti — usalos para mejorar la app</p>
                {(data.reviews || []).filter(r => r.rating < 5).map(review => (
                  <div key={review.id} style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                    <div style={{ color: "var(--moon)", fontSize: 13, letterSpacing: 1, marginBottom: 5 }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 8 }}>{review.parent_email || "Anonimo"} · {review.created_at?.slice(0, 10)}</div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 10 }}>{review.improvement_feedback || review.comment}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--ink-soft)", fontStyle: "italic" }}>No publicado</span>
                      <button className="button button-ghost" type="button" style={{ fontSize: 12, minHeight: 32, padding: "0 12px" }}>Responder</button>
                    </div>
                  </div>
                ))}
                {(data.reviews || []).filter(r => r.rating < 5).length === 0 ? <p style={{ color: "var(--ink-soft)" }}>Sin comentarios privados.</p> : null}
              </div>
              {/* 5★ wall */}
              <div>
                <h3 style={{ fontFamily: "'Baloo 2', sans-serif", marginBottom: 3 }}>Resenas de 5★</h3>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14 }}>Elige cuales mostrar en el muro de logros</p>
                {(data.reviews || []).filter(r => r.rating === 5).map(review => {
                  const isPublished = reviewToggles[review.id] !== undefined ? reviewToggles[review.id] : review.public_approved;
                  return (
                    <div key={review.id} style={{ background: "var(--navy-800)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                      <div style={{ color: "var(--moon)", fontSize: 13, marginBottom: 5 }}>★★★★★</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 8 }}>{review.parent_email || "Anonimo"} · {review.created_at?.slice(0, 10)}</div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}>{review.comment}</p>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="button" onClick={() => setReviewToggles(cur => ({ ...cur, [review.id]: !isPublished }))} style={{
                          padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          background: isPublished ? "rgba(143,190,158,.2)" : "var(--navy-700)",
                          color: isPublished ? "var(--green)" : "var(--ink-soft)",
                          border: `1px solid ${isPublished ? "rgba(143,190,158,.3)" : "var(--border)"}`,
                        }}>
                          {isPublished ? "En el muro" : "Publicar en el muro"}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {(data.reviews || []).filter(r => r.rating === 5).length === 0 ? <p style={{ color: "var(--ink-soft)" }}>Sin resenas de 5 estrellas aun.</p> : null}
              </div>
            </div>
          </>
        ) : null}

        {status ? <p style={{ color: "var(--coral)", marginTop: 16, fontSize: 13 }}>{status}</p> : null}
      </main>
    </div>
  );
}

function buildAdminUserGroups(data) {
  const groups = new Map();
  const premiumEmails = new Set(
    (data.purchases || [])
      .filter(
        (purchase) =>
          isAppPurchase(purchase.product_id) &&
          (purchase.premium_unlocked || String(purchase.purchase_status || "").toLowerCase() === "paid")
      )
      .map((purchase) => String(purchase.email || "").trim().toLowerCase())
  );

  const parentNamesByEmail = new Map();
  const rememberParentName = (email, name) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(name || "").trim();
    if (!normalizedEmail || !cleanName || parentNamesByEmail.has(normalizedEmail)) return;
    parentNamesByEmail.set(normalizedEmail, cleanName);
  };

  (data.quizResults || []).forEach((result) => {
    const metadata = Array.isArray(result.answers) ? {} : result.answers || {};
    rememberParentName(result.parent_email, metadata.parentName);
  });
  (data.messages || []).forEach((message) => rememberParentName(message.parent_email, message.parent_name));
  (data.reviews || []).forEach((review) => rememberParentName(review.parent_email, review.parent_name));

  const makeUserGroup = (email) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    return {
      email,
      parentName: parentNamesByEmail.get(normalizedEmail) || "",
      isPremium: premiumEmails.has(normalizedEmail),
      children: [],
      logsByChild: new Map(),
      eventsByChild: new Map(),
    };
  };

  (data.children || []).forEach((child) => {
    const email = child.parent_email || "";
    if (!groups.has(email)) {
      groups.set(email, makeUserGroup(email));
    }
    groups.get(email).children.push(child);
  });

  (data.quizResults || []).forEach((result) => {
    const email = result.parent_email || "";
    const metadata = Array.isArray(result.answers) ? {} : result.answers || {};
    const childId = result.child_id || result.id;
    if (!groups.has(email)) {
      groups.set(email, makeUserGroup(email));
    }
    const user = groups.get(email);
    if (!user.parentName && metadata.parentName) user.parentName = metadata.parentName;
    const alreadyExists = user.children.some((child) => child.id === childId || child.quiz_result_id === result.id);
    if (!alreadyExists) {
      user.children.push({
        id: childId,
        quiz_result_id: result.id,
        parent_email: email,
        child_name: metadata.childName || "Perfil guardado",
        age_years: metadata.childBirthday ? calculateAgeFromBirthday(metadata.childBirthday) : 0,
        primary_profile: result.primary_profile,
        secondary_profile: result.secondary_profile,
        created_at: result.created_at,
      });
    }
    if (!user.eventsByChild.has(childId)) user.eventsByChild.set(childId, []);
    user.eventsByChild.get(childId).push({
      id: `quiz-${result.id}`,
      event_type: "profile_created",
      event_label: "Perfil creado desde el quiz",
      created_at: result.created_at,
    });
  });

  (data.logs || []).forEach((log) => {
    const email = log.parent_email || "";
    if (!groups.has(email)) {
      groups.set(email, makeUserGroup(email));
    }
    const user = groups.get(email);
    const childKey = log.child_id || user.children[0]?.id || "";
    if (!user.logsByChild.has(childKey)) user.logsByChild.set(childKey, []);
    user.logsByChild.get(childKey).push(log);
  });

  (data.events || []).forEach((event) => {
    const email = event.parent_email || "";
    if (!groups.has(email)) {
      groups.set(email, makeUserGroup(email));
    }
    const childKey = event.child_id || "";
    const user = groups.get(email);
    if (!user.eventsByChild.has(childKey)) user.eventsByChild.set(childKey, []);
    user.eventsByChild.get(childKey).push(event);
  });

  return Array.from(groups.values())
    .sort((left, right) => {
      if (left.isPremium !== right.isPremium) return left.isPremium ? -1 : 1;
      return left.email.localeCompare(right.email);
    });
}

function buildAdminUserMix(data) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const seenEmails = new Set();

  (data.children || []).forEach((child) => {
    if (!child?.parent_email || !child?.created_at) return;
    if (new Date(child.created_at) >= todayStart) {
      seenEmails.add(String(child.parent_email).trim().toLowerCase());
    }
  });

  (data.quizResults || []).forEach((result) => {
    if (!result?.parent_email || !result?.created_at) return;
    if (new Date(result.created_at) >= todayStart) {
      seenEmails.add(String(result.parent_email).trim().toLowerCase());
    }
  });

  const premiumEmails = new Set(
    (data.purchases || [])
      .filter(
        (purchase) =>
          purchase?.created_at &&
          new Date(purchase.created_at) >= todayStart &&
          (purchase.premium_unlocked || String(purchase.purchase_status || "").toLowerCase() === "paid")
      )
      .map((purchase) => String(purchase.email || "").trim().toLowerCase())
  );

  let premiumCount = 0;
  let freeCount = 0;
  seenEmails.forEach((email) => {
    if (premiumEmails.has(email)) premiumCount += 1;
    else freeCount += 1;
  });

  const total = premiumCount + freeCount;
  return {
    premiumCount,
    freeCount,
    total,
    premiumPercent: total ? Math.round((premiumCount / total) * 100) : 0,
  };
}

function isAppPurchase(productId) {
  const value = String(productId || "").trim().toLowerCase();
  if (!value) return false;
  return value.includes("buenas") || value.includes("noches") || value.includes("424830") || value.includes("app");
}

function AdminList({ title, items, renderItem }) {
  return (
    <section className="admin-list">
      <h3>{title}</h3>
      {items?.length ? (
        items.map((item) => (
          <div className="admin-list-item" key={item.id}>
            {renderItem(item)}
          </div>
        ))
      ) : (
        <p className="muted">Sin datos todavía.</p>
      )}
    </section>
  );
}

function LockedPreviewCard({ activeSection, language }) {
  const labels = {
    home: language === "es" ? "Inicio" : "Home",
    routine: language === "es" ? "Rutina de esta noche" : "Tonight's routine",
    videos: language === "es" ? "Biblioteca de videos" : "Video library",
    "sleep-area": language === "es" ? "Área de sueño" : "Sleep space",
    avoid: language === "es" ? "Qué evitar" : "What to avoid",
    foods: language === "es" ? "Alimentos" : "Foods",
    wins: language === "es" ? "Logros" : "Wins",
    contact: language === "es" ? "Contáctanos" : "Contact us",
  };

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{language === "es" ? "Vista previa" : "Preview"}</span>
        <h2>{labels[activeSection] || labels.home}</h2>
      </div>
      <p className="lead-copy">
        {language === "es"
          ? "Así se ve esta sección dentro de la app completa. Puedes explorar el shell, pero esta parte se desbloquea con la compra."
          : "This is how this section looks inside the full app. You can explore the shell, but this part unlocks with purchase."}
      </p>
      <div className="preview-grid">
        <div className="preview-block">
          <strong>{language === "es" ? "Lo que encontrarás aquí" : "What you'll find here"}</strong>
          <ul className="mini-list">
            <li>
              {activeSection === "routine"
                ? language === "es"
                  ? "Rutina personalizada por perfil y edad"
                  : "Personalized routine by profile and age"
                : null}
              {activeSection === "videos"
                ? language === "es"
                  ? "Videos por actividad para seguir paso a paso"
                  : "Videos by activity to follow step by step"
                : null}
              {activeSection === "sleep-area"
                ? language === "es"
                  ? "Checklist rápido del cuarto y su impacto"
                  : "Quick room checklist and its impact"
                : null}
              {activeSection === "avoid"
                ? language === "es"
                  ? "Lista clara de lo que más interfiere con el sueño"
                  : "Clear list of what most interferes with sleep"
                : null}
              {activeSection === "foods"
                ? language === "es"
                  ? "Alimentos que ayudan al sueño y alimentos que conviene evitar"
                  : "Foods that support sleep and foods to avoid"
                : null}
              {activeSection === "wins"
                ? language === "es"
                  ? "Un lugar para celebrar logros"
                  : "A place to celebrate wins"
                : null}
              {activeSection === "contact"
                ? language === "es"
                  ? "Opciones directas para contactarnos"
                  : "Direct ways to contact us"
                : null}
            </li>
            <li>
              {language === "es"
                ? "Guardado del progreso en tu cuenta"
                : "Progress saved to your account"}
            </li>
            <li>
              {language === "es"
                ? "Experiencia completa por hijo"
                : "Full experience for each child"}
            </li>
          </ul>
        </div>
        <div className="preview-lock">
          <strong>{language === "es" ? "Función premium" : "Premium feature"}</strong>
          <p>
            {language === "es"
              ? "Desbloquea esta sección para usar el dashboard completo, la rutina de esta noche y el seguimiento."
              : "Unlock this section to use the full dashboard, tonight's routine, and progress tracking."}
          </p>
          <a className="button button-primary button-link" href={SALES_FUNNEL_URL}>
            {language === "es" ? "Comprar premium" : "Purchase premium"}
          </a>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function translateAvoidTitle(value) {
  const map = {
    "Pantallas (especialmente cerca de dormir)": "Screens (especially close to bedtime)",
    "Luz blanca brillante": "Bright white light",
    "Juego muy activo justo antes de dormir": "Very active play right before bed",
    "Azúcar y alimentos estimulantes": "Sugar and stimulating foods",
    "Cafeína aunque sea poquita": "Caffeine, even a little",
    "Comer muy tarde o pesado": "Eating too late or too heavily",
    "Conversaciones estimulantes o emociones intensas": "Stimulating conversations or intense emotions",
    "Actividades mentales muy activas": "Highly activating mental activities",
    "Rutinas inconsistentes": "Inconsistent routines",
  };
  return map[value] || value;
}

function translateAvoidEntry(value) {
  const map = {
    "Tablet, celular o TV": "Tablet, phone, or TV",
    "Videos estimulantes": "Stimulating videos",
    "Juegos electrónicos": "Electronic games",
    "Luces LED blancas intensas": "Bright white LED lights",
    "Iluminación de techo muy brillante": "Very bright overhead lights",
    Correr: "Running",
    Saltar: "Jumping",
    "Juegos competitivos": "Competitive games",
    "Actividades intensas": "Intense activities",
    Dulces: "Candy",
    Postres: "Desserts",
    "Bebidas azucaradas": "Sugary drinks",
    "Chocolate en niños sensibles": "Chocolate in sensitive children",
    "Chocolate oscuro en exceso": "Too much dark chocolate",
    Gaseosas: "Sodas",
    "Té con cafeína": "Caffeinated tea",
    "Cenas muy grandes justo antes de dormir": "Very heavy dinners right before bed",
    "Comer inmediatamente antes de acostarse": "Eating right before lying down",
    Discusiones: "Arguments",
    "Temas que activan emociones fuertes": "Topics that trigger strong emotions",
    "Sobreestimulación verbal": "Too much verbal stimulation",
    "Resolver problemas complejos": "Solving complex problems",
    "Juegos que generan excitación": "Games that create excitement",
    "Cambiar todo cada noche": "Changing everything every night",
    "Horarios totalmente variables": "Completely variable schedules",
  };
  return map[value] || value;
}

function translateAvoidWhy(value) {
  const map = {
    "La luz azul y el contenido activo mantienen el cerebro en modo alerta y retrasan la melatonina.":
      "Blue light and activating content keep the brain alert and delay melatonin.",
    "Le dice al cerebro que todavía es de día.": "It tells the brain that it is still daytime.",
    "Sube cortisol y adrenalina, y activa el sistema nervioso cuando queremos que baje.":
      "It raises cortisol and adrenaline, activating the nervous system when we want it to settle.",
    "Puede subir energía y dificultar la regulación.": "It can raise energy and make regulation harder.",
    "Bloquea la sensación de sueño.": "It blocks the feeling of sleepiness.",
    "El cuerpo sigue en modo digestión y no entra en modo descanso.":
      "The body stays in digestion mode instead of rest mode.",
    "Activa el cerebro y el sistema nervioso.": "It activates the brain and nervous system.",
    "Mantienen la mente encendida.": "They keep the mind switched on.",
    "El cerebro no logra anticipar el sueño.": "The brain cannot predict that sleep is coming.",
  };
  return map[value] || value;
}

function translateAvoidSource(value) {
  const map = {
    "American Academy of Pediatrics y Harvard Medical School: las pantallas antes de dormir se asocian con peor calidad de sueño y menor melatonina.":
      "American Academy of Pediatrics and Harvard Medical School: screens before bed are linked to poorer sleep quality and lower melatonin.",
    "Harvard Health Publishing y National Sleep Foundation: la luz brillante en la noche altera el ritmo circadiano.":
      "Harvard Health Publishing and the National Sleep Foundation: bright light at night disrupts circadian rhythm.",
    "Sleep Foundation y American Academy of Sleep Medicine: la activación intensa cerca de dormir puede dificultar conciliar el sueño.":
      "Sleep Foundation and the American Academy of Sleep Medicine: intense activation close to bedtime can make it harder to fall asleep.",
    "Sleep Foundation: dietas altas en azúcar pueden afectar la calidad del sueño.":
      "Sleep Foundation: high-sugar diets can affect sleep quality.",
    "American Academy of Sleep Medicine: la cafeína interfiere con la capacidad de conciliar el sueño.":
      "American Academy of Sleep Medicine: caffeine interferes with the ability to fall asleep.",
    "Sleep Foundation: comer tarde puede afectar el inicio del sueño.":
      "Sleep Foundation: eating late can affect sleep onset.",
    "National Sleep Foundation: la activación emocional dificulta el inicio del sueño.":
      "National Sleep Foundation: emotional activation makes sleep onset harder.",
    "American Academy of Sleep Medicine: la activación cognitiva retrasa el sueño.":
      "American Academy of Sleep Medicine: cognitive activation delays sleep.",
    "National Sleep Foundation: la consistencia mejora la latencia del sueño.":
      "National Sleep Foundation: consistency improves sleep latency.",
  };
  return map[value] || value;
}

function SubscriptionScreen({ language, strings, userEmail, hasPremiumAccess, onUpgrade, onClose }) {
  const [subInfo, setSubInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userEmail) { setLoading(false); return; }
    import(/* webpackIgnore: true */ "@revenuecat/purchases-capacitor")
      .then(({ Purchases }) => Purchases.getCustomerInfo())
      .then(({ customerInfo }) => {
        const active = customerInfo?.entitlements?.active?.["Premium Buenas Noches"];
        const product = customerInfo?.activeSubscriptions?.[0] || null;
        setSubInfo({ active: !!active, product, expirationDate: active?.expirationDate || null });
      })
      .catch(() => setSubInfo(null))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const isAnnual = subInfo?.product?.includes("anual");
  const expiresAt = subInfo?.expirationDate ? new Date(subInfo.expirationDate).toLocaleDateString(language === "en" ? "en-US" : "es-MX", { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <div style={{ padding: "24px 20px", maxWidth: 420, margin: "0 auto" }}>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--cream)", fontSize: 22, cursor: "pointer", marginBottom: 12 }}>←</button>
      <h2 style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 22, color: "var(--cream)", margin: "0 0 20px" }}>
        {language === "en" ? "My Subscription" : "Mi Suscripción"}
      </h2>

      {loading ? (
        <p style={{ color: "var(--slate)" }}>Cargando...</p>
      ) : hasPremiumAccess ? (
        <div style={{ background: "var(--navy-800)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>⭐</span>
            <div>
              <div style={{ fontWeight: 700, color: "var(--cream)", fontSize: 16 }}>
                {subInfo?.active
                  ? (isAnnual ? (language === "en" ? "Annual Plan" : "Plan Anual") : (language === "en" ? "Monthly Plan" : "Plan Mensual"))
                  : (language === "en" ? "Lifetime Access" : "Acceso de por vida")}
              </div>
              <div style={{ color: "var(--sage)", fontSize: 13 }}>{language === "en" ? "Premium · Active" : "Premium · Activo"}</div>
            </div>
          </div>

          {expiresAt && (
            <p style={{ color: "var(--slate)", fontSize: 13, margin: "0 0 12px" }}>
              {language === "en" ? `Renews: ${expiresAt}` : `Renueva: ${expiresAt}`}
            </p>
          )}

          {subInfo?.active && !isAnnual && (
            <button
              onClick={onUpgrade}
              style={{ width: "100%", background: "var(--coral)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 12 }}
            >
              {language === "en" ? "Upgrade to Annual — Save 45%" : "Cambiar a Plan Anual — Ahorra 45%"}
            </button>
          )}

          <a
            href="https://apps.apple.com/account/subscriptions"
            target="_blank"
            rel="noreferrer"
            style={{ display: "block", textAlign: "center", color: "var(--slate)", fontSize: 13, marginTop: 4 }}
          >
            {language === "en" ? "Manage or cancel in App Store →" : "Administrar o cancelar en App Store →"}
          </a>
        </div>
      ) : (
        <div style={{ background: "var(--navy-800)", borderRadius: 16, padding: 20 }}>
          <p style={{ color: "var(--slate)", marginBottom: 16 }}>
            {language === "en" ? "You don't have an active subscription yet." : "No tienes una suscripción activa aún."}
          </p>
          <button
            onClick={onUpgrade}
            style={{ width: "100%", background: "var(--coral)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
          >
            {language === "en" ? "View Plans" : "Ver Planes"}
          </button>
        </div>
      )}

      <p style={{ color: "var(--slate)", fontSize: 12, textAlign: "center", marginTop: 16 }}>
        {language === "en"
          ? "Subscriptions are managed through Apple. To cancel, visit your App Store account."
          : "Las suscripciones se administran a través de Apple. Para cancelar, visita tu cuenta en el App Store."}
      </p>
    </div>
  );
}

function PaywallScreen({ language, onClose, onPurchaseSuccess, userEmail }) {
  const isEs = language !== "en";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const isNative = typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.();

  async function handlePurchase(type) {
    if (!isNative) {
      window.location.href = "https://buenasnoches.quirokids.com/buenas-noches-app-424830";
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { getOfferings, purchasePackage, hasEntitlement } = await import("../lib/revenuecat");
      const offering = await getOfferings();
      if (!offering) throw new Error("No hay ofertas disponibles");
      const pkg = offering.availablePackages?.find((p) =>
        type === "annual" ? p.packageType === "ANNUAL" : p.packageType === "MONTHLY"
      );
      if (!pkg) throw new Error("Producto no encontrado");
      const info = await purchasePackage(pkg);
      if (hasEntitlement(info)) {
        onPurchaseSuccess?.();
      }
    } catch (e) {
      if (!String(e?.message).includes("userCancelled")) {
        setError(isEs ? "No se pudo completar la compra. Intenta de nuevo." : "Purchase could not be completed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    if (!isNative) return;
    setRestoring(true);
    setError("");
    try {
      const { restorePurchases, hasEntitlement } = await import("../lib/revenuecat");
      const info = await restorePurchases();
      if (hasEntitlement(info)) {
        onPurchaseSuccess?.();
      } else {
        setError(isEs ? "No encontramos una compra activa para restaurar." : "No active purchase found to restore.");
      }
    } catch {
      setError(isEs ? "Error al restaurar. Intenta de nuevo." : "Restore failed. Please try again.");
    } finally {
      setRestoring(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: "var(--navy-950)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "flex-end" }}>
        {onClose && (
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "var(--ink-soft)", cursor: "pointer", padding: 8 }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: "12px 20px 40px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 420, margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌙</div>
          <h1 style={{ fontFamily: "Baloo 2, sans-serif", fontSize: 26, fontWeight: 800, color: "var(--moon)", margin: "0 0 8px" }}>
            {isEs ? "Buenas Noches Premium" : "Buenas Noches Premium"}
          </h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            {isEs
              ? "Rutinas personalizadas, videos de expertos y seguimiento del sueno de tu hijo cada noche."
              : "Personalized routines, expert videos, and your child's sleep tracked every night."}
          </p>
        </div>

        {/* Features */}
        {[
          { icon: "✨", text: isEs ? "Rutina guiada paso a paso cada noche" : "Step-by-step guided routine every night" },
          { icon: "📊", text: isEs ? "Reportes de sueno y latencia" : "Sleep reports and latency tracking" },
          { icon: "🎬", text: isEs ? "Videos de expertos en sueno infantil" : "Expert pediatric sleep videos" },
          { icon: "👶", text: isEs ? "Hasta 3 perfiles de ninos" : "Up to 3 child profiles" },
          { icon: "💬", text: isEs ? "Acceso a la comunidad de padres" : "Access to parent community" },
        ].map((f) => (
          <div key={f.text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
            <span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>{f.text}</span>
          </div>
        ))}

        {/* Price cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Annual */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handlePurchase("annual")}
            style={{
              background: "linear-gradient(135deg, rgba(244,231,178,.18), rgba(244,231,178,.08))",
              border: "2px solid var(--moon)",
              borderRadius: 16,
              padding: "16px 18px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: -10, right: 14, background: "var(--moon)", color: "#16222e", fontSize: 11, fontWeight: 800, borderRadius: 20, padding: "2px 10px" }}>
              {isEs ? "MEJOR VALOR" : "BEST VALUE"}
            </div>
            <div style={{ fontFamily: "Baloo 2, sans-serif", fontWeight: 700, fontSize: 17, color: "var(--moon)", marginBottom: 2 }}>
              {isEs ? "Plan Anual" : "Annual Plan"}
            </div>
            <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>
              $66 / {isEs ? "ano" : "year"} &middot; <span style={{ color: "var(--green)" }}>{isEs ? "Ahorra 45%" : "Save 45%"}</span>
            </div>
          </button>

          {/* Monthly */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handlePurchase("monthly")}
            style={{
              background: "var(--navy-800)",
              border: "1.5px solid rgba(255,248,239,.15)",
              borderRadius: 16,
              padding: "16px 18px",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div style={{ fontFamily: "Baloo 2, sans-serif", fontWeight: 700, fontSize: 17, color: "var(--ink)", marginBottom: 2 }}>
              {isEs ? "Plan Mensual" : "Monthly Plan"}
            </div>
            <div style={{ color: "var(--ink-soft)", fontSize: 13 }}>
              $9.99 / {isEs ? "mes" : "month"}
            </div>
          </button>
        </div>

        {error ? <p style={{ color: "var(--coral)", fontSize: 13, textAlign: "center", margin: 0 }}>{error}</p> : null}
        {loading ? <p style={{ color: "var(--ink-soft)", fontSize: 13, textAlign: "center", margin: 0 }}>{isEs ? "Procesando..." : "Processing..."}</p> : null}

        {/* Restore */}
        {isNative && (
          <button type="button" onClick={handleRestore} disabled={restoring} style={{ background: "none", border: "none", color: "var(--ink-soft)", fontSize: 13, cursor: "pointer", textDecoration: "underline", textAlign: "center" }}>
            {restoring ? (isEs ? "Restaurando..." : "Restoring...") : (isEs ? "Restaurar compra anterior" : "Restore previous purchase")}
          </button>
        )}

        <p style={{ color: "var(--ink-soft)", fontSize: 11, textAlign: "center", lineHeight: 1.6, margin: 0 }}>
          {isEs
            ? "Se renueva automaticamente. Cancela cuando quieras desde Ajustes > Suscripciones en tu iPhone."
            : "Auto-renews. Cancel anytime from Settings > Subscriptions on your iPhone."}
        </p>
      </div>
    </div>
  );
}
