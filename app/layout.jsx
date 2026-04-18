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
    shortcut: "/icons/icon-192.png?v=20260418",
    icon: [
      { url: "/icons/icon-192.png?v=20260418", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=20260418", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=20260418",
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
