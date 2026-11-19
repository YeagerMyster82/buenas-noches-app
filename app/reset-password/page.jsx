"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase-client";
import styles from "../login/login.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError("Mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) sessionStorage.setItem("qk_email", data.user.email);
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logoWrap}>
          <Image src="/quirokids-logo-vertical.png" alt="QuiroKids" width={72} height={72} className={styles.logo} />
        </Link>

        <h1 className={styles.title}>Nueva contraseña</h1>
        <p className={styles.sub}>Elige una contraseña segura para tu cuenta</p>

        {!ready ? (
          <p style={{ fontSize: 14, color: "var(--tinta-muted)", textAlign: "center" }}>
            Verificando enlace…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>Nueva contraseña</label>
            <div className={styles.pwWrap}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className={styles.input}
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)}>
                {showPw ? "Ocultar" : "Ver"}
              </button>
            </div>

            <label className={styles.label}>Confirmar contraseña</label>
            <input
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              required
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Guardando..." : "Guardar contraseña →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
