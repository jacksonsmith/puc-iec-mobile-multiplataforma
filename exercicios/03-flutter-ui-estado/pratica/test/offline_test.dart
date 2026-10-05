import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:filmes_flutter/data/key_value_store.dart';
import 'package:filmes_flutter/data/movie_repository.dart';
import 'package:filmes_flutter/data/remote_movie_source.dart';
import 'package:filmes_flutter/data/sync_queue.dart';
import 'package:filmes_flutter/models/movie.dart';
import 'package:filmes_flutter/state/network.dart';
import 'package:filmes_flutter/widgets/offline_banner.dart';

const matrix = Movie(id: 1, title: 'Matrix', rating: 8.7, year: '1999 · Ficção');
const inception = Movie(id: 2, title: 'Inception', rating: 8.8, year: '2010 · Ficção');

class FakeRemote implements MovieSource {
  final List<Movie> data;
  bool online;
  int calls = 0;

  FakeRemote(this.data, {this.online = true});

  @override
  Future<List<Movie>> fetchMovies() async {
    calls++;
    if (!online) throw const OfflineException();
    return data;
  }
}

void main() {
  group('TASK 11 — OfflineBanner', () {
    Future<void> pump(WidgetTester tester, {required bool offline}) async {
      await tester.pumpWidget(ProviderScope(
        key: ValueKey(offline),
        overrides: [simulatedOfflineProvider.overrideWith(() => _FixedOffline(offline))],
        child: const MaterialApp(home: Scaffold(body: OfflineBanner())),
      ));
    }

    testWidgets('offline mostra aviso e online não mostra', (tester) async {
      await pump(tester, offline: true);
      expect(find.text('Você está offline — mostrando dados salvos'), findsOneWidget);
      await pump(tester, offline: false);
      expect(find.text('Você está offline — mostrando dados salvos'), findsNothing);
    });
  });

  group('TASK 12 — serialização Movie', () {
    test('JSON tem os quatro campos e converte rating inteiro', () {
      expect(matrix.toJson(), {
        'id': 1,
        'title': 'Matrix',
        'rating': 8.7,
        'year': '1999 · Ficção',
      });
      final restored = Movie.fromJson({
        'id': 3,
        'title': 'X',
        'rating': 8,
        'year': '2000 · Drama',
      });
      expect(restored.rating, 8.0);
    });

    test('fromJson(toJson(movie)) preserva os dados', () {
      final restored = Movie.fromJson(inception.toJson());
      expect(restored.id, inception.id);
      expect(restored.title, inception.title);
      expect(restored.rating, inception.rating);
      expect(restored.year, inception.year);
    });
  });

  group('TASK 13/14 — MovieRepository cache-first e TTL', () {
    late InMemoryStore store;
    late DateTime clock;

    MovieRepository repository(FakeRemote remote, {Duration ttl = Duration.zero}) =>
        MovieRepository(remote: remote, store: store, ttl: ttl, now: () => clock);

    setUp(() {
      store = InMemoryStore();
      clock = DateTime(2026, 1, 1, 12);
    });

    test('sem cache busca remoto e grava cache', () async {
      final remote = FakeRemote([matrix]);
      final result = await repository(remote).watchMovies().toList();
      expect(result.single.single.title, 'Matrix');
      expect(await repository(remote).readCache(), isNotNull);
    });

    test('com cache velho emite cache primeiro e depois dados remotos', () async {
      final repo = repository(FakeRemote([]));
      await repo.writeCache([matrix]);
      final remote = FakeRemote([matrix, inception]);
      final result = await repository(remote).watchMovies().toList();
      expect(result.map((list) => list.length), [1, 2]);
      expect(remote.calls, 1);
    });

    test('cache offline permanece disponível; sem cache propaga OfflineException', () async {
      final cachedRepo = repository(FakeRemote([]));
      await cachedRepo.writeCache([matrix]);
      final result = await repository(FakeRemote([inception], online: false))
          .watchMovies()
          .toList();
      expect(result.single.single.title, matrix.title);
      await expectLater(
        MovieRepository(
          remote: FakeRemote([], online: false),
          store: InMemoryStore(),
          now: () => clock,
        ).watchMovies().toList(),
        throwsA(isA<OfflineException>()),
      );
    });

    test('cacheStatus distingue none, fresh e stale; cache fresco evita API', () async {
      final remote = FakeRemote([inception]);
      final repo = repository(remote, ttl: const Duration(minutes: 10));
      expect(await repo.cacheStatus(), CacheStatus.none);
      await repo.writeCache([matrix]);
      expect(await repo.cacheStatus(), CacheStatus.fresh);
      final fresh = await repo.watchMovies().toList();
      expect(fresh.single.single.title, matrix.title);
      expect(remote.calls, 0);
      clock = clock.add(const Duration(minutes: 11));
      expect(await repo.cacheStatus(), CacheStatus.stale);
      expect((await repo.watchMovies().toList()).length, 2);
      expect(remote.calls, 1);
    });
  });

  group('TASK 15 — SyncQueue', () {
    late InMemoryStore store;
    late SyncQueue queue;

    PendingOp op(String id, int movieId, bool add) =>
        PendingOp(id: id, movieId: movieId, add: add);

    setUp(() {
      store = InMemoryStore();
      queue = SyncQueue(store);
    });

    test('persiste operações e deduplica por id e ação do mesmo filme', () async {
      await queue.enqueue(op('a', 1, true));
      await queue.enqueue(op('a', 1, true));
      await queue.enqueue(op('b', 1, true));
      expect((await SyncQueue(store).pending()).map((entry) => entry.id), ['a']);
    });

    test('ações opostas do mesmo filme se cancelam sem alterar os demais', () async {
      await queue.enqueue(op('a', 1, true));
      await queue.enqueue(op('b', 2, true));
      await queue.enqueue(op('c', 1, false));
      expect((await queue.pending()).map((entry) => entry.id), ['b']);
    });

    test('flush envia na ordem, persiste a cada sucesso e para no primeiro erro', () async {
      await queue.enqueue(op('a', 1, true));
      await queue.enqueue(op('b', 2, true));
      await queue.enqueue(op('c', 3, true));
      final sent = <String>[];
      final count = await queue.flush((operation) async {
        if (operation.id == 'b') throw const OfflineException();
        sent.add(operation.id);
      });
      expect(sent, ['a']);
      expect(count, 1);
      expect((await SyncQueue(store).pending()).map((entry) => entry.id), ['b', 'c']);
    });
  });
}

class _FixedOffline extends SimulatedOffline {
  final bool offline;

  _FixedOffline(this.offline);

  @override
  bool build() => offline;
}
