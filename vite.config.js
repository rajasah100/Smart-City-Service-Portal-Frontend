import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// SEO: index.html ma live domain (__SITE_URL__) ra build ma robots.txt
// VITE_SITE_URL=https://example.com (live domain) .env/Vercel ma rakhda canonical, share image ra sitemap pura URL ma
const seoPlugin = (siteUrl) => ({
  name: "smart-city-seo",
  transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
  generateBundle() {
    const lines = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /department",
      "Disallow: /user",
      "Disallow: /complaint",
      "Disallow: /login",
      "Disallow: /register",
      "Disallow: /forgot-password",
      "Disallow: /reset-password",
      "Disallow: /api/",
    ];
    if (siteUrl) lines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
    this.emitFile({ type: "asset", fileName: "robots.txt", source: `${lines.join("\n")}\n` });
  },
});

export default defineConfig(({ mode }) => {
  const siteUrl = (loadEnv(mode, ".", "VITE_").VITE_SITE_URL || "").replace(/\/$/, "");

  return {
  plugins: [
    seoPlugin(siteUrl),
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        // SPA: refresh गर्दा सबै route मा index.html serve गर्ने (offline.html होइन)
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/firebase-messaging-sw\.js$/, /^\/sitemap\.xml$/, /^\/robots\.txt$/],
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
        name: "स्मार्ट सिटी सेवा पोर्टल",
        short_name: "Smart City",
        description: "अनलाइन गुनासो, सूचना, कार्यक्रम र आपतकालीन सहायता — Smart City Service Portal",
        lang: "ne",
        dir: "ltr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#003893",
        categories: ["government", "utilities", "news"],

        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          // Android ko golo/kuna wala icon (seto pristhabhumi, logo safe zone bhitra)
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],

        // Chrome ko install dialog ma dekhine screenshot
        screenshots: [
          { src: "screenshots/home-wide.jpg", sizes: "1280x720", type: "image/jpeg", form_factor: "wide", label: "स्मार्ट सिटी सेवा पोर्टल — गृहपृष्ठ" },
          { src: "screenshots/home-narrow.jpg", sizes: "390x844", type: "image/jpeg", form_factor: "narrow", label: "मोबाइलमा गृहपृष्ठ" },
        ],

        // App icon thichirakhda aaune chhito link
        shortcuts: [
          { name: "गुनासो दर्ता", short_name: "गुनासो", description: "File a complaint", url: "/complaint", icons: [{ src: "icon-192.png", sizes: "192x192" }] },
          { name: "आपतकालीन सहायता", short_name: "आपतकालीन", description: "Emergency help and SOS", url: "/emergency", icons: [{ src: "icon-192.png", sizes: "192x192" }] },
          { name: "सूचनाहरू", short_name: "सूचना", description: "Latest notices", url: "/notices", icons: [{ src: "icon-192.png", sizes: "192x192" }] },
          { name: "मेरो ड्यासबोर्ड", short_name: "ड्यासबोर्ड", description: "My complaints and notifications", url: "/user", icons: [{ src: "icon-192.png", sizes: "192x192" }] },
        ],
      },
    }),
  ],
  };
});
