# Etapa 4 — Favoritos e Entrega

## Objetivo

Resolver o `TODO 5` em `DetailScreen.kt` e `FavoritesScreen.kt`, persistindo favoritos localmente e
exibindo-os na aba Favoritos.

## Arquivos Envolvidos

| Arquivo | Uso |
|---|---|
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/DetailScreen.kt` | Alternar favorito |
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/FavoritesScreen.kt` | Listar favoritos |
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/FavoritesStore.kt` | Persistir IDs |
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/BottomNav.kt` | Acessar `tab-favorites` |
| `flows/05-favorites.yaml` | Validar favoritos |

## Escopo

- No detalhe, chamar `favoritesStore.toggle(characterId)`.
- Atualizar `isFavorite` com o resultado do toggle.
- Na tela de favoritos, cruzar IDs salvos com dados reais da API.
- Renderizar `favorite-item-${character.id}`.
- Preservar `detail-favorite-button`, `tab-favorites` e `favorite-item-*`.
- Executar gates finais.

Fora desta etapa:

- Sincronização remota.
- Login.
- Cache offline completo.
- Persistir objetos completos.

## Implementação Esperada

Detalhe:

```kotlin
val ids = favoritesStore.toggle(characterId)
isFavorite = ids.contains(characterId)
```

Favoritos:

```kotlin
val ids = favoritesStore.load()
val all = api.fetchList()
favorites = all.filter { ids.contains(it.id) }
```

Comentários/notas esperados:

- Explicar que favoritos persistem apenas IDs para evitar salvar cópia desatualizada de dados da API.
- Explicar que `FavoritesStore` é Android-specific porque usa persistência local da plataforma no skeleton.
- Explicar que a tela de favoritos busca dados reais antes de renderizar.

## Critérios De Aceite

- Tocar `detail-favorite-button` em Rick Sanchez salva ID `1`.
- Depois de voltar e tocar `tab-favorites`, aparece `favorite-item-1`.
- Tela de favoritos vazia mostra `Nenhum favorito ainda.`.
- Tocar em favorito abre Detalhe.
- Favoritos usam IDs reais e persistidos, não hardcode.
- Fechar e reabrir o app mantém favoritos, quando validado manualmente.
- Há comentário/nota explicando persistência por ID e cruzamento com dados reais da API.

## Gates

```bash
cd exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica
./gradlew :androidApp:assembleDebug
maestro test flows/05-favorites.yaml
maestro test flows/
```

Checagem estrutural opcional:

```bash
cd exercicios/projeto-final/grader
npx tsx validator-estrutural.ts --entrega ../skeletons/rickandmorty/kmp/pratica
```

Validação manual:

1. Abrir app.
2. Abrir detalhe de Rick Sanchez.
3. Favoritar.
4. Voltar.
5. Abrir Favoritos.
6. Confirmar Rick Sanchez.
7. Fechar e reabrir app.
8. Abrir Favoritos.
9. Confirmar persistência.

## Definition of Done Da Etapa

- Todos os critérios de aceite da etapa foram atendidos.
- Build Android passa.
- Flow `05-favorites.yaml` passa ou foi validado manualmente.
- `maestro test flows/` passa ou os 5 YAMLs foram validados manualmente.
- `TODO 5` foi resolvido em Detalhe e Favoritos.
- Favoritos são persistidos por ID.
- TestIDs de favoritos permanecem visíveis.
- Decisões técnicas introduzidas nesta etapa estão comentadas ou documentadas.

## Checklist Final

- `TODO 1` a `TODO 5` resolvidos.
- `./gradlew :androidApp:assembleDebug` verde.
- 5 flows Maestro verdes.
- 3 telas obrigatórias presentes.
- TestIDs preservados.
- Dados reais da API, sem substituição por hardcode.
- Comentários/notas de decisões técnicas revisados para apoiar a apresentação.
