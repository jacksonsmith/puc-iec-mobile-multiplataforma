# Spec 003 — Busca por título

- **Status:** rascunho
- **Responsável:** Amir
- **Relacionados:** Spec 004 (combina com o filtro)

## História de usuário
Como fã, quero digitar parte do nome de um filme para encontrá-lo rapidamente.

## Critérios de aceite
- [ ] CA1 — Campo de busca de vidro no topo da tela inicial.
- [ ] CA1b — Com texto no campo, as fileiras dão lugar a uma grade de 3 colunas "Resultados para “…”" com a contagem (`search-results`).
- [ ] CA2 — Filtra enquanto digita, comparando com `title` **e** `originalTitle`.
- [ ] CA3 — Ignora maiúsculas/minúsculas e acentos (`"chihiro"` e `"CHÍHIRO"` dão o mesmo resultado).
- [ ] CA4 — Campo vazio volta às fileiras (respeitando o filtro de diretor ativo).
- [ ] CA5 — Sem resultados → estado vazio "Nenhum filme encontrado" com botão para limpar a busca.
- [ ] CA6 — Botão ✕ limpa o campo.

## Fora do escopo
Busca na API (a API não tem endpoint de busca; filtragem é local).

## Verificação
- Flow Maestro: `e2e/maestro/03-busca.yaml` — digita "totoro" em `search-input`, verifica `search-results` com 1 card; digita "xyz" e verifica `state-empty`.
- Vitest: `filterFilms` com texto (acentos, maiúsculas, vazio).
