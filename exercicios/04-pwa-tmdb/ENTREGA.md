# Entrega — PWA TMDB

## Evidências de validação

Após executar `npm run build` e `npm run preview` dentro de `pratica/`, a validação deve ser
feita no Chrome em **DevTools → Application** e **DevTools → Network**:

- **Instalação:** o manifesto aparece em *Application → Manifest* e o navegador oferece
  instalação pelo botão de instalação.
- **API:** uma requisição para `api.themoviedb.org` aparece com estratégia `NetworkFirst`.
  Com a rede indisponível, a resposta é recuperada do cache; o timeout de rede é de 3 segundos.
- **Pôsteres:** requisições para `image.tmdb.org` aparecem com estratégia `CacheFirst`.
- **Atualização:** ao disponibilizar uma nova versão, aparece o aviso “Uma nova versão está
  disponível.”; **Atualizar** chama `updateServiceWorker(true)`.
- **Offline:** com a rede em *Offline*, a aba **Favoritos** exibe o banner
  “📡 Offline — exibindo dados do cache” e mantém os filmes já carregados.

## Comparação: site × PWA

O site tradicional depende da conexão para carregar novamente a API e os pôsteres. A PWA
instalada possui um shell precacheado pelo service worker, armazena as respostas da API para
fallback e mantém os pôsteres no cache. Por isso, a PWA pode abrir e exibir conteúdo já
visitado durante uma indisponibilidade de rede, além de oferecer uma experiência de instalação
e atualização controlada.

## Reflexão: `autoUpdate` × `prompt`

`autoUpdate` aplica a nova versão automaticamente assim que o service worker é atualizado.
Isso reduz a interação do usuário, mas pode trocar o JavaScript enquanto a pessoa ainda está
usando a aplicação e causar uma mudança inesperada de comportamento. `prompt` detecta a nova
versão e deixa a decisão para o usuário por meio do `UpdatePrompt`: ele pode atualizar em um
momento conveniente ou continuar na versão atual. Para este aplicativo, essa abordagem
preserva o contexto da navegação e torna a mudança de versão explícita.
