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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Filmes'),
        actions: [
          const OfflineToggle(), // modo avião simulado (pronto)
          IconButton(
              icon: const Icon(Icons.delete_outline),
              tooltip: 'Limpar favoritos',
              onPressed: () => ref.read(favoritesProvider.notifier).clear()),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child:
                Center(child: Text('♥ ${ref.watch(favoritesProvider).length}')),
          ),
        ],
      ),
      body: Column(
        children: const [
          OfflineBanner(),
          Expanded(
              child: MovieList()), // lista vinda do repositório (cache-first)
        ],
      ),
    );
  }
}
