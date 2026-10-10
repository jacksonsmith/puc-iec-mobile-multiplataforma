// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

// ── Ex2 · TASK 2 — implemente o provider de favoritos · 🧑‍🏫 EM AULA (juntos) ──────────────────
// Guarde os ids favoritados (um Set<int>) e exponha toggle(id) e clear():
//
class FavoritesNotifier extends Notifier<Set<int>> {
        static const _favDoc = 'favorites/meus-favoritos';

        @override
        Set<int> build() {
            _load();
            return {};
        }

        Future<void> _load() async {
            try {
                final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
                final ids = (doc.data()?['ids'] as List<dynamic>?)?.cast<int>() ?? <int>[];
                state = ids.toSet();
            } catch (e) {
                debugPrint('Firestore (ler): $e');
            }
        }

        Future<void> _persist(Set<int> next) async {
            try {
                await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()});
            } catch (e) {
                debugPrint('Firestore (gravar): $e');
            }
        }

        void toggle(int id) {
            final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
            state = next;
            _persist(next);
        }

        void clear() {
            state = {};
            _persist({});
        }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
