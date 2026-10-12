// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod.

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ── Ex2 · TASK 2 — implemente o provider de favoritos · 🧑‍🏫 EM AULA (juntos) ──────────────────
// Guarde os ids favoritados (um Set<int>) e exponha toggle(id) e clear():
//
//   class FavoritesNotifier extends Notifier<Set<int>> {
//     @override
//     Set<int> build() => {};
//     void toggle(int id) {
//       state = state.contains(id)
//           ? ({...state}..remove(id))
//           : {...state, id};
//     }
//     void clear() => state = {};          // usado pelo botão "limpar" (TASK 5)
//   }
//
//   final favoritesProvider =
//       NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
//
class FavoritesNotifier extends Notifier<Set<int>> {
  static const _path = 'favorites/meus-favoritos';

  @override
  Set<int> build() {
    _load();
    return <int>{};
  }

  Future<void> _load() async {
    try {
      final snapshot = await FirebaseFirestore.instance.doc(_path).get();
      final ids = snapshot.data()?['ids'] as List<dynamic>?;
      if (ids != null) state = ids.map((value) => (value as num).toInt()).toSet();
    } catch (error) {
      debugPrint('Favoritos indisponíveis: $error');
    }
  }

  Future<void> _persist(Set<int> ids) async {
    try {
      await FirebaseFirestore.instance.doc(_path).set({'ids': ids.toList()});
    } catch (error) {
      debugPrint('Favoritos não sincronizados: $error');
    }
  }

  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next;
    _persist(next);
  }

  void clear() {
    state = <int>{};
    _persist(state);
  }
}

final favoritesProvider = NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
