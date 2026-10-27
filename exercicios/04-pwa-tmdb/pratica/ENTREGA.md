# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Natan Figueiredo · **GitHub:** natantn

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 2. Prova do offline no SEU build

- [ ] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens)
- [x] Print do app **offline** carregando a lista após recarregar — [`evidencias/02-offline-lista.png`](evidencias/02-offline-lista.png)
- [x] Print do aviso **"Nova versão disponível"** — [`evidencias/03-nova-versao.png`](evidencias/03-nova-versao.png)

Extra: aviso **"App pronto para uso offline"** na 1ª visita — [`evidencias/01-pronto-offline.png`](evidencias/01-pronto-offline.png)

(Coloque os prints numa pasta `evidencias/` e referencie aqui.)

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

<sua resposta>

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Sim. A análise inicial da atividade e a projetização da solução foram minhas. Usei IA como apoio em três frentes:

- **Construção de testes** — escrita dos casos de teste e do roteiro de verificação no navegador (Service Worker, Cache Storage, offline e fluxo de "Nova versão").
- **Correção de bug** — diagnóstico e correção de problemas encontrados durante o desenvolvimento.
- **Completude de cenários** — revisão para cobrir casos que faltavam (ex.: estado vazio com/sem filmes carregados, aviso dispensável, versão antiga mantida até o usuário aceitar a atualização).
