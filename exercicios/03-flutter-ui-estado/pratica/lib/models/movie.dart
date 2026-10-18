// lib/models/movie.dart — modelo de domínio.
//
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

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'rating': rating,
      'year': year,
      if (posterPath != null) 'posterPath': posterPath,
    };
  }

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'] as int,
      title: json['title'] as String,
      rating: (json['rating'] as num).toDouble(),
      year: json['year'] as String,
      posterPath: json['posterPath'] as String?,
    );
  }
}
