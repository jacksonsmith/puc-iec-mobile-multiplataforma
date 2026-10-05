import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/key_value_store.dart';
import '../data/movie_repository.dart';
import '../data/remote_movie_source.dart';
import '../models/movie.dart';
import 'network.dart';

final storeProvider = Provider<KeyValueStore>((ref) => InMemoryStore());

final movieSourceProvider = Provider<MovieSource>(
  (ref) => SimulatedRemote(isOnline: () => ref.read(onlineProvider)),
);

final movieRepositoryProvider = Provider<MovieRepository>(
  (ref) => MovieRepository(
    remote: ref.watch(movieSourceProvider),
    store: ref.watch(storeProvider),
  ),
);

final moviesProvider = StreamProvider<List<Movie>>((ref) {
  ref.watch(onlineProvider);
  return ref.watch(movieRepositoryProvider).watchMovies();
});
