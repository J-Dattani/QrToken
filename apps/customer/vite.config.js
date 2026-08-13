import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "QRToken",
        short_name: "QRToken",
        description: "QR-based ordering and token management",
        theme_color: "#6F4E37",
        background_color: "#F8F3ED",
        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,            // Exposes the server to the local network/tunnel
 allowedHosts: [".trycloudflare.com"] 
  }
});
