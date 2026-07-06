# Tema 5 — Studio Ghibli API

API pública, **sem key**: [ghibliapi.vercel.app](https://ghibliapi.vercel.app/).

## Endpoints usados

| Uso | Endpoint |
|---|---|
| Lista (22 filmes, curadoria fixa) | `GET https://ghibliapi.vercel.app/films` → `[{ id, title, director, release_date, running_time, ... }]` |
| Detalhe | `GET https://ghibliapi.vercel.app/films/{id}` → mesmo shape do item da lista |
| Categoria/diretor | `GET https://ghibliapi.vercel.app/films?director={nome}` → mesmo shape, já filtrado pela API |

Busca (feature 3) é **client-side**: filtra a lista já carregada (22 itens) pelo texto digitado no
`title` — mesma abordagem dos outros temas.

## ⚠️ IDs são strings (UUID), não números

Diferente de PokeAPI/Rick and Morty (ids inteiros), o Ghibli API usa **UUID** como id
(`"2baf70d1-42bb-4437-b551-e5fed5a87abe"`). Os models e o `FavoritesStore`/`favoritesStore.ts`/
`FavoritesStore.kt` precisam usar `String` em vez de `Int`/`number`. Os testIDs (`item-card-<id>`,
`favorite-item-<id>`) usam o UUID completo como sufixo — funciona normalmente no Maestro (hífen não
é caractere especial em regex).

## Fixtures conhecidas (usadas nos 5 flows Maestro)

| O que | Valor |
|---|---|
| Item de exemplo (lista → detalhe → favoritos) | **Castle in the Sky**, id `2baf70d1-42bb-4437-b551-e5fed5a87abe`, diretor Hayao Miyazaki → `item-card-2baf70d1-42bb-4437-b551-e5fed5a87abe` |
| Categoria de exemplo | diretor `Isao Takahata` → `category-chip-takahata` (contém **Grave of the Fireflies**, id `12cfb892-aac0-4c5b-94af-521852e46d6a`, mas não Castle in the Sky) |
| Termo de busca (`SEARCH_TERM`) | `kiki` → bate só com **Kiki's Delivery Service**, id `ea660b10-85c4-4ae3-8a5f-41cea3648e3e` |
| Favorito de exemplo | favoritar Castle in the Sky → deve aparecer em `favorite-item-2baf70d1-42bb-4437-b551-e5fed5a87abe` na aba de favoritos |

## Convenção de testID aplicada neste tema

```
item-list-screen
item-card-2baf70d1-42bb-4437-b551-e5fed5a87abe   # Castle in the Sky
category-chip-takahata                             # filtro por diretor Isao Takahata
search-input
detail-screen
detail-title                                        # deve renderizar "Castle in the Sky"
detail-favorite-button
detail-back-button
tab-favorites
favorite-item-2baf70d1-42bb-4437-b551-e5fed5a87abe
```

## Por que esse tema

Curadoria pequena e fixa (22 filmes, não cresce/muda), API estável e sem key — bom contraste de
domínio (cultura pop/cinema em vez de bicho/personagem). O filtro por diretor via query param nativo
(`?director=`) segue o mesmo padrão de "a API filtra, sem endpoint de categoria separado" do tema
Rick and Morty. É o único tema com id não-numérico — cobre esse caso de shape de dado real (muitas
APIs de produção usam UUID, não int sequencial).
