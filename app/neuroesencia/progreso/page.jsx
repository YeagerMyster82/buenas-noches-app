"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getChildren, getRatingsForChild, FREQ_LABELS, IMPACT_LABELS, FREQ_COLOR } from "../../../lib/tracker-api";
import { SECTIONS } from "../../../lib/ruta-neuroesencia";
import styles from "./progreso.module.css";

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

function daysAgo(isoString) {
  const ms = Date.now() - new Date(isoString).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function groupBySession(ratings) {
  // Group by day (rated_at date string)
  const sessions = {};
  for (const r of ratings) {
    const day = r.rated_at.slice(0, 10);
    if (!sessions[day]) sessions[day] = [];
    sessions[day].push(r);
  }
  return Object.entries(sessions)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, rows]) => ({ date, rows }));
}

function getSectionLabel(sectionId) {
  return SECTIONS.find(s => s.id === sectionId)?.heading || sectionId;
}

export default function ProgresoPage() {
  const router = useRouter();
  const [phase, setPhase] = useState("loading");
  const [email, setEmail] = useState(null);
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [needsCheckIn, setNeedsCheckIn] = useState(false);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
    getChildren(e).then(list => {
      setChildren(list);
      if (list.length === 0) { setPhase("no-children"); return; }
      selectChild(list[0]);
    }).catch(() => setPhase("error"));
  }, [router]);

  async function selectChild(child) {
    setActiveChild(child);
    setPhase("loading-ratings");
    try {
      const r = await getRatingsForChild(child.id);
      setRatings(r);
      if (r.length > 0) {
        const latest = r[r.length - 1].rated_at;
        setNeedsCheckIn(Date.now() - new Date(latest).getTime() > TWO_WEEKS_MS);
      } else {
        setNeedsCheckIn(false);
      }
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }

  if (phase === "loading" || phase === "loading-ratings") {
    return (
      <div className={styles.page}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (phase === "no-children") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Aún no hay perfiles</p>
            <p className={styles.cardSub}>Completa una evaluación para crear el primer perfil de tu hijo.</p>
            <Link href="/neuroesencia/mi-ruta" className={styles.btnPrimary}>
              Empezar evaluación →
            </Link>
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
            <p className={styles.cardSub}>No pudimos cargar los datos. Intenta de nuevo.</p>
            <button className={styles.btnPrimary} onClick={() => router.refresh()}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  const sessions = groupBySession(ratings);
  const hasRatings = ratings.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Progreso de tu hijo</h1>

        {/* Child picker */}
        {children.length > 1 && (
          <div className={styles.childTabs}>
            {children.map(c => (
              <button
                key={c.id}
                className={`${styles.childTab} ${c.id === activeChild?.id ? styles.childTabActive : ""}`}
                onClick={() => selectChild(c)}
              >
                {c.child_name}
              </button>
            ))}
          </div>
        )}

        {/* Two-week check-in banner */}
        {needsCheckIn && (
          <div className={styles.banner}>
            <span className={styles.bannerIcon}>⏰</span>
            <div>
              <p className={styles.bannerTitle}>Ya pasaron dos semanas</p>
              <p className={styles.bannerSub}>Es hora de hacer un nuevo seguimiento de {activeChild?.child_name}.</p>
            </div>
            <Link href="/neuroesencia/evaluar" className={styles.bannerBtn}>Evaluar →</Link>
          </div>
        )}

        {/* First check-in prompt */}
        {!hasRatings && (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Sin datos todavía</p>
            <p className={styles.cardSub}>
              Haz la primera evaluación para {activeChild?.child_name} y empieza a ver el progreso aquí.
            </p>
            <Link href="/neuroesencia/evaluar" className={styles.btnPrimary}>
              Primera evaluación →
            </Link>
          </div>
        )}

        {/* Timeline of sessions */}
        {sessions.map(({ date, rows }) => {
          const label = (() => {
            const d = daysAgo(date + "T12:00:00");
            if (d === 0) return "Hoy";
            if (d === 1) return "Ayer";
            return new Date(date + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long" });
          })();

          return (
            <div key={date} className={styles.session}>
              <p className={styles.sessionDate}>{label}</p>
              <div className={styles.sessionCard}>
                {rows.map(r => (
                  <div key={r.id} className={styles.ratingRow}>
                    <div className={styles.ratingLeft}>
                      <p className={styles.ratingSection}>{getSectionLabel(r.section_id)}</p>
                    </div>
                    <div className={styles.pills}>
                      <span
                        className={styles.pill}
                        style={{ background: FREQ_COLOR[r.frequency] + "33", color: FREQ_COLOR[r.frequency] }}
                      >
                        {FREQ_LABELS[r.frequency]}
                      </span>
                      <span
                        className={styles.pill}
                        style={{ background: FREQ_COLOR[r.life_impact] + "33", color: FREQ_COLOR[r.life_impact] }}
                      >
                        {IMPACT_LABELS[r.life_impact]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* New evaluation CTA at bottom when there are ratings */}
        {hasRatings && !needsCheckIn && (
          <div className={styles.newEvalRow}>
            <Link href="/neuroesencia/evaluar" className={styles.btnOutline}>
              + Nueva evaluación
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
