// lib/models/movie.dart — modelo de domínio. Não precisa mexer.

class Movie {
  final int id;
  final String title;
  final double rating;
  final String year;

  const Movie({
    required this.id,
    required this.title,
    required this.rating,
    required this.year,
  });
}
