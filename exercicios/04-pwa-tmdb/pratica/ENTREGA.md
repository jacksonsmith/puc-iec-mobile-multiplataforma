# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Allainn Christiam Jacinto Tavares · **GitHub:** Allainn

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Comparei o PWA do professor (`https://pwa-tmdb-aula4.vercel.app`) com o site do TMDB (`https://www.themoviedb.org`) no Microsoft Edge 155, em tela de celular (420 × 800), com o DevTools aberto. Para simular o modo avião usei **Rede → Offline** do próprio DevTools.

| # | Site comum (themoviedb.org) | PWA (pwa-tmdb-aula4) | Print/evidência |
|---|---|---|---|
| 1 | **Sem rede + recarregar:** o navegador mostra a página de erro dele ("Parece que você não está conectado à Internet", `ERR_INTERNET_DISCONNECTED`). O documento `www.themoviedb.org` falha (linha vermelha, sem status). | O app abre normalmente. O documento, o JS, o CSS e o manifest vêm com **200 do `(ServiceWorker)`**, a lista aparece e os pôsteres carregam. A página indica **0 B transferidos**. | [01](evidencias/01-site-comum-offline.png) · [02](evidencias/02-pwa-offline.png) |
| 2 | **Aplicativo → Service workers:** vazio, nenhum SW registrado para a origem. | `sw.js` **ativado e em execução**, controlando a página (ciclo Install → Wait → Activate). Em Armazenamento em Cache aparece o `workbox-precache` com o app shell. | [03a](evidencias/03a-site-comum-service-workers.png) · [03b](evidencias/03b-pwa-service-workers.png) · [03c](evidencias/03c-pwa-cache-storage.png) |
| 3 | **Fechar e reabrir (Rede, online):** 131 requisições, **147 kB transferidos**, carga completa em **6,13 s**. Scripts de terceiros (analytics, telemetria, banner de cookies) vão ao servidor de novo. | 17 requisições, **0 B transferidos**, carga em **401 ms**. O documento e o JS saem do `(ServiceWorker)` e os pôsteres do cache do navegador. | [04a](evidencias/04a-site-comum-reabrir-network.png) · [04b](evidencias/04b-pwa-reabrir-network.png) |

**O que me surpreendeu:**
- **Instalar não foi a diferença.** O TMDB também tem manifest com `display: standalone`, e o Edge não aponta erro de instalabilidade em nenhum dos dois ([05a](evidencias/05a-site-comum-manifesto.png) · [05b](evidencias/05b-pwa-manifesto.png)). O que separa os dois é o Service Worker: o TMDB instalado continuaria dependendo da rede para abrir.
- **O PWA do professor não tem `runtimeCaching`.** O Cache Storage dele só tem o `workbox-precache` ([03c](evidencias/03c-pwa-cache-storage.png)). Offline, a lista vem do IndexedDB e os pôsteres saem do cache HTTP do navegador (`(memory cache)` / `(disk cache)` no print 02), que o navegador pode descartar a qualquer momento. O TODO 2 resolve isso.

## 2. Prova do offline no SEU build

Build local: `npm run build && npm run preview` → http://localhost:4173. Na 1ª visita aparece "✅ App pronto para uso offline" ([08](evidencias/08-pronto-offline.png)). Depois recarreguei uma vez para o SW controlar a página e rolei a lista para baixar os pôsteres.

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens):
  - [06a](evidencias/06a-cache-storage-tmdb-api.png): `tmdb-api` com 2 respostas `cors` de `/3/movie/popular?language=pt-BR&page=1` e `page=2`.
  - [06b](evidencias/06b-cache-storage-tmdb-images.png): `tmdb-images` com **40 pôsteres**, todos `opaque` (`image.tmdb.org` sem CORS). Sem o `cacheableResponse: { statuses: [0, 200] }` nenhum deles teria entrado no cache.
