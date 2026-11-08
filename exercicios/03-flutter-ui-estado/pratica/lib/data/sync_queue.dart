// lib/data/sync_queue.dart
//
// FILA DE SINCRONIZAÇÃO — escritas feitas offline ficam guardadas e são enviadas na volta da rede.
//
// TASK 15: regras de conflito do enqueue() e o flush() (na ordem, parando no 1º erro).
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

  // ── enfileirar: idempotência (pronto) + REGRAS DE CONFLITO (TASK 15a) ──────────────────────
  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();

    // (pronto) idempotente: o mesmo id nunca entra duas vezes.
    if (ops.any((o) => o.id == op.id)) return;

    // ── TASK 15a · REGRAS DE CONFLITO ─────────────────────────────────────────────────────
    // A fila guarda no máximo UMA operação pendente por filme.
    final i = ops.indexWhere((o) => o.movieId == op.movieId);
    if (i >= 0) {
      // mesma ação (add+add ou remove+remove) → já está na fila, nada muda.
      if (ops[i].add == op.add) return;
      // ação oposta (add × remove) → as duas se cancelam: o servidor nem precisa saber.
      ops.removeAt(i);
      await _save(ops);
      return;
    }

    ops.add(op); // (pronto) sem conflito: vai pro fim da fila
    await _save(ops);
  }

  // ── TASK 15b — flush ──────────────────────────────────────────────────────────────────
  // Envia na ORDEM da fila. A cada sucesso remove E persiste (se o app fechar no meio, o que já
  // foi não é reenviado). No PRIMEIRO erro para: o resto fica na fila, na mesma ordem, e o erro
  // não sobe (é só "ainda sem rede" — tenta de novo no próximo flush). Devolve quantas foram.
  Future<int> flush(Future<void> Function(PendingOp op) send) async {
    final ops = await pending();
    var sent = 0;
    for (final op in List.of(ops)) {
      try {
        await send(op);
      } catch (_) {
        break;
      }
      ops.remove(op);
      sent++;
      await _save(ops);
    }
    return sent;
  }
}
