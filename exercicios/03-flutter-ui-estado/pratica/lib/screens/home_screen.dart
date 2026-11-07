// lib/screens/home_screen.dart
//
// Ex2 (TASK 5): contador de favoritos no header.
// Ex2 (TASK 6): botão "limpar" favoritos.
// Ex5 (TASK 8): banner com Remote Config.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/remote_config.dart';
import '../state/favorites.dart';
import '../widgets/movie_list.dart';
import '../widgets/offline_banner.dart';
import '../widgets/offline_toggle.dart';

/// Mensagem do banner vinda do Remote Config (buscada 1x por execução do app).
final bannerMessageProvider = FutureProvider<String>((ref) => fetchBannerMessage());

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favCount = ref.watch(favoritesProvider).length;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(), // modo avião simulado (pronto)
          IconButton(
            tooltip: 'Limpar favoritos',
            icon: const Icon(Icons.delete_outline),
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ $favCount')),
          ),
        ],
      ),
      body: const Column(
        children: [
          OfflineBanner(), // TASK 11 — aviso de offline
          _RemoteBanner(), // TASK 8 — texto controlado pelo Remote Config
          Expanded(child: MovieList()), // lista vinda do repositório (cache-first)
        ],
      ),
    );
  }
}

class _RemoteBanner extends ConsumerWidget {
  const _RemoteBanner();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final message = ref.watch(bannerMessageProvider).valueOrNull;
    if (message == null || message.isEmpty) return const SizedBox.shrink();
    final scheme = Theme.of(context).colorScheme;
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(12, 12, 12, 0),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: scheme.primaryContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(Icons.campaign_outlined, color: scheme.onPrimaryContainer),
          const SizedBox(width: 10),
          Expanded(
            child: Text(message, style: TextStyle(color: scheme.onPrimaryContainer)),
          ),
        ],
      ),
    );
  }
}
