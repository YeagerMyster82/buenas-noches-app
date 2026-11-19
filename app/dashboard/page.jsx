"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase-client";
import styles from "./dashboard.module.css";

const COURSES = [
  {
    id: "neuroesencia",
    label: "CURSO",
    title: "NeuroEsencia",
    tagline: "Reflejos primitivos: evalúa, entiende e integra",
    href: "/neuroesencia",
    accent: "var(--turquesa)",
    icon: "🧠",
  },
  {
    id: "buenas-noches",
    label: "CURSO + APP",
    title: "Buenas Noches",
    tagline: "18 actividades para calmar el sistema nervioso antes de dormir",
    href: "/buenas-noches",
    accent: "#2d3f5c",
    icon: "🌙",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    // Try Supabase session first, fall back to sessionStorage
    async function init() {
      let userEmail = sessionStorage.getItem("qk_email");

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        userEmail = session.user.email;
        sessionStorage.setItem("qk_email", userEmail);
      }

      if (!userEmail) { router.replace("/login"); return; }
      setEmail(userEmail);

      fetch("/api/premium-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })
        .then(r => r.json())
        .then(data => { setAccess(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
    init();
  }, [router, supabase]);

  function hasAccess(courseId) {
    if (!access) return false;
    if (courseId === "neuroesencia") return access.neuroesencia || false;
    if (courseId === "buenas-noches") return access.buenas_noches || false;
    return false;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    sessionStorage.removeItem("qk_email");
    router.push("/login");
  }

  const initials = email ? email[0].toUpperCase() : "?";

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Top nav */}
      <nav className={styles.nav}>
        <Image src="/quirokids-simbolo.png" alt="QuiroKids" width={32} height={32} />
        <div className={styles.navRight}>
          <div className={styles.avatar}>{initials}</div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.greeting}>
          <h1 className={styles.heading}>Mis cursos</h1>
          <p className={styles.subheading}>{email}</p>
        </div>

        <div className={styles.grid}>
          {COURSES.map(course => {
            const unlocked = hasAccess(course.id);
            return (
              <div key={course.id} className={styles.card} style={{ "--accent": course.accent }}>
                <div className={styles.cardHero}>
                  <span className={styles.cardLabel}>{course.label}</span>
                  <span className={styles.cardIcon}>{course.icon}</span>
                  {!unlocked && <span className={styles.lockOverlay}>🔒</span>}
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{course.title}</h2>
                  <p className={styles.cardTagline}>{course.tagline}</p>
                  {unlocked ? (
                    <Link href={course.href} className={styles.cardBtn}>
                      Ir al curso →
                    </Link>
                  ) : (
                    <Link href="/#cursos" className={styles.cardBtnLocked}>
                      Ver información →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.freeSection}>
          <p className={styles.freeSectionLabel}>CONTENIDO GRATUITO</p>
          <Link href="/neuroesencia/el-secreto-de-los-ejercicios" className={styles.freeCard}>
            <span className={styles.freeCardIcon}>▶</span>
            <div>
              <p className={styles.freeCardTitle}>El secreto de los ejercicios para reflejos primitivos</p>
              <p className={styles.freeCardSub}>Video gratuito · NeuroEsencia</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
