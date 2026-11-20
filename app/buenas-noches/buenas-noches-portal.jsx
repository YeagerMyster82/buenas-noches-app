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
  { id: "inicio", label: "Inicio" },
  { id: "videos", label: "Videos" },
  { id: "ajustes", label: "Ajustes" },
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
            <span className={styles.bottomTabLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
