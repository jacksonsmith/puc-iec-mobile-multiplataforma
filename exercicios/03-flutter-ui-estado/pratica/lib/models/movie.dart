// lib/models/movie.dart — modelo de domínio.
//
// TASK 12: toJson() e Movie.fromJson() — o cache offline guarda cada filme como JSON.

class Movie {
  final int id;
  final String title;
  final double rating;
  final String year;
  final String? posterPath; // só vem preenchido com dados reais do TMDB (opcional)

  const Movie({
    required this.id,
    required this.title,
    required this.rating,
    required this.year,
    this.posterPath,
  });

  // posterPath só entra quando existe — assim o pôster dos dados reais sobrevive offline
  // e a lista simulada continua com exatamente os 4 campos.
  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'rating': rating,
        'year': year,
        if (posterPath != null) 'posterPath': posterPath,
      };

  factory Movie.fromJson(Map<String, dynamic> json) => Movie(
        id: json['id'] as int,
        title: json['title'] as String,
        rating: (json['rating'] as num).toDouble(), // o JSON pode trazer 8 em vez de 8.0
        year: json['year'] as String,
        posterPath: json['posterPath'] as String?,
      );
}
