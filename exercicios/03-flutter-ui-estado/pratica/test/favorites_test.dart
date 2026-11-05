// Ex3 · TASK 9 — teste unitário do favoritesProvider (sem UI, sem Firestore).
//
// ProviderContainer = um "mini-app" sem tela: lê e altera o provider direto.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  late ProviderContainer c;

  setUp(() {
    c = ProviderContainer();
    addTearDown(c.dispose);
  });

  test('favoritos: começa vazio', () {
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('favoritos: toggle adiciona e toggle de novo remove', () {
    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);
  });

  test('favoritos: guarda vários ids sem duplicar', () {
    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2)
      ..toggle(3);
    expect(c.read(favoritesProvider), {1, 2, 3});
  });

  test('favoritos: clear esvazia', () {
    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2);
    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('favoritos: cada toggle gera um Set NOVO (imutabilidade)', () {
    final antes = c.read(favoritesProvider);
    c.read(favoritesProvider.notifier).toggle(1);
    final depois = c.read(favoritesProvider);
    expect(identical(antes, depois), isFalse);
    expect(antes, isEmpty); // o Set antigo não foi alterado
  });
}
