"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../app-shell/AppShell";
import NotificationSettings from "../components/NotificationSettings";
import styles from "./ajustes.module.css";

export default function AjustesPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
  }, [router]);

  function handleSignOut() {
    sessionStorage.removeItem("qk_email");
    router.replace("/login");
  }

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.heading}>Ajustes</h1>

        {email && (
          <div className={styles.accountCard}>
            <p className={styles.cardLabel}>Cuenta</p>
            <p className={styles.accountEmail}>{email}</p>
          </div>
        )}

        <p className={styles.sectionLabel}>Notificaciones — NeuroEsencia</p>
        {email && <NotificationSettings email={email} product="neuroesencia" />}

        <p className={styles.sectionLabel}>Notificaciones — Buenas Noches</p>
        {email && <NotificationSettings email={email} product="buenas_noches" />}

        <button className={styles.signOutBtn} onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </div>
    </AppShell>
  );
}
