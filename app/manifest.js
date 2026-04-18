export default function manifest() {
  return {
    name: "Buenas Noches",
    short_name: "Buenas Noches",
    description: "Rutinas adaptivas para dormir mejor, diseñadas para el sistema nervioso de tu hijo.",
    start_url: "/",
    display: "standalone",
    background_color: "#1f3044",
    theme_color: "#1f3044",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
