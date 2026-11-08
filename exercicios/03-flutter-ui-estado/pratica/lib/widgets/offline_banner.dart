// lib/widgets/offline_banner.dart
//
// TASK 11: aviso no topo quando NÃO há conexão (rede real ou modo avião simulado).

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/network.dart';

class OfflineBanner extends ConsumerWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final online = ref.watch(onlineProvider);

    if (online) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      color: Colors.orange.shade800,
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: const Text(
        'Você está offline — mostrando dados salvos',
        style: TextStyle(color: Colors.white),
        textAlign: TextAlign.center,
      ),
    );
  }
}
