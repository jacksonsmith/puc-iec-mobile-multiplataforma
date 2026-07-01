// Ex3 · TASK 6 — VOCÊ escreve este teste 🧑‍💻 EM CASA
// (faça DEPOIS do TASK 2 — o provider precisa existir).
//
// Teste o `favoritesProvider` ISOLADO (sem UI) com ProviderContainer:
//   - começa vazio
//   - toggle(1) adiciona; toggle(1) de novo remove
//   - clear() esvazia

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    expect(c.read(favoritesProvider), isEmpty);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier).toggle(1);
    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
