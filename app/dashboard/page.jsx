"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

const COURSES = [
  {
    id: "neuroesencia",
    title: "NEUROESENCIA",
    tagline: "Reflejos primitivos: evalúa e integra",
    href: "/neuroesencia",
    theme: "day",
    color: "var(--turquesa)",
  },
  {
    id: "buenas-noches",
    title: "BUENAS NOCHES",
    tagline: "Rutinas de sueño para tu hijo",
    href: "/buenas-noches",
    theme: "night",
    color: "var(--noche)",
    logo: "/buenas-noches-logotipo.png",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("qk_email");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setEmail(stored);

    fetch("/api/premium-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: stored }),
    })
      .then(r => r.json())
      .then(data => {
        setAccess(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  function hasAccess(courseId) {
    if (!access) return false;
    if (access.hasAccess || access.premium_unlocked) return true;
    if (courseId === "buenas-noches" && (access.hasAccess || access.premium_unlocked)) return true;
    return false;
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image src="/quirokids-logo-vertical.png" alt="QuiroKids" width={60} height={60} />
        </Link>
        <div className={styles.navRight}>
          <span className={styles.navEmail}>{email}</span>
          <button
            className={styles.navLogout}
            onClick={() => {
              sessionStorage.removeItem("qk_email");
              router.push("/login");
            }}
          >
            Salir
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.heading}>MIS CURSOS</h1>

        <div className={styles.grid}>
          {COURSES.map(course => {
            const unlocked = hasAccess(course.id);
            return (
              <div
                key={course.id}
                className={`${styles.card} ${!unlocked ? styles.locked : ""}`}
                style={{ "--card-color": course.color }}
              >
                <div className={styles.cardTop} style={{ background: course.color }}>
                  {course.logo ? (
                    <Image
                      src={course.logo}
                      alt={course.title}
                      width={160}
                      height={40}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <h2 className={styles.cardTitle}>{course.title}</h2>
                  )}
                  {!unlocked && <span className={styles.lockBadge}>🔒</span>}
                </div>
                <div className={styles.cardBottom}>
                  <p className={styles.cardTagline}>{course.tagline}</p>
                  {unlocked ? (
                    <Link href={course.href} className={styles.cardBtn}>
                      Ir al curso →
                    </Link>
                  ) : (
                    <Link href={`/#cursos`} className={styles.cardBtnLocked}>
                      Ver información →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