- [x] Print do app em **modo avião** carregando a lista ([07](evidencias/07-modo-aviao.png)): com Rede → Offline e recarregando, as 29 requisições respondem **200 do `(ServiceWorker)`** com 0 B transferidos: documento, JS, `popular?language=pt-BR&page=1` e os pôsteres.
  - Também offline: a lista com os pôsteres ([09](evidencias/09-offline-inicio.png)) e a aba ★ Favoritos com a faixa "📡 Offline — exibindo dados do cache" ([10](evidencias/10-offline-favoritos.png)).
- [x] Print do aviso **"Nova versão disponível"** ([11](evidencias/11-nova-versao.png)). Com o preview aberto, mudei o título para "Filmes Populares v2", rodei `npm run build` de novo e pedi `update()` ao SW. O SW novo ficou em `waiting` e o aviso apareceu com **Atualizar / Depois**. Em Atualizar, a página recarregou com o título novo ([12](evidencias/12-atualizado.png)). Depois reverti o título.

Testes: `npm test` com **19/19** verdes: 8 modelos do professor (`01-MovieCard` e `03-useFavorites`), 2 do TODO 1, 1 caso extra de `page` no `02-tmdb-service` e 8 autorais (`04-useOfflineStatus` e `05-favorites-tab`).

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

**Checkout → `prompt`.** No `autoUpdate` o SW novo assume sozinho e a página recarrega; no meio de um pagamento isso pode apagar o formulário, reenviar um pedido ou trocar o JavaScript entre o "Confirmar" e a resposta do servidor. Com `prompt`, o usuário termina a compra e atualiza quando quiser. O risco é o contrário: quem sempre clica "Depois" continua numa versão antiga, que pode quebrar quando a API mudar ou ficar sem uma correção de segurança. Eu mitigaria versionando a API e exigindo a atualização quando a versão do cliente não for mais aceita. **Notícias → `autoUpdate`.** Não há transação para perder, o conteúdo já vem da rede (NetworkFirst) e vale mais todo leitor receber logo a correção de layout ou de bug. O que pode dar errado: o recarregamento automático tira o leitor do ponto do artigo em que estava, ou o deixa por um instante com HTML de uma versão e JS de outra.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. Usei o **Claude Code** (Anthropic, modelo Claude Opus 5.5) como par de programação:

- **Código:** implementou os TODOs 1 a 5, com um commit por TODO, e escreveu os testes extras (caso 3 de `02-tmdb-service` e os arquivos `04-useOfflineStatus` e `05-favorites-tab`). Também rodou o autograder do professor localmente (12/12).
- **Evidências:** tirou todos os prints desta entrega. Ele controlou um Edge headless pelo Chrome DevTools Protocol e abriu o **DevTools do próprio Edge** (frontend embutido) numa aba ao lado. Os painéis, os números e o "Offline" escolhido em Rede são do DevTools de verdade. Por ser headless, não houve instalação em janela própria; no lugar dela, comparei os painéis Manifesto.
- **Texto:** redigiu este `ENTREGA.md` a partir do que aparece nos prints, incluindo as duas observações da seção 1.

Revisei o código, as decisões (hosts e estratégias de cache, status 0 para os pôsteres opacos, `prompt` no lugar de `autoUpdate`), os prints e a reflexão antes de entregar.

## Referências

- GOOGLE. **Workbox: caching strategies overview**. Chrome for Developers. Disponível em: https://developer.chrome.com/docs/workbox/caching-strategies-overview/. Acesso em: 19 out. 2026.
- GOOGLE. **Learn PWA**. web.dev. Disponível em: https://web.dev/learn/pwa. Acesso em: 19 out. 2026.
- VITE PWA. **Automatic reload** e **Prompt for update**. Disponível em: https://vite-pwa-org.netlify.app/guide/auto-update.html. Acesso em: 19 out. 2026.
- MOZILLA. **Service Worker API**. MDN Web Docs. Disponível em: https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API. Acesso em: 19 out. 2026.
