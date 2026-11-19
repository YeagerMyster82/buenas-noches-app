"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BnCurso from "./bn-curso";
import NotificationSettings from "../components/NotificationSettings";
import styles from "./bn-portal.module.css";

// Load the existing app only on client to avoid SSR issues
const BuenasNochesApp = dynamic(
  () => import("../../components/buenas-noches-app"),
  { ssr: false, loading: () => <div className={styles.appLoading} /> }
);

export default function BuenasNochesPortal() {
  const router = useRouter();
  const [tab, setTab] = useState("curso");
  const [hasAccess, setHasAccess] = useState(false);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
    fetch("/api/premium-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e }),
    })
      .then(r => r.json())
      .then(data => { setHasAccess(data.buenas_noches || false); setChecked(true); })
      .catch(() => setChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (checked && !hasAccess) {
    return (
      <div className={styles.shell} data-theme="buenas-noches" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh" }}>
        <div style={{ textAlign: "center", padding: "40px 24px", maxWidth: 400 }}>
          <p style={{ fontSize: 40 }}>🔒</p>
          <p style={{ fontFamily: "var(--font-marca)", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Acceso no disponible</p>
          <p style={{ color: "var(--tinta-muted)", marginBottom: 24 }}>No tienes acceso al curso Buenas Noches. Puedes adquirirlo desde la tienda.</p>
          <Link href="/checkout/buenas-noches" style={{ background: "var(--turquesa)", color: "#fff", padding: "12px 28px", borderRadius: "999px", textDecoration: "none", fontFamily: "var(--font-marca)", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>Ver el curso →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell} data-theme="buenas-noches">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Mis cursos
          </Link>
          <Image
            src="/buenas-noches-logotipo.png"
            alt="Buenas Noches"
            width={140}
            height={36}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Tabs */}
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "curso" ? styles.tabActive : ""}`}
            onClick={() => setTab("curso")}
          >
            Curso
          </button>
          <button
            className={`${styles.tab} ${tab === "app" ? styles.tabActive : ""}`}
            onClick={() => setTab("app")}
          >
            App
          </button>
          <button
            className={`${styles.tab} ${tab === "config" ? styles.tabActive : ""}`}
            onClick={() => setTab("config")}
          >
            Ajustes
          </button>
        </nav>
      </header>

      {/* Content */}
      <div className={styles.content}>
        {tab === "curso" && <BnCurso />}
        {tab === "app" && (
          <div className={styles.appWrapper}>
            <BuenasNochesApp />
          </div>
        )}
        {tab === "config" && (
          <div className={styles.configWrapper}>
            <p className={styles.configTitle}>Notificaciones</p>
            <NotificationSettings email={email} product="buenas_noches" />
          </div>
        )}
      </div>
    </div>
  );
}
