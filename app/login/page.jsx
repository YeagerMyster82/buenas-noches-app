"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setLoading(true);
    try {
      const res = await fetch("/api/premium-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await res.json();

      if (data.hasAccess || data.premium_unlocked) {
        // Store email in sessionStorage and redirect to dashboard
        sessionStorage.setItem("qk_email", normalizedEmail);
        router.push("/dashboard");
      } else {
        setError("No encontramos una cuenta con ese email. ¿Compraste en otro correo?");
      }
    } catch {
      setError("Hubo un error. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/">
          <Image
            src="/quirokids-logo-vertical.png"
            alt="QuiroKids"
            width={80}
            height={80}
            className={styles.logo}
          />
        </Link>

        <h1 className={styles.title}>ACCEDER</h1>
        <p className={styles.sub}>Ingresa el email con el que compraste tu curso.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className={styles.input}
            autoComplete="email"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Verificando..." : "Entrar →"}
          </button>
        </form>

        <p className={styles.help}>
          ¿No tienes cuenta?{" "}
          <Link href="/#cursos">Ver los cursos</Link>
        </p>
      </div>
    </div>
  );
}
