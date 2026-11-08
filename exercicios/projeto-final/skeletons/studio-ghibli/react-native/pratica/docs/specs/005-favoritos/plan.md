# Plan 005 — Favoritos persistentes

Spec: [spec.md](spec.md)

## Arquivos
| Camada | Arquivo | O que faz |
|---|---|---|
| domain | `src/domain/favorites.ts` | `toggleFavorite(ids, id)`, `isFavorite(ids, id)` — funções puras |
| state | `src/state/favorites-store.ts` | Zustand + `persist` com `AsyncStorage` (chave `ghibli:favorites:v1`) |
| ui | `src/components/favorite-toggle.tsx` | botão de vidro animado, usado no detalhe |
| ui | `src/components/film-rail.tsx` | variante `favorites` da fileira (Spec 001) |
| ui | `src/app/favorites.tsx` | "Ver todos": grade completa de favoritos |

Persistimos **apenas IDs**; os dados do filme vêm do cache da query `['films']`.

## testIDs
`rail-favorites`, `tab-favorites`, `favorite-item-<id>`, `detail-favorite-button`, `item-card-fav-<id>`, `state-favorites-empty`
