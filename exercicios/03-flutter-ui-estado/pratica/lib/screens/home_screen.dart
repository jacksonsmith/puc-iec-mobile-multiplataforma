// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 4): mostre o contador de favoritos no header.

import 'package:flutter/material.dart';
// TASK 4 — descomente para ler o contador (e troque StatelessWidget por ConsumerWidget):
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../state/favorites.dart';
import '../data/movies.dart';
import '../widgets/movie_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: const [
          // ── Ex2 · TASK 4 — contador de favoritos ────────────────────────
          // Vire `ConsumerWidget` e troque o '0' por:
          //   ref.watch(favoritesProvider).length
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ 0')),
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
