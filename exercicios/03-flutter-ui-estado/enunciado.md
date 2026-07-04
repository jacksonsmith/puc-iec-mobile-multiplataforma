# Atividade 3 — App Flutter: UI + Estado + Testes (15 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Aula:** 3 (17/06/2026) · **Entrega:** até **23/06/2026 23:59**
**Modalidade:** individual · **Dificuldade:** ⭐⭐ Médio
**Auto-grade:** ✅ (J.A.R.V.I.S. roda `flutter test` no seu PR)

> Na Aula 3 você viu Flutter por dentro — **widgets, composição e estado com Riverpod** — e começou a montar o `MovieCard` no DartPad. **Esta atividade é o término disso, num projeto Flutter de verdade.** Você baixa o projeto (que já roda), completa os scaffolds e faz os **testes ficarem verdes** — inclusive **um teste que você mesmo escreve**.

## Objetivos de aprendizagem (Bloom)
- **Entender** — explicar a UI do Flutter como **árvore de widgets** e por que estado compartilhado pede um *provider* (e não prop drilling).
- **Aplicar (Ex1)** — **compor** um `MovieCard` (`Card`/`Column`/`Row`/`Text`/`Icon`).
- **Aplicar/Analisar (Ex2)** — **modelar estado compartilhado** com **Riverpod** refletindo em 3 lugares (card, contador, botão limpar) a partir de **uma fonte só**.
- **Aplicar (Ex3)** — **escrever um teste automatizado** do estado (`flutter test` com `ProviderContainer`).
- **Avaliar** — argumentar (README, 1 parágrafo) por que o provider escala melhor que passar estado por parâmetro.

## 📍 Em aula (🧑‍🏫) × em casa (🧑‍💻)
Fazemos **juntos em aula** o **TASK 1** (compor o card) e o **TASK 2** (criar o provider) — o modelo de cada padrão. **TASK 3–6 você termina sozinho** (parte solo avaliativa).

---

## Setup (na aula a gente começa o download)
```bash
flutter doctor                          # https://docs.flutter.dev/get-started/install
cd exercicios/03-flutter-ui-estado/pratica
flutter pub get
flutter run -d chrome                   # o app já abre (lista de filmes), sem emulador/rede
flutter test                            # começa VERMELHO — deixe verde (checklist_test.dart confirma que terminou tudo)
```

---

## Exercício 1 — UI: componha o `MovieCard`
🧑‍🏫 **TASK 1** (`lib/widgets/movie_card.dart`): hoje o card mostra **só o título**. Componha:
- `Card` → `Padding(16)` → `Column` (`crossAxisAlignment: .start`, `mainAxisSize: .min`): **título** (20, negrito) · **nota** (`Row` com `Icon(Icons.star, color: Colors.amber)` + `Text(' ${movie.rating}')`) · **ano** (`movie.year`, cinza).

✅ **Verde:** teste *"Ex1 — MovieCard mostra título, nota (⭐) e ano"*.

## Exercício 2 — Estado: favoritos com Riverpod
Uma fonte só (`favoritesProvider`) refletindo no **card**, no **contador** e no botão **limpar**:
1. 🧑‍🏫 **TASK 2** (`state/favorites.dart`): `favoritesProvider` (`Notifier<Set<int>>` com `toggle(id)` **e** `clear()`).
2. 🧑‍💻 **TASK 3** (`widgets/movie_card.dart`): vire `ConsumerWidget`, leia `ref.watch(favoritesProvider)` e adicione um coração (`IconButton` `favorite`/`favorite_border`) que chama `toggle`.
3. 🧑‍💻 **TASK 4** (`screens/home_screen.dart`): vire `ConsumerWidget` e mostre `♥ <nº>` (`ref.watch(favoritesProvider).length`).
4. 🧑‍💻 **TASK 5** (`screens/home_screen.dart`): botão **limpar** (`IconButton(Icons.delete_outline)`) que chama `clear()`.

✅ **Verde:** *"Ex2 — favoritar reflete…"* + *"Ex2 — limpar zera o contador"*.

> **Prova do estado compartilhado:** card, contador e limpar leem/escrevem o **mesmo** provider — sem passar nada por parâmetro.

## Exercício 3 — Testes: você escreve
🧑‍💻 **TASK 6** (`test/favorites_test.dart`): escreva um teste **unitário** do `favoritesProvider` com `ProviderContainer` (sem UI): começa vazio → `toggle(1)` adiciona → `toggle(1)` remove → `clear()` esvazia. (Há um modelo comentado no arquivo.)

✅ **Verde:** seu teste em `test/favorites_test.dart` passa (`flutter test`).

---

## Critérios de avaliação (15 pts)
| # | Critério | Pts | Como é medido |
|---|---|---|---|
| 1 | App compila e roda (`flutter run` / `flutter analyze` limpo) | 2 | manual (eliminatório) |
| 2 | **Ex1** · `MovieCard` compõe título + nota (⭐) + ano | 3 | `flutter test` |
| 3 | **Ex2** · favoritar reflete no card + contador | 4 | `flutter test` |
| 4 | **Ex2** · botão limpar zera o estado | 2 | `flutter test` |
| 5 | **Ex3** · teste autoral do provider passa | 3 | `flutter test` |
| 6 | README — como rodar + **1 parágrafo**: por que provider > prop drilling | 1 | manual (Canvas) |

> O autograder posta uma **nota mínima** (a parte de `flutter test`); compilar/rodar e o parágrafo do README são avaliados na leitura. A final sai no Canvas.

## Entrega
- **Fork + Pull Request** no repo público; cole o link no Canvas. `flutter test` é o gate.
- **Hands-on da aula não pontua** — a entrega solo (testes verdes) vale os 15 pts.
- ✏️ **Edite os arquivos dentro de `exercicios/03-flutter-ui-estado/pratica/` (no lugar)** — **não crie subpasta** `aluno-.../`. O autograder roda `flutter test` nessa pasta.

> **Bridging nativo entra na Aula 4** (KMP + Platform Channel) — aqui o foco é **UI + estado + testes**.
