"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProfileMap,
  getQuestions,
  scoreAnswers,
  resolveTieCandidates,
  buildResultCopy,
} from "../lib/quiz";
import {
  buildPlan,
  buildChartPoints,
  buildProgressSummary,
  calculateLatency,
  formatAgeLabel,
  getChildSlots,
  getSleepAreaResult,
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
      videos: "Videos",
      "sleep-area": "Area de sueno",
      avoid: "Que evitar",
      wins: "Logros",
    },
    menuLabel: "Menu",
    readyRoom: "Alista su cuarto",
    contactUs: "Contactanos",
    editProfile: "Editar perfil",
    saveProfile: "Guardar cambios",
    backToChildren: "Volver a perfiles",
    addChild: "Agregar perfil",
    addAnotherChild: "Agregar otro nino",
    unlockPremium: "Comprar premium",
    unlockPremiumFor: "Desbloquear premium para",
    needHelp: "Necesitas ayuda?",
    whatsapp: "WhatsApp",
    emailSupport: "Email",
    productsWeLove: "Productos que amamos",
    slotsFull: "Perfiles completos",
    premiumDashboard: "Dashboard premium",
    gateTitle: "Tu espacio para dejar de adivinar",
    verifyPurchase: "Verifica tu compra",
    usedPurchaseEmail: "Correo que usaste al comprar",
    enterApp: "Entrar a mi app",
    verifying: "Verificando...",
    newChild: "Nuevo nino",
    createProfileFirst: "Creamos su perfil primero",
    childName: "Nombre del nino",
    birthday: "Fecha de nacimiento",
    gender: "Genero",
    boy: "Nino",
    girl: "Nina",
    parentName: "Tu primer nombre (de mama o papa)",
    parentEmail: "Tu correo electronico",
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
    wakeTime: "A que hora se desperto hoy?",
    targetBedtime: "A que hora quieres que ya este dormido?",
    dinnerTime: "A que hora cenan hoy? (opcional)",
    dinnerShared: "Puedes usar la misma hora para todos tus hijos si cenan juntos.",
    napQuestion: "Durmio siesta?",
    napWakeTime: "A que hora se desperto de la siesta?",
    generateRoutine: "Generar rutina",
    changeActivity: "Cambiar esta actividad",
    samePhaseOptions: "Opciones dentro de la misma fase",
    logTitle: "Como les fue?",
    date: "Fecha",
    bedTime: "A que hora se metio a la cama?",
    sleepTime: "A que hora se quedo dormido?",
    nightWakings: "Despertares nocturnos",
    notes: "Notas",
    saveResults: "Guardar resultados",
    progress: "Progreso",
    age: "Edad",
    averageToSleep: "Promedio para dormir",
    nightWakingsShort: "Despertares",
    consistency: "Consistencia",
    noLogsYet: "Todavia no has guardado noches. Apenas registres una, aqui vas a ver su progreso.",
    videoLibrary: "Biblioteca de videos",
    readyForBunny: "Lista para conectar con Bunny",
    sleepArea: "Area de sueno",
    quickChecklist: "Checklist rapido",
    avoidBeforeBed: "Antes de dormir",
    installMode: "Modo app",
    saveHome: "Guarda Buenas Noches en tu pantalla de inicio",
    installNow: "Instalar app",
    notNow: "Ahora no",
    yes: "Si",
    no: "No",
    sometimes: "A veces",
  },
  en: {
    sections: {
      home: "Home",
      routine: "Routine",
      videos: "Videos",
      "sleep-area": "Sleep space",
      avoid: "Avoid",
      wins: "Wins",
    },
    menuLabel: "Menu",
    readyRoom: "Prep their room",
    contactUs: "Contact us",
    editProfile: "Edit profile",
    saveProfile: "Save changes",
    backToChildren: "Back to profiles",
    addChild: "Add child",
    addAnotherChild: "Add another child",
    unlockPremium: "Unlock premium",
    unlockPremiumFor: "Unlock premium for",
    needHelp: "Need help?",
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
    napQuestion: "Did they nap?",
    napWakeTime: "What time did they wake from the nap?",
    generateRoutine: "Generate routine",
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
    installMode: "App mode",
    saveHome: "Save Buenas Noches to your home screen",
    installNow: "Install app",
    notNow: "Not now",
    yes: "Yes",
    no: "No",
    sometimes: "Sometimes",
  },
};

const sleepAreaChecklist = [
  { id: "dark", title: "Oscuridad", copy: "El cuarto esta oscuro (sin luz visible)" },
  { id: "warm-light", title: "Luz antes de dormir", copy: "Uso luz calida y baja antes de dormir" },
  { id: "cool-room", title: "Temperatura", copy: "El cuarto esta fresco (no caliente)" },
  { id: "sound", title: "Sonido", copy: "Hay silencio o sonido constante (sin ruidos bruscos)" },
  { id: "screens", title: "Pantallas", copy: "No hay pantallas antes de dormir" },
  { id: "consistent", title: "Consistencia", copy: "El ambiente es igual cada noche" },
];

