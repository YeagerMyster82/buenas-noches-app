"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NEUROESENCIA, isLessonFree } from "../../lib/courses";
import styles from "./course.module.css";

const NON_CURSO = ["/progreso", "/nino", "/ajustes", "/evaluar", "/mi-ruta"];

function getActiveTab(pathname) {
  if (pathname === "/neuroesencia") return "inicio";
  if (pathname.includes("/progreso")) return "reporte";
  if (pathname.includes("/nino") || pathname.includes("/evaluar") || pathname.includes("/mi-ruta")) return "nino";
  if (pathname.includes("/ajustes")) return "ajustes";
  return "curso";
}

const NAV_TABS = [
  {
    id: "inicio", label: "Inicio", href: "/neuroesencia",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L10 3l7 6.5"/>
        <path d="M5 8.5V17h4v-4h2v4h4V8.5"/>
      </svg>
    ),
  },
  {
    id: "reporte", label: "Reporte", href: "/neuroesencia/progreso",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="3" height="5" rx="1"/>
        <rect x="8.5" y="8" width="3" height="9" rx="1"/>
        <rect x="14" y="4" width="3" height="13" rx="1"/>
      </svg>
    ),
  },
  {
    id: "nino", label: "Niño", href: "/neuroesencia/nino",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.2"/>
        <line x1="12" y1="7.2" x2="12" y2="15"/>
        <line x1="8" y1="10.5" x2="16" y2="10.5"/>
        <line x1="12" y1="15" x2="9" y2="21"/>
        <line x1="12" y1="15" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    id: "curso", label: "Curso", href: "/neuroesencia/biblioteca",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7"/>
        <polygon points="8.5,7.5 8.5,12.5 13,10" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: "ajustes", label: "Ajustes", href: "/neuroesencia/ajustes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="2.5"/>
        <path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.8 4.8l1.3 1.3M13.9 13.9l1.3 1.3M4.8 15.2l1.3-1.3M13.9 6.1l1.3-1.3"/>
      </svg>
    ),
  },
];

export default function NeuroEsenciaLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModules, setOpenModules] = useState(() =>
    Object.fromEntries(NEUROESENCIA.modules.map(m => [m.id, true]))
  );
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem("qk_email");
    if (!email) { router.replace("/login"); return; }
    fetch("/api/premium-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(r => r.json())
      .then(data => setHasAccess(data.neuroesencia || false))
      .catch(() => {});
  }, [router]);

  function toggleModule(id) {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const activeTab = getActiveTab(pathname);
  const isCursoTab = activeTab === "curso";
  const currentSlug = pathname.split("/").pop();

  return (
    <div className={styles.shell}>
      {/* Slim top bar */}
      <header className={styles.topNav}>
        <Link href="/dashboard" className={styles.dashLink}>← Mis cursos</Link>
        <span className={styles.courseLabel}>NEUROESENCIA</span>
        <div style={{ width: 80 }} />
      </header>

      {/* Body */}
      <div className={`${styles.body} ${!isCursoTab ? styles.bodyFull : ""}`}>
        {/* Sidebar — only on lesson/biblioteca pages */}
        {isCursoTab && (
          <>
            {sidebarOpen && (
              <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
            )}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
              <nav className={styles.sidebarNav}>
                <div className={styles.module}>
                  <Link
                    href="/neuroesencia/biblioteca"
                    className={styles.rutaLink}
                    onClick={() => setSidebarOpen(false)}
                  >
                    📚 Biblioteca de videos
                  </Link>
                </div>
                {NEUROESENCIA.modules.map(mod => (
                  <div key={mod.id} className={styles.module}>
                    <button
                      className={styles.moduleTitle}
                      onClick={() => toggleModule(mod.id)}
                    >
                      <span>{mod.title}</span>
                      <span className={styles.chevron}>{openModules[mod.id] ? "▾" : "▸"}</span>
                    </button>
                    {openModules[mod.id] && (
                      <ul className={styles.lessonList}>
                        {mod.lessons.map(lesson => {
                          const free = isLessonFree(lesson);
                          const locked = !free && !hasAccess;
                          return (
                            <li key={lesson.slug}>
                              <Link
                                href={`/neuroesencia/${lesson.slug}`}
                                className={`${styles.lessonLink} ${currentSlug === lesson.slug ? styles.lessonActive : ""} ${locked ? styles.lessonLocked : ""}`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {locked && <span className={styles.lockIcon}>🔒</span>}
                                {lesson.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* Mobile lecciones button — only on curso tab */}
        {isCursoTab && (
          <button className={styles.leccionesBtn} onClick={() => setSidebarOpen(o => !o)}>
            ☰ Lecciones
          </button>
        )}

        {/* Main content */}
        <main className={`${styles.main} ${!isCursoTab ? styles.mainFull : ""}`}>
          {children}
        </main>
      </div>

      {/* Bottom nav */}
      <nav className={styles.bottomNav}>
        {NAV_TABS.map(tab => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`${styles.bottomTab} ${activeTab === tab.id ? styles.bottomTabActive : ""}`}
          >
            {tab.icon}
            <span className={styles.bottomTabLabel}>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
