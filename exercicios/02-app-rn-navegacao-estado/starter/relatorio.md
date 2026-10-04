# Relatório — Atividade 2

## Identificação

- **Aluno:** Gabriel Yuji Yasuda Cardoso
- **Opção Reanimated escolhida:** A - Heart Pop
- **Bônus implementados:** Bottom Tabs; `staleTime` + `prefetchQuery`
- **Repo (seu fork):** [URL do repositório](https://github.com/GabrielYujiYasuda/puc-iec-mobile-multiplataforma)

## Como rodar

```bash
npm install
npx expo start
```

> No mobile, o armazenamento usa MMKV. Na web e nos testes, o projeto usa
> `localStorage` como fallback. Configure `EXPO_PUBLIC_TMDB_TOKEN` no arquivo
> `.env` antes de abrir o app.

## O que o app faz

O app exibe filmes populares da TMDB em uma lista paginada, permite abrir o detalhe
e adicionar ou remover filmes dos favoritos. Os favoritos são persistidos com
Zustand e MMKV, com fallback para `localStorage` na web. O botão de favorito usa
Reanimated para executar a animação Heart Pop.

## Mídia

[Vídeo da animação Reanimated](./gif.webm)

## Arquitetura

```json
src/
├── routes/
│   ├── RootStack.tsx
│   └── MainTabs.tsx
├── screens/
│   ├── MovieList.tsx
│   ├── MovieDetail.tsx
│   └── Favorites.tsx
├── components/
│   ├── MovieCard.tsx
│   └── HeartButton.tsx
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts
├── queries/
│   └── movies/
│       ├── get-popular-movies.ts
│       ├── get-movie-by-id.ts
│       └── search-movies.ts
├── services/
│   └── api.ts
└── storage/
    └── mmkv.ts
```

## Decisões técnicas

Foi escolhida a opção A porque o Heart Pop dá feedback visual imediato ao favoritar
um filme e pode ser reutilizado tanto no card quanto na tela de detalhe. MMKV foi
usado por ser um armazenamento síncrono nativo e adequado para persistir o estado
pequeno de favoritos; `localStorage` mantém a execução web e os testes possíveis.
O carregamento da lista usa `useInfiniteQuery`, enquanto o detalhe é pré-carregado
ao tocar no card para reduzir a espera na navegação.

## Referências

[Reanimated](https://docs.swmansion.com/react-native-reanimated/),
[MMKV](https://github.com/mrousavy/react-native-mmkv),
[Zustand](https://zustand.docs.pmnd.rs/) e
[TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview).

## Bônus implementado

- [x] **Bottom Tabs com aba Favoritos filtrada — +2pt**
- [ ] Deep link `expo://detail/<id>` — +1pt
- [ ] 2 das 3 opções Reanimated (A/B/C) — +1pt
- [x] TanStack Query `staleTime` + `prefetchQuery` — +1pt
- [ ] Hermes configurado explicitamente no `app.json` — +0.5pt
- [ ] CI GitHub Actions verde — +0.5pt

Também foram adicionados testes unitários para `counterStore` e `favoritesStore`.
Validação executada: `npm test -- --runInBand` — 2 suítes aprovadas e 8 testes aprovados.
