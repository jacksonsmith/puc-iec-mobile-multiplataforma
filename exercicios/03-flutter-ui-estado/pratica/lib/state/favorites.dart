// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).
//
// Uma fonte só: o card (coração), o contador (♥ N) e o botão "limpar" leem/escrevem este provider.
// O `state` local muda NA HORA (UI otimista) e o Firestore é gravado em paralelo — assim o
// favorito sobrevive ao F5 e aparece em outras abas/dispositivos.

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos'; // 1 documento por aluno (seu projeto = seu Firestore)

class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    _load(); // dispara leitura async; state começa vazio até o Firestore responder
    return {};
  }

  Future<void> _load() async {
    try {
      final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
      // `num` e não `int`: na web os números do Firestore chegam como JS number.
      final ids = (doc.data()?['ids'] as List<dynamic>?)
              ?.map((e) => (e as num).toInt())
              .toSet() ??
          <int>{};
      state = ids;
    } catch (e) {
      // offline sem cache, ou `flutter test` ("No Firebase App" — esperado, o Firebase não sobe em
      // teste): mantém o estado local. `permission-denied` = revise as REGRAS do Firestore.
      debugPrint('Firestore (ler): $e');
    }
  }

  Future<void> _persist(Set<int> next) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()});
    } catch (e) {
      // o estado local (otimista) já refletiu a mudança na UI; offline, a persistência do
      // Firestore (TASK 10) guarda a escrita e sincroniza sozinha quando a rede volta.
      debugPrint('Firestore (gravar): $e');
    }
  }

  void toggle(int id) {
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next; // UI reage na hora (otimista)
    _persist(next); // grava no Firestore em paralelo
  }

  void clear() {
    state = {};
    _persist({});
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
