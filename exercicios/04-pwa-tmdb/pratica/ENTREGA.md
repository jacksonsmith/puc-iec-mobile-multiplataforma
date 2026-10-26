# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Maria Luísa Lacerda · **GitHub:** marialuisalacerda

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

> Abra `https://pwa-tmdb-aula4.vercel.app` e compare com um site comum (ex.: themoviedb.org). Modo avião → recarregar; fechar e reabrir; instalar.

Comparei a PWA https://pwa-tmdb-aula4.vercel.app com o site https://www.themoviedb.org/, testando o comportamento sem conexão, após fechar e reabrir e durante a instalação.

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Ao ficar sem internet e recarregar, o site deixa de carregar ou exibe erro de conexão, pois depende da rede para buscar seus arquivos e dados. | A página PWA continua exibindo a estrutura e os conteúdos, mesmo sem conexão com a internet. O erro de conexão só aparece quando o cache é esvaziado no recarregamento. | ![alt text](image-2.png) |
| 2 | Ao fechar e abrir novamente sem internet, o navegador ainda precisa acessar a rede para carregar o site, salvo algum cache convencional do navegador. | O PWA pode ser reaberta e continuar funcionando parcialmente offline, pois seus arquivos essenciais podem ter sido armazenados localmente. | ![alt text](image.png) |
| 3 | Um site comum pode ser acessado somente pelo navegador, dependendo da conexão de rede. | O PWA pode ser instalado como um app na área de trabalho, abrindo em uma janela independente sem a barra comum do navegador. | ![alt text](image-1.png) |

## 2. Prova do offline no SEU build

- [ x ] Print do **DevTools → Application → Cache Storage** com `tmdb-api` e `tmdb-images` (com itens)
    - [DevTools - Cache Storage](evidencias/DevTools_CacheStorage.png)
- [ x ] Print do app em **modo avião** carregando a lista
    - [DevTools - Modo offline](evidencias/DevTools_NetworkOffline.png)
    - [Banner TODO 3: App pronto para uso offline](evidencias/AppProntoParaUsoOffline.png)
    - [Banner TODO 5 (Mobile): Offline - exibindo dados do cache](evidencias/Offline_UsandoDadosDoCache.png)
- [ x ] Print do aviso **"Nova versão disponível"** (ou explique por que não conseguiu reproduzir)
    - [Nova Versão Disponível](evidencias/NovaVersao.png)

## 3. Reflexão (5–8 linhas)

`autoUpdate` × `prompt`: qual você escolheria para um app de **checkout** e para um app de **notícias**, e por quê? O que pode dar errado em cada escolha?

Para um aplicativo de checkout, a estratégia **prompt** é mais recomendada, pois uma atualização automática no meio de uma compra poderia interromper o fluxo, recarregar a página ou causar perda de estado durante etapas como carrinho e pagamento. Com prompt, o usuário pode concluir a operação antes de atualizar para a nova versão. 

Já em um aplicativo de notícias, considerar **autoUpdate** é mais adequado, pois disponibilizar rapidamente correções e versões mais recentes, sem depender de uma ação do usuário, garante o melhor funcionamento da aplicação. Nesse caso, o risco de interromper uma operação crítica é menor. Porém, uma atualização automática ainda pode causar perda temporária de estado, como posição de leitura ou filtros selecionados. Por outro lado, no prompt, o usuário pode adiar a atualização por muito tempo e continuar utilizando uma versão antiga da aplicação.

## 4. Declaração de uso de IA

Usei IA? Onde e como? (uso transparente é incentivado)

Utilizei IA como apoio para interpretar os requisitos da atividade, revisar conceitos de PWA, Service Worker e estratégias de cache, além de auxiliar na análise de erros e na revisão do código implementado.

As alterações no código foram realizadas por mim e validadas localmente por meio dos testes, do build e das verificações manuais indicadas no enunciado.

Também utilizei IA como suporte no uso do GitHub, especialmente por ainda ter dificuldade com alguns comandos e com o fluxo envolvendo fork, atualização do repositório, branches e abertura de Pull Request.