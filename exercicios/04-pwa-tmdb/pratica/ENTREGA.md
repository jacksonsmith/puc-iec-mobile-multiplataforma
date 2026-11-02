# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** João Almeida · **GitHub:** joaoabjr

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Precisa de internet para carregar os filmes. | Consegui recarregar e visualizar os filmes mesmo offline. | [offline.png](./evidencias/offline.png) |
| 2 | Não fica instalado como aplicativo. | Pode ser instalado e aberto em uma janela própria. | [pwa.png](./evidencias/pwa.png) |
| 3 | Não mantém o conteúdo disponível no cache do navegador da mesma forma. | Usa cache para guardar os dados da API e as imagens dos pôsteres. | [cache.png](./evidencias/cache.png) |

## 2. Prova do offline no SEU build

- [x] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens): [cache.png](./evidencias/cache.png)
- [x] Print do app em **modo offline** carregando a lista: [offline.png](./evidencias/offline.png)
- [x] Print da aplicação instalada como PWA: [pwa.png](./evidencias/pwa.png)

Não consegui reproduzir o aviso "Nova versão disponível", pois ele depende da publicação de uma nova versão do Service Worker.

(Coloque os prints numa pasta `evidencias/` e referencie aqui.)

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para um app de checkout, eu escolheria `prompt`, porque não é bom atualizar a aplicação durante uma compra. O usuário pode continuar usando a versão atual e atualizar depois de finalizar o pedido. Para um app de notícias, eu escolheria `autoUpdate`, pois é mais importante mostrar rapidamente as correções e as notícias mais recentes. O problema do `autoUpdate` é interromper uma ação do usuário ou recarregar a tela inesperadamente. Já no `prompt`, o usuário pode ignorar uma atualização importante por muito tempo.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Usei IA como apoio durante a atividade, principalmente para tirar dúvidas sobre o enunciado, entender alguns erros e conferir a implementação. As decisões finais, os testes e as evidências foram feitos e conferidos por mim.
