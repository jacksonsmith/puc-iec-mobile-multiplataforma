// Ex3 · TASK 9 — teste unitário do `favoritesProvider` (sem UI).
//
// ProviderContainer = um "mini-app" do Riverpod: guarda o estado dos providers sem precisar de tela.
// Cada teste cria o seu, então um não enxerga os favoritos do outro.
//
// Desde a TASK 7 o provider também lê/grava no Firestore. Aqui o Firebase não sobe, então essas
// chamadas falham por dentro do try/catch ("No Firebase App" no log) e sobra só o estado local —
// exatamente o que este teste quer verificar.

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

    c.read(favoritesProvider.notifier).toggle(1); // de novo → remove
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2);
    expect(c.read(favoritesProvider), {1, 2});

    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('cada ação cria um Set novo e avisa quem está ouvindo', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    final notified = <Set<int>>[];
    c.listen(favoritesProvider, (_, next) => notified.add(next));
    final before = c.read(favoritesProvider);

    c.read(favoritesProvider.notifier).toggle(7);

    // se o toggle alterasse o Set antigo por dentro (state.add), o Riverpod não avisaria a UI
    expect(identical(c.read(favoritesProvider), before), isFalse);
    expect(before, isEmpty, reason: 'o Set anterior não pode ter sido alterado');
    expect(notified, [
      {7}
    ]);
  });
}
