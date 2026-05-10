# Atividade 4 — Aluno: jacksonsmith (teste)

PWA com:
- Manifest válido
- Service Worker (Workbox cache strategies)
- IndexedDB (Dexie)
- Lighthouse CI configurado

## Estratégia de cache
- Imagens: Cache-first (estáticas, versionadas)
- API feed: Stale-While-Revalidate (atualidade + velocidade percebida)
