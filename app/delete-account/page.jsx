export const metadata = {
  title: "Eliminar cuenta | Buenas Noches",
};

export default function DeleteAccountPage() {
  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px", fontFamily: "sans-serif", color: "#222" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Eliminar cuenta / Delete Account</h1>
      <p style={{ color: "#555", marginBottom: 32 }}>Buenas Noches: Sueño Infantil</p>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Cómo eliminar tu cuenta</h2>
      <ol style={{ lineHeight: 2, marginBottom: 32 }}>
        <li>Abre la app Buenas Noches en tu dispositivo.</li>
        <li>Ve a <strong>Configuración</strong> (ícono de perfil).</li>
        <li>Selecciona <strong>Eliminar cuenta</strong>.</li>
        <li>Confirma la eliminación.</li>
      </ol>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>How to delete your account</h2>
      <ol style={{ lineHeight: 2, marginBottom: 32 }}>
        <li>Open the Buenas Noches app on your device.</li>
        <li>Go to <strong>Settings</strong> (profile icon).</li>
        <li>Select <strong>Delete account</strong>.</li>
        <li>Confirm the deletion.</li>
      </ol>

      <p style={{ marginBottom: 8 }}>
        Al eliminar tu cuenta se borrarán permanentemente todos tus datos, incluyendo perfiles de niños e historial de suscripción.
      </p>
      <p style={{ marginBottom: 32, color: "#555" }}>
        Deleting your account permanently removes all your data, including children's profiles and subscription history.
      </p>

      <p>
        ¿Necesitas ayuda? / Need help?{" "}
        <a href="https://wa.link/10n15d" style={{ color: "#6C47FF" }}>
          Contáctanos por WhatsApp
        </a>
      </p>
    </main>
  );
}
