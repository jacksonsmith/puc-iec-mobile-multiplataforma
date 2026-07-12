# Tema 2 — Rick and Morty API

API pública, **sem key**: [rickandmortyapi.com](https://rickandmortyapi.com/documentation).

## Endpoints usados

| Uso | Endpoint |
|---|---|
| Lista (826 personagens, paginado) | `GET https://rickandmortyapi.com/api/character?page=1` → `{ results: [{ id, name, status, species, ... }], info: { pages, next } }` |
| Detalhe | `GET https://rickandmortyapi.com/api/character/{id}` → `id, name, status, species, type, gender` |
| Categoria/status | `GET https://rickandmortyapi.com/api/character/?status={alive\|dead\|unknown}` → mesmo shape da lista, já filtrado pela API |

Busca (feature 3) é **client-side**: filtra a página já carregada pelo texto digitado no `name` — mesma abordagem do tema PokeAPI, mesmo a API tendo um `?name=` nativo (mantemos client-side pra consistência entre temas).

## Fixtures conhecidas (usadas nos 5 flows Maestro)

| O que | Valor |
|---|---|
| Item de exemplo (lista → detalhe) | **Rick Sanchez**, id `1`, status `Alive` → `item-card-1` |
| Categoria de exemplo | status `dead` → `category-chip-dead` (contém **Adjudicator Rick**, id `8`, mas não Rick Sanchez) |
| Termo de busca (`SEARCH_TERM`) | `summer` → bate só com **Summer Smith**, id `3` |
| Favorito de exemplo | favoritar Rick Sanchez (`item-card-1`) → deve aparecer em `favorite-item-1` na aba de favoritos |

## Convenção de testID aplicada neste tema

```
item-list-screen
item-card-1                # Rick Sanchez
category-chip-dead          # filtro por status "Dead"
search-input
detail-screen
detail-title                 # deve renderizar "Rick Sanchez" quando abrir item-card-1
detail-favorite-button
detail-back-button
tab-favorites
favorite-item-1
```

## Diferença de shape vs. PokeAPI (atenção ao portar UI)

PokeAPI tem `types[]`/altura/peso; Rick and Morty tem `status`/`species`/`gender` — a tela de detalhe
mostra campos diferentes (não é só trocar a URL da API, os campos exibidos mudam). A categoria também
filtra por `status` (3 valores: alive/dead/unknown) em vez de `type` (PokeAPI tem mais tipos) — os 4
chips de exemplo dos outros temas viram 3 aqui (`Todos`, `Alive`, `Dead`, `unknown` opcional).

## Por que esse tema

Estrutura de dado quase idêntica à PokeAPI (lista + detalhe + filtro por categoria), mas domínio bem
distinto visualmente — evita que os temas pareçam clones. Filtro nativo por `status` no próprio
endpoint (sem precisar de um endpoint de "tipo" separado como o PokeAPI), API amplamente usada em
tutoriais de mobile por não exigir key nem ter rate-limit agressivo.
