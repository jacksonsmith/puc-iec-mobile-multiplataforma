# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Diego Diógenes · **GitHub:** diegodiogenes · **Matrícula:** 255123

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum (themoviedb.org) | PWA (pwa-tmdb-aula4.vercel.app / meu build) | Print/evidência |
|---|---|---|---|
| 1 | **Recarregar em modo avião:** página de erro do navegador (dinossauro, `ERR_INTERNET_DISCONNECTED`) | Recarrega normalmente e mostra a lista de filmes (HTML/JS/CSS do **precache** do Service Worker + dados vindos do **IndexedDB**) | [`01-site-offline-reload.png`](evidencias/01-site-offline-reload.png) × [`01-ref-offline.png`](evidencias/01-ref-offline.png) |
| 2 | **Sem Service Worker / sem manifest:** não existe o conceito de "instalar"; toda visita depende 100% da rede | `sw.js` *activated* controlando o escopo, manifest `standalone` com ícones — o app é **instalável** e abre sem barra de navegador | [`01-pwa-manifest-sw.png`](evidencias/01-pwa-manifest-sw.png) |
| 3 | **Fechar e reabrir offline:** abre só a página de erro — nada persiste | Fechando a aba e reabrindo ainda offline, o app abre direto na lista (precache + `start_url`) | [`01-pwa-reopen-offline.png`](evidencias/01-pwa-reopen-offline.png) |

## 2. Prova do offline no SEU build

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens) → [`02-cache-storage.png`](evidencias/02-cache-storage.png) (dump bruto: [`02-cache-storage.txt`](evidencias/02-cache-storage.txt))
- [x] Print do app em **modo avião** carregando a lista → [`02-app-offline.png`](evidencias/02-app-offline.png)
- [x] Print do aviso **"Nova versão disponível"** → [`02-nova-versao.png`](evidencias/02-nova-versao.png) e, após clicar em **Atualizar**, [`02-apos-atualizar.png`](evidencias/02-apos-atualizar.png)

Extras: [`02-favoritos-online.png`](evidencias/02-favoritos-online.png) (aba Favoritos online) e [`02-favoritos-offline.png`](evidencias/02-favoritos-offline.png) (banner `📡 Offline — exibindo dados do cache` do TODO 5); [`01-pwa-online.png`](evidencias/01-pwa-online.png) e [`01-pwa-offline-reload.png`](evidencias/01-pwa-offline-reload.png) (mesmo teste do item 1 no meu build).

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para um app de **checkout** eu escolheria `prompt`, imaginando o seguinte cenário: no meio de um pagamento o `autoUpdate` pode recarregar a página e perder o estado do formulário/carrinho, gerando o risco de interromper a transação ou o usuário não saber se foi cobrado. Com `prompt` a nova versão fica em *waiting* e o usuário decide quando atualizar. O problema da abordagem do prompt é que os usuários que sempre clicam "Depois", ou seja, nunca atualizam, ficam presos em versão antiga, e uma correção crítica de bug demora mais para atualizar (precisa de comunicação/alternativa, como expirar a versão).

Para um app de **notícias** eu usaria `autoUpdate`: a sessão é curta e quase sem estado, então um reload silencioso raramente destrói trabalho. Assim, todos recebem correções e ajustes imediatamente, sem depender de ação do usuário. O que pode dar errado nessa escolha: o reload surpresa pode cortar a leitura de uma matéria longa (perde a posição do scroll) e, se sair um deploy quebrado, ele chega instantaneamente para todo mundo, ninguém tem a opção de adiar a atualização.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. Usei o **OpenCode com o modelo GPT Luna** como apoio para entender os requisitos, implementar os TODOs, executar os testes e o validador, e gerar evidências com Playwright. Também usei IA como apoio para preparar o `ENTREGA.md`. Revisei todo o conteúdo produzido, incluindo o código, as evidências e o próprio `ENTREGA.md`, e ajustei trechos para refletir meu entendimento e o que foi observado nos testes.
