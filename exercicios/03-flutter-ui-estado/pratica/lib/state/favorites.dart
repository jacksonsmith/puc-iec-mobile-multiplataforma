// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod.

import 'package:flutter_riverpod/flutter_riverpod.dart';

// ── Ex2 · TASK 2 — implemente o provider de favoritos ──────────────────
// Guarde os ids favoritados (um Set<int>) e exponha toggle(id):
//
//   class FavoritesNotifier extends Notifier<Set<int>> {
//     @override
//     Set<int> build() => {};
//     void toggle(int id) {
//       state = state.contains(id)
//           ? ({...state}..remove(id))
//           : {...state, id};
//     }
//   }
//
//   final favoritesProvider =
//       NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
//
// 👇 Apague o stub abaixo e implemente o provider acima.
final favoritesProvider = Provider<Set<int>>((ref) => const <int>{});
