# Atividade 7 — PWA: filmes populares instalável e offline

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Entrega:** fork + PR no repositório da disciplina
**Valor:** 15 pontos

---

## Contexto

Você vai implementar **uma chamada de API** numa Progressive Web App já montada.

O app (pasta `pratica/`) já tem toda a arquitetura de offline-first funcionando:
- **Service Worker** via Workbox (pré-cache de assets + runtime cache da API)
- **IndexedDB** com estratégias NetworkFirst / CacheFirst / StaleWhileRevalidate
- **NetworkToggle** pra testar offline sem DevTools
- **Lazy loading** com IntersectionObserver

Sua tarefa: implementar o **TODO 1** — a chamada TMDB que alimenta tudo isso.

---

## Estrutura do projeto

```
pratica/
  src/
    services/
      tmdb.ts          ← ✏️  TODO 1 aqui
      db.ts            ← IndexedDB (já implementado)
    repositories/
      moviesRepository.ts  ← NetworkFirst/CacheFirst/SWR (já implementado)
    hooks/
      useTmdb.ts       ← React hook que usa o repository (já implementado)
      useFavorites.ts  ← favoritos no localStorage (já implementado)
      useInfiniteScroll.ts ← lazy loading (já implementado)
    screens/
      HomeScreen.tsx   ← view que só renderiza o que recebe (já implementado)
    components/
      MovieCard.tsx    ← card com favoritar + compartilhar (já implementado)
      NetworkToggle.tsx ← botão online/offline + limpar cache (já implementado)
    __tests__/
      unit/
        01-MovieCard.test.tsx    ← 📘 MODELO (leia primeiro)
        02-tmdb-service.test.ts  ← ✅ AVALIATIVO — fica vermelho até você implementar
        03-useFavorites.test.ts  ← ✅ AVALIATIVO — complete os it.todo()
```

---

## Setup

> **Windows**: use `cd exercicios\07-pwa-tmdb\pratica` e `dir src\services` pra verificar

```bash
# 1. Entre na pasta do projeto
cd exercicios/07-pwa-tmdb/pratica

# 2. Verifique que está no lugar certo
ls src/services
# Deve mostrar: tmdb.ts  db.ts

# 3. Instale dependências
npm install

# 4. Configure o token TMDB
cp .env.example .env.local        # Windows cmd: copy .env.example .env.local
# Edite .env.local e coloque seu token em VITE_TMDB_TOKEN
# Gere em: https://www.themoviedb.org/settings/api (Read Access Token)

# 5. Rode em modo dev
npm run dev
# Abre http://localhost:5173
```

A tela mostra "Token TMDB não configurado" se o token não estiver configurado.

---

## TODO 1 — fetchPopularMovies (obrigatório, 12 pts)

**Arquivo:** `src/services/tmdb.ts`

Implemente a função `fetchPopularMovies` que está com `throw` como stub.

```typescript
export async function fetchPopularMovies(_page = 1): Promise<MoviesResponse> {
  throw new Error('TODO 1: fetchPopularMovies não implementada');
  // ↑ substitua este throw pela implementação real
}
```

**O que fazer:**

Use o `tmdbClient` já configurado no arquivo (axios com baseURL + Bearer token):

```typescript
export async function fetchPopularMovies(page = 1): Promise<MoviesResponse> {
  const { data } = await tmdbClient.get<MoviesResponse>('/movie/popular', {
    params: { language: 'pt-BR', page },
  });
  return data;
}
```

**Verificação:** `npm test` — os testes 1 e 2 em `02-tmdb-service.test.ts` devem ficar verdes.

---

## TODO 2 — Testes de useFavorites (obrigatório, 3 pts)

**Arquivo:** `src/__tests__/unit/03-useFavorites.test.ts`

Os casos 1 e 2 estão prontos como exemplo. Implemente os `it.todo()`:

- **3.** toggle duas vezes remove o favorito
- **4.** persiste favoritos no localStorage (desmonte e remonte o hook)
- **5.** chama `navigator.setAppBadge` com a contagem

Os comentários dentro de cada `it.todo()` descrevem o que fazer.

---

## Como rodar os testes

```bash
# Na pasta pratica/
cd exercicios/07-pwa-tmdb/pratica

# Rodar uma vez
npm test

# Modo watch (re-roda ao salvar)
npm run test:watch
```

Saída esperada depois do TODO 1:
```
✓ 02-tmdb-service.test.ts (3)   ← testes 1 e 2 verdes, 3 todo
```

---

## Testando o offline (demo em aula)

Depois do TODO 1 implementado:

1. `npm run dev` → abra http://localhost:5173
2. Deixe carregar os filmes (NetworkFirst busca + salva no IndexedDB)
3. Clique **📵 Offline** no toggle → app recarrega
4. Os filmes continuam aparecendo (IndexedDB serve o cache)
5. Clique **🗑 Limpar cache** → reload → estado vazio (sem rede + sem cache)
6. Clique **🌐 Online** → reload → fetch fresco

---

## Entrega

```bash
# Crie uma branch
git checkout -b feat/a7-pwa

# Commit após implementar
git add exercicios/07-pwa-tmdb/pratica/src/services/tmdb.ts
git add exercicios/07-pwa-tmdb/pratica/src/__tests__/unit/03-useFavorites.test.ts
git commit -m "feat(a7-pwa): implementa fetchPopularMovies e testes useFavorites"
git push origin feat/a7-pwa
```

Abra PR com título: `feat(a7-pwa): <seu-github-login>`

O bot comenta o score automático a cada commit.

---

## Critérios de avaliação

| Critério | Pts |
|---|---|
| `fetchPopularMovies` chama `tmdbClient.get('/movie/popular')` com `language: 'pt-BR'` | 8 |
| `fetchPopularMovies` propaga erro quando `tmdbClient` lança (ex.: token inv&aacute;lido) | 4 |
| `useFavorites` testes 3, 4, 5 implementados com asser&ccedil;&otilde;es reais _(revis&atilde;o manual)_ | 3 |
| **Total** | **15** |

---

## Links úteis

- [TMDB API — Movie Popular](https://developer.themoviedb.org/reference/movie-popular-list)
- [axios.get docs](https://axios-http.com/docs/req_config)
- [IndexedDB via idb](https://github.com/jakearchibald/idb)
- [Workbox Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview/)
- [MDN — Service Worker API](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API)
