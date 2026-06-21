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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
