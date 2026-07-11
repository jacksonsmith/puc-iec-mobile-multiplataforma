// Ex3 · TASK 6 — teste autoral do favoritesProvider (sem UI).
// Verifica o ciclo: vazio → toggle adiciona → toggle remove → clear esvazia.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    // começa vazio
    expect(c.read(favoritesProvider), isEmpty);

    // toggle(1) adiciona
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    // toggle(1) de novo → remove
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    // clear() esvazia
    c.read(favoritesProvider.notifier).toggle(2);
    c.read(favoritesProvider.notifier).toggle(3);
    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
