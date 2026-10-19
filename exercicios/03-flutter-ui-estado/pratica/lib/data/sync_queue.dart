// lib/data/sync_queue.dart
//
// FILA DE SINCRONIZAÇÃO: escritas feitas offline ficam guardadas e são enviadas na volta da rede.
//
// TASK 15: regras de conflito do enqueue() e flush() tolerante a falha no meio.
// Testes: test/offline_test.dart
import 'dart:convert';
import 'key_value_store.dart';

/// Uma operação pendente: "favoritar" (add=true) ou "desfavoritar" (add=false) um filme.
class PendingOp {
  final String id; // único por operação (ex.: timestamp + movieId)
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

  // ── PRONTO: ler e gravar a fila no armário ───────────────────────────────────────────
  Future<List<PendingOp>> pending() async {
    final raw = await store.read(queueKey);
    if (raw == null) return [];
    return (json.decode(raw) as List)
        .map((e) => PendingOp.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> _save(List<PendingOp> ops) =>
      store.write(queueKey, json.encode(ops.map((o) => o.toJson()).toList()));

  // ── Enfileirar: idempotência + regras de conflito (TASK 15a) ─────────────────────────
  // Invariante: a fila guarda no máximo UMA operação pendente por filme.
  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();

    // idempotente: o mesmo id nunca entra duas vezes.
    if (ops.any((o) => o.id == op.id)) return;

    final i = ops.indexWhere((o) => o.movieId == op.movieId);
    if (i != -1) {
      // mesma ação: já está na fila, nada muda.
      // ação oposta (favoritar e desfavoritar offline): as duas se cancelam e o servidor
      // nem precisa saber.
      if (ops[i].add != op.add) {
        ops.removeAt(i);
        await _save(ops);
      }
      return;
    }

    ops.add(op);
    await _save(ops);
  }

  // ── Flush (TASK 15b) ─────────────────────────────────────────────────────────────────
  // Envia na ordem da fila. Cada sucesso sai da fila e é persistido na hora, então se o app
  // fechar no meio nada é reenviado. No primeiro erro para: o restante fica na fila, na mesma
  // ordem, para a próxima tentativa. O erro não é propagado: devolve quantas foram enviadas.
  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final remaining = await pending();
    var sent = 0;
    while (remaining.isNotEmpty) {
      try {
        await send(remaining.first);
      } catch (_) {
        break;
      }
      remaining.removeAt(0);
      await _save(remaining);
      sent++;
    }
    return sent;
  }
}
