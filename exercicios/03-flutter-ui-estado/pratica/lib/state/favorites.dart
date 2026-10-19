// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod.
// Ex4 (TASK 7): o mesmo provider, sincronizado com o Firestore (cloud).
//
// A interface não mudou entre o TASK 2 e o TASK 7 (toggle/clear): card, contador e botão
// "limpar" continuam iguais — só a fonte de verdade passou da memória para o Firestore.

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos'; // 1 documento (meu projeto = meu Firestore)

class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    _listen(); // começa vazio; o Firestore preenche assim que responder
    return {};
  }

  // Ouve o documento (em vez de um .get() único): o estado chega no carregamento e, depois,
  // toda mudança feita em outra aba/aparelho também aparece aqui sem F5.
  void _listen() {
    try {
      final sub = FirebaseFirestore.instance.doc(_favDoc).snapshots().listen(
            (snap) => state = _idsFrom(snap.data()),
            onError: (Object e) => debugPrint('Firestore (ler): $e'), // permission-denied = regras
          );
      ref.onDispose(sub.cancel);
    } catch (e) {
      // `flutter test` (Firebase não sobe em teste) ou Firebase não configurado:
      // segue só em memória, igual ao TASK 2.
      debugPrint('Firestore (ler): $e');
    }
  }

  static Set<int> _idsFrom(Map<String, dynamic>? data) =>
      ((data?['ids'] as List<dynamic>?) ?? const [])
          .map((e) => (e as num).toInt()) // na web os números chegam como num
          .toSet();

  Future<void> _persist(Map<String, Object> data) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set(data, SetOptions(merge: true));
    } catch (e) {
      // offline ou `flutter test`: o estado local (otimista) já refletiu a mudança na UI
      debugPrint('Firestore (gravar): $e');
    }
  }

  void toggle(int id) {
    final adding = !state.contains(id);
    // estado imutável: um Set NOVO a cada mudança é o que faz o Riverpod notificar
    state = adding ? {...state, id} : ({...state}..remove(id));
    // arrayUnion/arrayRemove mudam só este id no servidor: duas abas favoritando ao mesmo
    // tempo não sobrescrevem uma à outra (um .set da lista inteira sobrescreveria).
    _persist({'ids': adding ? FieldValue.arrayUnion([id]) : FieldValue.arrayRemove([id])});
  }

  void clear() {
    state = {};
    _persist({'ids': <int>[]});
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
