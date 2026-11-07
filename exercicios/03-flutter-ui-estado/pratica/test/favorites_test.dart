// Ex3 · TASK 9 — teste unitário do favoritesProvider (sem UI, sem Firestore).
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
    final fav = c.read(favoritesProvider.notifier);
    expect(c.read(favoritesProvider), isEmpty);

    fav.toggle(1);
    expect(c.read(favoritesProvider), {1});

    fav.toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);
    expect(c.read(favoritesProvider), isEmpty);

    fav.toggle(1);
    fav.toggle(2);
    expect(c.read(favoritesProvider), {1, 2});

    fav.clear();
    expect(c.read(favoritesProvider), isEmpty);
  });

  test('favoritos: cada toggle cria um Set novo (Riverpod detecta a mudança)', () {
    final before = c.read(favoritesProvider);
    c.read(favoritesProvider.notifier).toggle(7);
    final after = c.read(favoritesProvider);
    expect(identical(before, after), isFalse);
    expect(before, isEmpty, reason: 'o estado anterior não pode ser mutado');
  });

  test('favoritos: o estado é compartilhado por quem escuta o provider', () {
    final seen = <int>[];
    c.listen<Set<int>>(favoritesProvider, (_, next) => seen.add(next.length));
    c.read(favoritesProvider.notifier).toggle(1);
    c.read(favoritesProvider.notifier).toggle(2);
    c.read(favoritesProvider.notifier).clear();
    expect(seen, [1, 2, 0]);
  });
}
