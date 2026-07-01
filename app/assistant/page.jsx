"use client";

import { useEffect, useState } from "react";

// Assistant panel — limited access: messages + subscription lookup only
// Uses a separate BUENAS_NOCHES_ASSISTANT_CODE env var

export default function AssistantPage() {
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [actionStatus, setActionStatus] = useState({});
  const [subEmail, setSubEmail] = useState("");
  const [subData, setSubData] = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [tab, setTab] = useState("messages");
  const [savedCode, setSavedCode] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("bn_assistant_code");
    if (stored) { setCode(stored); setSavedCode(stored); }
  }, []);

  async function login(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/assistant-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantCode: code }),
    });
    const payload = await res.json();
    if (!res.ok) { setError(payload.error || "Código incorrecto"); return; }
    localStorage.setItem("bn_assistant_code", code);
    setSavedCode(code);
    setMessages(payload.messages || []);
    setAuthed(true);
  }

  async function refresh() {
    const res = await fetch("/api/assistant-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantCode: savedCode }),
    });
    const payload = await res.json();
    if (res.ok) setMessages(payload.messages || []);
  }

  async function sendReply(messageId, recipientEmail) {
    const reply = String(replyDrafts[messageId] || "").trim();
    if (!reply) return;
    setActionStatus((s) => ({ ...s, [messageId]: "sending" }));
    const res = await fetch("/api/assistant-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantCode: savedCode, type: "reply_message", messageId, message: reply, email: recipientEmail }),
    });
    if (res.ok) {
      setReplyDrafts((d) => ({ ...d, [messageId]: "" }));
      setActionStatus((s) => ({ ...s, [messageId]: "sent" }));
      await refresh();
      setTimeout(() => setActionStatus((s) => ({ ...s, [messageId]: "" })), 3000);
    } else {
      setActionStatus((s) => ({ ...s, [messageId]: "error" }));
    }
  }

  async function lookupSub(e) {
    e.preventDefault();
    setSubLoading(true);
    setSubData(null);
    try {
      const res = await fetch(`/api/subscription-lookup?email=${encodeURIComponent(subEmail)}&assistantCode=${encodeURIComponent(savedCode)}`);
      const payload = await res.json();
      setSubData(payload);
    } catch { setSubData({ error: "Error de red" }); }
    setSubLoading(false);
  }

  if (!authed) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
          <h1 style={styles.h1}>Panel de Asistente</h1>
          <p style={{ color: "#9ab", marginBottom: 24, fontSize: 14 }}>Buenas Noches · QuiroKids</p>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="password" placeholder="Código de asistente" value={code} onChange={(e) => setCode(e.target.value)} style={styles.input} autoFocus required />
            {error && <p style={{ color: "#e87", fontSize: 13 }}>{error}</p>}
            <button type="submit" style={styles.btn}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  const pending = messages.filter((m) => m.status !== "answered").length;

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ fontSize: 24 }}>💬</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f4e7b2", marginTop: 4 }}>Asistente</div>
          <div style={{ fontSize: 11, color: "#9ab" }}>Buenas Noches</div>
        </div>
        {[
          { id: "messages", label: "Mensajes", badge: pending },
          { id: "subscriptions", label: "Suscripciones" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ ...styles.sidebarItem, ...(tab === t.id ? styles.sidebarItemActive : {}) }}>
            {t.label}
            {t.badge > 0 && <span style={styles.badge}>{t.badge}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={refresh} style={{ ...styles.sidebarItem, marginBottom: 8 }}>↻ Actualizar</button>
        <button onClick={() => { localStorage.removeItem("bn_assistant_code"); setAuthed(false); setCode(""); }} style={{ ...styles.sidebarItem, color: "#e87", marginBottom: 16 }}>Salir</button>
      </aside>

      <main style={styles.main}>
        {tab === "messages" && (
          <div style={styles.content}>
            <h2 style={styles.h2}>Mensajes <span style={{ fontSize: 14, color: "#9ab", fontWeight: 400 }}>{pending} sin responder</span></h2>
            {messages.length === 0 && <p style={{ color: "#9ab" }}>No hay mensajes.</p>}
            {messages.map((msg) => (
              <div key={msg.id} style={styles.messageCard}>
                <div style={styles.messageHeader}>
                  <div>
                    <strong style={{ color: "#f4e7b2" }}>{msg.parent_name || msg.parent_email}</strong>
                    <span style={{ color: "#9ab", fontSize: 12, marginLeft: 8 }}>{msg.parent_email}</span>
                    {msg.child_name && <span style={{ color: "#9ecfd2", fontSize: 12, marginLeft: 8 }}>· {msg.child_name}</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "#9ab" }}>{msg.created_at?.slice(0, 10)}</span>
                </div>
                <p style={{ margin: "8px 0", lineHeight: 1.6 }}>{msg.message}</p>
                {(msg.replies || []).map((r) => (
                  <div key={r.id} style={{ ...styles.replyBubble, alignSelf: r.sender === "admin" ? "flex-end" : "flex-start", background: r.sender === "admin" ? "#1a3a4a" : "#2a2a3a" }}>
                    <strong style={{ fontSize: 11, color: r.sender === "admin" ? "#9ecfd2" : "#f4e7b2" }}>{r.sender === "admin" ? "Equipo" : "Usuario"}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 14 }}>{r.message}</p>
                    <small style={{ color: "#9ab", fontSize: 11 }}>{r.created_at?.slice(0, 10)}</small>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <textarea
                    value={replyDrafts[msg.id] || ""}
                    onChange={(e) => setReplyDrafts((d) => ({ ...d, [msg.id]: e.target.value }))}
                    placeholder="Escribe tu respuesta..."
                    style={{ ...styles.input, flex: 1, minHeight: 60, resize: "vertical" }}
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) sendReply(msg.id, msg.parent_email); }}
                  />
                  <button onClick={() => sendReply(msg.id, msg.parent_email)} style={{ ...styles.btn, alignSelf: "flex-end", minWidth: 80 }}>
                    {actionStatus[msg.id] === "sending" ? "..." : actionStatus[msg.id] === "sent" ? "✓" : "Enviar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "subscriptions" && (
          <div style={styles.content}>
            <h2 style={styles.h2}>Buscar suscripción</h2>
            <form onSubmit={lookupSub} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <input type="email" value={subEmail} onChange={(e) => setSubEmail(e.target.value)} placeholder="email@ejemplo.com" style={{ ...styles.input, flex: 1 }} required />
              <button type="submit" style={styles.btn}>{subLoading ? "..." : "Buscar"}</button>
            </form>
            {subData && !subData.error && (
              <div style={styles.messageCard}>
                <p><strong>Email:</strong> {subData.email}</p>
                <p><strong>Plan:</strong> {subData.plan_type || "—"}</p>
                <p><strong>Estado:</strong> <span style={{ color: subData.is_active ? "#8fbe9e" : "#e87" }}>{subData.subscription_status || "—"}</span></p>
                <p><strong>Vence:</strong> {subData.expires_at?.slice(0, 10) || "—"}</p>
                <p><strong>Acceso legacy:</strong> {subData.legacy_access ? "sí (lifetime)" : "no"}</p>
              </div>
            )}
            {subData?.error && <p style={{ color: "#e87" }}>{subData.error}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#16222e" },
  loginCard: { background: "#1f3044", borderRadius: 20, padding: 36, width: 320, textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,.4)" },
  h1: { fontFamily: "Baloo 2, sans-serif", fontSize: 24, color: "#f4e7b2", margin: "0 0 4px" },
  h2: { fontFamily: "Baloo 2, sans-serif", fontSize: 22, color: "#f4e7b2", margin: "0 0 20px" },
  input: { background: "#16222e", border: "1px solid #2a3a4a", borderRadius: 10, padding: "10px 14px", color: "#fff8ef", fontSize: 14, width: "100%", boxSizing: "border-box" },
  btn: { background: "#f4e7b2", color: "#16222e", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  shell: { display: "flex", minHeight: "100vh", background: "#16222e", color: "#fff8ef" },
  sidebar: { width: 200, background: "#1f3044", display: "flex", flexDirection: "column", borderRight: "1px solid #2a3a4a", flexShrink: 0 },
  sidebarItem: { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "none", border: "none", color: "#fff8ef", cursor: "pointer", fontSize: 14, textAlign: "left", width: "100%" },
  sidebarItemActive: { background: "#28394e", color: "#f4e7b2", fontWeight: 700 },
  badge: { marginLeft: "auto", background: "#d9968c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 10 },
  main: { flex: 1, overflowY: "auto" },
  content: { padding: 32, maxWidth: 860 },
  messageCard: { background: "#1f3044", border: "1px solid #2a3a4a", borderRadius: 14, padding: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 4 },
  messageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 },
  replyBubble: { borderRadius: 12, padding: "10px 14px", maxWidth: "75%", display: "flex", flexDirection: "column" },
};
