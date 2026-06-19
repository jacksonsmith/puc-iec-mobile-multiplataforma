// lib/widgets/movie_card.dart
//
// Ex1 (TASK 1): componha o card.
// Ex2 (TASK 3): ligue o coração ao estado de favoritos.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../models/movie.dart';

class MovieCard extends ConsumerWidget {
  final Movie movie;
  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    final isFav = ref.watch(favoritesProvider).contains(movie.id);
    
    return Card(
      child: InkWell(
        onTap: () => ref.read(favoritesProvider.notifier).toggle(movie.id),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(movie.title, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              Row(
                children: [
                  Icon(Icons.star, color: Colors.amber, size: 18),
                  Text(' ${movie.rating}'),
                ],
              ),
              Text(movie.year, style: TextStyle(color: Colors.grey)),
              Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : Colors.grey)
            ],
          ),
        )
      ),
    );
  }
}
