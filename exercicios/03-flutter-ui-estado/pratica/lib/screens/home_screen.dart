import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../data/movies.dart';
import '../widgets/movie_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          IconButton(
              onPressed: () => {ref.read(favoritesProvider.notifier).clear()},
              icon: Icon(Icons.delete_outline)),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child:
                Center(child: Text('♥ ${ref.watch(favoritesProvider).length}')),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: movies.length,
        itemBuilder: (context, i) => MovieCard(movie: movies[i]),
      ),
    );
  }
}
