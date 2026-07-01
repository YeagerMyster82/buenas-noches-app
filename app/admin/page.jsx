"use client";

import { useEffect, useState } from "react";

// Role is determined by which code the user enters:
//   BUENAS_NOCHES_ADMIN_CODE → role "admin"   (all tabs)
//   BUENAS_NOCHES_ASSISTANT_CODE → role "assistant" (messages + subscriptions lookup only)

const ADMIN_TABS = [
  { id: "messages",      label: "Mensajes" },
  { id: "ingresos",      label: "Ingresos" },
  { id: "subscriptions", label: "Suscripciones" },
  { id: "users",         label: "Usuarios" },
  { id: "kpis",          label: "Dashboard" },
];

const ASSISTANT_TABS = [
  { id: "messages",      label: "Mensajes" },
  { id: "subscriptions", label: "Suscripciones" },
  { id: "users",         label: "Usuarios" },
];

const MONTHLY_PRICE = 9.99;
const ANNUAL_PRICE  = 66;

export default function AdminPage() {
  const [code, setCode]             = useState("");
  const [authed, setAuthed]         = useState(false);
  const [role, setRole]             = useState(null); // "admin" | "assistant"
  const [error, setError]           = useState("");
  const [data, setData]             = useState(null);
  const [tab, setTab]               = useState("messages");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [subEmail, setSubEmail]     = useState("");
  const [subData, setSubData]       = useState(null);
  const [subLoading, setSubLoading] = useState(false);
  const [actionStatus, setActionStatus] = useState({});
  const [savedCode, setSavedCode]   = useState("");
  const [savedRole, setSavedRole]   = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("bn_admin_code");
    const storedRole  = localStorage.getItem("bn_panel_role");
    if (storedAdmin && storedRole) {
      setCode(storedAdmin);
      setSavedCode(storedAdmin);
      setSavedRole(storedRole);
    }
  }, []);

  async function login(e) {
    e.preventDefault();
    setError("");
    // Try admin first, then assistant
    const adminRes = await fetch("/api/admin-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminCode: code }),
    });

    if (adminRes.ok) {
      const payload = await adminRes.json();
      localStorage.setItem("bn_admin_code", code);
      localStorage.setItem("bn_panel_role", "admin");
      setSavedCode(code);
      setSavedRole("admin");
      setRole("admin");
      setData(payload);
      setAuthed(true);
      return;
    }

    const assistantRes = await fetch("/api/assistant-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistantCode: code }),
    });

    if (assistantRes.ok) {
      const payload = await assistantRes.json();
      localStorage.setItem("bn_admin_code", code);
      localStorage.setItem("bn_panel_role", "assistant");
      setSavedCode(code);
      setSavedRole("assistant");
      setRole("assistant");
      setData({ messages: payload.messages || [], users: payload.users || [] });
      setAuthed(true);
      return;
    }

    setError("Código incorrecto.");
  }

  async function refresh() {
    const r = savedRole || role;
    if (r === "admin") {
      const res = await fetch("/api/admin-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode: savedCode }),
      });
      if (res.ok) setData(await res.json());
    } else {
      const res = await fetch("/api/assistant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistantCode: savedCode }),
      });
      if (res.ok) { const p = await res.json(); setData({ messages: p.messages || [], users: p.users || [] }); }
    }
  }

  async function sendReply(messageId, recipientEmail) {
    const reply = String(replyDrafts[messageId] || "").trim();
    if (!reply) return;
    setActionStatus((s) => ({ ...s, [messageId]: "sending" }));
    const r = savedRole || role;
    const body = r === "admin"
      ? { adminCode: savedCode, type: "reply_message", messageId, message: reply, email: recipientEmail }
      : { assistantCode: savedCode, type: "reply_message", messageId, message: reply, email: recipientEmail };
    const endpoint = r === "admin" ? "/api/admin-data" : "/api/assistant-data";
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
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
    const r = savedRole || role;
    const param = r === "admin" ? `adminCode=${encodeURIComponent(savedCode)}` : `assistantCode=${encodeURIComponent(savedCode)}`;
    try {
      const res = await fetch(`/api/subscription-lookup?email=${encodeURIComponent(subEmail)}&${param}`);
      setSubData(await res.json());
    } catch { setSubData({ error: "Error de red" }); }
    setSubLoading(false);
  }

  function logout() {
    localStorage.removeItem("bn_admin_code");
    localStorage.removeItem("bn_panel_role");
    setAuthed(false);
    setRole(null);
    setSavedRole(null);
    setCode("");
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginCard}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌙</div>
          <h1 style={s.h1}>Panel Buenas Noches</h1>
          <p style={{ color: "#9ab", marginBottom: 24, fontSize: 14 }}>QuiroKids</p>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="password" placeholder="Código de acceso" value={code} onChange={(e) => setCode(e.target.value)} style={s.input} autoFocus required />
            {error && <p style={{ color: "#e87", fontSize: 13 }}>{error}</p>}
            <button type="submit" style={s.btn}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  const isAdmin   = (savedRole || role) === "admin";
  const tabs      = isAdmin ? ADMIN_TABS : ASSISTANT_TABS;
  const messages  = data?.messages || [];
  const users     = data?.users || [];
  const kpis      = data?.kpis || {};
  const subs      = data?.subscriptions || [];
  const pending   = messages.filter((m) => m.status !== "answered").length;

  /* ── Revenue calculations ── */
  const activeSubs     = subs.filter((sub) => sub.is_active);
  const monthlyActive  = activeSubs.filter((sub) => sub.plan_type === "monthly");
  const annualActive   = activeSubs.filter((sub) => sub.plan_type === "annual");
  const mrr            = monthlyActive.length * MONTHLY_PRICE + annualActive.length * (ANNUAL_PRICE / 12);
  const arr            = mrr * 12;
  const recentCancels  = subs.filter((sub) => sub.subscription_status === "canceled").sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 20);
  const billingIssues  = subs.filter((sub) => sub.subscription_status === "past_due");
  const expiringSoon   = activeSubs.filter((sub) => {
    if (!sub.expires_at) return false;
    const days = (new Date(sub.expires_at) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  });

  /* ── Shell ── */
  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ fontSize: 24 }}>🌙</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f4e7b2", marginTop: 4 }}>Buenas Noches</div>
          <div style={{ fontSize: 11, color: "#9ab" }}>{isAdmin ? "Admin" : "Asistente"}</div>
        </div>

        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ ...s.sidebarItem, ...(tab === t.id ? s.sidebarItemActive : {}) }}>
            {t.label}
            {t.id === "messages" && pending > 0 && <span style={s.badge}>{pending}</span>}
            {t.id === "ingresos" && billingIssues.length > 0 && <span style={{ ...s.badge, background: "#c97b30" }}>{billingIssues.length}</span>}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <button onClick={refresh} style={{ ...s.sidebarItem, marginBottom: 8 }}>↻ Actualizar</button>
        <button onClick={logout} style={{ ...s.sidebarItem, color: "#e87", marginBottom: 16 }}>Salir</button>
      </aside>

      <main style={s.main}>

        {/* ── MESSAGES ── */}
        {tab === "messages" && (
          <div style={s.content}>
            <h2 style={s.h2}>Mensajes <span style={s.subtitle}>{pending} sin responder</span></h2>
            {messages.length === 0 && <p style={{ color: "#9ab" }}>No hay mensajes.</p>}
            {messages.map((msg) => (
              <div key={msg.id} style={s.card}>
                <div style={s.cardHeader}>
                  <div>
                    <strong style={{ color: "#f4e7b2" }}>{msg.parent_name || msg.parent_email}</strong>
                    <span style={s.dim}>{msg.parent_email}</span>
                    {msg.child_name && <span style={{ color: "#9ecfd2", fontSize: 12, marginLeft: 8 }}>· {msg.child_name}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ ...s.topicBadge, background: msg.topic === "support" ? "#3a2a4a" : msg.topic === "win" ? "#2a3a2a" : "#2a2a3a" }}>{msg.topic || "soporte"}</span>
                    <span style={s.dim}>{msg.created_at?.slice(0, 10)}</span>
                  </div>
                </div>
                <p style={{ margin: "8px 0", lineHeight: 1.6 }}>{msg.message}</p>
                {(msg.replies || []).map((r) => (
                  <div key={r.id} style={{ ...s.replyBubble, alignSelf: r.sender === "admin" ? "flex-end" : "flex-start", background: r.sender === "admin" ? "#1a3a4a" : "#2a2a3a" }}>
                    <strong style={{ fontSize: 11, color: r.sender === "admin" ? "#9ecfd2" : "#f4e7b2" }}>{r.sender === "admin" ? (isAdmin ? "Joline" : "Equipo") : "Usuario"}</strong>
                    <p style={{ margin: "4px 0 0", fontSize: 14 }}>{r.message}</p>
                    <small style={s.dim}>{r.created_at?.slice(0, 10)}</small>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <textarea
                    value={replyDrafts[msg.id] || ""}
                    onChange={(e) => setReplyDrafts((d) => ({ ...d, [msg.id]: e.target.value }))}
                    placeholder="Escribe tu respuesta… (Cmd+Enter para enviar)"
                    style={{ ...s.input, flex: 1, minHeight: 60, resize: "vertical" }}
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) sendReply(msg.id, msg.parent_email); }}
                  />
                  <button onClick={() => sendReply(msg.id, msg.parent_email)} style={{ ...s.btn, alignSelf: "flex-end", minWidth: 80 }}>
                    {actionStatus[msg.id] === "sending" ? "..." : actionStatus[msg.id] === "sent" ? "✓" : "Enviar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INGRESOS (admin only) ── */}
        {tab === "ingresos" && isAdmin && (
          <div style={s.content}>
            <h2 style={s.h2}>Ingresos</h2>

            {/* KPI cards */}
            <div style={s.kpiGrid}>
              {[
                { label: "MRR estimado", value: `$${mrr.toFixed(2)}` },
                { label: "ARR estimado",  value: `$${arr.toFixed(2)}` },
                { label: "Suscriptores activos", value: activeSubs.length },
                { label: "Plan mensual", value: monthlyActive.length },
                { label: "Plan anual",   value: annualActive.length },
                { label: "Cancelaciones", value: recentCancels.length },
                { label: "Cobro fallido", value: billingIssues.length },
                { label: "Vencen en 7 días", value: expiringSoon.length },
              ].map((k) => (
                <div key={k.label} style={s.kpiCard}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#f4e7b2", fontFamily: "monospace" }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: "#9ab", marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Billing issues */}
            {billingIssues.length > 0 && (
              <>
                <h3 style={s.h3}>⚠️ Cobro fallido</h3>
                <table style={s.table}><thead><tr>{["Email","Plan","Vence"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                  <tbody>{billingIssues.map((sub) => (
                    <tr key={sub.id} style={s.tr}>
                      <td style={s.td}>{sub.email}</td>
                      <td style={s.td}>{sub.plan_type}</td>
                      <td style={s.td}>{sub.expires_at?.slice(0, 10) || "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </>
            )}

            {/* Expiring soon */}
            {expiringSoon.length > 0 && (
              <>
                <h3 style={s.h3}>⏰ Vencen en 7 días</h3>
                <table style={s.table}><thead><tr>{["Email","Plan","Vence"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                  <tbody>{expiringSoon.map((sub) => (
                    <tr key={sub.id} style={s.tr}>
                      <td style={s.td}>{sub.email}</td>
                      <td style={s.td}>{sub.plan_type}</td>
                      <td style={s.td}>{sub.expires_at?.slice(0, 10)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </>
            )}

            {/* Active subscriptions */}
            <h3 style={s.h3}>Suscripciones activas ({activeSubs.length})</h3>
            <table style={s.table}><thead><tr>{["Email","Plan","Renueva","Estado"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{activeSubs.map((sub) => (
                <tr key={sub.id} style={s.tr}>
                  <td style={s.td}>{sub.email}</td>
                  <td style={s.td}><PlanBadge plan={sub.plan_type} /></td>
                  <td style={s.td}>{sub.renews_at?.slice(0, 10) || sub.expires_at?.slice(0, 10) || "—"}</td>
                  <td style={s.td}><StatusDot status={sub.subscription_status} /></td>
                </tr>
              ))}</tbody>
            </table>

            {/* Recent cancellations */}
            {recentCancels.length > 0 && (
              <>
                <h3 style={s.h3}>Cancelaciones recientes</h3>
                <table style={s.table}><thead><tr>{["Email","Plan","Canceló","Vencía"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
                  <tbody>{recentCancels.map((sub) => (
                    <tr key={sub.id} style={s.tr}>
                      <td style={s.td}>{sub.email}</td>
                      <td style={s.td}>{sub.plan_type}</td>
                      <td style={s.td}>{sub.updated_at?.slice(0, 10)}</td>
                      <td style={s.td}>{sub.expires_at?.slice(0, 10) || "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* ── SUBSCRIPTIONS LOOKUP ── */}
        {tab === "subscriptions" && (
          <div style={s.content}>
            <h2 style={s.h2}>Buscar suscripción</h2>
            <form onSubmit={lookupSub} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <input type="email" value={subEmail} onChange={(e) => setSubEmail(e.target.value)} placeholder="email@ejemplo.com" style={{ ...s.input, flex: 1 }} required />
              <button type="submit" style={s.btn}>{subLoading ? "..." : "Buscar"}</button>
            </form>
            {subData && !subData.error && (
              <div style={s.card}>
                <Row label="Email" value={subData.email} />
                <Row label="Plan" value={<PlanBadge plan={subData.plan_type} />} />
                <Row label="Estado" value={<StatusDot status={subData.subscription_status} />} />
                <Row label="Vence" value={subData.expires_at?.slice(0, 10) || "—"} />
                <Row label="Acceso legacy" value={subData.legacy_access ? "sí (lifetime)" : "no"} />
                <p style={{ marginTop: 12 }}>
                  <a href="https://apps.apple.com/account/subscriptions" target="_blank" rel="noreferrer" style={{ color: "#9ecfd2", fontSize: 13 }}>Ver en Apple Subscriptions →</a>
                </p>
              </div>
            )}
            {subData?.error && <p style={{ color: "#e87" }}>{subData.error}</p>}
          </div>
        )}

        {/* ── USERS (admin only) ── */}
        {tab === "users" && isAdmin && (
          <div style={s.content}>
            <h2 style={s.h2}>Usuarios <span style={s.subtitle}>{users.length} registrados</span></h2>
            <table style={s.table}>
              <thead><tr>{["Email","Nombre","Plan","Activo","Registrado"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{users.map((u) => (
                <tr key={u.email} style={s.tr}>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>{u.parent_name || "—"}</td>
                  <td style={s.td}><span style={{ color: u.has_premium ? "#8fbe9e" : "#9ab" }}>{u.has_premium ? (u.plan_type || "premium") : "free"}</span></td>
                  <td style={s.td}><span style={{ color: u.is_active ? "#8fbe9e" : "#e87" }}>{u.is_active ? "sí" : "no"}</span></td>
                  <td style={s.td}>{u.created_at?.slice(0, 10) || "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── DASHBOARD KPIs (admin only) ── */}
        {tab === "kpis" && isAdmin && (
          <div style={s.content}>
            <h2 style={s.h2}>Dashboard</h2>
            <div style={s.kpiGrid}>
              {[
                { label: "Usuarios totales", value: kpis.totalUsers ?? users.length },
                { label: "Premium activos", value: activeSubs.length },
                { label: "Mensajes pendientes", value: pending },
                { label: "Rutinas esta semana", value: kpis.routinesThisWeek ?? "—" },
                { label: "MRR", value: `$${mrr.toFixed(0)}` },
              ].map((k) => (
                <div key={k.label} style={s.kpiCard}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#f4e7b2", fontFamily: "monospace" }}>{k.value}</div>
                  <div style={{ fontSize: 13, color: "#9ab", marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <p style={{ margin: "4px 0", fontSize: 14 }}>
      <strong style={{ color: "#9ab", minWidth: 100, display: "inline-block" }}>{label}:</strong> {value}
    </p>
  );
}

function PlanBadge({ plan }) {
  const color = plan === "annual" ? "#9ecfd2" : plan === "monthly" ? "#f4e7b2" : "#9ab";
  return <span style={{ color, fontWeight: 600 }}>{plan === "annual" ? "Anual" : plan === "monthly" ? "Mensual" : plan || "—"}</span>;
}

function StatusDot({ status }) {
  const colors = { active: "#8fbe9e", canceled: "#e87", past_due: "#c97b30", expired: "#9ab" };
  const labels = { active: "Activo", canceled: "Cancelado", past_due: "Cobro fallido", expired: "Expirado" };
  return <span style={{ color: colors[status] || "#9ab", fontWeight: 600 }}>{labels[status] || status || "—"}</span>;
}

const s = {
  loginWrap:       { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#16222e" },
  loginCard:       { background: "#1f3044", borderRadius: 20, padding: 36, width: 320, textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,.4)" },
  h1:              { fontFamily: "Baloo 2, sans-serif", fontSize: 24, color: "#f4e7b2", margin: "0 0 4px" },
  h2:              { fontFamily: "Baloo 2, sans-serif", fontSize: 22, color: "#f4e7b2", margin: "0 0 20px" },
  h3:              { fontFamily: "Baloo 2, sans-serif", fontSize: 16, color: "#f4e7b2", margin: "24px 0 10px" },
  subtitle:        { fontSize: 14, color: "#9ab", fontWeight: 400 },
  dim:             { color: "#9ab", fontSize: 12, marginLeft: 8 },
  input:           { background: "#16222e", border: "1px solid #2a3a4a", borderRadius: 10, padding: "10px 14px", color: "#fff8ef", fontSize: 14, width: "100%", boxSizing: "border-box" },
  btn:             { background: "#f4e7b2", color: "#16222e", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14, whiteSpace: "nowrap" },
  shell:           { display: "flex", minHeight: "100vh", background: "#16222e", color: "#fff8ef", fontFamily: "system-ui, sans-serif" },
  sidebar:         { width: 200, background: "#1f3044", display: "flex", flexDirection: "column", borderRight: "1px solid #2a3a4a", flexShrink: 0 },
  sidebarItem:     { display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "none", border: "none", color: "#fff8ef", cursor: "pointer", fontSize: 14, textAlign: "left", width: "100%" },
  sidebarItemActive: { background: "#28394e", color: "#f4e7b2", fontWeight: 700 },
  badge:           { marginLeft: "auto", background: "#d9968c", color: "#fff", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 10 },
  main:            { flex: 1, overflowY: "auto" },
  content:         { padding: 32, maxWidth: 960 },
  card:            { background: "#1f3044", border: "1px solid #2a3a4a", borderRadius: 14, padding: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 4 },
  cardHeader:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 },
  topicBadge:      { fontSize: 11, padding: "2px 8px", borderRadius: 12, color: "#9ecfd2", fontWeight: 600 },
  replyBubble:     { borderRadius: 12, padding: "10px 14px", maxWidth: "75%", display: "flex", flexDirection: "column" },
  kpiGrid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14, marginBottom: 32 },
  kpiCard:         { background: "#1f3044", borderRadius: 14, padding: 20, border: "1px solid #2a3a4a" },
  table:           { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 8 },
  th:              { textAlign: "left", padding: "10px 14px", color: "#9ab", borderBottom: "1px solid #2a3a4a", fontSize: 12, fontWeight: 600 },
  td:              { padding: "10px 14px", color: "#fff8ef" },
  tr:              { borderBottom: "1px solid #1a2a3a" },
};
