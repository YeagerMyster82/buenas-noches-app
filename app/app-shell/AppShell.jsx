"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HelpModal from "../components/HelpModal";
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
  const [helpOpen, setHelpOpen] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    setEmail(sessionStorage.getItem("qk_email"));
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <img src="/quirokids-simbolo.png" alt="QuiroKids" className={styles.logo} />
        <span className={styles.brand}>QuiroKids</span>
        <button
          className={styles.helpBtn}
          onClick={() => setHelpOpen(true)}
          aria-label="Pedir ayuda"
        >
          💬
        </button>
      </header>

      {helpOpen && email && (
        <HelpModal email={email} onClose={() => setHelpOpen(false)} />
      )}

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
