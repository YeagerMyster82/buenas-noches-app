"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChildren } from "../../lib/tracker-api";
import styles from "./inicio.module.css";

export default function NeuroEsenciaInicio() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [hasRoute, setHasRoute] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("qk_email");
    if (!email) { router.replace("/login"); return; }

    try {
      const raw = localStorage.getItem("ne-ruta-v1");
      if (raw) {
        const saved = JSON.parse(raw);
        setHasRoute((saved.step || 0) >= 9);
      }
    } catch {}

    getChildren(email).then(setChildren).catch(() => {});
    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  const childName = children.length > 0
    ? children.map(c => c.child_name).join(", ")
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <h1 className={styles.heading}>NeuroEsencia</h1>
          <p className={styles.sub}>Reflejos primitivos: evalúa, entiende e integra.</p>
        </div>

        <div className={styles.cards}>
          <Link href="/neuroesencia/nino" className={styles.card}>
            <span className={styles.cardIcon}>👶</span>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>{childName || "Perfil de tu hijo"}</p>
              <p className={styles.cardSub}>
                {hasRoute ? "Ver recomendaciones de ejercicios" : "Completa el cuestionario de observaciones"}
              </p>
            </div>
            <span className={styles.cardArrow}>›</span>
          </Link>

          <Link href="/neuroesencia/biblioteca" className={styles.card}>
            <span className={styles.cardIcon}>▶</span>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>El curso</p>
              <p className={styles.cardSub}>Videos y ejercicios por reflejo</p>
            </div>
            <span className={styles.cardArrow}>›</span>
          </Link>

          <Link href="/neuroesencia/progreso" className={styles.card}>
            <span className={styles.cardIcon}>📊</span>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>Reporte de progreso</p>
              <p className={styles.cardSub}>
                {children.length > 0
                  ? "Ver el historial de evaluaciones"
                  : "Sin evaluaciones todavía"}
              </p>
            </div>
            <span className={styles.cardArrow}>›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
