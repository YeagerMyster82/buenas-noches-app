import "./globals.css";

export const metadata = {
  title: "Buenas Noches",
  description:
    "Rutinas adaptivas de sueño basadas en el perfil del sistema nervioso de tu hijo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Buenas Noches",
  },
  icons: {
    icon: "/brand/logo-buenas-noches.png",
    apple: "/brand/logo-buenas-noches.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f3044",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
