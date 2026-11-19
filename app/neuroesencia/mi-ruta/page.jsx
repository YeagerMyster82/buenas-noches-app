"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEY, clearStorage } from "../../../lib/ruta-neuroesencia";
import styles from "./ruta.module.css";

export default function MiRutaPage() {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);

  function handleStart() {
    router.push("/neuroesencia/mi-ruta/checklist");
  }

  function handleViewResult() {
    router.push("/neuroesencia/mi-ruta/results");
  }

  function handleStartFresh() {
    clearStorage();
    setState(null);
  }

  if (!mounted) return null;

  const hasResult = state && state.step >= 9;
  const hasProgress = state && state.step >= 1 && state.step <= 8;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.entryCard}>
          <h1 className={styles.title}>Mi ruta NeuroEsencia</h1>
          <p className={styles.intro}>
            Cuéntanos qué observas en el día a día de tu hijo. Te sugeriremos por dónde empezar en el curso.
          </p>

          {hasResult ? (
            <>
              <button className={styles.btnPrimary} onClick={handleViewResult}>
                Ver mi ruta
              </button>
              <button className={styles.startFresh} onClick={handleStartFresh}>
                Empezar de nuevo
              </button>
            </>
          ) : hasProgress ? (
            <>
              <button className={styles.btnPrimary} onClick={handleStart}>
                Continuar mi ruta
              </button>
              <button className={styles.startFresh} onClick={handleStartFresh}>
                Empezar de nuevo
              </button>
            </>
          ) : (
            <button className={styles.btnPrimary} onClick={handleStart}>
              Empezar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
