import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos';

class FavoritesNotifier extends Notifier<Set<int>> {
  DocumentReference<Map<String, dynamic>>? _doc;

  @override
  Set<int> build() {
    // Sem Firebase (teste unitário), o mesmo provider funciona só em memória.
    if (Firebase.apps.isNotEmpty) {
      _doc = FirebaseFirestore.instance.doc(_favDoc);
      final subscription = _doc!.snapshots().listen((snapshot) {
        state = ((snapshot.data()?['ids'] as List<dynamic>?) ?? [])
            .map((id) => (id as num).toInt())
            .toSet();
      }, onError: (Object error) {
        debugPrint('Firestore (ler favoritos): $error');
      });
      ref.onDispose(subscription.cancel);
    }
    return <int>{};
  }

  Future<void> _persist(int id, bool add) async {
    try {
      // Transformações atômicas preservam alterações feitas em outras abas.
      await _doc?.set({
        'ids': add ? FieldValue.arrayUnion([id]) : FieldValue.arrayRemove([id])
      }, SetOptions(merge: true));
    } catch (error) {
      debugPrint('Firestore (gravar favoritos): $error');
    }
  }

  void toggle(int id) {
    final add = !state.contains(id);
    state = add ? {...state, id} : ({...state}..remove(id));
    unawaited(_persist(id, add));
  }

  void clear() {
    state = <int>{};
    unawaited(_clearRemote());
  }

  Future<void> _clearRemote() async {
    try {
      await _doc?.set({'ids': <int>[]});
    } catch (error) {
      debugPrint('Firestore (limpar favoritos): $error');
    }
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
