# Filmes Favoritos — Diego Cardoso Marques

App React Native (Expo SDK 54) que lista os filmes populares da TMDB, permite favoritar com uma animação feita em Reanimated e mantém os favoritos salvos entre aberturas do app.

- **Aluno:** Diego Cardoso Marques
- **Animação Reanimated:** opção A, heart pop
- **Extras:** Bottom Tabs com aba Favoritos, `staleTime` + `prefetchQuery` no TanStack Query, Hermes (padrão do SDK 54)

## Como rodar

```bash
npm install
cp .env.example .env
npx expo start
```

No `.env`, preencha `EXPO_PUBLIC_TMDB_TOKEN` com a API Key (v3) ou o API Read Access Token (v4) da TMDB.

```bash
npm test
```

O MMKV depende de módulo nativo. No Expo Go o app funciona, mas os favoritos ficam apenas em memória. Para persistência real use um development build (`npx expo run:android` ou `npx expo run:ios`). Na web o armazenamento usa `localStorage`.

## Funcionalidades

- Lista de filmes populares com pull-to-refresh e cache de 5 minutos.
- Favoritar e desfavoritar pela lista ou pela tela de detalhe, com animação de escala e rotação executada na UI thread.
- Aba Favoritos com contador na tab bar e ação para limpar a lista.
- Favoritos persistidos com MMKV e restaurados de forma síncrona ao abrir o app.
- Prefetch do detalhe do filme no toque, antes da navegação.
- Telas de erro com ação de tentar novamente.

## Arquitetura

```
App.tsx
src/
├── routes/
│   ├── RootStack.tsx
│   └── HomeTabs.tsx
├── screens/
│   ├── MovieList.tsx
│   ├── MovieDetail.tsx
│   └── Favorites.tsx
├── components/
│   ├── MovieCard.tsx
│   ├── HeartButton.tsx
│   ├── ErrorState.tsx
│   └── TokenMissingScreen.tsx
├── queries/movies/
│   ├── get-popular-movies.ts
│   └── get-movie-by-id.ts
├── store/
│   ├── favoritesStore.ts
│   └── counterStore.ts
├── storage/
│   └── mmkv.ts
├── services/
│   ├── api.ts
│   └── query-client.ts
├── types/
│   └── movie.ts
└── utils/
    └── poster-url.ts
__tests__/
├── favoritesStore.test.ts
└── counterStore.test.ts
```

| Camada | Responsabilidade |
|---|---|
| `services` | HTTP (axios + token TMDB) e configuração do `QueryClient` |
| `queries` | Estado do servidor: chaves de cache, `useQuery`, `useQueries`, prefetch |
| `store` | Estado do cliente com Zustand |
| `storage` | Adapter de armazenamento: MMKV no nativo, `localStorage` na web, memória como fallback |
| `components` / `screens` | UI; screens consomem queries e stores, não fazem HTTP |
| `routes` | Stack (Home + Detail) com Bottom Tabs (Filmes + Favoritos) dentro da Home |

## Decisões técnicas

- **Heart pop (opção A):** o feedback acontece no próprio elemento tocado. `withSequence(withTiming(1.4), withSpring(1))` controla a escala e um segundo shared value controla a rotação. O estilo é calculado em `useAnimatedStyle`, um worklet que roda na UI thread.
- **MMKV em vez de AsyncStorage:** leitura síncrona via JSI. A store nasce com `ids: loadInitial()`, sem estado vazio intermediário nem lógica de hidratação assíncrona.
- **Persistência via `subscribe`:** o save é explícito e só ocorre quando `ids` muda (`state.ids !== prev.ids`).
- **Store guarda apenas ids:** os dados dos filmes vêm do TanStack Query com a mesma chave (`['movie', id]`) usada no detalhe, nos favoritos e no prefetch, compartilhando um único cache.
- **Dependências alinhadas ao Expo SDK 54** com `npx expo install --fix` (Reanimated 4.1 + `react-native-worklets`).

## Testes

14 testes Jest cobrindo `counterStore` (increment, decrement, reset, sequência longa) e `favoritesStore` (add, remove, toggle, clear, isFavorite, idempotência, gravação no storage, restauração após recriar a store e storage corrompido).

## Referências

- Reanimated: https://docs.swmansion.com/react-native-reanimated/
- MMKV: https://github.com/mrousavy/react-native-mmkv
- Zustand: https://github.com/pmndrs/zustand
- TanStack Query (prefetching): https://tanstack.com/query/latest/docs/framework/react/guides/prefetching
