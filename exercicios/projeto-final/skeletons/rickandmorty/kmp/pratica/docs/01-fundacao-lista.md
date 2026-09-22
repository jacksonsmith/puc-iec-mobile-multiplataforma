# Etapa 1 — Fundação e Lista

## Objetivo

Resolver o `TODO 1` em `ListScreen.kt`, carregando a primeira página da Rick and Morty API e
renderizando a lista real no skeleton KMP.

## Arquivos Envolvidos

| Arquivo | Uso |
|---|---|
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/ListScreen.kt` | Implementar `TODO 1` |
| `shared/src/commonMain/kotlin/com/puciec/rickmortykmp/data/RickAndMortyApi.kt` | Usar `api.fetchList()` |
| `shared/src/commonMain/kotlin/com/puciec/rickmortykmp/data/Models.kt` | Usar `CharacterSummary` |
| `flows/01-list.yaml` | Validar lista |

## Escopo

- Chamar `api.fetchList()` dentro do `LaunchedEffect(Unit)`.
- Guardar o resultado em `all`.
- Tratar falhas com `try/catch` e preencher `error`.
- Garantir `loading = false` ao final.
- Preservar `item-list-screen` e `item-card-${character.id}`.

Fora desta etapa:

- Busca.
- Filtro.
- Detalhe.
- Favoritos.
- Reestruturação da UI.

## Implementação Esperada

Fluxo mínimo:

```kotlin
LaunchedEffect(Unit) {
    try {
        all = api.fetchList()
    } catch (t: Throwable) {
        error = "Não foi possível carregar personagens."
    } finally {
        loading = false
    }
}
```

Comentários/notas esperados:

- Explicar que `LaunchedEffect` foi usado para executar chamada suspensa no ciclo de vida do
  composable.
- Explicar que `RickAndMortyApi` fica no módulo `shared` porque representa contrato de dados
  compartilhável.

## Critérios De Aceite

- O app compila.
- A tela de lista sai do loading.
- A lista vem de `api.fetchList()`, não de mock local.
- Rick Sanchez aparece como `item-card-1`.
- Falha na API exibe erro em vez de crash.
- `item-list-screen` permanece no container da lista.
- Há comentário/nota justificando o uso de `LaunchedEffect` e API em `shared`.

## Gates

```bash
cd exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica
./gradlew :androidApp:assembleDebug
maestro test flows/01-list.yaml
```

Validação manual:

1. Abrir o app no emulador.
2. Confirmar loading inicial.
3. Confirmar lista carregada.
4. Confirmar Rick Sanchez visível ou acessível como `item-card-1`.

## Definition of Done Da Etapa

- Todos os critérios de aceite da etapa foram atendidos.
- Build Android passa.
- Flow `01-list.yaml` passa ou foi validado manualmente.
- `TODO 1` foi resolvido.
- Nenhum testID da lista foi removido ou escondido.
- Decisões técnicas introduzidas nesta etapa estão comentadas ou documentadas.

## Handoff Para Etapa 2

Antes de iniciar busca e filtro:

- `all` deve conter a lista real.
- A UI deve renderizar a partir de `filtered`.
- `searchText`, `selectedStatus` e `statusNames` devem permanecer disponíveis.
