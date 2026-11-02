# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Paulo Henrique Nunes Vanderley · **GitHub:** paulnune

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Comparei o PWA do professor (`https://pwa-tmdb-aula4.vercel.app`) com o site do próprio TMDB (`https://www.themoviedb.org`). Um detalhe que me surpreendeu: o themoviedb.org **também tem manifest** (`/manifest.json`, `display: standalone`), mas **não tem Service Worker** (`/sw.js` dá 404). Ou seja, manifest é o que torna o site instalável, e Service Worker é o que o faz funcionar offline. São peças independentes.

| # | Site comum (themoviedb.org) | PWA | Print/evidência |
|---|---|---|---|
| 1 | **Modo avião + recarregar:** o navegador mostra a própria página de erro (`ERR_INTERNET_DISCONNECTED`). Nada do site carrega, porque não há Service Worker para responder no lugar da rede. | **Modo avião + recarregar:** o app abre com a lista e os pôsteres. O HTML, o JS e o CSS vêm do *precache* do Service Worker, e os dados e imagens vêm do *runtime cache* (`tmdb-api`, `tmdb-images`) e do IndexedDB. | [site comum](evidencias/01-site-comum-offline.png) · [PWA](evidencias/02-pwa-offline.png) |
| 2 | **Fechar e reabrir:** o HTML vem sempre do servidor. Num F5 com o Network aberto, o documento veio da rede (200), e quase todo o resto, 106 de 110 requisições, saiu do cache HTTP do navegador (`(memory cache)` e `(disk cache)` na coluna *Size*). Isso acelera, mas não basta: sem rede o HTML não chega, e a página não abre. | **Fechar e reabrir:** abre na hora com os mesmos filmes e favoritos. O app shell sai do Service Worker (no Network, a coluna *Size* mostra `(ServiceWorker)`), os filmes do IndexedDB e os favoritos do `localStorage`. No meu build, reabrir fez 23 requisições com **0 B transferidos**. | [Network do meu build ao reabrir](evidencias/09-network-service-worker.png) |
| 3 | **Instalar:** o Chrome também deixa instalar o themoviedb.org. Ele tem manifest com `display: standalone`, e o Chrome não aponta nenhum erro de instalabilidade, mesmo sem Service Worker. Só que o app instalado continuaria dependendo da rede: sem Service Worker, nada responde offline (linha 1). | **Instalar:** o app mostra a própria faixa "📲 Instale o app na tela inicial", com um botão **Instalar** que chama o `prompt()` guardado do evento `beforeinstallprompt`. Instalado, abre em janela própria, sem barra de endereço (`display: standalone`). Continua funcionando sem rede, porque o Service Worker é o mesmo. Ao instalar, a própria aba virou a janela do app. | [app instalado](evidencias/10-app-instalado.png) |

## 2. Prova do offline no SEU build

Build de produção (`npm run build && npm run preview`), testado no Chrome em tela de celular (a barra de abas só aparece até 768 px de largura).

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens): [tmdb-api](evidencias/08-cache-storage.png) (a resposta de `/movie/popular`, tipo `cors`) e [tmdb-images](evidencias/08b-cache-storage-imagens.png) (20 pôsteres com Response-Type **`opaque`**, a resposta opaca que só entra no cache por causa do `cacheableResponse: { statuses: [0, 200] }`)
- [x] Print do app **sem rede** carregando a lista: [evidencias/03-build-offline-lista.png](evidencias/03-build-offline-lista.png)
- [x] Banner offline na aba Favoritos: [evidencias/04-favoritos-offline.png](evidencias/04-favoritos-offline.png)
- [x] Aviso **"App pronto para uso offline"** na 1ª visita: [evidencias/05-pronto-offline.png](evidencias/05-pronto-offline.png)
- [x] Aviso **"Nova versão disponível"**: [evidencias/06-nova-versao.png](evidencias/06-nova-versao.png). Mudei um texto, rodei `npm run build` de novo e forcei a checagem (equivalente ao *Update* do DevTools). Depois de clicar em Atualizar, a página recarregou com o texto novo: [evidencias/07-depois-de-atualizar.png](evidencias/07-depois-de-atualizar.png)

Os prints 01 a 07 foram gerados com Playwright (Chromium em tela de Pixel 7), com a rede desligada por `context.setOffline(true)`, que simula o modo avião. Os prints 08, 08b e 09 são do DevTools do Google Chrome, aberto no build de produção e controlado pelo mesmo Playwright. O 10 é a janela do PWA do professor, instalado no Google Chrome pelo botão Instalar da própria página.

**Contraprova:** a API do TMDB responde com `Cache-Control: max-age` de ~1 h, então o cache HTTP do navegador também segura os dados offline por um tempo. Para provar que o Service Worker funciona sozinho, repeti o teste limpando o cache HTTP e deixando uma camada por vez. Só com o `tmdb-api`, a lista volta (20 filmes). Só com o IndexedDB, também volta. Sem nenhuma das duas, o app abre (app shell do precache), mas mostra "Nenhum filme para exibir ainda".

## 3. Reflexão (5–8 linhas)

Para o **checkout** eu escolheria `prompt`. Com `autoUpdate`, o Service Worker novo assume sozinho e a página recarrega no meio do pagamento, o que pode perder o carrinho e o formulário ou deixar a transação em estado incerto. Com `prompt`, o usuário termina a compra e atualiza depois. O risco é ele nunca clicar em "Atualizar" e continuar numa versão antiga, que pode quebrar quando a API mudar ou ficar sem uma correção urgente. Por isso eu versionaria a API e insistiria no aviso quando a correção for crítica. Para **notícias** eu escolheria `autoUpdate`: é conteúdo de leitura, recarregar custa pouco e o leitor sempre vê a versão mais nova sem precisar decidir nada. O que pode dar errado é a página recarregar enquanto alguém lê ou escreve um comentário. Dá para reduzir isso atualizando só quando a aba volta do segundo plano ou na próxima navegação.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. Usei o Claude Code (Anthropic) como assistente de programação em toda a atividade. Ele implementou os TODOs 1 a 5 e o teste que estava como `it.todo` no `02-tmdb-service.test.ts`. Também rodou `npm test`, `npm run build` e o autograder localmente, gerou os prints (Playwright e DevTools do Google Chrome) e redigiu este arquivo, inclusive a reflexão da seção 3. Eu conduzi o trabalho: pedi as verificações no navegador e um guia de teste e de estudo de cada TODO para a defesa, e decidi quando entregar.
