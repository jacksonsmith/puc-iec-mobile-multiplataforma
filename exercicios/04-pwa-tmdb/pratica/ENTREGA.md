# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Gabriel Ceola · **GitHub:** Gabriel-ceola

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Em modo avião, recarregar mostra a página de erro do navegador ("Sem internet") | Recarrega normalmente: o Service Worker serve o app shell do precache e a lista vem do Cache Storage (`tmdb-api`) / IndexedDB | [`modo-aviao.png`](evidencias/modo-aviao.png) |
| 2 | Não tem Service Worker nem caches próprios em DevTools → Application | Application → Service Workers mostra o `sw.js` **activated**; Cache Storage tem `workbox-precache`, `tmdb-api` e `tmdb-images` | [`cache-storage-tmdb-api.png`](evidencias/cache-storage-tmdb-api.png) · [`cache-storage-tmdb-images.png`](evidencias/cache-storage-tmdb-images.png) |
| 3 | Só abre como aba do navegador, com barra de endereço | Tem manifest (`display: standalone`, ícones 192/512): o navegador oferece **Instalar** e o app abre em janela própria, sem barra de endereço, com ícone no menu/tela inicial | [`app-instalado.png`](evidencias/app-instalado.png) (PWA do professor instalado, aberto na janela "TMDB Popular Movies") |

## 2. Prova do offline no SEU build

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens): [`evidencias/cache-storage-tmdb-api.png`](evidencias/cache-storage-tmdb-api.png) (`/3/movie/popular?language=pt-BR&page=1`) e [`evidencias/cache-storage-tmdb-images.png`](evidencias/cache-storage-tmdb-images.png) (13 pôsteres, respostas `opaque`, por isso o `cacheableResponse` com status 0)
- [x] Print do app em **modo avião** carregando a lista: [`evidencias/modo-aviao.png`](evidencias/modo-aviao.png) (DevTools → Network → **Offline**, recarregado: lista e pôsteres aparecem, com 0 B transferidos)
- [x] Print do aviso **"Nova versão disponível"**: [`evidencias/nova-versao-disponivel.jpg`](evidencias/nova-versao-disponivel.jpg). Depois de **Atualizar**, a página recarregou com o texto novo ("Filmes Populares v2"): [`evidencias/apos-atualizar-v2.jpg`](evidencias/apos-atualizar-v2.jpg)
- Extra: aba **★ Favoritos** com 2 filmes e o banner **📡 Offline — exibindo dados do cache**: [`evidencias/favoritos-offline.jpg`](evidencias/favoritos-offline.jpg)

Como reproduzi o "Nova versão": `npm run build && npm run preview`, recarreguei uma vez (o app passa a ser controlado pelo SW e aparece "App pronto para uso offline"), mudei o título do `AppHeader`, rodei `npm run build` de novo e pedi um update do SW (Application → Service Workers → **Update**). O SW novo ficou em *waiting* e o toast apareceu. A mudança de texto foi só para o teste e não está no commit.

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

No **checkout** eu usaria `prompt`. O `autoUpdate` pode recarregar a página no meio do pagamento, apagar o que o usuário digitou ou deixar JS antigo e novo misturados durante a transação. Com `prompt`, o usuário termina a compra e só depois clica em Atualizar. O risco é ele clicar sempre em "Depois" e ficar preso numa versão velha, que pode quebrar quando o backend mudar o contrato da API. Para isso, dá para forçar o update em versões críticas ou atualizar num momento seguro, como depois da confirmação do pedido.
No app de **notícias** eu usaria `autoUpdate`. Ele tem pouco estado de formulário, e é melhor todo mundo receber logo correções e layout novos sem precisar decidir nada. O risco é a página recarregar enquanto a pessoa lê uma matéria e ela perder a posição da rolagem. Isso pode ser amenizado aplicando a atualização na próxima navegação.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. Usei o **Claude Code** (Anthropic) como assistente para implementar os TODOs 1–5, rodar `npm test`, `npm run build` e o validador do professor (12/12), e para testar o build no navegador (cache, Favoritos, banner offline e fluxo de atualização). Também usei para fazer um primeiro rascunho deste `ENTREGA.md`, que revisei e ajustei.
