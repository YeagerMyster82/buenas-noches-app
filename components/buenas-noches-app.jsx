"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
  } catch {
    return url;
  }

  return url;
}

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
};

const routineVideoResources = {
  descarga: {
    title: "Descarga",
    embedUrl: "https://player.mediadelivery.net/embed/640174/24082507-a357-46d1-8d8d-fe2c9bc7becd?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  activacion_ligera: {
    title: "Activación ligera",
    embedUrl: "https://player.mediadelivery.net/embed/640174/cfaffd3e-15ea-48f5-acfa-ae49f6cabde1?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  conexion: {
    title: "Conexión",
    embedUrl: "https://player.mediadelivery.net/embed/640174/f4699082-c82e-42ba-9fda-70b6de648b17?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  berrinches_coregulacion: {
    title: "Berrinches / coregulación",
    embedUrl: "https://player.mediadelivery.net/embed/640174/4df00984-616e-49c5-8606-49d95c8df1bf?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  compresiones_articulares: {
    title: "Compresiones articulares",
    embedUrl: "https://player.mediadelivery.net/embed/640174/9b2d2cc7-2121-4890-b5b5-e6faa5b54ac9?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  presion_profunda: {
    title: "Presión profunda",
    embedUrl: "https://player.mediadelivery.net/embed/640174/39b6780f-ea8d-4506-922e-0e58aa5bdcac?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  mecerse_presion: {
    title: "Mecerse + presión profunda",
    embedUrl: "https://player.mediadelivery.net/embed/640174/c5890def-ca84-4a0f-9865-eb2a3da7faac?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  gargaras_tarareo_mmm: {
    title: "Gárgaras / tarareo / sonido mmm",
    embedUrl: "https://player.mediadelivery.net/embed/640174/a2076f69-4634-473c-bde3-dc7e36dc2647?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  ponerse_de_cabeza: {
    title: "Ponerse de cabeza",
    embedUrl: "https://player.mediadelivery.net/embed/640174/eb07e87f-74e8-41f3-8bd7-ee1a0b5352db?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  respiracion_conejo: {
    title: "Respiración de conejo",
    embedUrl: "https://player.mediadelivery.net/embed/640174/3073b08a-8154-42eb-a46d-7e2ea0fd69e0?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  oler_la_flor: {
    title: "Oler la flor",
    embedUrl: "https://player.mediadelivery.net/embed/640174/edfdd25c-33da-42ab-a7f2-b8ba566d7b82?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  movimientos_oculares: {
    title: "Movimientos oculares",
    embedUrl: "https://player.mediadelivery.net/embed/640174/74d90717-a573-4782-bd96-3a59e5ea5d95?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  frase_final: {
    title: "La frase final",
    embedUrl: "https://player.mediadelivery.net/embed/640174/6f05fc06-0479-45e4-a60b-ba15d2f2ca30?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  audios_cortos: {
    title: "Audios cortos",
    embedUrl: "https://player.mediadelivery.net/embed/640174/ec5a4b10-ddca-47d8-b359-b1acad6cfc39?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  pesadilla: {
    title: "Si tiene pesadilla",
    embedUrl: "https://player.mediadelivery.net/embed/640174/739af802-75e4-4c76-9df7-a06d6142d739?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  sistema_nervioso: {
    title: "Sistema nervioso y sueño",
    embedUrl: "https://player.mediadelivery.net/embed/640174/ce4fdb77-61eb-49fd-ba3f-69a13790051d?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
  },
  perfiles_sueno: {
    title: "Los 5 perfiles y por qué no logran dormir",
    embedUrl: "https://player.mediadelivery.net/embed/640174/8d254f44-f6c1-48db-9abf-cb988338763d?autoplay=true&loop=false&muted=false&preload=true&responsive=true",
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

const freeProfileVideoLibrary = [routineVideoResources.perfiles_sueno];

const educationVideoLibrary = [
  routineVideoResources.sistema_nervioso,
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
    createProfileFirst: "Creamos su perfil primero",
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
    sleepGoal: "Meta de sueño",
    seeChildProfile: "Ver el perfil de mi hijo",
    freeAccountTitle: "¡Ya identificamos el perfil de tu hijo!",
    freeAccountCopy: "Crea tu cuenta gratis para ver el resultado y guardar su perfil de sueño para siempre.",
    freeAccountMemory: "Así la app recuerda a tu hijo cada vez que la abres.",
    freeAccountNoSpam: "Sin spam. Solo lo que necesitas para ayudar a tu hijo a dormir mejor.",
    previousQuestion: "Pregunta anterior",
    startQuiz: "Empezar quiz",
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
    readyForBunny: "Lista para conectar con Bunny",
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
    createProfileFirst: "Let's create their profile first",
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
    sleepGoal: "Sleep goal",
    seeChildProfile: "See my child's profile",
    freeAccountTitle: "We identified your child's sleep profile!",
    freeAccountCopy: "Create your free account to see the result and save their sleep profile forever.",
    freeAccountMemory: "That way the app remembers your child every time you open it.",
    freeAccountNoSpam: "No spam. Only what you need to help your child sleep better.",
    previousQuestion: "Previous question",
    startQuiz: "Start quiz",
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
    readyForBunny: "Ready to connect to Bunny",
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
    copy: "El cerebro ama la repetición. Cuando haces lo mismo todas las noches, el cuerpo entiende: “Ah, viene la hora de dormir”.",
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
  onboardingMode: "new-child",
  quizIndex: -1,
  answers: [],
  tieCandidates: null,
  quizResult: null,
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
    soundMode: "transition",
  },
  expandedSwapStep: "",
  editingChildId: "",
  savedLogDate: "",
  wakingPromptLogDate: "",
  profileIntroChildId: "",
  sleepWindowOpen: false,
  sleepWindowCompleted: false,
  premiumRoutineGateOpen: false,
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
  const minutes = timeToMinutes(value);
  // A sleep goal before noon is almost always a wake-up time entered in the wrong place.
  return value && minutes >= 12 * 60 ? value : "";
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
  const nightAwakeMinutes = napCount > 0 && ageYears <= 5 ? 390 : awakeMinutes;
  const firstNapStart = wakeMinutes + Math.min(awakeMinutes, ageYears < 3 ? awakeMinutes : 330);
  const firstNapEnd = firstNapStart + 30;
  const bedtimeStart = Math.max(timeToMinutes("18:30"), Math.min(timeToMinutes("21:00"), wakeMinutes + nightAwakeMinutes - 30));
  const bedtimeEnd = Math.max(timeToMinutes("19:00"), Math.min(timeToMinutes("21:30"), bedtimeStart + 30));

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
  const [adminVisible, setAdminVisible] = useState(false);

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
    { id: "contact", label: strings.contactUs },
    ...(adminVisible ? [{ id: "admin", label: strings.sections.admin }] : []),
  ];
  const profileMap = getProfileMap(state.language);
  const questions = getQuestions(state.language);
  const activeChild = state.children.find((child) => child.id === state.activeChildId) || null;
  const editingChild = state.children.find((child) => child.id === state.editingChildId) || null;
  const resultCopy = state.quizResult ? buildResultCopy(state.quizResult, state.language) : null;
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
      const nextState = {
        ...state,
        activeSection: "home",
        premiumRoutineGateOpen: false,
        routinePreviewOpen: false,
        sleepWindowOpen: false,
        accountLookupOpen: false,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(nextState));
      setState(nextState);
      window.location.href = SALES_FUNNEL_URL;
      return;
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

  function startAddChild() {
    setState((current) => ({
      ...current,
      onboardingMode: "new-child",
      childDraft: { name: "", birthday: "", gender: "boy", sleepGoal: "", takesNap: "no" },
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
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
    };
    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
    setState(nextState);
    window.location.href = SALES_FUNNEL_URL;
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
      activeSection: "home",
      onboardingMode: "",
      childDraft: { name: "", birthday: "", gender: "boy", sleepGoal: "", takesNap: "no" },
      parentName: parentName || current.parentName,
      parentEmail: parentEmail || current.parentEmail,
      parentProfileSaved: true,
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
      profileIntroChildId: child.id,
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
    const updatedLog = {
      date: String(formData.get("date") || originalDate),
      routineStartTime: String(formData.get("routineStartTime") || ""),
      bedTime: String(formData.get("bedTime") || ""),
      sleepTime: String(formData.get("sleepTime") || ""),
      latency: calculateLatency(String(formData.get("bedTime") || ""), String(formData.get("sleepTime") || "")),
      nightWakings: String(formData.get("nightWakings") || "0"),
      notes: String(formData.get("notes") || ""),
      ratings: child.logs.find((log) => log.date === originalDate)?.ratings || [],
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
            inBedAt: updatedLog.bedTime,
            fellAsleepAt: updatedLog.sleepTime,
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

  return (
    <main className="shell app-shell">
      {state.profileIntroChildId ? (
        <ProfileIntroModal
          child={state.children.find((child) => child.id === state.profileIntroChildId)}
          profileMap={profileMap}
          strings={strings}
          language={state.language}
          onClose={() => setState((current) => ({ ...current, profileIntroChildId: "" }))}
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

          {!state.parentProfileSaved && state.activeSection !== "admin" ? (
            <FreeAccountSetup
              strings={strings}
              parentName={state.parentName}
              parentEmail={state.parentEmail}
              onChange={(field, value) => setState((current) => ({ ...current, [field]: value }))}
              onSubmit={saveFreeAccount}
              onAlreadyHaveAccount={() =>
                setState((current) => ({
                  ...current,
                  accountLookupOpen: true,
                  accountLookupMessage: "",
                }))
              }
            />
          ) : state.activeSection !== "admin" && state.activeSection === "child" && (!state.children.length || state.onboardingMode === "new-child") && !state.accountLookupOpen ? (
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

            {state.quizIndex === -1 && !state.quizResult ? (
              <form className="stack" onSubmit={beginQuiz}>
                <p className="lead-copy">
                  {state.language === "es"
                    ? "Puedes usar esta parte gratis para descubrir el perfil de sueño de tu hijo. Después, si quieres, desbloqueas el dashboard completo."
                    : "You can use this part for free to discover your child's sleep profile. Then, if you want, you can unlock the full dashboard."}
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
                    onToggle={() =>
                      setState((current) => ({
                        ...current,
                        accountLookupOpen: true,
                        accountLookupMessage: "",
                      }))
                    }
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

            {resultCopy ? (
              <div className="stack">
                <div className="result-banner result-banner--light">
                  <p>{genderize(strings.freeAccountTitle, state.childDraft.gender)}</p>
                  {state.parentProfileSaved ? (
                    <>
                      <p>
                        {state.childDraft.name} {strings.childFitsProfile}
                      </p>
                      <h3>👉 {resultCopy.primaryName}</h3>
                      <p>{resultCopy.reassurance}</p>
                    </>
                  ) : null}
                </div>
                {state.parentProfileSaved ? (
                  <>
                    <div className="content-block content-block--light">
                      <p>{genderize(resultCopy.primaryDescription, state.childDraft.gender)}</p>
                      <p>{genderize(resultCopy.framework, state.childDraft.gender)}</p>
                    </div>
                    {resultCopy.secondaryName ? (
                      <p className="content-note">
                        {state.language === "es"
                          ? `También veo rasgos de ${resultCopy.secondaryName}, así que puede haber una mezcla de patrones.`
                          : `I also see traits of ${resultCopy.secondaryName}, so there may be a mixed pattern.`}
                      </p>
                    ) : null}
                    <button className="button button-primary" type="button" onClick={saveChildProfile}>
                      {state.language === "es" ? "Guardar este perfil" : "Save this profile"}
                    </button>
                  </>
                ) : (
                  <form className="stack account-capture" onSubmit={saveChildProfile}>
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
                )}
                </div>
              ) : null}
              </article>
            </>
          ) : state.activeSection === "home" ? (
            <>
              <HomeQuickCards
                strings={strings}
                activeChild={activeChild}
                onOpenSleepWindow={() => setState((current) => ({ ...current, sleepWindowOpen: true }))}
                onOpenRoutine={() => requestRoutine(activeChild?.id)}
                onOpenSleep={() => setState((current) => ({ ...current, activeSection: "sleep" }))}
                onOpenTips={() => setState((current) => ({ ...current, activeSection: "tips" }))}
                onOpenWins={() => setState((current) => ({ ...current, activeSection: "wins" }))}
              />
              {state.persistenceMessage ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}
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
              {state.persistenceMessage ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}
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
              onChange={(field, value) => setState((current) => ({ ...current, [field]: value }))}
              onSave={saveParentSettings}
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

          {state.activeSection !== "admin" && (!state.children.length || state.onboardingMode === "new-child") && !state.accountLookupOpen ? (
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
                        onToggle={() =>
                          setState((current) => ({
                            ...current,
                            accountLookupOpen: true,
                            accountLookupMessage: "",
                          }))
                        }
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

              {state.persistenceMessage ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}

              {state.activeSection === "home" ? (
                <HomeQuickCards
                  strings={strings}
                  activeChild={activeChild}
                  onOpenSleepWindow={() => setState((current) => ({ ...current, sleepWindowOpen: true }))}
                  onOpenRoutine={() => requestRoutine(activeChild?.id)}
                  onOpenSleep={() => setState((current) => ({ ...current, activeSection: "sleep" }))}
                  onOpenTips={() => setState((current) => ({ ...current, activeSection: "tips" }))}
                  onOpenWins={() => setState((current) => ({ ...current, activeSection: "wins" }))}
                />
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
                <RoutineSection
                  activeChild={activeChild}
                  strings={strings}
                  profileMap={profileMap}
                  routineForm={state.routineForm}
                  currentPlan={state.currentPlan}
                  routinePreviewOpen={state.routinePreviewOpen}
                  routineSession={state.routineSession}
                  onRoutineFieldChange={updateRoutineField}
                  onGenerateRoutine={generateRoutine}
                  onClose={() => setState((current) => ({ ...current, activeSection: "home", expandedChildId: activeChild?.id || current.expandedChildId }))}
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
                />
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
                  onChange={(field, value) => setState((current) => ({ ...current, [field]: value }))}
                  onSave={saveParentSettings}
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
  return (
    <header className="app-topbar">
      <div className="child-select">
        <select
          value={activeChild?.id || ""}
          onChange={(event) => event.target.value === "add" ? onAddChild() : onSelectChild(event.target.value)}
          aria-label="Seleccionar niño"
        >
          {children.length ? (
            children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name || "Niño"}
              </option>
            ))
          ) : (
            <option value="">{strings.sections.child}</option>
          )}
          <option value="add">+ Agregar niño</option>
        </select>
      </div>
      <img className="app-topbar-logo" src="/brand/logo-buenas-noches.png" alt="Buenas Noches" />
      <div className="app-topbar-actions">
        <button className="icon-button app-icon-button" type="button" onClick={onAddChild} aria-label="Agregar niño">
          +
        </button>
        <button className="icon-button app-icon-button" type="button" onClick={onOpenMessages} aria-label="Mensajes">
          ✉
        </button>
        <button className="icon-button app-icon-button" type="button" onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </button>
      </div>
    </header>
  );
}

function BottomAppNav({ options, activeSection, onSelect }) {
  const icons = {
    home: { type: "svg", svg: "home" },
    reports: { type: "svg", svg: "reports" },
    routine: { type: "text", value: "☾" },
    child: { type: "svg", svg: "child" },
    videos: { type: "svg", svg: "video" },
    purchase: { type: "text", value: "★" },
  };

  function renderSvgIcon(name) {
    if (name === "home") {
      return (
        <svg className="bottom-app-nav__svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5 12 5l8 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 10.5V19h10v-8.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    if (name === "reports") {
      return (
        <svg className="bottom-app-nav__svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="5" width="3" height="14" rx="1.2" fill="currentColor" />
          <rect x="10.5" y="8" width="3" height="11" rx="1.2" fill="currentColor" />
          <rect x="16" y="3.5" width="3" height="15.5" rx="1.2" fill="currentColor" />
        </svg>
      );
    }

    if (name === "child") {
      return (
        <svg className="bottom-app-nav__svg" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.1" />
          <path d="M7.2 18.5c.9-2.5 2.5-3.8 4.8-3.8s3.9 1.3 4.8 3.8" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
      );
    }

    if (name === "video") {
      return (
        <svg className="bottom-app-nav__svg" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="6.5" width="11.5" height="11" rx="2.2" fill="none" stroke="currentColor" strokeWidth="2.1" />
          <path d="M15.5 10.2 20 7.8v8.4l-4.5-2.4" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    return <span aria-hidden="true">•</span>;
  }

  return (
    <nav className="bottom-app-nav" aria-label="Navegación principal">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={activeSection === option.id ? "bottom-app-nav__item is-active" : "bottom-app-nav__item"}
          onClick={() => onSelect(option.id)}
        >
          {icons[option.id]?.type === "svg" ? (
            renderSvgIcon(icons[option.id].svg)
          ) : (
            <span aria-hidden="true">{icons[option.id]?.value || "•"}</span>
          )}
          <small>{option.label}</small>
        </button>
      ))}
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
        `No es que no quiera dormir. Es que su sistema nervioso está atrapado en un estado de alerta que no puede soltar solo. El cuerpo dice “descansa” pero algo más profundo dice “todavía no es seguro.”`,
        `Por eso puedes apagar las luces, hacer silencio, hacer todo “bien”, y seguir ahí cuarenta minutos después esperando que finalmente cierre los ojos.`,
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

function HomeQuickCards({ strings, onOpenRoutine, onOpenSleep, onOpenTips, onOpenWins }) {
  return (
    <section className="home-card-grid">
      <button className="home-action-card" type="button" onClick={onOpenRoutine}>
        <span className="home-card-icon">◷</span>
        <strong>{strings.sections.routine}</strong>
        <small>Generar rutina para hoy</small>
      </button>
      <button className="home-action-card" type="button" onClick={onOpenSleep}>
        <span className="home-card-icon">▥</span>
        <strong>{strings.sleepTracker}</strong>
        <small>Registrar cuánto tarda en dormir</small>
      </button>
      <button className="home-action-card" type="button" onClick={onOpenTips}>
        <span className="home-card-icon">✦</span>
        <strong>{strings.sections.tips}</strong>
        <small>Ideas rápidas para mejorar la noche</small>
      </button>
      <button className="home-action-card" type="button" onClick={onOpenWins}>
        <span className="home-card-icon">★</span>
        <strong>{strings.publicWinsWall}</strong>
        <small>Celebrar avances</small>
      </button>
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

function ParentSettingsSection({ strings, parentName, parentLastName, parentEmail, parentPhotoUrl, onChange, onSave }) {
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
      <form className="stack" onSubmit={onSave}>
        <div className="profile-photo-editor">
          <div className="profile-photo-preview">
            {parentPhotoUrl ? <img src={parentPhotoUrl} alt="" /> : <span>{parentName?.slice(0, 1) || "?"}</span>}
          </div>
          <label className="stack compact">
            <span>Foto para el muro de logros</span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
          {parentPhotoUrl ? (
            <button className="button button-ghost" type="button" onClick={() => onChange("parentPhotoUrl", "")}>
              Quitar foto
            </button>
          ) : null}
        </div>
        <label className="stack compact">
          <span>{strings.parentName}</span>
          <input type="text" value={parentName} onChange={(event) => onChange("parentName", event.target.value)} required />
        </label>
        <label className="stack compact">
          <span>{strings.parentLastName}</span>
          <input type="text" value={parentLastName} onChange={(event) => onChange("parentLastName", event.target.value)} />
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
      meetsMinimumSleep: totalSleepHours !== null && totalSleepHours >= minimumSleepHours,
    };
  });

  const maxLatency = Math.max(45, ...days.map((day) => day.latency || 0));
  const maxWakings = Math.max(3, ...days.map((day) => day.wakings || 0));

  return {
    days,
    maxLatency,
    maxWakings,
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

  return (
    <div className="dashboard-grid dashboard-grid--single">
      <article className="card card--feature dashboard-card dashboard-profile-card">
        {onCollapse ? (
          <button className="icon-button dashboard-collapse-button" type="button" onClick={onCollapse} aria-label="Cerrar dashboard">
            ⌃
          </button>
        ) : null}
        <header className="dashboard-profile-header">
          {avatar ? (
            <img className="profile-animal profile-animal--dashboard" src={avatar.src} alt={avatar.alt} />
          ) : null}
          <div className="dashboard-name-row">
            <h1>{activeChild.name}</h1>
            {!isReportsMode ? (
              <button className="icon-button dashboard-name-edit" type="button" onClick={onEditProfile} aria-label={`${strings.editProfile} ${activeChild.name}`}>
                ✎
              </button>
            ) : null}
          </div>
          <p>Perfil: {profileName}</p>
        </header>
        <div className="summary-grid">
          {isReportsMode ? (
            <>
              <Stat label={strings.age} value={formatAgeLabel(activeChild.birthday, strings.age === "Age" ? "en" : "es")} />
              <Stat label="Última noche" value={lastLog?.date || "--"} />
              <Stat label="A la cama" value={lastLog?.bedTime || "--:--"} />
              <Stat label="Luces apagadas" value={lastLog?.routineEndTime || "--:--"} />
              <Stat label="Tiempo para dormir" value={lastLog ? `${lastLog.latency || 0} min` : "--"} />
            </>
          ) : (
            <>
              <Stat label={strings.age} value={formatAgeLabel(activeChild.birthday, strings.age === "Age" ? "en" : "es")} />
              <Stat label={strings.gender} value={childGenderLabel(activeChild.gender, strings.age === "Age" ? "en" : "es")} />
              <Stat label={strings.sleepNeed} value={getRecommendedSleepHours(activeChild.birthday, strings.age === "Age" ? "en" : "es")} />
              <Stat label={strings.sleepGoal} value={activeChild.sleepGoal || "--:--"} />
            </>
          )}
        </div>
        {!isReportsMode && profileDescription ? <p className="profile-description">{profileDescription}</p> : null}

        {isReportsMode && lastActivityRatings.length ? (
          <div className="activity-feedback-card">
            <strong>¿Le gustaron estas actividades?</strong>
            <p className="muted">Por defecto quedan como “sí”. Si marcas “no”, la app evita sugerirla automáticamente en la próxima rutina, pero seguirá disponible en el menú.</p>
            {lastActivityRatings.map((rating) => (
              <label className="stack compact" key={`${lastLog.date}-${rating.stepId}`}>
                <span>
                  {rating.stepLabel || rating.activity}
                  {rating.start && rating.end ? ` · ${rating.start} - ${rating.end}` : ""}
                </span>
                <select
                  value={rating.disliked ? "no" : "yes"}
                  onChange={(event) => onUpdateActivityEnjoyment?.(lastLog.date, rating, event.target.value)}
                >
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </label>
            ))}
          </div>
        ) : null}

        {isReportsMode ? (
        <section className={weeklyChart.empty ? "chart-panel dashboard-chart chart-panel--empty" : "chart-panel dashboard-chart"}>
          <div className="chart-heading">
            <div>
              <span className="section-label">Progreso</span>
              <h2>7 días</h2>
            </div>
            <div className="chart-arrows">
              <button type="button" onClick={() => setWeekOffset((offset) => offset - 1)} aria-label="Ver semana anterior">
                ‹
              </button>
              <button type="button" onClick={() => setWeekOffset((offset) => Math.min(0, offset + 1))} disabled={!weeklyChart.canGoForward} aria-label="Ver semana siguiente">
                ›
              </button>
            </div>
          </div>
          <div className="chart-legend" aria-label="Leyenda del gráfico">
            <span><i className="legend-bar" /> Hora en cama → hora dormido</span>
          </div>
          <NightSleepTimelineChart days={weeklyChart.days} onEditDay={setEditingLogDate} />
          <div className="wakeups-chart">
            <div className="chart-legend" aria-label="Despertares nocturnos">
              <span><i className="legend-wake" /> Despertares nocturnos</span>
            </div>
            <div className="wakeups-bars">
              {weeklyChart.days.map((day) => (
                <div className="wakeups-day" key={`wake-${day.dateKey}`}>
                  <div className="wakeups-track">
                    <div className="wakeups-fill" style={{ height: `${Math.max(6, (day.wakings / weeklyChart.maxWakings) * 100)}%` }} />
                  </div>
                  <strong>{day.wakings}</strong>
                  <span>{day.label}</span>
                </div>
              ))}
            </div>
          </div>
          {weeklyChart.empty ? (
            <p className="muted">
              {strings.age === "Age"
                ? "Your saved nights will fill this graph."
                : "Tus noches guardadas van a llenar este gráfico."}
            </p>
          ) : null}
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
                <span>{strings.bedTime}</span>
                <input name="bedTime" type="time" defaultValue={editingLog.bedTime} required />
              </label>
              <label className="stack compact">
                <span>{strings.sleepTime}</span>
                <input name="sleepTime" type="time" defaultValue={editingLog.sleepTime} required />
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

function startAmbientSound(soundMode) {
  if (!soundMode || soundMode === "silent" || soundMode === "transition") return null;
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

function RoutineSection({
  activeChild,
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
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [videoModal, setVideoModal] = useState(null);
  const hasPlayedEndToneRef = useRef(false);
  const ambientSoundRef = useRef(null);
  const playerStep = currentPlan?.steps?.[routineStepIndex] || null;
  const playerStepVideos = getRoutineVideosForStep(playerStep, currentPlan?.profile);
  const activeMusicTrack = routineMusicTracks[routineSession.soundMode] || null;
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
  const isUntimedPlayerStep = playerStep ? untimedRoutinePhases.includes(playerStep.phaseKey) : false;

  useEffect(() => {
    if (!playerStep) return;
    setSecondsLeft(getStepDurationSeconds(playerStep));
    hasPlayedEndToneRef.current = false;
  }, [playerStep?.id]);

  useEffect(() => {
    if (!routinePlayerOpen || isPaused || !playerStep || isUntimedPlayerStep) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          if (!hasPlayedEndToneRef.current) {
            playTransitionTone(routineSession.soundMode);
            hasPlayedEndToneRef.current = true;
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [routinePlayerOpen, isPaused, playerStep, isUntimedPlayerStep, routineSession.soundMode]);

  useEffect(() => {
    return () => {
      ambientSoundRef.current?.stop();
      ambientSoundRef.current = null;
    };
  }, []);

  function stopAmbientSound() {
    ambientSoundRef.current?.stop();
    ambientSoundRef.current = null;
  }

  function restartAmbientSound(soundMode = routineSession.soundMode) {
    stopAmbientSound();
    ambientSoundRef.current = startAmbientSound(soundMode);
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
    onRoutineSessionChange({ startedAt });
    setRoutineStepIndex(0);
    setIsPaused(false);
    setRoutinePlayerOpen(true);
    restartAmbientSound(routineSession.soundMode);
    onClosePreview();
  }

  function finishGuidedRoutine() {
    const inBedAt = routineSession.inBedAt || getCurrentTimeValue();
    onRoutineSessionChange({ inBedAt });
    setRoutinePlayerOpen(false);
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
    stopAmbientSound();
  }

  return (
    <div className="dashboard-grid">
      <article className="card card--soft">
        <div className="card-header">
          <div>
            <span className="section-label">{strings.tonightRoutine}</span>
            <h2>{strings.mapNight} {activeChild.name}</h2>
          </div>
          <button className="button button-ghost" type="button" onClick={onClose}>
            {strings.backToChildren}
          </button>
        </div>
        <form className="stack" onSubmit={onGenerateRoutine}>
          <label className="stack compact">
            <span>{strings.wakeTime}</span>
            <input type="time" value={routineForm.wakeTime} onChange={(event) => onRoutineFieldChange("wakeTime", event.target.value)} required />
          </label>
          {idealSleepWindow ? (
            <div className="content-block content-block--light">
              <strong>
                Basado en la edad de {activeChild.name} y la hora a la que despertó, la hora ideal para dormir hoy es entre {idealSleepWindow}.
              </strong>
            </div>
          ) : null}
          <label className="stack compact">
            <span>{strings.targetBedtime}</span>
            <input
              type="time"
              value={routineForm.targetBedtime}
              onChange={(event) => onRoutineFieldChange("targetBedtime", event.target.value)}
              required
            />
          </label>
          <label className="stack compact">
            <span>{strings.dinnerTime}</span>
            <input type="time" value={routineForm.dinnerTime} onChange={(event) => onRoutineFieldChange("dinnerTime", event.target.value)} />
            <small className="field-help">{strings.dinnerShared}</small>
          </label>
          <label className="stack compact">
            <span>{strings.prepareDuration}</span>
            <input
              type="number"
              min="5"
              max="90"
              step="5"
              value={routineForm.prepareDuration}
              onChange={(event) => onRoutineFieldChange("prepareDuration", event.target.value)}
              required
            />
            <small className="field-help">{strings.prepareDurationHelp}</small>
          </label>
          {activeChild.takesNap === "yes" ? (
            <label className="stack compact">
              <span>{strings.napQuestion}</span>
              <select value={routineForm.napTaken} onChange={(event) => onRoutineFieldChange("napTaken", event.target.value)}>
                <option value="no">{strings.no}</option>
                <option value="yes">{strings.yes}</option>
              </select>
            </label>
          ) : null}
          {activeChild.takesNap === "yes" && routineForm.napTaken === "yes" ? (
            <label className="stack compact">
              <span>{strings.napWakeTime}</span>
              <input
                type="time"
                value={routineForm.napWakeTime}
                onChange={(event) => onRoutineFieldChange("napWakeTime", event.target.value)}
                required
              />
            </label>
          ) : null}
          <button className="button button-primary" type="submit">
            {strings.generateRoutine}
          </button>
        </form>
      </article>

      {currentPlan ? (
        <>
          {routinePreviewOpen ? (
            <div className="routine-modal" role="dialog" aria-modal="true" aria-label={strings.routinePreviewTitle}>
              <div className="routine-modal__panel">
                <button className="routine-modal__close" type="button" onClick={onClosePreview}>
                  ×
                </button>
                <span className="section-label">{strings.tonightRoutine}</span>
                <h2>{strings.routinePreviewTitle}</h2>
                <p>{strings.routinePreviewCopy}</p>
                <div className="summary-grid">
                  <Stat label="Cena" value={currentPlan.dinnerTime} />
                  <Stat label="Empezar rutina" value={currentPlan.routineStart} />
                  <Stat label="En cama" value={currentPlan.bedtime} />
                  <Stat label="Meta dormido" value={currentPlan.targetBedtime} />
                </div>
                <div className="stack compact">
                  {currentPlan.steps.slice(0, 4).map((step) => (
                    <div className="routine-preview-step" key={step.id}>
                      <strong>{step.label}</strong>
                      <span>
                        {step.selectedActivity?.displayName ||
                          step.guidance?.title ||
                          step.preparationItems?.map((item) => item.displayName).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
                <label className="stack compact">
                  <span>{strings.soundMode}</span>
                  <select
                    value={routineSession.soundMode}
                    onChange={(event) => {
                      onRoutineSessionChange({ soundMode: event.target.value });
                      if (routinePlayerOpen && !isPaused) {
                        restartAmbientSound(event.target.value);
                      }
                    }}
                  >
                    <option value="transition">{strings.soundTransition}</option>
                    <option value="calm">{strings.soundCalm}</option>
                    <option value="nature">{strings.soundNature}</option>
                    <option value="track3">{strings.soundTrackThree}</option>
                    <option value="silent">{strings.soundSilent}</option>
                  </select>
                </label>
                {activeMusicTrack ? (
                  <div className="music-track-preview">
                    <strong>{activeMusicTrack.label}</strong>
                    <span>Se reproducirá dentro de la rutina.</span>
                  </div>
                ) : null}
                <button className="button button-primary" type="button" onClick={beginGuidedRoutine}>
                  {strings.beginRoutine}
                </button>
              </div>
            </div>
          ) : null}

          <article className="card card--feature">
            <div className="card-header">
              <span className="section-label">Plan de hoy</span>
              <h2>{activeChild.name}</h2>
            </div>
              <div className="summary-grid">
                <Stat label="Cena" value={currentPlan.dinnerTime} />
                <Stat label="Empezar rutina" value={currentPlan.routineStart} />
                <Stat label="En cama" value={currentPlan.bedtime} />
                <Stat label="Meta dormido" value={currentPlan.targetBedtime} />
                <Stat label="Tiempo esperado para dormir" value={`${currentPlan.expectedLatency} min`} />
              <Stat label="Perfil" value={profileMap[activeChild.primaryProfile]?.name} />
            </div>
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                beginGuidedRoutine();
              }}
            >
              {strings.openGuidedRoutine}
            </button>
            <div className="stack">
              {currentPlan.steps.map((step) => (
                <div className="step-card" key={step.id}>
                  <div className="step-topline">
                    <strong>{step.label}</strong>
                    <span>
                      {step.start} - {step.end}
                    </span>
                  </div>
                  <p className="step-copy">{step.purpose}</p>

                  {step.preparationItems ? (
                    <div className="special-guidance">
                      <strong>Lista para preparar el cuerpo</strong>
                      <ul className="mini-list">
                        {step.preparationItems.map((item) => (
                          <li key={item.id}>
                            <strong>{item.displayName}:</strong> {item.instructions}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : step.selectedActivity ? (
                    <>
                      <div className="selected-activity">
                        <strong>{step.selectedActivity.displayName}</strong>
                        <span>{step.selectedActivity.shortLabel}</span>
                        <p>{step.selectedActivity.instructions}</p>
                      </div>
                      {getRoutineVideosForStep(step, currentPlan.profile).length ? (
                        <div className="video-resource-row">
                          {getRoutineVideosForStep(step, currentPlan.profile).map((video) => (
                            <button
                              key={`${step.id}-${video.title}`}
                              className="button button-ghost"
                              type="button"
                              onClick={() => setVideoModal(video)}
                            >
                              Video: {video.title}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      <button className="button button-ghost" type="button" onClick={() => onToggleSwapStep(step.id)}>
                        {strings.changeActivity}
                      </button>
                      {expandedSwapStep === step.id ? (
                        <label className="stack compact">
                          <span>{strings.samePhaseOptions}</span>
                          <select value={step.selectedActivityId} onChange={(event) => onChangeActivity(step.id, event.target.value)}>
                            {step.alternatives.map((activity) => (
                              <option key={activity.id} value={activity.id}>
                                {activity.displayName}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                    </>
                  ) : (
                    <div className="special-guidance">
                      <strong>{step.guidance?.title}</strong>
                      <p>{step.guidance?.guidance}</p>
                      <ul className="mini-list">
                        {step.guidance?.examples?.map((example) => (
                          <li key={example}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!step.selectedActivity && getRoutineVideosForStep(step, currentPlan.profile).length ? (
                    <div className="video-resource-row">
                      {getRoutineVideosForStep(step, currentPlan.profile).map((video) => (
                        <button
                          key={`${step.id}-${video.title}`}
                          className="button button-ghost"
                          type="button"
                          onClick={() => setVideoModal(video)}
                        >
                          Video: {video.title}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          {routinePlayerOpen && playerStep ? (
            <div className="routine-modal" role="dialog" aria-modal="true" aria-label="Rutina guiada">
              <div className="routine-modal__panel">
                <button
                  className="routine-modal__close"
                  type="button"
                  onClick={() => {
                    setRoutinePlayerOpen(false);
                    stopAmbientSound();
                  }}
                >
                  ×
                </button>
                <span className="section-label">
                  Paso {routineStepIndex + 1} de {currentPlan.steps.length}
                </span>
                <h2>{playerStep.label}</h2>
                <p className="muted">
                  {playerStep.start} - {playerStep.end}
                </p>
                <div className="routine-timer">
                  <strong>
                    {playerStep.selectedActivity?.displayName || playerStep.guidance?.title || "Preparar para dormir"}
                  </strong>
                  <span>{playerStep.selectedActivity?.shortLabel || playerStep.purpose}</span>
                  {isUntimedPlayerStep ? (
                    <strong className="routine-countdown routine-countdown--manual">Sin timer</strong>
                  ) : (
                    <strong className="routine-countdown">{formatTimer(secondsLeft)}</strong>
                  )}
                </div>
                {playerStep.phaseKey === "dormir" ? (
                  <div className="sleep-readiness-card sleep-readiness-card--blue">
                    <strong>Tiempo en cama</strong>
                    <p>
                      La app empieza a contar desde que marcaste “A la cama”. Cuando tu hijo se duerma, toca el
                      botón para registrar esta noche.
                    </p>
                    <div className="summary-grid">
                      <Stat label={strings.bedTime} value={routineSession.inBedAt || "--:--"} />
                      <div className="stat-card sleep-save-stat">
                        <span>{strings.sleepTime}</span>
                        <strong>{routineSession.fellAsleepAt || "--:--"}</strong>
                        <button className="button button-primary" type="button" onClick={saveChildAsleep}>
                          Mi hijo ya se durmió
                        </button>
                      </div>
                    </div>
                    <p className="muted">
                      Si todavía necesita que mamá o papá estén cerca para dormirse, eso es normal. Primero buscamos
                      que se duerma en 15 minutos o menos de forma consistente; después trabajamos la retirada gradual.
                    </p>
                  </div>
                ) : null}
                {playerStep.phaseKey !== "dormir" ? <p>{playerStep.selectedActivity?.instructions || playerStep.guidance?.guidance}</p> : null}
                {playerStepVideos.length ? (
                  <div className="video-resource-row">
                    {playerStepVideos.map((video) => (
                      <button
                        key={`${playerStep.id}-${video.title}`}
                        className="button button-ghost"
                        type="button"
                        onClick={() => setVideoModal(video)}
                      >
                        Video: {video.title}
                      </button>
                    ))}
                  </div>
                ) : null}
                {playerStep.phaseKey !== "dormir" && playerStep.selectedActivity ? (
                  <label className="stack compact">
                    <span>{strings.changeActivity}</span>
                    <select value={playerStep.selectedActivityId} onChange={(event) => onChangeActivity(playerStep.id, event.target.value)}>
                      {playerStep.alternatives.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                          {activity.displayName}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                {playerStep.phaseKey !== "dormir" && playerStep.preparationItems?.length ? (
                  <ul className="mini-list">
                    {playerStep.preparationItems.map((item) => (
                      <li key={item.id}>
                        <strong>{item.displayName}:</strong> {item.instructions}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {playerStep.phaseKey !== "dormir" && playerStep.guidance?.examples?.length ? (
                  <ul className="mini-list">
                    {playerStep.guidance.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                ) : null}
                {playerStep.phaseKey === "calmar_el_cuerpo" ? (
                  <div className="sleep-readiness-card">
                    <strong>¿Ya ves señales de sueño?</strong>
                    <p>Ojos pesados, cuerpo relajado, menos movimiento, deja de hablar o respiración más lenta.</p>
                    <div className="inline-actions">
                      <button
                        className="button button-primary"
                        type="button"
                        onClick={() => {
                          const dormirIndex = currentPlan.steps.findIndex((step) => step.phaseKey === "dormir");
                          playTransitionTone(routineSession.soundMode);
                          setRoutineStepIndex(dormirIndex >= 0 ? dormirIndex : currentPlan.steps.length - 1);
                        }}
                      >
                        Sí, ya está listo
                      </button>
                      <button className="button button-ghost" type="button" onClick={() => playTransitionTone(routineSession.soundMode)}>
                        No todavía
                      </button>
                    </div>
                    <p className="muted">Si ya está listo… no hagas más.</p>
                  </div>
                ) : null}
                {!isLastRoutineStep ? (
                  <div className="inline-actions routine-compact-controls routine-compact-controls--single">
                    <button
                      className="button button-ghost"
                      type="button"
                      disabled={routineStepIndex === 0}
                      onClick={() => setRoutineStepIndex((index) => Math.max(0, index - 1))}
                      aria-label="Anterior"
                    >
                      ←
                    </button>
                    <button
                      className="button button-ghost"
                      type="button"
                      onClick={() => {
                        setIsPaused((paused) => {
                          if (paused) {
                            restartAmbientSound(routineSession.soundMode);
                          } else {
                            stopAmbientSound();
                          }
                          return !paused;
                        });
                      }}
                      aria-label={isPaused ? strings.resumeRoutine : strings.pauseRoutine}
                    >
                      {isPaused ? "▶" : "⏸"}
                    </button>
                    <button
                      className="button button-ghost"
                      type="button"
                      onClick={() => {
                        hasPlayedEndToneRef.current = false;
                        setSecondsLeft((current) => current + 120);
                      }}
                    >
                      +2m
                    </button>
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={() => {
                          playTransitionTone(routineSession.soundMode);
                          if (playerStep.phaseKey === "a_la_cama") {
                            onRoutineSessionChange({ inBedAt: routineSession.inBedAt || getCurrentTimeValue() });
                          }
                          if (currentPlan.steps[routineStepIndex + 1]?.phaseKey === "dormir") {
                            onRoutineSessionChange({ routineEndTime: routineSession.routineEndTime || getCurrentTimeValue() });
                          }
                          setRoutineStepIndex((index) => index + 1);
                        }}
                      >
                      Siguiente
                    </button>
                  </div>
                ) : null}
                {activeMusicTrack && !isPaused ? (
                  <div className="music-embed-card">
                    <strong>{activeMusicTrack.label}</strong>
                    <span>Reproduciendo audio en segundo plano.</span>
                  </div>
                ) : null}
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
                <div className="embedded-video">
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

          <article className="card card--soft">
            <div className="card-header">
              <span className="section-label">Resumen de rutina</span>
              <h2>{savedLogDate ? "Rutina registrada exitosamente" : "Revisa y registra esta rutina"}</h2>
            </div>
            {savedLogDate ? (
              <div className="save-confirmation">
                <strong>Guardado. Esta noche quedó registrada exitosamente.</strong>
                <p>
                  {strings.age === "Age"
                    ? "Your progress graph has been updated."
                    : "El gráfico de progreso ya fue actualizado."}
                </p>
                <button className="button button-primary" type="button" onClick={onClose}>
                  {strings.backToChildren}
                </button>
              </div>
            ) : (
            <form className="stack" onSubmit={onSubmitNightLog}>
              <div className="content-block content-block--light">
                <p>
                  {routineSession.inBedAt
                    ? `La app registró que entró a la cama a las ${routineSession.inBedAt}.`
                    : "Cuando termines la rutina guiada, la app registrará automáticamente la hora de cama."}
                </p>
                <p className="muted">{strings.editTimesHelp}</p>
              </div>
              <details className="avoid-card">
                <summary>Editar horas registradas</summary>
                <div className="avoid-card__body">
                  <label className="stack compact">
                    <span>{strings.routineStartTime}</span>
                    <input
                      name="routineStartTime"
                      type="time"
                      value={routineSession.startedAt}
                      onChange={(event) => onRoutineSessionChange({ startedAt: event.target.value })}
                    />
                  </label>
                  <label className="stack compact">
                    <span>{strings.bedTime}</span>
                    <input
                      name="bedTime"
                      type="time"
                      value={routineSession.inBedAt}
                      onChange={(event) => onRoutineSessionChange({ inBedAt: event.target.value })}
                      required
                    />
                  </label>
                  <label className="stack compact">
                    <span>{strings.sleepTime}</span>
                    <input
                      name="sleepTime"
                      type="time"
                      value={routineSession.fellAsleepAt}
                      onChange={(event) => onRoutineSessionChange({ fellAsleepAt: event.target.value })}
                      required
                    />
                  </label>
                </div>
              </details>
              <label className="stack compact">
                <span>{strings.date}</span>
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
              </label>
              {currentPlan.steps
                .filter((step) => step.selectedActivity)
                .map((step) => (
                  <div className="rating-card" key={step.id}>
                    <strong>{step.selectedActivity.displayName}</strong>
                    <span className="muted">{step.label}</span>
                    <label className="stack compact">
                      <span>¿Tu hijo disfrutó esta actividad?</span>
                      <select name={`enjoyed-${step.id}`} defaultValue="yes">
                        <option value="yes">Sí</option>
                        <option value="no">No</option>
                      </select>
                    </label>
                    <details>
                      <summary>Si no le gustó, ¿qué parte no le gustó?</summary>
                      <textarea name={`dislike-reason-${step.id}`} placeholder="Ejemplo: no le gustó la presión, el cuento, la canción o la posición." />
                    </details>
                  </div>
                ))}

              <label className="stack compact">
                <span>{strings.notes}</span>
                <textarea name="notes" placeholder="¿Algo importante de esta noche?" />
              </label>
              <button className="button button-primary" type="submit">
                {strings.saveResults}
              </button>
            </form>
            )}
            {safetyTriggered ? (
              <div className="safety-card">
                Lo que me estás contando va más allá de lo que esta herramienta puede orientar. Merece una evaluación
                directa con un profesional que pueda ver a tu hijo en persona.
              </div>
            ) : null}
          </article>
        </>
      ) : null}
    </div>
  );
}

function VideoSection({ activeChild, strings, locked = false }) {
  if (!activeChild) return null;

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.videoLibrary}</span>
        <h2>{strings.readyForBunny}</h2>
      </div>
      <p className="lead-copy">
        {locked
          ? "Puedes ver toda la biblioteca disponible. Los videos completos se desbloquean con premium."
          : "Aquí tienes todos los videos cargados hasta ahora, organizados por educación y actividades."}
      </p>

      <div className="video-library-section">
        <div className="card-header">
          <span className="section-label">Perfiles</span>
          <h3>Acceso gratis</h3>
        </div>
        <div className="video-library-grid">
          {freeProfileVideoLibrary.map((video) => (
            <div key={`profiles-${video.title}`} className="video-library-card">
              <div className="video-library-card__header">
                <BrandIcon type="child" />
                <strong>{video.title}</strong>
              </div>
              <div className="embedded-video">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="video-library-section">
        <div className="card-header">
          <span className="section-label">{strings.education}</span>
          <h3>Videos educativos</h3>
        </div>
        <div className="video-library-grid">
          {educationVideoLibrary.map((video) => (
            <div key={`education-${video.title}`} className={locked ? "video-library-card tip-card tip-card--locked" : "video-library-card"}>
              <div className="video-library-card__header">
                <BrandIcon type="books" />
                <strong>{video.title}</strong>
              </div>
              {locked ? (
                <p>Disponible con premium 🔒</p>
              ) : (
                <div className="embedded-video">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="video-library-section">
        <div className="card-header">
          <span className="section-label">NeuroHacks</span>
          <h3>Actividades</h3>
        </div>
        <div className="video-library-grid">
          {activityVideoLibrary.map((video) => (
            <div key={`activity-${video.title}`} className={locked ? "video-library-card tip-card tip-card--locked" : "video-library-card"}>
              <div className="video-library-card__header">
                <BrandIcon type="brain" />
                <strong>{video.title}</strong>
              </div>
              {locked ? (
                <p>Disponible con premium 🔒</p>
              ) : (
                <div className="embedded-video">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {locked ? (
        <a className="button button-primary button-link" href={SALES_FUNNEL_URL}>
          {strings.unlockPremium}
        </a>
      ) : null}
    </article>
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
        <FoodList title={strings.foodsToAvoid} items={foodAvoidItems} />
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
  const [adminTab, setAdminTab] = useState("users");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [pushStatus, setPushStatus] = useState("");

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
  const selectedUser = userGroups.find((user) => user.email === selectedUserEmail) || null;
  const selectedChild = selectedUser?.children.find((child) => child.id === selectedChildId) || null;

  return (
    <article className="card card--feature admin-panel">
      <div className="card-header">
        <span className="section-label">{strings.sections.admin}</span>
        <h2>{strings.adminOverview}</h2>
        <p className="lead-copy">{strings.adminHint}</p>
        <button className="button button-secondary" type="button" onClick={onHome}>
          Inicio
        </button>
        {data ? (
          <>
            <button className="button button-primary" type="button" onClick={enableAdminPush}>
              Activar notificaciones admin
            </button>
            {pushStatus ? <p className="status-message status-success">{pushStatus}</p> : null}
          </>
        ) : null}
        {data && status ? <p className="status-message status-warning">{status}</p> : null}
      </div>
      {!data ? (
        <form className="stack compact" onSubmit={loadAdminData}>
          <label className="stack compact">
            <span>{strings.adminCode}</span>
            <input
              type="password"
              value={adminCode}
              onChange={(event) => setAdminCode(event.target.value)}
              required
            />
          </label>
          {status ? <p className="status-message status-warning">{status}</p> : null}
          <button className="button button-primary" type="submit">
            {strings.loadAdmin}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-tabs">
            {[
              ["users", strings.users],
              ["messages", strings.messages],
              ["reviews", strings.reviews],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={adminTab === id ? "section-tab is-active" : "section-tab"}
                onClick={() => setAdminTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {adminTab === "users" ? (
            <div className="admin-split">
              <section className="admin-list">
                <h3>{strings.users}</h3>
                {userGroups.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    className={selectedUserEmail === user.email ? "admin-list-item admin-list-button is-active" : "admin-list-item admin-list-button"}
                    onClick={() => {
                      setSelectedUserEmail(user.email);
                      setSelectedChildId("");
                    }}
                  >
                    <strong>{user.parentName || "Sin nombre"}</strong>
                    <span>
                      {user.email || "Sin email"} · {user.children.length} perfiles
                      {user.isPremium ? <em className="premium-badge">Premium</em> : null}
                    </span>
                  </button>
                ))}
              </section>
              <section className="admin-list">
                <h3>{selectedUser ? `${selectedUser.parentName || "Usuario"} · ${selectedUser.email || "Sin email"}` : "Perfiles"}</h3>
                {selectedUser ? (
                  selectedUser.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className={selectedChildId === child.id ? "admin-list-item admin-list-button is-active" : "admin-list-item admin-list-button"}
                      onClick={() => setSelectedChildId(child.id)}
                    >
                      <strong>{child.child_name || "Sin nombre"}</strong>
                      <span>
                        Perfil {child.primary_profile} · {child.age_years ?? "?"} años
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="muted">Selecciona un usuario.</p>
                )}
              </section>
              <section className="admin-list">
                <h3>{selectedChild ? selectedChild.child_name || "Actividad" : "Actividad"}</h3>
                {selectedChild ? (
                  <>
                    {(selectedUser.logsByChild.get(selectedChild.id) || []).map((log) => (
                      <div className="admin-list-item" key={log.id}>
                        <strong>
                          {log.log_date} · {log.sleep_latency_minutes} min
                        </strong>
                        <span>
                          Cama {log.in_bed_at} · Sueño {log.fell_asleep_at}
                        </span>
                        <small>Despertares: {log.night_wakings}</small>
                      </div>
                    ))}
                    {(selectedUser.eventsByChild.get(selectedChild.id) || []).map((event) => (
                      <div className="admin-list-item" key={event.id}>
                        <strong>{event.event_label}</strong>
                        <span>{event.event_type}</span>
                        <small>{event.created_at?.slice(0, 10)}</small>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="muted">Selecciona un perfil para ver actividad.</p>
                )}
              </section>
            </div>
          ) : null}

          {adminTab === "messages" ? (
            <AdminList
              title={strings.messages}
              items={data.messages}
              renderItem={(messageItem) => (
                <>
                  <strong>{messageItem.parent_email || "Sin email"}</strong>
                  <span>{messageItem.message}</span>
                  <small>
                    {messageItem.topic} · {messageItem.created_at?.slice(0, 10)}
                  </small>
                  {(messageItem.replies || []).map((reply) => (
                    <div className="message-bubble message-bubble--admin" key={reply.id}>
                      <strong>{reply.sender === "admin" ? "Tú" : "Usuario"}</strong>
                      <p>{reply.message}</p>
                    </div>
                  ))}
                  <form className="message-reply-form" onSubmit={(event) => replyToMessage(event, messageItem)}>
                    <textarea
                      value={replyDrafts[messageItem.id] || ""}
                      onChange={(event) => setReplyDrafts((current) => ({ ...current, [messageItem.id]: event.target.value }))}
                      placeholder="Responder a este usuario..."
                    />
                    <button className="icon-button message-icon-action" type="submit" aria-label="Responder">
                      ➤
                    </button>
                  </form>
                  <button className="icon-button message-icon-action message-icon-action--danger" type="button" onClick={() => deleteAdminMessage(messageItem.id)} aria-label="Borrar mensaje">
                    🗑
                  </button>
                </>
              )}
            />
          ) : null}

          {adminTab === "reviews" ? (
            <AdminList
              title={strings.reviews}
              items={data.reviews}
              renderItem={(review) => (
                <>
                  <strong>
                    {review.rating}★ · {review.parent_email || "Sin email"}
                  </strong>
                  <span>{review.rating === 5 ? review.comment : review.improvement_feedback || review.comment}</span>
                  <small>{review.public_approved ? "Publicada en muro" : "Privada"}</small>
                </>
              )}
            />
          ) : null}
        </>
      )}
    </article>
  );
}

function buildAdminUserGroups(data) {
  const groups = new Map();
  const premiumEmails = new Set(
    (data.purchases || [])
      .filter((purchase) => purchase.premium_unlocked || String(purchase.purchase_status || "").toLowerCase() === "paid")
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
