# Documentação — Spec Driven Development (SDD)

Nenhuma linha de código entra sem uma spec aprovada. O fluxo de cada feature é:

```
PDR (decisão de produto) ─┐
                          ├─► spec.md ─► plan.md ─► tasks.md ─► branch ─► PR
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
| [001](specs/001-lista-filmes/spec.md) | Fileiras de filmes | `e2e/maestro/01-lista.yaml` | Amir |
| [002](specs/002-detalhe-filme/spec.md) | Detalhe do filme | `e2e/maestro/02-detalhe.yaml` | Amir |
| [003](specs/003-busca/spec.md) | Busca por título | `e2e/maestro/03-busca.yaml` | Amir |
| [004](specs/004-filtro-diretor/spec.md) | Filtro por diretor | `e2e/maestro/04-filtro.yaml` | Amir |
| [005](specs/005-favoritos/spec.md) | Favoritos persistentes | `e2e/maestro/05-favoritos.yaml` | Amir |

Cada spec gera exatamente 1 flow Maestro (15 pts da rubrica da Aula 6).

## Decisões

- ADRs: [0001 Expo + RN](adr/0001-expo-react-native.md) · [0002 NativeWind](adr/0002-nativewind.md) · [0003 Moti](adr/0003-moti.md) · [0004 Estado](adr/0004-estado-tanstack-zustand.md) · [0005 Testes](adr/0005-estrategia-testes.md) · [0006 Camadas](adr/0006-arquitetura-camadas.md)
- PDRs: [0001 Tema Ghibli](pdr/0001-tema-ghibli-filtro-diretor.md) · [0002 Favoritos locais](pdr/0002-favoritos-locais-sem-login.md) · [0003 Identidade visual](pdr/0003-identidade-visual.md) · [0004 Home em fileiras](pdr/0004-home-em-fileiras-streaming.md)

## Convenção de `testID` (vale para todas as specs)

`<escopo>-<elemento>[-<id>]`, sempre kebab-case, em inglês:

| Elemento | testID |
|---|---|
| Fileira | `rail-<slug>` (`rail-favorites`, `rail-acclaimed`, `rail-1980s`, `rail-1990s`, `rail-2000s`, `rail-2010s`) |
| Lista (tela inicial) | `item-list-screen` |
| Ver todos os favoritos (papel da aba do flow do professor) | `tab-favorites` |
| Item na grade de favoritos | `favorite-item-<filmId>` |
| Card de filme | `item-card-<filmId>` |
| Nome no card | `item-card-title-<filmId>` |
| ★ indicadora no card | `item-card-fav-<filmId>` |
| Grade de resultados da busca | `search-results` |
| Tela de detalhe | `detail-screen` |
| Título no detalhe | `detail-title` |
| Botão de voltar (detalhe) | `detail-back-button` |
| Campo de busca | `search-input` |
| Chip de diretor | `category-chip-<slug>` (ex.: `category-chip-hayao-miyazaki`, `category-chip-all`) |
| Botão de favoritar (detalhe) | `detail-favorite-button` |
| Estado carregando / busca vazia / erro | `state-loading` / `state-empty` / `state-error` |
| Favoritos vazio (dentro da fileira) | `state-favorites-empty` |
| Botão tentar novamente | `retry-button` |

> Esta tabela segue a convenção do professor em `exercicios/projeto-final/temas/05-studio-ghibli/README.md`, no repositório da disciplina. O `appId` dos flows é `com.puciec.ghiblifinal`.
