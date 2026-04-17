import "./globals.css";

export const metadata = {
  title: "Buenas Noches",
  description:
    "Rutinas adaptivas de sueño basadas en el perfil del sistema nervioso de tu hijo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
