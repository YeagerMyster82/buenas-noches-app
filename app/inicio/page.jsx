"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../app-shell/AppShell";
import { getTodayCheckin, upsertCheckin } from "../../lib/checkin-api";
import styles from "./inicio.module.css";

const MOODS = [
  { v: 1, emoji: "😢", color: "#e63946" },
  { v: 2, emoji: "😕", color: "#f4a261" },
  { v: 3, emoji: "😐", color: "#f7c59f" },
  { v: 4, emoji: "🙂", color: "#a8d5a2" },
  { v: 5, emoji: "😄", color: "#2d9e6b" },
];

export default function InicioPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [checkin, setCheckin] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
    getTodayCheckin(e).then(setCheckin);
  }, [router]);

  async function toggle(field, value) {
    if (!email) return;
    setSaving(true);
    try {
      const updated = await upsertCheckin(email, { [field]: value });
      setCheckin(updated);
    } finally {
      setSaving(false);
    }
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.greeting}>{greeting} 👋</h1>
        <p className={styles.sub}>¿Cómo va el día de hoy?</p>

        <section className={styles.card}>
          <p className={styles.cardTitle}>🌙 Rutina de sueño</p>
          <p className={styles.cardQ}>¿Completaron la rutina de Buenas Noches anoche?</p>
          <div className={styles.yesNo}>
            <button
              className={`${styles.ynBtn} ${checkin?.bn_routine_done === true ? styles.yes : ""}`}
              onClick={() => toggle("bn_routine_done", true)}
              disabled={saving}
            >
              Sí ✅
            </button>
            <button
              className={`${styles.ynBtn} ${checkin?.bn_routine_done === false ? styles.no : ""}`}
              onClick={() => toggle("bn_routine_done", false)}

              disabled={saving}
            >
              No ❌
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.cardTitle}>🧠 NeuroEsencia</p>
          <p className={styles.cardQ}>¿Hicieron ejercicios hoy (≥15 min)?</p>
          <div className={styles.yesNo}>
            <button
              className={`${styles.ynBtn} ${checkin?.ne_exercises_done === true ? styles.yes : ""}`}
              onClick={() => toggle("ne_exercises_done", true)}
              disabled={saving}
            >
              Sí ✅
            </button>
            <button
              className={`${styles.ynBtn} ${checkin?.ne_exercises_done === false ? styles.no : ""}`}
              onClick={() => toggle("ne_exercises_done", false)}
              disabled={saving}
            >
              No ❌
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.cardTitle}>😊 Estado de ánimo</p>
          <p className={styles.cardQ}>¿Cómo estuvo el ánimo de tu hijo hoy?</p>
          <div className={styles.moodRow}>
            {MOODS.map(({ v, emoji, color }) => (
              <button
                key={v}
                className={`${styles.moodBtn} ${checkin?.mood_score === v ? styles.moodActive : ""}`}
                style={checkin?.mood_score === v ? { borderColor: color, background: color + "22" } : {}}
                onClick={() => toggle("mood_score", v)}
                disabled={saving}
              >
                {emoji}
              </button>
            ))}
          </div>
        </section>

        {saving && <p className={styles.saving}>Guardando…</p>}
      </div>
    </AppShell>
  );
}
