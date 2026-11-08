
// lib/data/movie_repository.dart
//
// Repositório de filmes com suporte a cache local.
//
// TASK 13 — Cache-first: mostrar dados salvos primeiro.
// TASK 14 — Validade do cache (TTL).

import 'dart:convert';

import '../models/movie.dart';
import 'key_value_store.dart';
import 'remote_movie_source.dart';

/// Cache armazenado localmente, incluindo a data de gravação.
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

  // Lê os filmes armazenados no cache.
  Future<CacheEntry?> readCache() async {
    final raw = await store.read(cacheKey);

    if (raw == null) return null;

    try {
      final j = json.decode(raw) as Map<String, dynamic>;

      return CacheEntry(
        DateTime.parse(j['savedAt'] as String),
        (j['movies'] as List)
            .map(
              (m) => Movie.fromJson(
                m as Map<String, dynamic>,
              ),
            )
            .toList(),
      );
    } catch (_) {
      // Cache corrompido é tratado como inexistente.
      return null;
    }
  }

  // Salva a lista de filmes e o horário da atualização.
  Future<void> writeCache(List<Movie> movies) {
    return store.write(
      cacheKey,
      json.encode({
        'savedAt': now().toIso8601String(),
        'movies': movies.map((m) => m.toJson()).toList(),
      }),
    );
  }

  // TASK 14 — Será implementada na próxima etapa.
 
Future<CacheStatus> cacheStatus() async {
  final cache = await readCache();

  // Não existe cache armazenado.
  if (cache == null) {
    return CacheStatus.none;
  }

  // Calcula há quanto tempo o cache foi salvo.
  final age = now().difference(cache.savedAt);

  // O cache ainda está dentro do prazo de validade.
  if (age < ttl) {
    return CacheStatus.fresh;
  }

  // O prazo de validade expirou.
  return CacheStatus.stale;
}


  // TASK 13 — Exibe o cache primeiro e depois atualiza.
  
Stream<List<Movie>> watchMovies() async* {
  final cache = await readCache();

  // Exibe imediatamente os filmes armazenados.
  if (cache != null) {
    yield cache.movies;

    // Cache recente: não precisa consultar a API.
    if (now().difference(cache.savedAt) < ttl) {
      return;
    }
  }

  try {
    // Busca os filmes atualizados.
    final freshMovies = await remote.fetchMovies();

    // Atualiza o cache local.
    await writeCache(freshMovies);

    // Apresenta os novos dados.
    yield freshMovies;
  } on OfflineException {
    // Mantém os dados salvos se estiver offline.
    if (cache == null) {
      rethrow;
    }
  }
}
}