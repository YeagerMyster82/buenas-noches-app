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
        src: "/icons/buenas-noches-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icons/buenas-noches-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
