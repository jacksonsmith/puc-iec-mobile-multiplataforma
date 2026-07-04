# Guia passo-a-passo — App Flutter: UI + Estado

> O projeto **já roda** (`flutter run -d chrome`). Você completa **4 TASKs** até `flutter test` ficar verde. Rode `flutter test` no começo pra ver os 2 testes vermelhos — é seu alvo.

> 🧑‍🏫 **TASK 1 e 2** a gente faz **juntos em aula** (o modelo). 🧑‍💻 **TASK 3 e 4** você termina **sozinho** em casa.

## Ex1 · TASK 1 — componha o `MovieCard`
`lib/widgets/movie_card.dart`. Troque o stub (só título) por:
```dart
return Card(
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(movie.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Row(children: [
          const Icon(Icons.star, color: Colors.amber, size: 18),
          Text(' ${movie.rating}'),
        ]),
        Text(movie.year, style: const TextStyle(color: Colors.grey)),
      ],
    ),
  ),
);
```
Rode **`flutter test`** → o teste do **Ex1** deve ficar verde.

## Ex2 · TASK 2 — `favoritesProvider` (estado)
`lib/state/favorites.dart`. Apague o stub e implemente:
```dart
class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() => {};
  void toggle(int id) {
    state = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
  }
}
final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
```
> `Notifier` guarda o estado; `state = ...` notifica quem está ouvindo. Como o estado é imutável, criamos um **novo** Set a cada `toggle`.

## Ex2 · TASK 3 — coração no card
`lib/widgets/movie_card.dart`. Vire `ConsumerWidget` e leia o estado:
```dart
class MovieCard extends ConsumerWidget {
  // ...
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isFav = ref.watch(favoritesProvider).contains(movie.id);
    // ...dentro de um Row, ao lado da Column do título, adicione:
    IconButton(
      icon: Icon(isFav ? Icons.favorite : Icons.favorite_border,
          color: isFav ? Colors.red : null),
      onPressed: () => ref.read(favoritesProvider.notifier).toggle(movie.id),
    )
  }
}
```
> `ref.watch` = **lê e re-renderiza** quando muda. `ref.read(...notifier)` = **chama uma ação** (sem ouvir). Lembre dos imports (`flutter_riverpod` + `../state/favorites.dart`).

## Ex2 · TASK 4 — contador no header
`lib/screens/home_screen.dart`. Vire `ConsumerWidget` e troque o `♥ 0`:
```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  final count = ref.watch(favoritesProvider).length;
  // ... no AppBar actions: Text('♥ $count')
}
```
Rode **`flutter test`** → *"favoritar reflete…"* fica verde. 🎉

## Ex2 · TASK 5 — botão "limpar" 🧑‍💻
No `AppBar` `actions`, antes do contador:
```dart
IconButton(
  icon: const Icon(Icons.delete_outline),
  onPressed: () => ref.read(favoritesProvider.notifier).clear(),
)
```
(precisa do `clear()` no notifier — TASK 2.) ✅ teste *"limpar zera o contador"*.

## Ex3 · TASK 6 — escreva um teste 🧑‍💻
`test/favorites_test.dart` — teste o provider **isolado** (sem UI):
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final c = ProviderContainer(); addTearDown(c.dispose);
    expect(c.read(favoritesProvider), isEmpty);
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);
    // complete você: toggle(1) de novo remove · depois clear() esvazia
  });
}
```
> `ProviderContainer` = um "mini-app" pra testar o provider sem tela.

> **O "aha":** card, contador e limpar leem/escrevem o **mesmo** `favoritesProvider` — sem passar estado por parâmetro. É o fim do prop drilling.
