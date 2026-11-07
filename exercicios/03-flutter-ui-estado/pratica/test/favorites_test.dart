// Ex3 · TASK 6 — teste do `favoritesProvider` (unitário, sem UI).
//
// Testa o provider ISOLADO com ProviderContainer:
//   - começa vazio
//   - toggle(1) adiciona; toggle(1) de novo remove
//   - clear() esvazia
//
// `ProviderContainer` funciona como um "mini-app" para testar o estado sem
// precisar montar widget nenhum.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    // começa vazio
    expect(c.read(favoritesProvider), isEmpty);
    expect(c.read(favoritesProvider).length, 0);

    // toggle(1) adiciona
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);
    expect(c.read(favoritesProvider).length, 1);

    // toggle(1) de novo → NÃO contém mais o 1
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);
    expect(c.read(favoritesProvider), isEmpty);

    // clear() → volta a ficar vazio
    c.read(favoritesProvider.notifier).toggle(2);
    c.read(favoritesProvider.notifier).toggle(3);
    expect(c.read(favoritesProvider).length, 2);

    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
    expect(c.read(favoritesProvider).length, 0);
  });
}
