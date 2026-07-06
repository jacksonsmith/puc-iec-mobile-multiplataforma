# Tema 3 — TheMealDB

API pública, **sem key real** (usa a key de teste pública `1` no path, é o padrão da própria doc oficial,
não é hack): [themealdb.com/api.php](https://www.themealdb.com/api.php).

## Endpoints usados

| Uso | Endpoint |
|---|---|
| Lista (25 receitas do dataset seed público) | `GET https://www.themealdb.com/api/json/v1/1/search.php?s=` → `{ meals: [{ idMeal, strMeal, strCategory, ... }] }` |
| Detalhe | `GET https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}` → `idMeal, strMeal, strCategory, strArea, strMealThumb` |
| Categoria/filtro | `GET https://www.themealdb.com/api/json/v1/1/filter.php?c={categoria}` → mesmo shape da lista, já filtrado pela API — igual ao padrão do tema Rick and Morty (`?status=`), aqui é `?c=` |

Busca (feature 3) é **client-side**: filtra a lista já carregada (25 itens) pelo texto digitado no `strMeal`.

## Fixtures conhecidas (usadas nos 5 flows Maestro — não mudam, dado estável da API)

| O que | Valor |
|---|---|
| Item de exemplo (lista → detalhe → favoritos) | **Burek**, id `"53060"`, categoria `Side` → `item-card-53060` |
| Categoria de exemplo | `Dessert` → `category-chip-dessert` (contém **Flan**, id `"53322"`, mas não Burek) |
| Termo de busca (`SEARCH_TERM`) | `sushi` → bate só com **Sushi**, id `"53065"` |
| Favorito de exemplo | favoritar Burek (`item-card-53060`) → deve aparecer em `favorite-item-53060` na aba de favoritos |

## Convenção de testID aplicada neste tema

```
item-list-screen
item-card-53060              # Burek
category-chip-dessert         # filtro por categoria "Dessert"
search-input
detail-screen
detail-title                   # deve renderizar "Burek" quando abrir item-card-53060
detail-favorite-button
detail-back-button
tab-favorites
favorite-item-53060
```

## ⚠️ IDs são string, não int

Diferente de PokeAPI e Rick and Morty (`id: Int`), o TheMealDB retorna `idMeal` como **string**
(`"53060"`, não `53060`). Os models e o `FavoritesStore`/`favoritesStore.ts`/`FavoritesStore.kt`
nos 3 frameworks usam `String`/`Set<String>` em vez de `Int`/`Set<Int>` — atenção ao portar UI de
outro tema, essa é a diferença estrutural principal.

## Diferença de shape vs. outros temas

Detalhe mostra `categoria`/`área` (ex.: "Side / Brazil") em vez de altura/peso (PokeAPI) ou
status/espécie/gênero (Rick and Morty) — mesma ideia de "campos de domínio", conteúdo diferente.

## Por que esse tema

Domínio "comida" dá variação visual real (fotos de prato, nomes reconhecíveis) vs. os 2 temas
anteriores (pokémon/personagem de anime). API amplamente usada em cursos de mobile por não exigir
key de verdade — a key `1` de teste é documentada oficialmente como uso permanente para
desenvolvimento, não é um workaround temporário.
