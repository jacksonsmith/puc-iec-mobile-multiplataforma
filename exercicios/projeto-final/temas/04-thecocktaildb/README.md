# Tema 4 — TheCocktailDB

API pública, **sem key** (usa a key de demonstração `1` no path, padrão oficial da documentação):
[thecocktaildb.com/api.php](https://www.thecocktaildb.com/api.php).

## Endpoints usados

| Uso | Endpoint |
|---|---|
| Lista (fonte primária) | `GET https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail` → `{ drinks: [{ idDrink, strDrink, strDrinkThumb }] }` (100 itens, categoria "Cocktail") |
| Detalhe | `GET https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={id}` → `{ drinks: [{ idDrink, strDrink, strCategory, strAlcoholic, strGlass, ... }] }` |
| Categoria/filtro | `GET https://www.thecocktaildb.com/api/json/v1/1/filter.php?c={categoria}` → mesmo endpoint da lista, só troca o valor de `c` (ex.: `Shot`) |

Busca (feature 3) é **client-side**: filtra a lista já carregada pelo texto digitado no `strDrink` —
mesma abordagem dos outros temas.

## ⚠️ Não use `search.php?s=` (busca vazia) como fonte da lista

Diferente do PokeAPI/Rick and Morty, o endpoint de busca vazia do TheCocktailDB
(`search.php?s=`, que em tese retornaria "todos os drinks") é **instável na key de demo** — em teste
direto, uma chamada devolveu 13 resultados e a chamada seguinte devolveu `{"drinks":"no data found"}`,
sem mudar nada. Por isso a **lista usa `filter.php?c=Cocktail`** como fonte primária (100 itens,
estável, testado consistente) — a tela de lista mostra só drinks da categoria "Cocktail", não o banco
inteiro. Isso é intencional, não um bug do skeleton.

## Fixtures conhecidas (usadas nos 5 flows Maestro — não mudam, dado estável da API)

| O que | Valor |
|---|---|
| Item de exemplo (lista → detalhe → favoritos) | **Mojito**, id `"11000"`, categoria `Cocktail` → `item-card-11000` |
| Termo de busca (`SEARCH_TERM`) | `cosmopolitan` → bate com **Cosmopolitan**, id `"17196"` (também categoria Cocktail, está na lista) |
| Categoria de exemplo | `Shot` → `category-chip-shot` (contém **24k nightmare**, id `"17060"`, mas não o Mojito) |

## ⚠️ IDs são strings, não números

`idDrink` vem como string (`"11000"`) na API — diferente do PokeAPI/Rick and Morty (que usam `id`
numérico). Os models e o `FavoritesStore` dos 3 frameworks usam `String`/`Set<String>` neste tema,
não `Int`/`Set<Int>`.

## Convenção de testID aplicada neste tema

```
item-list-screen
item-card-11000              # Mojito
category-chip-shot            # filtro por categoria "Shot"
search-input
detail-screen
detail-title                   # deve renderizar "Mojito" quando abrir item-card-11000
detail-favorite-button
detail-back-button
tab-favorites
favorite-item-11000
```

## Por que esse tema

Mesmo mantenedor da TheMealDB (schema JSON quase idêntico — reduz custo de skeleton/grader), mas
domínio visual bem distinto (drinks vs. receitas vs. pokémons vs. personagens de série). Amplamente
usada em tutoriais de mobile por não exigir key real, e o filtro por categoria via `filter.php?c=`
mapeia direto na feature 4 sem precisar de endpoint separado.
