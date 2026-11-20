"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BnCurso from "./bn-curso";
import NotificationSettings from "../components/NotificationSettings";
import styles from "./bn-portal.module.css";

const BuenasNochesApp = dynamic(
  () => import("../../components/buenas-noches-app"),
  { ssr: false, loading: () => <div className={styles.appLoading} /> }
);

const NAV_TABS = [
  {
    id: "inicio", label: "Inicio",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L10 3l7 6.5"/>
        <path d="M5 8.5V17h4v-4h2v4h4V8.5"/>
      </svg>
    ),
  },
  {
    id: "videos", label: "Videos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7"/>
        <polygon points="8.5,7.5 8.5,12.5 13,10" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "ajustes", label: "Ajustes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="2.5"/>
        <path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.8 4.8l1.3 1.3M13.9 13.9l1.3 1.3M4.8 15.2l1.3-1.3M13.9 6.1l1.3-1.3"/>
      </svg>
    ),
  },
];

export default function BuenasNochesPortal() {
  const router = useRouter();
  const [tab, setTab] = useState("inicio");
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
  }, [router]);

  return (
    <div className={styles.shell} data-theme="buenas-noches">
      {/* Slim top bar */}
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>← Mis cursos</Link>
        <Image
          src="/buenas-noches-logotipo.png"
          alt="Buenas Noches"
          width={130}
          height={34}
          style={{ objectFit: "contain" }}
        />
        <div style={{ width: 80 }} />
      </header>

      {/* Content */}
      <div className={styles.content}>
        {tab === "inicio" && (
          <div className={styles.appWrapper}>
            {checked && (hasAccess ? (
              <BuenasNochesApp />
            ) : (
              <div className={styles.lockedState}>
                <p className={styles.lockIcon}>🔒</p>
                <p className={styles.lockTitle}>Rutina Premium</p>
                <p className={styles.lockSub}>El creador de rutinas y seguimiento de sueño están disponibles con el plan premium de Buenas Noches.</p>
                <Link href="/checkout/buenas-noches" className={styles.lockBtn}>
                  Acceder al premium →
                </Link>
              </div>
            ))}
          </div>
        )}

        {tab === "videos" && <BnCurso />}

        {tab === "ajustes" && (
          <div className={styles.configWrapper}>
            <p className={styles.configTitle}>Notificaciones</p>
            <NotificationSettings email={email} product="buenas_noches" />
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className={styles.bottomNav}>
        {NAV_TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.bottomTab} ${tab === t.id ? styles.bottomTabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            <span className={styles.bottomTabLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
