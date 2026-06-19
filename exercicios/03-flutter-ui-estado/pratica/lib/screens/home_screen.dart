// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 4): contador de favoritos no header.
// Ex2 (TASK 5): botão "limpar" favoritos.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../data/movies.dart';
import '../widgets/movie_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    final favoriteCount = ref.watch(favoritesProvider).length;

    bool hasFavs() {
      return favoriteCount > 0;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: "♥", style: TextStyle(color: hasFavs() ? Colors.red : Colors.grey)
                    ),
                    TextSpan(
                      text: ' $favoriteCount'
                    )
                  ]
                )
              ),
            ),
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
