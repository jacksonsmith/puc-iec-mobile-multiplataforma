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
      // TODO 3 (parte 1): o usuário decide quando atualizar.
      // 'prompt' mantém a nova versão em "waiting" até o UpdatePrompt chamar
      // updateServiceWorker(true) — evitando recarregar a página no meio de um uso.
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
        // TODO 2 — runtimeCaching: duas regras, uma para a API e outra para as imagens.
        //
        // (a) API (api.themoviedb.org): NetworkFirst — tenta a rede e, se demorar
        //     mais de 3s ou falhar (offline), serve a última resposta do cache.
        //     É o comportamento certo para dados que mudam (lista de populares).
        //
        // (b) Pôsteres (image.tmdb.org): CacheFirst — imagem não muda, então
        //     serve do cache na hora e só busca na rede se ainda não tiver.
        //     As imagens vêm de outra origem sem CORS, logo a resposta é opaca
        //     (status 0): por isso o cacheableResponse libera [0, 200].
        //
        // Referências: slides "Cache strategies" e "vite-plugin-pwa" · web.dev/learn/pwa
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 dia
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
              },
              // Respostas opacas (cross-origin sem CORS) têm status 0.
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
