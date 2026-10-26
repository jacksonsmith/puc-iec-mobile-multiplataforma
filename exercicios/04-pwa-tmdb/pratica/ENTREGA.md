# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Gabriel Campos Ferreira Lisboa · **GitHub:** gabrielcflisboa

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Sem rede, o navegador mostra a página de erro "sem internet" | O app abre e mostra a lista de filmes e os pôsteres, servidos pelo Service Worker (DevTools → Rede: coluna "Cumprido por" = ServiceWorker, 0 B transferidos) | [offline-pwa.png](evidencias/offline-pwa.png) |
| 2 | Cada visita refaz todas as requisições à rede | A API usa NetworkFirst e os pôsteres CacheFirst: ficam nos caches `tmdb-api` e `tmdb-images` e carregam sem rede | [cache-storage.png](evidencias/cache-storage.png) |
| 3 | Vive só numa aba do navegador, com barra de endereço | Tem manifest e botão "Instalar": vira app instalado, com ícone e janela própria (standalone) | Banner "Instale o app" visível nos prints |

## 2. Prova do offline no SEU build

- [x] Cache Storage com `tmdb-api` e `tmdb-images`: [evidencias/cache-storage.png](evidencias/cache-storage.png)
- [x] App em modo offline (Rede → Offline) carregando a lista: [evidencias/offline-pwa.png](evidencias/offline-pwa.png)
- [ ] Aviso "Nova versão disponível": não reproduzi nesta entrega; o `UpdatePrompt` está implementado com `useRegisterSW` (`needRefresh`, `offlineReady`, `updateServiceWorker`) e `registerType: 'prompt'`.

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para um app de **checkout** eu escolheria `prompt`: com `autoUpdate` o app pode recarregar no meio de um pagamento e o usuário perder o carrinho ou o formulário, ou ficar com JS novo conversando com uma API antiga. Com `prompt` o usuário atualiza quando termina a compra; o risco é ele nunca aceitar e ficar preso numa versão velha (com bug ou falha de segurança), então convém forçar a atualização em versões críticas.

Para um app de **notícias** eu escolheria `autoUpdate`: não há estado sensível a perder, o conteúdo é só leitura e é melhor que todos vejam sempre a versão mais recente sem fricção. O risco é a página recarregar sozinha enquanto a pessoa lê um artigo, ou uma versão com bug ir para todos de uma vez.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Usei o GitHub Copilot (assistente de IA) para implementar os TODOs 1–5 e redigir a reflexão; rodei `npm test` e `npm run build` para validar. Os prints de evidência (seções 1 e 2) precisam ser feitos manualmente no navegador.
