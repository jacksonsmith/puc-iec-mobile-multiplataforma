// lib/widgets/movie_card.dart
//
// Ex1 (TASK 1): componha o card.
// Ex2 (TASK 4): ligue o coração ao estado de favoritos.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/movie.dart';
import '../state/favorites.dart';
import 'poster_art.dart';

/// Card de um filme: pôster · título · ⭐ nota · ano · coração de favorito.
///
/// É um `ConsumerWidget`: lê o `favoritesProvider` direto (sem receber nada por parâmetro),
/// então o coração, o contador do header e o botão "limpar" ficam sempre em sincronia.
class MovieCard extends ConsumerWidget {
  final Movie movie;
  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // TASK 4 — `watch` lê E re-renderiza este card quando os favoritos mudam.
    final isFav = ref.watch(favoritesProvider).contains(movie.id);

    // TASK 1 — Card → Padding(14) → Row(pôster · espaço · Column(título, nota, ano) · coração)
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
                  const SizedBox(height: 4),
                  Text(movie.year, style: const TextStyle(color: Colors.grey)),
                ],
              ),
            ),
            // TASK 4 — `read(...notifier)` só dispara a ação (não precisa ouvir).
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
