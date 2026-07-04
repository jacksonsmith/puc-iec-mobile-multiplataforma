# A4 — PWA TMDB: filmes instalável e offline

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma — PUC Minas IEC 2026

---

## Antes de começar

```bash
# Entre na pasta correta
cd exercicios/04-pwa-tmdb/pratica

# Confirme que está no lugar certo
ls src/services
# → deve mostrar: tmdb.ts  db.ts
```

> **Windows:** `cd exercicios\04-pwa-tmdb\pratica` e `dir src\services`

```bash
npm install
cp .env.example .env.local        # Windows: copy .env.example .env.local
# Edite .env.local → coloque seu token em VITE_TMDB_TOKEN
# Gere em: https://www.themoviedb.org/settings/api  (Read Access Token)
```

---

## Roteiro das tarefas

### Em aula com o professor (não avaliativo)

| Arquivo | O que fazemos juntos |
|---|---|
| [`src/__tests__/unit/01-MovieCard.test.tsx`](src/__tests__/unit/01-MovieCard.test.tsx) | 📘 MODELO — lemos os testes prontos, entendemos a estrutura |
| [`src/services/tmdb.ts`](src/services/tmdb.ts) | Vemos o stub com `throw` e entendemos o que o TODO 1 pede |

### Solo em casa (avaliativo)

| Ordem | Arquivo | O que implementar | Dificuldade |
|---|---|---|---|
| 1 | [`src/services/tmdb.ts`](src/services/tmdb.ts) | **TODO 1** — `fetchPopularMovies()`: chame `tmdbClient.get('/movie/popular', { params: { language: 'pt-BR', page } })` e retorne `response.data` | FÁCIL |
| 2 | [`src/__tests__/unit/03-useFavorites.test.ts`](src/__tests__/unit/03-useFavorites.test.ts) | **TODO 2** — implemente os 3 casos `it.todo` (testes 3, 4 e 5) | MÉDIO |
| 3 | [`src/screens/HomeScreen.tsx`](src/screens/HomeScreen.tsx) + [`src/hooks/useOfflineStatus.ts`](src/hooks/useOfflineStatus.ts) | **TODO 3** — aba Favoritos (3 passos abaixo) | MÉDIO |

#### TODO 3 — Aba Favoritos (3 passos)

**Passo 1** — Em `HomeScreen.tsx`, no bloco `if (activeTab === 'favorites')`:
- Filtre `movies` por `isFavorite(m.id)` → `favMovies`
- Renderize `<MovieCard key={m.id} movie={m} isFavorite={true} onToggleFavorite={toggleFavorite} />` pra cada filme

**Passo 2** — ainda em `HomeScreen.tsx`:
- Se `favMovies.length === 0`, mostre um `<p>` com:
  - `isEmpty === true` → `'Nenhum filme carregado ainda.'`
  - `isEmpty === false` → `'Nenhum favorito ainda — toque ★ em um filme.'`

**Passo 3** — Em `src/hooks/useOfflineStatus.ts`:
- Implemente o hook seguindo as instruções nos comentários do arquivo
- Use `isOnline` (já importado no `HomeScreen`) pra mostrar o banner vermelho quando offline

---

## Como rodar os testes

```bash
npm test               # roda uma vez
npm run test:watch     # re-roda ao salvar
```

**Antes do TODO 1:** `02-tmdb-service.test.ts` testes 1-2 ficam vermelhos.  
**Depois do TODO 1:** ficam verdes.  
**Depois do TODO 2:** testes 3-5 de `03-useFavorites.test.ts` ficam verdes.  
**TODO 3:** testado visualmente (`npm run dev`) + validação estrutural pelo bot.

---

## Testando o app offline

Depois do TODO 1 implementado:

1. `npm run dev` → abra http://localhost:5173
2. Deixe os filmes carregarem
3. DevTools → Network → **Offline**
4. Filmes continuam aparecendo (IndexedDB serve o cache)
5. Aba **★ Favoritos** deve mostrar o banner `📡 Offline — exibindo dados do cache` (depois do TODO 3)

---

## Arquivos do exercício

```
pratica/
  src/
    services/
      tmdb.ts          ← ✏️  TODO 1 (fetchPopularMovies)
      db.ts            ← IndexedDB (já pronto)
    repositories/
      moviesRepository.ts  ← estratégias NetworkFirst/CacheFirst/SWR (já pronto)
    hooks/
      useTmdb.ts          ← usa o repository (já pronto)
      useFavorites.ts     ← favoritos no localStorage (já pronto)
      useOfflineStatus.ts ← ✏️  TODO 3 Passo 3 (stub — implemente)
    screens/
      HomeScreen.tsx   ← ✏️  TODO 3 Passos 1 e 2 (aba Favoritos)
    __tests__/
      unit/
        01-MovieCard.test.tsx    ← 📘 MODELO — leia primeiro
        02-tmdb-service.test.ts  ← ✅ fica verde após TODO 1
        03-useFavorites.test.ts  ← ✅ TODO 2: implemente os it.todo()
```

---

## Entrega

```bash
git checkout -b feat/a4-pwa

git add src/services/tmdb.ts
git add src/__tests__/unit/03-useFavorites.test.ts
git add src/screens/HomeScreen.tsx
git add src/hooks/useOfflineStatus.ts
git commit -m "feat(a4-pwa): fetchPopularMovies + testes + aba Favoritos"
git push origin feat/a4-pwa
```

Abra PR com título: `feat(a4-pwa): <seu-github-login>`  
O bot J.A.R.V.I.S. comenta a checagem automática a cada commit.

---

Enunciado completo: [`../enunciado.md`](../enunciado.md)
