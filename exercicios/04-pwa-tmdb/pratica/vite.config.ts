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
      // TODO 3 (parte 1): hoje o app se atualiza SOZINHO. Troque para o modo em que
      // o usuário decide quando atualizar (veja a tabela do slide "Nova versão").
      registerType: 'autoUpdate',
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
        // runtimeCaching: regras que o Service Worker aplica às requisições feitas
        // em tempo de execução (o precache acima cobre só os arquivos do build).
        runtimeCaching: [
          {
            // (a) API de filmes: dado muda (popularidade) → rede primeiro;
            // se a rede falhar ou demorar mais de 3 s, responde com o cache.
            urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tmdb-api',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 dia
              },
            },
          },
          {
            // (b) Pôsteres: imagem de uma URL nunca muda → cache primeiro.
            // Vêm de outra origem sem CORS → resposta opaca (status 0),
            // que o Workbox só guarda se liberarmos o status 0 explicitamente.
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
