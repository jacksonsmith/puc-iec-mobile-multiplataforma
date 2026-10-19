// Ex3 · TASK 9 — teste autoral do `favoritesProvider` ISOLADO (sem UI, sem Firestore).
//
// ProviderContainer = um "mini-app" só com os providers. O Firebase não sobe em teste, então a
// leitura/gravação no Firestore falha em silêncio e o que sobra é o estado LOCAL — é ele que
// testamos aqui.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  late ProviderContainer c;

  setUp(() {
    c = ProviderContainer();
    addTearDown(c.dispose);
  });

  test('favoritos: começa vazio, toggle adiciona/remove e clear esvazia', () {
    expect(c.read(favoritesProvider), isEmpty);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2);
    expect(c.read(favoritesProvider), {1, 2});

    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('favoritos: toggle de um filme não mexe nos outros', () {
    final fav = c.read(favoritesProvider.notifier);
    fav
      ..toggle(1)
      ..toggle(2)
      ..toggle(3)
      ..toggle(2);
    expect(c.read(favoritesProvider), {1, 3});
  });

  test('favoritos: cada mudança gera um NOVO Set (estado imutável notifica quem ouve)', () {
    final emitted = <Set<int>>[];
    c.listen(favoritesProvider, (_, next) => emitted.add(next), fireImmediately: true);

    c.read(favoritesProvider.notifier).toggle(7);
    c.read(favoritesProvider.notifier).clear();

    expect(emitted, [<int>{}, {7}, <int>{}]);
    expect(identical(emitted[0], emitted[2]), isFalse);
  });
}
