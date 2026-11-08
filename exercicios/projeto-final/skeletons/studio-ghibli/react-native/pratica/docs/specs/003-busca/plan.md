# Plan 003 — Busca por título

Spec: [spec.md](spec.md)

## Arquivos
| Camada | Arquivo | O que faz |
|---|---|---|
| domain | `src/domain/filter.ts` | `normalize(text)` e `filterFilms(films, { query, director })` — **compartilhado com a Spec 004** |
| state | `src/state/use-film-filters.ts` | estado `query` + `director` (Zustand, sem persistência) |
| ui | `src/components/search-bar.tsx` | `TextInput` com botão limpar |

`filterFilms` é a única fonte de verdade da filtragem; a tela só aplica `useMemo(() => filterFilms(...))`.

## testIDs
`search-input`, `search-clear`, `state-empty`
