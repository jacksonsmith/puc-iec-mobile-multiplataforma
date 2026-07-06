import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    expect(container.read(favoritesProvider), isEmpty);

    container.read(favoritesProvider.notifier).toggle(1);
    expect(container.read(favoritesProvider), contains(1));

    container.read(favoritesProvider.notifier).toggle(1);
    expect(container.read(favoritesProvider), isNot(contains(1)));

    container.read(favoritesProvider.notifier).toggle(2);
    container.read(favoritesProvider.notifier).clear();
    expect(container.read(favoritesProvider), isEmpty);
  });
}
