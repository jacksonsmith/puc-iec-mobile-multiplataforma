// Ex3 · TASK 9 — teste unitário do favoritesProvider, ISOLADO (sem UI, sem Firestore).
//
// ProviderContainer = um "mini-app" só com os providers. Sem Firebase inicializado,
// o notifier cai no modo em memória (a leitura/escrita no Firestore falha e é ignorada).

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  late ProviderContainer c;

  setUp(() {
    c = ProviderContainer();
    addTearDown(c.dispose);
  });

  test('favoritos: começa vazio, toggle adiciona e remove, clear esvazia', () {
    expect(c.read(favoritesProvider), isEmpty);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider), {1});

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2)
      ..toggle(3);
    expect(c.read(favoritesProvider), {1, 2, 3});

    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('toggle de um filme não mexe nos outros', () {
    final fav = c.read(favoritesProvider.notifier);
    fav.toggle(1);
    fav.toggle(2);
    fav.toggle(1);
    expect(c.read(favoritesProvider), {2});
  });

  test('cada mudança gera um NOVO Set (estado imutável notifica os ouvintes)', () {
    final seen = <Set<int>>[];
    c.listen(favoritesProvider, (_, next) => seen.add(next), fireImmediately: true);

    final fav = c.read(favoritesProvider.notifier);
    fav.toggle(7);
    fav.clear();

    expect(seen, [<int>{}, {7}, <int>{}]);
    expect(identical(seen[0], seen[2]), isFalse);
  });

  test('clear com a lista já vazia continua vazio', () {
    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
