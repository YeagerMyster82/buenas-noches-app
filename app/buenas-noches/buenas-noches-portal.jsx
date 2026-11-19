"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import BnCurso from "./bn-curso";
import styles from "./bn-portal.module.css";

// Load the existing app only on client to avoid SSR issues
const BuenasNochesApp = dynamic(
  () => import("../../components/buenas-noches-app"),
  { ssr: false, loading: () => <div className={styles.appLoading} /> }
);

export default function BuenasNochesPortal() {
  const router = useRouter();
  const [tab, setTab] = useState("curso");

  useEffect(() => {
    const email = sessionStorage.getItem("qk_email");
    if (!email) router.replace("/login");
  }, [router]);

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
      </div>
    </div>
  );
}
