# Etapa 3 — Detalhe e Navegação

## Objetivo

Resolver o `TODO 2` em `DetailScreen.kt`, carregando dados reais do personagem selecionado e fazendo
o flow lista -> detalhe funcionar.

## Arquivos Envolvidos

| Arquivo | Uso |
|---|---|
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/DetailScreen.kt` | Implementar `TODO 2` |
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/App.kt` | Navegação já existente |
| `shared/src/commonMain/kotlin/com/puciec/rickmortykmp/data/RickAndMortyApi.kt` | Usar `fetchDetail(id)` |
| `flows/02-detail-navigation.yaml` | Validar detalhe |

## Escopo

- Chamar `api.fetchDetail(characterId)` no `LaunchedEffect(characterId)`.
- Guardar resultado em `detail`.
- Tratar falhas em `error`.
- Preservar `detail-screen`, `detail-title`, `detail-back-button` e `detail-favorite-button`.
- Garantir que o detalhe de Rick Sanchez exiba `Rick Sanchez`.

Fora desta etapa:

- Favoritar/desfavoritar.
- Tela de favoritos.
- Reescrever navegação.
- Adicionar campos fora do necessário para passar e demonstrar.

## Implementação Esperada

Fluxo mínimo:

```kotlin
LaunchedEffect(characterId) {
    try {
        detail = api.fetchDetail(characterId)
    } catch (t: Throwable) {
        error = "Não foi possível carregar o detalhe."
    }
}
```

Comentários/notas esperados:

- Explicar que `characterId` é a fronteira de navegação entre Lista e Detalhe.
- Explicar que `fetchDetail` usa endpoint real por ID e evita reaproveitar apenas dados resumidos da lista.

## Critérios De Aceite

- Tocar `item-card-1` abre `detail-screen`.
- `detail-title` aparece.
- O texto `Rick Sanchez` aparece no detalhe.
- `detail-back-button` retorna para a lista.
- Falha no detalhe exibe erro em vez de crash.
- O estado de loading aparece enquanto `detail == null`.
- Há comentário/nota explicando passagem de ID e busca real do detalhe.

## Gates

```bash
cd exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica
./gradlew :androidApp:assembleDebug
maestro test flows/02-detail-navigation.yaml
```

Validação manual:

1. Abrir app.
2. Tocar em Rick Sanchez.
3. Confirmar detalhe do ID `1`.
4. Voltar para lista.
5. Abrir outro personagem e confirmar que o detalhe muda.

## Definition of Done Da Etapa

- Todos os critérios de aceite da etapa foram atendidos.
- Build Android passa.
- Flow `02-detail-navigation.yaml` passa ou foi validado manualmente.
- `TODO 2` foi resolvido.
- Detalhe usa `api.fetchDetail(characterId)`, não dados hardcoded.
- TestIDs de detalhe permanecem visíveis.
- Decisões técnicas introduzidas nesta etapa estão comentadas ou documentadas.

## Handoff Para Etapa 4

Antes de iniciar favoritos:

- `DetailScreen` deve carregar corretamente `characterId`.
- `isFavorite` já deve iniciar a partir de `favoritesStore.load().contains(characterId)`.
- O botão `detail-favorite-button` deve permanecer clicável.
