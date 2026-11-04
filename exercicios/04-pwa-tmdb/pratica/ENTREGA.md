# Entrega — Atividade 4 (PWA)

**Nome:** Diego Cardoso Marques · **GitHub:** D2Diego

## 1. Site comum × PWA

1. O PWA de referência ofereceu o botão **Instalar** no Chrome. Seu manifest
   usa `display: standalone`, que permite abrir o app em uma janela própria.
2. Com a rede desativada no navegador de teste, o site do TMDB falhou ao
   recarregar. O PWA voltou a mostrar o catálogo a partir do armazenamento local.
3. Ao fechar a aba do PWA e abri-la de novo ainda sem rede, os filmes e os
   pôsteres continuaram visíveis. O navegador já tinha preparado o app para
   funcionar offline na visita online.

[Referência carregada](evidencias/01-pwa-referencia.png) ·
[Referência reaberta offline](evidencias/01b-referencia-reaberta-offline.png)

## 2. Prova do offline no build

- [DevTools — cache de pôsteres](evidencias/02b-devtools-cache-storage.png) e [cache da API](evidencias/02c-devtools-cache-api.png).
- [Contagem lida do Cache Storage do Chromium](evidencias/02a-cache-storage.txt),
  com entradas de API e pôsteres.
- [Aba Favoritos após recarregar offline](evidencias/02-app-offline.png), com
  banner e pôster visíveis.
- [Aviso de nova versão](evidencias/03-nova-versao.png). Ao clicar em
  **Atualizar**, a página recarregou.

## 3. Reflexão

- Para checkout, escolheria `prompt`.
- Um recarregamento automático durante o pagamento pode interromper a confirmação ou perder dados digitados.
- Mostraria o aviso ao fim do fluxo para que o usuário escolhesse quando atualizar.
- O risco é manter a versão antiga por mais tempo se o usuário adiar a atualização.
- Para notícias, escolheria `autoUpdate`, porque uma leitura costuma ser fácil de retomar.
- Ainda assim, a atualização pode fazer o leitor perder a posição na matéria.
