"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getChildren, getRatingsForChild } from "../../../lib/tracker-api";
import { SECTIONS } from "../../../lib/ruta-neuroesencia";
import styles from "./nino.module.css";

export default function NinoPage() {
  const router = useRouter();
  const [phase, setPhase] = useState("loading");
  const [email, setEmail] = useState(null);
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [hasRoute, setHasRoute] = useState(false);
  const [routeStep, setRouteStep] = useState(0);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);

    try {
      const raw = localStorage.getItem("ne-ruta-v1");
      if (raw) {
        const saved = JSON.parse(raw);
        const step = saved.step || 0;
        setRouteStep(step);
        setHasRoute(step >= 9);
      }
    } catch {}

    getChildren(e)
      .then(list => {
        setChildren(list);
        if (list.length > 0) {
          loadRatings(list[0]);
        } else {
          setPhase("ready");
        }
      })
      .catch(() => setPhase("ready"));
  }, [router]);

  async function loadRatings(child) {
    setActiveChild(child);
    try {
      const r = await getRatingsForChild(child.id);
      setRatings(r);
    } catch {}
    setPhase("ready");
  }

  if (phase === "loading") {
    return <div className={styles.page}><div className={styles.spinner} /></div>;
  }

  // Get latest rating per section
  const latestBySection = {};
  for (const r of ratings) {
    if (!latestBySection[r.section_id] || r.rated_at > latestBySection[r.section_id].rated_at) {
      latestBySection[r.section_id] = r;
    }
  }

  // Sort by severity: high frequency + high impact = most active reflex
  const activeSections = Object.values(latestBySection)
    .sort((a, b) => (b.frequency + b.life_impact) - (a.frequency + a.life_impact));

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Perfil de tu hijo</h1>

        {/* Questionnaire banner */}
        <div className={styles.questionCard}>
          <div className={styles.qLeft}>
            <p className={styles.qTitle}>
              {hasRoute
                ? "Cuestionario completado ✓"
                : routeStep > 0
                ? "Cuestionario en progreso"
                : "Cuestionario de observaciones"}
            </p>
            <p className={styles.qSub}>
              {hasRoute
                ? "Actualízalo cuando observes cambios en tu hijo."
                : "Dinos qué observas en el día a día de tu hijo para recomendarte por dónde empezar."}
            </p>
          </div>
          <Link
            href={hasRoute ? "/neuroesencia/mi-ruta" : "/neuroesencia/mi-ruta/checklist"}
            className={styles.qBtn}
          >
            {hasRoute ? "Actualizar" : routeStep > 0 ? "Continuar" : "Empezar"}
          </Link>
        </div>

        {children.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.emptyTitle}>Aún no hay perfiles</p>
            <p className={styles.emptySub}>
              {hasRoute
                ? "Crea el perfil de tu hijo y registra su primera evaluación."
                : "Completa el cuestionario primero para saber qué reflexos evaluar."}
            </p>
            {hasRoute && (
              <Link href="/neuroesencia/evaluar" className={styles.btnPrimary}>
                Crear perfil y evaluar →
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Child picker */}
            {children.length > 1 && (
              <div className={styles.childTabs}>
                {children.map(c => (
                  <button
                    key={c.id}
                    className={`${styles.childTab} ${c.id === activeChild?.id ? styles.childTabActive : ""}`}
                    onClick={() => loadRatings(c)}
                  >
                    {c.child_name}
                  </button>
                ))}
              </div>
            )}

            {activeChild && (
              <div className={styles.childHeader}>
                <div className={styles.childAvatar}>
                  {activeChild.child_name[0].toUpperCase()}
                </div>
                <div>
                  <p className={styles.childName}>{activeChild.child_name}</p>
                  {activeChild.age_years && (
                    <p className={styles.childAge}>{activeChild.age_years} años</p>
                  )}
                </div>
              </div>
            )}

            {activeSections.length === 0 ? (
              <div className={styles.emptyCard}>
                <p className={styles.emptyTitle}>Sin evaluaciones todavía</p>
                <p className={styles.emptySub}>
                  Registra las primeras observaciones para {activeChild?.child_name}.
                </p>
                <Link href="/neuroesencia/evaluar" className={styles.btnPrimary}>
                  Primera evaluación →
                </Link>
              </div>
            ) : (
              <div className={styles.section}>
                <p className={styles.sectionLabel}>ACTIVIDADES RECOMENDADAS</p>
                <div className={styles.refList}>
                  {activeSections.map(r => {
                    const sec = SECTIONS.find(s => s.id === r.section_id);
                    if (!sec) return null;
                    const severity = r.frequency + r.life_impact;
                    const isImproving = severity <= 4;
                    return (
                      <div key={r.section_id} className={styles.refCard}>
                        <div className={styles.refInfo}>
                          <p className={styles.refModule}>{sec.moduleLabel}</p>
                          <p className={styles.refHeading}>{sec.heading}</p>
                          <span className={`${styles.badge} ${isImproving ? styles.badgeGreen : styles.badgeAmber}`}>
                            {isImproving
                              ? "Mejorando — intenta ejercicios más difíciles"
                              : "Activo — sigue con los ejercicios básicos"}
                          </span>
                        </div>
                        <Link
                          href={`/neuroesencia/${sec.firstLessonSlug}`}
                          className={styles.refBtn}
                        >
                          Ver →
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <Link href="/neuroesencia/evaluar" className={styles.btnOutline}>
                  + Nueva evaluación
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
