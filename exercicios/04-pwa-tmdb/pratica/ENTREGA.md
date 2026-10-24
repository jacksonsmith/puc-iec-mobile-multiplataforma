# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Rafael Lima · **GitHub:** olimarafael

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | **Offline (modo avião → recarregar):** o themoviedb.org não carrega nada — aparece a página de erro do Chrome (dinossauro, `ERR_INTERNET_DISCONNECTED`) | **Offline:** o `pwa-tmdb-aula4.vercel.app` abre normalmente, com a lista de filmes, os pôsteres e a barra de abas, tudo servido pelo cache do Service Worker | [`evidencias/pwa-site-offline.png`](evidencias/pwa-site-offline.png) (PWA à esquerda × themoviedb.org à direita, ambos em "Off-line") |
| 2 | **Fechar e reabrir:** o themoviedb.org volta para a home genérica ("Welcome", Trending) e baixa tudo de novo do servidor; nada do que eu fiz na visita anterior fica guardado no aparelho | **Fechar e reabrir:** o PWA volta com o meu estado salvo localmente — os 3 filmes que favoritei continuam na aba ★ Favoritos (com o badge "3"), sem precisar de login nem de servidor | [`evidencias/pwa-site-reabrir.png`](evidencias/pwa-site-reabrir.png) |
| 3 | **Instalar:** o themoviedb.org não oferece instalação; no máximo vira um favorito/atalho e continua abrindo dentro de uma aba do navegador | **Instalar:** o PWA mostra o banner "Instale o app na tela inicial" com botão **Instalar**, e o Chrome exibe o ícone de instalação na barra de endereço (graças ao manifest + Service Worker); instalado, abre em janela própria (`display: standalone`) | [`evidencias/pwa-site-instalar.png`](evidencias/pwa-site-instalar.png) |

## 2. Prova do offline no SEU build

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens) — [`evidencias/tmdb-api.png`](evidencias/tmdb-api.png) (páginas 1 e 2 de `/3/movie/popular?language=pt-BR`) · [`evidencias/tmdb-images.png`](evidencias/tmdb-images.png)
- [x] Print do app em **modo avião** carregando a lista — [`evidencias/offline-lista.png`](evidencias/offline-lista.png) (DevTools → Rede em "Off-line", requisições servidas do Service Worker) · [`evidencias/offline-banner.png`](evidencias/offline-banner.png) (banner "📡 Offline — exibindo dados do cache" na aba Favoritos)
- [x] Print do aviso **"Nova versão disponível"** — [`evidencias/todo3-passo1.png`](evidencias/todo3-passo1.png) (aviso exibido) · [`evidencias/todo3-passo2.png`](evidencias/todo3-passo2.png) (após clicar em Atualizar, título alterado para "Filmes Populares Rafael")

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para o **checkout** eu escolheria `prompt`: o usuário pode estar no meio do pagamento, e um reload automático no meio do fluxo pode perder o carrinho/formulário ou até gerar uma cobrança duplicada. O risco do `prompt` é o usuário clicar "Depois" sempre e ficar preso numa versão antiga — se a API do backend mudar, essa versão velha pode quebrar; por isso o backend precisa continuar compatível por um tempo (ou forçar a atualização em mudanças críticas). Para o **notícias** eu escolheria `autoUpdate`: o conteúdo é de leitura, não há estado importante a perder, e o usuário quer sempre a versão mais nova sem ser interrompido por avisos. O risco do `autoUpdate` é a página recarregar no meio de uma leitura (o usuário perde a posição do scroll) ou abas antigas rodarem código novo misturado com assets velhos, gerando erros difíceis de reproduzir.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. Usei o Claude Code (assistente de IA no VS Code) para me explicar alguns pontos de sintaxe, principalmente. Ele me ajudou a diagnosticar erros (o `Cannot read properties of undefined (reading 'length')` do TODO 1, causado por retornar a resposta inteira do axios em vez do `data`) e a entender por que a barra de abas só aparece em largura de celular. Utilizei também para rascunhar este ENTREGA.md, eu revisei e ajustei as informações.