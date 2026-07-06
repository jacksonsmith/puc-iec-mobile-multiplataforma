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

## Entrega
Fork + PR no repo público; link no Canvas. O **J.A.R.V.I.S.** roda `flutter test` no seu PR.
- ✏️ **Edite os arquivos dentro de `exercicios/03-flutter-ui-estado/pratica/` (no lugar)** — **não crie subpasta** `aluno-.../`. O autograder roda `flutter test` nessa pasta.

> **Não comite** `.dart_tool/`, `build/`, `pubspec.lock` (já no `.gitignore`).

## Provider x prop drilling

O `favoritesProvider` escala melhor que passar estado por parametro porque centraliza a fonte de verdade dos favoritos e permite que widgets distantes leiam ou alterem o mesmo estado sem encadear callbacks por toda a arvore. Nesta pratica, o card, o contador do header e o botao de limpar dependem do mesmo conjunto de ids; com prop drilling, `HomeScreen` precisaria repassar estado e funcoes para cada nivel intermediario, aumentando acoplamento e mudancas em cascata. Com Riverpod, cada widget declara diretamente sua dependencia, o teste unitario do estado fica isolado com `ProviderContainer` e a UI permanece mais simples de evoluir.
