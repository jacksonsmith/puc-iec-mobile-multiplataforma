# Atividade 4 — PWA Offline-First (15 pts)

> **Disciplina:** Arquitetura Mobile Multiplataforma — PUC IEC 2026
> **Aula:** 4 (17/06/2026) | **Prazo:** 23/06/2026 23:59 | **Auto-grade:** ✅

## Objetivo

PWA com manifest válido, Service Worker (Workbox cache strategies), IndexedDB persistência, Background Sync e Lighthouse CI score ≥ 90.

## Estrutura esperada

```
exercicios/04-pwa-offline-first/aluno-<github-username>/
├── public/
│   ├── manifest.json            # nome + icons[]
│   └── service-worker.js (ou sw.js)
├── src/
│   ├── *.ts                     # código com Workbox + Dexie
│   └── ...
├── lighthouserc.{js,json}       # Lighthouse CI config
└── README.md
```

## Critérios

| # | Critério | Peso |
|---|----------|------|
| 1 | manifest.json válido (name + icons[]) | 3 |
| 2 | service-worker.js / sw.js presente | 3 |
| 3 | Workbox configurado | 2 |
| 4 | IndexedDB ou Dexie usado | 3 |
| 5 | Lighthouse CI config | 3 |
| 6 | README explicando estratégia de cache | 1 |

## Anexar vídeo

Mostre PWA funcionando em modo offline (DevTools → Network → Offline). ≤ 2min.
