// lib/widgets/offline_banner.dart
//
// TASK 11: aviso no topo quando NÃO há conexão (rede real OU modo avião simulado).
// O teste está em test/offline_test.dart (NÃO edite).
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/network.dart';

class OfflineBanner extends ConsumerWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final online = ref.watch(onlineProvider);
    if (online) return const SizedBox.shrink(); // online → nada na tela

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      color: Colors.amber.shade800,
      child: const Row(
        children: [
          Icon(Icons.cloud_off, size: 18, color: Colors.white),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'Você está offline — mostrando dados salvos',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
