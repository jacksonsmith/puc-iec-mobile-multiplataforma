// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod.
//
// O provider é a ÚNICA fonte de verdade do app: o MovieCard, o contador do
// header e o botão "limpar" leem/escrevem exatamente este mesmo estado —
// nada é passado por parâmetro (prop drilling).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

/// Notifier que guarda os ids favoritados como um `Set<int>`.
///
/// O estado é imutável: cada `toggle`/`clear` cria um **novo** Set, o que faz
/// o Riverpod avisar todos os `ref.watch(favoritesProvider)` e redesenhar só
/// quem depende dele.
class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    // Testes locais exercitam o mesmo provider sem iniciar o Firebase.
    if (Firebase.apps.isNotEmpty) {
      final subscription = FirebaseFirestore.instance
          .doc('favorites/meus-favoritos')
          .snapshots()
          .listen((doc) {
        final ids = (doc.data()?['ids'] as List<dynamic>?) ?? [];
        state = ids.cast<int>().toSet();
      }, onError: (Object error) {
        debugPrint('Firestore (ler): $error');
      });
      ref.onDispose(subscription.cancel);
    }
    return <int>{};
  }

  Future<void> _persist(Set<int> next) async {
    if (Firebase.apps.isEmpty) return;
    try {
      await FirebaseFirestore.instance
          .doc('favorites/meus-favoritos')
          .set({'ids': next.toList()});
    } catch (error) {
      debugPrint('Firestore (gravar): $error');
    }
  }

  /// Adiciona o id aos favoritos se ainda não estiver lá; remove se estiver.
  void toggle(int id) {
    state = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    _persist(state);
  }

  /// Esvazia todos os favoritos (usado pelo botão "limpar" — TASK 5).
  void clear() {
    state = <int>{};
    _persist(state);
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
