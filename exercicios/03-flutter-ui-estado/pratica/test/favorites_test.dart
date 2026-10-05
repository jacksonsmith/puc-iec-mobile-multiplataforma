import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
	test('favoritesProvider começa vazio, alterna favoritos e limpa o estado', () {
		final container = ProviderContainer();
		addTearDown(container.dispose);

		expect(container.read(favoritesProvider), isEmpty);

		container.read(favoritesProvider.notifier).toggle(1);
		expect(container.read(favoritesProvider), contains(1));

		container.read(favoritesProvider.notifier).toggle(1);
		expect(container.read(favoritesProvider), isEmpty);

		container.read(favoritesProvider.notifier).toggle(1);
		container.read(favoritesProvider.notifier).clear();
		expect(container.read(favoritesProvider), isEmpty);
	});
}
