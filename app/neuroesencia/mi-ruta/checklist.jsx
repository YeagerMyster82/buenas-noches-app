"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, STORAGE_KEY, saveStorage } from "../../../lib/ruta-neuroesencia";
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
  const [currentStep, setCurrentStep] = useState(1); // 1-8
  const [selections, setSelections] = useState(new Set());
  const [skipped, setSkipped] = useState(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setSelections(new Set(saved.selections || []));
      setSkipped(new Set(saved.skipped || []));
      const step = saved.step;
      if (step >= 1 && step <= 8) setCurrentStep(step);
    }
    setMounted(true);
  }, []);

  function persist(newSelections, newSkipped, step) {
    saveStorage({
      step,
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
      router.push("/neuroesencia/mi-ruta");
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
              Marca lo que observas con frecuencia en el día a día de tu hijo. Si una actividad todavía no forma parte de su rutina, puedes dejar esa opción en blanco.
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
