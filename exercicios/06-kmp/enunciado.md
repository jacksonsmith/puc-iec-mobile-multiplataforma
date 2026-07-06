# Atividade 6 — KMP: filmes populares com Ktor

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma  
**Entrega:** fork + PR no repositório da disciplina  
**Valor:** 15 pontos

---

## Contexto

Nesta atividade você vai conectar o **KotlinProject** (Android/iOS/Web compartilhando um único módulo `shared`) à **API do TMDB**, buscando filmes populares e exibindo-os num LazyColumn em Compose.

O exercício foca em:
- Ktor HTTP client (multiplataforma)
- kotlinx.serialization para deserializar JSON
- Coroutines em Composable (`LaunchedEffect`)
- Compose `LazyColumn` para listas

---

## Setup — antes de começar

```bash
cd exercicios/06-kmp/pratica
```

1. **Token TMDB**: gere o *API Read Access Token* (v4) em <https://www.themoviedb.org/settings/api>
2. **Copie** `local.properties.example` para `local.properties` e preencha:
   ```
   sdk.dir=/Users/<seu-usuario>/Library/Android/sdk
   tmdb.token=eyJhbGc...
   ```
3. **Sincronize o Gradle** no Android Studio (o botão "Sync Now" no banner amarelo).
4. **Verifique** que o app compila: Run `androidApp` no emulador — deve aparecer a tela "Token TMDB não configurado" (porque o stub ainda não faz chamada real).

> ⚠️ `local.properties` já está no `.gitignore`. Nunca commite seu token.

---

## O que você vai implementar

### Parte A — Camada de dados (5 pts)

**Arquivo:** `shared/src/commonMain/kotlin/org/example/project/data/TmdbApi.kt`

Implemente o **TODO 1**: a função `popularMovies(page: Int = 1): MoviesResponse`.

Endpoint TMDB:
```
GET https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1
Authorization: Bearer <token>
```

O modelo `MoviesResponse` e `Movie` já estão prontos em `Movie.kt`.

**Critério:** `popularMovies()` retorna pelo menos 1 filme (lista não-vazia).

### Parte B — UI com Compose (10 pts)

**Arquivo:** `shared/src/commonMain/kotlin/org/example/project/App.kt`

Implemente os **TODOs 2 e 3**:

**TODO 2** — busca ao iniciar:
- Use `LaunchedEffect(Unit)` para chamar `api.popularMovies()`
- Gerencie `isLoading` e `error`

**TODO 3** — lista de filmes:
- Use `items(movies)` dentro do `LazyColumn`
- Exiba para cada filme: título, nota (`voteAverage`) e ano de lançamento
- Sugestão: `Card` com `Column` dentro

**Critério B1 (5 pts):** lista carrega e exibe os títulos dos filmes.  
**Critério B2 (5 pts):** cada item mostra nota + ano de lançamento formatados.

---

## Entrega

1. Faça o fork do repositório da disciplina (se ainda não fez)
2. Implemente os TODOs acima
3. Abra um PR com o título: `feat(a6-kmp): <seu-login>`
4. O bot vai comentar o score automático no PR

---

## Links úteis

- [Ktor client — Getting Started](https://ktor.io/docs/client-create-new-application.html)
- [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
- [TMDB API — Movie Popular](https://developer.themoviedb.org/reference/movie-popular-list)
- [Compose LazyColumn](https://developer.android.com/develop/ui/compose/lists)
