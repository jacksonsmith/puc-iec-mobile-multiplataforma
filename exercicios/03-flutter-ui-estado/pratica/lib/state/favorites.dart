// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).
//
// A interface é a mesma do TASK 2 (`toggle` / `clear`) — a UI nem sabe que agora existe nuvem.
// Estratégia "otimista": o `state` local muda NA HORA (a UI reage), e a gravação no Firestore
// acontece em paralelo. Ao montar, o provider passa a ouvir o documento remoto — então o
// favorito sobrevive ao F5 e aparece sozinho em outra aba/dispositivo.

import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// 1 documento por aluno (seu projeto Firebase = seu Firestore). Bate com as regras do console.
const _favDoc = 'favorites/meus-favoritos';

class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    _listen(); // começa vazio e é populado quando o Firestore responder
    return {};
  }

  /// TASK 7 (leitura) — ouve o documento `favorites/meus-favoritos`.
  /// `snapshots()` entrega o valor inicial (vindo do servidor ou do cache offline — TASK 10)
  /// e depois cada mudança, inclusive as feitas em outra aba.
  void _listen() {
    try {
      final StreamSubscription<DocumentSnapshot<Map<String, dynamic>>> sub =
          FirebaseFirestore.instance.doc(_favDoc).snapshots().listen(
                (doc) => state = _idsFrom(doc.data()),
                // `permission-denied` aqui = revise as REGRAS do Firestore no console.
                onError: (Object e) => debugPrint('Firestore (ler): $e'),
              );
      ref.onDispose(sub.cancel);
    } catch (e) {
      // `flutter test` (o Firebase não sobe em teste: "No Firebase App") ou Firebase não
      // configurado — segue só com o estado local, igual ao TASK 2.
      debugPrint('Firestore (ler): $e');
    }
  }

  /// Converte o campo `ids` do documento. Na web os números do Firestore chegam como `num`.
  static Set<int> _idsFrom(Map<String, dynamic>? data) {
    final raw = data?['ids'] as List<dynamic>? ?? const [];
    return raw.map((e) => (e as num).toInt()).toSet();
  }

  /// TASK 7 (escrita) — grava o conjunto inteiro no mesmo documento.
  Future<void> _persist(Set<int> next) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()..sort()});
    } catch (e) {
      // offline (a escrita fica na fila local do Firestore — TASK 10) ou `flutter test`.
      // O estado local (otimista) já refletiu a mudança na UI.
      debugPrint('Firestore (gravar): $e');
    }
  }

  /// TASK 2 — favorita/desfavorita. Cria um NOVO Set (estado imutável → Riverpod notifica).
  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next; // UI reage na hora
    _persist(next); // nuvem em paralelo
  }

  /// TASK 2/6 — usado pelo botão "limpar".
  void clear() {
    state = {};
    _persist({});
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
