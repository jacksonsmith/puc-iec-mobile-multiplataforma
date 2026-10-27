# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Daniel Silveira Moreira · **GitHub:** DanielSilveiraM

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Comparei `https://pwa-tmdb-aula4.vercel.app` (PWA) com `https://www.themoviedb.org` (site comum): modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | **Offline:** com o DevTools em Offline, ao recarregar o themoviedb.org aparece a página do dinossauro (`ERR_INTERNET_DISCONNECTED`), e a requisição do documento falha. | Com o DevTools em Offline, o PWA recarrega normalmente, mostrando a lista com título, notas e pôsteres. O Network mostra o HTML e os pôsteres já vistos voltando 200 do Service Worker. Só os pôsteres que eu ainda não tinha visto falharam (não estavam no cache). | [`01a-offline-pwa.png`](evidencias/01a-offline-pwa.png) · [`01b-offline-site-comum.png`](evidencias/01b-offline-site-comum.png) |
| 2 | **Instalação:** o Chrome não oferece instalar. Só dá para salvar um favorito, que abre o site dentro do navegador. | O Chrome mostra o ícone de instalar na barra de endereço e o diálogo **"Instale o app — Acesse este site em uma janela exclusiva no seu computador"**, com nome ("TMDB Popular Movies") e ícone próprios. O app também tem um banner "Instale o app na tela inicial". | [`02-instalar.png`](evidencias/02-instalar.png) |
| 3 | **Bastidores (DevTools → Application):** o site não declara um manifest de app, então não há nome, ícone nem modo de exibição para instalação. | Em Application → **Manifest** aparecem nome, short name, descrição, `start_url: /`, cores de tema e fundo e **`display: standalone`**. É isso que permite o Chrome instalar o site como app e abri-lo sem a barra de endereço. | [`03-application-manifest.png`](evidencias/03-application-manifest.png) |

## 2. Prova do offline no SEU build

Build local: `npm run build && npm run preview` → http://localhost:4173

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens): [`evidencias/04-cache-storage.png`](evidencias/04-cache-storage.png)
  Os três caches aparecem (`workbox-precache`, `tmdb-api` e `tmdb-images`). Os pôsteres estão com Response-Type **`opaque`**, a resposta de status 0 que só entra no cache por causa do `cacheableResponse: { statuses: [0, 200] }`. O total de **200 entradas** mostra o `maxEntries: 200` limitando o cache.
- [x] Print do app em **modo avião**: [`evidencias/05-modo-aviao.png`](evidencias/05-modo-aviao.png)
  Com o DevTools em **Offline**, a página recarrega e todas as requisições (HTML, JS, `popular?page=1` e os pôsteres) voltam **200, servidas pelo Service Worker**. A aba Favoritos mostra o banner "📡 Offline — exibindo dados do cache".
  Observação: no print a aba mostra "Nenhum favorito" embora o contador indique 2. Os favoritos estavam em páginas da lista (2 em diante) que não tinham sido carregadas depois do reload, e a aba só filtra os filmes já carregados. Ajustei a mensagem para avisar esse caso ("Seus N favorito(s) estão em páginas ainda não carregadas").
- [x] Print do aviso **"Nova versão disponível"**: [`evidencias/06-nova-versao.png`](evidencias/06-nova-versao.png)
  Com o preview rodando, alterei o código e rodei `npm run build` de novo. Em Application → Service workers → **Update**, o SW novo (#910) ficou em **"waiting to activate"** enquanto o antigo (#909) continuava ativo. Por causa do `registerType: 'prompt'`, o app mostrou o aviso com **Atualizar** e **Depois** em vez de trocar de versão sozinho.

## 3. Reflexão (5–8 linhas)

Para um app de **checkout** eu escolheria **`prompt`**. Se o app se atualizar sozinho no meio de uma compra, a página recarrega e o usuário pode perder o carrinho ou o formulário preenchido. Também pode acontecer de a tela antiga conversar com uma API já alterada, o que gera erro justamente no pagamento. Com `prompt`, o usuário termina a compra e atualiza quando quiser. O risco é ele clicar em "Depois" para sempre e ficar numa versão antiga, com correção de bug ou de segurança pendente. Por isso vale forçar a atualização quando a versão antiga deixar de ser compatível com o backend.

Para um app de **notícias** eu escolheria **`autoUpdate`**. O usuário só lê e não tem estado importante a perder, e o valor do app está em mostrar sempre a versão mais recente sem fricção. O risco é o recarregamento automático acontecer no meio de uma leitura e tirar o leitor do ponto onde estava.

## 4. Declaração de uso de IA

Usei um assistente de IA para implementar os TODOs (`fetchPopularMovies`, `runtimeCaching`, `UpdatePrompt`, aba Favoritos e `useOfflineStatus`) e para rascunhar este documento. Revisei o código e rodei `npm test`, `npm run build` e o validador da atividade localmente. As evidências do DevTools foram capturadas por mim.
