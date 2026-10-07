# README — Atividade 2 — Eduardo Castor

## Identificação

- **Aluno:** Eduardo Castor
- **Opção Reanimated escolhida:** A — Heart pop
- **Bonus implementado:** Bottom Tabs com aba Favoritos (lista persistida), Hermes explícito no `app.json`
- **Repo (seu fork):** https://github.com/SEU-USUARIO/puc-iec-mobile-multiplataforma
- **Branch:** `entrega/atividade-2-eduardo-castor`
- **App:** `exercicios/02-app-rn-navegacao-estado/starter/` (editado in-place)

## Como rodar

```bash
cd exercicios/02-app-rn-navegacao-estado/starter
npm install
cp .env.example .env
npx expo start      
npm test            
```

## O que o app faz

Lista os filmes populares da TMDB (TanStack Query com cache de 5 min) e permite favoritar cada
filme tocando no ❤️, tanto na lista quanto no detalhe. Os favoritos ficam num store Zustand
persistido em MMKV (síncrono), então sobrevivem ao fechar e reabrir o app. O toque no coração
dispara uma animação "pop" (escala + rotação) feita com Reanimated na UI thread. A aba
**Favoritos** mostra a lista persistida e a aba **Settings** tem o counter e o botão "Limpar favoritos".

## Arquitetura

```
src/
├── services/api.ts                      ← HTTP (axios)
├── queries/movies/
│   ├── get-popular-movies.ts            ← useQuery (staleTime 5 min)
│   ├── get-movie-by-id.ts
│   └── get-movies-by-ids.ts             ← useQueries (aba Favoritos)
├── store/
│   ├── counterStore.ts                  ← Zustand
│   └── favoritesStore.ts                ← Zustand + persist (subscribe) + MMKV
├── storage/mmkv.ts                      ← MMKV (nativo) / localStorage (web) / memória
├── routes/
│   ├── RootStack.tsx                    ← Stack: Home (tabs) + Detail
│   └── MainTabs.tsx                     ← Bottom Tabs: Filmes | Favoritos | Settings
├── screens/
│   ├── MovieList.tsx · MovieDetail.tsx
│   ├── FavoritesScreen.tsx · SettingsScreen.tsx
└── components/
    ├── MovieCard.tsx
    └── HeartButton.tsx                  ← animação Reanimated
__tests__/ counterStore.test.ts · favoritesStore.test.ts
```

## Decisões técnicas

- **Reanimated A (heart pop):** é o caso mais direto de worklet. Um único `SharedValue`
  (`progress`) controla escala e rotação via `useAnimatedStyle`; a função `heartTransform` é um
  worklet (`'worklet'`) que roda inteira na UI thread. `withSequence(withTiming, withSpring)` dá
  a subida rápida e o "quique" na volta. `onPress` roda na JS thread, por isso não precisa de `runOnJS`.
- **MMKV em vez de AsyncStorage:** é síncrono (JSI/C++), então o estado inicial é lido na criação
  da store (`loadInitial`) — sem estado de "carregando" nem flash de lista vazia. Trade-off:
  exige código nativo (dev build, não Expo Go), por isso `mmkv.ts` tem fallbacks para web e memória.
- **Persist via `subscribe` em vez do middleware `persist`:** o starter documenta que o
  middleware do Zustand usa `import.meta.env`, que quebra no Metro web. Com `subscribe` o app roda
  em todas as plataformas e o momento exato da gravação fica explícito (só grava quando `ids` muda
  por referência).
- **Aba Favoritos reaproveita o cache:** `useMoviesByIds` usa a mesma `queryKey` (`['movie', id]`)
  do detalhe; filmes já abertos não geram nova request.

## Referência

- Zustand — https://github.com/pmndrs/zustand
- react-native-mmkv — https://github.com/mrousavy/react-native-mmkv
- Reanimated — https://docs.swmansion.com/react-native-reanimated/
- React Navigation Bottom Tabs — https://reactnavigation.org/docs/bottom-tab-navigator

## Uso de IA

Os testes Jest (`__tests__/`) foram gerados com auxílio de IA e revisados por mim;