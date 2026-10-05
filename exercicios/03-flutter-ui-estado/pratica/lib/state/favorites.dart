// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';

class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    if (Firebase.apps.isNotEmpty) {
      _loadFromFirestore();
    }
    return <int>{};
  }

  Future<void> _loadFromFirestore() async {
    try {
      final snapshot = await FirebaseFirestore.instance
          .collection('favorites')
          .doc('meus-favoritos')
          .get();
      final ids = snapshot.data()?['ids'];
      if (ids is List) {
        state = ids.whereType<num>().map((id) => id.toInt()).toSet();
      }
    } catch (_) {
      // Mantém os favoritos locais disponíveis quando o Firebase não responde.
    }
  }

  Future<void> _saveToFirestore(Set<int> ids) async {
    if (Firebase.apps.isEmpty) return;
    try {
      await FirebaseFirestore.instance
          .collection('favorites')
          .doc('meus-favoritos')
          .set({'ids': ids.toList()});
    } catch (_) {
      // Firestore pode sincronizar a gravação quando a conexão voltar.
    }
  }

  void toggle(int id) {
    final updated = {...state};
    if (!updated.add(id)) updated.remove(id);
    state = updated;
    _saveToFirestore(updated);
  }

  void clear() {
    state = <int>{};
    _saveToFirestore(state);
  }
}

final favoritesProvider = NotifierProvider<FavoritesNotifier, Set<int>>(
  FavoritesNotifier.new,
);
