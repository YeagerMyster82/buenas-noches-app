"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, STORAGE_KEY } from "../../../lib/ruta-neuroesencia";
import { getChildren, createChild, saveRatings, FREQ_LABELS, IMPACT_LABELS } from "../../../lib/tracker-api";
import styles from "./evaluar.module.css";

// ── helpers ───────────────────────────────────────────────────────────────────

function loadRutaData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function sectionsWithSelections(selections) {
  return SECTIONS.filter(s => s.observations.some(o => selections.has(o.id)));
}

// ── main component ────────────────────────────────────────────────────────────

export default function EvaluarPage() {
  const router = useRouter();
  const [phase, setPhase] = useState("loading"); // loading | child | rate | saving | done | error | no-data
  const [email, setEmail] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const [ratingStep, setRatingStep] = useState(0); // index into activeSections
  const [ratings, setRatings] = useState({}); // sectionId → { frequency, life_impact }
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);

    const ruta = loadRutaData();
    if (!ruta || !ruta.selections || ruta.selections.length === 0) {
      setPhase("no-data"); return;
    }
    const sel = new Set(ruta.selections);
    const secs = sectionsWithSelections(sel);
    if (secs.length === 0) { setPhase("no-data"); return; }
    setActiveSections(secs);

    getChildren(e).then(list => {
      setChildren(list);
      setPhase("child");
    }).catch(() => setPhase("child"));
  }, [router]);

  // ── child selection ─────────────────────────────────────────────────────────

  async function handlePickChild(child) {
    setSelectedChild(child);
    setPhase("rate");
    setRatingStep(0);
  }

  async function handleCreateChild() {
    if (!newName.trim()) return;
    try {
      const child = await createChild(email, newName, newAge ? parseInt(newAge) : null);
      setChildren(c => [...c, child]);
      setSelectedChild(child);
      setShowNewForm(false);
      setPhase("rate");
      setRatingStep(0);
    } catch (e) {
      setErrorMsg("No se pudo crear el perfil. Intenta de nuevo.");
    }
  }

  // ── rating ──────────────────────────────────────────────────────────────────

  function setRating(sectionId, field, value) {
    setRatings(r => ({ ...r, [sectionId]: { ...r[sectionId], [field]: value } }));
  }

  function currentRating() {
    const sec = activeSections[ratingStep];
    return ratings[sec?.id] || {};
  }

  function canContinue() {
    const r = currentRating();
    return r.frequency && r.life_impact;
  }

  function goNextRating() {
    if (ratingStep < activeSections.length - 1) {
      setRatingStep(s => s + 1);
    } else {
      handleSave();
    }
  }

  function goPrevRating() {
    if (ratingStep === 0) {
      setPhase("child");
    } else {
      setRatingStep(s => s - 1);
    }
  }

  async function handleSave() {
    setPhase("saving");
    const ruta = loadRutaData();
    const sel = ruta ? new Set(ruta.selections) : new Set();
    const rows = activeSections.map(sec => {
      const r = ratings[sec.id] || {};
      const selectedObs = sec.observations.filter(o => sel.has(o.id));
      return {
        symptom_id: selectedObs.map(o => o.id).join(","),
        section_id: sec.id,
        frequency: r.frequency || 1,
        life_impact: r.life_impact || 1,
      };
    });
    try {
      await saveRatings(email, selectedChild.id, rows);
      setPhase("done");
    } catch {
      setErrorMsg("No se pudieron guardar las respuestas. Intenta de nuevo.");
      setPhase("error");
    }
  }

  // ── renders ─────────────────────────────────────────────────────────────────

  if (phase === "loading") return <div className={styles.page}><div className={styles.spinner} /></div>;

  if (phase === "no-data") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Primero completa Mi ruta</p>
            <p className={styles.cardSub}>Marca los síntomas de tu hijo en el cuestionario y luego podrás evaluar el progreso aquí.</p>
            <button className={styles.btnPrimary} onClick={() => router.push("/neuroesencia/mi-ruta")}>
              Ir a Mi ruta →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "child") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <h1 className={styles.heading}>¿Para quién guardamos el progreso?</h1>
            <p className={styles.sub}>Selecciona el perfil de tu hijo o crea uno nuevo.</p>

            {children.length > 0 && (
              <div className={styles.childList}>
                {children.map(c => (
                  <button key={c.id} className={styles.childRow} onClick={() => handlePickChild(c)}>
                    <span className={styles.childAvatar}>{c.child_name[0].toUpperCase()}</span>
                    <div>
                      <p className={styles.childName}>{c.child_name}</p>
                      {c.age_years && <p className={styles.childAge}>{c.age_years} años</p>}
                    </div>
                    <span className={styles.chevronRight}>›</span>
                  </button>
                ))}
              </div>
            )}

            {!showNewForm ? (
              <button className={styles.btnOutline} onClick={() => setShowNewForm(true)}>
                + Agregar nuevo perfil
              </button>
            ) : (
              <div className={styles.newForm}>
                <label className={styles.label}>Nombre del niño</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nombre"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  autoFocus
                />
                <label className={styles.label}>Edad (opcional)</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="ej. 7"
                  value={newAge}
                  onChange={e => setNewAge(e.target.value)}
                  min="1"
                  max="18"
                />
                {errorMsg && <p className={styles.error}>{errorMsg}</p>}
                <div className={styles.navRow}>
                  <button className={styles.btnBack} onClick={() => { setShowNewForm(false); setErrorMsg(""); }}>Cancelar</button>
                  <button className={styles.btnPrimary} onClick={handleCreateChild} disabled={!newName.trim()}>
                    Crear perfil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "rate") {
    const sec = activeSections[ratingStep];
    const r = currentRating();
    const pct = Math.round(((ratingStep + 1) / activeSections.length) * 100);

    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.progress}>{ratingStep + 1} de {activeSections.length}</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>

          <div className={styles.card}>
            <p className={styles.sectionTag}>{sec.heading}</p>
            <h2 className={styles.heading}>¿Con qué frecuencia ocurre esto?</h2>
            <p className={styles.sub}>Piensa en las últimas dos semanas con {selectedChild.child_name}.</p>

            <div className={styles.scaleGroup}>
              <p className={styles.scaleLabel}>Frecuencia</p>
              <div className={styles.scaleRow}>
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    className={`${styles.scaleBtn} ${r.frequency === v ? styles.scaleBtnActive : ""}`}
                    onClick={() => setRating(sec.id, "frequency", v)}
                  >
                    {FREQ_LABELS[v]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.scaleGroup}>
              <p className={styles.scaleLabel}>¿Cuánto afecta su día a día?</p>
              <div className={styles.scaleRow}>
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    className={`${styles.scaleBtn} ${r.life_impact === v ? styles.scaleBtnActive : ""}`}
                    onClick={() => setRating(sec.id, "life_impact", v)}
                  >
                    {IMPACT_LABELS[v]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.navRow}>
            <button className={styles.btnBack} onClick={goPrevRating}>← Atrás</button>
            <button
              className={styles.btnPrimary}
              onClick={goNextRating}
              disabled={!canContinue()}
            >
              {ratingStep === activeSections.length - 1 ? "Guardar" : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "saving") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card} style={{ textAlign: "center" }}>
            <div className={styles.spinner} />
            <p className={styles.sub} style={{ marginTop: 16 }}>Guardando…</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.doneIcon}>✓</div>
            <h2 className={styles.heading}>¡Listo!</h2>
            <p className={styles.sub}>
              Guardamos las observaciones para {selectedChild.child_name}. Te avisaremos en dos semanas para hacer un nuevo seguimiento.
            </p>
            <button className={styles.btnPrimary} onClick={() => router.push("/neuroesencia/progreso")}>
              Ver progreso →
            </button>
            <button className={styles.btnBack2} onClick={() => router.push("/neuroesencia/mi-ruta/results")}>
              Volver a mis resultados
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Algo salió mal</p>
            <p className={styles.error}>{errorMsg}</p>
            <button className={styles.btnPrimary} onClick={() => { setErrorMsg(""); setPhase("rate"); }}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
