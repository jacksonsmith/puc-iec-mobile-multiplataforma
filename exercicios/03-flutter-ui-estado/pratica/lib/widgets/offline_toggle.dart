import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../state/network.dart';

class OfflineToggle extends ConsumerWidget {
  const OfflineToggle({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final offline = ref.watch(simulatedOfflineProvider);
    return IconButton(
      tooltip: offline ? 'Voltar online' : 'Simular modo avião',
      icon: Icon(offline ? Icons.airplanemode_active : Icons.airplanemode_inactive),
      onPressed: () => ref.read(simulatedOfflineProvider.notifier).toggle(),
    );
  }
}
