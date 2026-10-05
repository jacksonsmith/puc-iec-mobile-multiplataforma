// lib/screens/home_screen.dart
//
// Ex2 (TASK 5): contador de favoritos no header.
// Ex2 (TASK 6): botão "limpar" favoritos.
// Ex5 (TASK 8): banner com Remote Config.

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
    final count = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ $count')),
          ),
        ],
      ),
      body: Column(
        children: [
          const OfflineBanner(),
          FutureBuilder<String>(
            future: fetchBannerMessage(),
            builder: (context, snapshot) {
              if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const SizedBox.shrink();
              }
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8),
                color: Colors.deepPurple.withAlpha(50),
                child: Text(
                  snapshot.data!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              );
            },
          ),
          const Expanded(child: MovieList()),
        ],
      ),
    );
  }
}
