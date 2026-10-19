// lib/models/movie.dart — modelo de domínio.
//
// TASK 12: toJson() e Movie.fromJson().
// O cache offline guarda cada filme como JSON — sem isso nada é salvo.

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

  // ── TASK 12 — serialização ──────────────────────────────────────────────────────
  // posterPath só entra quando existe (dados reais do TMDB): o pôster sobrevive offline
  // e a lista simulada continua com exatamente os 4 campos.
  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'rating': rating,
        'year': year,
        if (posterPath != null) 'posterPath': posterPath,
      };

  factory Movie.fromJson(Map<String, dynamic> json) => Movie(
        id: (json['id'] as num).toInt(),
        title: json['title'] as String,
        rating: (json['rating'] as num).toDouble(), // o JSON pode trazer 8 em vez de 8.0
        year: json['year'] as String,
        posterPath: json['posterPath'] as String?,
      );
}
