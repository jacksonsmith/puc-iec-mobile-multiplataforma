# Spec 004 — Filtro por diretor

- **Status:** rascunho
- **Responsável:** Amir
- **Relacionados:** PDR 0001, Spec 003

## História de usuário
Como fã, quero ver só os filmes de um diretor (ex.: Isao Takahata) para explorar a obra dele.

## Critérios de aceite
- [ ] CA1 — Linha horizontal de chips abaixo da busca: **Todos** + um chip por diretor.
- [ ] CA2 — A lista de diretores é derivada dos dados da API (sem lista fixa no código), ordenada pelo número de filmes (desc).
- [ ] CA3 — Cada chip mostra a contagem de filmes (ex.: `Hayao Miyazaki · 9`).
- [ ] CA4 — Só um diretor ativo por vez; tocar no chip ativo volta para **Todos**.
- [ ] CA5 — O filtro vale para todas as fileiras ao mesmo tempo: cada uma mostra só filmes do diretor, fileiras de década vazias somem e Seus favoritos permanece (com estado vazio se preciso).
- [ ] CA5b — Funciona combinado com a busca (Spec 003).
- [ ] CA6 — Chip ativo tem destaque visual claro e `accessibilityState={{ selected: true }}`.

## Verificação
- Flow Maestro: `e2e/maestro/04-filtro.yaml` — toca `director-chip-isao-takahata`, verifica "Grave of the Fireflies" visível em `rail-1980s` e "My Neighbor Totoro" ausente.
- Vitest: `getDirectors(films)` e `filterFilms` com diretor + texto.
