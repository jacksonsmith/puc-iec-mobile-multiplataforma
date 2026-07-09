import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/data/movies.dart';
import 'package:filmes_flutter/state/favorites.dart';
import 'package:filmes_flutter/widgets/movie_card.dart';

// TASK 4 + TASK 5 concluídas.
// card, contador e limpar leem/escrevem o mesmo favoritesProvider
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          Text(
            '♥ $count',
            style: const TextStyle(fontSize: 18),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () =>
                ref.read(favoritesProvider.notifier).clear(),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: movies.length,
        itemBuilder: (context, index) => MovieCard(movie: movies[index]),
      ),
    );
  }
}
