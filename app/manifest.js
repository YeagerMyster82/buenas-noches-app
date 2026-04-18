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
        src: "/brand/logo-buenas-noches.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/logo-buenas-noches.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
