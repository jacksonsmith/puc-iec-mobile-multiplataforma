// Ex3 · TASK 9: teste unitário do favoritesProvider, isolado da UI (ProviderContainer).

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  late ProviderContainer container;
  FavoritesNotifier notifier() => container.read(favoritesProvider.notifier);
  Set<int> favorites() => container.read(favoritesProvider);

  setUp(() {
    container = ProviderContainer();
    addTearDown(container.dispose);
  });

  test('começa vazio', () {
    expect(favorites(), isEmpty);
  });

  test('toggle adiciona e, chamado de novo, remove', () {
    notifier().toggle(1);
    expect(favorites(), {1});

    notifier().toggle(1);
    expect(favorites(), isEmpty);
  });

  test('toggle mantém os outros favoritos', () {
    notifier()
      ..toggle(1)
      ..toggle(2)
      ..toggle(1);
    expect(favorites(), {2});
  });

  test('clear esvazia todos os favoritos', () {
    notifier()
      ..toggle(1)
      ..toggle(2);
    notifier().clear();
    expect(favorites(), isEmpty);
  });

  test('cada mudança gera um novo Set (estado imutável)', () {
    final before = favorites();
    notifier().toggle(1);
    expect(identical(before, favorites()), isFalse);
    expect(before, isEmpty, reason: 'o Set anterior não pode ser mutado');
  });
}
