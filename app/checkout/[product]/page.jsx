"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./checkout.module.css";

const PRODUCT_INFO = {
  neuroesencia: {
    name: "NeuroEsencia",
    tagline: "Reflejos primitivos: evalúa, comprende e integra",
    includes: [
      "10 módulos con videos paso a paso",
      "Reflejo de Moro, ATNR, STNR, Galant y más",
      "Cómo evaluar cada reflejo en casa",
      "20+ ejercicios por reflejo",
      "Simetría cerebral y plan de acción",
    ],
    theme: "day",
    color: "var(--turquesa)",
  },
  "buenas-noches": {
    name: "Buenas Noches",
    tagline: "Curso + App para que tu hijo se duerma más rápido",
    includes: [
      "Video-curso completo con 18 actividades",
      "Perfil de sueño personalizado para tu hijo",
      "App con guía minuto a minuto",
      "Ejercicios en el orden correcto",
      "Seguimiento de progreso",
    ],
    theme: "night",
    color: "var(--noche)",
    logo: "/buenas-noches-logotipo.png",
  },
  bundle: {
    name: "Bundle: Los dos cursos",
    tagline: "NeuroEsencia + Buenas Noches — todo lo que necesitas",
    includes: [
      "Acceso completo a NeuroEsencia",
      "Acceso completo a Buenas Noches + App",
      "El mejor precio por los dos juntos",
    ],
    theme: "day",
    color: "var(--tinta)",
  },
};

export default function CheckoutPage({ params }) {
  const { product } = use(params);
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const info = PRODUCT_INFO[product];

  useEffect(() => {
    const stored = sessionStorage.getItem("qk_email");
    if (stored) setEmail(stored);
  }, []);

  if (!info) {
    return (
      <div className={styles.notFound}>
        <p>Producto no encontrado.</p>
        <Link href="/">← Volver</Link>
      </div>
    );
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product, email: normalizedEmail }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al iniciar el pago. Inténtalo de nuevo.");
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const isNight = info.theme === "night";

  return (
    <div className={styles.page} data-theme={isNight ? "buenas-noches" : undefined}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src={isNight ? "/quirokids-simbolo-blanco.png" : "/quirokids-simbolo.png"}
            alt="QuiroKids"
            width={36}
            height={36}
          />
        </Link>
        <Link href="/" className={styles.backLink}>← Volver</Link>
      </nav>

      <div className={styles.content}>
        {/* Product card */}
        <div className={styles.productCard} style={{ "--hero-color": info.color }}>
          <div className={styles.productHero} style={{ background: info.color }}>
            {info.logo ? (
              <Image src={info.logo} alt={info.name} width={180} height={46} style={{ objectFit: "contain" }} />
            ) : (
              <h1 className={styles.productName}
                style={{ color: isNight || product === "bundle" ? "var(--crema)" : "var(--tinta)" }}>
                {info.name.toUpperCase()}
              </h1>
            )}
            <p className={styles.productTagline}
              style={{ color: isNight || product === "bundle" ? "var(--arena)" : "var(--tinta-muted)" }}>
              {info.tagline}
            </p>
          </div>

          <div className={styles.productBody}>
            <p className={styles.includesLabel}>QUÉ INCLUYE</p>
            <ul className={styles.includesList}>
              {info.includes.map((item, i) => (
                <li key={i}>
                  <span className={styles.bullet}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Checkout form */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>COMPRAR AHORA</h2>

          {cancelled && (
            <p className={styles.cancelledNote}>
              El pago fue cancelado. Puedes intentarlo de nuevo.
            </p>
          )}

          <form onSubmit={handleCheckout} className={styles.form}>
            <label className={styles.label}>Tu email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className={styles.input}
              autoComplete="email"
            />
            <p className={styles.inputHint}>
              Usaremos este email para darte acceso al curso.
            </p>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Redirigiendo a pago..." : "Continuar al pago →"}
            </button>
          </form>

          <div className={styles.paymentLogos}>
            <span className={styles.paymentNote}>Pago seguro con</span>
            <span className={styles.paymentBadge}>Stripe</span>
            <span className={styles.paymentBadge}>Visa / MC</span>
            <span className={styles.paymentBadge}>PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
