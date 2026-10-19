// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Um documento por projeto Firebase (cada aluno usa o próprio projeto).
const favoritesDocPath = 'favorites/meus-favoritos';

/// Firestore só existe depois do Firebase.initializeApp (main.dart). Em `flutter test` não há
/// app Firebase: o provider devolve null e os favoritos funcionam só em memória.
final firestoreProvider = Provider<FirebaseFirestore?>(
  (ref) => Firebase.apps.isEmpty ? null : FirebaseFirestore.instance,
);

/// Ids dos filmes favoritados. Estado imutável: cada mudança cria um novo Set
/// para o Riverpod notificar quem está ouvindo.
///
/// Com Firestore, a UI muda na hora (atualização otimista) e a gravação segue em segundo
/// plano. O documento é observado em tempo real, então outras abas e aparelhos recebem a
/// mudança; com a persistência offline ligada (TASK 10), a primeira leitura vem do cache local.
class FavoritesNotifier extends Notifier<Set<int>> {
  DocumentReference<Map<String, dynamic>>? get _doc =>
      ref.read(firestoreProvider)?.doc(favoritesDocPath);

  @override
  Set<int> build() {
    final doc = ref.watch(firestoreProvider)?.doc(favoritesDocPath);
    if (doc != null) {
      final subscription = doc.snapshots().listen(
            (snapshot) => state = _idsFrom(snapshot.data()),
            onError: (Object e) => debugPrint('Firestore (ler): $e'),
          );
      ref.onDispose(subscription.cancel);
    }
    return {};
  }

  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next;
    unawaited(_persist(next));
  }

  void clear() {
    state = {};
    unawaited(_persist({}));
  }

  Future<void> _persist(Set<int> ids) async {
    final doc = _doc;
    if (doc == null) return;
    try {
      await doc.set({'ids': ids.toList()..sort()});
    } catch (e) {
      // permission-denied aqui significa regras do Firestore erradas (ver README).
      debugPrint('Firestore (gravar): $e');
    }
  }

  /// No web os números do Firestore chegam como `num`, por isso o toInt().
  static Set<int> _idsFrom(Map<String, dynamic>? data) =>
      ((data?['ids'] as List<dynamic>?) ?? const []).map((id) => (id as num).toInt()).toSet();
}

final favoritesProvider = NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
