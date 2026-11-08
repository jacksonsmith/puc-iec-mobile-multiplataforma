# Documentação — Spec Driven Development (SDD)

Nenhuma linha de código entra sem uma spec aprovada. O fluxo de cada feature é:

```
PDR (decisão de produto) ─┐
                          ├─► spec.md ─► plan.md ─► tasks.md ─► issue ─► branch ─► PR
ADR (decisão técnica) ────┘     (o quê)   (como)    (quem/quando)
```

| Artefato | Pergunta que responde | Onde |
|---|---|---|
| **Spec** | O quê e por quê? Quais critérios de aceite? | `docs/specs/NNN-nome/spec.md` |
| **Plan** | Como? Telas, componentes, camadas, `testID` | `docs/specs/NNN-nome/plan.md` |
| **Tasks** | Quem faz o quê, em que ordem? | `docs/specs/NNN-nome/tasks.md` |
| **ADR** | Por que esta escolha técnica? | `docs/adr/` |
| **PDR** | Por que esta escolha de produto? | `docs/pdr/` |
| **Contribution** | Como trabalhamos (branches, commits, PR, DoD) | `CONTRIBUTING.md` |

Templates em [`docs/templates/`](templates/).

## Specs

| # | Feature | Flow Maestro | Responsável |
|---|---|---|---|
| [001](specs/001-lista-filmes/spec.md) | Fileiras de filmes | `e2e/maestro/01-lista.yaml` | _a definir_ |
| [002](specs/002-detalhe-filme/spec.md) | Detalhe do filme | `e2e/maestro/02-detalhe.yaml` | _a definir_ |
| [003](specs/003-busca/spec.md) | Busca por título | `e2e/maestro/03-busca.yaml` | _a definir_ |
| [004](specs/004-filtro-diretor/spec.md) | Filtro por diretor | `e2e/maestro/04-filtro.yaml` | _a definir_ |
| [005](specs/005-favoritos/spec.md) | Favoritos persistentes | `e2e/maestro/05-favoritos.yaml` | _a definir_ |

Cada spec gera exatamente 1 flow Maestro (15 pts da rubrica da Aula 6).

## Decisões

- ADRs: [0001 Expo + RN](adr/0001-expo-react-native.md) · [0002 NativeWind](adr/0002-nativewind.md) · [0003 Moti](adr/0003-moti.md) · [0004 Estado](adr/0004-estado-tanstack-zustand.md) · [0005 Testes](adr/0005-estrategia-testes.md) · [0006 Camadas](adr/0006-arquitetura-camadas.md)
- PDRs: [0001 Tema Ghibli](pdr/0001-tema-ghibli-filtro-diretor.md) · [0002 Favoritos locais](pdr/0002-favoritos-locais-sem-login.md) · [0003 Identidade visual](pdr/0003-identidade-visual.md) · [0004 Home em fileiras](pdr/0004-home-em-fileiras-streaming.md)

## Convenção de `testID` (vale para todas as specs)

`<escopo>-<elemento>[-<id>]`, sempre kebab-case, em inglês:

| Elemento | testID |
|---|---|
| Fileira | `rail-<slug>` (`rail-favorites`, `rail-acclaimed`, `rail-1980s`, `rail-1990s`, `rail-2000s`, `rail-2010s`) |
| Ver todos os favoritos | `rail-favorites-see-all` |
| Card de filme | `film-card-<filmId>` |
| Nome no card | `film-card-title-<filmId>` |
| ★ indicadora no card | `film-card-fav-<filmId>` |
| Grade de resultados da busca | `search-results` |
| Tela de detalhe | `film-detail` |
| Campo de busca | `search-input` |
| Chip de diretor | `director-chip-<slug>` (ex.: `director-chip-hayao-miyazaki`, `director-chip-all`) |
| Botão de favoritar (detalhe) | `favorite-toggle-<filmId>` |
| Estado carregando / busca vazia / erro | `state-loading` / `state-empty` / `state-error` |
| Favoritos vazio (dentro da fileira) | `state-favorites-empty` |
| Botão tentar novamente | `retry-button` |

> ⚠️ Se o skeleton do professor (`skeletons/` no repo da disciplina) definir outra convenção, **a dele vence** — atualize esta tabela e os plans.
