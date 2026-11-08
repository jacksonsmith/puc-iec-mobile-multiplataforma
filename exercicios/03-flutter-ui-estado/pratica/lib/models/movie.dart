
// lib/models/movie.dart
//
// Modelo de domínio.
// TASK 12 — Serialização e desserialização JSON.

class Movie {
  final int id;
  final String title;
  final double rating;
  final String year;
  final String? posterPath;

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
      id: (json['id'] as num).toInt(),
      title: json['title'] as String,
      rating: (json['rating'] as num).toDouble(),
      year: json['year'] as String,
      posterPath: json['posterPath'] as String?,
    );
  }
}
