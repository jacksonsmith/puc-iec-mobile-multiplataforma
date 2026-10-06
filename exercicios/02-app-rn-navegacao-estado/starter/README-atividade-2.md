# README — Atividade 2 —

## Identificação

- **Aluno:** Marcus Vinicius da Cruz Santos
- **Opção Reanimated escolhida:** A — Heart pop
- **Bônus implementado:**
- **Repositório (fork):** https://github.com/marcus-santos/puc-iec-mobile-multiplataforma.git

## Como rodar

```bash
npm install
npx expo start
```

Para validar MMKV, é necessário executar em um simulador ou dispositivo Android/iOS. O ambiente atual não possui Android SDK nem `adb` instalados.

## O que o app faz

O aplicativo consulta a lista de filmes populares da TMDB usando TanStack Query e permite abrir os detalhes de cada filme. O usuário pode adicionar ou remover filmes dos favoritos, que são armazenados em Zustand e persistidos com MMKV no ambiente nativo. O botão de favorito possui uma animação de escala implementada com Reanimated.

## Screenshot


## Screencast da animação


## Arquitetura

```text
src/
├── components/
│   ├── HeartButton.tsx       # animação Reanimated
│   ├── MovieCard.tsx         # card com ação de favorito
│   └── TokenMissingScreen.tsx
├── contexts/
│   └── ThemeContext.tsx
├── queries/
│   └── movies/
│       ├── get-movie-by-id.ts
│       ├── get-popular-movies.ts
│       └── search-movies.ts
├── routes/
│   └── RootStack.tsx
├── screens/
│   ├── MovieDetail.tsx
│   └── MovieList.tsx
├── services/
│   └── api.ts
├── storage/
│   └── mmkv.ts
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts
├── types/
│   └── movie.ts
└── utils/
    └── poster-url.ts
```

## Decisões técnicas

Foi escolhida a opção A, Heart pop, usando `useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSequence` e `withSpring`. A animação ocorre no componente `HeartButton` e não utiliza a API `Animated` legada.

Os favoritos usam Zustand para estado global local e MMKV para persistência síncrona no Android/iOS. Um adapter com `localStorage` é usado na web e nos testes, pois MMKV depende de JSI nativo. A lista de filmes usa TanStack Query para cache, carregamento, erros e atualização dos dados da TMDB.

## Testes e validação

- `npx tsc --noEmit` — aprovado
- `npm test -- --runInBand` — 8 testes aprovados
- `npx expo export --platform web` — aprovado
- Validação nativa com Android/iOS — pendente neste ambiente por ausência do Android SDK

## Referências

- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Material da Aula 2](./PASSOS.md)

---

## Bônus implementado

- [ ] **Bottom Tabs com aba Favoritos filtrada — +2pt**
- [ ] Deep link `expo://detail/<id>` — +1pt
- [ ] 2 das 3 opções Reanimated (A/B/C) — +1pt
- [ ] TanStack Query `staleTime` + `prefetchQuery` — +1pt
- [ ] Hermes habilitado — +0.5pt
- [ ] CI GitHub Actions verde — +0.5pt

## Evidências


