// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, sincronizado com Firestore (cloud).
//
// A interface não mudou da TASK 2 para a TASK 7 (Set<int> + toggle/clear): card, contador e
// "limpar" continuam idênticos — só a fonte de verdade passou a ser um documento remoto.

import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart'; // debugPrint, setEquals
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _favDoc = 'favorites/meus-favoritos'; // 1 documento por aluno (meu projeto = meu Firestore)

class FavoritesNotifier extends Notifier<Set<int>> {
  /// Documento dos favoritos — null sem Firebase inicializado (ex.: `flutter test`):
  /// aí o provider funciona só em memória, exatamente como na TASK 2.
  DocumentReference<Map<String, dynamic>>? get _doc =>
      Firebase.apps.isEmpty ? null : FirebaseFirestore.instance.doc(_favDoc);

  @override
  Set<int> build() {
    // snapshots() em vez de um get() único: traz o que estava salvo ao abrir (sobrevive ao F5)
    // E as mudanças feitas em outra aba/dispositivo, em tempo real. Com a persistência offline
    // (TASK 10), o primeiro snapshot sai do cache local — funciona até sem rede.
    final sub = _doc?.snapshots().listen(
          (snap) => state = _idsFrom(snap.data()),
          onError: (Object e) => debugPrint('Firestore (ler): $e'), // permission-denied = regras
        );
    ref.onDispose(() => sub?.cancel());
    return {}; // vazio até o Firestore responder
  }

  void toggle(int id) {
    final add = !state.contains(id);
    state = add ? {...state, id} : ({...state}..remove(id)); // otimista: a UI reage na hora
    // grava só o DELTA (arrayUnion/arrayRemove), não a lista inteira: duas abas mexendo ao
    // mesmo tempo não apagam o favorito uma da outra (sem "lost update").
    _write((doc) => doc.set(
          {'ids': add ? FieldValue.arrayUnion([id]) : FieldValue.arrayRemove([id])},
          SetOptions(merge: true),
        ));
  }

  void clear() {
    state = {};
    _write((doc) => doc.set({'ids': <int>[]}));
  }

  /// Grava em segundo plano. Offline, o SDK guarda a escrita na fila local e envia na volta.
  void _write(Future<void> Function(DocumentReference<Map<String, dynamic>> doc) op) {
    final doc = _doc;
    if (doc == null) return;
    unawaited(op(doc).catchError((Object e) => debugPrint('Firestore (gravar): $e')));
  }

  static Set<int> _idsFrom(Map<String, dynamic>? data) =>
      ((data?['ids'] as List<dynamic>?) ?? const []).map((id) => (id as num).toInt()).toSet();

  /// Set novo com o mesmo conteúdo (ex.: o snapshot que "ecoa" a própria escrita) não notifica
  /// ninguém — evita redesenhar a tela à toa.
  @override
  bool updateShouldNotify(Set<int> previous, Set<int> next) => !setEquals(previous, next);
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
