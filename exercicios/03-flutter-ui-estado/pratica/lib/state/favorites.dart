// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod.

import 'package:flutter_riverpod/flutter_riverpod.dart';

// ── Ex2 · TASK 2 — provider de favoritos ──────────────────────────────
// Fonte única: guarda os ids favoritados (Set<int>) e expõe toggle/clear.
class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() => {};

  void toggle(int id) {
    state = state.contains(id)
        ? ({...state}..remove(id))
        : {...state, id};
  }

  void clear() => state = {}; // usado pelo botão "limpar" (TASK 5)
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
