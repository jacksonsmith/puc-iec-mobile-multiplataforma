
// lib/screens/home_screen.dart
//
// TASK 4 — Contador de favoritos.
// TASK 5 — Botão limpar.
// TASK 11 — Banner offline.
// Integração com MovieList e cache-first.

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
    final favoritesCount = ref.watch(favoritesProvider).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(),

          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Limpar favoritos',
            onPressed: () {
              ref.read(favoritesProvider.notifier).clear();
            },
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text('♥ $favoritesCount'),
            ),
          ),
        ],
      ),
      body: const Column(
        children: [
          OfflineBanner(),
          Expanded(
            child: MovieList(),
          ),
        ],
      ),
    );
  }
}
