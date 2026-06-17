# Filmes (Flutter) — pratica/ da Atividade 3

App de catálogo de filmes em **Flutter**. Já roda; você completa os scaffolds (UI + estado) até `flutter test` ficar verde.

## Rodar
```bash
flutter pub get
flutter run -d chrome   # abre no navegador — sem emulador, sem rede/token
```

## Testar (é o gate da Atividade 3)
```bash
flutter test            # 2 testes: Ex1 (UI do card) e Ex2 (favoritos/estado)
flutter analyze         # precisa ficar limpo
```
Comece com os testes **vermelhos**; deixe-os **verdes**.

## O que completar
| TASK | Arquivo | O quê |
|---|---|---|
| 1 | `lib/widgets/movie_card.dart` | compor o card (título + ⭐ nota + ano) |
| 2 | `lib/state/favorites.dart` | `favoritesProvider` (Riverpod) |
| 3 | `lib/widgets/movie_card.dart` | coração favoritando (`ConsumerWidget` + `ref`) |
| 4 | `lib/screens/home_screen.dart` | contador `♥ N` no header |

Veja o `guia-passo-a-passo.md` (na pasta do exercício) e o `enunciado.md` (rubrica).

## Entrega
Fork + PR no repo público; link no Canvas. O **J.A.R.V.I.S.** roda `flutter test` no seu PR.

> **Não comite** `.dart_tool/`, `build/`, `pubspec.lock` (já no `.gitignore`).
