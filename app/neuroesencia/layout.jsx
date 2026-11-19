"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NEUROESENCIA } from "../../lib/courses";
import styles from "./course.module.css";

export default function NeuroEsenciaLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModules, setOpenModules] = useState(() =>
    Object.fromEntries(NEUROESENCIA.modules.map(m => [m.id, true]))
  );

  useEffect(() => {
    const email = sessionStorage.getItem("qk_email");
    if (!email) router.replace("/login");
  }, [router]);

  function toggleModule(id) {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const currentSlug = pathname.split("/").pop();

  return (
    <div className={styles.shell}>
      {/* Top nav */}
      <header className={styles.topNav}>
        <div className={styles.topNavLeft}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Menú"
          >
            ☰
          </button>
          <Link href="/dashboard">
            <Image src="/quirokids-simbolo.png" alt="QuiroKids" width={32} height={32} />
          </Link>
          <span className={styles.courseLabel}>NEUROESENCIA</span>
        </div>
        <Link href="/dashboard" className={styles.dashLink}>
          ← Mis cursos
        </Link>
      </header>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <nav className={styles.sidebarNav}>
            <div className={styles.module}>
              <Link
                href="/neuroesencia/mi-ruta"
                className={styles.rutaLink}
                onClick={() => setSidebarOpen(false)}
              >
                ¿Por dónde empiezo?
              </Link>
            </div>
            {NEUROESENCIA.modules.map(mod => (
              <div key={mod.id} className={styles.module}>
                <button
                  className={styles.moduleTitle}
                  onClick={() => toggleModule(mod.id)}
                >
                  <span>{mod.title}</span>
                  <span className={styles.chevron}>
                    {openModules[mod.id] ? "▾" : "▸"}
                  </span>
                </button>
                {openModules[mod.id] && (
                  <ul className={styles.lessonList}>
                    {mod.lessons.map(lesson => (
                      <li key={lesson.slug}>
                        <Link
                          href={`/neuroesencia/${lesson.slug}`}
                          className={`${styles.lessonLink} ${
                            currentSlug === lesson.slug ? styles.lessonActive : ""
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
