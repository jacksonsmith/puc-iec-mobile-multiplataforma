import 'package:filmes_flutter/state/favorites.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('favoritos começam vazios, alternam por filme e podem ser limpos', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final favorites = container.read(favoritesProvider.notifier);

    expect(container.read(favoritesProvider), isEmpty);
    favorites.toggle(1);
    favorites.toggle(2);
    expect(container.read(favoritesProvider), {1, 2});
    favorites.toggle(1);
    expect(container.read(favoritesProvider), {2});
    favorites.clear();
    expect(container.read(favoritesProvider), isEmpty);
  });
}
