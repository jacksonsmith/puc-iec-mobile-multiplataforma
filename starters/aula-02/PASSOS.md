# Passos — Hands-on Aula 2 + Atividade 2

Roteiro sequencial. Cada passo tem TODOs no código com a tag correspondente.

```bash
# Liste todos os TODOs:
grep -rn "TODO \[" src/ __tests__/
```

---

## 🎓 Hands-on da Aula (em sala, ~45min)

### ✅ Passo 1 — Setup (pronto, não precisa fazer)
Starter já vem com:
- App Expo + TypeScript
- React Navigation v7 configurado em `src/routes/RootStack.tsx`
- QueryClientProvider + ThemeProvider no `App.tsx`
- Service TMDB pronto em `src/services/api.ts`
- Queries de detalhe e busca prontas em `src/queries/movies/`

**Você só precisa:** `npm install` + criar `.env` com TMDB token.

### ✅ Passo 2 — Stack Navigator (pronto)
`src/routes/RootStack.tsx` já tem Home → Detail configurado.

### 📝 Passo 3 — Zustand counter store
📁 `src/store/counterStore.ts`
- **3.1** declarar tipos das actions (increment/decrement/reset)
- **3.2** implementar store com `create<CounterState>((set) => ...)`

### 📝 Passo 4 — TanStack Query
📁 `src/queries/movies/get-popular-movies.ts`
- **4** substituir stub `usePopularMovies` por `useQuery` real

### 📝 Passo 5 — FlatList + MovieCard
📁 `src/screens/MovieList.tsx`
- **5** trocar placeholder por `<FlatList data={data?.results}>`

### 📝 Bonus aula — Testes com IA
📁 `__tests__/counterStore.test.ts`
- Use IA pra gerar testes de `decrement`, `reset`, edge cases

---

## 📦 Atividade 2 (entrega 10/06, 15 pts, ~2h-2h30)

Estende o app construído no hands-on.

### 📝 Passo 1 — Zustand favorites store (~30min)
📁 `src/store/favoritesStore.ts`
- **1.1** declarar tipos `add`, `remove`, `clear`
- **1.2** implementar actions (toggle: add se não existe, remove se existe)
- **1.3** consumir em `src/components/MovieCard.tsx` (ler `isFavorite` + `toggle`)

### 📝 Passo 2 — Persistência MMKV (~30min)
📁 `src/storage/mmkv.ts` + atualizar `src/store/favoritesStore.ts`
- **2.1** criar instância MMKV + adapter `mmkvStorage` (getItem/setItem/removeItem)
- **2.2** envolver `create()` do favoritesStore com `persist({ name, storage })`

### 📝 Passo 3 — Reanimated não-trivial (~45min)
📁 criar `src/components/HeartButton.tsx` + integrar em `MovieCard.tsx` e `MovieDetail.tsx`
- **3** escolher **1**:
  - **A — Heart pop:** scale spring (1 → 1.4 → 1.0) com `withSequence + withSpring`
  - **B — Card swipe:** `useAnimatedGestureHandler` com threshold
  - **C — Shared element:** poster cresce com `withSpring` ao navegar pro detail

### 📝 Passo 4 — Testes com IA (~20min)
📁 `__tests__/favoritesStore.test.ts` + expandir `__tests__/counterStore.test.ts`
- **Mínimo 6 testes verdes** (3 counter + 3 favorites)
- CI GitHub Actions valida automático no push do fork (`.github/workflows/test.yml`)

### 📝 Passo 5 — README + screencast + entrega
- `README.md` com nome, opção Reanimated (A/B/C), screenshot, screencast.gif
- Push pro fork → CI verde → link no Canvas

---

## Verificação rápida do progresso

```bash
# Quantos TODOs ainda faltam:
grep -c "TODO \[" src/**/*.ts src/**/*.tsx __tests__/*.ts

# App rodando:
npx expo start

# Testes verdes:
npm test
```

CI verde no Actions = pelo menos 6 testes passando.
