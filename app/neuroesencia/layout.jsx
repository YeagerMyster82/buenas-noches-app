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
  { id: "inicio",   label: "Inicio",   href: "/neuroesencia" },
  { id: "reporte",  label: "Reporte",  href: "/neuroesencia/progreso" },
  { id: "nino",     label: "Niño",     href: "/neuroesencia/nino" },
  { id: "curso",    label: "Curso",    href: "/neuroesencia/biblioteca" },
  { id: "ajustes",  label: "Ajustes",  href: "/neuroesencia/ajustes" },
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
            <span className={styles.bottomTabLabel}>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