const avoidItems = [
  {
    title: "Pantallas (especialmente cerca de dormir)",
    avoid: ["Tablet, celular o TV", "Videos estimulantes", "Juegos electronicos"],
    why: "La luz azul y el contenido activo mantienen el cerebro en modo alerta y retrasan la melatonina.",
    source:
      "American Academy of Pediatrics y Harvard Medical School: las pantallas antes de dormir se asocian con peor calidad de sueno y menor melatonina.",
  },
  {
    title: "Luz blanca brillante",
    avoid: ["Luces LED blancas intensas", "Iluminacion de techo muy brillante"],
    why: "Le dice al cerebro que todavia es de dia.",
    source:
      "Harvard Health Publishing y National Sleep Foundation: la luz brillante en la noche altera el ritmo circadiano.",
  },
  {
    title: "Juego muy activo justo antes de dormir",
    avoid: ["Correr", "Saltar", "Juegos competitivos", "Actividades intensas"],
    why: "Sube cortisol y adrenalina, y activa el sistema nervioso cuando queremos que baje.",
    source:
      "Sleep Foundation y American Academy of Sleep Medicine: la activacion intensa cerca de dormir puede dificultar conciliar el sueno.",
  },
  {
    title: "Azucar y alimentos estimulantes",
    avoid: ["Dulces", "Postres", "Bebidas azucaradas", "Chocolate en ninos sensibles"],
    why: "Puede subir energia y dificultar la regulacion.",
    source: "Sleep Foundation: dietas altas en azucar pueden afectar la calidad del sueno.",
  },
  {
    title: "Cafeina aunque sea poquita",
    avoid: ["Chocolate oscuro en exceso", "Gaseosas", "Te con cafeina"],
    why: "Bloquea la sensacion de sueno.",
    source: "American Academy of Sleep Medicine: la cafeina interfiere con la capacidad de conciliar el sueno.",
  },
  {
    title: "Comer muy tarde o pesado",
    avoid: ["Cenas muy grandes justo antes de dormir", "Comer inmediatamente antes de acostarse"],
    why: "El cuerpo sigue en modo digestion y no entra en modo descanso.",
    source: "Sleep Foundation: comer tarde puede afectar el inicio del sueno.",
  },
  {
    title: "Conversaciones estimulantes o emociones intensas",
    avoid: ["Discusiones", "Temas que activan emociones fuertes", "Sobreestimulacion verbal"],
    why: "Activa el cerebro y el sistema nervioso.",
    source: "National Sleep Foundation: la activacion emocional dificulta el inicio del sueno.",
  },
  {
    title: "Actividades mentales muy activas",
    avoid: ["Juegos competitivos", "Resolver problemas complejos", "Juegos que generan excitacion"],
    why: "Mantienen la mente encendida.",
    source: "American Academy of Sleep Medicine: la activacion cognitiva retrasa el sueno.",
  },
  {
    title: "Rutinas inconsistentes",
    avoid: ["Cambiar todo cada noche", "Horarios totalmente variables"],
    why: "El cerebro no logra anticipar el sueno.",
    source: "National Sleep Foundation: la consistencia mejora la latencia del sueno.",
  },
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
  children: [],
  activeChildId: "",
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
    napTaken: "no",
    napWakeTime: "",
  },
  currentPlan: null,
  expandedSwapStep: "",
  savedLogDate: "",
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
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

