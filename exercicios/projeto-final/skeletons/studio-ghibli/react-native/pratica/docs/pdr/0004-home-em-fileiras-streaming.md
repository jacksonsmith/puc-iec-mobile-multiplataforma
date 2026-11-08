# PDR 0004 — Tela inicial em fileiras, estilo streaming

- **Status:** aceito
- **Data:** 2026-11-07
- **Relacionados:** PDR 0003, Specs 001, 003, 004, 005

## Contexto
A primeira versão mostrava uma lista vertical com cards horizontais: o pôster ficava pequeno e o card carregava informação que só importa no detalhe. Apps de streaming resolvem isso com fileiras horizontais de pôsteres.

## Decisão de produto
- O **pôster é o card**: imagem 2:3 de borda a borda, nome embaixo e ★ no canto só se for favorito. Nota, diretor, sinopse e duração ficam no detalhe.
- A tela inicial é uma pilha de **fileiras horizontais, cada uma com título**: Seus favoritos (sempre a primeira, mesmo vazia), Mais aclamados, Anos 80, Anos 90, Anos 2000, De 2010 em diante.
- **Chips de diretor** filtram todas as fileiras ao mesmo tempo.
- **Busca** troca as fileiras por uma grade de 3 colunas com os resultados.
- **Sem barra de abas:** Seus favoritos no topo substitui a aba; "Ver todos" abre a grade completa de favoritos.
- **Favoritar** acontece no detalhe; no card a ★ é só indicador.

## Alternativas descartadas
- **Lista vertical com card horizontal (v1):** pôster pequeno, pouco "cinema".
- **Grade única de pôsteres:** perde os títulos de seção e a sensação de navegar por coleções.
- **Aba Favoritos separada:** esconde os favoritos; a fileira no topo deixa à vista.

## Riscos
- O exemplo do enunciado cita "aba Favoritos". A fileira + "Ver todos" cumpre a mesma função; confirmar com o professor se necessário.
