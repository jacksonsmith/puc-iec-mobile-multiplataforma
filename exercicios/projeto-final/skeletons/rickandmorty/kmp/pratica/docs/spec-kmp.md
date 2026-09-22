# Roadmap — Projeto Final Rick and Morty KMP

## Resumo

Implementar o projeto final oficial na combinação **Rick and Morty + KMP**, completando a lógica dos
TODOs do skeleton existente. A UI, navegação e `testID`s já estão montados; o trabalho é conectar API
real, busca, filtro, detalhe e favoritos persistidos sem reescrever a aplicação do zero.

## Entrega Oficial

| Item | Valor |
|---|---|
| Tema | `rickandmorty` |
| Framework | `kmp` |
| Pasta de implementação | `exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica/` |
| Alvo obrigatório | Android |
| Build gate | `./gradlew :androidApp:assembleDebug` |
| E2E gate | `maestro test flows/` |
| PR final | Fork do grupo -> repo da disciplina |

O PR deve tocar apenas uma combinação tema/framework. Para esta decisão, a combinação é:

```text
exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica/
```

## O Que Já Existe No Skeleton

| Arquivo | Papel |
|---|---|
| `androidApp/src/main/kotlin/com/puciec/rickmortykmp/App.kt` | Navegação entre Lista, Detalhe e Favoritos |
| `ListScreen.kt` | TODO 1, TODO 3 e TODO 4 |
| `DetailScreen.kt` | TODO 2 e parte do TODO 5 |
| `FavoritesScreen.kt` | Parte do TODO 5 |
| `FavoritesStore.kt` | Persistência local de IDs favoritos |
| `BottomNav.kt` | Acesso à aba Favoritos com `tab-favorites` |
| `shared/src/commonMain/kotlin/com/puciec/rickmortykmp/data/RickAndMortyApi.kt` | Cliente Ktor já criado |
| `shared/src/commonMain/kotlin/com/puciec/rickmortykmp/data/Models.kt` | Models serializáveis já criados |
| `flows/*.yaml` | Testes Maestro que o CI executa |

## Regras De Implementação

- Completar os `TODO 1` a `TODO 5` existentes.
- Não remover nem renomear os `Modifier.testTag(...)` usados pelos flows.
- Não criar elementos invisíveis ou hardcoded só para passar teste.
- Não reescrever a UI do zero; adaptar apenas o necessário para a lógica funcionar.
- Manter IDs como `Int`, conforme o tema Rick and Morty.
- Usar a API real via `RickAndMortyApi`.
- Registrar decisões técnicas relevantes em comentários curtos, README ou notas, principalmente quando usar conceitos KMP vistos em aula.
- Melhorias arquiteturais só devem entrar se não aumentarem o risco de quebrar build, testIDs ou flows.

## Conceitos KMP Que Devem Ficar Evidentes

| Conceito | Como aparece nesta entrega |
|---|---|
| KMP | Projeto Gradle com `shared` e `androidApp` |
| `shared/commonMain` | `RickAndMortyApi.kt` e `Models.kt` compartilháveis |
| Ktor Client | Chamadas reais para Rick and Morty API |
| `kotlinx.serialization` | Parse dos responses JSON |
| Coroutines | `LaunchedEffect` executando chamadas suspensas |
| Compose | Telas declarativas com estado em `remember/mutableStateOf` |
| Persistência local Android | `FavoritesStore` salvando IDs favoritos |
| Testabilidade por contrato | Flows Maestro validando comportamento por `testTag` |

## API E Fixtures

Base URL:

```text
https://rickandmortyapi.com/api
```

| Feature | Endpoint no skeleton |
|---|---|
| Lista | `fetchList(page = 1)` -> `GET /character?page=1` |
| Detalhe | `fetchDetail(id)` -> `GET /character/{id}` |
| Filtro | `fetchNamesByStatus(status)` -> `GET /character/?status={status}` |

Fixtures esperadas pelos flows:

| Cenário | Valor |
|---|---|
| Personagem principal | Rick Sanchez |
| ID principal | `1` |
| Busca | `summer` -> `item-card-3` |
| Filtro | `dead` -> mostra `item-card-8` e esconde `item-card-1` |
| Favorito | Rick Sanchez -> `favorite-item-1` |

## TestIDs Obrigatórios

- `item-list-screen`
- `item-card-1`
- `item-card-3`
- `item-card-8`
- `search-input`
- `category-chip-dead`
- `detail-screen`
- `detail-title`
- `detail-favorite-button`
- `detail-back-button`
- `tab-favorites`
- `favorite-item-1`

## Telas Obrigatórias

| Tela | Responsabilidade |
|---|---|
| Lista | Carregar personagens, buscar por nome, filtrar por status e abrir detalhe |
| Detalhe | Exibir dados reais do personagem, voltar e favoritar/desfavoritar |
| Favoritos | Listar favoritos persistidos, exibir vazio e abrir detalhe |

Busca e filtro são controles da tela de Lista, não telas separadas.

## Specs Por Etapa

Cada spec de etapa possui critérios de aceite, gates e uma Definition of Done própria. A DoD abaixo é
a condição final para considerar a entrega completa.

| Etapa | Spec | Entrega principal |
|---|---|---|
| 1 | [Fundação e Lista](./01-fundacao-lista.md) | TODO 1 resolvido e flow `01-list.yaml` passando |
| 2 | [Busca e Filtro](./02-busca-filtro.md) | TODO 3/TODO 4 resolvidos e flows `03-search.yaml`/`04-category-filter.yaml` passando |
| 3 | [Detalhe e Navegação](./03-detalhe-navegacao.md) | TODO 2 resolvido e flow `02-detail-navigation.yaml` passando |
| 4 | [Favoritos e Entrega](./04-favoritos-entrega.md) | TODO 5 resolvido e flow `05-favorites.yaml` passando |

## Gates Finais

Executar a partir de:

```bash
cd exercicios/projeto-final/skeletons/rickandmorty/kmp/pratica
```

Comandos:

```bash
./gradlew :androidApp:assembleDebug
maestro test flows/
```

Checagem estrutural opcional, a partir de `exercicios/projeto-final/grader`:

```bash
npx tsx validator-estrutural.ts --entrega ../skeletons/rickandmorty/kmp/pratica
```

## Definition of Done Final

- `./gradlew :androidApp:assembleDebug` passa.
- Os 5 flows Maestro passam ou foram validados manualmente pelos YAMLs.
- Os TODOs 1 a 5 foram resolvidos.
- A lista consome API real e mostra Rick Sanchez (`item-card-1`).
- Busca por `summer` mostra Summer Smith (`item-card-3`).
- Filtro `dead` mostra personagem morto esperado e remove Rick Sanchez da lista.
- Detalhe de Rick Sanchez abre com `detail-screen`, `detail-title` e texto `Rick Sanchez`.
- Favoritar Rick Sanchez exibe `favorite-item-1` na aba Favoritos.
- TestIDs obrigatórios permanecem visíveis e não hardcoded para enganar teste.
- Decisões técnicas relevantes estão comentadas ou documentadas.

## Melhorias Opcionais

Só implementar depois que os 5 flows estiverem estáveis:

- Melhorar estados de erro/vazio.
- Melhorar apresentação visual dos cards.
- Adicionar content descriptions.
- Adicionar testes unitários para `FavoritesStore`.
- Deixar `RickAndMortyApi` mais fakeável para testes.
- Documentar decisões em `docs/decisoes-tecnicas.md`.
