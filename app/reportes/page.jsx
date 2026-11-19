"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "../app-shell/AppShell";
import { getCheckinHistory, getNEStreak, getNightlyLogs } from "../../lib/checkin-api";
import { getChildren } from "../../lib/tracker-api";
import styles from "./reportes.module.css";

const MOOD_EMOJI = { 1: "😢", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };
const MOOD_COLOR = {
  1: "#e63946", 2: "#f4a261", 3: "#f7c59f", 4: "#a8d5a2", 5: "#2d9e6b",
};

export default function ReportesPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [children, setChildren] = useState([]);
  const [activeTab, setActiveTab] = useState("ne");

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
    Promise.all([
      getNEStreak(e),
      getCheckinHistory(e, 30),
      getNightlyLogs(e, 30),
      getChildren(e),
    ]).then(([s, h, l, c]) => {
      setStreak(s);
      setHistory(h);
      setLogs(l);
      setChildren(c || []);
    });
  }, [router]);

  const avgSleepLatency =
    logs.length > 0
      ? Math.round(logs.reduce((a, l) => a + (l.sleep_latency_min || 0), 0) / logs.length)
      : null;

  const avgMood =
    history.filter(r => r.mood_score).length > 0
      ? (
          history.filter(r => r.mood_score).reduce((a, r) => a + r.mood_score, 0) /
          history.filter(r => r.mood_score).length
        ).toFixed(1)
      : null;

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.heading}>Reportes</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "ne" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("ne")}
          >
            🧠 NeuroEsencia
          </button>
          <button
            className={`${styles.tab} ${activeTab === "bn" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("bn")}
          >
            🌙 Buenas Noches
          </button>
        </div>

        {activeTab === "ne" && (
          <div className={styles.section}>
            <div className={styles.statRow}>
              <div className={styles.statCard}>
                <p className={styles.statNum}>{streak}</p>
                <p className={styles.statLabel}>días seguidos</p>
              </div>
              {avgMood && (
                <div className={styles.statCard}>
                  <p className={styles.statNum} style={{ color: MOOD_COLOR[Math.round(parseFloat(avgMood))] }}>
                    {MOOD_EMOJI[Math.round(parseFloat(avgMood))]}
                  </p>
                  <p className={styles.statLabel}>ánimo promedio</p>
                </div>
              )}
            </div>

            <p className={styles.sectionLabel}>Últimos 30 días</p>
            <div className={styles.dotGrid}>
              {Array.from({ length: 30 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (29 - i));
                const key = d.toISOString().split("T")[0];
                const rec = history.find(r => r.checkin_date === key);
                return (
                  <div
                    key={key}
                    className={styles.dot}
                    style={{ background: rec?.ne_exercises_done ? "#2d9e6b" : "#e0e0e0" }}
                    title={key}
                  />
                );
              })}
            </div>

            {children.length > 0 && (
              <>
                <p className={styles.sectionLabel}>Progreso de síntomas</p>
                {children.map(child => (
                  <Link key={child.id} href="/neuroesencia/progreso" className={styles.childRow}>
                    <span className={styles.childName}>{child.name}</span>
                    <span className={styles.childAge}>{child.age_years} años →</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "bn" && (
          <div className={styles.section}>
            <div className={styles.statRow}>
              {avgSleepLatency !== null && (
                <div className={styles.statCard}>
                  <p className={styles.statNum}>{avgSleepLatency}<span className={styles.statUnit}>min</span></p>
                  <p className={styles.statLabel}>tiempo prom. dormirse</p>
                </div>
              )}
              <div className={styles.statCard}>
                <p className={styles.statNum}>{logs.filter(l => l.night_wakings === 0).length}</p>
                <p className={styles.statLabel}>noches sin despertares</p>
              </div>
            </div>

            <p className={styles.sectionLabel}>Últimas noches</p>
            {logs.length === 0 && (
              <p className={styles.empty}>Aún no hay registros de noches. Usa la app de Buenas Noches para registrar.</p>
            )}
            {logs.slice(0, 14).map(log => (
              <div key={log.id} className={styles.logRow}>
                <span className={styles.logDate}>{log.log_date}</span>
                <span className={styles.logStat}>{log.sleep_latency_min ?? "–"} min</span>
                <span className={styles.logStat}>{log.night_wakings ?? "–"} desp.</span>
                {log.mood_score && (
                  <span style={{ color: MOOD_COLOR[log.mood_score] }}>
                    {MOOD_EMOJI[log.mood_score]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
