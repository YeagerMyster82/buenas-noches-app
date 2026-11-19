export default function manifest() {
  return {
    name: "QuiroKids",
    short_name: "QuiroKids",
    description: "Cursos y herramientas para ayudar a tu hijo a regular su sistema nervioso.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9ecfd2",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png?v=20261119",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png?v=20261119",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
