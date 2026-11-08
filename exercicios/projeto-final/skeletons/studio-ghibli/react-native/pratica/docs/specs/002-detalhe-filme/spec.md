# Spec 002 — Detalhe do filme

- **Status:** rascunho
- **Responsável:** _a definir_
- **Relacionados:** Spec 001, Spec 005

## História de usuário
Como fã, quero tocar num filme e ver sinopse, nota e ficha técnica para decidir se vou (re)assistir.

## Critérios de aceite
- [ ] CA1 — Tocar num card abre a rota `/film/[id]`.
- [ ] CA2 — A tela mostra banner (`movie_banner`), título, título original, sinopse, nota Rotten Tomatoes, duração formatada (ex.: `2h 5min`), diretor, produtor e ano.
- [ ] CA3 — Os dados aparecem instantaneamente se o filme já veio na lista (cache); senão busca `GET /films/{id}`.
- [ ] CA4 — Botão **Favoritar / Nos favoritos** (`FavoriteToggle`) abaixo do título: é o único lugar onde se favorita (Spec 005).
- [ ] CA5 — Voltar retorna à tela inicial mantendo busca, filtro e posição de rolagem das fileiras.
- [ ] CA8 — Banner 16:9 de borda a borda no topo, com degradê para `canvas` só na metade de baixo e título em `display` (Shippori Mincho B1). Só os discos `glass-scrim` de voltar e ★ ficam sobre a imagem. Igual nos temas Noite e Dia.
- [ ] CA6 — ID inexistente mostra estado de erro com opção de voltar.
- [ ] CA7 — Transição de entrada animada (Moti), respeitando "reduzir movimento" do sistema.

## Verificação
- Flow Maestro: `e2e/maestro/02-detalhe.yaml` — toca em `film-card-<id>`, espera `film-detail`, verifica título e diretor.
- Vitest: `formatRuntime(125) === '2h 5min'`.
