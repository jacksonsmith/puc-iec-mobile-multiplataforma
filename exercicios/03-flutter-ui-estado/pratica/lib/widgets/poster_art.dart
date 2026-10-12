import 'package:flutter/material.dart';
import '../models/movie.dart';

class PosterArt extends StatelessWidget {
  final Movie movie;

  const PosterArt({super.key, required this.movie});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: SizedBox(
        width: 64,
        height: 88,
        child: movie.posterPath == null
            ? ColoredBox(
                color: Theme.of(context).colorScheme.primaryContainer,
                child: Center(
                  child: Text(
                    movie.title.substring(0, 1).toUpperCase(),
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              )
            : Image.network(
                movie.posterPath!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => ColoredBox(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  child: const Icon(Icons.movie_outlined),
                ),
              ),
      ),
    );
  }
}
