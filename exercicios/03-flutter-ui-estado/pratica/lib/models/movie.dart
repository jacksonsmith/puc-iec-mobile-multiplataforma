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

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'rating': rating,
        'year': year,
      };

  factory Movie.fromJson(Map<String, dynamic> json) => Movie(
        id: json['id'] as int,
        title: json['title'] as String,
        rating: (json['rating'] as num).toDouble(),
        year: json['year'] as String,
      );
}
