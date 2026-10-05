import 'dart:convert';

import 'key_value_store.dart';

class PendingOp {
  final String id;
  final int movieId;
  final bool add;

  const PendingOp({required this.id, required this.movieId, required this.add});

  Map<String, dynamic> toJson() => {'id': id, 'movieId': movieId, 'add': add};

  factory PendingOp.fromJson(Map<String, dynamic> json) => PendingOp(
        id: json['id'] as String,
        movieId: json['movieId'] as int,
        add: json['add'] as bool,
      );
}

class SyncQueue {
  static const queueKey = 'sync_queue_v1';
  final KeyValueStore store;

  SyncQueue(this.store);

  Future<List<PendingOp>> pending() async {
    final raw = await store.read(queueKey);
    if (raw == null) return [];
    return (jsonDecode(raw) as List<dynamic>)
        .map((entry) => PendingOp.fromJson(entry as Map<String, dynamic>))
        .toList();
  }

  Future<void> _save(List<PendingOp> ops) => store.write(
        queueKey,
        jsonEncode(ops.map((operation) => operation.toJson()).toList()),
      );

  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();
    if (ops.any((queued) => queued.id == op.id)) return;

    final conflictIndex = ops.indexWhere((queued) => queued.movieId == op.movieId);
    if (conflictIndex >= 0) {
      final existing = ops[conflictIndex];
      if (existing.add != op.add) {
        ops.removeAt(conflictIndex);
        await _save(ops);
      }
      return;
    }

    ops.add(op);
    await _save(ops);
  }

  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final ops = await pending();
    var sent = 0;
    for (final operation in List<PendingOp>.of(ops)) {
      try {
        await send(operation);
      } catch (_) {
        break;
      }
      ops.removeWhere((queued) => queued.id == operation.id);
      await _save(ops);
      sent++;
    }
    return sent;
  }
}
