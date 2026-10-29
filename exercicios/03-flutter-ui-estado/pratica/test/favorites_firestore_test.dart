// Ex4 · TASK 7: favoritesProvider sincronizado com Firestore, usando um Firestore falso
// em memória (fake_cloud_firestore) no lugar do projeto real.

import 'package:fake_cloud_firestore/fake_cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  late FakeFirebaseFirestore firestore;
  late ProviderContainer container;

  ProviderContainer containerFor(FakeFirebaseFirestore db) {
    final c = ProviderContainer(overrides: [firestoreProvider.overrideWithValue(db)]);
    addTearDown(c.dispose);
    c.listen(favoritesProvider, (_, __) {}); // mantém o provider vivo, como a tela faz
    return c;
  }

  Future<List<dynamic>?> storedIds() async =>
      (await firestore.doc(favoritesDocPath).get()).data()?['ids'] as List<dynamic>?;

  setUp(() {
    firestore = FakeFirebaseFirestore();
    container = containerFor(firestore);
  });

  test('carrega os favoritos já salvos no documento', () async {
    await firestore.doc(favoritesDocPath).set({
      'ids': [3, 7],
    });
    final fresh = containerFor(firestore);
    await pumpEventQueue();
    expect(fresh.read(favoritesProvider), {3, 7});
  });

  test('toggle atualiza a UI na hora e grava no documento', () async {
    container.read(favoritesProvider.notifier).toggle(5);
    expect(container.read(favoritesProvider), {5});
    await pumpEventQueue();
    expect(await storedIds(), [5]);
  });

  test('clear grava a lista vazia', () async {
    container.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2);
    await pumpEventQueue();
    container.read(favoritesProvider.notifier).clear();
    await pumpEventQueue();
    expect(await storedIds(), isEmpty);
    expect(container.read(favoritesProvider), isEmpty);
  });

  test('mudança feita em outro aparelho chega em tempo real', () async {
    await pumpEventQueue();
    await firestore.doc(favoritesDocPath).set({
      'ids': [9],
    });
    await pumpEventQueue();
    expect(container.read(favoritesProvider), {9});
  });
}
