// lib/widgets/movie_card.dart
//
// Ex1 (TASK 1): card composto — pôster + título + nota (⭐) + ano.
// Ex2 (TASK 4): coração ligado ao favoritesProvider (a mesma fonte do contador e do "limpar").

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/movie.dart';
import '../state/favorites.dart';
import 'poster_art.dart';

class MovieCard extends ConsumerWidget {
  final Movie movie;
  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // select: o card só é redesenhado quando o PRÓPRIO filme entra/sai dos favoritos,
    // e não a cada mudança em qualquer outro card da lista.
    final isFav = ref.watch(favoritesProvider.select((ids) => ids.contains(movie.id)));

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
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 18),
                      Text(' ${movie.rating}'),
                    ],
                  ),
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
              onPressed: () => ref.read(favoritesProvider.notifier).toggle(movie.id),
            ),
          ],
        ),
      ),
    );
  }
}
