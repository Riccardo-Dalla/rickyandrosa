import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rosa & Riccardo Wedding",
    short_name: "R&R Wedding",
    description: "Rosa & Riccardo — June 19, 2027 — Bologna, Italy",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1614",
    theme_color: "#1A1614",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
