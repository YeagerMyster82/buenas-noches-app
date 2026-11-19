import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export const metadata = {
  title: "QuiroKids | Cursos para el sistema nervioso infantil",
  description:
    "Aprende a ayudar a tu hijo a regular su sistema nervioso con NeuroEsencia y Buenas Noches.",
};

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <Image
          src="/quirokids-logo-vertical.png"
          alt="QuiroKids"
          width={80}
          height={80}
          className={styles.navLogo}
        />
        <Link href="/login" className={styles.navLogin}>
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.heroTag}>PORTAL DE CURSOS</span>
        <h1 className={styles.heroTitle}>
          AYUDA A TU HIJO A REGULARSE
        </h1>
        <p className={styles.heroSub}>
          Cursos prácticos basados en neurología para padres que quieren acompañar a su hijo desde adentro.
        </p>
        <Link href="#cursos" className={styles.heroCta}>
          Ver cursos →
        </Link>
      </section>

      {/* Courses */}
      <section className={styles.courses} id="cursos">
        {/* NeuroEsencia */}
        <div className={styles.card}>
          <div className={styles.cardHeader} style={{ background: "var(--turquesa)" }}>
            <span className={styles.cardTag}>CURSO</span>
            <h2 className={styles.cardTitle}>NEUROESENCIA</h2>
            <p className={styles.cardTagline}>
              Reflejos primitivos: qué son, cómo evaluarlos y qué hacer cuando siguen presentes.
            </p>
          </div>
          <div className={styles.cardBody}>
            <ul className={styles.cardList}>
              <li>• Reflejo de Moro, ATNR, STNR, Galant y más</li>
              <li>• Cómo evaluar cada reflejo en casa</li>
              <li>• 20+ ejercicios por reflejo para integrarlos</li>
              <li>• Simetría cerebral y plan de acción</li>
            </ul>
            <div className={styles.cardPrice}>
              <span className={styles.priceLabel}>Acceso completo</span>
              <Link href="/checkout/neuroesencia" className={styles.cardCta}>
                Quiero este curso →
              </Link>
            </div>
          </div>
        </div>

        {/* Buenas Noches */}
        <div className={styles.card} data-theme="buenas-noches">
          <div className={styles.cardHeader} style={{ background: "var(--noche)" }}>
            <span className={styles.cardTag} style={{ color: "var(--arena)" }}>CURSO + APP</span>
            <Image
              src="/buenas-noches-logotipo.png"
              alt="Buenas Noches"
              width={180}
              height={48}
              className={styles.bnLogo}
            />
            <p className={styles.cardTagline} style={{ color: "var(--crema)" }}>
              18 actividades para calmar el sistema nervioso antes de dormir. Con guía minuto a minuto.
            </p>
          </div>
          <div className={styles.cardBody}>
            <ul className={styles.cardList}>
              <li>• Para niños de 3 a 8 años</li>
              <li>• Perfil de sueño personalizado</li>
              <li>• Ejercicios en el orden correcto para tu hijo</li>
              <li>• Temporizador y seguimiento de progreso</li>
            </ul>
            <div className={styles.cardPrice}>
              <span className={styles.priceLabel}>Curso + acceso a la app</span>
              <Link href="/checkout/buenas-noches" className={styles.cardCta}>
                Quiero este curso →
              </Link>
            </div>
          </div>
        </div>

        {/* Bundle */}
        <div className={styles.bundleCard}>
          <span className={styles.bundleTag}>MEJOR VALOR</span>
          <h2 className={styles.bundleTitle}>LOS DOS CURSOS</h2>
          <p className={styles.bundleSub}>
            NeuroEsencia + Buenas Noches. Todo lo que necesitas para acompañar el sistema nervioso de tu hijo.
          </p>
          <Link href="/checkout/bundle" className={styles.bundleCta}>
            Quiero el bundle →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <Image
          src="/quirokids-simbolo.png"
          alt="QuiroKids"
          width={32}
          height={32}
        />
        <p>© {new Date().getFullYear()} QuiroKids · <Link href="/login">Acceder a mis cursos</Link></p>
      </footer>
    </div>
  );
}
