// Ex3 · TASK 9 — teste autoral do `favoritesProvider` (estado LOCAL, sem UI e sem Firestore).
//
// `ProviderContainer` = um "mini-app" do Riverpod: dá para ler e chamar o provider sem tela.
// (No teste o Firebase não é inicializado; o provider cai no estado local — o aviso
// "No Firebase App" no console é esperado.)

import 'package:filmes_flutter/state/favorites.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('favoritesProvider (local)', () {
    late ProviderContainer c;

    setUp(() {
      c = ProviderContainer();
      addTearDown(c.dispose);
    });

    test('começa vazio', () {
      expect(c.read(favoritesProvider), isEmpty);
    });

    test('toggle(1) adiciona e toggle(1) de novo remove', () {
      final notifier = c.read(favoritesProvider.notifier);

      notifier.toggle(1);
      expect(c.read(favoritesProvider), {1});

      notifier.toggle(1);
      expect(c.read(favoritesProvider).contains(1), isFalse);
      expect(c.read(favoritesProvider), isEmpty);
    });

    test('vários ids convivem e clear() esvazia tudo', () {
      final notifier = c.read(favoritesProvider.notifier);
      notifier
        ..toggle(1)
        ..toggle(2)
        ..toggle(3);
      expect(c.read(favoritesProvider), {1, 2, 3});

      notifier.toggle(2); // remove só o 2
      expect(c.read(favoritesProvider), {1, 3});

      notifier.clear();
      expect(c.read(favoritesProvider), isEmpty);
    });

    test('estado é imutável: cada toggle gera um NOVO Set (é isso que notifica a UI)', () {
      final antes = c.read(favoritesProvider);
      c.read(favoritesProvider.notifier).toggle(42);
      final depois = c.read(favoritesProvider);

      expect(identical(antes, depois), isFalse);
      expect(antes, isEmpty, reason: 'o Set antigo não pode ser alterado no lugar');
      expect(depois, {42});
    });

    test('quem escuta é notificado a cada mudança (base do card + contador + limpar)', () {
      final tamanhos = <int>[];
      c.listen<Set<int>>(favoritesProvider, (_, next) => tamanhos.add(next.length));

      final notifier = c.read(favoritesProvider.notifier);
      notifier.toggle(1); // 1
      notifier.toggle(2); // 2
      notifier.clear(); //   0

      expect(tamanhos, [1, 2, 0]);
    });
  });
}
