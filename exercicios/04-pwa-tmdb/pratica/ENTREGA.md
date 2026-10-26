# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** <seu nome> · **GitHub:** <seu-login>

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

| # | Site comum | PWA publicado pelo professor | Print/evidência |
|---|---|---|---|
| 1 | Navegação ampla com Movies, TV Shows, People, Awards, busca, destaque e tendências. | Interface dedicada a filmes populares, com cards e ação de favoritar. | [Site comum](evidencias/site-comum-tmdb.png) · [PWA](evidencias/pwa-professor-offline-simulado.png) |
| 2 | Ao recarregar com a rede do navegador desligada, falhou com `ERR_INTERNET_DISCONNECTED`. | Ao recarregar sem rede, manteve os filmes e exibiu “Reload feito — dados vêm do IndexedDB”. | [Site comum offline](evidencias/site-comum-offline.png) · [PWA offline](evidencias/pwa-professor-modo-offline.png) · [registro](evidencias/observacoes-navegacao.md) |
| 3 | Nesta inspeção, não havia Service Worker registrado nem entrada no Cache Storage. | Havia um Service Worker, cache de precache do Workbox e aviso “App pronto para uso offline”. | [registro da inspeção](evidencias/observacoes-navegacao.md) |

## 2. Prova do offline no SEU build

- [ ] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens)
- [ ] Print do app em **modo avião** carregando a lista
- [ ] Print do aviso **"Nova versão disponível"** (ou explique por que não conseguiu reproduzir)

(Coloque os prints numa pasta `evidencias/` e referencie aqui.)

**Limite das evidências:** as capturas acima são da comparação entre o site comum e o PWA publicado pelo professor; elas não comprovam o funcionamento do meu build. Ainda faltam as três capturas do meu build (Cache Storage com `tmdb-api` e `tmdb-images`, lista carregada offline e aviso de nova versão). Não gerei essas evidências porque não há `.env` local com o token TMDB configurado. Configure `VITE_TMDB_TOKEN` localmente, rode `npm run build` e `npm run preview` e capture esses estados antes de entregar; não inclua o token no repositório.

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para um app de checkout, eu escolheria `prompt`: a atualização não deve interromper um pagamento ou esvaziar o carrinho.
O usuário pode concluir a operação e atualizar em um momento seguro; o risco é continuar usando uma versão antiga.
Para um app de notícias, eu escolheria `autoUpdate`, pois manter conteúdo e correções recentes tende a ser mais importante.
O risco é a atualização recarregar a página e interromper uma leitura ou descartar estado temporário.
Com `prompt`, esse incômodo diminui, mas o usuário pode adiar a atualização por muito tempo.
Em ambos os casos, é importante preservar estado e comunicar claramente o que a atualização fará.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Usei IA para revisar a implementação dos TODOs e executar testes/build. Também usei o navegador integrado para comparar o PWA publicado pelo professor com o site comum, simular a desconexão de rede, observar o Service Worker/Cache Storage e salvar as capturas da seção 1. As evidências do meu build ainda precisam ser produzidas após configurar o token localmente.
