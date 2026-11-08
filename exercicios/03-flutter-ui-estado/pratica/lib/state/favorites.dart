// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos'; // 1 documento por aluno

class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    unawaited(_load()); // dispara leitura async; state começa vazio até o Firestore responder
    return {};
  }

  Future<void> _load() async {
    try {
      final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
      final ids = (doc.data()?['ids'] as List<dynamic>?)?.cast<int>() ?? <int>[];
      state = ids.toSet();
    } catch (e) {
      // offline, ou `flutter test` — mantém vazio (mesmo comportamento do TASK 2).
      // `permission-denied` no console = revise as REGRAS do Firestore.
      debugPrint('Firestore (ler): $e');
    }
  }

  Future<void> _persist(Set<int> next) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()});
    } catch (e) {
      // offline, ou `flutter test` — o estado local (otimista) já refletiu na UI.
      debugPrint('Firestore (gravar): $e');
    }
  }

  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next; // UI reage na hora (otimista)
    unawaited(_persist(next)); // grava no Firestore em paralelo
  }

  void clear() {
    state = {};
    unawaited(_persist({}));
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
