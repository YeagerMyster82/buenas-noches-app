"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../../lib/supabase-client";
import styles from "./mensajes.module.css";

const ADMIN_EMAIL = "joline.yeager@yahoo.com";

export default function AdminMensajesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("qk_email");
    if (email !== ADMIN_EMAIL) { router.replace("/login"); return; }
    loadMessages();
  }, [router]);

  async function loadMessages() {
    setLoading(true);
    const sb = getSupabaseBrowserClient();
    const { data } = await sb
      .from("help_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markRead(msg) {
    if (msg.status !== "pending") return;
    const sb = getSupabaseBrowserClient();
    await sb.from("help_messages").update({ status: "read" }).eq("id", msg.id);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "read" } : m));
  }

  async function sendReply(msg) {
    if (!replyText.trim()) return;
    setSaving(true);
    const sb = getSupabaseBrowserClient();
    await sb.from("help_messages").update({
      status: "replied",
      reply_text: replyText.trim(),
      replied_at: new Date().toISOString(),
    }).eq("id", msg.id);
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, status: "replied", reply_text: replyText.trim() } : m
    ));
    setReplyText("");
    setSaving(false);
    setSelected(null);
  }

  function openMessage(msg) {
    setSelected(msg);
    setReplyText(msg.reply_text || "");
    markRead(msg);
  }

  const pending = messages.filter(m => m.status === "pending").length;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Mensajes de usuarios</h1>
          {pending > 0 && <span className={styles.badge}>{pending} nuevos</span>}
          <button className={styles.refreshBtn} onClick={loadMessages}>↺</button>
        </div>

        {loading && <p className={styles.loading}>Cargando…</p>}

        {!loading && messages.length === 0 && (
          <div className={styles.empty}>
            <span>📭</span>
            <p>No hay mensajes todavía.</p>
          </div>
        )}

        <div className={styles.list}>
          {messages.map(msg => (
            <button
              key={msg.id}
              className={`${styles.msgRow} ${msg.status === "pending" ? styles.unread : ""} ${selected?.id === msg.id ? styles.selectedRow : ""}`}
              onClick={() => openMessage(msg)}
            >
              <div className={styles.msgMeta}>
                <span className={styles.msgEmail}>{msg.parent_email}</span>
                <span className={styles.msgDate}>{new Date(msg.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              {msg.subject && <div className={styles.msgSubject}>{msg.subject}</div>}
              <div className={styles.msgPreview}>{msg.body.slice(0, 100)}{msg.body.length > 100 ? "…" : ""}</div>
              <span className={`${styles.statusPill} ${styles["status_" + msg.status]}`}>
                {msg.status === "pending" ? "Nuevo" : msg.status === "read" ? "Leído" : "Respondido"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className={styles.backdrop} onClick={() => setSelected(null)}>
          <div className={styles.detail} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            <p className={styles.detailEmail}>{selected.parent_email}</p>
            {selected.subject && <p className={styles.detailSubject}>{selected.subject}</p>}
            <p className={styles.detailDate}>{new Date(selected.created_at).toLocaleString("es-MX")}</p>
            <div className={styles.detailBody}>{selected.body}</div>
            {selected.reply_text && (
              <div className={styles.existingReply}>
                <span className={styles.replyLabel}>Tu respuesta:</span>
                <p>{selected.reply_text}</p>
              </div>
            )}
            <div className={styles.replySection}>
              <textarea
                className={styles.replyInput}
                placeholder="Escribir respuesta (solo se guarda en el sistema — envía el email por separado)…"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={4}
              />
              <button
                className={styles.btnPrimary}
                onClick={() => sendReply(selected)}
                disabled={saving || !replyText.trim()}
              >
                {saving ? "Guardando…" : "Marcar como respondido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
