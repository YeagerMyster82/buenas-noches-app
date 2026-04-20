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

const copy = {
  es: {
    sections: {
      home: "Inicio",
      routine: "Rutina",
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
    parentName: "Tu primer nombre (de mamá o papá)",
    parentEmail: "Tu correo electrónico",
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
    targetBedtime: "¿A qué hora quieres que ya esté dormido?",
    dinnerTime: "¿A qué hora cenan hoy? (opcional)",
    dinnerShared: "Puedes usar la misma hora para todos tus hijos si cenan juntos.",
    prepareDuration: "¿Cuántos minutos suele tardar en prepararse para dormir? (baño, pijama, etc.)",
    prepareDurationHelp: "Usaremos este tiempo para calcular a qué hora deben empezar.",
    napQuestion: "¿Durmió siesta?",
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
    soundTransition: "Solo transición",
    soundCalm: "Música tranquila",
    soundNature: "Sonidos de naturaleza",
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
      routine: "Routine",
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
    parentEmail: "Your email",
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
    targetBedtime: "What time do you want them asleep by?",
    dinnerTime: "What time is dinner tonight? (optional)",
    dinnerShared: "You can keep the same dinner time for all your children if they eat together.",
    prepareDuration: "How long does getting ready for bed take? (bath, pajamas, dim lights)",
    prepareDurationHelp: "We will use this to calculate when they should start.",
    napQuestion: "Did they nap?",
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
    soundTransition: "Transition only",
    soundCalm: "Calming music",
    soundNature: "Nature sounds",
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
  parentEmail: "",
  parentProfileSaved: false,
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
    fellAsleepAt: "",
    soundMode: "transition",
  },
  expandedSwapStep: "",
  editingChildId: "",
  savedLogDate: "",
  wakingPromptLogDate: "",
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

function genderize(value, gender) {
  if (gender !== "girl" || !value) return value;
  return value
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

function makeEmptyChild(childDraft) {
  return {
    id: generateId(),
    name: childDraft.name.trim(),
    birthday: childDraft.birthday,
    gender: childDraft.gender || "boy",
    primaryProfile: "",
    secondaryProfile: "",
    answers: [],
    lastPlan: null,
    logs: [],
    selectedActivities: {},
    dislikedCounts: {},
    sleepAreaChecks: {},
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
    answers: responses,
    isLegacyProfile: !childName || !childBirthday,
  };
}

function collapseLegacySavedChildren(children) {
  const namedChildren = children.filter((child) => !child.isLegacyProfile);
  const legacyChildren = children.filter((child) => child.isLegacyProfile);
  return legacyChildren.length ? [...namedChildren, legacyChildren[0]] : namedChildren;
}

function makeLogsFromSavedData(logs = []) {
  return logs.map((log) => ({
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
    if (autoVerifyAttempted || !knownEmail || state.accessStatus === "granted" || state.accessStatus === "loading") return;
    setAutoVerifyAttempted(true);
    checkPremiumAccessForEmail(knownEmail, { silent: true });
  }, [autoVerifyAttempted, state.verifiedEmail, state.parentEmail, state.purchaseEmail, state.accessStatus]);

  const childSlots = useMemo(() => getChildSlots(state.premiumAccess), [state.premiumAccess]);
  const strings = copy[state.language] || copy.es;
  const mainMenuOptions = [
    { id: "home", label: strings.sections.home },
    { id: "tips", label: strings.sections.tips },
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
  const hasPremiumAccess = state.accessStatus === "granted";
  const progressSummary = activeChild ? buildProgressSummary(activeChild.logs) : null;
  const checkedCount = activeChild ? Object.values(activeChild.sleepAreaChecks || {}).filter(Boolean).length : 0;
  const sleepAreaResult = getSleepAreaResult(checkedCount);

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

    setState((current) => ({ ...current, activeSection: value }));
  }

  function startAddChild() {
    setState((current) => ({
      ...current,
      onboardingMode: "new-child",
      childDraft: { name: "", birthday: "", gender: "boy" },
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
      activeSection: "home",
      currentPlan: null,
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
        if (!options.silent) {
          setState((current) => ({
            ...current,
            verifiedEmail: "",
            accessStatus: "not_found",
            premiumAccess: null,
            accessMessage:
              "Todavía no encuentro una compra activa con ese correo. Revisa si usaste otro email o vuelve en un momento si acabas de comprar.",
          }));
        }
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
      if (!options.silent) {
        setState((current) => ({
          ...current,
          verifiedEmail: "",
          accessStatus: "error",
          premiumAccess: null,
          accessMessage: error.message || "No pude verificar tu compra en este momento.",
        }));
      }
      return null;
    }
  }

  async function restoreSavedAccount(event) {
    event?.preventDefault();
    const email = state.accountLookupEmail.trim().toLowerCase();
    if (!email) return;

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

      setState((current) => ({
        ...current,
        parentEmail: email,
        purchaseEmail: email,
        verifiedEmail: premiumCheck?.hasAccess ? email : current.verifiedEmail,
        accessStatus: premiumCheck?.hasAccess ? "granted" : current.accessStatus,
        premiumAccess: premiumCheck?.hasAccess ? premiumCheck.payload : current.premiumAccess,
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
    };

    setState((current) => ({
      ...current,
      children: [...current.children, child],
      activeChildId: child.id,
      expandedChildId: child.id,
      activeSection: "home",
      onboardingMode: "",
      childDraft: { name: "", birthday: "", gender: "boy" },
      parentName: parentName || current.parentName,
      parentEmail: parentEmail || current.parentEmail,
      parentProfileSaved: true,
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
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
    const isPremiumLead = premiumCheck?.hasAccess || state.accessStatus === "granted";

    if (!isPremiumLead) {
      try {
        await fetch("/api/free-profile-lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadPayload),
        });
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
            answers: child.answers,
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
    if (!name || !birthday) return;

    updateChild(childId, () => ({
      name,
      birthday,
      gender,
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
      napTaken: state.routineForm.napTaken === "yes",
      napWakeTime: state.routineForm.napWakeTime,
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
        fellAsleepAt: "",
        soundMode: current.routineSession?.soundMode || "transition",
      },
      expandedSwapStep: "",
      savedLogDate: "",
    }));

    if (state.accessStatus === "granted" && state.verifiedEmail) {
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
            napTaken: state.routineForm.napTaken === "yes",
            napWakeTime: state.routineForm.napWakeTime || null,
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
        napTaken: current.routineForm.napTaken === "yes",
        napWakeTime: current.routineForm.napWakeTime,
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
        const disliked = formData.get(`disliked-${step.id}`) === "yes";
        return {
          stepId: step.id,
          phaseKey: step.phaseKey,
          activityId: step.selectedActivityId,
          activity: step.selectedActivity.displayName,
          rating: Number(formData.get(`rating-${step.id}`) || 0),
          disliked,
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
          ? "Guardado. Esta noche quedó registrada exitosamente."
          : "Saved. Tonight was registered successfully.",
    }));

    if (state.accessStatus === "granted" && state.verifiedEmail) {
      try {
        await fetch("/api/member-data", {
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

  async function updateNightWakingsForPrompt(event) {
    event.preventDefault();
    if (!activeChild || !state.wakingPromptLogDate) return;

    const formData = new FormData(event.currentTarget);
    const nightWakings = String(formData.get("nightWakings") || "0");
    const logDate = state.wakingPromptLogDate;

    updateChild(activeChild.id, (child) => ({
      logs: (child.logs || []).map((log) => (log.date === logDate ? { ...log, nightWakings } : log)),
    }));

    setState((current) => ({
      ...current,
      wakingPromptLogDate: "",
      persistenceMessage: current.language === "es" ? "Despertares guardados." : "Night wakings saved.",
    }));

    if (state.accessStatus === "granted" && state.verifiedEmail) {
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

      {state.wakingPromptLogDate ? (
        <NightWakingPrompt
          strings={strings}
          logDate={state.wakingPromptLogDate}
          onSubmit={updateNightWakingsForPrompt}
          onClose={() => setState((current) => ({ ...current, wakingPromptLogDate: "" }))}
        />
      ) : null}

      {state.accessStatus !== "granted" ? (
        <section className="gate-shell">
          <div className="gate-header">
            <img className="brand-logo" src="/brand/logo-buenas-noches.png" alt="Buenas Noches" />
            <SectionNav options={mainMenuOptions} activeSection={state.activeSection} onSelect={handleMainMenu} />
            {!hasPremiumAccess && state.activeSection !== "admin" ? (
              <a className="button button-primary button-link header-cta" href={SALES_FUNNEL_URL}>
                {strings.unlockPremium}
              </a>
            ) : null}
          </div>

          {state.activeSection !== "admin" && (!state.children.length || state.onboardingMode === "new-child") && !state.accountLookupOpen ? (
            <>
              <div className="gate-grid">
            <article className="card card--feature">
              <span className="section-label">Lo que vas a desbloquear</span>
              <h2>Un dashboard real para cada hijo</h2>
              <ul className="feature-list">
                <li>{state.language === "es" ? "Perfil guardado con nombre y fecha de nacimiento" : "Saved profile with name and birthday"}</li>
                <li>{state.language === "es" ? "Rutina de esta noche con actividades intercambiables" : "Tonight's routine with swappable activities"}</li>
                <li>{state.language === "es" ? "Gráfico de progreso con minutos para dormir y despertares" : "Progress graph with minutes to fall asleep and night wakings"}</li>
                <li>{state.language === "es" ? "Área de sueño y lista de qué evitar" : "Sleep space and what to avoid sections"}</li>
                <li>{state.language === "es" ? "Hasta 3 perfiles de niños incluidos" : "Up to 3 child profiles included"}</li>
              </ul>
              <a className="button button-primary button-link" href={SALES_FUNNEL_URL}>
                {state.language === "es" ? "Comprar premium" : "Purchase premium"}
              </a>
            </article>

            <article className="card card--soft">
              <span className="section-label">{state.language === "es" ? "Acceso" : "Access"}</span>
              <h2>{strings.verifyPurchase}</h2>
              <form className="stack" onSubmit={verifyPremiumAccess}>
                <label className="stack compact">
                  <span>{strings.usedPurchaseEmail}</span>
                  <input
                    type="email"
                    placeholder="tuemail@ejemplo.com"
                    value={state.purchaseEmail}
                    onChange={(event) => setState((current) => ({ ...current, purchaseEmail: event.target.value }))}
                    required
                  />
                </label>
                {state.accessMessage ? (
                  <p
                    className={
                      state.accessStatus === "granted"
                        ? "status-message status-success"
                        : "status-message status-warning"
                    }
                  >
                    {state.accessMessage}
                  </p>
                ) : null}
                <button className="button button-primary" type="submit" disabled={state.accessStatus === "loading"}>
                  {state.accessStatus === "loading" ? strings.verifying : strings.verifyPurchase}
                </button>
              </form>
            </article>
              </div>

              <article className="card card--soft card--quiz">
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
                <button className="button button-primary" type="submit">
                  {strings.startQuiz}
                </button>
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
                onAddChild={startAddChild}
              />
              {state.persistenceMessage ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}
            </>
          ) : state.activeSection === "tips" ? (
            <TipsSection strings={strings} language={state.language} onOpen={handleMainMenu} />
          ) : state.activeSection === "sleep-area" ? (
            <SleepAreaSection
              activeChild={activeChild}
              strings={strings}
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
          ) : state.activeSection === "avoid" ? (
            <AvoidSection strings={strings} language={state.language} />
          ) : state.activeSection === "foods" ? (
            <FoodsSection strings={strings} />
          ) : state.activeSection === "wins" ? (
            <WinsSection
              activeChild={activeChild}
              strings={strings}
              language={state.language}
              parentName={state.parentName}
              parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
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
            <AdminSection strings={strings} language={state.language} />
          ) : (
            <LockedPreviewCard activeSection={state.activeSection} language={state.language} />
          )}

        </section>
      ) : (
        <>
          <header className="topbar">
            <div className="topbar__brand">
              <img className="topbar-logo" src="/brand/logo-buenas-noches.png" alt="Buenas Noches" />
            </div>
            <SectionNav options={mainMenuOptions} activeSection={state.activeSection} onSelect={handleMainMenu} />
            {!hasPremiumAccess && state.activeSection !== "admin" ? (
              <a className="button button-primary button-link header-cta" href={SALES_FUNNEL_URL}>
                {strings.unlockPremium}
              </a>
            ) : null}
          </header>

          {state.activeSection !== "admin" && (!state.children.length || state.onboardingMode === "new-child") && !state.accountLookupOpen ? (
            <section className="app-panel">
              <article className="card card--soft card--quiz">
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
                    <button className="button button-primary" type="submit">
                      {strings.startQuiz}
                    </button>
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
                  safetyTriggered={safetyTriggered}
                  savedLogDate={state.savedLogDate}
                />
              ) : null}

              {state.activeSection === "videos" ? <VideoSection activeChild={activeChild} strings={strings} /> : null}

              {state.activeSection === "tips" ? (
                <TipsSection
                  strings={strings}
                  language={state.language}
                  onOpen={handleMainMenu}
                />
              ) : null}

              {state.activeSection === "sleep-area" ? (
                <SleepAreaSection
                  activeChild={activeChild}
                  strings={strings}
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

              {state.activeSection === "avoid" ? <AvoidSection strings={strings} language={state.language} /> : null}

              {state.activeSection === "foods" ? <FoodsSection strings={strings} /> : null}

              {state.activeSection === "wins" ? (
                <WinsSection
                  activeChild={activeChild}
                  strings={strings}
                  language={state.language}
                  parentName={state.parentName}
                  parentEmail={state.verifiedEmail || state.parentEmail || state.purchaseEmail}
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

              {state.activeSection === "admin" ? <AdminSection strings={strings} language={state.language} /> : null}
            </section>
          )}

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

function AccountLookup({ strings, onToggle }) {
  return (
    <div className="account-lookup">
      <button className="link-button" type="button" onClick={onToggle}>
        {strings.alreadyHaveAccount}
      </button>
    </div>
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
          <h2>{strings.verifyEmailTitle}</h2>
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
  onToggleChild,
  onCreateRoutine,
  onEditProfile,
  onUpdateLog,
  onAddChild,
}) {
  return (
    <div className="child-strip child-strip--home">
      {children.map((child) => {
        const summary = buildProgressSummary(child.logs);
        const isExpanded = expandedChildId === child.id;
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
                onCreateRoutine={() => onCreateRoutine(child.id)}
                onEditProfile={() => onEditProfile(child.id)}
                onUpdateLog={(event, originalDate) => onUpdateLog(event, child.id, originalDate)}
                onCollapse={() => onToggleChild(child.id)}
                compact
              />
            ) : (
              <button
                type="button"
                className={activeChildId === child.id ? "child-card child-card--hero is-active" : "child-card child-card--hero"}
                onClick={() => onToggleChild(child.id)}
              >
                <span className="section-label">{profileMap[child.primaryProfile]?.name || "Sin perfil"}</span>
                <strong>{child.name}</strong>
                <span>{formatAgeLabel(child.birthday, language)}</span>
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

function buildWeeklyProgressChart(logs, weekOffset = 0) {
  const today = new Date();
  const endDate = addDateDays(today, weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDateDays(endDate, index - 6);
    const dateKey = getDateKey(date);
    const log = logs.find((entry) => entry.date === dateKey);
    return {
      dateKey,
      label: date.toLocaleDateString("es", { month: "numeric", day: "numeric" }),
      bedTime: log?.bedTime || "",
      sleepTime: log?.sleepTime || "",
      latency: log ? Number(log.latency || 0) : null,
      wakings: log ? normalizeNightWakings(log.nightWakings) : 0,
    };
  });

  const maxLatency = Math.max(45, ...days.map((day) => day.latency || 0));
  const maxWakings = Math.max(3, ...days.map((day) => day.wakings || 0));

  return {
    days,
    maxLatency,
    maxWakings,
    empty: !logs.length,
    canGoForward: weekOffset < 0,
  };
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
  onCollapse,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImprovement, setReviewImprovement] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [editingLogDate, setEditingLogDate] = useState("");
  if (!activeChild) return null;
  const weeklyChart = buildWeeklyProgressChart(activeChild.logs || [], weekOffset);
  const progressMessage = getSleepProgressMessage(activeChild.logs || [], strings);
  const profileName = profileMap[activeChild.primaryProfile]?.name || "Sin perfil";
  const editingLog = activeChild.logs?.find((log) => log.date === editingLogDate);

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
          <div className="dashboard-name-row">
            <h1>{activeChild.name}</h1>
            <button className="icon-button dashboard-name-edit" type="button" onClick={onEditProfile} aria-label={`${strings.editProfile} ${activeChild.name}`}>
              ✎
            </button>
          </div>
          <p>Perfil: {profileName}</p>
        </header>
        <div className="summary-grid">
          <Stat label={strings.age} value={formatAgeLabel(activeChild.birthday, strings.age === "Age" ? "en" : "es")} />
          <Stat label={strings.averageToSleep} value={`${progressSummary.averageLatency || 0} min`} />
          <Stat label={strings.nightWakingsShort} value={`${progressSummary.averageNightWakings || 0}`} />
          <Stat label={strings.consistency} value={`${progressSummary.bedtimeConsistency || 0}%`} />
        </div>

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
            <span><i className="legend-bar" /> Tiempo en cama hasta dormirse</span>
          </div>
          <div className="sleep-latency-chart">
            {weeklyChart.days.map((day) => (
              <div className="sleep-latency-row" key={day.dateKey}>
                <span className="sleep-date">{day.label}</span>
                <span className="sleep-time">{day.bedTime || "--:--"}</span>
                <div className="sleep-bar-track">
                  {day.latency !== null ? (
                    <button className="sleep-bar-fill sleep-bar-button" type="button" onClick={() => setEditingLogDate(day.dateKey)} style={{ width: `${Math.max(8, (day.latency / weeklyChart.maxLatency) * 100)}%` }}>
                      <span>{day.latency} min · editar</span>
                    </button>
                  ) : (
                    <span className="sleep-empty">Sin registro</span>
                  )}
                </div>
                <span className="sleep-time">{day.sleepTime || "--:--"}</span>
              </div>
            ))}
          </div>
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

        {progressMessage ? (
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

        <button className="button button-primary dashboard-routine-button" type="button" onClick={onCreateRoutine}>
          {strings.createTonightRoutine}
        </button>
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

function playTransitionTone(soundMode) {
  if (soundMode === "silent") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = soundMode === "nature" ? "triangle" : "sine";
    oscillator.frequency.value = soundMode === "calm" ? 432 : 660;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.75);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
  } catch {
    // Browsers may block audio until interaction; the routine still works silently.
  }
}

function startAmbientSound(soundMode) {
  if (!["calm", "nature"].includes(soundMode)) return null;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = soundMode === "nature" ? "triangle" : "sine";
    oscillator.frequency.value = soundMode === "nature" ? 174 : 220;
    gain.gain.setValueAtTime(0.018, audioContext.currentTime);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    return {
      stop() {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);
          oscillator.stop(audioContext.currentTime + 0.3);
        } catch {
          // The browser may already have stopped the audio context.
        }
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
  safetyTriggered,
  savedLogDate,
}) {
  const [routinePlayerOpen, setRoutinePlayerOpen] = useState(false);
  const [routineStepIndex, setRoutineStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const hasPlayedEndToneRef = useRef(false);
  const ambientSoundRef = useRef(null);
  const playerStep = currentPlan?.steps?.[routineStepIndex] || null;

  useEffect(() => {
    if (!playerStep) return;
    setSecondsLeft(getStepDurationSeconds(playerStep));
    hasPlayedEndToneRef.current = false;
  }, [playerStep?.id]);

  useEffect(() => {
    if (!routinePlayerOpen || isPaused || !playerStep) return undefined;
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
  }, [routinePlayerOpen, isPaused, playerStep, routineSession.soundMode]);

  useEffect(() => {
    ambientSoundRef.current?.stop();
    ambientSoundRef.current = null;
    if (routinePlayerOpen && !isPaused) {
      ambientSoundRef.current = startAmbientSound(routineSession.soundMode);
    }
    return () => {
      ambientSoundRef.current?.stop();
      ambientSoundRef.current = null;
    };
  }, [routinePlayerOpen, isPaused, routineSession.soundMode]);

  if (!activeChild) return null;

  function beginGuidedRoutine() {
    const startedAt = routineSession.startedAt || getCurrentTimeValue();
    onRoutineSessionChange({ startedAt });
    setRoutineStepIndex(0);
    setIsPaused(false);
    setRoutinePlayerOpen(true);
    onClosePreview();
  }

  function finishGuidedRoutine() {
    const inBedAt = routineSession.inBedAt || getCurrentTimeValue();
    onRoutineSessionChange({ inBedAt });
    setRoutinePlayerOpen(false);
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
          <label className="stack compact">
            <span>{strings.napQuestion}</span>
            <select value={routineForm.napTaken} onChange={(event) => onRoutineFieldChange("napTaken", event.target.value)}>
              <option value="no">{strings.no}</option>
              <option value="yes">{strings.yes}</option>
            </select>
          </label>
          {routineForm.napTaken === "yes" ? (
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
                    onChange={(event) => onRoutineSessionChange({ soundMode: event.target.value })}
                  >
                    <option value="transition">{strings.soundTransition}</option>
                    <option value="calm">{strings.soundCalm}</option>
                    <option value="nature">{strings.soundNature}</option>
                    <option value="silent">{strings.soundSilent}</option>
                  </select>
                </label>
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
                </div>
              ))}
            </div>
          </article>

          {routinePlayerOpen && playerStep ? (
            <div className="routine-modal" role="dialog" aria-modal="true" aria-label="Rutina guiada">
              <div className="routine-modal__panel">
                <button className="routine-modal__close" type="button" onClick={() => setRoutinePlayerOpen(false)}>
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
                  <strong className="routine-countdown">{formatTimer(secondsLeft)}</strong>
                </div>
                <div className="routine-media">
                  <span>
                    {playerStep.selectedActivity
                      ? "Aquí podremos mostrar el video o foto de esta actividad."
                      : "Esta parte puede quedar como lista simple sin video."}
                  </span>
                </div>
                <p>{playerStep.selectedActivity?.instructions || playerStep.guidance?.guidance}</p>
                {playerStep.preparationItems?.length ? (
                  <ul className="mini-list">
                    {playerStep.preparationItems.map((item) => (
                      <li key={item.id}>
                        <strong>{item.displayName}:</strong> {item.instructions}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {playerStep.guidance?.examples?.length ? (
                  <ul className="mini-list">
                    {playerStep.guidance.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="inline-actions">
                  <button className="button button-ghost" type="button" onClick={() => setIsPaused((paused) => !paused)}>
                    {isPaused ? strings.resumeRoutine : strings.pauseRoutine}
                  </button>
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => {
                      hasPlayedEndToneRef.current = false;
                      setSecondsLeft((current) => current + 120);
                    }}
                  >
                    {strings.extendActivity}
                  </button>
                </div>
                <div className="inline-actions">
                  <button
                    className="button button-ghost"
                    type="button"
                    disabled={routineStepIndex === 0}
                    onClick={() => setRoutineStepIndex((index) => Math.max(0, index - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => {
                      if (routineStepIndex >= currentPlan.steps.length - 1) {
                        finishGuidedRoutine();
                        return;
                      }
                      playTransitionTone(routineSession.soundMode);
                      setRoutineStepIndex((index) => index + 1);
                    }}
                  >
                    {routineStepIndex >= currentPlan.steps.length - 1 ? "Terminar" : "Siguiente parte"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <article className="card card--soft">
            <div className="card-header">
              <span className="section-label">Registro nocturno</span>
              <h2>{strings.logTitle}</h2>
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
              <label className="stack compact">
                <span>{strings.routineStartTime}</span>
                <input
                  name="routineStartTime"
                  type="time"
                  value={routineSession.startedAt}
                  onChange={(event) => onRoutineSessionChange({ startedAt: event.target.value })}
                />
                <small className="field-help">{strings.editTimesHelp}</small>
              </label>
              <label className="stack compact">
                <span>{strings.date}</span>
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
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
                <button className="button button-ghost" type="button" onClick={() => onRoutineSessionChange({ inBedAt: getCurrentTimeValue() })}>
                  {strings.markInBed}
                </button>
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
                <button className="button button-ghost" type="button" onClick={() => onRoutineSessionChange({ fellAsleepAt: getCurrentTimeValue() })}>
                  {strings.fellAsleepNow}
                </button>
              </label>

              {currentPlan.steps
                .filter((step) => step.selectedActivity)
                .map((step) => (
                  <div className="rating-card" key={step.id}>
                    <strong>{step.selectedActivity.displayName}</strong>
                    <span className="muted">{step.label}</span>
                    <label className="stack compact">
                      <span>¿Cómo se sintió esta actividad?</span>
                      <select name={`rating-${step.id}`} defaultValue="3">
                        <option value="3">Le ayudó mucho</option>
                        <option value="2">Más o menos</option>
                        <option value="1">No ayudó mucho</option>
                      </select>
                    </label>
                    <label className="stack compact">
                      <span>¿No le gustó esta actividad?</span>
                      <select name={`disliked-${step.id}`} defaultValue="no">
                        <option value="no">No</option>
                        <option value="yes">Sí</option>
                      </select>
                    </label>
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

function VideoSection({ activeChild, strings }) {
  if (!activeChild) return null;

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.videoLibrary}</span>
        <h2>{strings.readyForBunny}</h2>
      </div>
      <p className="lead-copy">
        Aquí vamos a mostrar los videos embebidos cuando subas los links.
      </p>
      <div className="video-grid">
        {[strings.education, strings.activities].map((video) => (
          <div key={video} className="video-card tip-card">
            <span className="tip-card__moon" aria-hidden="true">☾</span>
            <strong>{video}</strong>
            <span>Espacio listo para embed</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function TipsSection({ strings, onOpen }) {
  const cards = [
    { id: "sleep-area", title: strings.facilitateSleep, copy: "Luz, ambiente, rutina y señales que ayudan al sistema nervioso a bajar." },
    { id: "avoid", title: strings.whatToAvoid, copy: "Lo que más activa el cerebro y el cuerpo antes de dormir." },
    { id: "foods", title: strings.foods, copy: "Alimentos que conviene evitar y alimentos que pueden apoyar el sueño." },
    { id: "amazon", title: strings.products, copy: "Productos que amamos para crear un ambiente más regulador." },
  ];

  return (
    <article className="card card--feature tips-hub">
      <div className="brand-sky" aria-hidden="true">
        <span>✦</span>
        <span>☁</span>
        <span>☾</span>
      </div>
      <div className="card-header">
        <span className="section-label">Tips</span>
        <h2>{strings.tipsTitle}</h2>
      </div>
      <div className="tip-card-grid">
        {cards.map((card) => (
          <button key={card.id} type="button" className="tip-card" onClick={() => onOpen(card.id)}>
            <span className="tip-card__moon" aria-hidden="true">☾</span>
            <strong>{card.title}</strong>
            <p>{card.copy}</p>
          </button>
        ))}
      </div>
    </article>
  );
}

function FoodsSection({ strings }) {
  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.foods}</span>
        <h2>{strings.foods}</h2>
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

function SleepAreaSection({ activeChild, strings, checkedCount, sleepAreaResult, onToggleCheck }) {
  if (!activeChild) return null;

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.sleepArea}</span>
        <h2>{strings.facilitateSleep}</h2>
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

function AvoidSection({ strings, language }) {
  return (
    <article className="card card--soft">
      <div className="card-header">
        <span className="section-label">{strings.sections.avoid}</span>
        <h2>{strings.avoidBeforeBed}</h2>
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

function WinsSection({ activeChild, strings, language, parentName, parentEmail }) {
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
        setReviews((current) => [payload.review, ...current]);
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
          ? "¡Tu opinión nos importa! Cuéntanos cómo vamos."
          : "Your opinion matters to us! Please let us know how we are doing."}
      </p>

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
          Submit
        </button>
      </form>

      <div className="card-header">
        <span className="section-label">{strings.publicWinsWall}</span>
        <h2>El muro de los logros</h2>
      </div>

      <div className="review-wall">
        {reviews.length ? (
          reviews.map((review) => (
            <div className="review-wall-card" key={review.id}>
              <div className="star-line" aria-label={`${review.rating} estrellas`}>
                {"★".repeat(review.rating)}
              </div>
              <p>{review.comment}</p>
              <span>
                {formatPublicParentName(review.parent_name) || (language === "es" ? "Familia Buenas Noches" : "Buenas Noches family")}
                {review.child_name ? ` · ${review.child_name}` : ""}
              </span>
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
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

function ContactSection({ strings, language, activeChild, parentName, parentEmail }) {
  const [topic, setTopic] = useState("support");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function sendPrivateMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;

    setStatus("");
    try {
      const response = await fetch("/api/support-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName,
          email: parentEmail,
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
      setStatus(strings.messageSent);
    } catch (error) {
      setStatus(error.message || "No pude enviar el mensaje.");
    }
  }

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.contactUs}</span>
        <h2>{strings.needHelp}</h2>
      </div>
      <p className="lead-copy">{strings.contactCopy}</p>
      <form className="win-card" onSubmit={sendPrivateMessage}>
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
        <button className="button button-primary" type="submit">
          {strings.sendMessage}
        </button>
      </form>
    </article>
  );
}

function AdminSection({ strings, language }) {
  const [adminCode, setAdminCode] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);
  const [adminTab, setAdminTab] = useState("users");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");

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
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "No pude abrir el panel.");
      }
      setData(payload);
    } catch (error) {
      setStatus(error.message || "No pude abrir el panel.");
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

  const userGroups = data ? buildAdminUserGroups(data) : [];
  const selectedUser = userGroups.find((user) => user.email === selectedUserEmail) || null;
  const selectedChild = selectedUser?.children.find((child) => child.id === selectedChildId) || null;

  return (
    <article className="card card--feature admin-panel">
      <div className="card-header">
        <span className="section-label">{strings.sections.admin}</span>
        <h2>{strings.adminOverview}</h2>
        <p className="lead-copy">{strings.adminHint}</p>
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
                    <strong>{user.email || "Sin email"}</strong>
                    <span>{user.children.length} perfiles</span>
                  </button>
                ))}
              </section>
              <section className="admin-list">
                <h3>{selectedUser ? selectedUser.email : "Perfiles"}</h3>
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
                  <button className="button button-danger" type="button" onClick={() => deleteAdminMessage(messageItem.id)}>
                    Borrar mensaje
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
  (data.children || []).forEach((child) => {
    const email = child.parent_email || "";
    if (!groups.has(email)) {
      groups.set(email, {
        email,
        children: [],
        logsByChild: new Map(),
        eventsByChild: new Map(),
      });
    }
    groups.get(email).children.push(child);
  });

  (data.logs || []).forEach((log) => {
    const email = log.parent_email || "";
    if (!groups.has(email)) {
      groups.set(email, { email, children: [], logsByChild: new Map(), eventsByChild: new Map() });
    }
    const childKey = log.child_id || "";
    const user = groups.get(email);
    if (!user.logsByChild.has(childKey)) user.logsByChild.set(childKey, []);
    user.logsByChild.get(childKey).push(log);
  });

  (data.events || []).forEach((event) => {
    const email = event.parent_email || "";
    if (!groups.has(email)) {
      groups.set(email, { email, children: [], logsByChild: new Map(), eventsByChild: new Map() });
    }
    const childKey = event.child_id || "";
    const user = groups.get(email);
    if (!user.eventsByChild.has(childKey)) user.eventsByChild.set(childKey, []);
    user.eventsByChild.get(childKey).push(event);
  });

  return Array.from(groups.values()).sort((left, right) => left.email.localeCompare(right.email));
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
          <strong>{language === "es" ? "Funcion premium" : "Premium feature"}</strong>
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
