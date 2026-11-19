"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../lib/supabase-client";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const supabase = getSupabaseBrowserClient();

  function switchMode(m) {
    setMode(m);
    setError("");
    setMessage("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setMessage("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setError("Email o contraseña incorrectos.");
    } else {
      sessionStorage.setItem("qk_email", data.user.email);
      router.push("/dashboard");
    }
    setLoading(false);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError(""); setMessage("");
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setError(error.message);
    } else if (data.user && !data.session) {
      setMessage("Revisa tu email para confirmar tu cuenta.");
    } else {
      sessionStorage.setItem("qk_email", data.user.email);
      router.push("/dashboard");
    }
    setLoading(false);
  }

  async function handleForgot(e) {
    e.preventDefault();
    setError(""); setMessage("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );
    if (error) setError(error.message);
    else setMessage("¡Listo! Revisa tu bandeja de entrada.");
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logoWrap}>
          <Image
            src="/quirokids-logo-vertical.png"
            alt="QuiroKids"
            width={72}
            height={72}
            className={styles.logo}
          />
        </Link>

        {mode === "login" && (
          <form onSubmit={handleLogin} className={styles.form}>
            <h1 className={styles.title}>Bienvenida</h1>
            <p className={styles.sub}>Ingresa a tu cuenta QuiroKids</p>

            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className={styles.input}
              autoComplete="email"
            />

            <label className={styles.label}>Contraseña</label>
            <div className={styles.pwWrap}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={styles.input}
                autoComplete="current-password"
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)}>
                {showPw ? "Ocultar" : "Ver"}
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Entrando..." : "Entrar →"}
            </button>

            <button type="button" className={styles.textLink} onClick={() => switchMode("forgot")}>
              ¿Olvidaste tu contraseña?
            </button>

            <div className={styles.divider}><span>¿Primera vez aquí?</span></div>

            <button type="button" className={styles.btnSecondary} onClick={() => switchMode("signup")}>
              Crear cuenta
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} className={styles.form}>
            <h1 className={styles.title}>Crear cuenta</h1>
            <p className={styles.sub}>Usa el email con el que compraste tu curso</p>

            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className={styles.input}
            />

            <label className={styles.label}>Contraseña</label>
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
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Creando cuenta..." : "Crear cuenta →"}
            </button>

            <button type="button" className={styles.textLink} onClick={() => switchMode("login")}>
              ← Ya tengo cuenta
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className={styles.form}>
            <h1 className={styles.title}>Recuperar acceso</h1>
            <p className={styles.sub}>Te enviamos un enlace para crear una nueva contraseña</p>

            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Enviando..." : "Enviar enlace →"}
            </button>

            <button type="button" className={styles.textLink} onClick={() => switchMode("login")}>
              ← Volver
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
