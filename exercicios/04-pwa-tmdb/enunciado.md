# Atividade 4 — PWA: filmes populares, instalável e offline (15 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Entrega:** ver Canvas
**Modalidade:** individual · fork + PR no repositório da disciplina
**Tempo estimado:** ~3-4 horas (a parte 1 começa em aula)
**Dificuldade:** ⭐⭐ Médio

---

## Contexto

Na Atividade 3 você construiu offline-first no Flutter (cache, TTL, fila de sincronização). Agora a mesma ideia **na web**: quem faz o papel do disco e da camada de dados é o **Service Worker** (Cache Storage) + **IndexedDB**.

Você recebe um app de filmes (React + Vite + TMDB) **que já é instalável e funciona com dados em IndexedDB**, mas com a parte de PWA **em branco**: a configuração de cache do Service Worker e a atualização do app **são trabalho seu**.

> **Antes de codar (10 min):** abra o PWA publicado pelo professor (`https://pwa-tmdb-aula4.vercel.app`) e compare com um site comum — modo avião, fechar e reabrir, instalar. Isso vira a seção 1 do seu `ENTREGA.md`.

---

## Antes de começar

Siga o **[README da `pratica/`](pratica/README.md)** (clone novo, branch, setup e token do TMDB).

```bash
cd exercicios/04-pwa-tmdb/pratica
ls src/services      # confirma o lugar: tmdb.ts  db.ts
```

> **Windows:** `cd exercicios\04-pwa-tmdb\pratica` e `dir src\services`

---

## O que você implementa

| # | Onde | O quê | Pts |
|---|---|---|---|
| 1 | `src/services/tmdb.ts` | `fetchPopularMovies()` | 2 |
| 2 | `vite.config.ts` | `runtimeCaching`: **API** (NetworkFirst) e **pôsteres** (CacheFirst) | 4 |
| 3 | `vite.config.ts` + `src/components/UpdatePrompt.tsx` | atualização do app: `registerType: 'prompt'` + aviso "Nova versão" | 3 |
| 4 | `src/screens/HomeScreen.tsx` | aba **★ Favoritos** (lista + estado vazio) | 2 |
| 5 | `src/hooks/useOfflineStatus.ts` | hook online/offline + banner na aba Favoritos | 1 |
| — | `ENTREGA.md` | evidências + reflexão (manual, Canvas) | 3 |
| | | **Total** | **15** |

Os comentários `TODO` em cada arquivo trazem a especificação detalhada.

### TODO 1 — `fetchPopularMovies`

`GET /movie/popular` com `params: { language: 'pt-BR', page }`; retorne o `data` da resposta. Use o `tmdbClient` já configurado. **Verificação:** `npm test` — `02-tmdb-service.test.ts` fica verde.

### TODO 2 — `runtimeCaching` (aqui mora o PWA offline)

Em `vite.config.ts`, dentro de `workbox.runtimeCaching`, escreva **duas regras**:

| | Host | Estratégia | Detalhes |
|---|---|---|---|
| (a) | API de filmes | **NetworkFirst** | desiste da rede em **3 s**; `cacheName: 'tmdb-api'`; até **50** entradas, **1 dia** |
| (b) | Pôsteres | **CacheFirst** | `cacheName: 'tmdb-images'`; até **200** entradas, **7 dias** |

**Dois conceitos que você vai usar aqui** (cada regra do Workbox casa por **URL**, então você precisa saber de onde vem cada recurso):

1. **De qual host vem cada tipo de recurso?** A API e os pôsteres não ficam no mesmo servidor. Para descobrir: DevTools → **Network** → recarregue → filtre por **Fetch/XHR** (API) e depois por **Img** (pôsteres) → olhe a coluna **Domain** (ou clique numa requisição → *Headers → Request URL*). Se o `urlPattern` não casar com essa URL, a regra nunca dispara e o cache fica vazio — esse é o primeiro sintoma para diagnosticar.
2. **Resposta opaca (status 0).** Uma `<img>` de outra origem, sem CORS, é carregada como resposta *opaca*: o navegador a exibe, mas o código não consegue ler o status. Por padrão o Workbox só guarda respostas `200`, então é preciso dizer explicitamente quais status aceitar. Leia sobre `cacheableResponse` na doc do Workbox (link abaixo) e decida o que faz sentido para pôsteres.

**Como conferir:** `npm run build && npm run preview` (o SW **não roda** no `npm run dev`) → DevTools → Application → **Cache Storage**: devem existir `tmdb-api` e `tmdb-images` com itens.

### TODO 3 — atualização do app

- **Parte 1** (`vite.config.ts`): hoje o app se atualiza sozinho (`autoUpdate`). Mude para o modo em que **o usuário decide** quando atualizar.
- **Parte 2** (`UpdatePrompt.tsx`): com `useRegisterSW`, mostre (i) "App pronto para uso offline" e (ii) "Nova versão disponível" com **Atualizar** e **Depois**. Sem aviso ativo, retorne `null`.

