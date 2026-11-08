// lib/data/sync_queue.dart
//
// FILA DE SINCRONIZAÇÃO — escritas feitas offline ficam guardadas e são enviadas na volta da rede.
//
// TASK 15 (🧑‍💻 EM CASA · 🔴 DIFÍCIL): complete as regras de conflito do enqueue() e o flush().
// A persistência e a idempotência já estão prontas — o desafio é o RACIOCÍNIO (conflitos e falha no meio).
// Os testes estão em test/offline_test.dart (NÃO edite).
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

  // ── PRONTO: enfileirar + idempotência. VOCÊ completa as REGRAS DE CONFLITO (TASK 15a) ─────
  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();

    // (pronto) idempotente: o mesmo id nunca entra duas vezes.
    if (ops.any((o) => o.id == op.id)) return;

    // TASK 15a · REGRAS DE CONFLITO:
    // mesma ação no mesmo filme → já está na fila, não duplica;
    // ação oposta no mesmo filme → as duas se cancelam (remove a antiga, não enfileira a nova).
    final existingIndex = ops.indexWhere((o) => o.movieId == op.movieId);
    if (existingIndex >= 0) {
      final existing = ops[existingIndex];
      if (existing.add == op.add) return;
      ops.removeAt(existingIndex);
      await _save(ops);
      return;
    }

    ops.add(op); // (pronto) sem conflito: vai pro fim da fila
    await _save(ops);
  }

  // ── TASK 15b — flush (🧑‍💻 EM CASA · difícil, parte 2) ─────────────────────────────────
  // Envia na ORDEM; a cada sucesso remove + persiste; no primeiro erro para e não propaga.
  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final ops = await pending();
    var sent = 0;

    for (final op in ops) {
      try {
        await send(op);
      } catch (_) {
        break; // resto continua na fila, na mesma ordem
      }
      sent++;
      await _save(ops.sublist(sent)); // persistência a cada sucesso
    }

    return sent;
  }
}
