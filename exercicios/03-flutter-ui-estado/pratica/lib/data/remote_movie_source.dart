import '../models/movie.dart';
import 'movies.dart';

class OfflineException implements Exception {
  const OfflineException();

  @override
  String toString() => 'OfflineException: sem conexão';
}

abstract class MovieSource {
  Future<List<Movie>> fetchMovies();
}

class SimulatedRemote implements MovieSource {
  final bool Function() isOnline;
  final Duration latency;

  SimulatedRemote({
    required this.isOnline,
    this.latency = const Duration(milliseconds: 600),
  });

  @override
  Future<List<Movie>> fetchMovies() async {
    await Future<void>.delayed(latency);
    if (!isOnline()) throw const OfflineException();
    return movies;
  }
}
