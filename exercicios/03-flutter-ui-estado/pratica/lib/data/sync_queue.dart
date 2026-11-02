import 'dart:convert';
import 'key_value_store.dart';

class PendingOp {
  final String id; // único por operação (ex.: timestamp + movieId)
  final int movieId;
  final bool add;
  const PendingOp({required this.id, required this.movieId, required this.add});

  Map<String, dynamic> toJson() => {'id': id, 'movieId': movieId, 'add': add};
  factory PendingOp.fromJson(Map<String, dynamic> j) => PendingOp(
      id: j['id'] as String,
      movieId: j['movieId'] as int,
      add: j['add'] as bool);
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

    final index = ops.indexWhere((o) => o.movieId == op.movieId);
    if (index != -1) {
      if (ops[index].add != op.add) {
        ops.removeAt(index);
        await _save(ops);
      }
      return;
    }

    ops.add(op); // (pronto) sem conflito: vai pro fim da fila
    await _save(ops);
  }

  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final ops = await pending();
    var sent = 0;
    while (ops.isNotEmpty) {
      try {
        await send(ops.first);
      } catch (_) {
        break;
      }
      ops.removeAt(0);
      await _save(ops);
      sent++;
    }
    return sent;
  }
}
