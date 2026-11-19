"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase-client";
import styles from "./HelpModal.module.css";

export default function HelpModal({ email, onClose }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [phase, setPhase] = useState("form"); // form | sending | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setPhase("sending");

    try {
      const sb = getSupabaseBrowserClient();
      const { data, error } = await sb
        .from("help_messages")
        .insert({ parent_email: email, subject: subject.trim() || null, body: body.trim() })
        .select("id")
        .single();

      if (error) throw error;

      // Fire-and-forget notification (no VAPID needed — this is server email)
      fetch(
        "https://wcmpbgcrglduwguxytui.supabase.co/functions/v1/send-help-notification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parent_email: email, subject, body, message_id: data.id }),
        }
      ).catch(() => {}); // best-effort

      setPhase("done");
    } catch {
      setPhase("error");
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {phase === "done" ? (
          <div className={styles.doneState}>
            <span className={styles.doneIcon}>✉️</span>
            <h2 className={styles.doneTitle}>Mensaje enviado</h2>
            <p className={styles.doneBody}>Recibimos tu pregunta. Te responderemos pronto.</p>
            <button className={styles.btnPrimary} onClick={onClose}>Cerrar</button>
          </div>
        ) : phase === "error" ? (
          <div className={styles.doneState}>
            <span className={styles.doneIcon}>⚠️</span>
            <h2 className={styles.doneTitle}>Algo salió mal</h2>
            <p className={styles.doneBody}>Por favor intenta de nuevo o escríbenos por WhatsApp.</p>
            <button className={styles.btnPrimary} onClick={() => setPhase("form")}>Reintentar</button>
          </div>
        ) : (
          <>
            <h2 className={styles.heading}>¿En qué te podemos ayudar?</h2>
            <p className={styles.sub}>Escribe tu pregunta y te respondemos pronto.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Asunto (opcional)"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                maxLength={120}
              />
              <textarea
                className={styles.textarea}
                placeholder="Escribe tu mensaje aquí..."
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={5}
                required
                maxLength={2000}
              />
              <button
                className={styles.btnPrimary}
                type="submit"
                disabled={phase === "sending" || !body.trim()}
              >
                {phase === "sending" ? "Enviando…" : "Enviar mensaje"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
