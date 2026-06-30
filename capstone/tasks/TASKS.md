# Tasks — Trilha Engenharia (Arquitetura)

> Você é o **engenheiro de software** do CineHub. Seu trabalho: construir features, melhorar
> arquitetura/design, performance, e **endurecer** o que está fraco. O server (`server/`) sobe
> funcionando, mas tem pontos a melhorar e algumas fraquezas conhecidas de segurança/robustez.

## Como funciona

1. Escolha tasks que **somem pelo menos os pontos exigidos** no `enunciado.md` da disciplina.
2. Comente na Issue correspondente pra "pegar" (evita duas pessoas na mesma).
3. Branch `task/<id>-<seu-login>`, resolva, abra **PR** (1 PR = 1 task).
4. O bot comenta a nota mínima (auto-verificável). Design, ADR e relatório são avaliados no Canvas.
5. Apresente no fim (~10 min).

> Sempre rode antes de começar: `cd server && npm install && npm run seed && npm test`.

## Catálogo

| ID | Task | Dificuldade | Pts |
|----|------|-------------|-----|
| `eng-sec-sqli` | Parametrizar a busca (eliminar SQL injection) | S | 4 |
| `eng-sec-jwt` | Verificar assinatura do JWT corretamente | S | 4 |
| `eng-sec-authz` | Controle de acesso em favoritos/listas (IDOR) | M | 6 |
| `eng-sec-secret` | Tirar segredo do código → env + rotação | S | 3 |
| `eng-sec-login-hardening` | Mensagem única + rate-limit no login | M | 5 |
| `eng-bug-pagination` | Corrigir `totalPages` (off-by-one) | S | 2 |
| `eng-bug-remove-favorite` | `removeFavorite` só do próprio usuário | S | 3 |
| `eng-feat-graphql-pagination` | Paginação por cursor + nova query | M | 6 |
| `eng-arch-clean-refactor` | Refatorar uma feature em camadas + ADR | L | 8 |
| `eng-feat-native-module` | Native module (bateria/sensor) no app mobile | L | 8 |
| `eng-feat-pwa-offline` | Web client PWA offline-first + Lighthouse ≥90 | L | 8 |
| `eng-feat-oidc` | Login OAuth/OIDC + PKCE | L | 8 |
| `eng-perf-optimize` | Medir e melhorar TTI/bundle (antes/depois) | M | 6 |
| `eng-ai-ondevice` | Feature de IA on-device (classificação/embedding) | L | 8 |

---

## Detalhe das tasks

### `eng-sec-sqli` — Parametrizar a busca (S, 4 pts)
A query `searchMovies` monta SQL concatenando a entrada do usuário. Reescreva com **query parametrizada** (placeholders `?`), sem mudar o comportamento esperado de busca.
- **Entrega:** `server/src/resolvers.ts`. **Aceite:** entradas com aspas/`UNION` não alteram a consulta; busca normal continua funcionando; `npm test` verde.

### `eng-sec-jwt` — Verificar assinatura do JWT (S, 4 pts)
`verifyToken` aceita qualquer token. Faça-o **validar a assinatura** com algoritmo explícito e rejeitar tokens inválidos/expirados.
- **Entrega:** `server/src/auth.ts`. **Aceite:** token forjado (sig vazia/alg `none`) é rejeitado; token legítimo do `login` continua válido.

### `eng-sec-authz` — Controle de acesso (M, 6 pts)
Hoje dá pra ler favoritos de qualquer usuário (`favoritesOf`) e editar lista de outro (`addMovieToList`). Implemente **autorização por dono**.
- **Entrega:** `server/src/resolvers.ts` (+ helper se quiser). **Aceite:** acessar recurso de outro usuário falha; o próprio dono continua acessando; ADR curto justificando a regra.

### `eng-sec-secret` — Segredo fora do código (S, 3 pts)
O segredo do JWT está hardcoded. Mova pra variável de ambiente, falhe se ausente, documente no `.env.example`, e garanta `.env` no `.gitignore`.
- **Aceite:** nenhum segredo no diff/repo; server sobe lendo do env.

### `eng-sec-login-hardening` — Endurecer login (M, 5 pts)
Login revela se o e-mail existe e não tem limite de tentativas. Use **mensagem única** e um **rate-limit** simples por IP/e-mail.
- **Aceite:** e-mail inexistente e senha errada dão a mesma resposta; N tentativas seguidas são bloqueadas por uma janela.

### `eng-bug-pagination` — `totalPages` (S, 2 pts)
`popularMovies` calcula `totalPages` errado e a última página some. Corrija o cálculo.
- **Aceite:** com 12 filmes e `pageSize:5`, `totalPages` = 3.

### `eng-bug-remove-favorite` — Remoção isolada (S, 3 pts)
`removeFavorite` remove o filme dos favoritos de **todos** os usuários. Restrinja ao usuário autenticado.
- **Aceite:** A remove e os favoritos de B permanecem intactos.

### `eng-feat-graphql-pagination` — Cursor pagination (M, 6 pts)
Adicione paginação **por cursor** (Relay-style `edges`/`pageInfo`) a uma listagem, além do offset atual.
- **Aceite:** query nova retorna `endCursor`/`hasNextPage`; paginar com o cursor anda sem repetir/pular.

### `eng-arch-clean-refactor` — Camadas + ADR (L, 8 pts)
Escolha uma feature e refatore em **camadas** (domínio / casos de uso / infra), com inversão de dependência. Documente num **ADR** (`compartilhado/adr-template.md`).
- **Aceite:** testes continuam verdes; ADR com contexto/decisão/alternativas/consequências.

### `eng-feat-native-module` — Native module (L, 8 pts)
No app mobile, exponha um **módulo nativo** (ex.: nível de bateria ou um sensor) Android (Kotlin) e/ou iOS (Swift) e consuma na UI.
- **Aceite:** valor real do device aparece na tela; código nativo + ponte versionados.

### `eng-feat-pwa-offline` — PWA offline-first (L, 8 pts)
No `apps/web/`, implemente service worker + cache + IndexedDB pra funcionar offline; **Lighthouse PWA ≥ 90**.
- **Aceite:** app abre e lista filmes offline; relatório Lighthouse anexado.

### `eng-feat-oidc` — OAuth/OIDC + PKCE (L, 8 pts)
Troque/duplique o login por um fluxo **OIDC com PKCE** (provedor à escolha).
- **Aceite:** fluxo PKCE funcional; token de acesso usado nas chamadas autenticadas.

### `eng-perf-optimize` — Performance (M, 6 pts)
Meça TTI/tamanho de bundle (ou tempo de uma tela), aplique uma otimização e mostre **antes/depois** com números.
- **Aceite:** métrica medida com método declarado + ganho demonstrado.

### `eng-ai-ondevice` — IA on-device (L, 8 pts)
Adicione uma feature de IA **rodando no device** (classificação de imagem do pôster, busca por embedding, ou LLM pequeno).
- **Aceite:** inferência local (sem chamar API externa em runtime) + nota sobre tamanho/quantização.
