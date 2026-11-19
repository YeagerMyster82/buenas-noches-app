"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./lesson.module.css";

function VideoBlock({ lesson, hasAccess }) {
  // Free lesson — YouTube embed, no access check
  if (lesson.youtubeId) {
    return (
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.videoFrame}
          title={lesson.title}
        />
      </div>
    );
  }

  // Paid lesson — Bunny.net, requires access
  if (lesson.bunnyId) {
    if (!hasAccess) {
      return <PaywallBlock />;
    }
    const [libraryId, videoId] = lesson.bunnyId.split("/");
    return (
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&responsive=true`}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className={styles.videoFrame}
          title={lesson.title}
        />
      </div>
    );
  }

  // No video yet
  return (
    <div className={styles.videoPlaceholder}>
      <div className={styles.placeholderInner}>
        <span className={styles.placeholderIcon}>▶</span>
        <p className={styles.placeholderText}>Video próximamente</p>
        <p className={styles.placeholderSub}>Pronto disponible</p>
      </div>
    </div>
  );
}

function PaywallBlock() {
  return (
    <div className={styles.paywall}>
      <div className={styles.paywallInner}>
        <span className={styles.paywallIcon}>🔒</span>
        <p className={styles.paywallTitle}>Este video es parte del curso</p>
        <p className={styles.paywallSub}>Accede al curso NeuroEsencia para ver este contenido.</p>
        <Link href="/#cursos" className={styles.paywallBtn}>Ver información del curso →</Link>
      </div>
    </div>
  );
}

export default function LessonViewer({ lesson, module: mod, prev, next }) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Free lessons (YouTube) skip the access check entirely
    if (lesson.youtubeId) {
      setHasAccess(true);
      setChecked(true);
      return;
    }
    const email = sessionStorage.getItem("qk_email");
    if (!email) { router.replace("/login"); return; }
    fetch("/api/premium-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(r => r.json())
      .then(data => { setHasAccess(data.hasAccess || data.premium_unlocked || false); setChecked(true); })
      .catch(() => setChecked(true));
  }, [lesson.youtubeId, router]);

  return (
    <article className={styles.article}>
      {/* Module label */}
      <span className={styles.moduleTag}>{mod.title}</span>

      {/* Free badge */}
      {lesson.youtubeId && <span className={styles.freeBadge}>Gratis</span>}

      {/* Title */}
      <h1 className={styles.title}>{lesson.title}</h1>

      {/* Video */}
      {checked && <VideoBlock lesson={lesson} hasAccess={hasAccess} />}

      {/* Navigation */}
      <nav className={styles.nav}>
        {prev ? (
          <Link href={`/neuroesencia/${prev.slug}`} className={styles.navBtn}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/neuroesencia/${next.slug}`} className={`${styles.navBtn} ${styles.navBtnNext}`}>
            {next.title} →
          </Link>
        ) : (
          <Link href="/dashboard" className={`${styles.navBtn} ${styles.navBtnNext}`}>
            Volver al inicio →
          </Link>
        )}
      </nav>
    </article>
  );
}
