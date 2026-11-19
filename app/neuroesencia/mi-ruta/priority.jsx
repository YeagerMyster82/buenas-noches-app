"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, STORAGE_KEY, saveStorage } from "../../../lib/ruta-neuroesencia";
import styles from "./ruta.module.css";

export default function PriorityPage() {
  const router = useRouter();
  const [selections, setSelections] = useState(new Set());
  const [skipped, setSkipped] = useState(new Set());
  const [chosen, setChosen] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const sel = new Set(saved.selections || []);
        setSelections(sel);
        setSkipped(new Set(saved.skipped || []));
        // If nothing selected, skip to results
        if (sel.size === 0) {
          router.replace("/neuroesencia/mi-ruta/results");
          return;
        }
      } else {
        router.replace("/neuroesencia/mi-ruta");
        return;
      }
    } catch {}
    setMounted(true);
  }, [router]);

  function handlePick(obsId) {
    setChosen(obsId);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      saveStorage({ ...saved, step: 9, priority: obsId });
    } catch {}
    router.push("/neuroesencia/mi-ruta/results");
  }

  function handleSkip() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      saveStorage({ ...saved, step: 9, priority: null });
    } catch {}
    router.push("/neuroesencia/mi-ruta/results");
  }

  function goBack() {
    router.push("/neuroesencia/mi-ruta/checklist");
  }

  if (!mounted) return null;

  // Group selected observations by section
  const groups = SECTIONS.map(sec => {
    const obs = sec.observations.filter(o => selections.has(o.id));
    return obs.length > 0 ? { section: sec, obs } : null;
  }).filter(Boolean);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.entryCard}>
          <h2 className={styles.priorityHeading}>
            De todo lo que marcaste, ¿qué te gustaría entender primero?
          </h2>

          {groups.map(({ section, obs }) => (
            <div key={section.id} className={styles.priorityGroup}>
              <p className={styles.priorityGroupLabel}>{section.heading}</p>
              {obs.map(o => {
                const isSelected = chosen === o.id;
                return (
                  <div
                    key={o.id}
                    className={styles.priorityRow}
                    onClick={() => handlePick(o.id)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handlePick(o.id); } }}
                  >
                    <span className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`}>
                      {isSelected && <span className={styles.radioDot} />}
                    </span>
                    <span className={styles.obsText}>{o.text}</span>
                  </div>
                );
              })}
            </div>
          ))}

          <div className={styles.navRow} style={{ marginTop: 28 }}>
            <button className={styles.btnBack} onClick={goBack}>
              ← Atrás
            </button>
            <button className={styles.btnSecondary} onClick={handleSkip}>
              Prefiero ver mi sugerencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
