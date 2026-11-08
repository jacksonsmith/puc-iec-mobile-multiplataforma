// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, sincronizado com Firestore (cloud).
//
// A UI só conhece `favoritesProvider` (toggle/clear). Por baixo:
//   - o `state` local muda NA HORA (otimista) → card, contador e limpar reagem sem esperar rede;
//   - a mudança é gravada no documento `favorites/meus-favoritos`;
//   - o documento é ESCUTADO (snapshots): o estado inicial vem dele após o reload, e mudanças
//     feitas em outra aba/dispositivo chegam aqui sozinhas.
// Sem Firebase inicializado (ex.: `flutter test`), tudo cai no try/catch e o provider
// funciona só em memória — mesmo comportamento do TASK 2.

import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos'; // 1 documento por aluno (meu projeto = meu Firestore)

class FavoritesNotifier extends Notifier<Set<int>> {
  StreamSubscription<DocumentSnapshot<Map<String, dynamic>>>? _sub;

  @override
  Set<int> build() {
    _listen();
    ref.onDispose(() => _sub?.cancel());
    return {}; // começa vazio até o Firestore responder (com persistência ligada, vem do cache local)
  }

  void _listen() {
    try {
      _sub = FirebaseFirestore.instance.doc(_favDoc).snapshots().listen(
        (doc) {
          final ids = (doc.data()?['ids'] as List<dynamic>?)?.whereType<num>().map((n) => n.toInt());
          state = {...?ids};
        },
        // `permission-denied` aqui = revise as REGRAS do Firestore.
        onError: (Object e) => debugPrint('Firestore (ler): $e'),
      );
    } catch (e) {
      // `flutter test` (sem Firebase) ou Firebase não configurado: segue só em memória.
      debugPrint('Firestore indisponível: $e');
    }
  }

  Future<void> _persist(Set<int> next) async {
    try {
      // Com persistência offline ligada (TASK 10), a escrita entra na fila local do
      // Firestore e é enviada sozinha quando a rede volta.
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()..sort()});
    } catch (e) {
      // o estado local (otimista) já refletiu a mudança na UI.
      debugPrint('Firestore (gravar): $e');
    }
  }

  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next; // UI reage na hora
    _persist(next); // grava no Firestore em paralelo
  }

  void clear() {
    state = {};
    _persist({});
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
