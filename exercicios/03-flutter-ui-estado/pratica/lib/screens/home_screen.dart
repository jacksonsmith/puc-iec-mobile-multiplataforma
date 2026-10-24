// lib/screens/home_screen.dart
//
// A lista já está pronta (usa o MovieCard).
// Ex2 (TASK 5): contador de favoritos no header.
// Ex2 (TASK 6): botão "limpar" favoritos.

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/favorites.dart';
import '../theme/app_theme.dart';
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
            tooltip: 'Limpar favoritos',
            icon: const Icon(Icons.delete_outline),
            onPressed: count == 0 ? null : () => ref.read(favoritesProvider.notifier).clear(),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 4, right: 16),
            child: Center(
              child: Text(
                '♥ $count',
                style: const TextStyle(color: AppColors.rose, fontWeight: FontWeight.w700),
              ),
            ),
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
