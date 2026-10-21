# README — Atividade 2 — Daniel Silveira Moreira

## Identificação

- **Aluno:** Daniel Silveira Moreira
- **Opção Reanimated escolhida:** A — Heart pop
- **Bonus implementado:** TanStack Query com `staleTime` de 5 min em `usePopularMovies` (sem `prefetchQuery`); Hermes (padrão do Expo SDK 54)
- **Repo (seu fork):** https://github.com/DanielSilveiraM/puc-iec-mobile-multiplataforma

## Como rodar

```bash
npm install
cp .env.example .env   # colar o token da TMDB em EXPO_PUBLIC_TMDB_TOKEN
npx expo start
```

> ⚠️ O `react-native-mmkv` v3 usa JSI e **não roda no Expo Go**. No celular/emulador é preciso um development build (`npx expo run:android` ou `npx expo run:ios`). Na **web** (`w` no menu do Expo) o próprio MMKV v3 usa `localStorage` por baixo, então os favoritos também persistem entre reloads.

Testes:

```bash
npm test
```

## O que o app faz

Lista os filmes populares da TMDB (TanStack Query com cache de 5 min) e abre o detalhe de cada um. Em cada card e no detalhe há um ❤️ que favorita ou desfavorita o filme. Os favoritos ficam num store Zustand e são salvos no MMKV a cada mudança, então sobrevivem a reloads do app. O ❤️ faz um "pop" (escala 1 → 1.4 → 1 com spring e uma leve rotação) animado com Reanimated na UI thread.

## Arquitetura

```
src/
├── routes/
│   └── RootStack.tsx
├── screens/
│   ├── MovieList.tsx         ← FlatList + contador de favoritos
│   └── MovieDetail.tsx       ← HeartButton no detalhe
├── components/
│   ├── MovieCard.tsx         ← lê isFavorite/toggle do store
│   ├── HeartButton.tsx       ← animação Reanimated (opção A)
│   └── TokenMissingScreen.tsx
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts     ← Zustand + persistência MMKV via subscribe
├── storage/
│   └── mmkv.ts               ← instância MMKV + adapter getItem/setItem/removeItem
├── queries/movies/           ← TanStack Query
├── services/api.ts           ← axios + interceptors TMDB
└── ...
__tests__/
├── counterStore.test.ts      ← 4 testes
└── favoritesStore.test.ts    ← 7 testes (inclui persistência no MMKV)
```

## Decisões técnicas

- **Reanimated opção A (heart pop):** é o feedback mais direto da ação de favoritar. `scale` e `rotation` são `useSharedValue` e o `useAnimatedStyle` é um worklet executado na UI thread, então a animação continua fluida mesmo com a JS thread ocupada (por exemplo, rolando a lista).
- **MMKV em vez de AsyncStorage:** o MMKV é síncrono (C++ via JSI). Por isso o store já nasce com os favoritos salvos (`loadInitial()`), sem hidratação assíncrona e sem o ❤️ "piscar" vazio na abertura.
- **Persistência via `subscribe` em vez do middleware `persist`:** segue a orientação do starter (o middleware quebrava no bundler web do Metro) e deixa explícito quando o save acontece. Só grava quando o array `ids` muda.
- **Trade-off:** o MMKV exige development build no celular (não roda no Expo Go), o que aumenta o setup em troca de desempenho.

## Referência

- Software Mansion. *React Native Reanimated — documentação oficial*. https://docs.swmansion.com/react-native-reanimated/
- Rousavy, M. *react-native-mmkv*. https://github.com/mrousavy/react-native-mmkv

---

## 🎁 Bonus implementado (opcional)

- [ ] Bottom Tabs com aba Favoritos filtrada — +2pt
- [ ] Deep link `expo://detail/<id>` — +1pt
- [ ] 2 das 3 opções Reanimated (A/B/C) — +1pt
- [ ] TanStack Query `staleTime` + `prefetchQuery` — +1pt (só `staleTime` feito)
- [x] Hermes habilitado — padrão do Expo SDK 54 (`newArchEnabled: true` em `app.json`)
- [x] 11 testes Jest verdes (`npm test`)
