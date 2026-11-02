import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
/// <reference types="vitest" />

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/**', 'node_modules/**'],
  },
  plugins: [
    react(),
    VitePWA({
      // TODO 3 (parte 1): com 'prompt', o Service Worker novo fica em "waiting" até o
      // usuário clicar em Atualizar no <UpdatePrompt />. Com 'autoUpdate' ele assumiria
      // sozinho e recarregaria a página no meio do uso.
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'TMDB Popular Movies',
        short_name: 'TMDB Movies',
        description: 'Filmes populares do The Movie Database — funciona offline',
        theme_color: '#01b4e4',
        background_color: '#0d253f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // TODO 2 — runtimeCaching: regras para as requisições que o precache não cobre.
        // O globPatterns acima só guarda o "app shell" (JS, CSS, HTML, ícones) do build;
        // dados da API e pôsteres vêm de outros hosts, em tempo de execução.
        runtimeCaching: [
          {
            // (a) API: a lista de populares muda, então a rede vem primeiro. Se a rede
            // falhar ou demorar mais de 3 s, serve a última resposta guardada.
            urlPattern: ({ url }) => url.origin === 'https://api.themoviedb.org',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // (b) Pôsteres: vêm de image.tmdb.org (outro host) e não mudam, então o
            // cache vem primeiro e a rede só é usada na primeira vez.
            urlPattern: ({ url }) => url.origin === 'https://image.tmdb.org',
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              // <img> de outra origem sem CORS chega como resposta opaca (status 0).
              // O CacheFirst só guarda status 200 por padrão; aqui o 0 é liberado.
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
