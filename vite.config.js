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

      workbox: {
        navigateFallback: "/offline.html",

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
            },
          },
        ],
      },

      manifest: {
        id: "/",
        name: "Smart City Service Portal",
        short_name: "Smart City",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],

        shortcuts: [
          {
            name: "File Complaint",
            short_name: "Complaint",
            description: "Submit a complaint",
            url: "/complaint",
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Emergency",
            short_name: "Emergency",
            description: "Emergency Services",
            url: "/emergency",
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Notices",
            short_name: "Notices",
            description: "Latest Notices",
            url: "/notices",
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Citizen Dashboard",
            url: "/user",
            icons: [
              {
                src: "icon-192.png",
                sizes: "192x192",
              },
            ],
          },
        ],
      },
    }),
  ],
});
