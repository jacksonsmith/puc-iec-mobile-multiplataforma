
// lib/data/sync_queue.dart
//
// TASK 15 — Fila de sincronização offline.
// Implementação das regras de conflito e envio das operações.

import 'dart:convert';
import 'key_value_store.dart';

/// Operação pendente: favoritar ou desfavoritar um filme.
class PendingOp {
  final String id;
  final int movieId;
  final bool add;

  const PendingOp({
    required this.id,
    required this.movieId,
    required this.add,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'movieId': movieId,
        'add': add,
      };

  factory PendingOp.fromJson(Map<String, dynamic> j) => PendingOp(
        id: j['id'] as String,
        movieId: j['movieId'] as int,
        add: j['add'] as bool,
      );
}

class SyncQueue {
  static const queueKey = 'sync_queue_v1';

  final KeyValueStore store;

  SyncQueue(this.store);

  // Recupera as operações pendentes.
  Future<List<PendingOp>> pending() async {
    final raw = await store.read(queueKey);

    if (raw == null) return [];

    return (json.decode(raw) as List)
        .map(
          (e) => PendingOp.fromJson(
            e as Map<String, dynamic>,
          ),
        )
        .toList();
  }

  // Persiste a fila no armazenamento local.
  Future<void> _save(List<PendingOp> ops) {
    return store.write(
      queueKey,
      json.encode(
        ops.map((o) => o.toJson()).toList(),
      ),
    );
  }

  // TASK 15a — Enfileiramento e regras de conflito.
  Future<void> enqueue(PendingOp op) async {
    final ops = await pending();

    // Idempotência: o mesmo ID não entra duas vezes.
    if (ops.any((o) => o.id == op.id)) return;

    // Procura uma operação pendente para o mesmo filme.
    final index = ops.indexWhere(
      (o) => o.movieId == op.movieId,
    );

    if (index != -1) {
      final existing = ops[index];

      // Mesma ação: não duplica.
      if (existing.add == op.add) {
        return;
      }

      // Ações opostas: cancelam uma à outra.
      ops.removeAt(index);
      await _save(ops);
      return;
    }

    // Sem conflito: adiciona ao final da fila.
    ops.add(op);
    await _save(ops);
  }

  // TASK 15b — Envia as operações pendentes na ordem.
  Future<int> flush(
    Future<void> Function(PendingOp op) send,
  ) async {
    final ops = await pending();
    var sentCount = 0;

    // Percorre uma cópia da fila para manter a ordem.
    for (final op in List<PendingOp>.from(ops)) {
      try {
        // Envia a operação ao servidor.
        await send(op);

        // Remove somente depois do envio bem-sucedido.
        ops.removeWhere((pending) => pending.id == op.id);

        // Persiste imediatamente a fila atualizada.
        await _save(ops);

        sentCount++;
      } catch (_) {
        // Para no primeiro erro sem descartar o restante.
        break;
      }
    }

    // Quantidade enviada com sucesso.
    return sentCount;
  }
}
