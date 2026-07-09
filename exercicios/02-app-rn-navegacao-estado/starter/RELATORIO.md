# README — Atividade 2 — Leandro

## Identificação

- **Aluno:** Leandro
- **Opção Reanimated escolhida:** **A — Heart pop** (escala spring 1 → 1.4 → 1.0 + rotação leve, worklet puro na UI thread)
- **Bonus implementado:** TanStack Query com `staleTime` configurado (5 min); HeartButton reusado em `MovieList` e `MovieDetail`
- **Repo (seu fork):** _preencher com a URL do seu fork_

## Como rodar

```bash
npm install
cp .env.example .env   # cole seu EXPO_PUBLIC_TMDB_TOKEN
npx expo start         # i = iOS, a = Android
```

> ⚠️ MMKV precisa de JSI nativo. Em **web** o storage cai num polyfill (`localStorage`),
> e a animação Reanimated tem limitações — prefira simulador **iOS/Android**.

## O que o app faz

Lista filmes populares da TMDB (TanStack Query com cache + `staleTime` 5 min).
Cada card tem um ❤️ que faz toggle de favorito via Zustand (`useFavoritesStore`),
persistido com **MMKV** — favoritos **sobrevivem a reloads** do app. Tocar no ❤️
dispara uma animação Reanimated ("heart pop") rodando 100% na UI thread.

## Screenshot

![Lista com favoritos](../screenshot.png)

> ✅ `MovieList` com ❤️ ativo em [`../screenshot.png`](../screenshot.png).

## Screencast da animação

![Animação Reanimated](../screencast.gif)

> ✅ GIF da animação "heart pop" em [`../screencast.gif`](../screencast.gif).

## Arquitetura

```
src/
├── routes/
│   └── RootStack.tsx
├── screens/
│   ├── MovieList.tsx          ← FlatList + MovieCard
│   └── MovieDetail.tsx        ← HeartButton no header
├── components/
│   ├── MovieCard.tsx          ← isFavorite + toggle
│   └── HeartButton.tsx        ← animação Reanimated (opção A)
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts      ← Zustand + persist manual via MMKV
├── queries/movies/            ← TanStack Query
│   ├── get-popular-movies.ts
│   ├── get-movie-by-id.ts
│   └── search-movies.ts
└── storage/
    └── mmkv.ts                ← adapter síncrono (nativo / web / fallback memória)
```

## Decisões técnicas

- **Reanimated opção A:** `withSequence(withTiming(1.4), withSpring(1))` para a escala +
  `withSequence` na rotação. Worklets em `useAnimatedStyle` mantêm a animação na UI thread
  (sem cruzar a bridge / sem re-render React), garantindo 60fps mesmo sob carga JS.
- **MMKV vs AsyncStorage:** MMKV é **síncrono** (C++ via JSI), ~30x mais rápido, então o
  estado inicial do store é lido de forma síncrona (`loadInitial()`), sem flash de "lista
  vazia" no boot. Persistência é feita via `subscribe` manual em vez do middleware
  `persist`/`devtools` — este último usa `import.meta.env` (Vite-style) e quebra no Metro
  web bundler; o `subscribe` deixa explícito o momento do save.
- **Adapter de storage resiliente:** em web usa `localStorage`; sem JSI (Jest/node) cai num
  `Map` em memória — assim os testes rodam sem precisar mockar o módulo nativo.
- **Seletores derivados:** `useFavoritesStore((s) => s.ids.includes(movie.id))` re-renderiza
  o card apenas quando a presença daquele id muda, não a cada mudança da lista inteira.

## Testes

```bash
npm test
# 2 suites, 9 testes verdes (4 counter + 5 favorites) — CI exige ≥ 6.
```

## Referência

- [React Native Reanimated — Fundamentals (worklets, shared values, animations)](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)

## 🎁 Bonus

- [x] TanStack Query com `staleTime` configurado (5 min) em `usePopularMovies`
- [x] CI GitHub Actions verde (9 testes ≥ 6)
- [ ] Bottom Tabs com aba Favoritos — não implementado
- [ ] Deep link `expo://detail/<id>` — não implementado
