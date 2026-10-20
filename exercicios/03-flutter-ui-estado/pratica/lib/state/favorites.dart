// lib/state/favorites.dart
// Estado otimista local, persistido no Firestore quando a configuração existe.

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favoritesDocument = 'favorites/meus-favoritos';

class FavoritesNotifier extends Notifier<Set<int>> {
  bool _hasLocalChanges = false;

  @override
  Set<int> build() {
    if (Firebase.apps.isNotEmpty) _load();
    return <int>{};
  }

  Future<void> _load() async {
    try {
      final doc =
          await FirebaseFirestore.instance.doc(_favoritesDocument).get();
      if (_hasLocalChanges) return;
      final ids = doc.data()?['ids'] as List<dynamic>? ?? const <dynamic>[];
      state = ids.map((id) => (id as num).toInt()).toSet();
    } catch (error) {
      debugPrint('Firestore (ler favoritos): $error');
    }
  }

  Future<void> _persist(Set<int> ids) async {
    if (Firebase.apps.isEmpty) return;
    try {
      await FirebaseFirestore.instance
          .doc(_favoritesDocument)
          .set({'ids': ids.toList()});
    } catch (error) {
      // Mantém estado otimista; Firestore com persistência offline reenvia depois.
      debugPrint('Firestore (gravar favoritos): $error');
    }
  }

  void toggle(int id) {
    _hasLocalChanges = true;
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next;
    _persist(next);
  }

  void clear() {
    _hasLocalChanges = true;
    state = <int>{};
    _persist(state);
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
