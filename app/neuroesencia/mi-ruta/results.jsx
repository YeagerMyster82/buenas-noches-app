"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SECTIONS, STORAGE_KEY, computeResult, saveStorage } from "../../../lib/ruta-neuroesencia";
import styles from "./ruta.module.css";

function obsText(obsId) {
  for (const sec of SECTIONS) {
    const found = sec.observations.find(o => o.id === obsId);
    if (found) return found.text;
  }
  return obsId;
}

function obsCount(sectionId, selections) {
  const sec = SECTIONS.find(s => s.id === sectionId);
  if (!sec) return 0;
  return sec.observations.filter(o => selections.has(o.id)).length;
}

function selectedTexts(sectionId, selections, limit = 2) {
  const sec = SECTIONS.find(s => s.id === sectionId);
  if (!sec) return [];
  return sec.observations.filter(o => selections.has(o.id)).slice(0, limit).map(o => o.text);
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { router.replace("/neuroesencia/mi-ruta"); return; }
      const saved = JSON.parse(raw);
      const sel = new Set(saved.selections || []);
      const skip = new Set(saved.skipped || []);
      const prio = saved.priority || null;
      const tieRes = saved.tieResolution || null;

      let effectivePriority = prio;
      // If tieResolution was saved, treat it as a section-level priority hint
      const computed = computeResult(sel, skip, effectivePriority);

      setData({ saved, sel, skip, prio, tieRes });
      setResult(computed);
      // Save step=10
      saveStorage({ ...saved, step: 10 });
    } catch {}
    setMounted(true);
  }, [router]);

  function handleTiePick(sectionId) {
    if (!data) return;
    const { saved, sel, skip, prio } = data;
    // Find the section
    const sec = SECTIONS.find(s => s.id === sectionId);
    if (!sec) return;
    // Use tieResolution to override: treat chosen section's first obs as priority if no prio
    // We store tieResolution and recompute with it as priority
    const newPrio = prio || sec.observations.find(o => sel.has(o.id))?.id || null;
    saveStorage({ ...saved, step: 10, tieResolution: sectionId, priority: newPrio });
    const newResult = computeResult(sel, skip, newPrio);
    setData(d => ({ ...d, prio: newPrio, tieRes: sectionId }));
    setResult(newResult);
  }

  function handleEdit() {
    if (!data) return;
    const { saved } = data;
    saveStorage({ ...saved, step: 1, priority: null, tieResolution: null });
    router.push("/neuroesencia/mi-ruta/checklist");
  }

  if (!mounted || !data) return null;

  const { sel, prio } = data;

  // Tie resolution needed
  if (result && result.tieOptions && result.tieOptions.length > 0 && !result.first) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.entryCard}>
            <h2 className={styles.priorityHeading}>¿Cuál prefieres explorar primero?</h2>
            {result.tieOptions.map(sec => (
              <div
                key={sec.sectionId || sec.id}
                className={styles.tieCard}
                onClick={() => handleTiePick(sec.sectionId || sec.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleTiePick(sec.sectionId || sec.id); } }}
              >
                <p className={styles.tieCardLabel}>{sec.moduleLabel}</p>
                <p className={styles.tieCardSub}>{sec.heading}</p>
              </div>
            ))}
          </div>
          <button className={styles.editLink} onClick={handleEdit}>Editar mis respuestas</button>
        </div>
      </div>
    );
  }

  // Zero selections
  if (!result || !result.first) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.primaryCard}>
            <p className={styles.cardLabel}>Módulo sugerido</p>
            <h2 className={styles.cardTitle}>Puedes empezar por la introducción</h2>
            <p className={styles.cardBody}>
              Ahí encontrarás una explicación de los ocho reflejos y cómo está organizado el curso.
            </p>
            <Link href="/neuroesencia/el-secreto-de-los-ejercicios" className={styles.btnPrimary}>
              Ver la introducción
            </Link>
          </div>
          <button className={styles.editLink} onClick={handleEdit}>Editar mis respuestas</button>
          <p className={styles.footer}>
            Esta guía te ayuda a navegar el curso. Si algo interfiere con las actividades diarias de tu hijo, puedes comentarlo con su pediatra.
          </p>
        </div>
      </div>
    );
  }

  const { first, second } = result;
  const count = obsCount(first.sectionId, sel);
  const priorityObsText = prio ? obsText(prio) : null;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Primary card */}
        <div className={styles.primaryCard}>
          <p className={styles.cardLabel}>Tu primer módulo sugerido</p>
          <h2 className={styles.cardTitle}>Tu primer paso: {first.moduleLabel}</h2>
          <p className={styles.cardBody}>
            {priorityObsText
              ? <>Marcaste «{priorityObsText}» como tu prioridad. Empieza por el módulo {first.moduleLabel} para conocer este tema.</>
              : <>Marcaste {count} observación{count !== 1 ? "es" : ""} en {first.heading}. Empieza por el módulo {first.moduleLabel} para conocer este tema.</>
            }
          </p>
          <Link href={`/neuroesencia/${first.firstLessonSlug}`} className={styles.btnPrimary}>
            Ver mi primera lección
          </Link>
        </div>

        {/* Secondary card */}
        {second && (
          <div className={styles.secondaryCard}>
            <p className={`${styles.cardLabel} ${styles.cardLabelSecondary}`}>Para explorar después</p>
            <h2 className={styles.cardTitle} style={{ fontSize: "17px" }}>{second.moduleLabel}</h2>
            <p className={styles.cardBody}>
              También marcaste observaciones en {second.heading}.
            </p>
            {selectedTexts(second.sectionId, sel, 2).length > 0 && (
              <ul className={styles.selList}>
                {selectedTexts(second.sectionId, sel, 2).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Link href="/neuroesencia/evaluar" className={styles.saveProgressBtn}>
          Guardar progreso para tu hijo →
        </Link>

        <button className={styles.editLink} onClick={handleEdit}>Editar mis respuestas</button>

        <p className={styles.footer}>
          Esta guía te ayuda a navegar el curso. Si algo interfiere con las actividades diarias de tu hijo, puedes comentarlo con su pediatra.
        </p>
      </div>
    </div>
  );
}
