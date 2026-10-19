// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Ids dos filmes favoritados. Estado imutável: cada mudança cria um novo Set
/// para o Riverpod notificar quem está ouvindo.
class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() => {};

  void toggle(int id) {
    state = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
  }

  void clear() => state = {};
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
