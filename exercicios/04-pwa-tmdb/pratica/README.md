# A4 — PWA TMDB: filmes instalável e offline

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma — PUC Minas IEC 2026

---

## Objetivo

Completar uma Progressive Web App de filmes populares do TMDB, com instalação, cache,
persistência de favoritos e suporte à consulta offline. A base já fornece o Service Worker,
IndexedDB, busca, lazy loading, instalação e o fluxo de cache.

Esta prática cobre os 15 pontos avaliativos do enunciado. O bônus do `MovieCard` não faz parte
desta entrega.

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
# Edite .env.local → coloque seu Read Access Token em VITE_TMDB_TOKEN
# Gere em: https://www.themoviedb.org/settings/api  (Read Access Token)
```

Não versionar `.env.local` nem compartilhar o token. O arquivo está listado no `.gitignore`.

---

## Prática realizada em aula

### Em aula com o professor (não avaliativo)

| Arquivo | O que fazemos juntos |
|---|---|
| [`src/__tests__/unit/01-MovieCard.test.tsx`](src/__tests__/unit/01-MovieCard.test.tsx) | 📘 MODELO — lemos os testes prontos, entendemos a estrutura |
| [`src/services/tmdb.ts`](src/services/tmdb.ts) | Vemos o stub com `throw` e entendemos o que o TODO 1 pede |

O arquivo [`src/__tests__/unit/01-MovieCard.test.tsx`](src/__tests__/unit/01-MovieCard.test.tsx)
é o modelo para os demais testes: cada caso renderiza o componente ou hook, executa uma ação
quando necessário e verifica o resultado com `expect`. O serviço TMDB também é apresentado
com um teste que simula `tmdbClient.get`, evitando chamadas reais à API.

## Implementação avaliativa

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

### Critérios e pontuação

| Critério | Pontos |
|---|---:|
| TODO 1 — `fetchPopularMovies` chama `tmdbClient.get()` e retorna os dados | 4 |
| TODO 2 — três testes reais de `useFavorites` | 4 |
| TODO 3, passo 1 — filtra e renderiza a lista de favoritos | 3 |
| TODO 3, passo 2 — estados vazios com e sem filmes carregados | 2 |
| TODO 3, passo 3 — listeners offline/online, cleanup e uso na tela | 2 |
| **Total** | **15** |

---

## Como rodar os testes

```bash
npm test               # roda uma vez
npm run test:watch     # re-roda ao salvar
npm run build          # verifica TypeScript e build de produção
```

Para executar a validação estrutural localmente a partir de `exercicios/04-pwa-tmdb`:

```bash
cd ../grader
npm install
npm run validate -- --entrega ../pratica
```

O validator deve aprovar todos os critérios e gerar `grade.json`. Esse arquivo é gerado na
pasta de onde o comando for executado e não deve ser incluído na entrega.

---

## Testando o app offline

Depois de implementar os TODOs:

1. `npm run dev` → abra http://localhost:5173
2. Deixe os filmes carregarem
3. DevTools → Network → **Offline**
4. Verifique que filmes previamente carregados continuam aparecendo pelo cache.
5. Abra a aba **★ Favoritos** e confirme o banner `📡 Offline — exibindo dados do cache`.
6. Volte para a rede normal e confirme que o banner desaparece.

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
      useOfflineStatus.ts ← TODO 3 Passo 3 (status online/offline)
    screens/
      HomeScreen.tsx   ← ✏️  TODO 3 Passos 1 e 2 (aba Favoritos)
    __tests__/
      unit/
        01-MovieCard.test.tsx    ← 📘 MODELO — leia primeiro
        02-tmdb-service.test.ts  ← ✅ fica verde após TODO 1
        03-useFavorites.test.ts  ← TODO 2: três testes de comportamento
```

---

## Entrega

```bash
git checkout -b feat/a4-pwa

git add pratica/README.md
git add pratica/src/services/tmdb.ts
git add pratica/src/__tests__/unit/03-useFavorites.test.ts
git add pratica/src/screens/HomeScreen.tsx
git add pratica/src/hooks/useOfflineStatus.ts
git commit -m "feat(a4-pwa): fetchPopularMovies + testes + aba Favoritos"
git push origin feat/a4-pwa
```

Abra PR com título: `feat(a4-pwa): <seu-github-login>`  
O bot J.A.R.V.I.S. comenta a checagem automática a cada commit.

---

Enunciado completo: [`../enunciado.md`](../enunciado.md)
