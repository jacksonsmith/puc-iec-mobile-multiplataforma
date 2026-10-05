// lib/data/movie_repository.dart
//
// TASK 13 (🧑‍💻 EM CASA · médio): cache-first — emitir o cache e, em seguida, o dado fresco.
// TASK 14 (🧑‍💻 EM CASA · médio): validade do cache (TTL) — não buscar de novo se ainda está fresco.

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
        (j['movies'] as List).map((m) => Movie.fromJson(m as Map<String, dynamic>)).toList(),
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
    final diff = now().difference(cache.savedAt);
    if (diff < ttl) {
      return CacheStatus.fresh;
    }
    return CacheStatus.stale;
  }

  Stream<List<Movie>> watchMovies() async* {
    final status = await cacheStatus();
    final cache = await readCache();

    if (cache != null) {
      yield cache.movies;
    }

    if (status == CacheStatus.fresh) {
      return;
    }

    try {
      final freshMovies = await remote.fetchMovies();
      await writeCache(freshMovies);
      yield freshMovies;
    } on OfflineException {
      if (cache == null) {
        rethrow;
      }
    }
  }
}
