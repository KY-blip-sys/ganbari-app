import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// 開発/プレビュー時のみ api/config.js (Vercel Serverless Function) の代わりに
// /api/config を返すミドルウェア。.env.local の SUPABASE_URL / SUPABASE_KEY を使う。
// 本番ビルドやVercel上のデプロイには一切影響しない。
function localSupabaseConfigApi(env) {
  const handler = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(
      JSON.stringify({
        supabaseUrl: env.SUPABASE_URL ?? "",
        supabaseAnonKey: env.SUPABASE_KEY ?? "",
      })
    );
  };
  return {
    name: "local-supabase-config-api",
    configureServer(server) {
      server.middlewares.use("/api/config", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/config", handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      outDir: "dist",
    },
    plugins: [
      localSupabaseConfigApi(env),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon-16.png",
          "favicon-32.png",
          "apple-touch-icon.png",
        ],
        manifest: {
          name: "人生RPG",
          short_name: "人生RPG",
          description: "頑張りを可視化するアプリ",
          lang: "ja",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          theme_color: "#0a0e1a",
          background_color: "#0a0e1a",
          icons: [
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icon-512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg,ico,webmanifest}"],
          navigateFallback: "/index.html",
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname === "/api/config",
              handler: "NetworkOnly",
            },
            {
              urlPattern: /^https:\/\/esm\.sh\//,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "esm-cdn-cache",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /^https:\/\/pagead2\.googlesyndication\.com\//,
              handler: "NetworkOnly",
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
  };
});
