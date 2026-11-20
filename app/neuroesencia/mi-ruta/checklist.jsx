"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, STORAGE_KEY, saveStorage } from "../../../lib/ruta-neuroesencia";
import { getChildren, createChild } from "../../../lib/tracker-api";
import styles from "./ruta.module.css";

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ChecklistPage() {
  const router = useRouter();
  // step 0 = child profile, steps 1-8 = reflex sections
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState(new Set());
  const [skipped, setSkipped] = useState(new Set());
  const [mounted, setMounted] = useState(false);

  // Child profile state
  const [email, setEmail] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childMode, setChildMode] = useState("select"); // "select" | "new"
  const [childLoading, setChildLoading] = useState(false);
  const [childError, setChildError] = useState("");

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);

    getChildren(e).then(list => {
      setChildren(list);
      if (list.length === 0) setChildMode("new");
    }).catch(() => {});

    const saved = loadSaved();
    if (saved && saved.childId) {
      setSelectedChildId(saved.childId);
      setSelections(new Set(saved.selections || []));
      setSkipped(new Set(saved.skipped || []));
      const step = saved.step;
      if (step >= 1 && step <= 8) setCurrentStep(step);
      else if (step >= 1) setCurrentStep(1);
    }
    setMounted(true);
  }, [router]);

  async function handleChildContinue() {
    setChildError("");
    if (childMode === "new") {
      if (!childName.trim()) { setChildError("Por favor escribe el nombre de tu hijo."); return; }
      setChildLoading(true);
      try {
        const child = await createChild(email, childName.trim(), childAge ? parseInt(childAge) : null);
        setChildren(prev => [...prev, child]);
        setSelectedChildId(child.id);
        saveStorage({ step: 1, childId: child.id, selections: [], skipped: [], priority: null, tieResolution: null });
        setCurrentStep(1);
      } catch {
        setChildError("No se pudo guardar el perfil. Intenta de nuevo.");
      } finally {
        setChildLoading(false);
      }
    } else {
      if (!selectedChildId) { setChildError("Selecciona un perfil o crea uno nuevo."); return; }
      saveStorage({ step: 1, childId: selectedChildId, selections: [], skipped: [], priority: null, tieResolution: null });
      setCurrentStep(1);
    }
  }

  function persist(newSelections, newSkipped, step) {
    saveStorage({
      step,
      childId: selectedChildId,
      selections: [...newSelections],
      skipped: [...newSkipped],
      priority: null,
      tieResolution: null,
    });
  }

  function toggleObs(obsId) {
    const section = SECTIONS[currentStep - 1];
    if (skipped.has(section.id)) return;
    const next = new Set(selections);
    if (next.has(obsId)) next.delete(obsId);
    else next.add(obsId);
    setSelections(next);
    persist(next, skipped, currentStep);
  }

  function toggleSkip() {
    const section = SECTIONS[currentStep - 1];
    const nextSkipped = new Set(skipped);
    const nextSelections = new Set(selections);

    if (nextSkipped.has(section.id)) {
      nextSkipped.delete(section.id);
    } else {
      nextSkipped.add(section.id);
      // Deselect all in this section
      for (const obs of section.observations) {
        nextSelections.delete(obs.id);
      }
      setSelections(nextSelections);
    }
    setSkipped(nextSkipped);
    persist(nextSelections, nextSkipped, currentStep);
  }

  function goBack() {
    if (currentStep === 1) {
      setCurrentStep(0);
    } else {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      persist(selections, skipped, prev);
    }
  }

  function goNext() {
    if (currentStep === 8) {
      persist(selections, skipped, 9);
      // Check if any selections — if none, skip priority and go to results
      if (selections.size === 0) {
        saveStorage({ step: 10, selections: [], skipped: [...skipped], priority: null, tieResolution: null });
        router.push("/neuroesencia/mi-ruta/results");
      } else {
        router.push("/neuroesencia/mi-ruta/priority");
      }
    } else {
      const next = currentStep + 1;
      setCurrentStep(next);
      persist(selections, skipped, next);
    }
  }

  if (!mounted) return null;

  // ── Step 0: child profile ──────────────────────────────────────────────────
  if (currentStep === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.entryCard}>
            <p className={styles.sectionHeading}>Perfil del niño</p>

            {children.length > 0 && (
              <div className={styles.childToggle}>
                <button
                  className={`${styles.childToggleBtn} ${childMode === "select" ? styles.childToggleBtnActive : ""}`}
                  onClick={() => setChildMode("select")}
                >Mis perfiles</button>
                <button
                  className={`${styles.childToggleBtn} ${childMode === "new" ? styles.childToggleBtnActive : ""}`}
                  onClick={() => setChildMode("new")}
                >Nuevo perfil</button>
              </div>
            )}

            {childMode === "select" && children.length > 0 && (
              <div className={styles.childList}>
                {children.map(c => (
                  <div
                    key={c.id}
                    className={`${styles.childRow} ${selectedChildId === c.id ? styles.childRowSelected : ""}`}
                    onClick={() => setSelectedChildId(c.id)}
                    role="radio"
                    aria-checked={selectedChildId === c.id}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === " " || e.key === "Enter") setSelectedChildId(c.id); }}
                  >
                    <span className={`${styles.radio} ${selectedChildId === c.id ? styles.radioSelected : ""}`}>
                      {selectedChildId === c.id && <span className={styles.radioDot} />}
                    </span>
                    <span className={styles.childRowText}>
                      <strong>{c.child_name}</strong>
                      {c.age_years ? <span className={styles.childAge}> · {c.age_years} años</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {childMode === "new" && (
              <div className={styles.childForm}>
                <label className={styles.fieldLabel}>Nombre del niño</label>
                <input
                  className={styles.fieldInput}
                  type="text"
                  placeholder="Ej. Sofía"
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                  maxLength={60}
                />
                <label className={styles.fieldLabel} style={{ marginTop: 16 }}>Edad (años)</label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  placeholder="Ej. 5"
                  value={childAge}
                  onChange={e => setChildAge(e.target.value)}
                  min={1}
                  max={18}
                />
              </div>
            )}

            {childError && <p className={styles.fieldError}>{childError}</p>}
          </div>

          <div className={styles.navRow}>
            <button className={styles.btnBack} onClick={() => router.push("/neuroesencia/mi-ruta")}>
              ← Atrás
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleChildContinue}
              disabled={childLoading}
              style={{ flex: "0 0 auto", padding: "14px 32px" }}
            >
              {childLoading ? "Guardando…" : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const section = SECTIONS[currentStep - 1];
  const isSkipped = skipped.has(section.id);
  const pct = Math.round((currentStep / 8) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.progress}>{currentStep} de 8</p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>

        <div className={styles.entryCard}>
          <p className={styles.sectionHeading}>{section.heading}</p>

          {currentStep === 1 && (
            <p className={styles.instructions}>
              Marca lo que pasa seguido en el día a día de tu hijo. Puedes incluir lo que te cuenta su profe. Si no estás seguro o la situación todavía no forma parte de su rutina, déjala en blanco.
            </p>
          )}

          <div className={styles.obsList}>
            {section.observations.map(obs => {
              const checked = selections.has(obs.id);
              return (
                <div
                  key={obs.id}
                  className={`${styles.obsRow} ${isSkipped ? styles.obsRowSkipped : ""}`}
                  onClick={() => toggleObs(obs.id)}
                  role="checkbox"
                  aria-checked={checked}
                  tabIndex={isSkipped ? -1 : 0}
                  onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleObs(obs.id); } }}
                >
                  <span className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ""}`}>
                    {checked ? "✓" : ""}
                  </span>
                  <span className={styles.obsText}>{obs.text}</span>
                </div>
              );
            })}
          </div>

          <div
            className={styles.skipRow}
            onClick={toggleSkip}
            role="checkbox"
            aria-checked={isSkipped}
            tabIndex={0}
            onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleSkip(); } }}
          >
            <span className={`${styles.skipCheck} ${isSkipped ? styles.skipCheckActive : ""}`}>
              {isSkipped ? "✓" : ""}
            </span>
            Esta sección no aplica
          </div>
        </div>

        <div className={styles.navRow}>
          <button className={styles.btnBack} onClick={goBack}>
            ← Atrás
          </button>
          <button className={styles.btnPrimary} onClick={goNext} style={{ flex: "0 0 auto", padding: "14px 32px" }}>
            {currentStep === 8 ? "Ver resultados" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
