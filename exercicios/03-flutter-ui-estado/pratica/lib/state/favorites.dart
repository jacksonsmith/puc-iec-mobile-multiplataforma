
// lib/state/favorites.dart
//
// TASK 2 — Estado compartilhado com Riverpod.
// TASK 7 — Persistencia dos favoritos no Firestore.

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FavoritesNotifier extends Notifier<Set<int>> {
  static const String collectionName = 'favorites';
  static const String documentId = 'meus-favoritos';

  int _revision = 0;
  bool _disposed = false;

  bool get _firebaseDisponivel => Firebase.apps.isNotEmpty;

  DocumentReference<Map<String, dynamic>> get _documento =>
      FirebaseFirestore.instance
          .collection(collectionName)
          .doc(documentId);

  @override
  Set<int> build() {
    _disposed = false;

    ref.onDispose(() {
      _disposed = true;
    });

    // Nos testes sem Firebase, usa apenas o estado local.
    if (_firebaseDisponivel) {
      _carregarFavoritos();
    }

    return <int>{};
  }

  // TASK 7 — Recupera os favoritos salvos na nuvem.
  Future<void> _carregarFavoritos() async {
    final revisaoInicial = _revision;

    try {
      final snapshot = await _documento.get();
      final dados = snapshot.data();

      final lista = dados?['ids'];

      final favoritosSalvos = lista is List
          ? lista.whereType<num>().map((id) => id.toInt()).toSet()
          : <int>{};

      // Evita sobrescrever alteracoes feitas durante a leitura.
      if (!_disposed && _revision == revisaoInicial) {
        state = favoritosSalvos;
      }
    } catch (e) {
      debugPrint('Erro ao carregar favoritos: $e');
    }
  }

  // TASK 7 — Grava o estado atual no Firestore.
  Future<void> _salvarFavoritos(Set<int> favoritos) async {
    if (!_firebaseDisponivel) return;

    try {
      await _documento.set({
        'ids': favoritos.toList()..sort(),
      });
    } catch (e) {
      debugPrint('Erro ao salvar favoritos: $e');
    }
  }

  // TASK 2 — Adiciona ou remove um favorito.
  void toggle(int id) {
    state = state.contains(id)
        ? ({...state}..remove(id))
        : {...state, id};

    _revision++;

    // Atualiza a interface imediatamente e salva na nuvem.
    _salvarFavoritos({...state});
  }

  // TASK 5 — Remove todos os favoritos.
  void clear() {
    state = <int>{};
    _revision++;

    // Atualiza tambem o documento remoto.
    _salvarFavoritos({});
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(
  FavoritesNotifier.new,
);
