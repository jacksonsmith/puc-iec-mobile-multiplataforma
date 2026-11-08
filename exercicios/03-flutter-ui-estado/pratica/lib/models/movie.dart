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

  // ── TASK 12 — serialização ───────────────────────────────────────────────────────
  // O cache offline guarda cada filme como JSON. posterPath só entra quando existe
  // (dados reais do TMDB) — assim o pôster sobrevive offline e o JSON da lista simulada
  // continua com os 4 campos.
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
