# README — Atividade 2 — Diego Diogenes — 255123

## Identificação

- **Aluno:** Diego Diogenes
- **Matrícula:** 255123
- **Opção Reanimated escolhida:** A — Heart pop (principal) + C — poster com spring no detalhe (bônus)
- **Bônus implementado:** Bottom Tabs com aba Favoritos, deep link `expo://detail/<id>`, `staleTime` + `prefetchQuery`, paginação infinita e Hermes
- **Repo (seu fork):** <https://github.com/diegodiogenes/puc-iec-mobile-multiplataforma>
- **Pasta da entrega:** `exercicios/02-app-rn-navegacao-estado/diego-diogenes/`

## Como rodar

```bash
npm install
cp .env.example .env   # cole seu EXPO_PUBLIC_TMDB_TOKEN
npx expo start
```

> ⚠️ MMKV não roda em web. Use simulador iOS (`i`) ou Android (`a`). Na web o
> adapter cai automaticamente para `localStorage`.

Para rodar os testes:

```bash
npm test
```

## O que o app faz

Lista os filmes populares da TMDB com paginação infinita e permite favoritar
qualquer filme pelo coração. Os favoritos ficam num store Zustand persistido em
MMKV (sobrevivem a reloads) e aparecem numa aba dedicada. Ao tocar no coração,
uma animação Reanimated roda na UI thread (escala + rotação com spring).

## Screenshot / Screencast

O autograder da atividade valida o código estaticamente e não exige mídia.
Para gerar a demonstração localmente:

1. Abra o app no simulador e favorite alguns filmes.
2. Grave 15–30s tocando nos corações e reabrindo o app (favoritos persistem).
3. Salve como `screencast.gif` na raiz desta pasta, se quiser anexar ao Canvas.

## Arquitetura

```
src/
├── routes/
│   ├── RootStack.tsx          ← Stack (HomeTabs + Detail) + deep link
│   └── HomeTabs.tsx           ← Bottom Tabs (Filmes + Favoritos)
├── screens/
│   ├── MovieList.tsx          ← FlatList + paginação infinita
│   ├── MovieDetail.tsx        ← detalhe + HeartButton + poster spring
│   └── Favorites.tsx          ← lista persistida de favoritos
├── components/
│   ├── MovieCard.tsx          ← card + prefetch do detalhe
│   └── HeartButton.tsx        ← animação Reanimated (Opção A)
├── store/
│   ├── counterStore.ts        ← Zustand counter (hands-on)
│   └── favoritesStore.ts      ← Zustand + persist manual em MMKV
├── queries/movies/            ← TanStack Query (server state)
├── storage/
│   └── mmkv.ts                ← MMKV nativo / localStorage na web / memória em Jest
├── services/api.ts            ← axios + interceptors TMDB
└── contexts/ThemeContext.tsx  ← estado global de tema
```

## Decisões técnicas

- **Reanimated Opção A:** o `HeartButton` usa `useSharedValue` + `useAnimatedStyle`
  e dispara `withSequence(withTiming(1.4), withSpring(1))`, além de uma rotação
  leve. Como roda em worklet, a animação não depende do JS thread.
- **Opção C (bônus):** o poster do detalhe entra com `withSpring`, também em
  worklet, reaproveitando o mesmo padrão de shared value.
- **MMKV em vez de AsyncStorage:** leitura síncrona (sem `await` na hidratação),
  ~30x mais rápida e via JSI. A persistência é explícita no `subscribe` do
  Zustand, o que evita o problema do middleware `persist` no bundle web do Metro.
- **Adapter com fallback:** `src/storage/mmkv.ts` usa MMKV no nativo,
  `localStorage` na web e memória no Jest. Isso mantém os testes verdes sem
  precisar de módulo nativo e preserva o comportamento real no device.
- **Paginação infinita:** `useInfiniteQuery` + `onEndReached`, respeitando
  `page`/`total_pages` devolvidos pela TMDB.
- **Prefetch:** ao tocar num card, o detalhe já é pré-carregado no cache do
  TanStack Query antes da navegação.

## Referência

- [Reanimated 4 — docs](https://docs.swmansion.com/react-native-reanimated/)
- [MMKV — docs](https://github.com/mrousavy/react-native-mmkv)
- [Zustand — docs](https://github.com/pmndrs/zustand)
- [TanStack Query — docs](https://tanstack.com/query/latest)
- Material da Aula 2 (`material-de-apoio/aula-02`)

---

## 🎁 Bonus implementado

- [x] **Bottom Tabs com aba Favoritos filtrada — +2pt**
- [x] Deep link `expo://detail/<id>` — +1pt
- [x] 2 das 3 opções Reanimated (A + C) — +1pt
- [x] TanStack Query `staleTime` + `prefetchQuery` — +1pt
- [x] Hermes habilitado (padrão do Expo SDK 54) — +0.5pt
- [x] Paginação infinita (`useInfiniteQuery` + `onEndReached`) — bônus de arredondamento

### Como conferir cada bônus

- **Bottom Tabs:** `src/routes/HomeTabs.tsx` e `src/screens/Favorites.tsx`.
- **Deep link:** `linking` em `App.tsx` + `scheme` em `app.json`.
- **Reanimated A + C:** `src/components/HeartButton.tsx` e `src/screens/MovieDetail.tsx`.
- **staleTime + prefetch:** `App.tsx`, `src/queries/movies/*.ts` e `MovieCard.tsx`.
- **Paginação:** `src/queries/movies/get-popular-movies.ts` + `MovieList.tsx`.

## Validação local

- `npm ci` — OK
- `npm test -- --runInBand` — **14 testes verdes** (5 counter + 9 favorites)
- `npx tsc --noEmit` — sem erros
- `npx expo export --platform web` — bundle gerado com sucesso
- Autograder local (`grader/lib/validators/rn-app.ts`) — **15/15**
