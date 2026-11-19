"use client";

import { useEffect, useState } from "react";
import {
  requestPushPermission,
  subscribeToPush,
  getMySubscription,
  saveSubscription,
  updateSubscriptionPrefs,
} from "../../lib/push-subscribe";
import styles from "./NotificationSettings.module.css";

// Mexico City offset (UTC-6 CST / UTC-5 CDT)
// We store hours in local Mexico City time; the Edge Function adjusts for UTC.
// For simplicity, we just store local time and let the backend handle offset.

function pad(n) {
  return String(n).padStart(2, "0");
}

function timeToHourMin(value) {
  const [h, m] = value.split(":").map(Number);
  return { hour: h, minute: m };
}

export default function NotificationSettings({ email, product }) {
  // product: "neuroesencia" | "buenas_noches"
  const [phase, setPhase] = useState("loading"); // loading | unsupported | denied | off | on | saving | error
  const [subRecord, setSubRecord] = useState(null);
  const [neTime, setNeTime] = useState("09:00");
  const [bnTime, setBnTime] = useState("20:00");
  const [errorMsg, setErrorMsg] = useState("");

  const isNE = product === "neuroesencia";
  const isBN = product === "buenas_noches";

  useEffect(() => {
    if (!email) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPhase("unsupported"); return;
    }
    if (Notification.permission === "denied") {
      setPhase("denied"); return;
    }
    getMySubscription(email).then(rec => {
      setSubRecord(rec);
      if (rec) {
        if (isNE) setNeTime(`${pad(rec.ne_hour)}:${pad(rec.ne_minute)}`);
        if (isBN) setBnTime(`${pad(rec.bn_routine_hour)}:${pad(rec.bn_routine_minute)}`);
        const enabled = isNE ? rec.ne_enabled : rec.bn_enabled;
        setPhase(enabled ? "on" : "off");
      } else {
        setPhase("off");
      }
    }).catch(() => setPhase("off"));
  }, [email, product]);

  async function handleEnable() {
    setPhase("saving");
    setErrorMsg("");
    try {
      const perm = await requestPushPermission();
      if (perm === "denied") { setPhase("denied"); return; }
      if (perm !== "granted") { setPhase("off"); return; }

      const pushSub = await subscribeToPush();
      const { hour: neH, minute: neM } = timeToHourMin(neTime);
      const { hour: bnH, minute: bnM } = timeToHourMin(bnTime);

      const overrides = {
        ne_enabled: isNE ? true : (subRecord?.ne_enabled ?? false),
        bn_enabled: isBN ? true : (subRecord?.bn_enabled ?? false),
        ne_hour: neH,
        ne_minute: neM,
        bn_routine_hour: bnH,
        bn_routine_minute: bnM,
      };
      await saveSubscription(email, pushSub, overrides);
      setPhase("on");
    } catch (e) {
      setErrorMsg("No se pudo activar. Intenta de nuevo.");
      setPhase("error");
    }
  }

  async function handleDisable() {
    setPhase("saving");
    try {
      await updateSubscriptionPrefs(email, {
        [isNE ? "ne_enabled" : "bn_enabled"]: false,
      });
      setPhase("off");
    } catch {
      setPhase("on");
    }
  }

  async function handleTimeChange(value) {
    if (isNE) setNeTime(value); else setBnTime(value);
    if (phase !== "on") return;
    const { hour, minute } = timeToHourMin(value);
    try {
      await updateSubscriptionPrefs(email, isNE
        ? { ne_hour: hour, ne_minute: minute }
        : { bn_routine_hour: hour, bn_routine_minute: minute }
      );
    } catch { /* non-critical */ }
  }

  if (phase === "loading") return null;

  if (phase === "unsupported") {
    return (
      <div className={styles.row}>
        <span className={styles.icon}>{isNE ? "🧠" : "🌙"}</span>
        <div>
          <p className={styles.title}>Recordatorios no disponibles</p>
          <p className={styles.sub}>Tu navegador no soporta notificaciones push.</p>
        </div>
      </div>
    );
  }

  if (phase === "denied") {
    return (
      <div className={styles.row}>
        <span className={styles.icon}>{isNE ? "🧠" : "🌙"}</span>
        <div>
          <p className={styles.title}>Notificaciones bloqueadas</p>
          <p className={styles.sub}>Actívalas en la configuración de tu navegador y recarga la página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.icon}>{isNE ? "🧠" : "🌙"}</span>
        <div className={styles.cardHeaderText}>
          <p className={styles.title}>
            {isNE ? "Recordatorio de ejercicios" : "Recordatorio de rutina nocturna"}
          </p>
          <p className={styles.sub}>
            {isNE
              ? "Te avisamos cada día para que no olvides los ejercicios de NeuroEsencia."
              : "Te avisamos 10 min antes de la rutina o si aún no la has configurado."}
          </p>
        </div>
        <button
          className={`${styles.toggle} ${phase === "on" ? styles.toggleOn : ""}`}
          onClick={phase === "on" ? handleDisable : handleEnable}
          disabled={phase === "saving"}
          aria-label="activar/desactivar"
        >
          {phase === "saving" ? "…" : phase === "on" ? "On" : "Off"}
        </button>
      </div>

      {phase === "on" && (
        <div className={styles.timeRow}>
          <label className={styles.timeLabel}>
            {isNE ? "Hora del recordatorio" : "Hora de la rutina"}
          </label>
          <input
            type="time"
            className={styles.timeInput}
            value={isNE ? neTime : bnTime}
            onChange={e => handleTimeChange(e.target.value)}
          />
        </div>
      )}

      {phase === "error" && <p className={styles.error}>{errorMsg}</p>}
    </div>
  );
}
