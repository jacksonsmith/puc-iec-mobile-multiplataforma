# README — Atividade 2 — Samuel Lima

## Identificação

- **Aluno:** Samuel Lima
- **Opção Reanimated escolhida:** A — Heart pop (+ C — poster que cresce com `withSpring` no detalhe, como bônus)
- **Bonus implementado:** Bottom Tabs com aba Favoritos, 2 opções Reanimated (A + C), `staleTime` + `prefetchQuery`, paginação infinita, Hermes explícito no `app.json`
- **Repo (seu fork):** https://github.com/SamuelMachadoLima/puc-iec-mobile-multiplataforma

## Como rodar

```bash
npm install
cp .env.example .env   # colar o token da TMDB
npx expo start
```

```bash
npm test               # 16 testes Jest (6 counter + 10 favorites)
```

> ⚠️ O MMKV precisa do módulo nativo (JSI). No **Expo Go** ele não existe: o app continua rodando, mas cai num storage em memória (avisa no console) e os favoritos não sobrevivem ao reload. Para ver a persistência real no celular/emulador use um development build (`npx expo run:android` / `npx expo run:ios`). No **web** o mesmo adapter usa `localStorage`, e a persistência funciona.

## O que o app faz

Lista os filmes populares da TMDB (TanStack Query, com rolagem infinita) e deixa favoritar cada um pelo ❤️, na lista ou no detalhe. Os favoritos ficam num store Zustand (`useFavoritesStore`), que é salvo no MMKV a cada mudança e lido de volta de forma síncrona quando o app abre. A aba **Favoritos** mostra a lista persistida, com badge de contagem e um botão "Limpar tudo". Ao tocar no coração, ele dá um "pop" (escala 1 → 1.4 → 1 com spring + uma leve sacudida) animado na UI thread.

## Arquitetura

```
src/
├── routes/
│   └── RootStack.tsx         ← Stack (Detail) + Bottom Tabs (Filmes / Favoritos)
├── screens/
│   ├── MovieList.tsx         ← FlatList + useInfiniteQuery + counter
│   ├── Favorites.tsx         ← aba Favoritos (useQueries pelos ids salvos)
│   └── MovieDetail.tsx       ← poster com withSpring (opção C) + HeartButton
├── components/
│   ├── MovieCard.tsx         ← HeartButton + prefetchQuery do detalhe
│   └── HeartButton.tsx       ← animação Reanimated (opção A)
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts     ← Zustand + persist manual (subscribe) no MMKV
├── queries/movies/           ← TanStack Query
├── services/api.ts           ← axios + interceptors
└── storage/
    └── mmkv.ts               ← MMKV (nativo) / localStorage (web) / memória (Jest, Expo Go)
```

## Decisões técnicas

- **Reanimated A (heart pop):** é o feedback mais direto para a ação principal do app (favoritar). Escala e rotação são `useSharedValue`, e o `useAnimatedStyle` é um worklet, então a animação roda na UI thread mesmo com a JS thread ocupada (ex.: carregando a próxima página da lista).
- **MMKV em vez de AsyncStorage:** o MMKV é síncrono e fala com C++ via JSI. Por isso o store já nasce com os ids lidos do disco (`loadInitial()`), sem uma etapa de hydration assíncrona e sem a lista "piscar" vazia no primeiro render.
- **Persist manual com `subscribe`** em vez do middleware `persist`: deixa explícito quando o save acontece e só grava quando `ids` muda de fato.
- **Store guarda só ids:** os dados do filme continuam sendo server state (TanStack Query). A aba Favoritos busca cada id com `useQueries`, quase sempre já em cache pelo `prefetchQuery` feito ao tocar no card.
- **Dependências alinhadas ao Expo SDK 54** (`npx expo install --fix`): o starter vinha com Reanimated 3.16, incompatível com o RN 0.81 e com o Expo Go do SDK 54 (que traz o 4.1). Subi para Reanimated 4.1 + `react-native-worklets`, com o plugin Babel `react-native-worklets/plugin`. A API usada (`useSharedValue`, `useAnimatedStyle`, `withSpring`…) é a mesma.

## Referência

- Reanimated — documentação oficial (Software Mansion): https://docs.swmansion.com/react-native-reanimated/
- react-native-mmkv: https://github.com/mrousavy/react-native-mmkv

---

## 🎁 Bonus implementado (opcional)

- [x] **Bottom Tabs com aba Favoritos filtrada — +2pt** (`src/routes/RootStack.tsx`, `src/screens/Favorites.tsx`)
- [ ] Deep link `expo://detail/<id>` — +1pt
- [x] 2 das 3 opções Reanimated (A/B/C) — +1pt (A em `HeartButton.tsx`, C em `MovieDetail.tsx`)
- [x] TanStack Query `staleTime` + `prefetchQuery` — +1pt (`movieByIdQueryOptions` + `MovieCard.openDetail`)
- [x] Hermes habilitado (`"jsEngine": "hermes"` em `app.json`) — +0.5pt
- [x] Paginação infinita (`useInfiniteQuery` + `onEndReached`) — `src/queries/movies/get-popular-movies.ts`
- [ ] CI GitHub Actions verde — +0.5pt (o workflow do starter fica em `.github/` desta pasta, e o GitHub só executa workflows da raiz do repo; localmente `npm test` passa com 16/16)
