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
  final Duration ttl; // quanto tempo o cache é considerado "fresco"
  final DateTime Function()
      now; // relógio injetável (os testes usam um relógio falso)

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
      return null; // cache corrompido = como se não existisse
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
    final cached = await readCache();
    if (cached == null) return CacheStatus.none;
    return now().difference(cached.savedAt) < ttl
        ? CacheStatus.fresh
        : CacheStatus.stale;
  }

  Stream<List<Movie>> watchMovies() async* {
    final cached = await readCache();
    if (cached != null) {
      yield cached.movies;
      if (await cacheStatus() == CacheStatus.fresh) return;
    }
    try {
      final fresh = await remote.fetchMovies();
      await writeCache(fresh);
      yield fresh;
    } on OfflineException {
      if (cached == null) rethrow;
    }
  }
}
