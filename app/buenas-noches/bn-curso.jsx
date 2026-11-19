"use client";

import { useState } from "react";
import { BUENAS_NOCHES_COURSE, getAdjacentLessons } from "../../lib/courses";
import styles from "./bn-curso.module.css";

function VideoPlaceholder({ bunnyId, title }) {
  if (bunnyId) {
    const [libraryId, videoId] = bunnyId.split("/");
    return (
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&responsive=true`}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className={styles.videoFrame}
          title={title}
        />
      </div>
    );
  }
  return (
    <div className={styles.videoPlaceholder}>
      <span className={styles.placeholderIcon}>▶</span>
      <p className={styles.placeholderText}>Video próximamente</p>
    </div>
  );
}

export default function BnCurso() {
  const allLessons = BUENAS_NOCHES_COURSE.modules.flatMap(m => m.lessons);
  const [currentSlug, setCurrentSlug] = useState(allLessons[0]?.slug);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openModules, setOpenModules] = useState(() =>
    Object.fromEntries(BUENAS_NOCHES_COURSE.modules.map(m => [m.id, true]))
  );

  const currentLesson = allLessons.find(l => l.slug === currentSlug);
  const currentModule = BUENAS_NOCHES_COURSE.modules.find(m =>
    m.lessons.some(l => l.slug === currentSlug)
  );
  const { prev, next } = getAdjacentLessons(BUENAS_NOCHES_COURSE, currentSlug);

  function toggleModule(id) {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={styles.shell}>
      {/* Mobile sidebar toggle */}
      <button
        className={styles.menuBtn}
        onClick={() => setSidebarOpen(o => !o)}
      >
        ☰ Lecciones
      </button>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <nav className={styles.sidebarNav}>
          {BUENAS_NOCHES_COURSE.modules.map(mod => (
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
                      <button
                        className={`${styles.lessonBtn} ${
                          currentSlug === lesson.slug ? styles.lessonActive : ""
                        }`}
                        onClick={() => {
                          setCurrentSlug(lesson.slug);
                          setSidebarOpen(false);
                        }}
                      >
                        {lesson.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main lesson */}
      <main className={styles.main}>
        {currentLesson ? (
          <article className={styles.article}>
            <span className={styles.moduleTag}>{currentModule?.title}</span>
            <h1 className={styles.title}>{currentLesson.title}</h1>
            <VideoPlaceholder bunnyId={currentLesson.bunnyId} title={currentLesson.title} />

            {/* Prev / Next */}
            <nav className={styles.nav}>
              {prev ? (
                <button className={styles.navBtn} onClick={() => setCurrentSlug(prev.slug)}>
                  ← {prev.title}
                </button>
              ) : <span />}
              {next ? (
                <button
                  className={`${styles.navBtn} ${styles.navBtnNext}`}
                  onClick={() => setCurrentSlug(next.slug)}
                >
                  {next.title} →
                </button>
              ) : (
                <span className={styles.completedNote}>¡Curso completado!</span>
              )}
            </nav>
          </article>
        ) : (
          <p className={styles.empty}>No hay lecciones disponibles aún.</p>
        )}
      </main>
    </div>
  );
}
