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

  // ── TASK 12 — serialização ───────────────────────────────────────────────────────
  // O cache offline (TASK 13) guarda a lista como texto JSON: toJson vira Map → jsonEncode,
  // e o caminho de volta é jsonDecode → Map → fromJson.
  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'rating': rating,
        'year': year,
        // extra: o pôster dos dados reais (TMDB) sobrevive offline. O `if` dentro do Map só
        // inclui a chave quando há valor — a lista simulada continua com exatamente 4 campos.
        if (posterPath != null) 'posterPath': posterPath,
      };

  factory Movie.fromJson(Map<String, dynamic> json) => Movie(
        // `as num` + conversão: no JSON, 8 e 8.0 são o mesmo número, mas no Dart 8 é int —
        // `json['rating'] as double` quebraria com uma nota inteira.
        id: (json['id'] as num).toInt(),
        title: json['title'] as String,
        rating: (json['rating'] as num).toDouble(),
        year: json['year'] as String,
        posterPath: json['posterPath'] as String?,
      );
}
