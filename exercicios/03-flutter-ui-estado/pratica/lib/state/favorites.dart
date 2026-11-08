// lib/state/favorites.dart
//
// Estado compartilhado de favoritos, persistido no Firestore quando configurado.

import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos';

class FavoritesNotifier extends Notifier<Set<int>> {
  var _mutationVersion = 0;

  @override
  Set<int> build() {
    if (Firebase.apps.isNotEmpty) {
      unawaited(_load(_mutationVersion));
    }
    return <int>{};
  }

  Future<void> _load(int version) async {
    try {
      final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
      if (version != _mutationVersion) return;
      final ids = doc.data()?['ids'];
      state = ids is List
          ? ids.whereType<num>().map((id) => id.toInt()).toSet()
          : <int>{};
    } catch (error, stackTrace) {
      debugPrint('Firestore (ler favoritos): $error\n$stackTrace');
    }
  }

  Future<void> _persist(Set<int> next) async {
    if (Firebase.apps.isEmpty) return;
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()});
    } catch (error, stackTrace) {
      debugPrint('Firestore (gravar favoritos): $error\n$stackTrace');
    }
  }

  void toggle(int id) {
    _mutationVersion++;
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next;
    unawaited(_persist(next));
  }

  void clear() {
    _mutationVersion++;
    state = <int>{};
    unawaited(_persist(state));
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
