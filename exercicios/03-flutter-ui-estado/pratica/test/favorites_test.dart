
// test/favorites_test.dart
//
// Ex3 · TASK 6 — Teste automatizado de favoritos.
// Testa o favoritesProvider isoladamente, sem interface.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    // Verifica se o estado começa vazio.
    expect(c.read(favoritesProvider), isEmpty);

    // Adiciona o filme 1 aos favoritos.
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    // Remove o filme 1 dos favoritos.
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    // Adiciona novamente para testar o clear().
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    // Limpa todos os favoritos.
    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
