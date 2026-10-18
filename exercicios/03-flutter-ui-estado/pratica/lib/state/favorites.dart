// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).
// Bônus (Ex6): cada toggle vira uma operação na SyncQueue, enviada quando a rede deixa.

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart'; // debugPrint
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/sync_queue.dart';
import 'movies_provider.dart'; // storeProvider (o "armário" onde a fila fica salva)
import 'network.dart';

const _favDoc = 'favorites/meus-favoritos'; // 1 documento por aluno (seu projeto = seu Firestore)

/// Quanto esperar o Firestore confirmar uma escrita antes de desistir (a operação fica na fila).
const _sendTimeout = Duration(seconds: 10);

class FavoritesNotifier extends Notifier<Set<int>> {
  late SyncQueue _queue;

  // A fila é lida/gravada inteira a cada passo: enqueue e flush rodando ao mesmo tempo poderiam
  // sobrescrever um ao outro. Por isso todo acesso à fila passa por esta corrente (um de cada vez).
  Future<void> _queueWork = Future.value();

  @override
  Set<int> build() {
    _queue = SyncQueue(ref.watch(storeProvider));
    // voltou a rede (real ou o ✈️ desligado)? envia o que ficou pendente.
    ref.listen<bool>(onlineProvider, (was, online) {
      if (online && was == false) _flush();
    });
    _load(online: ref.read(onlineProvider)); // dispara leitura async; state começa vazio
    return {};
  }

  Future<void> _load({required bool online}) async {
    try {
      final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
      final ids = (doc.data()?['ids'] as List<dynamic>?)?.cast<int>() ?? <int>[];
      // o que foi feito offline e ainda não subiu vale por cima do que veio da nuvem
      final next = ids.toSet();
      for (final op in await _queue.pending()) {
        op.add ? next.add(op.movieId) : next.remove(op.movieId);
      }
      state = next;
    } catch (e) {
      // `flutter test` (Firebase não sobe em teste) — mantém vazio (mesmo comportamento do TASK 2).
      // `permission-denied` no console = revise as REGRAS do Firestore.
      debugPrint('Firestore (ler): $e');
      return;
    }
    if (online) _flush(); // sobrou fila de uma sessão anterior (app fechado offline)?
  }

  void toggle(int id) {
    final add = !state.contains(id);
    state = add ? {...state, id} : ({...state}..remove(id)); // UI reage na hora (otimista)
    _sync([
      PendingOp(id: '${DateTime.now().microsecondsSinceEpoch}-$id', movieId: id, add: add),
    ]);
  }

  void clear() {
    final stamp = DateTime.now().microsecondsSinceEpoch;
    final ops = [
      for (final id in state) PendingOp(id: '$stamp-$id', movieId: id, add: false),
    ];
    state = {};
    _sync(ops);
  }

  /// Enfileira (a fila resolve os conflitos) e, se houver rede, já tenta enviar.
  void _sync(List<PendingOp> ops) {
    final online = ref.read(onlineProvider); // lido agora: depois do await o ref pode já ter morrido
    _enqueueWork(() async {
      for (final op in ops) {
        await _queue.enqueue(op);
      }
    });
    if (online) _flush();
  }

  void _flush() => _enqueueWork(() async {
        final sent = await _queue.flush(_send);
        if (sent > 0) debugPrint('SyncQueue: $sent operação(ões) enviada(s) ao Firestore');
      });

  void _enqueueWork(Future<void> Function() work) {
    _queueWork = _queueWork.then((_) => work()).catchError((Object e) {
      debugPrint('SyncQueue: $e');
    });
  }

  /// Uma operação da fila → uma escrita no documento. arrayUnion/arrayRemove são idempotentes:
  /// se a mesma operação for reenviada (timeout, app fechado no meio), o resultado não muda.
  Future<void> _send(PendingOp op) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({
        'ids': op.add
            ? FieldValue.arrayUnion([op.movieId])
            : FieldValue.arrayRemove([op.movieId]),
      }, SetOptions(merge: true)).timeout(_sendTimeout);
    } catch (e) {
      // sem rede, ou `flutter test` (Firebase não inicializado) — a operação continua na fila
      // e o estado local (otimista) já refletiu a mudança na UI.
      debugPrint('Firestore (gravar): $e'); // `permission-denied` = regras
      rethrow; // o flush para aqui e tenta de novo na próxima vez
    }
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
