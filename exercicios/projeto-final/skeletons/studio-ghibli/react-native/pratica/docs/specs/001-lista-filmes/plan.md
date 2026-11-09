# Plan 001 — Lista de filmes

Spec: [spec.md](spec.md)

## Arquivos
| Camada | Arquivo | O que faz |
|---|---|---|
| domain | `src/domain/film.ts` | tipo `Film` (camelCase) |
| domain | `src/domain/rails.ts` | `buildRails(films, favoriteIds, director)` → `{ slug, title, films }[]` na ordem da PDR 0004 — função pura |
| data | `src/data/ghibli-api.ts` | `fetchFilms()` com `fetch`, timeout e erro tipado |
| data | `src/data/mappers.ts` | `mapFilm(dto) → Film` (snake_case → camelCase, `rt_score` → number) |
| state | `src/state/use-films.ts` | `useQuery({ queryKey: ['films'], queryFn })` |
| ui | `src/app/index.tsx` | tela inicial (marca, busca, chips, fileiras) |
| ui | `src/components/film-rail.tsx` | fileira: título + `FlatList horizontal` |
| ui | `src/components/film-card.tsx` | pôster 2:3 com `expo-image` + nome + ★ indicadora |
| ui | `src/components/glass.tsx` | vidro: `GlassView` / `BlurView` / fallback opaco |
| ui | `src/components/states/*.tsx` | `LoadingState`, `ErrorState`, `EmptyState` (reutilizados pelas outras specs) |

## Modelo
```ts
type Film = {
  id: string; title: string; originalTitle: string; director: string;
  producer: string; releaseYear: number; runningTimeMin: number;
  rtScore: number; description: string; imageUrl: string; bannerUrl: string;
};
```

## testIDs
`rail-<slug>`, `item-card-<id>`, `item-card-title-<id>`, `item-card-fav-<id>`, `state-loading`, `state-error`, `retry-button`

## Riscos
- API gratuita pode cair no dia da apresentação → TanStack Query com `staleTime` alto + cache persistido (ver ADR 0004).
- Confirmar a URL usada pelo skeleton do professor.
