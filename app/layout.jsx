import "./globals.css";

export const metadata = {
  title: "QuiroKids | Portal",
  description:
    "Cursos y herramientas para ayudar a tu hijo a regular su sistema nervioso.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QuiroKids",
  },
  icons: {
    shortcut: "/icons/icon-192.png?v=20261119",
    icon: [
      { url: "/icons/icon-192.png?v=20261119", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=20261119", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=20261119",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5fafa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
