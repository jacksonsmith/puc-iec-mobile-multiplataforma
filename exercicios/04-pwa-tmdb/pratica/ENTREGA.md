# ENTREGA — Atividade 4 (PWA)

> Preencha e faça commit junto com o código. Esta parte vale 3 pts (avaliação manual no Canvas).

**Nome:** Henrique Miguel de Jesus · **GitHub:** HenriqueDest

---

## 1. Site comum × PWA — o que EU vi (3 diferenças)

Comparando `https://pwa-tmdb-aula4.vercel.app` (PWA) com `https://www.themoviedb.org` (site comum):

| # | Site comum | PWA | Print/evidência |
|---|---|---|---|
| 1 | Sem internet → página de erro do navegador | Modo avião → filmes continuam aparecendo do cache do Service Worker | DevTools → Application → Cache Storage mostra `tmdb-api` e `tmdb-images` com itens |
| 2 | Não pode ser instalado na tela inicial — só ícone de favorito no navegador | Botão "Instalar" aparece na barra de endereço (Chrome/Edge) e como banner customizado; ao instalar abre como janela standalone sem barra de URL | Ícone do app aparece no menu iniciar / área de trabalho |
| 3 | Cada visita busca todos os recursos de novo pela rede | Na segunda visita, assets (JS, CSS, HTML) são servidos diretamente pelo SW — carregamento zero sem rede | DevTools → Network → filtrar por "from ServiceWorker" mostra requisições servidas localmente |

## 2. Prova do offline no SEU build

- [x] `runtimeCaching` configurado com `tmdb-api` (NetworkFirst, timeout 3s) e `tmdb-images` (CacheFirst, status opaco 0+200)
- [x] `registerType: 'prompt'` ativado — app avisa quando há nova versão disponível
- [x] `UpdatePrompt` implementado com `useRegisterSW`, exibindo aviso "App pronto para uso offline" e "Nova versão disponível" com botões Atualizar/Depois
- [x] Banner `📡 Offline — exibindo dados do cache` na aba ★ Favoritos quando `!isOnline`

Para verificar: `npm run build && npm run preview` → DevTools → Application → Cache Storage → `tmdb-api` e `tmdb-images` devem estar presentes com itens após navegar pelo app. Em modo avião, os filmes continuam sendo exibidos via cache.

## 3. Reflexão (5–8 linhas)

Para um app de **checkout** (pagamento/compra), eu escolheria `prompt`. Uma atualização automática no meio de um fluxo de pagamento pode resetar o estado da tela, perder dados do formulário ou redirecionar o usuário inesperadamente — o risco de abandono do carrinho é alto. Com `prompt`, o usuário controla o momento da atualização e não é interrompido.

Para um app de **notícias**, eu escolheria `autoUpdate`. Notícias têm prazo de validade curto: exibir conteúdo desatualizado prejudica a experiência mais do que uma atualização silenciosa. O risco de perda de estado é baixo (o usuário apenas lê, sem formulários críticos), então a atualização automática mantém o feed sempre fresco sem fricção.

O que pode dar errado: `autoUpdate` em checkout pode interromper transações em andamento; `prompt` em notícias pode acumular atualizações ignoradas, mantendo o app defasado por dias se o usuário nunca clicar em "Atualizar".

## 4. Declaração de uso de IA

Utilizei assistente de IA (Antigravity/Gemini) para auxiliar na implementação dos TODOs desta atividade — especialmente na configuração do `runtimeCaching` do Workbox, na implementação do componente `UpdatePrompt` com `useRegisterSW` e na estrutura do hook `useOfflineStatus`. O entendimento conceitual dos padrões PWA (NetworkFirst, CacheFirst, respostas opacas, Service Worker lifecycle) foi discutido e compreendido durante o processo, não apenas copiado.
