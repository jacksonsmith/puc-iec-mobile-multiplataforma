// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 1 documento por aluno (seu projeto = seu Firestore). A regra do Firestore libera só este caminho.
const _favDoc = 'favorites/meus-favoritos';

// ── Ex2 · TASK 2 + Ex4 · TASK 7 — favoritos com Riverpod, persistidos no Firestore ──────────────
// O estado é um Set<int> de ids. Ele é imutável: cada ação cria um Set NOVO e atribui a `state`,
// e é essa atribuição que avisa quem está ouvindo (card, contador, botão limpar).
// A interface não mudou com a TASK 7 (toggle/clear): só a fonte da verdade passou a ser a nuvem.
class FavoritesNotifier extends Notifier<Set<int>> {
  // true depois do 1º toggle/clear. Se o usuário mexer antes da leitura inicial responder,
  // a leitura não pode sobrescrever o que ele acabou de fazer (o _persist já gravou o estado novo).
  bool _changedLocally = false;

  @override
  Set<int> build() {
    _load(); // dispara a leitura async; o state começa vazio até o Firestore responder
    return {};
  }

  Future<void> _load() async {
    try {
      final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
      // (num).toInt(): o número pode chegar como int ou double dependendo da plataforma
      final ids = (doc.data()?['ids'] as List<dynamic>?)?.map((e) => (e as num).toInt()) ?? <int>[];
      if (!_changedLocally) state = ids.toSet();
    } catch (e) {
      // offline sem cache, ou `flutter test` (o Firebase não sobe em teste: "No Firebase App").
      // Mantém vazio, o mesmo comportamento da TASK 2. `permission-denied` = revise as REGRAS.
      debugPrint('Firestore (ler): $e');
    }
  }

  Future<void> _persist(Set<int> next) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()});
    } catch (e) {
      // `flutter test` (Firebase não inicializado) — tudo bem, o estado local (otimista) já
      // refletiu a mudança na UI. Offline não cai aqui: a persistência da TASK 10 enfileira a escrita.
      debugPrint('Firestore (gravar): $e'); // `permission-denied` = regras
    }
  }

  void toggle(int id) {
    _changedLocally = true;
    final next = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    state = next; // UI reage na hora (otimista)
    _persist(next); // grava no Firestore em paralelo
  }

  void clear() {
    _changedLocally = true;
    state = {}; // usado pelo botão "limpar" (TASK 6)
    _persist({});
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);

// 👉 Teste você mesmo: favorita um filme, dá F5 na página — o favorito sobrevive (antes, sumia).
