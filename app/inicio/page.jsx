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

  // Tarea del día state
  const [editingReward, setEditingReward] = useState(false);
  const [rewardDraft, setRewardDraft] = useState("");

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
    getTodayCheckin(e).then((c) => {
      setCheckin(c);
      // If no reward set yet, open the editor automatically
      if (!c?.tarea_reward) setEditingReward(true);
    });
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

  async function saveReward() {
    const r = rewardDraft.trim();
    if (!r || !email) return;
    setSaving(true);
    try {
      const updated = await upsertCheckin(email, { tarea_reward: r });
      setCheckin(updated);
      setEditingReward(false);
      setRewardDraft("");
    } finally {
      setSaving(false);
    }
  }

  async function tapStar(idx) {
    // idx 0,1,2 → stars 1,2,3. Tapping an earned star removes it and all after it.
    if (!email) return;
    const current = checkin?.tarea_stars ?? 0;
    const next = idx + 1 <= current ? idx : idx + 1;
    setSaving(true);
    try {
      const updated = await upsertCheckin(email, { tarea_stars: next });
      setCheckin(updated);
    } finally {
      setSaving(false);
    }
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const reward = checkin?.tarea_reward ?? "";
  const stars = checkin?.tarea_stars ?? 0;

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.greeting}>{greeting} 👋</h1>
        <p className={styles.sub}>¿Cómo va el día de hoy?</p>

        {/* Tarea del día */}
        <section className={styles.card}>
          <p className={styles.cardTitle}>⭐ Tarea del día</p>

          {/* Reward setter */}
          {editingReward ? (
            <>
              <p className={styles.cardQ}>¿Cuál es el premio de hoy por completar las 3 sesiones?</p>
              <div className={styles.rewardForm}>
                <input
                  className={styles.rewardInput}
                  placeholder="Ej: 30 min de pantalla"
                  value={rewardDraft}
                  onChange={(e) => setRewardDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveReward()}
                  autoFocus
                  maxLength={60}
                />
                <button className={styles.saveBtn} onClick={saveReward} disabled={saving || !rewardDraft.trim()}>
                  Listo
                </button>
              </div>
            </>
          ) : (
            <div className={styles.rewardBanner}>
              <p className={styles.rewardText}>
                3 ⭐⭐⭐ = {reward || "…"}
              </p>
              <button className={styles.editBtn} onClick={() => { setRewardDraft(reward); setEditingReward(true); }} title="Cambiar premio">
                ✏️
              </button>
            </div>
          )}

          {/* Star buttons */}
          {!editingReward && (
            <div className={styles.starsAll}>
              <div className={styles.starsRow}>
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    className={`${styles.starBtn} ${i < stars ? styles.starBtnEarned : ""}`}
                    onClick={() => tapStar(i)}
                    disabled={saving}
                    title={i < stars ? "Quitar estrella" : "Marcar sesión completada"}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              {stars === 3 && (
                <p className={styles.starsComplete}>¡Lograron las 3 sesiones! 🎉 Premio ganado: {reward}</p>
              )}
              {stars > 0 && stars < 3 && (
                <p className={styles.cardQ}>{stars} de 3 sesiones completadas · toca una estrella para marcar</p>
              )}
              {stars === 0 && (
                <p className={styles.cardQ}>Toca una estrella después de cada sesión de ejercicios</p>
              )}
            </div>
          )}
        </section>

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
