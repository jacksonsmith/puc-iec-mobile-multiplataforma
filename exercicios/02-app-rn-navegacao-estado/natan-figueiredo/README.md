# Atividade 2 — App de Feed: Favoritos + MMKV + Reanimated

- **Aluno:** Natan Figueiredo
- **Opção Reanimated escolhida:** A — Heart pop
- **Repo (fork):** https://github.com/natantn/puc-iec-mobile-multiplataforma

## Como rodar

```bash
npm install
cp .env.example .env   # preencher EXPO_PUBLIC_TMDB_TOKEN
npx expo start         # w = web | a = Android | i = iOS
npm test               # 14 testes Jest
```

> **MMKV x Expo Go:** `react-native-mmkv` v3 é módulo nativo (JSI/TurboModule) e **não existe no Expo Go**.
> Para persistência real em Android/iOS use dev build: `npx expo run:android` / `npx expo run:ios`.
> Na **web** o próprio MMKV usa `localStorage` por baixo, então `npx expo start --web` funciona e persiste entre reloads.

## O que o app faz

Lista filmes populares da TMDB (TanStack Query, cache de 5 min) e permite favoritar pelo ❤️ na lista e no detalhe.
Os favoritos ficam num store Zustand persistido em MMKV, então sobrevivem a reloads. O ❤️ faz um "pop"
(escala 1 → 1.4 → 1 com spring + leve rotação) animado por Reanimated na UI thread.

## O que foi implementado

| TASK | Arquivo | Resumo |
|---|---|---|
| 1 | `src/store/counterStore.ts` | `increment`, `decrement`, `reset` |
| 2 | `src/queries/movies/get-popular-movies.ts` | `useQuery` com `staleTime` de 5 min |
| 3 | `src/screens/MovieList.tsx` | `FlatList` + pull-to-refresh + contador de favoritos |
| 5 | `src/store/favoritesStore.ts` | `add` (idempotente), `remove`, `toggle`, `clear`, `isFavorite` |
| 6 | `src/components/MovieCard.tsx` | ❤️ ligado ao store via seletores granulares |
| 7 | `src/storage/mmkv.ts` + store | Estado inicial lido do MMKV (síncrono) + `subscribe` grava a cada mudança |
| 8 | `src/components/HeartButton.tsx` | `useSharedValue` + `useAnimatedStyle` + `withSequence(withTiming, withSpring)`; usado na lista e no detalhe |
| 4 / 9 | `__tests__/*.test.ts` | 5 testes do counter + 9 de favorites (inclui persistência e reload simulado) |

## Decisões técnicas

- **Persist manual via `subscribe` em vez do middleware `persist`:** MMKV é síncrono, então `loadInitial()` lê o disco
  na criação do store, sem hydration assíncrona nem "flash" de lista vazia. Também evita importar `zustand/middleware`,
  que quebra no Metro web (`import.meta.env`). O `subscribe` só grava quando `ids` muda de fato.
- **MMKV em vez de AsyncStorage:** acesso via JSI (sem bridge), síncrono e ~30x mais rápido.
  A v3 já traz implementação web (`localStorage`) e mock automático no Jest, então não precisei de polyfill manual.
- **Reanimated (opção A):** o tap só *atribui* animações declarativas aos shared values. O callback de `useAnimatedStyle`
  vira worklet (plugin Babel) e roda na UI thread a cada frame, então a animação não depende da JS thread.
- **Versões alinhadas ao Expo SDK 54 (`npx expo install --fix`):** o starter vinha com `babel-preset-expo@56` e
  `react-native-reanimated@3.16`, o que fazia o **bundle Android falhar** (`hermesc: private properties are not supported`).
  Atualizei para Reanimated 4.1 + `react-native-worklets`. Com isso o plugin Babel passa a ser injetado pelo
  `babel-preset-expo` e saiu do `babel.config.js` (duplicado quebra). Também corrigi `paths` do `tsconfig.json` (`./src/*`),
  que fazia o `tsc` falhar no TS 5.9.

## Referência

- Reanimated — https://docs.swmansion.com/react-native-reanimated/
- react-native-mmkv — https://github.com/mrousavy/react-native-mmkv
- Zustand — https://github.com/pmndrs/zustand
