# Plan 002 — Detalhe do filme

Spec: [spec.md](spec.md)

## Arquivos
| Camada | Arquivo | O que faz |
|---|---|---|
| domain | `src/domain/format.ts` | `formatRuntime(min)`, `formatScore(n)` |
| data | `src/data/ghibli-api.ts` | `fetchFilm(id)` |
| state | `src/state/use-film.ts` | `useQuery(['film', id])` com `initialData` vindo do cache `['films']` |
| ui | `src/app/film/[id].tsx` | tela de detalhe (Stack, fora das tabs) |
| ui | `src/components/favorite-toggle.tsx` | botão ★ compartilhado com o card |

## testIDs
`film-detail`, `film-detail-title`, `film-detail-director`, `favorite-toggle-<id>`
