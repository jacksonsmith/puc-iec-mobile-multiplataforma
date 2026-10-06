# README — Atividade 2 — Diego Cardoso Marques

## Identificação

- **Aluno:** Diego Cardoso Marques
- **Opção Reanimated escolhida:** A — Heart pop
- **Bonus implementado:** Bottom Tabs com aba Favoritos · TanStack Query `staleTime` + `prefetchQuery` · Hermes (padrão do SDK 54)
- **Repo (seu fork):** https://github.com/D2Diego/puc-iec-mobile-multiplataforma/tree/entrega/atividade-2-diego-marques/exercicios/02-app-rn-navegacao-estado/diego-marques

## Como rodar

```bash
npm install
cp .env.example .env   # colar o token TMDB em EXPO_PUBLIC_TMDB_TOKEN
npx expo start
```

```bash
npm test               # 14 testes Jest (counter + favorites + persistência)
```

> ⚠️ **MMKV precisa de módulo nativo.** No **Expo Go** ele não existe: o app roda normalmente, mas os favoritos ficam só em memória (aviso no console). Para persistir de verdade entre reloads, use um development build: `npx expo run:android` (ou `run:ios`). Na **web**, o storage cai automaticamente para `localStorage`.

## O que o app faz

Lista os filmes populares da TMDB (TanStack Query, cache de 5 min) e permite favoritar cada filme com um ❤️ que faz um "pop" animado com Reanimated (escala + rotação com mola, rodando na UI thread). Os favoritos ficam numa store Zustand persistida com MMKV e aparecem na aba **Favoritos**, que continua preenchida depois de fechar e reabrir o app.

## Arquitetura

```
src/
├── routes/
│   ├── RootStack.tsx          ← Stack: Home (tabs) + Detail
│   └── HomeTabs.tsx           ← bonus: Bottom Tabs Filmes / Favoritos
├── screens/
│   ├── MovieList.tsx
│   ├── MovieDetail.tsx
│   └── Favorites.tsx          ← bonus: lista persistida
├── components/
│   ├── MovieCard.tsx          ← prefetch do detalhe antes de navegar
│   ├── HeartButton.tsx        ← animação Reanimated (opção A)
│   └── TokenMissingScreen.tsx
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts      ← Zustand + persist via subscribe + MMKV
├── queries/movies/            ← TanStack Query (popular, by-id, search)
├── services/api.ts            ← axios + token TMDB
└── storage/
    └── mmkv.ts                ← MMKV (nativo) / localStorage (web) / memória (Expo Go)
```

## Decisões técnicas

- **Opção A (heart pop):** o feedback fica no próprio elemento que o usuário tocou. `withSequence(withTiming(1.4), withSpring(1))` dá o "estouro" rápido e o assentamento elástico; a rotação em paralelo usa um segundo `useSharedValue`. O estilo é um worklet (`useAnimatedStyle`), então a animação não depende da JS thread.
- **MMKV em vez de AsyncStorage:** a leitura é **síncrona** via JSI. Por isso a store já nasce hidratada (`ids: loadInitial()`), sem lista vazia piscando na primeira renderização. Com AsyncStorage (ou o middleware `persist`) a hidratação seria assíncrona.
- **Persistência via `subscribe` em vez do middleware `persist`:** segue o starter e deixa explícito quando o save acontece. O listener compara `state.ids === prev.ids` para só gravar quando os favoritos mudam.
- **Store guarda só ids:** a aba Favoritos busca os filmes com `useQueries` usando a mesma `queryKey` (`['movie', id]`) do detalhe e do prefetch, então tudo compartilha um único cache.
- **Versões alinhadas ao Expo SDK 54** (`npx expo install --fix`): o starter vinha com Reanimated 3.16, incompatível com RN 0.81 / Expo Go SDK 54, que traz Reanimated 4.1 + `react-native-worklets`.

## Referência

- Reanimated — *Your first animation* / `useSharedValue`, `useAnimatedStyle`, `withSpring`: https://docs.swmansion.com/react-native-reanimated/
- MMKV: https://github.com/mrousavy/react-native-mmkv · Zustand: https://github.com/pmndrs/zustand · TanStack Query (prefetching): https://tanstack.com/query/latest/docs/framework/react/guides/prefetching

---

## 🎁 Bonus implementado

- [x] **Bottom Tabs com aba Favoritos filtrada — +2pt** — `src/routes/HomeTabs.tsx`, `src/screens/Favorites.tsx` (badge com a contagem, botão "Limpar")
- [ ] Deep link `expo://detail/<id>` — +1pt
- [ ] 2 das 3 opções Reanimated (A/B/C) — +1pt
- [x] TanStack Query `staleTime` + `prefetchQuery` — +1pt — `staleTime` 5 min global em `App.tsx`, 10 min no detalhe; `prefetchMovieById` chamado no `onPress` do `MovieCard`
- [x] Hermes habilitado — padrão no Expo SDK 54 (o `expo export` gera bytecode `.hbc`)
- [x] Testes Jest verdes — 14 testes (`npm test`)

```ts
// src/components/MovieCard.tsx
const openDetail = () => {
  prefetchMovieById(queryClient, movie.id); // não aguarda: navega já
  navigation.navigate('Detail', { id: movie.id, title: movie.title });
};
```
