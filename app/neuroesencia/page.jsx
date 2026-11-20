"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChildren } from "../../lib/tracker-api";
import styles from "./inicio.module.css";

const IconChild = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.2"/>
    <line x1="12" y1="7.2" x2="12" y2="14"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="12" y1="14" x2="9" y2="20"/>
    <line x1="12" y1="14" x2="15" y2="20"/>
  </svg>
);

const IconPlay = () => (
  <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7"/>
    <polygon points="8.5,7.5 8.5,12.5 13,10" fill="currentColor" stroke="none"/>
  </svg>
);

const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="3" height="5" rx="1"/>
    <rect x="8.5" y="8" width="3" height="9" rx="1"/>
    <rect x="14" y="4" width="3" height="13" rx="1"/>
  </svg>
);

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
            <span className={styles.cardIcon}><IconChild /></span>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>{childName || "Perfil de tu hijo"}</p>
              <p className={styles.cardSub}>
                {hasRoute ? "Ver recomendaciones de ejercicios" : "Completa el cuestionario de observaciones"}
              </p>
            </div>
            <span className={styles.cardArrow}>›</span>
          </Link>

          <Link href="/neuroesencia/biblioteca" className={styles.card}>
            <span className={styles.cardIcon}><IconPlay /></span>
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>El curso</p>
              <p className={styles.cardSub}>Videos y ejercicios por reflejo</p>
            </div>
            <span className={styles.cardArrow}>›</span>
          </Link>

          <Link href="/neuroesencia/progreso" className={styles.card}>
            <span className={styles.cardIcon}><IconChart /></span>
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
