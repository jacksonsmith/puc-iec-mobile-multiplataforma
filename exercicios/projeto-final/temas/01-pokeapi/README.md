# Tema 1 — PokeAPI

API pública, **sem key**, sem rate-limit agressivo: [pokeapi.co](https://pokeapi.co/about).

## Endpoints usados

| Uso | Endpoint |
|---|---|
| Lista (geração 1, 151 pokémons) | `GET https://pokeapi.co/api/v2/pokemon?limit=151&offset=0` → `{ results: [{ name, url }] }` |
| Detalhe | `GET https://pokeapi.co/api/v2/pokemon/{id ou name}` → nome, sprites, `types[]`, altura/peso |
| Categoria/tipo | `GET https://pokeapi.co/api/v2/type/{name}` → `{ pokemon: [{ pokemon: { name, url } }] }` — cruzar com a lista carregada pelo `name` |

Busca (feature 3) é **client-side**: filtra a lista já carregada (151 itens) pelo texto digitado no `name` — não precisa de endpoint de busca.

## Fixtures conhecidas (usadas nos 5 flows Maestro — não mudam, dado estável da API)

| O que | Valor |
|---|---|
| Item de exemplo (lista → detalhe) | **Pikachu**, id `25`, tipo `electric` → `item-card-25` |
| Categoria de exemplo | tipo `fire` → `category-chip-fire` (contém **Charizard**, id `6`, mas não Pikachu) |
| Termo de busca (`SEARCH_TERM`) | `charizard` (ou `char` — bate com Charizard/Charmander/Charmeleon) |
| Favorito de exemplo | favoritar Pikachu (`item-card-25`) → deve aparecer em `favorite-item-25` na aba de favoritos |

## Convenção de testID aplicada neste tema

Ver convenção geral em `../../enunciado.md` — aqui só os valores concretos:

```
item-list-screen
item-card-25              # Pikachu
category-chip-fire         # filtro por tipo fogo
search-input
detail-screen
detail-title                # deve renderizar "Pikachu" quando abrir item-card-25
detail-favorite-button
detail-back-button
tab-favorites
favorite-item-25
```

## Por que esse tema

Indicado pelo professor. Schema simples (nome + sprite + tipos), sem autenticação, adotado amplamente em
tutoriais de mobile/E2E justamente por não exigir key nem esbarrar em rate-limit — bom "hello world" de
API real pra um projeto que já tem risco de infra suficiente (emulador + Maestro + 3 frameworks).
