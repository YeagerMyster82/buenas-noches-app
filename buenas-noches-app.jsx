"use client";

import { useEffect, useState } from "react";
import {
  profileMap,
  questions,
  scoreAnswers,
  resolveTieCandidates,
  buildResultCopy,
} from "../lib/quiz";
import { buildPlan, buildChartPoints, calculateLatency } from "../lib/routine";

const storageKey = "buenas-noches-webapp-v1";

const initialState = {
  quizIndex: -1,
  answers: [],
  result: null,
  tieCandidates: null,
  wantsRoutine: false,
  purchaseEmail: "",
  accessStatus: "idle",
  accessMessage: "",
  premiumAccess: null,
  routineRequest: {
    age: "",
    wakeTime: "",
    napTaken: "no",
    napWakeTime: "",
  },
  currentPlan: null,
  logs: [],
  dislikedByFunction: {},
};

export default function BuenasNochesApp() {
  const [state, setState] = useState(initialState);

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

  const hasStarted = state.quizIndex >= 0 || state.result;
  const chartPoints = buildChartPoints(state.logs);

  function startQuiz() {
    setState({ ...initialState, quizIndex: 0 });
  }

  function answerQuestion(option) {
    const nextAnswers = [...state.answers, { questionId: questions[state.quizIndex].id, optionKey: option.key }];
    const nextIndex = state.quizIndex + 1;

    if (nextIndex >= questions.length) {
      const scored = scoreAnswers(nextAnswers);
      const tieCandidates = resolveTieCandidates(scored);

      if (tieCandidates) {
        setState({ ...state, answers: nextAnswers, quizIndex: nextIndex, tieCandidates });
        return;
      }

      setState({
        ...state,
        answers: nextAnswers,
        quizIndex: nextIndex,
        tieCandidates: null,
        result: scored,
      });
      return;
    }

    setState({ ...state, answers: nextAnswers, quizIndex: nextIndex });
  }

  function chooseTieWinner(code) {
    const scored = scoreAnswers(state.answers);
    const secondary = state.tieCandidates.find((candidate) => candidate !== code) || null;
    setState({
      ...state,
      tieCandidates: null,
      result: { ...scored, primary: code, secondary },
    });
  }

  function updateRoutineField(field, value) {
    setState({
      ...state,
      routineRequest: {
        ...state.routineRequest,
        [field]: value,
      },
    });
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
          accessStatus: "not_found",
          premiumAccess: null,
          accessMessage:
            "Todavía no encuentro una compra activa con ese correo. Revisa si usaste otro email o vuelve en un momento si acabas de comprar.",
        }));
        return;
      }

      setState((current) => ({
        ...current,
        accessStatus: "granted",
        premiumAccess: payload,
        accessMessage: "Compra verificada ✨ Ya puedes desbloquear tu rutina personalizada.",
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        accessStatus: "error",
        premiumAccess: null,
        accessMessage: error.message || "No pude verificar tu compra en este momento.",
      }));
    }
  }

  function generateRoutine(event) {
    event.preventDefault();
    const plan = buildPlan({
      primaryProfile: state.result.primary,
      secondaryProfile: state.result.secondary,
      age: Number(state.routineRequest.age),
      wakeTime: state.routineRequest.wakeTime,
      napTaken: state.routineRequest.napTaken === "yes",
      napWakeTime: state.routineRequest.napWakeTime,
      dislikedByFunction: state.dislikedByFunction,
    });
    setState({ ...state, currentPlan: plan });
  }

  function submitNightLog(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bedTime = formData.get("bedTime");
    const sleepTime = formData.get("sleepTime");
    const notes = String(formData.get("notes") || "");

    const ratings = state.currentPlan.steps.map((step, index) => {
      const disliked = formData.get(`disliked-${index}`) === "yes";
      return {
        functionKey: step.functionKey,
        activity: step.activity,
        rating: Number(formData.get(`rating-${index}`) || 0),
        disliked,
      };
    });

    const dislikedByFunction = { ...state.dislikedByFunction };
    ratings.forEach((rating) => {
      if (!rating.disliked) return;
      dislikedByFunction[rating.functionKey] = dislikedByFunction[rating.functionKey] || [];
      if (!dislikedByFunction[rating.functionKey].includes(rating.activity)) {
        dislikedByFunction[rating.functionKey].push(rating.activity);
      }
    });

    const nextLog = {
      date: String(formData.get("date")),
      bedTime,
      sleepTime,
      latency: calculateLatency(bedTime, sleepTime),
      notes,
      ratings,
    };

    const logs = [nextLog, ...state.logs.filter((entry) => entry.date !== nextLog.date)].sort((a, b) =>
      a.date < b.date ? 1 : -1
    );

    setState({
      ...state,
      logs,
      dislikedByFunction,
    });
  }

  const safetyTriggered = state.logs[0]?.notes
    ? /ronquidos|respirar|convuls|dolor|regresi|insomnio|autoles/i.test(state.logs[0].notes)
    : false;

  const resultCopy = state.result ? buildResultCopy(state.result) : null;
  const latestLog = state.logs[0];
  const averageLatency =
    state.logs.length > 0
      ? Math.round(state.logs.reduce((sum, entry) => sum + entry.latency, 0) / state.logs.length)
      : 0;

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-copy">
          <img className="brand-logo" src="/brand/logo-buenas-noches.png" alt="Buenas Noches" />
          <span className="eyebrow">Sueño adaptivo para esta noche</span>
          <h1>Una rutina que por fin responde al patrón real de tu hijo.</h1>
          <p>
            Buenas Noches identifica el perfil de sueño, protege la función regulatoria correcta y te entrega
            un orden claro para hoy, con seguimiento y mejoras noche tras noche.
          </p>
        </div>
        <img className="hero-animals" src="/brand/animales-buenas-noches.png" alt="" />
      </section>

      <section className="grid">
        <article className="card main-card">
          <div className="card-header">
            <span className="section-label">Quiz guiado</span>
            <h2>Hola, mamá 💛</h2>
          </div>

          {!hasStarted && (
            <div className="stack">
              <p>
                Sé que probablemente estás leyendo esto cansada. Quizás ya son las 9 de la noche y todavía no
                ha cerrado los ojos.
              </p>
              <p>
                Voy a hacerte 10 preguntas rápidas para identificar qué está pasando en el sistema nervioso de
                tu hijo a la hora de dormir. No hay respuestas correctas ni incorrectas, solo cuéntame lo que
                ves.
              </p>
              <p>Al final te digo exactamente qué perfil veo y por qué tu hijo hace lo que hace.</p>
              <button className="button button-primary" onClick={startQuiz}>
                Empezar quiz
              </button>
            </div>
          )}

          {state.quizIndex >= 0 && state.quizIndex < questions.length && (
            <div className="stack">
              <div className="progress-row">
                <strong>
                  Pregunta {state.quizIndex + 1} de {questions.length}
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
                    onClick={() => answerQuestion(option)}
                  >
                    <strong>{option.key})</strong>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {state.tieCandidates && (
            <div className="stack">
              <p>
                Estoy viendo una mezcla entre dos patrones y quiero respetar lo que tú estás observando.
              </p>
              <p>
                <strong>De estas dos opciones, ¿cuál sientes que describe MÁS a tu hijo en este momento?</strong>
              </p>
              {state.tieCandidates.map((code) => (
                <button key={code} className="button button-secondary" onClick={() => chooseTieWinner(code)}>
                  {profileMap[code].name}
                </button>
              ))}
            </div>
          )}

          {resultCopy && (
            <div className="stack">
              <div className="result-banner">
                <p>Listo 💛</p>
                <p>Según todo lo que me contaste, tu hijo encaja principalmente en el perfil:</p>
                <h3>👉 {resultCopy.primaryName}</h3>
                <p>{resultCopy.reassurance}</p>
              </div>
              <p>{resultCopy.primaryDescription}</p>
              <p>{resultCopy.framework}</p>
              {resultCopy.secondaryName ? (
                <p>
                  <strong>También veo rasgos de {resultCopy.secondaryName}</strong>, así que puede haber una
                  mezcla de patrones.
                </p>
              ) : null}
              <p>
                <strong>
                  ¿Quieres que te arme una rutina específica para esta noche basada en la edad de tu hijo, la
                  hora a la que se despertó hoy y este perfil?
                </strong>
              </p>
              <div className="inline-actions">
                <button className="button button-primary" onClick={() => setState({ ...state, wantsRoutine: true })}>
                  Sí, quiero la rutina
                </button>
                <button className="button button-ghost" onClick={() => setState({ ...state, wantsRoutine: false })}>
                  No por ahora
                </button>
              </div>
            </div>
          )}
        </article>

        <aside className="sidebar">
          <article className="card">
            <div className="card-header">
              <span className="section-label">Acceso premium</span>
              <h2>Desbloqueo por compra</h2>
            </div>
            {!state.wantsRoutine && (
              <p className="muted">
                El quiz y el perfil se pueden explorar gratis. La rutina personalizada, el seguimiento y la
                adaptación se desbloquean después de la compra.
              </p>
            )}
            {state.wantsRoutine && state.accessStatus !== "granted" && (
              <form className="stack" onSubmit={verifyPremiumAccess}>
                <p>
                  Me encanta 💛 Esa rutina personalizada es uno de los beneficios de la comunidad Buenas
                  Noches.
                </p>
                <label className="stack compact">
                  <span>Correo que usaste al comprar</span>
                  <input
                    type="email"
                    placeholder="tuemail@ejemplo.com"
                    value={state.purchaseEmail}
                    onChange={(event) => setState({ ...state, purchaseEmail: event.target.value })}
                    required
                  />
                </label>
                <p className="muted">
                  Aquí sí estamos revisando Supabase para confirmar si tu compra ya llegó desde Captivation Hub.
                </p>
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
                <button className="button button-secondary" type="submit" disabled={state.accessStatus === "loading"}>
                  {state.accessStatus === "loading" ? "Verificando..." : "Verificar compra"}
                </button>
              </form>
            )}
            {state.accessStatus === "granted" && (
              <div className="stack">
                <p>
                  <strong>Perfecto ✨</strong>
                </p>
                <p>Correo listo: {state.purchaseEmail}</p>
                <p className="muted">{state.accessMessage}</p>
              </div>
            )}
          </article>

          {state.result && state.accessStatus === "granted" && (
            <article className="card">
              <div className="card-header">
                <span className="section-label">Rutina de hoy</span>
                <h2>Mapear esta noche</h2>
              </div>
              <form className="stack" onSubmit={generateRoutine}>
                <label className="stack compact">
                  <span>¿Qué edad tiene tu hijo?</span>
                  <input
                    type="number"
                    min="2"
                    max="12"
                    value={state.routineRequest.age}
                    onChange={(event) => updateRoutineField("age", event.target.value)}
                    required
                  />
                </label>
                <label className="stack compact">
                  <span>¿A qué hora se despertó hoy?</span>
                  <input
                    type="time"
                    value={state.routineRequest.wakeTime}
                    onChange={(event) => updateRoutineField("wakeTime", event.target.value)}
                    required
                  />
                </label>
                <label className="stack compact">
                  <span>¿Durmió siesta?</span>
                  <select
                    value={state.routineRequest.napTaken}
                    onChange={(event) => updateRoutineField("napTaken", event.target.value)}
                  >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </label>
                {state.routineRequest.napTaken === "yes" && (
                  <label className="stack compact">
                    <span>¿A qué hora se despertó de la siesta?</span>
                    <input
                      type="time"
                      value={state.routineRequest.napWakeTime}
                      onChange={(event) => updateRoutineField("napWakeTime", event.target.value)}
                      required
                    />
                  </label>
                )}
                <button className="button button-primary" type="submit">
                  Generar rutina para hoy
                </button>
              </form>
            </article>
          )}
        </aside>

        {state.currentPlan && (
          <>
            <article className="card">
              <div className="card-header">
                <span className="section-label">Plan personalizado</span>
                <h2>Rutina personalizada para hoy</h2>
              </div>
              <p>{state.currentPlan.profileInstruction}</p>
              <div className="summary-grid">
                <Stat label="Edad" value={`${state.currentPlan.age} años`} />
                <Stat label="Se despertó hoy" value={state.currentPlan.wakeTime} />
                <Stat label="Perfil" value={profileMap[state.currentPlan.primaryProfile].name} />
                <Stat label="Cena" value={state.currentPlan.dinnerTime} />
                <Stat label="Empezar rutina" value={state.currentPlan.routineStart} />
                <Stat label="Dormir" value={state.currentPlan.bedtime} />
              </div>
              <div className="stack">
                {state.currentPlan.steps.map((step, index) => (
                  <div className="step-card" key={`${step.activity}-${index}`}>
                    <div className="step-topline">
                      <strong>
                        Paso {index + 1}: {step.activity}
                      </strong>
                      <span>
                        {step.start} - {step.end}
                      </span>
                    </div>
                    <span className="pill">{step.functionKey}</span>
                    <p>
                      <strong>Objetivo:</strong> {step.purpose}
                    </p>
                    <p>{step.note}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="card">
              <div className="card-header">
                <span className="section-label">Registro nocturno</span>
                <h2>Cómo les fue hoy</h2>
              </div>
              <form className="stack" onSubmit={submitNightLog}>
                <label className="stack compact">
                  <span>Fecha</span>
                  <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
                </label>
                <label className="stack compact">
                  <span>¿A qué hora se metió a la cama?</span>
                  <input name="bedTime" type="time" required />
                </label>
                <label className="stack compact">
                  <span>¿A qué hora se quedó dormido?</span>
                  <input name="sleepTime" type="time" required />
                </label>
                {state.currentPlan.steps.map((step, index) => (
                  <div className="rating-card" key={`${step.functionKey}-${index}`}>
                    <strong>{step.activity}</strong>
                    <span className="muted">Objetivo regulatorio: {step.functionKey}</span>
                    <label className="stack compact">
                      <span>¿Cómo se sintió esta actividad hoy?</span>
                      <select name={`rating-${index}`} defaultValue="3">
                        <option value="3">Le ayudó mucho</option>
                        <option value="2">Más o menos</option>
                        <option value="1">No ayudó mucho</option>
                      </select>
                    </label>
                    <label className="stack compact">
                      <span>¿No le gustó esta actividad?</span>
                      <select name={`disliked-${index}`} defaultValue="no">
                        <option value="no">No</option>
                        <option value="yes">Sí</option>
                      </select>
                    </label>
                  </div>
                ))}
                <label className="stack compact">
                  <span>Notas</span>
                  <textarea
                    name="notes"
                    placeholder="Aquí puedes dejar cualquier detalle importante de la noche."
                  />
                </label>
                <button className="button button-primary" type="submit">
                  Guardar resultados
                </button>
              </form>
              {safetyTriggered && (
                <div className="safety-card">
                  Lo que me estás contando va más allá de lo que esta herramienta puede orientar. Merece una
                  evaluación directa con un profesional que pueda ver a tu hijo en persona y descartar algo más
                  importante.
                </div>
              )}
            </article>
          </>
        )}

        {state.logs.length > 0 && (
          <article className="card full-width">
            <div className="card-header">
              <span className="section-label">Progreso</span>
              <h2>Así va cambiando la noche</h2>
            </div>
            <div className="summary-grid">
              <Stat label="Promedio para dormir" value={`${averageLatency} min`} />
              <Stat label="Última hora en cama" value={latestLog.bedTime} />
              <Stat label="Última hora dormido" value={latestLog.sleepTime} />
              <Stat label="Último resultado" value={`${latestLog.latency} min`} />
            </div>
            <div className="chart-panel">
              <p>Minutos para dormir por noche</p>
              <svg viewBox="0 0 700 240" aria-hidden="true">
                <line x1="40" y1="200" x2="660" y2="200" stroke="rgba(255,255,255,0.28)" />
                <line x1="40" y1="24" x2="40" y2="200" stroke="rgba(255,255,255,0.28)" />
                <polyline
                  fill="none"
                  stroke="#f4e7b2"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints.points}
                />
                {chartPoints.circles.map((circle, index) => (
                  <circle key={index} cx={circle.x} cy={circle.y} r="5" fill="#a9d8dd" />
                ))}
                {chartPoints.labels.map((label) => (
                  <text
                    key={label.text}
                    x={label.x}
                    y="225"
                    fill="rgba(255,255,255,0.72)"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {label.text}
                  </text>
                ))}
              </svg>
            </div>
            <div className="stack">
              {state.logs.map((entry) => (
                <div className="history-card" key={entry.date}>
                  <strong>{entry.date}</strong>
                  <p>
                    Se acostó a las {entry.bedTime}, se durmió a las {entry.sleepTime} y tardó {entry.latency}{" "}
                    minutos.
                  </p>
                  <p className="muted">{entry.notes || "Sin notas adicionales."}</p>
                </div>
              ))}
            </div>
          </article>
        )}
      </section>
    </main>
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
