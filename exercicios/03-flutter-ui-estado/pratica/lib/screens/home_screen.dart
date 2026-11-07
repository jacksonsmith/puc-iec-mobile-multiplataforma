// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 4): contador de favoritos no header.
// Ex2 (TASK 5): botão "limpar" favoritos.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../widgets/movie_list.dart';
import '../widgets/offline_banner.dart';
import '../widgets/offline_toggle.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Mesma fonte de verdade do card — sem prop drilling.
    final favorites = ref.watch(favoritesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(),
          // ── Ex2 · TASK 5 — botão "limpar" favoritos ─────────────────────────────
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Limpar favoritos',
            onPressed: () => ref.read(favoritesProvider.notifier).clear(),
          ),
          // ── Ex2 · TASK 4 — contador de favoritos ───────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(child: Text('♥ ${favorites.length}')),
          ),
        ],
      ),
      body: const Column(
        children: [
          OfflineBanner(),
          Expanded(child: MovieList()),
        ],
      ),
    );
  }
}
