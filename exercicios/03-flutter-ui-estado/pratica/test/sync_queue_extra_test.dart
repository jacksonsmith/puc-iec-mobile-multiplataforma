// Testes extras da SyncQueue (TASK 15) — casos que o offline_test.dart não cobre.
//
// O teste "flush persiste a cada sucesso" do offline_test passa mesmo se o flush só gravar a
// fila no FIM (o `break` leva à gravação final de qualquer jeito). Aqui o `send` olha o que já
// está no armazenamento NO MEIO do flush — é o que sobraria se o app fechasse naquele instante.

import 'package:flutter_test/flutter_test.dart';
import 'package:filmes_flutter/data/key_value_store.dart';
import 'package:filmes_flutter/data/sync_queue.dart';

PendingOp op(String id, int movie, bool add) => PendingOp(id: id, movieId: movie, add: add);

void main() {
  test('flush: no meio do envio, o que já foi enviado já saiu da fila gravada', () async {
    final store = InMemoryStore();
    final q = SyncQueue(store);
    await q.enqueue(op('a', 1, true));
    await q.enqueue(op('b', 2, true));
    await q.enqueue(op('c', 3, true));

    final storedWhenSending = <String, List<String>>{};
    await q.flush((o) async {
      // um "app novo" lendo o armazenamento enquanto `o` está sendo enviado
      storedWhenSending[o.id] = (await SyncQueue(store).pending()).map((p) => p.id).toList();
    });

    expect(storedWhenSending, {
      'a': ['a', 'b', 'c'],
      'b': ['b', 'c'], // 'a' já foi e já saiu da fila gravada
      'c': ['c'],
    });
  });

  test('favoritar → desfavoritar → favoritar de novo, offline: sobra 1 operação (add)', () async {
    final q = SyncQueue(InMemoryStore());
    await q.enqueue(op('a', 1, true));
    await q.enqueue(op('b', 1, false)); // cancela o 'a'
    await q.enqueue(op('c', 1, true)); // fila vazia de novo → entra normalmente

    final ops = await q.pending();
    expect(ops.map((o) => o.id), ['c']);
    expect(ops.single.add, isTrue);
  });
}
