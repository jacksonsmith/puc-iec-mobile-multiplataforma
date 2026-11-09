# Spec 001 — Fileiras de filmes (tela inicial)

- **Status:** rascunho
- **Responsável:** Amir
- **Relacionados:** PDR 0001, PDR 0003, PDR 0004, ADR 0004, ADR 0006

## Problema
O usuário quer navegar pelos filmes do Studio Ghibli como num app de streaming, vendo os pôsteres grandes.

## História de usuário
Como fã do Studio Ghibli, quero ver os filmes em fileiras de pôsteres com títulos de seção para explorar o catálogo rapidamente.

## Critérios de aceite
- [ ] CA1 — Ao abrir o app, busca `GET https://ghibliapi.vercel.app/films` e mostra fileiras horizontais, cada uma com título e contagem.
- [ ] CA2 — Ordem fixa: **Seus favoritos** (sempre a primeira — ver Spec 005), **Mais aclamados** (10 maiores `rt_score`), **Anos 80**, **Anos 90**, **Anos 2000**, **De 2010 em diante**.
- [ ] CA3 — Cada card mostra só o pôster (`image`) em 2:3 ocupando o card inteiro e o nome do filme embaixo (máx. 2 linhas). Se favorito, ★ de vidro no canto do pôster.
- [ ] CA4 — Cada fileira rola na horizontal, começa na margem e sangra na borda direita (2 cards e meio visíveis em 390px).
- [ ] CA5 — Tocar no card abre o detalhe (Spec 002).
- [ ] CA6 — Carregando: 3 fileiras skeleton nos tamanhos reais. Nunca spinner solto.
- [ ] CA7 — Erro ou sem internet: painel de erro com **Tentar novamente**, que refaz a busca.
- [ ] CA8 — Pôster: `canvas-raised` enquanto carrega; se falhar, o primeiro caractere do título original em `sky`.
- [ ] CA9 — Puxar para baixo recarrega.

## Estados de tela
| Estado | Comportamento | testID |
|---|---|---|
| Carregando | 3 fileiras skeleton (Moti) | `state-loading` |
| Sucesso | fileiras | `rail-<slug>` |
| Erro | painel de vidro + botão | `state-error`, `retry-button` |

## Verificação
- Flow Maestro: `e2e/maestro/01-lista.yaml` — abre o app, espera `rail-acclaimed`, verifica o card de "Spirited Away" visível e faz swipe horizontal na fileira.
- Vitest: `mapFilm`; `buildRails(films, favoriteIds)` (ordem, décadas, top 10).
