# Atividade 5 — KMP: Filmes Populares · COMECE AQUI

Projeto Kotlin Multiplatform (Android · iOS · Web) gerado pelo wizard oficial. **Você só escreve UI** em
`shared/src/commonMain/kotlin/org/example/project/App.kt` — a chamada à API (TMDB) já está pronta.
Enunciado, rubrica e entrega: [`../enunciado.md`](../enunciado.md).

## 1. Entre na pasta certa

```bash
cd exercicios/05-kmp/pratica
ls shared/src/commonMain/kotlin/org/example/project    # deve listar App.kt e data/
```

> Abra **esta pasta (`pratica/`)** no Android Studio — não o repositório inteiro.

## 2. Configure o token do TMDB (grátis)

1. Copie `local.properties.example` para `local.properties`
2. Gere o token em [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (**API Read Access Token**, o JWT longo `eyJhbGc…`)
3. Cole em `tmdb.token=` e ajuste `sdk.dir=` (o Android Studio costuma preencher sozinho)
4. **Sync Gradle** (elefante 🐘 na barra) — o token vira `BuildKonfig.TMDB_TOKEN` em todas as plataformas

> `local.properties` está no `.gitignore` — **nunca commite o token**.

## 3. Rode

- **Android (obrigatório):** dropdown `androidApp` + emulador (ou celular via USB) → ▶
- **Web (opcional, rápido pra ver a UI):** `./gradlew :webApp:wasmJsBrowserDevelopmentRun`
- **iOS (opcional, só Mac):** `open iosApp/iosApp.xcodeproj` e rode pelo Xcode

Sem o token, o app mostra *"Token TMDB não configurado"* — é o estado esperado até o passo 2.

## 4. O que fazer (3 TODOs em `App.kt`)

| TODO | O quê |
|---|---|
| 1 | `when` dos estados: sem token · carregando · erro · lista |
| 2 | `MovieList`: `LazyColumn` com cabeçalho + itens |
| 3 | `MovieCard`: card com placeholder de poster, título, overview, nota e ano |

Os comentários `// TODO N` no arquivo trazem a especificação exata de cada um.

## 5. Antes de abrir o PR

O build precisa passar — **critério eliminatório** (não builda = 0 pts):

```bash
./gradlew :androidApp:assembleDebug
```

Se deu erro de sync/versão: o projeto exige **Android Studio Quail 2026.1.1+** e **JDK 17**. Use
`./gradlew --no-configuration-cache <task>` se o config cache reclamar.