**Como conferir** (o SW só atualiza com o app já *controlado* por ele):
1. `npm run build && npm run preview`, abra http://localhost:4173 e **recarregue uma vez** (aparece o aviso "pronto para uso offline" na 1ª visita)
2. Com o preview rodando, mude um texto qualquer no código e rode `npm run build` de novo
3. Na aba aberta: DevTools → Application → Service Workers → **Update** → deve aparecer **"Nova versão disponível"**; clique **Atualizar** e a página recarrega com o texto novo

### TODO 4 — aba Favoritos

**Passo 1:** filtre `movies` por `isFavorite(m.id)` e renderize um `MovieCard` por favorito. **Passo 2:** estado vazio — `isEmpty` → `'Nenhum filme carregado ainda.'`; senão → `'Nenhum favorito ainda — toque ★ em um filme.'`

### TODO 5 — `useOfflineStatus`

`useState(navigator.onLine)`, listeners `online`/`offline` com cleanup, e o banner `📡 Offline — exibindo dados do cache` na aba Favoritos. **Teste:** DevTools → Network → Offline.

---

## `ENTREGA.md` (3 pts, avaliação manual)

Preencha o modelo em `pratica/ENTREGA.md`:

1. **Site comum × PWA** — 3 diferenças que você **viu** (com print do DevTools → Application ou do app instalado)
2. **Prova do offline** — print do Cache Storage com `tmdb-api` e `tmdb-images`, e do app aberto em modo avião
3. **Reflexão (5-8 linhas)** — `autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê?

---

## Entrega

**Comece com um clone novo** (sem sincronizar fork, sem conflito):

```bash
git clone https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma.git a4-pwa
cd a4-pwa
git switch -c feat/a4-pwa
git remote add meu https://github.com/<seu-login>/puc-iec-mobile-multiplataforma.git
cd exercicios/04-pwa-tmdb/pratica
ls src/services      # confirma que está no lugar certo: tmdb.ts  db.ts
```

Faça os TODOs e envie:

```bash
cd ../../..          # volta pra raiz do clone
git add exercicios/04-pwa-tmdb/pratica
git commit -m "feat(a4-pwa): runtimeCaching, atualizacao do app e aba Favoritos"
git push -u meu feat/a4-pwa
```

Abra o PR **da branch `feat/a4-pwa` do seu fork para o `main` do professor**, com título: `feat(a4-pwa): <seu-github-login>`.

> Deu conflito ou erro estranho? **Não resolva** — clone de novo numa pasta nova e copie só os arquivos que você editou.

O bot comenta a **nota mínima automática** a cada commit (ele lê seus arquivos; não executa seu código). Evidências, reflexão e qualidade entram na nota final lançada no Canvas.

**Critério eliminatório:** `npm run build` precisa passar — se não buildar, os pontos de PWA ficam zerados.

---

## Critérios de avaliação (15 pts)

| Critério | Pts | Avaliação |
|---|---|---|
| TODO 1 — `fetchPopularMovies` chama `/movie/popular` com `pt-BR` e retorna `data` | 2 | 🤖 automática |
| TODO 2a — API: `NetworkFirst`, `networkTimeoutSeconds: 3`, `tmdb-api`, `expiration` (50 entradas) | 2 | 🤖 |
| TODO 2b — Pôsteres: host correto, `CacheFirst`, `tmdb-images`, `expiration` (200), `cacheableResponse` com status 0 | 2 | 🤖 |
| TODO 3a — `registerType: 'prompt'` | 1 | 🤖 |
| TODO 3b — `UpdatePrompt` com `needRefresh`, `offlineReady`, `updateServiceWorker` e dispensar | 2 | 🤖 |
| TODO 4 — aba Favoritos (lista 1 · estado vazio 1) | 2 | 🤖 |
| TODO 5 — `useOfflineStatus` com listeners + cleanup e banner | 1 | 🤖 |
| `ENTREGA.md` — evidências e comparação site × PWA | 2 | 📝 Canvas |
| `ENTREGA.md` — reflexão `autoUpdate` × `prompt` | 1 | 📝 Canvas |
| **Total** | **15** | |

---

## 🎁 Bônus (não pontua)

- **`window-controls-overlay`**: troque `display: 'standalone'` por `'window-controls-overlay'` no manifest ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowControlsOverlay)).
- **Badging API:** o hook `useFavorites` já chama `navigator.setAppBadge` — instale o PWA no desktop e veja o número no ícone.

---

## Links úteis

- [web.dev — Learn PWA](https://web.dev/learn/pwa) (módulos *Caching*, *Workbox*, *Update*)
- [Workbox — estratégias de cache](https://developer.chrome.com/docs/workbox/caching-strategies-overview/)
- [vite-plugin-pwa — `registerType` e `useRegisterSW`](https://vite-pwa-org.netlify.app/guide/auto-update.html)
- [MDN — Service Worker API](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API)
- [TMDB API — Movie Popular](https://developer.themoviedb.org/reference/movie-popular-list)
