# Etapa 2 — Busca e Filtro

## Objetivo

Resolver `TODO 3` e `TODO 4` em `ListScreen.kt`, implementando busca client-side por nome e filtro
por status usando parâmetro real da Rick and Morty API.

## Arquivos Envolvidos

| Arquivo | Uso |
|---|---|
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/ListScreen.kt` | Implementar `TODO 3` e `TODO 4` |
| `shared/src/commonMain/kotlin/com/puciec/rickmortykmp/data/RickAndMortyApi.kt` | Usar `fetchNamesByStatus(status)` |
| `flows/03-search.yaml` | Validar busca |
| `flows/04-category-filter.yaml` | Validar filtro |

## Escopo

- Filtrar `all` por `searchText`, com substring case-insensitive em `name`.
- Quando `statusNames != null`, manter apenas personagens cujo nome existe em `statusNames`.
- Ao selecionar status, chamar `api.fetchNamesByStatus(status)` no `LaunchedEffect(selectedStatus)`.
- Ao selecionar `Todos`, limpar `selectedStatus` e `statusNames`.
- Preservar `search-input`, `category-chip-dead` e `item-card-*`.

Fora desta etapa:

- Trocar busca client-side por endpoint de busca.
- Criar ViewModel/repository novo.
- Paginação.
- Alterar testIDs.

## Implementação Esperada

Filtro local:

```kotlin
val filtered = all
    .filter { character -> statusNames?.contains(character.name) ?: true }
    .filter { character ->
        character.name.contains(searchText.trim(), ignoreCase = true)
    }
```

Filtro por status:

```kotlin
LaunchedEffect(selectedStatus) {
    statusNames = selectedStatus?.let { api.fetchNamesByStatus(it) }
}
```

Comentários/notas esperados:

- Explicar que a busca é client-side porque o skeleton já carrega a primeira página e o flow espera
  refinamento local.
- Explicar que o filtro usa endpoint real (`status`) da API, por isso `fetchNamesByStatus`.
- Se houver tratamento de concorrência/cancelamento, registrar brevemente a decisão.

## Critérios De Aceite

- Buscar `summer` mostra `item-card-3`.
- Buscar `summer` esconde itens que não combinam.
- Tocar `category-chip-dead` mostra `item-card-8`.
- Tocar `category-chip-dead` esconde `item-card-1`.
- `Todos` restaura lista sem filtro de status.
- Busca e filtro funcionam em conjunto.
- Falha ao buscar status não causa crash.
- Há comentário/nota explicando busca client-side e filtro com parâmetro real da API.

## Gates

```bash
cd exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica
./gradlew :androidApp:assembleDebug
maestro test flows/03-search.yaml
maestro test flows/04-category-filter.yaml
```

Validação manual:

1. Abrir lista.
2. Buscar `summer`.
3. Confirmar Summer Smith.
4. Limpar busca.
5. Selecionar `Dead`.
6. Confirmar que Rick Sanchez não aparece.
7. Selecionar `Todos`.
8. Confirmar lista inicial.

## Definition of Done Da Etapa

- Todos os critérios de aceite da etapa foram atendidos.
- Build Android passa.
- Flows `03-search.yaml` e `04-category-filter.yaml` passam ou foram validados manualmente.
- `TODO 3` e `TODO 4` foram resolvidos.
- Busca e filtro não usam IDs hardcoded das fixtures.
- TestIDs de busca/filtro/lista permanecem visíveis.
- Decisões técnicas introduzidas nesta etapa estão comentadas ou documentadas.

## Handoff Para Etapa 3

Antes de iniciar detalhe:

- Cada item filtrado deve manter `character.id` real.
- O clique do card deve continuar chamando `onSelect(character.id)`.
