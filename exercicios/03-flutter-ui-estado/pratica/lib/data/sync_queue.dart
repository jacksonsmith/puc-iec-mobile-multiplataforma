// lib/data/sync_queue.dart
//
// FILA DE SINCRONIZAÇÃO — escritas feitas offline ficam guardadas e são enviadas na volta da rede.
// TASK 15: regras de conflito (enqueue) e envio sequencial seguro (flush).

import 'dart:convert';
import 'key_value_store.dart';

class PendingOp {
  final String id;
  final int movieId;
  final bool add;
  const PendingOp({required this.id, required this.movieId, required this.add});

  Map<String, dynamic> toJson() => {'id': id, 'movieId': movieId, 'add': add};
  factory PendingOp.fromJson(Map<String, dynamic> j) =>
      PendingOp(id: j['id'] as String, movieId: j['movieId'] as int, add: j['add'] as bool);
}

class SyncQueue {
  static const queueKey = 'sync_queue_v1';
  final KeyValueStore store;
  SyncQueue(this.store);

  Future<List<PendingOp>> pending() async {
    final raw = await store.read(queueKey);
    if (raw == null) return [];
    return (json.decode(raw) as List)
        .map((e) => PendingOp.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> _save(List<PendingOp> ops) =>
      store.write(queueKey, json.encode(ops.map((o) => o.toJson()).toList()));

  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();

    if (ops.any((o) => o.id == op.id)) return;

    final existingIndex = ops.indexWhere((o) => o.movieId == op.movieId);
    if (existingIndex != -1) {
      final existing = ops[existingIndex];
      if (existing.add == op.add) {
        return;
      } else {
        ops.removeAt(existingIndex);
        await _save(ops);
        return;
      }
    }

    ops.add(op);
    await _save(ops);
  }

  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final ops = await pending();
    int count = 0;

    for (final op in List<PendingOp>.from(ops)) {
      try {
        await send(op);
        count++;
        final current = await pending();
        current.removeWhere((o) => o.id == op.id);
        await _save(current);
      } catch (_) {
        break;
      }
    }

    return count;
  }
}
