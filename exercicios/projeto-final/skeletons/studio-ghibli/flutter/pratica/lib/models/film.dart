class FilmSummary {
  final String id;
  final String title;

  FilmSummary({required this.id, required this.title});

  factory FilmSummary.fromJson(Map<String, dynamic> json) =>
      FilmSummary(id: json['id'] as String, title: json['title'] as String);
}

class FilmDetail {
  final String id;
  final String title;
  final String director;
  final String releaseDate;
  final String runningTime;
  final String imageUrl;

  FilmDetail({
    required this.id,
    required this.title,
    required this.director,
    required this.releaseDate,
    required this.runningTime,
    required this.imageUrl,
  });

  factory FilmDetail.fromJson(Map<String, dynamic> json) => FilmDetail(
        id: json['id'] as String,
        title: json['title'] as String,
        director: json['director'] as String,
        releaseDate: json['release_date'] as String,
        runningTime: json['running_time'] as String,
        imageUrl: json['image'] as String,
      );
}

String capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);
