# README — Atividade 2 — Henrique Miguel de Jesus

## Identificação

- **Aluno:** Henrique Miguel de Jesus
- **Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma (PUC Minas - IEC)
- **Opção Reanimated Escolhida:** Opção A — Heart pop animation (`useSharedValue` + `useAnimatedStyle` + `withSequence` + `withSpring` rodando na UI thread)
- **Persistência de Dados:** MMKV síncrono via JSI com fallback gracioso para web/Jest
- **Testes Automatizados:** 9 testes Jest verdes (4 counterStore + 5 favoritesStore)

## Como rodar o projeto

1. Navegue até a pasta do projeto:
   ```bash
   cd exercicios/02-app-rn-navegacao-estado/henrique
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute os testes automatizados (Jest):
   ```bash
   npm test
   ```

4. Inicie a aplicação no Expo:
   ```bash
   npx expo start
   ```

> ⚠️ **Nota de execução:** O MMKV utiliza ligações síncronas via C++/JSI no iOS/Android. Para ambiente web ou testes unitários, o módulo utiliza automaticamente o storage local/memória sem interrupções.

## O que o app faz

O aplicativo consome a API da TMDB para exibir uma lista de filmes populares com dados via TanStack Query. Permite ao usuário alterar um contador global (`counterStore`) e favoritar/desfavoritar qualquer filme da lista em tempo real. A lista de favoritos é gerenciada no estado global Zustand (`useFavoritesStore`), persistida síncronamente via MMKV entre reloads, e possui animação fluida de mola/escala ao clicar no botão de coração (Reanimated 3).

## Arquitetura

```
src/
├── routes/
│   └── RootStack.tsx         ← Navegação Stack (MovieList → MovieDetail)
├── screens/
│   ├── MovieList.tsx         ← Renderiza FlatList de filmes com refetch
│   └── MovieDetail.tsx       ← Detalhes do filme selecionado
├── components/
│   ├── MovieCard.tsx         ← Card com dados, nota e botão HeartButton
│   ├── HeartButton.tsx       ← Botão favoritar animado (Reanimated 3)
│   └── TokenMissingScreen.tsx← Tratamento amigável de erro de API
├── store/
│   ├── counterStore.ts       ← Zustand counter (count, increment, decrement, reset)
│   └── favoritesStore.ts     ← Zustand favoritos (ids, add, remove, toggle, clear, isFavorite)
├── storage/
│   └── mmkv.ts               ← MMKV síncrono + web/test polyfill
├── queries/
│   └── movies/               ← Integradores TanStack Query (get-popular-movies, etc)
└── services/
    └── api.ts                ← Cliente HTTP Axios com interceptors
```

## Decisões Técnicas

- **Zustand para Gestão de Estado Global:** Escolhido pela simplicidade sintática, alto desempenho e por operar como singleton fora da árvore de componentes React, evitando re-renders desnecessários.
- **MMKV para Persistência:** Adotado em substituição ao AsyncStorage por operar via JSI em C++, sendo ~30x mais rápido e totalmente síncrono (não bloqueia a thread de JS durante o carregamento inicial dos favoritos).
- **Reanimated 3 para Animações:** A animação de Heart Pop foi desenvolvida com worklets executados diretamente na UI Thread (`withSequence`, `withTiming`, `withSpring`), garantindo 60/120 FPS cravados sem engasgos de ponte JS.
- **Estrutura de Testes para CI:** Foram criadas suítes completas de teste para garantir a aprovação no autograder do GitHub Actions CI.

## Referências

1. **Reanimated Docs** — *Core Concepts & Worklets*: <https://docs.swmansion.com/react-native-reanimated/>
2. **Zustand Documentation** — *State Management in React Native*: <https://github.com/pmndrs/zustand>
3. **MMKV for React Native** — *Fast Synchronous Storage*: <https://github.com/mrousavy/react-native-mmkv>
4. **TanStack Query** — *Asynchronous State Management*: <https://tanstack.com/query/latest>
