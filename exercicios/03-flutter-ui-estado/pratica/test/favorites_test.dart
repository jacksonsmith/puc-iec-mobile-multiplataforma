import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle adiciona, remove e clear esvazia', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);
    expect(c.read(favoritesProvider), isEmpty);
    final notifier = c.read(favoritesProvider.notifier);
    notifier.toggle(1);
    expect(c.read(favoritesProvider), {1});
    notifier.toggle(1);
    expect(c.read(favoritesProvider), isEmpty);
    notifier.toggle(1);
    notifier.toggle(2);
    expect(c.read(favoritesProvider), {1, 2});
    notifier.clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
