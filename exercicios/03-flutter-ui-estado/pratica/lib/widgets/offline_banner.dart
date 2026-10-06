// lib/widgets/offline_banner.dart
//
// TASK 11: aviso no topo quando NÃO há conexão (rede real caiu OU modo avião ✈️ ligado).
// O `onlineProvider` (pronto, em state/network.dart) já combina as duas coisas; aqui só desenhamos.
//
// O teste está em test/offline_test.dart (NÃO edite).
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../state/network.dart';
import '../theme/app_theme.dart';

class OfflineBanner extends ConsumerWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final online = ref.watch(onlineProvider); // muda → o banner aparece/some sozinho
    if (online) return const SizedBox.shrink(); // online: nada na tela

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(16, 4, 16, 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.amber.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.amber.withValues(alpha: 0.5)),
      ),
      child: const Row(
        children: [
          Icon(Icons.cloud_off_rounded, color: AppColors.amber, size: 20),
          SizedBox(width: 10),
          Expanded(
            // texto EXATO do enunciado (o teste procura por ele) — com travessão, não hífen
            child: Text(
              'Você está offline — mostrando dados salvos',
              style: TextStyle(color: AppColors.amber, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
