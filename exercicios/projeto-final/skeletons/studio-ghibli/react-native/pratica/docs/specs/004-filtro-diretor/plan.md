# Plan 004 — Filtro por diretor

Spec: [spec.md](spec.md)

## Arquivos
| Camada | Arquivo | O que faz |
|---|---|---|
| domain | `src/domain/directors.ts` | `getDirectors(films) → { name, slug, count }[]`, `slugify(name)` |
| domain | `src/domain/filter.ts` | parte `director` de `filterFilms` (ver Plan 003) |
| state | `src/state/film-filters-store.ts` | `director: string \| null` |
| ui | `src/components/director-chips.tsx` | `ScrollView` horizontal de chips |

## testIDs
`category-chip-all`, `category-chip-<slug>`
