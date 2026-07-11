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

## Por que provider (Riverpod) > prop drilling
Os favoritos são lidos e escritos em três lugares diferentes — o coração de cada `MovieCard`, o contador `♥ N` do header e o botão de limpar — que não têm relação de pai/filho direta na árvore de widgets. Com _prop drilling_ eu teria que passar o `Set<int>` e os callbacks `toggle`/`clear` manualmente por cada widget intermediário (`Scaffold`, `AppBar`, `ListView`, `MovieCard`...), mesmo os que só repassam sem usar; qualquer mudança na forma do estado obrigaria a mexer em toda a cadeia, e widgets fora do caminho da árvore simplesmente não teriam acesso. O `favoritesProvider` resolve isso sendo uma **fonte única** que qualquer widget acessa direto via `ref.watch`/`ref.read`, sem acoplar os intermediários: só quem realmente observa o estado reconstrói quando ele muda, o contador e os cards ficam sempre sincronizados automaticamente, e adicionar um novo consumidor não exige tocar em nenhum widget do meio do caminho. Isso escala muito melhor conforme a UI cresce.

## Entrega
Fork + PR no repo público; link no Canvas. O **J.A.R.V.I.S.** roda `flutter test` no seu PR.
- ✏️ **Edite os arquivos dentro de `exercicios/03-flutter-ui-estado/pratica/` (no lugar)** — **não crie subpasta** `aluno-.../`. O autograder roda `flutter test` nessa pasta.

> **Não comite** `.dart_tool/`, `build/`, `pubspec.lock` (já no `.gitignore`).
