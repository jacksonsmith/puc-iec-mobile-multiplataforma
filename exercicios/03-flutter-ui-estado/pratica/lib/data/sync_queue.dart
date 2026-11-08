// lib/data/sync_queue.dart
//
// FILA DE SINCRONIZAÇÃO — escritas feitas offline ficam guardadas e são enviadas na volta da rede.
//
// TASK 15: regras de conflito do enqueue() e o flush().
import 'dart:convert';
import 'key_value_store.dart';

/// Uma operação pendente: "favoritar" (add=true) ou "desfavoritar" (add=false) um filme.
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

  // ── Ler e gravar a fila no armário ───────────────────────────────────────────
  Future<List<PendingOp>> pending() async {
    final raw = await store.read(queueKey);
    if (raw == null) return [];
    return (json.decode(raw) as List)
        .map((e) => PendingOp.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> _save(List<PendingOp> ops) =>
      store.write(queueKey, json.encode(ops.map((o) => o.toJson()).toList()));

  // ── Enfileirar + idempotência + regras de conflito (TASK 15a) ─────────────────
  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();

    // idempotente: o mesmo id nunca entra duas vezes.
    if (ops.any((o) => o.id == op.id)) return;

    // conflito: já existe operação pendente do MESMO filme?
    final i = ops.indexWhere((o) => o.movieId == op.movieId);
    if (i != -1) {
      if (ops[i].add != op.add) {
        // ação oposta → as duas se cancelam
        ops.removeAt(i);
        await _save(ops);
      }
      // mesma ação → já está na fila, nada a fazer
      return;
    }

    ops.add(op); // sem conflito: vai pro fim da fila
    await _save(ops);
  }

  // ── Flush (TASK 15b) ─────────────────────────────────────────────────────────
  // Envia na ordem; a cada sucesso remove e persiste; no 1º erro para (sem propagar).
  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final ops = await pending();
    var sent = 0;

    for (final op in List.of(ops)) {
      try {
        await send(op);
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
