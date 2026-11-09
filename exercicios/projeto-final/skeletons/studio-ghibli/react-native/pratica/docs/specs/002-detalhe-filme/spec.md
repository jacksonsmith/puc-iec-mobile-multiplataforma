# Spec 002 — Detalhe do filme

- **Status:** rascunho
- **Responsável:** Amir
- **Relacionados:** Spec 001, Spec 005

## História de usuário
Como fã, quero tocar num filme e ver sinopse, nota e ficha técnica para decidir se vou (re)assistir.

## Critérios de aceite
- [x] CA1 — Tocar num card abre a rota `/film/[id]`.
- [x] CA2 — A tela mostra banner (`movie_banner`), título, título original, sinopse, nota Rotten Tomatoes, duração formatada (ex.: `2h 5min`), diretor, produtor e ano.
- [x] CA3 — Os dados aparecem instantaneamente se o filme já veio na lista (cache); senão busca `GET /films/{id}`.
- [x] CA4 — Botão **Favoritar / Nos favoritos** (`FavoriteToggle`) abaixo do título: é o único lugar onde se favorita (Spec 005).
- [x] CA5 — Voltar retorna à tela inicial mantendo busca, filtro e posição de rolagem das fileiras.
- [x] CA8 — Banner 16:9 de borda a borda no topo, com degradê para `canvas` só na metade de baixo e título em `display` (Shippori Mincho B1). Só os discos `glass-scrim` de voltar e ★ ficam sobre a imagem. Igual nos temas Noite e Dia.
- [x] CA6 — ID inexistente mostra estado de erro com opção de voltar.
- [x] CA7 — Transição de entrada animada (Reanimated), respeitando "reduzir movimento" do sistema.

## Verificação
- Flow Maestro: `e2e/maestro/02-detalhe.yaml` — toca em `item-card-<id>`, espera `detail-screen`, verifica título e diretor.
- Vitest: `formatRuntime(125) === '2h 5min'`.
