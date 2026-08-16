# Filmes (Flutter) — pratica/ da Atividade 3

App de catálogo de filmes em **Flutter**. Já roda; você completa os scaffolds (UI + estado) até `flutter test` ficar verde.

## Rodar
```bash
flutter pub get
flutter run -d chrome   # abre no navegador — sem emulador, sem rede/token
```

## Testar (é o gate da Atividade 3)
```bash
flutter test            # Ex1 (card) · Ex2 (favoritar/limpar) · Ex3 (seu teste) · checklist (auto-verificação)
flutter analyze         # precisa ficar limpo
```
Comece com os testes **vermelhos**; deixe-os **verdes**.

> `test/checklist_test.dart` é sua **auto-verificação** (não edite): tudo verde = você terminou.

## O que completar (🧑‍🏫 aula · 🧑‍💻 casa)
| TASK | Arquivo | O quê | |
|---|---|---|---|
| 1 | `lib/widgets/movie_card.dart` | compor o card (título + ⭐ nota + ano) | 🧑‍🏫 |
| 2 | `lib/state/favorites.dart` | `favoritesProvider` (`toggle` + `clear`) | 🧑‍🏫 |
| 3 | `lib/widgets/movie_card.dart` | coração favoritando (`ConsumerWidget` + `ref`) | 🧑‍💻 |
| 4 | `lib/screens/home_screen.dart` | contador `♥ N` no header | 🧑‍💻 |
| 5 | `lib/screens/home_screen.dart` | botão **limpar** favoritos | 🧑‍💻 |
| 6 | `test/favorites_test.dart` | **você escreve** um teste do provider | 🧑‍💻 |

Veja o `guia-passo-a-passo.md` (na pasta do exercício) e o `enunciado.md` (rubrica).

## Por que provider em vez de prop drilling?

O estado de favoritos é lido em três pontos da árvore de widgets — o `MovieCard` (coração), o header do `HomeScreen` (contador `♥ N`) e o botão limpar (também no header) — sendo que `MovieCard` só chega a `HomeScreen` através do `ListView.builder`. Passar esse estado por parâmetro (prop drilling) exigiria repassá-lo manualmente por cada widget intermediário nesse caminho até os consumidores, acoplando componentes que não deveriam saber uns dos outros e obrigando a reescrever a cadeia de props toda vez que a árvore mudasse. Com o `favoritesProvider`, cada widget lê (`ref.watch`) ou escreve (`ref.read(...notifier)`) diretamente na fonte única de estado, sem depender da posição na árvore — o que escala melhor conforme o app cresce e os consumidores se multiplicam.

## Entrega
Fork + PR no repo público; link no Canvas. O **J.A.R.V.I.S.** roda `flutter test` no seu PR.
- ✏️ **Edite os arquivos dentro de `exercicios/03-flutter-ui-estado/pratica/` (no lugar)** — **não crie subpasta** `aluno-.../`. O autograder roda `flutter test` nessa pasta.

> **Não comite** `.dart_tool/`, `build/`, `pubspec.lock` (já no `.gitignore`).
