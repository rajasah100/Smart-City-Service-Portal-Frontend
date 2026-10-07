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
        // SPA: refresh गर्दा सबै route मा index.html serve गर्ने (offline.html होइन)
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/firebase-messaging-sw\.js$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
            },
          },

          // Emergency page ko public data: internet nabhaye pachhillo data dekhaune
          {
            urlPattern: ({ url, request }) =>
              request.method === "GET" &&
              /^\/api\/(departments|emergency-services|notices)(\/|$|\?)/.test(
                url.pathname,
              ),
            handler: "NetworkFirst",
            options: {
              cacheName: "public-api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // Map tiles (OpenStreetMap)
          {
            urlPattern: ({ url }) => url.hostname.endsWith("tile.openstreetmap.org"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "map-tiles-cache",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
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
            icons: [{ src: "icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Emergency",
            short_name: "Emergency",
            description: "Emergency Services",
            url: "/emergency",
            icons: [{ src: "icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Notices",
            short_name: "Notices",
            description: "Latest Notices",
            url: "/notices",
            icons: [{ src: "icon-192.png", sizes: "192x192" }],
          },
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Citizen Dashboard",
            url: "/user",
            icons: [{ src: "icon-192.png", sizes: "192x192" }],
          },
        ],
      },
    }),
  ],
});
