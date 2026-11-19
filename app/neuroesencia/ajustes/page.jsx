"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationSettings from "../../components/NotificationSettings";
import styles from "./ajustes.module.css";

export default function AjustesPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
  }, [router]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Ajustes</h1>

        <p className={styles.sectionLabel}>Notificaciones</p>
        {email && <NotificationSettings email={email} product="neuroesencia" />}

        <p className={styles.hint}>
          Los recordatorios se envían diariamente a la hora que eliges. Puedes cambiarlos en cualquier momento desde aquí.
        </p>
      </div>
    </div>
  );
}
