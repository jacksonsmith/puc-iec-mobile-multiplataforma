import 'package:filmes_flutter/state/favorites.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/movie.dart';

class MovieCard extends ConsumerWidget {
  final Movie movie;
  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isFav = ref.watch(favoritesProvider).contains(movie.id);

    return Card(
      child: Padding(
          padding: const EdgeInsets.all(16),
          child:
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(movie.title,
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  Row(children: [
                    Icon(Icons.star, color: Colors.amber, size: 18),
                    Text(' ${movie.rating}')
                  ]),
                  Text(movie.year, style: TextStyle(color: Colors.grey)),
                ]),
            IconButton(
                onPressed: () =>
                    {ref.read(favoritesProvider.notifier).toggle(movie.id)},
                icon: Icon(
                  isFav ? Icons.favorite : Icons.favorite_border,
                )),
          ])),
    );
  }
}
