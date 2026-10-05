// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 4): contador de favoritos no header.
// Ex2 (TASK 5): botão "limpar" favoritos.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../services/remote_config.dart';
import '../widgets/movie_list.dart';
import '../widgets/offline_banner.dart';
import '../widgets/offline_toggle.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favoriteCount = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(),
          IconButton(
            tooltip: 'Limpar favoritos',
            icon: const Icon(Icons.delete_outline),
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ $favoriteCount')),
          ),
        ],
      ),
      body: Column(
        children: [
          const OfflineBanner(),
          FutureBuilder<String>(
            future: fetchBannerMessage(),
            builder: (context, snapshot) {
              final message = snapshot.data;
              if (message == null || message.isEmpty) {
                return const SizedBox.shrink();
              }
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                child: Text(message),
              );
            },
          ),
          const Expanded(child: MovieList()),
        ],
      ),
    );
  }
}
