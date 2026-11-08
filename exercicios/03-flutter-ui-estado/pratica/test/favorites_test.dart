// Ex3 · TASK 9 — teste autoral do `favoritesProvider` (local), ISOLADO: sem UI e sem Firestore.
//
// ProviderContainer = um "mini-app" só com os providers. Sem Firebase inicializado o provider
// fica só em memória (igual à TASK 2) — então aqui se testa a REGRA do estado, não a nuvem.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  late ProviderContainer c;

  setUp(() {
    c = ProviderContainer();
    addTearDown(c.dispose);
  });

  test('favoritos: começa vazio → toggle(1) adiciona → toggle(1) remove → clear() esvazia', () {
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

  test('toggle só mexe no filme pedido', () {
    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2)
      ..toggle(3)
      ..toggle(2);
    expect(c.read(favoritesProvider), {1, 3});
  });

  test('estado imutável: cada mudança gera um Set NOVO e o anterior fica intacto', () {
    final antes = c.read(favoritesProvider);
    c.read(favoritesProvider.notifier).toggle(1);
    final depois = c.read(favoritesProvider);

    expect(identical(antes, depois), isFalse);
    expect(antes, isEmpty, reason: 'o Set antigo não pode ter sido mutado');
    expect(depois, {1});
  });

  test('quem escuta é notificado a cada mudança — e só quando o conteúdo muda', () {
    final tamanhos = <int>[];
    c.listen<Set<int>>(favoritesProvider, (_, next) => tamanhos.add(next.length));

    final fav = c.read(favoritesProvider.notifier);
    fav.toggle(1);
    fav.toggle(2);
    fav.clear();
    fav.clear(); // já estava vazio: mesmo conteúdo → ninguém é notificado

    expect(tamanhos, [1, 2, 0]);
  });

  test('cada ProviderContainer tem o próprio estado (por isso um teste não vaza no outro)', () {
    final outro = ProviderContainer();
    addTearDown(outro.dispose);

    c.read(favoritesProvider.notifier).toggle(1);

    expect(c.read(favoritesProvider), {1});
    expect(outro.read(favoritesProvider), isEmpty);
  });
}
