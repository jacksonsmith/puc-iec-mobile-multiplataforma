# ENTREGA — Atividade 4 (PWA)

**Nome:** Julio Cesar Fernandes  
**GitHub:** julio.fernands

## 1. Site comum × PWA — o que eu vi

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Sem internet, o site comum não carregou normalmente. | Depois de carregar a lista com internet, consegui abrir o PWA offline e ver os filmes disponíveis no cache. | `evidencias/PWA_offline.png`,`Site_Comum_offline.png` |
| 2 | O site comum depende da conexão para carregar o conteúdo. | Ao fechar e reabrir o PWA, ele continuou acessível e mostrou os dados que já haviam sido carregados. | `evidencias/cache-storage_tmdb-cache.png` |
| 3 | O site comum é acessado pelo navegador. | Consegui instalar o PWA pelo navegador e abri-lo como aplicativo. | `evidencias/pwa_installed_1.png`  E `evidencias/pwa_installed_2.png`|

## 2. Prova do offline no meu build

- [x] O print do Cache Storage mostra os caches `tmdb-api` e `tmdb-images` com itens: `evidencias/cache-storage_tmdb-cache.png`,`cache-storage_tmdb-api.png`
- [x] Com a opção **Offline** ativada no DevTools, recarreguei o app e a lista de filmes carregada anteriormente continuou aparecendo: `evidencias/PWA_offline.png`
- [x] Print do aviso **“Nova versão disponível”**: `evidencias/nova_versao_disponivel.png`

Não consegui reproduzir o aviso de nova versão durante o teste.

## 3. Reflexão

Para um app de checkout, eu escolheria `prompt`, porque a atualização não deveria interromper uma compra em andamento. Assim, a pessoa poderia terminar o pagamento e atualizar depois. Para um app de notícias, escolheria `autoUpdate`, para que as correções e melhorias fossem aplicadas rapidamente. Com `autoUpdate`, a tela poderia recarregar em um momento inconveniente. Com `prompt`, a pessoa poderia adiar a atualização e continuar usando uma versão antiga. Por isso, a escolha depende do tipo de app e do impacto que uma atualização pode causar.

## 4. Declaração de uso de IA

Usei IA para entender as tarefas, ajudar na implementação das funcionalidades do PWA e tirar dúvidas sobre como testar o projeto. Revisei as mudanças e validei o projeto com os testes e o build.