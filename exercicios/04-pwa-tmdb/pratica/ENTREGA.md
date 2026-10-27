# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Natan Figueiredo · **GitHub:** natantn

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | **Offline + recarregar:** `www.themoviedb.org` cai na página de erro do navegador (`ERR_INTERNET_DISCONNECTED`). | **Offline + recarregar:** o app abre normalmente e mostra a lista de filmes com pôsteres. | [`05-site-comum-offline.png`](evidencias/05-site-comum-offline.png) × [`06-pwa-professor-offline.png`](evidencias/06-pwa-professor-offline.png) |
| 2 | **Service Worker:** nenhum registrado; a página nunca fica "controlada", então toda requisição depende da rede. | **Service Worker:** 1 registrado e controlando a página a partir da 2ª visita — é ele que intercepta as requisições e responde do cache quando a rede falha. | `navigator.serviceWorker.getRegistrations()` → 0 × 1 (Application → Service Workers) |
| 3 | **Cache Storage:** vazio. Curiosidade: o TMDB **tem** manifest com `display: standalone` (dá pra "instalar"), mas sem SW o app instalado continua sem funcionar offline — manifest sozinho não faz PWA. | **Cache Storage:** `workbox-precache` com 8 arquivos (HTML, JS, CSS, ícones) — o app shell inteiro fica no aparelho, por isso abre sem rede e pode ser instalado como janela standalone. | Application → Cache Storage · no meu build: [`04-cache-storage.png`](evidencias/04-cache-storage.png) |

## 2. Prova do offline no SEU build

- [x] **Cache Storage** com `tmdb-api` (2 páginas da API) e `tmdb-images` (28 pôsteres), além do precache do Workbox — [`evidencias/04-cache-storage.png`](evidencias/04-cache-storage.png). Conteúdo lido com a Cache API (`caches.keys()` / `cache.keys()`) no build de produção (`npm run preview`), o mesmo que o painel Application → Cache Storage exibe.
- [x] Print do app **offline** carregando a lista após recarregar — [`evidencias/02-offline-lista.png`](evidencias/02-offline-lista.png)
- [x] Print do aviso **"Nova versão disponível"** — [`evidencias/03-nova-versao.png`](evidencias/03-nova-versao.png)

Extra: aviso **"App pronto para uso offline"** na 1ª visita — [`evidencias/01-pronto-offline.png`](evidencias/01-pronto-offline.png)

(Coloque os prints numa pasta `evidencias/` e referencie aqui.)

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para o **checkout** eu escolheria `prompt`. No `autoUpdate` o novo Service Worker assume e a página recarrega sozinha — no meio de um pagamento isso pode apagar o formulário, interromper a confirmação ou até gerar um envio duplicado. Com `prompt` o usuário termina a compra e atualiza quando quiser. O risco é o contrário: quem sempre clica em "Depois" fica numa versão antiga que pode não conversar mais com a API nova; por isso o backend precisa aceitar versões anteriores por um tempo (ou o app força a atualização só em mudanças críticas). Para **notícias** eu escolheria `autoUpdate`: é leitura, um recarregamento custa pouco e garante que todos vejam correções e layout novo sem depender de um clique. O que pode dar errado é recarregar enquanto a pessoa lê, perdendo a posição na matéria — algo que se atenua salvando a rolagem ou atualizando só na próxima navegação.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. A análise inicial da atividade e a projetização da solução foram minhas. Usei IA como apoio nestas frentes:

- **Construção de testes** — escrita dos casos de teste e do roteiro de verificação no navegador (Service Worker, Cache Storage, offline e fluxo de "Nova versão").
- **Correção de bug** — diagnóstico e correção de problemas encontrados durante o desenvolvimento.
- **Completude de cenários** — revisão para cobrir casos que faltavam (ex.: estado vazio com/sem filmes carregados, aviso dispensável, versão antiga mantida até o usuário aceitar a atualização).
- **Redação deste ENTREGA.md** — coleta das evidências (comparação site × PWA e prints) e redação das seções 1 a 3.
