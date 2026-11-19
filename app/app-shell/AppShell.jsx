"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AppShell.module.css";

const NAV_ITEMS = [
  { href: "/inicio", icon: "🏠", label: "Inicio" },
  { href: "/reportes", icon: "📊", label: "Reportes" },
  { href: "/nino", icon: "👦", label: "Niño" },
  { href: "/buenas-noches", icon: "🌙", label: "Rutina" },
  { href: "/neuroesencia", icon: "🧠", label: "Videos" },
  { href: "/ajustes", icon: "⚙️", label: "Ajustes" },
];

export default function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <img src="/quirokids-simbolo.png" alt="QuiroKids" className={styles.logo} />
        <span className={styles.brand}>QuiroKids</span>
        <a
          href="https://wa.me/521XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.helpBtn}
          aria-label="Pedir ayuda"
        >
          💬
        </a>
      </header>

      <main className={styles.content}>{children}</main>

      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${active ? styles.navActive : ""}`}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
