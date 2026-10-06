// lib/data/movie_repository.dart
//
// O REPOSITÓRIO é a "fonte da verdade" da lista de filmes: a UI nunca fala com a API direto.
// Offline-first = a tela mostra o que tem NO APARELHO primeiro e atualiza quando a rede deixa.
//
// TASK 13: cache-first — emitir o cache e, em seguida, o dado fresco.
// TASK 14: validade do cache (TTL) — não buscar de novo se ainda está fresco.
//
// Os testes estão em test/offline_test.dart (NÃO edite). Rode: flutter test test/offline_test.dart
import 'dart:convert';
import '../models/movie.dart';
import 'key_value_store.dart';
import 'remote_movie_source.dart';

/// Cache salvo no aparelho: a lista + QUANDO foi salva.
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
  final DateTime Function() now; // relógio injetável (os testes usam um relógio falso)

  MovieRepository({
    required this.remote,
    required this.store,
    this.ttl = const Duration(minutes: 10),
    DateTime Function()? now,
  }) : now = now ?? DateTime.now;

  // ── PRONTO: ler e gravar o cache (usa Movie.toJson/fromJson da TASK 12) ──────────────
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

  // ── TASK 14 — validade do cache (TTL) ───────────────────────────────────────────────
  //   none  → não há cache · fresh → salvo há MENOS que `ttl` · stale → mais velho que `ttl`.
  // Usa `now()` (relógio injetado), nunca DateTime.now(): é o que deixa o teste avançar o tempo.
  Future<CacheStatus> cacheStatus() async {
    final entry = await readCache();
    if (entry == null) return CacheStatus.none;
    final age = now().difference(entry.savedAt);
    return age < ttl ? CacheStatus.fresh : CacheStatus.stale; // `<` estrito: ttl zero = sempre velho
  }

  // ── TASK 13 — cache-first (stale-while-revalidate) ──────────────────────────────────
  // A tela recebe até DUAS listas: a do aparelho (na hora) e a fresca da API (quando chegar).
  // TASK 14: se o cache ainda está fresco, para depois do passo 1 (não vai à API).
  Stream<List<Movie>> watchMovies() async* {
    // 1. o que já está no aparelho aparece na hora, sem esperar a rede
    final cached = await readCache();
    if (cached != null) yield cached.movies;

    // TASK 14: salvo há menos de `ttl` → já está atualizado, economiza a chamada à rede
    if (await cacheStatus() == CacheStatus.fresh) return;

    // 2. revalida: busca a versão fresca, guarda para a próxima vez e entrega à tela
    try {
      final fresh = await remote.fetchMovies();
      await writeCache(fresh);
      yield fresh;
    } on OfflineException {
      // 3. sem rede: com cache, a tela segue com ele (engole o erro);
      //    sem cache, não há o que mostrar → o erro sobe e a lista mostra "sem dados"
      if (cached == null) rethrow;
    }
  }
}
