// Ex3 · TASK 9 — teste autoral do `favoritesProvider` com ProviderContainer.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle adiciona/remove e clear esvazia', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    expect(c.read(favoritesProvider), isEmpty);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier).toggle(2);
    c.read(favoritesProvider.notifier).toggle(3);
    expect(c.read(favoritesProvider), {2, 3});

    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
