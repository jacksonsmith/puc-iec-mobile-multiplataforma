// Ex3 · TASK 9 — teste unitário do `favoritesProvider`, ISOLADO (sem UI, sem Firestore).
//
// ProviderContainer = um "mini-app" só com os providers. Aqui o Firebase não sobe, então o
// notifier cai no modo em memória (o mesmo do TASK 2) — é exatamente essa lógica que testamos.

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
    final favs = c.read(favoritesProvider.notifier);
    expect(c.read(favoritesProvider), isEmpty);

    favs.toggle(1);
    expect(c.read(favoritesProvider), {1});

    favs.toggle(1); // de novo → remove
    expect(c.read(favoritesProvider), isEmpty);

    favs
      ..toggle(1)
      ..toggle(2)
      ..toggle(3);
    expect(c.read(favoritesProvider), {1, 2, 3});

    favs.clear();
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('toggle troca o Set inteiro (não muta o anterior) e notifica quem ouve', () {
    final notified = <Set<int>>[];
    c.listen(favoritesProvider, (_, next) => notified.add(next));
    final antes = c.read(favoritesProvider);

    c.read(favoritesProvider.notifier).toggle(7);

    // se o Set fosse mutado no lugar, `antes` também teria o 7 e o Riverpod não veria mudança
    expect(antes, isEmpty);
    expect(identical(antes, c.read(favoritesProvider)), isFalse);
    expect(notified, [
      {7}
    ]);
  });
}
