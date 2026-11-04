import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final favoritesFirestoreProvider = Provider<FirebaseFirestore?>((ref) {
  return Firebase.apps.isEmpty ? null : FirebaseFirestore.instance;
});

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);

class FavoritesNotifier extends Notifier<Set<int>> {
  static const _favoritesPath = 'favorites/meus-favoritos';

  @override
  Set<int> build() {
    final document = ref.watch(favoritesFirestoreProvider)?.doc(_favoritesPath);
    if (document != null) {
      final subscription = document.snapshots().listen(
        (snapshot) {
          final ids = snapshot.data()?['ids'] as List<dynamic>? ?? [];
          state = ids.cast<int>().toSet();
        },
        onError: (Object error) => debugPrint('Firestore (ler): $error'),
      );
      ref.onDispose(() => unawaited(subscription.cancel()));
    }
    return {};
  }

  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    _update(next);
  }

  void clear() => _update({});

  void _update(Set<int> next) {
    state = next;
    final document = ref.read(favoritesFirestoreProvider)?.doc(_favoritesPath);
    if (document != null) unawaited(_persist(document, next));
  }

  Future<void> _persist(
      DocumentReference<Map<String, dynamic>> document, Set<int> ids) async {
    try {
      await document.set({'ids': ids.toList()});
    } catch (error) {
      debugPrint('Firestore (gravar): $error');
    }
  }
}