export default function BuenasNochesApp() {
  const [state, setState] = useState(initialState);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installState, setInstallState] = useState({
    visible: false,
    mode: "browser",
  });
  const [autoVerifyAttempted, setAutoVerifyAttempted] = useState(false);

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

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPromptEvent(event);
      setInstallState({
        visible: !isStandalone,
        mode: "android",
      });
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (isIos && !isStandalone) {
      setInstallState({
        visible: true,
        mode: "ios",
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
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
    if (!state.activeChildId) return;
    const child = state.children.find((entry) => entry.id === state.activeChildId);
    if (!child) return;

    setState((current) => ({
      ...current,
      currentPlan: child.lastPlan || null,
    }));
  }, [state.activeChildId, state.children]);

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
    { id: "sleep-area", label: strings.readyRoom },
    { id: "avoid", label: strings.sections.avoid },
    { id: "amazon", label: strings.productsWeLove },
    { id: "contact", label: strings.contactUs },
  ];
  const profileMap = getProfileMap(state.language);
  const questions = getQuestions(state.language);
  const activeChild = state.children.find((child) => child.id === state.activeChildId) || null;
  const resultCopy = state.quizResult ? buildResultCopy(state.quizResult, state.language) : null;
  const canAddChild = state.children.length < childSlots.total;
  const hasPremiumAccess = state.accessStatus === "granted";
  const progressSummary = activeChild ? buildProgressSummary(activeChild.logs) : null;
  const chartPoints = activeChild ? buildChartPoints(activeChild.logs) : null;
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

    if (value === "contact") {
      setState((current) => ({ ...current, activeSection: "wins" }));
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
              "Todavia no encuentro una compra activa con ese correo. Revisa si usaste otro email o vuelve en un momento si acabas de comprar.",
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
      activeSection: "child-dashboard",
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
        await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "quiz_result",
            email: profileSaveEmail,
            childName: child.name,
            childBirthday: child.birthday,
            childGender: child.gender,
            answers: child.answers,
            primaryProfile: child.primaryProfile,
            secondaryProfile: child.secondaryProfile || null,
          }),
        });

        setState((current) => ({
          ...current,
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

  function saveChildBasics(event, childId) {
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
      persistenceMessage: "Perfil actualizado.",
    }));
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
      expandedSwapStep: "",
      savedLogDate: "",
    }));

    if (state.accessStatus === "granted" && state.verifiedEmail) {
      try {
        await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "daily_plan",
            email: state.verifiedEmail,
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
              activity: step.selectedActivity?.displayName || step.guidance?.title || "",
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
        expandedSwapStep: "",
        persistenceMessage:
          current.language === "es"
            ? "Actividad cambiada. Ya actualice la rutina de esta noche."
            : "Activity updated. Tonight's routine has been refreshed.",
      };
    });
  }

  async function submitNightLog(event) {
    event.preventDefault();
    if (!activeChild || !state.currentPlan) return;

    const formData = new FormData(event.currentTarget);
    const bedTime = String(formData.get("bedTime"));
    const sleepTime = String(formData.get("sleepTime"));
    const notes = String(formData.get("notes") || "");
    const nightWakings = String(formData.get("nightWakings") || "0");

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
          ? "Guardado. Esta noche quedo registrado exitosamente."
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
            childName: activeChild.name,
            logDate: nextLog.date,
            inBedAt: nextLog.bedTime,
            fellAsleepAt: nextLog.sleepTime,
            sleepLatencyMinutes: nextLog.latency,
            nightWakings: nextLog.nightWakings,
            notes: nextLog.notes,
            ratings: nextLog.ratings,
          }),
        });

        setState((current) => ({
          ...current,
          savedLogDate: nextLog.date,
          persistenceMessage: "Guardado. Esta noche quedo registrado exitosamente.",
        }));
      } catch {
        return;
      }
    }
  }

  async function handleInstallApp() {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
    setInstallPromptEvent(null);
    setInstallState((current) => ({ ...current, visible: false }));
  }

  const safetyTriggered = activeChild?.logs?.[0]?.notes
    ? /ronquidos|respirar|convuls|dolor|regresi|insomnio|autoles/i.test(activeChild.logs[0].notes)
    : false;

  return (
    <main className="shell app-shell">
      {installState.visible ? (
        <section className="install-banner">
          <div className="install-banner__copy">
            <span className="section-label">{strings.installMode}</span>
            <strong>{strings.saveHome}</strong>
            <p>
              {installState.mode === "ios"
                ? state.language === "es"
                  ? "En iPhone toca compartir y luego Agregar a pantalla de inicio."
                  : "On iPhone, tap Share and then Add to Home Screen."
                : state.language === "es"
                  ? "Instalala para abrirla como app real, sin distracciones del navegador."
                  : "Install it to open Buenas Noches like a real app, without browser distractions."}
            </p>
          </div>
          <div className="install-banner__actions">
            {installState.mode === "android" ? (
              <button className="button button-secondary" onClick={handleInstallApp}>
                {strings.installNow}
              </button>
            ) : null}
            <button
              className="button button-ghost"
              onClick={() => setInstallState((current) => ({ ...current, visible: false }))}
            >
              {strings.notNow}
            </button>
          </div>
        </section>
      ) : null}

      {state.accessStatus !== "granted" ? (
        <section className="gate-shell">
          <div className="gate-header">
            <img className="brand-logo" src="/brand/logo-buenas-noches.png" alt="Buenas Noches" />
            <label className="main-menu">
              <span>{strings.menuLabel}</span>
              <select
                value={state.activeSection === "wins" ? "contact" : ["home", "sleep-area", "avoid"].includes(state.activeSection) ? state.activeSection : "home"}
                onChange={(event) => handleMainMenu(event.target.value)}
              >
                {mainMenuOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {!hasPremiumAccess ? (
              <a className="button button-primary button-link header-cta" href={SALES_FUNNEL_URL}>
                {strings.unlockPremium}
              </a>
            ) : null}
          </div>

          {!state.children.length || state.onboardingMode === "new-child" ? (
            <>
              <div className="gate-grid">
            <article className="card card--feature">
              <span className="section-label">Lo que vas a desbloquear</span>
              <h2>Un dashboard real para cada hijo</h2>
              <ul className="feature-list">
                <li>{state.language === "es" ? "Perfil guardado con nombre y fecha de nacimiento" : "Saved profile with name and birthday"}</li>
                <li>{state.language === "es" ? "Rutina de esta noche con actividades intercambiables" : "Tonight's routine with swappable activities"}</li>
                <li>{state.language === "es" ? "Grafico de progreso con minutos para dormir y despertares" : "Progress graph with minutes to fall asleep and night wakings"}</li>
                <li>{state.language === "es" ? "Area de sueno y lista de que evitar" : "Sleep space and what to avoid sections"}</li>
                <li>{state.language === "es" ? "Opcion de agregar ninos extra con tu add-on de Captivation Hub" : "Ability to add extra children through your Captivation Hub add-on"}</li>
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
                    ? "Puedes usar esta parte gratis para descubrir el perfil de sueno de tu hijo. Despues, si quieres, desbloqueas el dashboard completo."
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
                      ? "De estas dos opciones, cual sientes que describe mas a tu hijo en este momento?"
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
                          ? `Tambien veo rasgos de ${resultCopy.secondaryName}, asi que puede haber una mezcla de patrones.`
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
              <div className="child-strip child-strip--home">
                {state.children.map((child) => {
                  const summary = buildProgressSummary(child.logs);
                  return (
                    <button
                      key={child.id}
                      type="button"
                      className="child-card child-card--hero"
                      onClick={() => setState((current) => ({ ...current, activeChildId: child.id, activeSection: "child-dashboard" }))}
                    >
                      <span className="section-label">{profileMap[child.primaryProfile]?.name || "Sin perfil"}</span>
                      <strong>{child.name}</strong>
                      <span>{formatAgeLabel(child.birthday, state.language)}</span>
                      <small>
                        {summary.averageLatency
                          ? `${summary.averageLatency} min promedio`
                          : state.language === "es"
                            ? "Perfil gratis guardado"
                            : "Free profile saved"}
                      </small>
                    </button>
                  );
                })}
              </div>
              {state.persistenceMessage ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}
            </>
          ) : state.activeSection === "child-dashboard" ? (
              <div className="dashboard-grid">
                <div className="profile-actions">
                  <button className="button button-ghost" type="button" onClick={() => setState((current) => ({ ...current, activeSection: "home" }))}>
                    {strings.backToChildren}
                  </button>
                </div>
                <HomeSection
                  activeChild={activeChild}
                  progressSummary={progressSummary}
                  chartPoints={chartPoints}
                  strings={strings}
                  profileMap={profileMap}
                />
                <EditProfileCard
                  key={activeChild?.id}
                  activeChild={activeChild}
                  strings={strings}
                  onSave={(event) => saveChildBasics(event, activeChild.id)}
                />
                <AddChildPreview
                  activeChild={activeChild}
                  strings={strings}
                  canAddChild={canAddChild}
                  hasPremiumAccess={hasPremiumAccess}
                  onAddChild={startAddChild}
                />
                <article className="card card--soft">
                  <div className="card-header">
                    <span className="section-label">{state.language === "es" ? "Premium" : "Premium"}</span>
                    <h2>{strings.verifyPurchase}</h2>
                  </div>
                  <p className="lead-copy">
                    {state.language === "es"
                      ? "Ya puedes ver el perfil y el dashboard. Al desbloquear, se activan la rutina, videos, checklist guiado y el seguimiento real."
                      : "You can already see the profile and dashboard. Unlocking turns on the routine, videos, guided checklist, and real tracking."}
                  </p>
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
                    <div className="inline-actions">
                      <button className="button button-primary" type="submit" disabled={state.accessStatus === "loading"}>
                        {state.accessStatus === "loading" ? strings.verifying : strings.enterApp}
                      </button>
                      <a className="button button-secondary button-link" href={SALES_FUNNEL_URL}>
                        {state.language === "es" ? "Comprar premium" : "Purchase premium"}
                      </a>
                    </div>
                  </form>
                </article>
              </div>
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
          ) : state.activeSection === "wins" ? (
            <WinsSection activeChild={activeChild} strings={strings} language={state.language} />
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
            <label className="main-menu main-menu--dark">
              <span>{strings.menuLabel}</span>
              <select
                value={state.activeSection === "wins" ? "contact" : ["home", "sleep-area", "avoid"].includes(state.activeSection) ? state.activeSection : "home"}
                onChange={(event) => handleMainMenu(event.target.value)}
              >
                {mainMenuOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {!hasPremiumAccess ? (
              <a className="button button-primary button-link header-cta" href={SALES_FUNNEL_URL}>
                {strings.unlockPremium}
              </a>
            ) : null}
          </header>

          {!state.children.length || state.onboardingMode === "new-child" ? (
            <section className="app-panel">
              <article className="card card--soft card--quiz">
                <div className="card-header">
                  <span className="section-label">Nuevo nino</span>
                  <h2>{strings.createProfileFirst}</h2>
                </div>

                {state.quizIndex === -1 && !state.quizResult ? (
                  <form className="stack" onSubmit={beginQuiz}>
                    <p className="lead-copy">
                      Vamos a guardar su nombre y fecha de nacimiento para que la app siempre sepa su edad,
                      incluso muchos meses despues.
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
                      <strong>De estas dos opciones, cual sientes que describe mas a tu hijo en este momento?</strong>
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
                  canAddChild={canAddChild}
                  strings={strings}
                  language={state.language}
                  profileMap={profileMap}
                  onOpenChild={(childId) =>
                    setState((current) => ({ ...current, activeChildId: childId, activeSection: "child-dashboard" }))
                  }
                  onAddChild={startAddChild}
                />
              ) : null}

              {state.activeSection === "child-dashboard" ? (
                <>
                  <div className="profile-actions">
                    <button className="button button-ghost" type="button" onClick={() => setState((current) => ({ ...current, activeSection: "home" }))}>
                      {strings.backToChildren}
                    </button>
                    <button className="button button-primary" type="button" onClick={() => setState((current) => ({ ...current, activeSection: "routine" }))}>
                      {strings.sections.routine}
                    </button>
                    <button className="button button-secondary" type="button" onClick={() => setState((current) => ({ ...current, activeSection: "videos" }))}>
                      {strings.sections.videos}
                    </button>
                  </div>
                  <HomeSection activeChild={activeChild} progressSummary={progressSummary} chartPoints={chartPoints} strings={strings} profileMap={profileMap} />
                  <EditProfileCard
                    key={activeChild?.id}
                    activeChild={activeChild}
                    strings={strings}
                    onSave={(event) => saveChildBasics(event, activeChild.id)}
                  />
                  <AddChildPreview
                    activeChild={activeChild}
                    strings={strings}
                    canAddChild={canAddChild}
                    hasPremiumAccess={hasPremiumAccess}
                    onAddChild={startAddChild}
                  />
                </>
              ) : null}

              {state.activeSection === "routine" ? (
                <RoutineSection
                  activeChild={activeChild}
                  strings={strings}
                  profileMap={profileMap}
                  routineForm={state.routineForm}
                  currentPlan={state.currentPlan}
                  onRoutineFieldChange={updateRoutineField}
                  onGenerateRoutine={generateRoutine}
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

              {state.activeSection === "wins" ? <WinsSection activeChild={activeChild} strings={strings} language={state.language} /> : null}
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

function ChildHomeGrid({ children, canAddChild, strings, language, profileMap, onOpenChild, onAddChild }) {
  return (
    <div className="child-strip child-strip--home">
      {children.map((child) => {
        const summary = buildProgressSummary(child.logs);
        return (
          <button
            key={child.id}
            type="button"
            className="child-card child-card--hero"
            onClick={() => onOpenChild(child.id)}
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
          </button>
        );
      })}

      {canAddChild ? (
        <button type="button" className="child-card child-card--ghost" onClick={onAddChild}>
          <strong>{strings.addAnotherChild}</strong>
          <span>{language === "es" ? "Crear otro perfil de sueno" : "Create another sleep profile"}</span>
        </button>
      ) : null}
    </div>
  );
}

function EditProfileCard({ activeChild, strings, onSave }) {
  if (!activeChild) return null;

  return (
    <article className="card card--soft">
      <div className="card-header">
        <span className="section-label">{strings.editProfile}</span>
        <h2>{activeChild.name}</h2>
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
        <button className="button button-primary" type="submit">
          {strings.saveProfile}
        </button>
      </form>
    </article>
  );
}

function AddChildPreview({ activeChild, strings, canAddChild, hasPremiumAccess, onAddChild }) {
  if (!activeChild) return null;

  return (
    <article className="card card--soft add-child-preview">
      <div className="add-child-preview__background" aria-hidden="true">
        <div className="avatar-placeholder">QK</div>
        <span className="section-label">{strings.sections.home}</span>
        <h2>{activeChild.name}</h2>
        <div className="summary-grid">
          <div className="stat-card">
            <span>{strings.age}</span>
            <strong>--</strong>
          </div>
          <div className="stat-card">
            <span>{strings.averageToSleep}</span>
            <strong>--</strong>
          </div>
        </div>
      </div>
      <div className="add-child-preview__overlay">
        <button className="button button-primary" type="button" onClick={onAddChild}>
          {strings.addAnotherChild}
        </button>
        {!canAddChild && hasPremiumAccess ? (
          <a className="button button-secondary button-link" href={SALES_FUNNEL_URL}>
            {strings.unlockPremiumFor} {activeChild.name}
          </a>
        ) : null}
        {!hasPremiumAccess ? (
          <a className="button button-secondary button-link" href={SALES_FUNNEL_URL}>
            {strings.unlockPremium}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function HomeSection({ activeChild, progressSummary, chartPoints, strings, profileMap }) {
  if (!activeChild) return null;

  return (
    <div className="dashboard-grid">
      <article className="card card--feature dashboard-card">
        <div className="card-header">
          <div className="profile-heading">
            <div className="avatar-placeholder">QK</div>
            <div>
              <span className="section-label">Dashboard de {activeChild.name}</span>
              <h2>{profileMap[activeChild.primaryProfile]?.name}</h2>
            </div>
          </div>
        </div>
        <p className="lead-copy">
          {strings.age === "Age"
            ? `${activeChild.name} is ${formatAgeLabel(activeChild.birthday, "en")} and the main sleep pattern points to `
            : `${activeChild.name} tiene ${formatAgeLabel(activeChild.birthday, "es")} y su patron principal de sueno apunta a `}
          <strong>{profileMap[activeChild.primaryProfile]?.name}</strong>.
        </p>
        <div className="summary-grid">
          <Stat label={strings.age} value={formatAgeLabel(activeChild.birthday, strings.age === "Age" ? "en" : "es")} />
          <Stat label={strings.averageToSleep} value={`${progressSummary.averageLatency || 0} min`} />
          <Stat label={strings.nightWakingsShort} value={`${progressSummary.averageNightWakings || 0}`} />
          <Stat label={strings.consistency} value={`${progressSummary.bedtimeConsistency || 0}%`} />
        </div>
      </article>

      <article className="card card--soft graph-card">
        <div className="card-header">
          <span className="section-label">Progreso</span>
          <h2>Asi van sus noches</h2>
        </div>
        <div className={chartPoints?.empty ? "chart-panel chart-panel--empty" : "chart-panel"}>
          <p>Linea: minutos para dormir. Barras: despertares nocturnos.</p>
          <svg viewBox="0 0 700 260" aria-hidden="true">
            <line x1="40" y1="200" x2="660" y2="200" className="chart-axis" />
            <line x1="40" y1="30" x2="40" y2="200" className="chart-axis" />
              {chartPoints.wakingBars.map((bar, index) => (
              <rect key={index} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="8" className="chart-bar" />
              ))}
              <polyline
                fill="none"
              className="chart-line"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints.points}
              />
              {chartPoints.circles.map((circle, index) => (
              <circle key={index} cx={circle.x} cy={circle.y} r="5" className="chart-dot" />
              ))}
              {chartPoints.labels.map((label) => (
                <text
                  key={label.text}
                  x={label.x}
                  y="232"
                className="chart-label"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {label.text}
                </text>
              ))}
          </svg>
          {chartPoints?.empty ? (
            <p className="muted">
              {strings.age === "Age"
                ? "Your saved nights will fill this graph after purchase."
                : "Tus noches guardadas van a llenar este grafico despues de la compra."}
            </p>
          ) : null}
        </div>
      </article>
    </div>
  );
}

function RoutineSection({
  activeChild,
  strings,
  profileMap,
  routineForm,
  currentPlan,
  onRoutineFieldChange,
  onGenerateRoutine,
  onChangeActivity,
  expandedSwapStep,
  onToggleSwapStep,
  onSubmitNightLog,
  safetyTriggered,
  savedLogDate,
}) {
  const [routinePlayerOpen, setRoutinePlayerOpen] = useState(false);
  const [routineStepIndex, setRoutineStepIndex] = useState(0);
  const playerStep = currentPlan?.steps?.[routineStepIndex] || null;
  if (!activeChild) return null;

  return (
    <div className="dashboard-grid">
      <article className="card card--soft">
        <div className="card-header">
          <span className="section-label">{strings.tonightRoutine}</span>
          <h2>{strings.mapNight} {activeChild.name}</h2>
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
                setRoutineStepIndex(0);
                setRoutinePlayerOpen(true);
              }}
            >
              Abrir rutina guiada
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

                  {step.selectedActivity ? (
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
                  <strong>{playerStep.selectedActivity?.displayName || playerStep.guidance?.title}</strong>
                  <span>{playerStep.selectedActivity?.shortLabel || playerStep.purpose}</span>
                </div>
                <div className="routine-media">
                  <span>
                    {playerStep.selectedActivity
                      ? "Aqui podremos mostrar el video o foto de esta actividad."
                      : "Esta parte puede quedar como lista simple sin video."}
                  </span>
                </div>
                <p>{playerStep.selectedActivity?.instructions || playerStep.guidance?.guidance}</p>
                {playerStep.guidance?.examples?.length ? (
                  <ul className="mini-list">
                    {playerStep.guidance.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                ) : null}
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
                        setRoutinePlayerOpen(false);
                        return;
                      }
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
                <strong>Guardado. Esta noche quedo registrado exitosamente.</strong>
                <p>
                  {strings.age === "Age"
                    ? "Your progress graph has been updated."
                    : "El grafico de progreso ya fue actualizado."}
                </p>
              </div>
            ) : (
            <form className="stack" onSubmit={onSubmitNightLog}>
              <label className="stack compact">
                <span>{strings.date}</span>
                <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
              </label>
              <label className="stack compact">
                <span>{strings.bedTime}</span>
                <input name="bedTime" type="time" required />
              </label>
              <label className="stack compact">
                <span>{strings.sleepTime}</span>
                <input name="sleepTime" type="time" required />
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

              {currentPlan.steps
                .filter((step) => step.selectedActivity)
                .map((step) => (
                  <div className="rating-card" key={step.id}>
                    <strong>{step.selectedActivity.displayName}</strong>
                    <span className="muted">{step.label}</span>
                    <label className="stack compact">
                      <span>Como se sintio esta actividad?</span>
                      <select name={`rating-${step.id}`} defaultValue="3">
                        <option value="3">Le ayudo mucho</option>
                        <option value="2">Mas o menos</option>
                        <option value="1">No ayudo mucho</option>
                      </select>
                    </label>
                    <label className="stack compact">
                      <span>No le gusto esta actividad?</span>
                      <select name={`disliked-${step.id}`} defaultValue="no">
                        <option value="no">No</option>
                        <option value="yes">Si</option>
                      </select>
                    </label>
                  </div>
                ))}

              <label className="stack compact">
                <span>{strings.notes}</span>
                <textarea name="notes" placeholder="Algo importante de esta noche?" />
              </label>
              <button className="button button-primary" type="submit">
                {strings.saveResults}
              </button>
            </form>
            )}
            {safetyTriggered ? (
              <div className="safety-card">
                Lo que me estas contando va mas alla de lo que esta herramienta puede orientar. Merece una evaluacion
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

  const suggestedVideos = [
    "Presion profunda / squeeze",
    "Compresiones articulares",
    "Movimientos oculares",
    "Tarareo y sonido mmm",
    "Respiracion abdominal",
  ];

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.videoLibrary}</span>
        <h2>{strings.readyForBunny}</h2>
      </div>
      <p className="lead-copy">
        Aqui vamos a mostrar los videos embebidos por ejercicio. Ya deje esta seccion lista para vincularlos
        cuando subas los links.
      </p>
      <div className="video-grid">
        {suggestedVideos.map((video) => (
          <div key={video} className="video-card">
            <strong>{video}</strong>
            <span>Espacio listo para embed</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function SleepAreaSection({ activeChild, strings, checkedCount, sleepAreaResult, onToggleCheck }) {
  if (!activeChild) return null;

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.sleepArea}</span>
        <h2>{strings.quickChecklist}</h2>
      </div>
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
                <strong>{language === "en" ? "Why:" : "Por que:"}</strong> {language === "en" ? translateAvoidWhy(item.why) : item.why}
              </p>
              <p className="muted">{language === "en" ? translateAvoidSource(item.source) : item.source}</p>
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}

function WinsSection({ activeChild, strings, language }) {
  if (!activeChild) return null;
  const whatsappText =
    language === "es"
      ? `Quiero compartir un logro de ${activeChild.name} en Buenas Noches:`
      : `I want to share a win from ${activeChild.name} in Buenas Noches:`;

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{strings.sections.wins}</span>
        <h2>{language === "es" ? "Celebra lo que esta funcionando" : "Celebrate what is working"}</h2>
      </div>
      <p className="lead-copy">
        {language === "es"
          ? "Los logros pequenos importan: menos negociacion, menos tiempo para dormir, menos despertares o una rutina mas tranquila."
          : "Small wins matter: less negotiation, less time to fall asleep, fewer wakings, or a calmer routine."}
      </p>
      <div className="win-card">
        <strong>{language === "es" ? "Comparte un logro o pide apoyo" : "Share a win or ask for support"}</strong>
        <p>
          {language === "es"
            ? "Por ahora esto abre WhatsApp o email para que me llegue directo. Mas adelante podemos convertirlo en mensajeria dentro de la app."
            : "For now this opens WhatsApp or email so it reaches me directly. Later we can turn this into in-app messaging."}
        </p>
        <div className="inline-actions">
          <a className="button button-primary button-link" href={`${SUPPORT_WHATSAPP_URL}?text=${encodeURIComponent(whatsappText)}`}>
            {strings.whatsapp}
          </a>
          <a
            className="button button-secondary button-link"
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Buenas Noches - win/support")}&body=${encodeURIComponent(whatsappText)}`}
          >
            {strings.emailSupport}
          </a>
        </div>
      </div>
    </article>
  );
}

function LockedPreviewCard({ activeSection, language }) {
  const labels = {
    home: language === "es" ? "Inicio" : "Home",
    routine: language === "es" ? "Rutina de esta noche" : "Tonight's routine",
    videos: language === "es" ? "Biblioteca de videos" : "Video library",
    "sleep-area": language === "es" ? "Area de sueno" : "Sleep space",
    avoid: language === "es" ? "Que evitar" : "What to avoid",
    wins: language === "es" ? "Logros" : "Wins",
  };

  return (
    <article className="card card--feature">
      <div className="card-header">
        <span className="section-label">{language === "es" ? "Vista previa" : "Preview"}</span>
        <h2>{labels[activeSection] || labels.home}</h2>
      </div>
      <p className="lead-copy">
        {language === "es"
          ? "Asi se ve esta seccion dentro de la app completa. Puedes explorar el shell, pero esta parte se desbloquea con la compra."
          : "This is how this section looks inside the full app. You can explore the shell, but this part unlocks with purchase."}
      </p>
      <div className="preview-grid">
        <div className="preview-block">
          <strong>{language === "es" ? "Lo que encontraras aqui" : "What you'll find here"}</strong>
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
                  ? "Checklist rapido del cuarto y su impacto"
                  : "Quick room checklist and its impact"
                : null}
              {activeSection === "avoid"
                ? language === "es"
                  ? "Lista clara de lo que mas interfiere con el sueno"
                  : "Clear list of what most interferes with sleep"
                : null}
              {activeSection === "wins"
                ? language === "es"
                  ? "Un lugar para celebrar logros y pedir apoyo"
                  : "A place to celebrate wins and ask for support"
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
              ? "Desbloquea esta seccion para usar el dashboard completo, la rutina de esta noche y el seguimiento."
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
    "Azucar y alimentos estimulantes": "Sugar and stimulating foods",
    "Cafeina aunque sea poquita": "Caffeine, even a little",
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
    "Juegos electronicos": "Electronic games",
    "Luces LED blancas intensas": "Bright white LED lights",
    "Iluminacion de techo muy brillante": "Very bright overhead lights",
    Correr: "Running",
    Saltar: "Jumping",
    "Juegos competitivos": "Competitive games",
    "Actividades intensas": "Intense activities",
    Dulces: "Candy",
    Postres: "Desserts",
    "Bebidas azucaradas": "Sugary drinks",
    "Chocolate en ninos sensibles": "Chocolate in sensitive children",
    "Chocolate oscuro en exceso": "Too much dark chocolate",
    Gaseosas: "Sodas",
    "Te con cafeina": "Caffeinated tea",
    "Cenas muy grandes justo antes de dormir": "Very heavy dinners right before bed",
    "Comer inmediatamente antes de acostarse": "Eating right before lying down",
    Discusiones: "Arguments",
    "Temas que activan emociones fuertes": "Topics that trigger strong emotions",
    "Sobreestimulacion verbal": "Too much verbal stimulation",
    "Resolver problemas complejos": "Solving complex problems",
    "Juegos que generan excitacion": "Games that create excitement",
    "Cambiar todo cada noche": "Changing everything every night",
    "Horarios totalmente variables": "Completely variable schedules",
  };
  return map[value] || value;
}

function translateAvoidWhy(value) {
  const map = {
    "La luz azul y el contenido activo mantienen el cerebro en modo alerta y retrasan la melatonina.":
      "Blue light and activating content keep the brain alert and delay melatonin.",
    "Le dice al cerebro que todavia es de dia.": "It tells the brain that it is still daytime.",
    "Sube cortisol y adrenalina, y activa el sistema nervioso cuando queremos que baje.":
      "It raises cortisol and adrenaline, activating the nervous system when we want it to settle.",
    "Puede subir energia y dificultar la regulacion.": "It can raise energy and make regulation harder.",
    "Bloquea la sensacion de sueno.": "It blocks the feeling of sleepiness.",
    "El cuerpo sigue en modo digestion y no entra en modo descanso.":
      "The body stays in digestion mode instead of rest mode.",
    "Activa el cerebro y el sistema nervioso.": "It activates the brain and nervous system.",
    "Mantienen la mente encendida.": "They keep the mind switched on.",
    "El cerebro no logra anticipar el sueno.": "The brain cannot predict that sleep is coming.",
  };
  return map[value] || value;
}

function translateAvoidSource(value) {
  const map = {
    "American Academy of Pediatrics y Harvard Medical School: las pantallas antes de dormir se asocian con peor calidad de sueno y menor melatonina.":
      "American Academy of Pediatrics and Harvard Medical School: screens before bed are linked to poorer sleep quality and lower melatonin.",
    "Harvard Health Publishing y National Sleep Foundation: la luz brillante en la noche altera el ritmo circadiano.":
      "Harvard Health Publishing and the National Sleep Foundation: bright light at night disrupts circadian rhythm.",
    "Sleep Foundation y American Academy of Sleep Medicine: la activacion intensa cerca de dormir puede dificultar conciliar el sueno.":
      "Sleep Foundation and the American Academy of Sleep Medicine: intense activation close to bedtime can make it harder to fall asleep.",
    "Sleep Foundation: dietas altas en azucar pueden afectar la calidad del sueno.":
      "Sleep Foundation: high-sugar diets can affect sleep quality.",
    "American Academy of Sleep Medicine: la cafeina interfiere con la capacidad de conciliar el sueno.":
      "American Academy of Sleep Medicine: caffeine interferes with the ability to fall asleep.",
    "Sleep Foundation: comer tarde puede afectar el inicio del sueno.":
      "Sleep Foundation: eating late can affect sleep onset.",
    "National Sleep Foundation: la activacion emocional dificulta el inicio del sueno.":
      "National Sleep Foundation: emotional activation makes sleep onset harder.",
    "American Academy of Sleep Medicine: la activacion cognitiva retrasa el sueno.":
      "American Academy of Sleep Medicine: cognitive activation delays sleep.",
    "National Sleep Foundation: la consistencia mejora la latencia del sueno.":
      "National Sleep Foundation: consistency improves sleep latency.",
  };
  return map[value] || value;
}
