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

const copy = {
  es: {
    sections: {
      home: "Inicio",
      routine: "Rutina",
      videos: "Videos",
      "sleep-area": "Area de sueno",
      avoid: "Que evitar",
    },
    addChild: "Agregar nino",
    slotsFull: "Slots completos",
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
    startQuiz: "Empezar quiz",
    question: "Pregunta",
    of: "de",
    childFitsProfile: "encaja principalmente en el perfil:",
    enterDashboard: "Entrar al dashboard de",
    tonightRoutine: "Rutina de esta noche",
    mapNight: "Mapear la noche de",
    wakeTime: "A que hora se desperto hoy?",
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
    },
    addChild: "Add child",
    slotsFull: "All slots used",
    premiumDashboard: "Premium dashboard",
    gateTitle: "Your place to stop guessing",
    verifyPurchase: "Verify your purchase",
    usedPurchaseEmail: "Email used at checkout",
    enterApp: "Enter my app",
    verifying: "Verifying...",
    newChild: "New child",
    createProfileFirst: "Let's create their profile first",
    childName: "Child's name",
    birthday: "Birthday",
    startQuiz: "Start quiz",
    question: "Question",
    of: "of",
    childFitsProfile: "fits mainly into this profile:",
    enterDashboard: "Enter dashboard for",
    tonightRoutine: "Tonight's routine",
    mapNight: "Map tonight for",
    wakeTime: "What time did they wake up today?",
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
  children: [],
  activeChildId: "",
  activeSection: "home",
  childDraft: {
    name: "",
    birthday: "",
  },
  onboardingMode: "new-child",
  quizIndex: -1,
  answers: [],
  tieCandidates: null,
  quizResult: null,
  routineForm: {
    wakeTime: "",
    napTaken: "no",
    napWakeTime: "",
  },
  currentPlan: null,
  expandedSwapStep: "",
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeEmptyChild(childDraft) {
  return {
    id: generateId(),
    name: childDraft.name.trim(),
    birthday: childDraft.birthday,
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

  const childSlots = useMemo(() => getChildSlots(state.premiumAccess), [state.premiumAccess]);
  const strings = copy[state.language] || copy.es;
  const sectionTabs = [
    { id: "home", label: strings.sections.home },
    { id: "routine", label: strings.sections.routine },
    { id: "videos", label: strings.sections.videos },
    { id: "sleep-area", label: strings.sections["sleep-area"] },
    { id: "avoid", label: strings.sections.avoid },
  ];
  const profileMap = getProfileMap(state.language);
  const questions = getQuestions(state.language);
  const activeChild = state.children.find((child) => child.id === state.activeChildId) || null;
  const resultCopy = state.quizResult ? buildResultCopy(state.quizResult, state.language) : null;
  const canAddChild = state.children.length < childSlots.total;
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

  function startAddChild() {
    setState((current) => ({
      ...current,
      onboardingMode: "new-child",
      childDraft: { name: "", birthday: "" },
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
    if (!state.childDraft.name.trim() || !state.childDraft.birthday) return;
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

  function chooseTieWinner(code) {
    const scored = scoreAnswers(state.answers);
    const secondary = state.tieCandidates.find((candidate) => candidate !== code) || null;
    setState((current) => ({
      ...current,
      tieCandidates: null,
      quizResult: { ...scored, primary: code, secondary },
    }));
  }

  async function saveChildProfile() {
    if (!state.quizResult) return;

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
      activeSection: "home",
      onboardingMode: "",
      childDraft: { name: "", birthday: "" },
      quizIndex: -1,
      answers: [],
      tieCandidates: null,
      quizResult: null,
    }));

    if (state.accessStatus === "granted" && state.verifiedEmail) {
      try {
        await fetch("/api/member-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "quiz_result",
            email: state.verifiedEmail,
            childName: child.name,
            childBirthday: child.birthday,
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

    setState((current) => ({
      ...current,
      purchaseEmail: email,
      accessStatus: "loading",
      accessMessage: "",
    }));

    try {
      const response = await fetch("/api/premium-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
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
          accessMessage:
            "Todavia no encuentro una compra activa con ese correo. Revisa si usaste otro email o vuelve en un momento si acabas de comprar.",
        }));
        return;
      }

      setState((current) => ({
        ...current,
        verifiedEmail: email,
        accessStatus: "granted",
        premiumAccess: payload,
        accessMessage: "Compra verificada. Ya puedes usar el dashboard completo.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        verifiedEmail: "",
        accessStatus: "error",
        premiumAccess: null,
        accessMessage: error.message || "No pude verificar tu compra en este momento.",
      }));
    }
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
      napTaken: state.routineForm.napTaken === "yes",
      napWakeTime: state.routineForm.napWakeTime,
      selectedActivities: activeChild.selectedActivities,
      dislikedCounts: activeChild.dislikedCounts,
    });

    updateChild(activeChild.id, () => ({ lastPlan: plan }));
    setState((current) => ({
      ...current,
      currentPlan: plan,
      expandedSwapStep: "",
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

    updateChild(activeChild.id, (child) => ({
      selectedActivities: {
        ...child.selectedActivities,
        [stepId]: activityId,
      },
    }));

    const rebuiltPlan = buildPlan({
      profile: activeChild.primaryProfile,
      birthday: activeChild.birthday,
      wakeTime: state.routineForm.wakeTime,
      napTaken: state.routineForm.napTaken === "yes",
      napWakeTime: state.routineForm.napWakeTime,
      selectedActivities: {
        ...activeChild.selectedActivities,
        [stepId]: activityId,
      },
      dislikedCounts: activeChild.dislikedCounts,
    });

    setState((current) => ({
      ...current,
      currentPlan: rebuiltPlan,
      expandedSwapStep: stepId,
    }));
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

    updateChild(activeChild.id, (child) => ({
      logs: [nextLog, ...child.logs.filter((entry) => entry.date !== nextLog.date)].sort((left, right) =>
        left.date < right.date ? 1 : -1
      ),
      dislikedCounts,
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
            notes: nextLog.notes,
            ratings: nextLog.ratings,
          }),
        });

        setState((current) => ({
          ...current,
          persistenceMessage: "Guardado. Esta noche ya quedo registrada en tu cuenta.",
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
            <div>
              <span className="section-label">{strings.premiumDashboard}</span>
              <h1>{strings.gateTitle}</h1>
            </div>
            <label className="language-switch">
              <span>{state.language === "es" ? "Idioma" : "Language"}</span>
              <select
                value={state.language}
                onChange={(event) => setState((current) => ({ ...current, language: event.target.value }))}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>

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
                  {state.accessStatus === "loading" ? strings.verifying : strings.enterApp}
                </button>
              </form>
            </article>
          </div>
        </section>
      ) : (
        <>
          <header className="topbar">
            <div className="topbar__brand">
              <button className="menu-pill" type="button">
                ☰
              </button>
              <div>
                <strong>Buenas Noches</strong>
                <span>{activeChild ? activeChild.name : "Tu dashboard de sueno"}</span>
              </div>
            </div>
            <label className="language-switch language-switch--dark">
                <span>{state.language === "es" ? "Idioma" : "Language"}</span>
              <select
                value={state.language}
                onChange={(event) => setState((current) => ({ ...current, language: event.target.value }))}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </label>
            <button className="icon-pill" type="button" onClick={startAddChild} disabled={!canAddChild}>
              {canAddChild ? `+ ${strings.addChild}` : strings.slotsFull}
            </button>
          </header>

          <nav className="section-tabs">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={state.activeSection === tab.id ? "section-tab is-active" : "section-tab"}
                onClick={() => setState((current) => ({ ...current, activeSection: tab.id }))}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {!state.children.length || state.onboardingMode === "new-child" ? (
            <section className="app-panel">
              <article className="card card--feature">
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
                    <h3>{questions[state.quizIndex].prompt}</h3>
                    <div className="stack">
                      {questions[state.quizIndex].options.map((option) => (
                        <button
                          key={`${questions[state.quizIndex].id}-${option.key}`}
                          className="answer"
                          type="button"
                          onClick={() => answerQuestion(option)}
                        >
                          <span className="answer__badge">{option.key}</span>
                          <span className="answer__text">{option.label}</span>
                        </button>
                      ))}
                    </div>
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
              <div className="child-strip">
                {state.children.map((child) => {
                  const summary = buildProgressSummary(child.logs);
                  return (
                    <button
                      key={child.id}
                      type="button"
                      className={state.activeChildId === child.id ? "child-card is-active" : "child-card"}
                      onClick={() => setState((current) => ({ ...current, activeChildId: child.id, activeSection: "home" }))}
                    >
                      <span className="section-label">{profileMap[child.primaryProfile]?.name || "Sin perfil"}</span>
                      <strong>{child.name}</strong>
                      <span>{formatAgeLabel(child.birthday, state.language)}</span>
                      <small>{summary.averageLatency ? `${summary.averageLatency} min promedio` : "Aun sin noches guardadas"}</small>
                    </button>
                  );
                })}

                {canAddChild ? (
                  <button type="button" className="child-card child-card--ghost" onClick={startAddChild}>
                    <strong>Agregar nino</strong>
                    <span>Tienes {childSlots.total - state.children.length} espacio(s) disponible(s)</span>
                  </button>
                ) : (
                  <div className="child-card child-card--locked">
                    <strong>Slots completos</strong>
                    <span>1 nino incluido + {childSlots.extraChildren} extra desbloqueado(s)</span>
                    <small>El add-on se llama nino adicional buenas noches</small>
                  </div>
                )}
              </div>

              {state.persistenceMessage ? <p className="status-message status-success">{state.persistenceMessage}</p> : null}

              {state.activeSection === "home" ? (
                <HomeSection activeChild={activeChild} progressSummary={progressSummary} chartPoints={chartPoints} strings={strings} profileMap={profileMap} />
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
            </section>
          )}

          <nav className="bottom-nav">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={state.activeSection === tab.id ? "bottom-nav__item is-active" : "bottom-nav__item"}
                onClick={() => setState((current) => ({ ...current, activeSection: tab.id }))}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </main>
  );
}

function HomeSection({ activeChild, progressSummary, chartPoints, strings, profileMap }) {
  if (!activeChild) return null;

  return (
    <div className="dashboard-grid">
      <article className="card card--feature dashboard-card">
        <div className="card-header">
          <span className="section-label">Dashboard de {activeChild.name}</span>
          <h2>{profileMap[activeChild.primaryProfile]?.name}</h2>
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
        {activeChild.logs.length ? (
          <div className="chart-panel">
            <p>Linea: minutos para dormir. Barras: despertares nocturnos.</p>
            <svg viewBox="0 0 700 260" aria-hidden="true">
              <line x1="40" y1="200" x2="660" y2="200" stroke="rgba(255,255,255,0.18)" />
              <line x1="40" y1="30" x2="40" y2="200" stroke="rgba(255,255,255,0.18)" />
              {chartPoints.wakingBars.map((bar, index) => (
                <rect key={index} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="8" fill="rgba(169,216,221,0.28)" />
              ))}
              <polyline
                fill="none"
                stroke="#f4e7b2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints.points}
              />
              {chartPoints.circles.map((circle, index) => (
                <circle key={index} cx={circle.x} cy={circle.y} r="5" fill="#f8f3ea" />
              ))}
              {chartPoints.labels.map((label) => (
                <text
                  key={label.text}
                  x={label.x}
                  y="232"
                  fill="rgba(255,255,255,0.66)"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {label.text}
                </text>
              ))}
            </svg>
          </div>
        ) : (
          <p className="muted">{strings.noLogsYet}</p>
        )}
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
}) {
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
                <Stat label="Dormir" value={currentPlan.bedtime} />
                <Stat label="Perfil" value={profileMap[activeChild.primaryProfile]?.name} />
            </div>
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

          <article className="card card--soft">
            <div className="card-header">
              <span className="section-label">Registro nocturno</span>
              <h2>{strings.logTitle}</h2>
            </div>
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
    Sobreestimulacion verbal: "Too much verbal stimulation",
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
