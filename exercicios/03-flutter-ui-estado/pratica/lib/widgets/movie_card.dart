// lib/widgets/movie_card.dart
//
// Ex1 (TASK 1): card composto — pôster + título + nota (⭐) + ano.
// Ex2 (TASK 4): coração ligado ao estado de favoritos (favoritesProvider).

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../models/movie.dart';
import 'poster_art.dart';

class MovieCard extends ConsumerWidget {
  final Movie movie;
  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ref.watch: lê E re-renderiza este card quando o conjunto de favoritos muda.
    final isFav = ref.watch(favoritesProvider).contains(movie.id);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            PosterArt(movie: movie),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    movie.title,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 18),
                      Text(' ${movie.rating}'),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(movie.year, style: const TextStyle(color: Colors.grey)),
                ],
              ),
            ),
            IconButton(
              tooltip: isFav ? 'Remover dos favoritos' : 'Favoritar',
              icon: Icon(
                isFav ? Icons.favorite : Icons.favorite_border,
                color: isFav ? Colors.red : null,
              ),
              // ref.read(...notifier): só dispara a ação, sem ouvir mudanças.
              onPressed: () => ref.read(favoritesProvider.notifier).toggle(movie.id),
            ),
          ],
        ),
      ),
    );
  }
}
