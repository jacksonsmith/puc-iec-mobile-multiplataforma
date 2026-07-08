# Atividade 6 — KMP: Filmes Populares (10 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Entrega:** ver Canvas
**Modalidade:** individual
**Tempo estimado:** ~2-3 horas
**Dificuldade:** ⭐⭐⭐ Difícil — requer Android Studio (Kotlin Multiplatform plugin) + emulador Android

> **Como vamos fazer:** a **aula** começa com o hands-on guiado do KMP wizard oficial (JetBrains) — isso é só demonstração, não é esta atividade. **Esta atividade** (`exercicios/06-kmp/`) usa o **mesmo projeto** gerado pelo wizard: você começa em aula e **termina em casa**. É a última atividade individual do curso, antes do Projeto Final em grupo.

---

## Por que essa atividade

KMP promete "uma base de código, três plataformas" — mas o que o aluno realmente sente na mão é escrever **UI declarativa em Compose** consumindo dados de uma API real. Esta atividade isola exatamente isso: a camada de rede (Ktor + TMDB) já vem pronta, o seu trabalho é **construir a interface** em `App.kt`, o arquivo compartilhado entre Android/iOS/Web.

---

## Setup

```bash
cd exercicios/06-kmp/pratica
ls shared/src/commonMain/kotlin/org/example/project    # deve listar App.kt e data/
```

1. Copie `local.properties.example` para `local.properties`
2. Gere um token gratuito em [themoviedb.org](https://www.themoviedb.org/settings/api) (v4 Read Access Token) e cole em `tmdb.token=`
3. Abra a pasta `pratica/` no Android Studio (Kotlin Multiplatform plugin já instalado da aula) → Sync Gradle → Run `androidApp`

> **Toolchain:** Android Studio Quail 2026.1.1+, JDK 17. Mesmos requisitos verificados em aula. iOS/Web fazem parte do projeto wizard mas não são exigidos nesta atividade — só o `androidApp`.

---

## O que já vem pronto

- `shared/src/commonMain/kotlin/org/example/project/data/Movie.kt` — `Movie`, `MoviesResponse` (`@Serializable`)
- `shared/src/commonMain/kotlin/org/example/project/data/TmdbApi.kt` — `popularMovies()` via Ktor, já busca a API real
- `App.kt` — o `LaunchedEffect` que chama a API e guarda `movies`/`isLoading`/`error` em `remember { mutableStateOf(...) }`

Você **não mexe** nesses pontos — a integração com a API está resolvida. Seu trabalho é só Compose.

## O que você constrói (3 TODOs em `App.kt`)

| TODO | O quê | Pts |
|---|---|---|
| 1 | `when` que escolhe a tela certa: token em branco → `TokenMissingMessage()` · carregando → `CircularProgressIndicator()` centralizado · erro → `ErrorMessage(error!!)` · senão → `MovieList(movies)` | 4 |
| 2 | `MovieList`: `LazyColumn` com item de cabeçalho (`"N filmes populares"`) + `items(movies) { MovieCard(it) }` | 3 |
| 3 | `MovieCard`: card com placeholder de poster (box colorido com a inicial do título) + título (2 linhas) + overview (2 linhas) + nota/ano | 3 |

Os comentários `// TODO N` no arquivo `pratica/shared/src/commonMain/kotlin/org/example/project/App.kt` trazem a especificação exata de cada um.

**Critério eliminatório:** se `./gradlew :androidApp:assembleDebug` não builda, os 10 pts ficam zerados.

---

## Entrega

PR no **seu fork** do repo público tocando `exercicios/06-kmp/pratica/`. Link do PR colado no Canvas.

```
meu-fork/
  exercicios/06-kmp/pratica/
    shared/src/commonMain/kotlin/org/example/project/App.kt   ← os 3 TODOs resolvidos
```

> Não precisa commitar `local.properties` (contém seu token — já está no `.gitignore`).
