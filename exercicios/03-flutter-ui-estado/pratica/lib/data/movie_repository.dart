import 'dart:convert';
import '../models/movie.dart';
import 'key_value_store.dart';
import 'remote_movie_source.dart';

class CacheEntry {
  final DateTime savedAt;
  final List<Movie> movies;
  const CacheEntry(this.savedAt, this.movies);
}

enum CacheStatus { none, fresh, stale }

class MovieRepository {
  static const cacheKey = 'movies_cache_v1';

  final MovieSource remote;
  final KeyValueStore store;
  final Duration ttl;
  final DateTime Function() now;

  MovieRepository({
    required this.remote,
    required this.store,
    this.ttl = const Duration(minutes: 10),
    DateTime Function()? now,
  }) : now = now ?? DateTime.now;

  Future<CacheEntry?> readCache() async {
    final raw = await store.read(cacheKey);
    if (raw == null) return null;
    try {
      final j = json.decode(raw) as Map<String, dynamic>;
      return CacheEntry(
        DateTime.parse(j['savedAt'] as String),
        (j['movies'] as List)
            .map((m) => Movie.fromJson(m as Map<String, dynamic>))
            .toList(),
      );
    } catch (_) {
      return null;
    }
  }

  Future<void> writeCache(List<Movie> movies) => store.write(
        cacheKey,
        json.encode({
          'savedAt': now().toIso8601String(),
          'movies': movies.map((m) => m.toJson()).toList(),
        }),
      );

  Future<CacheStatus> cacheStatus() async {
    final cache = await readCache();
    if (cache == null) return CacheStatus.none;
    return _isFresh(cache) ? CacheStatus.fresh : CacheStatus.stale;
  }

  bool _isFresh(CacheEntry cache) => now().difference(cache.savedAt) < ttl;

  Stream<List<Movie>> watchMovies() async* {
    final cache = await readCache();
    if (cache != null) {
      yield cache.movies;
      if (_isFresh(cache)) return;
    }

    try {
      final movies = await remote.fetchMovies();
      await writeCache(movies);
      yield movies;
    } on OfflineException {
      if (cache == null) rethrow;
    }
  }
}
