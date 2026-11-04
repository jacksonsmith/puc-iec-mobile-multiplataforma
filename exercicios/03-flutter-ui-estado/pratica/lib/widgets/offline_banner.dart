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
      color: Theme.of(context).colorScheme.tertiaryContainer,
      padding: const EdgeInsets.all(8),
      child: Text(
        'Você está offline — mostrando dados salvos',
        textAlign: TextAlign.center,
        style:
            TextStyle(color: Theme.of(context).colorScheme.onTertiaryContainer),
      ),
    );
  }
}
