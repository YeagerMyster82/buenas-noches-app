"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./success.module.css";

export default function CheckoutSuccess() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("qk_email");
    if (stored) setEmail(stored);
  }, []);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image src="/quirokids-simbolo.png" alt="QuiroKids" width={36} height={36} />
        </Link>
      </nav>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.title}>¡Listo! Tienes acceso.</h1>
          <p className={styles.body}>
            Tu pago fue procesado.{email ? ` Hemos activado el acceso para ${email}.` : ""}
          </p>
          <p className={styles.hint}>
            Si tienes problemas para acceder, escríbenos a{" "}
            <a href="mailto:hola@quirokids.com">hola@quirokids.com</a>.
          </p>
          <Link href="/dashboard" className={styles.btn}>
            Ir a mis cursos →
          </Link>
        </div>
      </div>
    </div>
  );
}
